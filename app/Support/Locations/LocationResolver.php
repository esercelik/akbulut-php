<?php

namespace App\Support\Locations;

use App\Models\City;
use App\Models\District;
use App\Models\Neighborhood;
use Illuminate\Validation\ValidationException;

class LocationResolver
{
    /**
     * @return array{city_id: int, district_id: int, neighborhood_id: int, city: string, district: string, neighborhood: string}
     */
    public function resolveForProperty(?int $cityId, ?int $districtId, ?int $neighborhoodId): array
    {
        $city = City::query()->find($cityId);

        if (! $city) {
            throw ValidationException::withMessages([
                'city_id' => 'Gecerli bir sehir secin.',
            ]);
        }

        $district = District::query()
            ->whereKey($districtId)
            ->where('city_id', $city->id)
            ->first();

        if (! $district) {
            throw ValidationException::withMessages([
                'district_id' => 'Secilen ilce secilen sehire ait degil.',
            ]);
        }

        $neighborhood = Neighborhood::query()
            ->whereKey($neighborhoodId)
            ->where('district_id', $district->id)
            ->first();

        if (! $neighborhood) {
            throw ValidationException::withMessages([
                'neighborhood_id' => 'Secilen mahalle secilen ilceye ait degil.',
            ]);
        }

        return [
            'city_id' => $city->id,
            'district_id' => $district->id,
            'neighborhood_id' => $neighborhood->id,
            'city' => $city->name,
            'district' => $district->name,
            'neighborhood' => $neighborhood->name,
        ];
    }

    /**
     * @return array{city_id: int|null, district_id: int|null, neighborhood_id: int|null}
     */
    public function matchExisting(?string $cityName, ?string $districtName, ?string $neighborhoodName): array
    {
        $city = $this->matchCity($cityName);
        $district = $city ? $this->matchDistrict($city->id, $districtName) : null;
        $neighborhood = $district ? $this->matchNeighborhood($district->id, $neighborhoodName) : null;

        return [
            'city_id' => $city?->id,
            'district_id' => $district?->id,
            'neighborhood_id' => $neighborhood?->id,
        ];
    }

    private function matchCity(?string $name): ?City
    {
        $normalized = $this->normalize($name);

        if ($normalized === null) {
            return null;
        }

        return City::query()
            ->get()
            ->first(fn (City $city): bool => $this->normalize($city->name) === $normalized);
    }

    private function matchDistrict(int $cityId, ?string $name): ?District
    {
        $normalized = $this->normalize($name);

        if ($normalized === null) {
            return null;
        }

        return District::query()
            ->where('city_id', $cityId)
            ->get()
            ->first(fn (District $district): bool => $this->normalize($district->name) === $normalized);
    }

    private function matchNeighborhood(int $districtId, ?string $name): ?Neighborhood
    {
        $normalized = $this->normalize($name);

        if ($normalized === null) {
            return null;
        }

        return Neighborhood::query()
            ->where('district_id', $districtId)
            ->get()
            ->first(fn (Neighborhood $neighborhood): bool => $this->normalize($neighborhood->name) === $normalized);
    }

    private function normalize(?string $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $value = trim($value);

        if ($value === '') {
            return null;
        }

        $value = preg_replace('/\s*\([^)]*\)/u', '', $value) ?? $value;
        $value = preg_replace('/\s+/u', ' ', $value) ?? $value;

        return mb_strtolower(trim($value), 'UTF-8');
    }
}
