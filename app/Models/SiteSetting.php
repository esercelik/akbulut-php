<?php

namespace App\Models;

use App\Support\SiteSettingsData;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

#[Fillable([
    'site_name',
    'phone',
    'whatsapp',
    'email',
    'address',
    'logo',
    'favicon',
    'hero_title',
    'hero_subtitle',
    'hero_button_text',
    'hero_button_link',
    'about_title',
    'about_text',
    'footer_text',
    'seo_title',
    'seo_description',
    'seo_keywords',
    'og_image',
    'instagram_url',
    'facebook_url',
    'youtube_url',
    'linkedin_url',
    'stat_sales_count',
    'stat_sales_label',
    'stat_portfolio_count',
    'stat_portfolio_label',
    'stat_experience_count',
    'stat_experience_label',
    'stat_satisfaction_count',
    'stat_satisfaction_label',
])]
#[Hidden(['created_at', 'updated_at'])]
class SiteSetting extends Model
{
    protected $appends = ['logo_url', 'favicon_url', 'og_image_url'];

    public const CACHE_KEY = 'site_settings.current';

    /**
     * @return array<string, string>
     */
    public static function defaults(): array
    {
        return [
            'site_name' => 'Akbulut Emlak',
            'phone' => config('contact.phone', '+90 212 000 00 00'),
            'whatsapp' => config('contact.whatsapp', '+90 532 000 00 00'),
            'email' => config('contact.email', 'info@akbulutemlak.com'),
            'address' => config('contact.address', 'Levent Mah. Buyukdere Cad. No: 120, Istanbul'),
            'logo' => '',
            'favicon' => '',
            'hero_title' => 'Gayrimenkulde Guven, Deger ve Profesyonellik',
            'hero_subtitle' => 'Satilik, kiralik ve yatirim odakli seckin gayrimenkuller icin veriye dayali ve kurumsal danismanlik deneyimi.',
            'hero_button_text' => 'Ilanlari Incele',
            'hero_button_link' => '/listings',
            'about_title' => 'Premium gayrimenkul danismanliginda guvenilir is ortaginiz',
            'about_text' => 'Akbulut Emlak, konut ve ticari portfoylerde yuksek standartli sunum, dogru degerleme yaklasimi ve seffaf surec yonetimiyle hizmet verir.',
            'footer_text' => 'Seckin konut ve ticari portfoylerde, guven veren surec yonetimi ve bolgesel piyasa uzmanligiyla yaninizdayiz.',
            'seo_title' => 'Akbulut Emlak',
            'seo_description' => 'Akbulut Emlak satilik, kiralik ve yatirim odakli premium gayrimenkul danismanligi sunar.',
            'seo_keywords' => 'akbulut emlak, satilik daire, kiralik daire, gayrimenkul, emlak danismani, kocaeli emlak',
            'og_image' => '',
            'instagram_url' => '',
            'facebook_url' => '',
            'youtube_url' => '',
            'linkedin_url' => '',
            'stat_sales_count' => '500+',
            'stat_sales_label' => 'Basarili satis ve kiralama',
            'stat_portfolio_count' => '120+',
            'stat_portfolio_label' => 'Aktif ve dogrulanmis portfoy',
            'stat_experience_count' => '15+',
            'stat_experience_label' => 'Yillik sektor deneyimi',
            'stat_satisfaction_count' => '98%',
            'stat_satisfaction_label' => 'Musteri memnuniyeti',
        ];
    }

    public static function current(): self
    {
        if (! Schema::hasTable('site_settings')) {
            return (new self)->forceFill(self::defaults());
        }

        $cachedId = Cache::get(self::CACHE_KEY);

        if (is_int($cachedId) || ctype_digit((string) $cachedId)) {
            $cachedSetting = self::query()->find((int) $cachedId);

            if ($cachedSetting) {
                return $cachedSetting;
            }
        }

        $setting = Cache::rememberForever(self::CACHE_KEY, function (): int {
            $setting = self::query()->first();

            if (! $setting) {
                $setting = new self;
                $setting->forceFill(self::defaults());
                $setting->save();
            }

            return (int) $setting->getKey();
        });

        return self::query()->find((int) $setting) ?? tap(new self, function (self $setting): void {
            $setting->forceFill(self::defaults());
            $setting->save();
        });
    }

    public static function clearCachedCurrent(): void
    {
        Cache::forget(self::CACHE_KEY);
        SiteSettingsData::clearCache();
        Cache::forget('seo.sitemap.xml');
    }

    protected static function booted(): void
    {
        static::saved(fn () => self::clearCachedCurrent());
    }

    /**
     * @return Attribute<string, never>
     */
    protected function logoUrl(): Attribute
    {
        return Attribute::get(
            fn (): string => $this->logo
                ? Storage::disk('public')->url($this->logo)
                : '/akbulut-emlak-logo-cropped.png',
        );
    }

    /**
     * @return Attribute<string, never>
     */
    protected function faviconUrl(): Attribute
    {
        return Attribute::get(
            fn (): string => $this->favicon
                ? Storage::disk('public')->url($this->favicon)
                : '/favicon.ico',
        );
    }

    /**
     * @return Attribute<string, never>
     */
    protected function ogImageUrl(): Attribute
    {
        return Attribute::get(
            fn (): string => $this->og_image
                ? Storage::disk('public')->url($this->og_image)
                : ($this->logo
                    ? Storage::disk('public')->url($this->logo)
                    : '/akbulut-emlak-logo-cropped.png'),
        );
    }
}
