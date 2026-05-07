<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Support\Locations\LocationResolver;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use JsonException;
use RuntimeException;

class TurkeyLocationSeeder extends Seeder
{
    private const DATA_FILE = 'data/turkey_locations.json';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = $this->locations();
        $locationResolver = app(LocationResolver::class);

        DB::transaction(function () use ($locations, $locationResolver): void {
            $this->resetLocationTables();
            $this->seedCities($locations);
            $cityIdsBySourceId = $this->idsBySourceId('cities');

            $this->seedDistricts($locations, $cityIdsBySourceId);
            $districtIdsBySourceId = $this->idsBySourceId('districts');

            $this->seedNeighborhoods($locations, $districtIdsBySourceId);
            $this->syncProperties($locationResolver);
        });
    }

    /**
     * @param  array<int, array{name: string, apiId: int, districts: array<int, array{name: string, apiId: int, neighborhoods: array<int, array{name: string, apiId: int}>}>}>  $locations
     */
    private function seedCities(array $locations): void
    {
        $cities = collect($locations)
            ->map(fn (array $city): array => [
                'source_id' => $city['apiId'],
                'name' => $city['name'],
            ])
            ->all();

        DB::table('cities')->upsert($cities, ['source_id'], ['name']);
    }

    /**
     * @param  array<int, array{name: string, apiId: int, districts: array<int, array{name: string, apiId: int, neighborhoods: array<int, array{name: string, apiId: int}>}>}>  $locations
     * @param  array<int, int>  $cityIdsBySourceId
     */
    private function seedDistricts(array $locations, array $cityIdsBySourceId): void
    {
        $districts = [];

        foreach ($locations as $city) {
            $cityId = $cityIdsBySourceId[$city['apiId']] ?? null;

            if (! $cityId) {
                continue;
            }

            foreach ($city['districts'] as $district) {
                $districts[] = [
                    'city_id' => $cityId,
                    'source_id' => $district['apiId'],
                    'name' => $district['name'],
                ];
            }
        }

        foreach (array_chunk($districts, 1000) as $districtChunk) {
            DB::table('districts')->upsert($districtChunk, ['source_id'], ['city_id', 'name']);
        }
    }

    /**
     * @param  array<int, array{name: string, apiId: int, districts: array<int, array{name: string, apiId: int, neighborhoods: array<int, array{name: string, apiId: int}>}>}>  $locations
     * @param  array<int, int>  $districtIdsBySourceId
     */
    private function seedNeighborhoods(array $locations, array $districtIdsBySourceId): void
    {
        $neighborhoods = [];

        foreach ($locations as $city) {
            foreach ($city['districts'] as $district) {
                $districtId = $districtIdsBySourceId[$district['apiId']] ?? null;

                if (! $districtId) {
                    continue;
                }

                foreach ($district['neighborhoods'] as $neighborhood) {
                    $key = $districtId.'|'.$neighborhood['name'];

                    $neighborhoods[$key] = [
                        'district_id' => $districtId,
                        'source_id' => $neighborhood['apiId'],
                        'source_semt_id' => null,
                        'name' => $neighborhood['name'],
                    ];
                }
            }
        }

        foreach (array_chunk(array_values($neighborhoods), 1000) as $neighborhoodChunk) {
            DB::table('neighborhoods')->upsert(
                $neighborhoodChunk,
                ['district_id', 'name'],
                ['source_id', 'source_semt_id'],
            );
        }
    }

    /**
     * @return array<int, int>
     */
    private function idsBySourceId(string $table): array
    {
        return DB::table($table)
            ->pluck('id', 'source_id')
            ->map(fn (mixed $id): int => (int) $id)
            ->all();
    }

    private function resetLocationTables(): void
    {
        Schema::disableForeignKeyConstraints();

        try {
            if (
                Schema::hasTable('properties')
                && Schema::hasColumns('properties', ['city_id', 'district_id', 'neighborhood_id'])
            ) {
                Property::query()->update([
                    'city_id' => null,
                    'district_id' => null,
                    'neighborhood_id' => null,
                ]);
            }

            DB::table('neighborhoods')->delete();
            DB::table('districts')->delete();
            DB::table('cities')->delete();
        } finally {
            Schema::enableForeignKeyConstraints();
        }
    }

    private function syncProperties(LocationResolver $locationResolver): void
    {
        if (
            ! Schema::hasTable('properties')
            || ! Schema::hasColumns('properties', ['city_id', 'district_id', 'neighborhood_id'])
        ) {
            return;
        }

        Property::query()
            ->select(['id', 'city', 'district', 'neighborhood'])
            ->chunkById(100, function ($properties) use ($locationResolver): void {
                foreach ($properties as $property) {
                    $property->forceFill($locationResolver->matchExisting(
                        $property->city,
                        $property->district,
                        $property->neighborhood,
                    ))->save();
                }
            });
    }

    /**
     * @return array<int, array{name: string, apiId: int, districts: array<int, array{name: string, apiId: int, neighborhoods: array<int, array{name: string, apiId: int}>}>}>
     */
    private function locations(): array
    {
        $path = database_path(self::DATA_FILE);

        if (! is_file($path)) {
            throw new RuntimeException("Turkey location seed data not found: {$path}");
        }

        try {
            $locations = json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException("Turkey location seed data could not be decoded: {$path}", previous: $exception);
        }

        if (! is_array($locations)) {
            throw new RuntimeException("Turkey location seed data has an invalid format: {$path}");
        }

        return $locations;
    }
}
