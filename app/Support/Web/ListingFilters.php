<?php

namespace App\Support\Web;

use App\Models\City;
use App\Models\Property;
use Illuminate\Database\Eloquent\Builder;

class ListingFilters
{
    /**
     * @var array<string, string>
     */
    private const LISTING_TYPES = [
        'SALE' => 'Satılık',
        'RENT' => 'Kiralık',
    ];

    /**
     * @var array<string, string>
     */
    private const PROPERTY_TYPES = [
        'APARTMENT' => 'Daire',
        'VILLA' => 'Villa',
        'OFFICE' => 'Ofis',
        'SHOP' => 'Dükkan',
        'LAND' => 'Arsa',
        'BUILDING' => 'Bina',
    ];

    /**
     * Apply public listing filters to an active property query.
     *
     * @param  array<string, mixed>  $filters
     * @return Builder<Property>
     */
    public function apply(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['cityId'] ?? null, fn (Builder $query, int|string $cityId) => $query->where('city_id', $cityId))
            ->when(
                ! ($filters['cityId'] ?? null) && ($filters['city'] ?? null),
                fn (Builder $query) => $query->where('city', $filters['city'])
            )
            ->when($filters['districtId'] ?? null, fn (Builder $query, int|string $districtId) => $query->where('district_id', $districtId))
            ->when(
                ! ($filters['districtId'] ?? null) && ($filters['district'] ?? null),
                fn (Builder $query) => $query->where('district', $filters['district'])
            )
            ->when($filters['neighborhoodId'] ?? null, fn (Builder $query, int|string $neighborhoodId) => $query->where('neighborhood_id', $neighborhoodId))
            ->when(
                ! ($filters['neighborhoodId'] ?? null) && ($filters['neighborhood'] ?? null),
                fn (Builder $query) => $query->where('neighborhood', $filters['neighborhood'])
            )
            ->when($filters['listingType'] ?? null, fn (Builder $query, string $listingType) => $query->where('listing_type', $listingType))
            ->when($filters['propertyType'] ?? null, fn (Builder $query, string $propertyType) => $query->where('property_type', $propertyType))
            ->when(array_key_exists('minPrice', $filters), fn (Builder $query) => $query->where('price', '>=', $filters['minPrice']))
            ->when(array_key_exists('maxPrice', $filters), fn (Builder $query) => $query->where('price', '<=', $filters['maxPrice']));
    }

    /**
     * Return only non-empty filters for query string preservation.
     *
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function filled(array $filters): array
    {
        $filled = collect($filters)
            ->reject(fn (mixed $value): bool => $value === null || $value === '')
            ->all();

        if (isset($filled['cityId'])) {
            unset($filled['city']);
        }

        if (isset($filled['districtId'])) {
            unset($filled['district']);
        }

        if (isset($filled['neighborhoodId'])) {
            unset($filled['neighborhood']);
        }

        return $filled;
    }

    /**
     * Build select options from active listings.
     *
     * @return array<string, mixed>
     */
    public function options(): array
    {
        return [
            'cities' => City::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->get()
                ->map(fn (City $city): array => [
                    'id' => $city->id,
                    'name' => $city->name,
                ])
                ->all(),
            'listingTypes' => self::LISTING_TYPES,
            'propertyTypes' => self::PROPERTY_TYPES,
        ];
    }
}
