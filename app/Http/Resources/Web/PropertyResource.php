<?php

namespace App\Http\Resources\Web;

use App\Support\Listings\ListingTaxonomy;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $city = ($this->relationLoaded('cityRecord')
            ? $this->cityRecord?->name
            : null) ?? $this->city;
        $district = ($this->relationLoaded('districtRecord')
            ? $this->districtRecord?->name
            : null) ?? $this->district;
        $neighborhood = ($this->relationLoaded('neighborhoodRecord')
            ? $this->neighborhoodRecord?->name
            : null) ?? $this->neighborhood;

        return [
            'id' => $this->id,
            'listingNo' => $this->ilan_no,
            'listingDate' => $this->ilan_tarihi?->format('d.m.Y'),
            'updatedDate' => $this->updated_at?->format('d.m.Y'),
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'address' => $this->address,
            'location' => collect([$city, $district, $neighborhood])->filter()->join(', '),
            'neighborhood' => $neighborhood,
            'district' => $district,
            'city' => $city,
            'type' => ListingTaxonomy::propertyTypeLabel($this->property_type),
            'status' => ListingTaxonomy::listingTypeLabel($this->listing_type),
            'area' => $this->square_meters,
            'rooms' => $this->room_count,
            'baths' => $this->bathroom_count ?? 0,
            'image' => $this->images?->first()?->image_url ?? '/placeholder-property.jpg',
            'gallery' => $this->images?->map(fn ($image) => $image->image_url)->toArray() ?? [],
            'featured' => $this->featured,
            'features' => $this->features(),
            'specifications' => $this->specifications(),
            'advisor' => [
                'id' => $this->consultant?->id,
                'slug' => $this->consultant?->slug,
                'name' => trim(($this->consultant?->name ?? '').' '.($this->consultant?->surname ?? '')) ?: 'Akbulut Emlak',
                'title' => $this->consultant?->title,
                'email' => $this->consultant?->email,
                'phone' => $this->consultant?->phone,
                'avatar' => $this->consultant?->avatar,
                'url' => $this->consultant?->slug
                    ? route('consultants.show', ['consultant' => $this->consultant->slug])
                    : null,
            ],
        ];
    }

    /**
     * @return array<int, string>
     */
    private function features(): array
    {
        return collect([
            $this->balcony ? 'Balkon' : null,
            $this->furnished ? 'Esyali' : null,
            $this->credit_eligible ? 'Krediye uygun' : null,
            $this->heating ? "Isitma: {$this->heating}" : null,
            $this->usage_status ? "Kullanim: {$this->usage_status}" : null,
            $this->deed_status ? "Tapu: {$this->deed_status}" : null,
        ])->filter()->values()->all();
    }

    /**
     * @return array<int, array{label: string, value: string}>
     */
    private function specifications(): array
    {
        return [
            ['label' => 'Ilan No', 'value' => $this->stringOrDefault($this->ilan_no)],
            ['label' => 'Ilan Tarihi', 'value' => $this->stringOrDefault($this->ilan_tarihi?->format('d.m.Y'))],
            ['label' => 'Emlak Tipi', 'value' => $this->stringOrDefault(ListingTaxonomy::propertyTypeLabel($this->property_type))],
            ['label' => 'm² (Brut)', 'value' => $this->numericOrDefault($this->brut_m2)],
            ['label' => 'm² (Net)', 'value' => $this->numericOrDefault($this->net_m2)],
            ['label' => 'Oda Sayisi', 'value' => $this->stringOrDefault($this->room_count)],
            ['label' => 'Bina Yasi', 'value' => $this->stringOrDefault($this->building_age)],
            ['label' => 'Bulundugu Kat', 'value' => $this->stringOrDefault($this->floor)],
            ['label' => 'Kat Sayisi', 'value' => $this->numericOrDefault($this->total_floors)],
            ['label' => 'Isitma', 'value' => $this->stringOrDefault($this->heating)],
            ['label' => 'Banyo Sayisi', 'value' => $this->numericOrDefault($this->bathroom_count)],
            ['label' => 'Mutfak', 'value' => $this->stringOrDefault($this->mutfak)],
            ['label' => 'Balkon', 'value' => $this->booleanLabel($this->balcony, 'Yok')],
            ['label' => 'Asansor', 'value' => $this->booleanLabel($this->asansor, 'Yok')],
            ['label' => 'Otopark', 'value' => $this->booleanLabel($this->otopark, 'Yok')],
            ['label' => 'Esyali', 'value' => $this->booleanLabel($this->furnished, 'Hayir')],
            ['label' => 'Kullanim Durumu', 'value' => $this->stringOrDefault($this->usage_status)],
            ['label' => 'Site Icerisinde', 'value' => $this->booleanLabel($this->site_icerisinde, 'Hayir')],
            ['label' => 'Site Adi', 'value' => $this->stringOrDefault($this->site_adi)],
            ['label' => 'Aidat (TL)', 'value' => $this->numericOrDefault($this->aidat)],
            ['label' => 'Krediye Uygun', 'value' => $this->booleanLabel($this->credit_eligible, 'Hayir')],
            ['label' => 'Enerji Kimlik Belgesi', 'value' => $this->stringOrDefault($this->enerji_kimlik_belgesi)],
            ['label' => 'Tapu Durumu', 'value' => $this->stringOrDefault($this->deed_status)],
            ['label' => 'Kimden', 'value' => $this->stringOrDefault($this->kimden)],
            ['label' => 'Takas', 'value' => $this->booleanLabel($this->takas, 'Hayir')],
        ];
    }

    private function stringOrDefault(mixed $value): string
    {
        if (! is_string($value) || trim($value) === '') {
            return 'Belirtilmemis';
        }

        return $value;
    }

    private function numericOrDefault(mixed $value): string
    {
        if ($value === null || $value === '') {
            return 'Belirtilmemis';
        }

        return (string) $value;
    }

    private function booleanLabel(?bool $value, string $falseLabel): string
    {
        if ($value === null) {
            return 'Belirtilmemis';
        }

        return $value ? 'Var' : $falseLabel;
    }
}
