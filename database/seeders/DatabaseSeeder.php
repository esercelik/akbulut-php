<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use App\Support\Locations\LocationResolver;
use Carbon\CarbonInterface;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locationResolver = app(LocationResolver::class);

        $imagePool = [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85',
            'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=85',
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=85',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85',
        ];

        $consultantUsers = [
            ['username' => 'eser.celik', 'slug' => 'eser-celik', 'name' => 'Eser', 'surname' => 'Celik', 'region' => 'Kocaeli / Izmit', 'email' => 'eser.celik@akbulutemlak.com'],
            ['username' => 'abdurrahman.yavuzer', 'slug' => 'abdurrahman-yavuzer', 'name' => 'Abdurrahman', 'surname' => 'Yavuzer', 'region' => 'Kocaeli / Kartepe', 'email' => 'abdurrahman.yavuzer@akbulutemlak.com'],
            ['username' => 'murat.celik', 'slug' => 'murat-celik', 'name' => 'Murat', 'surname' => 'Celik', 'region' => 'Kocaeli / Basiskele', 'email' => 'murat.celik@akbulutemlak.com'],
            ['username' => 'mukremin.akbulut', 'slug' => 'mukremin-akbulut', 'name' => 'Mukremin', 'surname' => 'Akbulut', 'region' => 'Kocaeli / Golcuk', 'email' => 'mukremin.akbulut@akbulutemlak.com'],
            ['username' => 'mehmet.uzun', 'slug' => 'mehmet-uzun', 'name' => 'Mehmet', 'surname' => 'Uzun', 'region' => 'Kocaeli / Derince', 'email' => 'mehmet.uzun@akbulutemlak.com'],
            ['username' => 'bunyamin.eren.ertekin', 'slug' => 'bunyamin-eren-ertekin', 'name' => 'Bunyamin', 'surname' => 'Eren Ertekin', 'region' => 'Kocaeli / Korfez', 'email' => 'bunyamin.eren.ertekin@akbulutemlak.com'],
            ['username' => 'danisman.7', 'slug' => 'danisman-7', 'name' => 'Danisman', 'surname' => '7', 'region' => 'Kocaeli / Gebze', 'email' => 'danisman.7@akbulutemlak.com'],
            ['username' => 'danisman.8', 'slug' => 'danisman-8', 'name' => 'Danisman', 'surname' => '8', 'region' => 'Kocaeli / Darica', 'email' => 'danisman.8@akbulutemlak.com'],
        ];

        $permissions = [
            'DASHBOARD_VIEW',
            'LISTINGS_VIEW',
            'LISTINGS_CREATE',
            'LISTINGS_EDIT',
            'LISTINGS_DELETE',
            'LISTINGS_PUBLISH',
            'LISTINGS_FEATURE',
            'CONSULTANTS_VIEW',
            'CONSULTANTS_CREATE',
            'CONSULTANTS_EDIT',
            'CONSULTANTS_DELETE',
            'USERS_VIEW',
            'USERS_CREATE',
            'USERS_EDIT',
            'USERS_DELETE',
            'MESSAGES_VIEW',
            'MESSAGES_EDIT',
            'SETTINGS_VIEW',
            'SETTINGS_EDIT',
        ];

        $consultantDefaultPermissions = [
            'DASHBOARD_VIEW',
            'LISTINGS_VIEW',
            'LISTINGS_CREATE',
            'LISTINGS_EDIT',
            'MESSAGES_VIEW',
        ];

        $properties = [
            [
                'title' => 'Izmit Merkezde Premium Aile Dairesi',
                'slug' => 'izmit-merkezde-premium-aile-dairesi',
                'description' => 'Merkezi lokasyonda, genis planli ve yatirim degeri yuksek modern aile dairesi.',
                'price' => 8750000,
                'city' => 'Kocaeli',
                'district' => 'Izmit',
                'neighborhood' => 'Yahyakaptan',
                'property_type' => 'APARTMENT',
                'listing_type' => 'SALE',
                'square_meters' => 165,
                'room_count' => '4+1',
                'bathroom_count' => 2,
                'featured' => true,
                'status' => 'ACTIVE',
                'consultant_slug' => 'eser-celik',
            ],
            [
                'title' => 'Kartepe Manzarali Kiralik Villa',
                'slug' => 'kartepe-manzarali-kiralik-villa',
                'description' => 'Doga manzarasi, bahce kullanimi ve yuksek yasam konforuyla seckin kiralik villa.',
                'price' => 85000,
                'city' => 'Kocaeli',
                'district' => 'Kartepe',
                'neighborhood' => 'Masukiye',
                'property_type' => 'VILLA',
                'listing_type' => 'RENT',
                'square_meters' => 280,
                'room_count' => '5+1',
                'bathroom_count' => 3,
                'featured' => true,
                'status' => 'ACTIVE',
                'consultant_slug' => 'abdurrahman-yavuzer',
            ],
            [
                'title' => 'Basiskele Sahile Yakin Luks Konut',
                'slug' => 'basiskele-sahile-yakin-luks-konut',
                'description' => 'Sahile yakin konumda, kaliteli malzeme secimi ve ferah sosyal alanlariyla one cikar.',
                'price' => 12600000,
                'city' => 'Kocaeli',
                'district' => 'Basiskele',
                'neighborhood' => 'Yuvacik',
                'property_type' => 'APARTMENT',
                'listing_type' => 'SALE',
                'square_meters' => 190,
                'room_count' => '4+1',
                'bathroom_count' => 2,
                'featured' => true,
                'status' => 'ACTIVE',
                'consultant_slug' => 'murat-celik',
            ],
            [
                'title' => 'Golcuk Bahceli Mustakil Villa',
                'slug' => 'golcuk-bahceli-mustakil-villa',
                'description' => 'Aile yasamina uygun genis bahceli, kapali garajli ve sakin lokasyonlu mustakil villa.',
                'price' => 18500000,
                'city' => 'Kocaeli',
                'district' => 'Golcuk',
                'neighborhood' => 'Degirmendere',
                'property_type' => 'VILLA',
                'listing_type' => 'SALE',
                'square_meters' => 320,
                'room_count' => '6+1',
                'bathroom_count' => 4,
                'featured' => true,
                'status' => 'ACTIVE',
                'consultant_slug' => 'mukremin-akbulut',
            ],
            [
                'title' => 'Derince Kurumsal Kiralik Ofis',
                'slug' => 'derince-kurumsal-kiralik-ofis',
                'description' => 'Kurumsal firmalar icin ulasim aksina yakin, kullanima hazir ve prestijli ofis alani.',
                'price' => 45000,
                'city' => 'Kocaeli',
                'district' => 'Derince',
                'neighborhood' => 'Merkez',
                'property_type' => 'OFFICE',
                'listing_type' => 'RENT',
                'square_meters' => 220,
                'room_count' => 'Acik Plan',
                'bathroom_count' => 2,
                'featured' => false,
                'status' => 'ACTIVE',
                'consultant_slug' => 'mehmet-uzun',
            ],
            [
                'title' => 'Korfez Cadde Uzeri Satilik Dukkan',
                'slug' => 'korfez-cadde-uzeri-satilik-dukkan',
                'description' => 'Yaya trafigi guclu cadde uzerinde, tabela degeri yuksek ticari yatirim firsati.',
                'price' => 9400000,
                'city' => 'Kocaeli',
                'district' => 'Korfez',
                'neighborhood' => 'Yarimca',
                'property_type' => 'SHOP',
                'listing_type' => 'SALE',
                'square_meters' => 130,
                'room_count' => 'Tek Bolum',
                'bathroom_count' => 1,
                'featured' => false,
                'status' => 'ACTIVE',
                'consultant_slug' => 'bunyamin-eren-ertekin',
            ],
            [
                'title' => 'Gebze Yatirimlik Arsa',
                'slug' => 'gebze-yatirimlik-arsa',
                'description' => 'Gelisim aksinda, uzun vadeli yatirim potansiyeli sunan degerli arsa portfoyu.',
                'price' => 7200000,
                'city' => 'Kocaeli',
                'district' => 'Gebze',
                'neighborhood' => 'Pelitli',
                'property_type' => 'LAND',
                'listing_type' => 'SALE',
                'square_meters' => 950,
                'room_count' => 'Arsa',
                'bathroom_count' => 0,
                'featured' => false,
                'status' => 'PASSIVE',
                'consultant_slug' => 'danisman-7',
            ],
            [
                'title' => 'Darica Deniz Yakini Kiralik Daire',
                'slug' => 'darica-deniz-yakini-kiralik-daire',
                'description' => 'Denize yakin, ulasimi kolay ve yeni nesil yasam beklentilerine uygun kiralik daire.',
                'price' => 26000,
                'city' => 'Kocaeli',
                'district' => 'Darica',
                'neighborhood' => 'Bayramoglu',
                'property_type' => 'APARTMENT',
                'listing_type' => 'RENT',
                'square_meters' => 125,
                'room_count' => '3+1',
                'bathroom_count' => 1,
                'featured' => true,
                'status' => 'ACTIVE',
                'consultant_slug' => 'danisman-8',
            ],
        ];

        DB::transaction(function () use ($imagePool, $consultantUsers, $permissions, $consultantDefaultPermissions, $properties): void {
            DB::table('contact_requests')->delete();
            DB::table('property_images')->delete();
            DB::table('properties')->delete();
            DB::table('user_permissions')->delete();
            DB::table('users')->delete();

            $now = now();
            $consultantIdsBySlug = [];

            $adminUserId = DB::table('users')->insertGetId([
                'username' => 'admin',
                'name' => 'Admin',
                'email' => 'admin@akbulutemlak.com',
                'password' => Hash::make('1111'),
                'role' => 'SUPER_ADMIN',
                'active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $this->insertPermissions($adminUserId, $permissions, $now);

            foreach ($consultantUsers as $index => $consultantUser) {
                $consultantUserId = DB::table('users')->insertGetId([
                    'username' => $consultantUser['username'],
                    'slug' => $consultantUser['slug'],
                    'name' => $consultantUser['name'],
                    'surname' => $consultantUser['surname'],
                    'email' => $consultantUser['email'],
                    'password' => Hash::make('1111'),
                    'role' => 'CONSULTANT',
                    'title' => 'Gayrimenkul Danismani',
                    'phone' => '+90 532 000 00 '.Str::padLeft((string) ($index + 1), 2, '0'),
                    'region' => $consultantUser['region'],
                    'bio' => 'Bolgesel piyasa bilgisi ve guclu portfoy yonetimiyle hizmet verir.',
                    'active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                $consultantIdsBySlug[$consultantUser['slug']] = $consultantUserId;

                $this->insertPermissions($consultantUserId, $consultantDefaultPermissions, $now);
            }

            $firstPropertyId = null;

            foreach ($properties as $index => $property) {
                $propertyId = DB::table('properties')->insertGetId([
                    'title' => $property['title'],
                    'slug' => $property['slug'],
                    'description' => $property['description'],
                    'price' => $property['price'],
                    'city' => $property['city'],
                    'district' => $property['district'],
                    'neighborhood' => $property['neighborhood'],
                    'property_type' => $property['property_type'],
                    'listing_type' => $property['listing_type'],
                    'square_meters' => $property['square_meters'],
                    'room_count' => $property['room_count'],
                    'bathroom_count' => $property['bathroom_count'],
                    'balcony' => $index % 2 === 0,
                    'furnished' => $property['listing_type'] === 'RENT',
                    'credit_eligible' => $property['listing_type'] === 'SALE',
                    'deed_status' => $property['listing_type'] === 'SALE' ? 'Kat Mulkiyetli' : null,
                    'status' => $property['status'],
                    'featured' => $property['featured'],
                    'consultant_id' => $consultantIdsBySlug[$property['consultant_slug']],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                $firstPropertyId ??= $propertyId;

                foreach ([0, 1, 2] as $offset) {
                    DB::table('property_images')->insert([
                        'property_id' => $propertyId,
                        'image_url' => $imagePool[($index + $offset) % count($imagePool)],
                        'alt' => $property['title'],
                        'sort_order' => $offset,
                        'created_at' => $now,
                    ]);
                }
            }

            DB::table('contact_requests')->insert([
                [
                    'property_id' => $firstPropertyId,
                    'name' => 'Zeynep Arslan',
                    'phone' => '+90 532 000 10 10',
                    'email' => 'zeynep@example.com',
                    'message' => 'Detayli sunum ve randevu bilgisi almak istiyorum.',
                    'created_at' => $now,
                ],
                [
                    'property_id' => null,
                    'name' => 'Can Yildirim',
                    'phone' => '+90 533 000 20 20',
                    'email' => 'can@example.com',
                    'message' => 'Kiralama kosullari hakkinda bilgi rica ederim.',
                    'created_at' => $now,
                ],
            ]);
        });

        SiteSetting::current();

        if (
            Schema::hasTable('cities')
            && Schema::hasTable('districts')
            && Schema::hasTable('neighborhoods')
            && Schema::hasColumns('properties', ['city_id', 'district_id', 'neighborhood_id'])
        ) {
            DB::table('properties')
                ->select(['id', 'city', 'district', 'neighborhood'])
                ->orderBy('id')
                ->each(function (object $property) use ($locationResolver): void {
                    $match = $locationResolver->matchExisting(
                        $property->city,
                        $property->district,
                        $property->neighborhood,
                    );

                    DB::table('properties')
                        ->where('id', $property->id)
                        ->update($match);
                });
        }
    }

    /**
     * @param  list<string>  $permissions
     */
    private function insertPermissions(int $userId, array $permissions, CarbonInterface $timestamp): void
    {
        DB::table('user_permissions')->insert(
            collect($permissions)->map(fn (string $permission): array => [
                'user_id' => $userId,
                'permission' => $permission,
                'allowed' => true,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ])->all(),
        );
    }
}
