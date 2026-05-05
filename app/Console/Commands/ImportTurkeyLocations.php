<?php

namespace App\Console\Commands;

use App\Models\City;
use App\Models\District;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Support\Locations\LocationResolver;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ImportTurkeyLocations extends Command
{
    protected $signature = 'locations:import-turkey
        {path : SQL dosyasinin tam yolu}
        {--fresh : Location tablolarini bosaltip tekrar yukle}
        {--sync-properties : Mevcut ilanlarin city_id/district_id/neighborhood_id alanlarini eslestir}';

    protected $description = 'Import cities, districts and neighborhoods from the provided Turkey SQL file.';

    public function handle(LocationResolver $locationResolver): int
    {
        $path = (string) $this->argument('path');

        if (! is_file($path)) {
            $this->error("SQL dosyasi bulunamadi: {$path}");

            return self::FAILURE;
        }

        [$cities, $districts, $semtToDistrict, $neighborhoods] = $this->parseSqlFile($path);

        DB::transaction(function () use ($cities, $districts, $semtToDistrict, $neighborhoods, $locationResolver): void {
            if ($this->option('fresh')) {
                $this->resetLocationTables();
            }

            foreach ($cities as $city) {
                City::query()->updateOrCreate(
                    ['source_id' => $city['source_id']],
                    ['name' => $city['name']],
                );
            }

            $cityIdMap = City::query()
                ->pluck('id', 'source_id')
                ->map(fn (mixed $id): int => (int) $id)
                ->all();

            foreach ($districts as $district) {
                $cityId = $cityIdMap[$district['city_source_id']] ?? null;

                if (! $cityId) {
                    continue;
                }

                District::query()->updateOrCreate(
                    ['source_id' => $district['source_id']],
                    [
                        'city_id' => $cityId,
                        'name' => $district['name'],
                    ],
                );
            }

            $districtSourceMap = District::query()
                ->pluck('id', 'source_id')
                ->map(fn (mixed $id): int => (int) $id)
                ->all();

            $neighborhoodUpserts = [];

            foreach ($neighborhoods as $neighborhood) {
                $districtSourceId = $semtToDistrict[$neighborhood['source_semt_id']] ?? null;
                $districtId = $districtSourceMap[$districtSourceId] ?? null;

                if (! $districtId) {
                    continue;
                }

                $key = $districtId.'|'.$neighborhood['name'];

                if (isset($neighborhoodUpserts[$key])) {
                    continue;
                }

                $neighborhoodUpserts[$key] = [
                    'district_id' => $districtId,
                    'source_id' => $neighborhood['source_id'],
                    'source_semt_id' => $neighborhood['source_semt_id'],
                    'name' => $neighborhood['name'],
                ];
            }

            foreach (array_chunk(array_values($neighborhoodUpserts), 1000) as $neighborhoodChunk) {
                Neighborhood::query()->upsert(
                    $neighborhoodChunk,
                    ['district_id', 'name'],
                    ['source_id', 'source_semt_id'],
                );
            }

            if ($this->option('sync-properties')) {
                Property::query()
                    ->select(['id', 'city', 'district', 'neighborhood'])
                    ->chunkById(100, function ($properties) use ($locationResolver): void {
                        foreach ($properties as $property) {
                            $match = $locationResolver->matchExisting(
                                $property->city,
                                $property->district,
                                $property->neighborhood,
                            );

                            $property->forceFill([
                                'city_id' => $match['city_id'],
                                'district_id' => $match['district_id'],
                                'neighborhood_id' => $match['neighborhood_id'],
                            ])->save();
                        }
                    });
            }
        });

        $this->info('Konum verileri basariyla ice aktarildi.');
        $this->line('Sehir sayisi: '.City::query()->count());
        $this->line('Ilce sayisi: '.District::query()->count());
        $this->line('Mahalle sayisi: '.Neighborhood::query()->count());

        return self::SUCCESS;
    }

    /**
     * @return array{0: array<int, array{source_id:int,name:string}>, 1: array<int, array{source_id:int,city_source_id:int,name:string}>, 2: array<int,int>, 3: array<int, array{source_id:int,source_semt_id:int,name:string}>}
     */
    private function parseSqlFile(string $path): array
    {
        $cities = [];
        $districts = [];
        $semtToDistrict = [];
        $neighborhoods = [];

        $handle = fopen($path, 'rb');

        if ($handle === false) {
            throw new \RuntimeException("SQL dosyasi okunamadi: {$path}");
        }

        try {
            while (($line = fgets($handle)) !== false) {
                $line = trim($line);

                if ($line === '') {
                    continue;
                }

                if (preg_match("/INSERT \\[tbl_il\\] \\(\\[il_id\\], \\[il_ad\\]\\) VALUES \\((\\d+), N'((?:[^']|'')*)'\\)/", $line, $matches) === 1) {
                    $cities[] = [
                        'source_id' => (int) $matches[1],
                        'name' => $this->normalizeLocationName($matches[2]),
                    ];

                    continue;
                }

                if (preg_match("/INSERT \\[tbl_ilce\\] \\(\\[ilce_id\\], \\[il_id\\], \\[ilce_ad\\]\\) VALUES \\((\\d+), (\\d+), N'((?:[^']|'')*)'\\)/", $line, $matches) === 1) {
                    $districts[] = [
                        'source_id' => (int) $matches[1],
                        'city_source_id' => (int) $matches[2],
                        'name' => $this->normalizeLocationName($matches[3]),
                    ];

                    continue;
                }

                if (preg_match("/INSERT \\[tbl_semt\\] \\(\\[semt_id\\], \\[ilce_id\\], \\[semt_ad\\]\\) VALUES \\((\\d+), (\\d+), N'((?:[^']|'')*)'\\)/", $line, $matches) === 1) {
                    $semtToDistrict[(int) $matches[1]] = (int) $matches[2];

                    continue;
                }

                if (preg_match("/INSERT \\[tbl_mahalle\\] \\(\\[mahalle_id\\], \\[semt_id\\], \\[mahalle_ad\\], \\[pk_id\\]\\) VALUES \\((\\d+), (\\d+), N'((?:[^']|'')*)', (\\d+)\\)/", $line, $matches) === 1) {
                    $neighborhoods[] = [
                        'source_id' => (int) $matches[1],
                        'source_semt_id' => (int) $matches[2],
                        'name' => $this->normalizeLocationName($matches[3]),
                    ];
                }
            }
        } finally {
            fclose($handle);
        }

        return [$cities, $districts, $semtToDistrict, $neighborhoods];
    }

    private function normalizeLocationName(string $name): string
    {
        $name = mb_convert_encoding($name, 'UTF-8', ['Windows-1254', 'ISO-8859-9', 'UTF-8']);
        $name = str_replace("''", "'", $name);
        $name = preg_replace('/\s*\([^)]*\)/u', '', $name) ?? $name;
        $name = preg_replace('/\s+/u', ' ', $name) ?? $name;

        return trim($name);
    }

    private function resetLocationTables(): void
    {
        Schema::disableForeignKeyConstraints();

        Property::query()->update([
            'city_id' => null,
            'district_id' => null,
            'neighborhood_id' => null,
        ]);

        Neighborhood::query()->delete();
        District::query()->delete();
        City::query()->delete();

        Schema::enableForeignKeyConstraints();
    }
}
