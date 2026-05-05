<?php

namespace App\Support;

use App\Models\SiteSetting;

class SiteSettingsData
{
    /**
     * @return array<string, mixed>
     */
    public static function shared(): array
    {
        $settings = SiteSetting::current();
        $data = array_merge(SiteSetting::defaults(), $settings->toArray());
        $value = static function (string $key) use ($data): string {
            $fallback = SiteSetting::defaults()[$key] ?? '';
            $current = $data[$key] ?? null;

            return is_string($current) && trim($current) !== ''
                ? $current
                : $fallback;
        };

        return [
            'siteName' => $value('site_name'),
            'phone' => $value('phone'),
            'whatsapp' => $value('whatsapp'),
            'email' => $value('email'),
            'address' => $value('address'),
            'logo' => $data['logo'] ?? '',
            'logoUrl' => $settings->logo_url,
            'favicon' => $data['favicon'] ?? '',
            'faviconUrl' => $settings->favicon_url,
            'heroTitle' => $value('hero_title'),
            'heroSubtitle' => $value('hero_subtitle'),
            'heroButtonText' => $value('hero_button_text'),
            'heroButtonLink' => $value('hero_button_link'),
            'aboutTitle' => $value('about_title'),
            'aboutText' => $value('about_text'),
            'footerText' => $value('footer_text'),
            'seoTitle' => $value('seo_title'),
            'seoDescription' => $value('seo_description'),
            'seoKeywords' => $value('seo_keywords'),
            'ogImage' => $data['og_image'] ?? '',
            'ogImageUrl' => $settings->og_image_url,
            'instagramUrl' => $data['instagram_url'] ?? '',
            'facebookUrl' => $data['facebook_url'] ?? '',
            'youtubeUrl' => $data['youtube_url'] ?? '',
            'linkedinUrl' => $data['linkedin_url'] ?? '',
            'statSalesCount' => $value('stat_sales_count'),
            'statSalesLabel' => $value('stat_sales_label'),
            'statPortfolioCount' => $value('stat_portfolio_count'),
            'statPortfolioLabel' => $value('stat_portfolio_label'),
            'statExperienceCount' => $value('stat_experience_count'),
            'statExperienceLabel' => $value('stat_experience_label'),
            'statSatisfactionCount' => $value('stat_satisfaction_count'),
            'statSatisfactionLabel' => $value('stat_satisfaction_label'),
            'stats' => [
                [
                    'value' => $value('stat_sales_count'),
                    'label' => $value('stat_sales_label'),
                ],
                [
                    'value' => $value('stat_portfolio_count'),
                    'label' => $value('stat_portfolio_label'),
                ],
                [
                    'value' => $value('stat_experience_count'),
                    'label' => $value('stat_experience_label'),
                ],
                [
                    'value' => $value('stat_satisfaction_count'),
                    'label' => $value('stat_satisfaction_label'),
                ],
            ],
        ];
    }
}
