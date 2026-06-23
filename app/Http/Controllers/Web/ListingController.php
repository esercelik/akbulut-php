<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\ListingFilterRequest;
use App\Http\Resources\Web\PropertyResource;
use App\Models\Property;
use App\Support\Web\ListingFilters;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

class ListingController extends Controller
{
    public function show(ListingFilterRequest $request, ListingFilters $listingFilters): Response
    {
        $filters = $listingFilters->filled($request->validated());

        return inertia('site/listings', [
            'properties' => PropertyResource::collection(
                $listingFilters
                    ->apply(
                        Property::query()
                            ->where('status', 'ACTIVE')
                            ->with([
                                'consultant',
                                'cityRecord',
                                'districtRecord',
                                'neighborhoodRecord',
                                'images' => fn ($query) => $query->orderBy('sort_order'),
                            ]),
                        $filters
                    )
                    ->latest()
                    ->get()
            ),
            'filters' => $filters,
            'filterOptions' => $listingFilters->options(),
        ]);
    }

    public function legacyDetails(string $reference): RedirectResponse
    {
        $property = $this->resolvePropertyReference($reference);

        return redirect()->route('properties.show', ['reference' => $property->slug], 301);
    }

    public function details(string $reference): Response|RedirectResponse
    {
        $property = $this->resolvePropertyReference($reference);

        if ($reference !== $property->slug) {
            return redirect()->route('properties.show', ['reference' => $property->slug], 301);
        }

        $relatedProperties = Property::query()
            ->where('status', 'ACTIVE')
            ->whereKeyNot($property->id)
            ->where(function ($query) use ($property): void {
                $query
                    ->where(function ($query) use ($property): void {
                        $query
                            ->where('city', $property->city)
                            ->where('district', $property->district);
                    })
                    ->orWhere('city', $property->city);
            })
            ->with([
                'consultant',
                'cityRecord',
                'districtRecord',
                'neighborhoodRecord',
                'images' => fn ($query) => $query->orderBy('sort_order'),
            ])
            ->latest()
            ->limit(8)
            ->get();

        return inertia('site/listing-detail', [
            'property' => new PropertyResource($property),
            'relatedProperties' => PropertyResource::collection($relatedProperties),
        ]);
    }

    private function resolvePropertyReference(string $reference): Property
    {
        return Property::query()
            ->where('status', 'ACTIVE')
            ->where(function ($query) use ($reference): void {
                if (ctype_digit($reference)) {
                    $query->whereKey((int) $reference);
                }

                $query->orWhere('slug', $reference);
            })
            ->with([
                'consultant',
                'cityRecord',
                'districtRecord',
                'neighborhoodRecord',
                'images' => fn ($query) => $query->orderBy('sort_order'),
            ])
            ->firstOrFail();
    }
}
