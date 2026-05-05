<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\Web\PropertyResource;
use App\Models\Property;
use App\Models\User;
use App\Support\Web\ListingFilters;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(ListingFilters $listingFilters): Response
    {
        return Inertia::render('site/home', [
            'filterOptions' => $listingFilters->options(),
            'featuredProperties' => PropertyResource::collection(
                Property::query()
                    ->where('status', 'ACTIVE')
                    ->where('featured', true)
                    ->with([
                        'consultant',
                        'cityRecord',
                        'districtRecord',
                        'neighborhoodRecord',
                        'images' => fn ($query) => $query->orderBy('sort_order'),
                    ])
                    ->latest()
                    ->limit(6)
                    ->get()
            ),
            'consultants' => User::query()
                ->select([
                    'id',
                    'slug',
                    'name',
                    'surname',
                    'title',
                    'region',
                    'profile_photo',
                    'image_url',
                ])
                ->where('role', 'CONSULTANT')
                ->where('active', true)
                ->whereNotNull('slug')
                ->withCount([
                    'properties as activePortfolioCount' => fn ($query) => $query->where('status', 'ACTIVE'),
                    'properties as salePortfolioCount' => fn ($query) => $query
                        ->where('status', 'ACTIVE')
                        ->where('listing_type', 'SALE'),
                    'properties as rentPortfolioCount' => fn ($query) => $query
                        ->where('status', 'ACTIVE')
                        ->where('listing_type', 'RENT'),
                ])
                ->orderByDesc('activePortfolioCount')
                ->orderBy('name')
                ->get()
                ->map(fn (User $consultant): array => [
                    'id' => $consultant->id,
                    'slug' => $consultant->slug,
                    'name' => trim($consultant->name.' '.($consultant->surname ?? '')),
                    'title' => $consultant->title,
                    'region' => $consultant->region,
                    'avatar' => $consultant->avatar,
                    'activePortfolioCount' => $consultant->activePortfolioCount,
                    'salePortfolioCount' => $consultant->salePortfolioCount,
                    'rentPortfolioCount' => $consultant->rentPortfolioCount,
                ])
                ->values(),
        ]);
    }
}
