<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class UrlListingTextExtractor
{
    public function extract(string $url): string
    {
        $this->ensurePublicHttpUrl($url);

        try {
            $response = Http::accept('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
                ->withUserAgent('Mozilla/5.0 (compatible; AkbulutEmlakImporter/1.0; +https://akbulutemlakinsaat.com)')
                ->timeout(25)
                ->connectTimeout(8)
                ->retry(1, 500)
                ->get($url)
                ->throw();
        } catch (ConnectionException $exception) {
            throw new RuntimeException('Ilan linkine ulasilamadi. Portal erisimi engelliyor olabilir; PDF ile aktarimi deneyin.', previous: $exception);
        } catch (RequestException $exception) {
            throw new RuntimeException('Ilan linki okunamadi. Portal sayfayi engelliyor olabilir; PDF ile aktarimi deneyin.', previous: $exception);
        }

        $text = $this->htmlToText($response->body());

        if (mb_strlen($text, 'UTF-8') < 120) {
            throw new RuntimeException('Linkten yeterli ilan metni okunamadi. Sahibinden gibi portallar bazen link okumayi engeller; PDF ile aktarimi deneyin.');
        }

        return mb_substr($text, 0, 45000, 'UTF-8');
    }

    private function ensurePublicHttpUrl(string $url): void
    {
        $parts = parse_url($url);
        $scheme = mb_strtolower((string) ($parts['scheme'] ?? ''), 'UTF-8');
        $host = (string) ($parts['host'] ?? '');

        if (! in_array($scheme, ['http', 'https'], true) || $host === '') {
            throw new RuntimeException('Sadece http veya https ilan linkleri desteklenir.');
        }

        $ips = gethostbynamel($host) ?: [];

        if ($ips === []) {
            throw new RuntimeException('Ilan linkinin alan adi cozumlenemedi.');
        }

        foreach ($ips as $ip) {
            if (! filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                throw new RuntimeException('Bu link guvenlik nedeniyle okunamaz.');
            }
        }
    }

    private function htmlToText(string $html): string
    {
        $html = preg_replace('/<script\b[^>]*>.*?<\/script>/is', ' ', $html) ?? $html;
        $html = preg_replace('/<style\b[^>]*>.*?<\/style>/is', ' ', $html) ?? $html;
        $html = preg_replace('/<noscript\b[^>]*>.*?<\/noscript>/is', ' ', $html) ?? $html;
        $html = preg_replace('/<(br|p|li|tr|div|section|article|h[1-6])\b[^>]*>/i', "\n", $html) ?? $html;
        $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace('/[ \t]+/u', ' ', $text) ?? $text;
        $text = preg_replace('/\n{2,}/u', "\n", $text) ?? $text;

        return trim($text);
    }
}
