<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'site_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'whatsapp' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:1000'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'favicon' => ['nullable', 'file', 'mimes:ico,png,jpg,jpeg,svg,webp', 'max:2048'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_subtitle' => ['nullable', 'string', 'max:2000'],
            'hero_button_text' => ['nullable', 'string', 'max:100'],
            'hero_button_link' => ['nullable', 'string', 'max:255'],
            'about_title' => ['nullable', 'string', 'max:255'],
            'about_text' => ['nullable', 'string', 'max:3000'],
            'footer_text' => ['nullable', 'string', 'max:1000'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:1000'],
            'seo_keywords' => ['nullable', 'string', 'max:1000'],
            'og_image' => ['nullable', 'image', 'max:2048'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'stat_sales_count' => ['nullable', 'string', 'max:50'],
            'stat_sales_label' => ['nullable', 'string', 'max:255'],
            'stat_portfolio_count' => ['nullable', 'string', 'max:50'],
            'stat_portfolio_label' => ['nullable', 'string', 'max:255'],
            'stat_experience_count' => ['nullable', 'string', 'max:50'],
            'stat_experience_label' => ['nullable', 'string', 'max:255'],
            'stat_satisfaction_count' => ['nullable', 'string', 'max:50'],
            'stat_satisfaction_label' => ['nullable', 'string', 'max:255'],
        ];
    }
}
