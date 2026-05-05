<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\BuildsAdminProps;
use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    use BuildsAdminProps;

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $this->ensurePermission($user, 'DASHBOARD_VIEW');

        $propertyQuery = $this->applyPropertyScope(Property::query(), $user);

        $recentListings = $this->applyPropertyScope(
            Property::query()
                ->select(['id', 'title', 'price', 'city', 'district', 'listing_type', 'status'])
                ->with(['images' => fn ($query) => $query->select(['id', 'property_id', 'image_url'])->orderBy('sort_order')]),
            $user,
        )
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Property $property): array => [
                'id' => $property->id,
                'title' => $property->title,
                'price' => $property->price,
                'city' => $property->city,
                'district' => $property->district,
                'listingType' => $property->listing_type,
                'status' => $property->status,
                'imageUrl' => $property->images->first()?->image_url,
            ]);

        $consultantSummaries = User::query()
            ->select(['id', 'slug', 'name', 'surname', 'region'])
            ->where('role', 'CONSULTANT')
            ->where('active', true)
            ->when($user->role === 'CONSULTANT', fn ($query) => $query->whereKey($user->id))
            ->withCount(['properties as activePortfolioCount' => fn ($query) => $query->where('status', 'ACTIVE')])
            ->oldest()
            ->limit(6)
            ->get()
            ->map(fn (User $consultant): array => [
                'id' => $consultant->id,
                'slug' => $consultant->slug,
                'name' => trim($consultant->name.' '.($consultant->surname ?? '')),
                'region' => $consultant->region,
                'activePortfolioCount' => $consultant->activePortfolioCount,
            ]);

        return Inertia::render('admin/dashboard', [
            'adminUser' => $this->adminUser($user),
            'stats' => [
                'totalListings' => (clone $propertyQuery)->count(),
                'activeListings' => (clone $propertyQuery)->where('status', 'ACTIVE')->count(),
                'saleListings' => (clone $propertyQuery)->where('listing_type', 'SALE')->count(),
                'rentListings' => (clone $propertyQuery)->where('listing_type', 'RENT')->count(),
                'consultantCount' => User::query()->where('role', 'CONSULTANT')->where('active', true)->count(),
                'messageCount' => ContactRequest::query()->count(),
                'unreadMessageCount' => ContactRequest::query()->where('status', 'UNREAD')->count(),
            ],
            'recentListings' => $recentListings,
            'consultantSummaries' => $consultantSummaries,
        ]);
    }
}
