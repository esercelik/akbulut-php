<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $xml = Cache::remember('seo.sitemap.xml', now()->addMinutes(30), function (): string {
            return view('seo.sitemap', [
                'urls' => $this->sitemapUrls(),
            ])->render();
        });

        return response($xml, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
            'Cache-Control' => 'public, max-age=1800',
        ]);
    }

    public function robots(): Response
    {
        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin/',
            'Disallow: /admin/login',
            'Disallow: /dashboard',
            'Disallow: /settings/',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /forgot-password',
            'Disallow: /reset-password',
            'Disallow: /*?*',
            'Allow: /listings',
            'Sitemap: '.route('seo.sitemap'),
            '',
        ]);

        return response($content, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }

    /**
     * @return Collection<int, array{loc: string, lastmod: mixed, changefreq: string, priority: string, images?: array<int, array{loc: string, title: string|null}>}>
     */
    private function sitemapUrls(): Collection
    {
        return collect([
            ['loc' => route('home'), 'lastmod' => now(), 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => route('listings.index'), 'lastmod' => now(), 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => route('consultants.index'), 'lastmod' => now(), 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => route('about'), 'lastmod' => now(), 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => route('contact'), 'lastmod' => now(), 'changefreq' => 'monthly', 'priority' => '0.5'],
        ])->merge(
            User::query()
                ->select(['id', 'slug', 'updated_at'])
                ->where('role', 'CONSULTANT')
                ->where('active', true)
                ->whereNotNull('slug')
                ->orderBy('id')
                ->get()
                ->map(fn (User $consultant): array => [
                    'loc' => route('consultants.show', ['consultant' => $consultant->slug]),
                    'lastmod' => $consultant->updated_at,
                    'changefreq' => 'weekly',
                    'priority' => '0.6',
                ])
        )->merge(
            Property::query()
                ->select(['id', 'slug', 'title', 'featured', 'updated_at'])
                ->where('status', 'ACTIVE')
                ->whereNotNull('slug')
                ->with([
                    'images' => fn ($query) => $query
                        ->select(['id', 'property_id', 'image_url', 'alt', 'sort_order'])
                        ->orderBy('sort_order'),
                ])
                ->latest('updated_at')
                ->get()
                ->map(fn (Property $property): array => [
                    'loc' => route('properties.show', ['reference' => $property->slug]),
                    'lastmod' => $property->updated_at,
                    'changefreq' => 'daily',
                    'priority' => $property->featured ? '0.9' : '0.8',
                    'images' => $property->images
                        ->take(20)
                        ->map(fn ($image): array => [
                            'loc' => $this->absoluteUrl((string) $image->image_url),
                            'title' => $image->alt ?: $property->title,
                        ])
                        ->filter(fn (array $image): bool => $image['loc'] !== '')
                        ->values()
                        ->all(),
                ])
        )->values();
    }

    private function absoluteUrl(string $url): string
    {
        if ($url === '') {
            return '';
        }

        if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
            return $url;
        }

        return url($url);
    }
}
