<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    public function sitemap(): Response
    {
        $urls = collect([
            ['loc' => route('home'), 'lastmod' => now()],
            ['loc' => route('listings.index'), 'lastmod' => now()],
            ['loc' => route('consultants.index'), 'lastmod' => now()],
            ['loc' => route('about'), 'lastmod' => now()],
            ['loc' => route('contact'), 'lastmod' => now()],
        ])->merge(
            User::query()
                ->select(['slug', 'updated_at'])
                ->where('role', 'CONSULTANT')
                ->where('active', true)
                ->whereNotNull('slug')
                ->get()
                ->map(fn (User $consultant): array => [
                    'loc' => route('consultants.show', ['consultant' => $consultant->slug]),
                    'lastmod' => $consultant->updated_at,
                ])
        )->merge(
            Property::query()
                ->select(['slug', 'updated_at'])
                ->where('status', 'ACTIVE')
                ->whereNotNull('slug')
                ->get()
                ->map(fn (Property $property): array => [
                    'loc' => route('properties.show', ['reference' => $property->slug]),
                    'lastmod' => $property->updated_at,
                ])
        );

        $xml = view('seo.sitemap', ['urls' => $urls])->render();

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    public function robots(): Response
    {
        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /dashboard',
            'Sitemap: '.route('seo.sitemap'),
            '',
        ]);

        return response($content, 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }
}
