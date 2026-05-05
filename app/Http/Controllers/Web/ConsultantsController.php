<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class ConsultantsController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('site/consultants', [
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
