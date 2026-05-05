<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Resources\Web\PropertyResource;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ConsultantPortfolioController extends Controller
{
    /**
     * Show a public consultant profile with active portfolio listings.
     */
    public function __invoke(User $consultant): Response
    {
        abort_unless($consultant->role === 'CONSULTANT' && $consultant->active, 404);

        $properties = $consultant->properties()
            ->where('status', 'ACTIVE')
            ->with([
                'consultant',
                'cityRecord',
                'districtRecord',
                'neighborhoodRecord',
                'images' => fn ($query) => $query->orderBy('sort_order'),
            ])
            ->latest()
            ->get();

        return Inertia::render('site/consultant-portfolio', [
            'consultant' => [
                'id' => $consultant->id,
                'slug' => $consultant->slug,
                'name' => trim($consultant->name.' '.($consultant->surname ?? '')),
                'title' => $consultant->title,
                'phone' => $consultant->phone,
                'email' => $consultant->email,
                'region' => $consultant->region,
                'bio' => $consultant->bio,
                'avatar' => $consultant->avatar,
                'activePortfolioCount' => $properties->count(),
                'salePortfolioCount' => $properties->where('listing_type', 'SALE')->count(),
                'rentPortfolioCount' => $properties->where('listing_type', 'RENT')->count(),
            ],
            'properties' => PropertyResource::collection($properties),
        ]);
    }
}
