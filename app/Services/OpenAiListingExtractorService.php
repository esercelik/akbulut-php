<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiListingExtractorService
{
    /**
     * @return array<string, mixed>
     */
    public function extract(string $pdfText): array
    {
        $apiKey = config('services.openai.api_key');

        if (! is_string($apiKey) || trim($apiKey) === '') {
            throw new RuntimeException('OpenAI API anahtari tanimli degil.');
        }

        try {
            $response = Http::withToken($apiKey)
                ->asJson()
                ->acceptJson()
                ->timeout((int) config('services.openai.timeout', 60))
                ->connectTimeout(10)
                ->retry(2, 500)
                ->post('https://api.openai.com/v1/responses', [
                    'model' => config('services.openai.model', 'gpt-4.1-mini'),
                    'input' => [
                        [
                            'role' => 'system',
                            'content' => 'Sen Türkçe emlak ilan PDF’lerinden yapılandırılmış ilan verisi çıkaran bir asistansın. Sadece verilen PDF metnine dayan. Bilgi yoksa uydurma. Cevabı sadece geçerli JSON olarak döndür.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $this->userPrompt($pdfText),
                        ],
                    ],
                    'text' => [
                        'format' => [
                            'type' => 'json_schema',
                            'name' => 'listing_pdf_import',
                            'strict' => true,
                            'schema' => $this->schema(),
                        ],
                    ],
                ])
                ->throw();
        } catch (ConnectionException $exception) {
            throw new RuntimeException('OpenAI yanit vermedi. Lutfen tekrar deneyin.', previous: $exception);
        } catch (RequestException $exception) {
            throw new RuntimeException('OpenAI analizi tamamlanamadi.', previous: $exception);
        }

        return $this->normalize($this->decodeJsonResponse($response->json()));
    }

    private function userPrompt(string $pdfText): string
    {
        return <<<'PROMPT'
Aşağıdaki PDF metninden ilan bilgilerini çıkar ve istenen JSON şemasına göre döndür.

Kurallar:
- Sadece gerçek PDF metninde geçen bilgileri çıkar.
- Emin olmadığın alanları uydurma; boş string veya null kullan.
- listing_type alanı mümkünse şu kodlardan biri olsun: SALE, RENT, TRANSFER_SALE, TRANSFER_RENT, BUILD_FOR_SALE.
- property_type alanı mümkünse şu kodlardan biri olsun: APARTMENT, RESIDENCE, DETACHED_HOUSE, VILLA, FARMHOUSE, MANSION, WATERSIDE, WATERSIDE_APARTMENT, SUMMER_HOUSE, COOPERATIVE, OFFICE, SHOP, STORE, PLAZA, WAREHOUSE, FACTORY, WORKSHOP, CAFE_RESTAURANT, LAND, LAND_ZONED, FIELD, VINEYARD, GARDEN, FARM, PARCEL, BUILDING, APARTMENT_BUILDING, COMMERCIAL_BUILDING, DETACHED_BUILDING, TIMESHARE, HOTEL, BOUTIQUE_HOTEL, APART_HOTEL, PENSION, TOURISTIC_FACILITY.
- Fiyatı sayı olarak döndür. Örnek: "8.450.000 TL" -> 8450000.
- m² değerlerini sayı olarak döndür.
- Oda sayısını "3+1", "2+1", "1+1" gibi koru.
- Özellikleri array olarak döndür, en fazla 15 öğe.
- Sahibinden, Hepsiemlak, Emlakjet gibi kaynak anlaşılabiliyorsa source_portal alanına yaz.
- İlan numarası varsa source_listing_no alanına yaz.
- Telefon numarası varsa +90 formatına yakın normalize et.
- Türkçe karakterleri koru.
- Açıklamayı temiz, okunabilir Türkçe olarak döndür ama ilanda olmayan bilgi ekleme.

PDF METNİ:
PROMPT."\n\n".$pdfText;
    }

    /**
     * @return array<string, mixed>
     */
    private function schema(): array
    {
        return [
            'type' => 'object',
            'additionalProperties' => false,
            'required' => [
                'title',
                'description',
                'price',
                'currency',
                'listing_type',
                'property_type',
                'city',
                'district',
                'neighborhood',
                'address',
                'gross_m2',
                'net_m2',
                'land_m2',
                'room_count',
                'building_age',
                'floor',
                'total_floors',
                'heating',
                'bathroom_count',
                'balcony',
                'furnished',
                'site_name',
                'dues',
                'credit_eligible',
                'deed_status',
                'exchange',
                'features',
                'contact_name',
                'contact_phone',
                'source_portal',
                'source_listing_no',
                'confidence',
                'missing_fields',
            ],
            'properties' => [
                'title' => ['type' => 'string'],
                'description' => ['type' => 'string'],
                'price' => ['type' => ['integer', 'null']],
                'currency' => ['type' => 'string'],
                'listing_type' => ['type' => 'string'],
                'property_type' => ['type' => 'string'],
                'city' => ['type' => 'string'],
                'district' => ['type' => 'string'],
                'neighborhood' => ['type' => 'string'],
                'address' => ['type' => 'string'],
                'gross_m2' => ['type' => ['integer', 'null']],
                'net_m2' => ['type' => ['integer', 'null']],
                'land_m2' => ['type' => ['integer', 'null']],
                'room_count' => ['type' => 'string'],
                'building_age' => ['type' => 'string'],
                'floor' => ['type' => 'string'],
                'total_floors' => ['type' => 'string'],
                'heating' => ['type' => 'string'],
                'bathroom_count' => ['type' => ['integer', 'null']],
                'balcony' => ['type' => ['boolean', 'null']],
                'furnished' => ['type' => ['boolean', 'null']],
                'site_name' => ['type' => 'string'],
                'dues' => ['type' => ['integer', 'null']],
                'credit_eligible' => ['type' => ['boolean', 'null']],
                'deed_status' => ['type' => 'string'],
                'exchange' => ['type' => ['boolean', 'null']],
                'features' => [
                    'type' => 'array',
                    'maxItems' => 15,
                    'items' => ['type' => 'string'],
                ],
                'contact_name' => ['type' => 'string'],
                'contact_phone' => ['type' => 'string'],
                'source_portal' => ['type' => 'string'],
                'source_listing_no' => ['type' => 'string'],
                'confidence' => [
                    'type' => 'object',
                    'additionalProperties' => false,
                    'required' => ['title', 'price', 'location', 'm2', 'contact'],
                    'properties' => [
                        'title' => ['type' => 'number', 'minimum' => 0, 'maximum' => 1],
                        'price' => ['type' => 'number', 'minimum' => 0, 'maximum' => 1],
                        'location' => ['type' => 'number', 'minimum' => 0, 'maximum' => 1],
                        'm2' => ['type' => 'number', 'minimum' => 0, 'maximum' => 1],
                        'contact' => ['type' => 'number', 'minimum' => 0, 'maximum' => 1],
                    ],
                ],
                'missing_fields' => [
                    'type' => 'array',
                    'items' => ['type' => 'string'],
                ],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>|null  $payload
     * @return array<string, mixed>
     */
    private function decodeJsonResponse(?array $payload): array
    {
        $text = $this->outputText($payload ?? []);

        if ($text === '') {
            throw new RuntimeException('PDF okunabildi ancak ilan bilgileri ayrıştırılamadı.');
        }

        $decoded = json_decode($text, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('PDF okunabildi ancak ilan bilgileri ayrıştırılamadı.');
        }

        return $decoded;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function outputText(array $payload): string
    {
        if (is_string($payload['output_text'] ?? null)) {
            return trim($payload['output_text']);
        }

        foreach (($payload['output'] ?? []) as $output) {
            foreach (($output['content'] ?? []) as $content) {
                if (is_string($content['text'] ?? null)) {
                    return trim($content['text']);
                }
            }
        }

        return '';
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalize(array $data): array
    {
        $defaults = [
            'title' => '',
            'description' => '',
            'price' => null,
            'currency' => 'TRY',
            'listing_type' => '',
            'property_type' => '',
            'city' => '',
            'district' => '',
            'neighborhood' => '',
            'address' => '',
            'gross_m2' => null,
            'net_m2' => null,
            'land_m2' => null,
            'room_count' => '',
            'building_age' => '',
            'floor' => '',
            'total_floors' => '',
            'heating' => '',
            'bathroom_count' => null,
            'balcony' => null,
            'furnished' => null,
            'site_name' => '',
            'dues' => null,
            'credit_eligible' => null,
            'deed_status' => '',
            'exchange' => null,
            'features' => [],
            'contact_name' => '',
            'contact_phone' => '',
            'source_portal' => '',
            'source_listing_no' => '',
            'confidence' => [
                'title' => 0,
                'price' => 0,
                'location' => 0,
                'm2' => 0,
                'contact' => 0,
            ],
            'missing_fields' => [],
        ];

        $data = array_replace_recursive($defaults, Arr::only($data, array_keys($defaults)));

        foreach (['title', 'description', 'currency', 'listing_type', 'property_type', 'city', 'district', 'neighborhood', 'address', 'room_count', 'building_age', 'floor', 'total_floors', 'heating', 'site_name', 'deed_status', 'contact_name', 'contact_phone', 'source_portal', 'source_listing_no'] as $key) {
            $data[$key] = $this->sanitizeString($data[$key] ?? '');
        }

        foreach (['price', 'gross_m2', 'net_m2', 'land_m2', 'bathroom_count', 'dues'] as $key) {
            $data[$key] = $this->normalizeNumber($data[$key] ?? null);
        }

        foreach (['balcony', 'furnished', 'credit_eligible', 'exchange'] as $key) {
            $data[$key] = $this->normalizeBoolean($data[$key] ?? null);
        }

        $data['features'] = collect($data['features'])
            ->filter(fn (mixed $feature): bool => is_string($feature) && trim($feature) !== '')
            ->map(fn (string $feature): string => $this->sanitizeString($feature))
            ->unique()
            ->take(15)
            ->values()
            ->all();

        $data['missing_fields'] = collect($data['missing_fields'])
            ->filter(fn (mixed $field): bool => is_string($field) && trim($field) !== '')
            ->map(fn (string $field): string => $this->sanitizeString($field))
            ->unique()
            ->values()
            ->all();

        foreach (['title', 'price', 'location', 'm2', 'contact'] as $key) {
            $data['confidence'][$key] = max(0, min(1, (float) ($data['confidence'][$key] ?? 0)));
        }

        return $data;
    }

    private function sanitizeString(mixed $value): string
    {
        if (! is_scalar($value)) {
            return '';
        }

        return trim(strip_tags((string) $value));
    }

    private function normalizeNumber(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_int($value)) {
            return $value;
        }

        if (is_float($value)) {
            return (int) round($value);
        }

        $digits = preg_replace('/[^\d]/', '', (string) $value);

        return $digits === '' ? null : (int) $digits;
    }

    private function normalizeBoolean(mixed $value): ?bool
    {
        if (is_bool($value) || $value === null) {
            return $value;
        }

        $normalized = mb_strtolower(trim((string) $value), 'UTF-8');

        if (in_array($normalized, ['1', 'true', 'evet', 'var', 'uygun'], true)) {
            return true;
        }

        if (in_array($normalized, ['0', 'false', 'hayir', 'hayır', 'yok', 'degil', 'değil'], true)) {
            return false;
        }

        return null;
    }
}
