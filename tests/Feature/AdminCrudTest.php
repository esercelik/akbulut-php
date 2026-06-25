<?php

use App\Models\City;
use App\Models\ContactRequest;
use App\Models\District;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Models\User;
use App\Services\OpenAiListingExtractorService;
use App\Services\PdfListingTextExtractor;
use App\Services\UrlListingTextExtractor;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware([
        PreventRequestForgery::class,
        ValidateCsrfToken::class,
        VerifyCsrfToken::class,
    ]);
});

function adminUser(): User
{
    return User::factory()->create(['role' => 'SUPER_ADMIN']);
}

function listingPayload(User $consultant, array $overrides = []): array
{
    $city = City::query()->firstOrCreate(
        ['source_id' => 4100],
        ['name' => 'Kocaeli'],
    );
    $district = District::query()->firstOrCreate(
        ['source_id' => 4101],
        ['city_id' => $city->id, 'name' => 'Izmit'],
    );
    $neighborhood = Neighborhood::query()->firstOrCreate(
        ['source_id' => 4102],
        [
            'district_id' => $district->id,
            'source_semt_id' => 4103,
            'name' => 'Merkez',
        ],
    );

    return [
        'title' => 'Test Portfoy',
        'description' => 'Test aciklama',
        'price' => 1250000,
        'city_id' => $city->id,
        'district_id' => $district->id,
        'neighborhood_id' => $neighborhood->id,
        'address' => 'Test adres',
        'property_type' => 'APARTMENT',
        'listing_type' => 'SALE',
        'square_meters' => 120,
        'room_count' => '3+1',
        'building_age' => '1-5 arasi',
        'floor' => '2',
        'total_floors' => '5',
        'heating' => 'Kombi (Dogalgaz)',
        'bathroom_count' => 1,
        'balcony' => 1,
        'furnished' => 0,
        'credit_eligible' => 1,
        'featured' => 0,
        'status' => 'ACTIVE',
        'consultant_id' => $consultant->id,
        ...$overrides,
    ];
}

test('admin can create update and delete listings', function () {
    Storage::fake('public');

    $admin = adminUser();
    $consultant = User::factory()->create(['role' => 'CONSULTANT']);

    $this->withoutMiddleware(VerifyCsrfToken::class);

    $this->actingAs($admin)
        ->post(route('admin.listings.store'), listingPayload($consultant, [
            'images' => [UploadedFile::fake()->image('listing.jpg')],
        ]))
        ->assertRedirect(route('admin.listings.index'));

    $property = Property::query()->where('title', 'Test Portfoy')->firstOrFail();
    expect($property->images()->count())->toBe(1);
    expect($property->images()->first()->image_url)->toContain('property-images');

    $this->actingAs($admin)
        ->put(route('admin.listings.update', $property), listingPayload($consultant, [
            'title' => 'Guncel Portfoy',
            'status' => 'PASSIVE',
            'remove_image_ids' => [$property->images()->first()->id],
            'images' => [UploadedFile::fake()->image('updated.webp')],
        ]))
        ->assertRedirect(route('admin.listings.index'));

    $this->assertDatabaseHas('properties', [
        'id' => $property->id,
        'title' => 'Guncel Portfoy',
        'status' => 'PASSIVE',
    ]);
    expect($property->fresh()->images()->first()->image_url)->toContain('property-images');

    $this->actingAs($admin)
        ->delete(route('admin.listings.destroy', $property))
        ->assertRedirect(route('admin.listings.index'));

    $this->assertDatabaseMissing('properties', ['id' => $property->id]);
});

test('admin can create land listing without residential fields', function () {
    $admin = adminUser();
    $consultant = User::factory()->create(['role' => 'CONSULTANT']);
    $payload = listingPayload($consultant, [
        'title' => 'Arsa Portfoyu',
        'property_type' => 'LAND_ZONED',
        'listing_type' => 'BUILD_FOR_SALE',
        'square_meters' => 500,
        'brut_m2' => 500,
    ]);

    unset(
        $payload['room_count'],
        $payload['building_age'],
        $payload['floor'],
        $payload['total_floors'],
        $payload['heating'],
        $payload['bathroom_count'],
        $payload['balcony'],
        $payload['furnished'],
    );

    $this->actingAs($admin)
        ->post(route('admin.listings.store'), $payload)
        ->assertRedirect(route('admin.listings.index'));

    $this->assertDatabaseHas('properties', [
        'title' => 'Arsa Portfoyu',
        'property_type' => 'LAND_ZONED',
        'listing_type' => 'BUILD_FOR_SALE',
        'room_count' => 'Arsa',
        'balcony' => false,
        'furnished' => false,
    ]);
});

test('admin can create listing with minimal data', function () {
    $admin = adminUser();
    $listingNo = 'PDF-'.uniqid();

    $this->withoutMiddleware(VerifyCsrfToken::class);

    $this->actingAs($admin)
        ->post(route('admin.listings.store'), [
            'ilan_no' => $listingNo,
        ])
        ->assertRedirect(route('admin.listings.index'));

    $this->assertDatabaseHas('properties', [
        'ilan_no' => $listingNo,
        'title' => 'Yeni ilan',
        'description' => 'Aciklama girilmedi.',
        'price' => 0,
        'city' => 'Belirtilmedi',
        'district' => 'Belirtilmedi',
        'property_type' => 'APARTMENT',
        'listing_type' => 'SALE',
        'square_meters' => 1,
        'status' => 'ACTIVE',
    ]);
});

test('admin can upload more than six listing images', function () {
    Storage::fake('public');

    $admin = adminUser();
    $consultant = User::factory()->create(['role' => 'CONSULTANT']);

    $images = collect(range(1, 7))
        ->map(fn (int $index) => UploadedFile::fake()->image("listing-{$index}.webp"))
        ->all();

    $this->actingAs($admin)
        ->post(route('admin.listings.store'), listingPayload($consultant, [
            'images' => $images,
        ]))
        ->assertRedirect(route('admin.listings.index'));

    $property = Property::query()->where('title', 'Test Portfoy')->firstOrFail();

    expect($property->images()->count())->toBe(7);
});

test('admin can save listing data first and upload images in batches', function () {
    Storage::fake('public');

    $admin = adminUser();
    $consultant = User::factory()->create(['role' => 'CONSULTANT']);

    $this->withoutMiddleware();

    $response = $this->actingAs($admin)
        ->postJson(route('admin.listings.store'), listingPayload($consultant, [
            'title' => 'Batch Upload Listing',
        ]))
        ->assertSuccessful()
        ->assertJsonPath('message', 'Ilan kaydedildi.');

    $propertyId = $response->json('property.id');
    $property = Property::query()->findOrFail($propertyId);

    $this->actingAs($admin)
        ->post(route('admin.listings.images.store', $property), [
            'images' => [
                UploadedFile::fake()->image('batch-1.jpg'),
                UploadedFile::fake()->image('batch-2.jpg'),
            ],
        ], ['Accept' => 'application/json'])
        ->assertSuccessful()
        ->assertJsonPath('uploaded', 2);

    $this->actingAs($admin)
        ->post(route('admin.listings.images.store', $property), [
            'images' => [
                UploadedFile::fake()->image('batch-3.webp'),
            ],
        ], ['Accept' => 'application/json'])
        ->assertSuccessful()
        ->assertJsonPath('uploaded', 1);

    expect($property->images()->count())->toBe(3);
});

test('admin can import listing data from pdf', function () {
    $admin = adminUser();
    $consultantName = 'Pdfimport'.uniqid();
    $consultant = User::factory()->create([
        'role' => 'CONSULTANT',
        'name' => $consultantName,
        'surname' => 'Danisman',
    ]);

    $this->mock(PdfListingTextExtractor::class)
        ->shouldReceive('extract')
        ->once()
        ->andReturn('PDF metni');
    $this->mock(OpenAiListingExtractorService::class)
        ->shouldReceive('extract')
        ->once()
        ->with('PDF metni')
        ->andReturn([
            'title' => 'PDF Baslik',
            'description' => 'PDF aciklama',
            'price' => 8450000,
            'currency' => 'TRY',
            'listing_type' => 'SALE',
            'property_type' => 'APARTMENT',
            'city' => 'Kocaeli',
            'district' => 'Izmit',
            'neighborhood' => 'Merkez',
            'address' => '',
            'gross_m2' => 140,
            'net_m2' => 120,
            'land_m2' => null,
            'room_count' => '3+1',
            'building_age' => '',
            'floor' => '',
            'total_floors' => '',
            'heating' => '',
            'bathroom_count' => 1,
            'balcony' => true,
            'furnished' => false,
            'site_name' => '',
            'dues' => null,
            'credit_eligible' => true,
            'deed_status' => '',
            'exchange' => null,
            'features' => ['asansor'],
            'contact_name' => "{$consultantName} Danisman",
            'contact_phone' => '',
            'source_portal' => 'Sahibinden',
            'source_listing_no' => '12345',
            'confidence' => [
                'title' => 0.9,
                'price' => 0.9,
                'location' => 0.8,
                'm2' => 0.8,
                'contact' => 0,
            ],
            'missing_fields' => [],
        ]);

    $this->withoutMiddleware();

    $this->actingAs($admin)
        ->postJson(route('admin.listings.import-pdf'), [
            'pdf' => UploadedFile::fake()->create('listing.pdf', 100, 'application/pdf'),
        ])
        ->assertSuccessful()
        ->assertJsonPath('data.title', 'PDF Baslik')
        ->assertJsonPath('data.price', 8450000)
        ->assertJsonPath('data.room_count', '3+1')
        ->assertJsonPath('data.matched_consultant_id', $consultant->id);
});

test('admin can import listing data from url', function () {
    $admin = adminUser();
    $consultantName = 'Urlimport'.uniqid();
    $consultant = User::factory()->create([
        'role' => 'CONSULTANT',
        'name' => $consultantName,
        'surname' => 'Danisman',
    ]);

    $this->mock(UrlListingTextExtractor::class)
        ->shouldReceive('extract')
        ->once()
        ->with('https://www.sahibinden.com/ilan/test')
        ->andReturn('Sahibinden ilan metni');

    $this->mock(OpenAiListingExtractorService::class)
        ->shouldReceive('extract')
        ->once()
        ->with('Sahibinden ilan metni')
        ->andReturn([
            'title' => 'Link Baslik',
            'description' => 'Link aciklama',
            'price' => 4500000,
            'currency' => 'TRY',
            'listing_type' => 'SALE',
            'property_type' => 'APARTMENT',
            'city' => 'Kocaeli',
            'district' => 'Basiskele',
            'neighborhood' => 'Merkez',
            'address' => '',
            'gross_m2' => 120,
            'net_m2' => 100,
            'land_m2' => null,
            'room_count' => '3+1',
            'building_age' => '',
            'floor' => '',
            'total_floors' => '',
            'heating' => '',
            'bathroom_count' => 1,
            'kitchen' => '',
            'balcony' => true,
            'furnished' => false,
            'usage_status' => '',
            'site_name' => '',
            'dues' => null,
            'credit_eligible' => true,
            'deed_status' => '',
            'energy_certificate' => '',
            'seller_type' => '',
            'exchange' => null,
            'features' => [],
            'contact_name' => "{$consultantName} Danisman",
            'contact_phone' => '',
            'source_portal' => 'Sahibinden',
            'source_listing_no' => '999',
            'confidence' => [
                'title' => 0.9,
                'price' => 0.9,
                'location' => 0.8,
                'm2' => 0.8,
                'contact' => 0.8,
            ],
            'missing_fields' => [],
        ]);

    $this->actingAs($admin)
        ->postJson(route('admin.listings.import-url'), [
            'url' => 'https://www.sahibinden.com/ilan/test',
        ])
        ->assertSuccessful()
        ->assertJsonPath('data.title', 'Link Baslik')
        ->assertJsonPath('data.source_url', 'https://www.sahibinden.com/ilan/test')
        ->assertJsonPath('data.matched_consultant_id', $consultant->id);
});

test('listing pdf import only accepts pdf files', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->postJson(route('admin.listings.import-pdf'), [
            'pdf' => UploadedFile::fake()->image('listing.jpg'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('pdf');
});

test('listing pdf import returns a friendly error when openai key is missing', function () {
    config(['services.openai.api_key' => null]);

    $admin = adminUser();

    $this->mock(PdfListingTextExtractor::class)
        ->shouldReceive('extract')
        ->once()
        ->andReturn('PDF metni');

    $this->actingAs($admin)
        ->postJson(route('admin.listings.import-pdf'), [
            'pdf' => UploadedFile::fake()->create('listing.pdf', 100, 'application/pdf'),
        ])
        ->assertUnprocessable()
        ->assertJsonPath('message', 'OpenAI API anahtari tanimli degil.');
});

test('admin can create update and delete users', function () {
    $admin = adminUser();

    $this->actingAs($admin)
        ->post(route('admin.consultants.store'), [
            'name' => 'Test',
            'surname' => 'User',
            'username' => 'test.user',
            'email' => 'test.user@example.com',
            'password' => '1111',
            'role' => 'CONSULTANT',
            'title' => 'Danisman',
            'phone' => '+90 532 000 00 00',
            'region' => 'Kocaeli',
            'active' => 1,
            'permissions' => ['DASHBOARD_VIEW', 'LISTINGS_VIEW'],
        ])
        ->assertRedirect(route('admin.consultants.index'));

    $user = User::query()->where('email', 'test.user@example.com')->firstOrFail();
    $this->assertDatabaseHas('user_permissions', [
        'user_id' => $user->id,
        'permission' => 'DASHBOARD_VIEW',
    ]);

    $this->actingAs($admin)
        ->put(route('admin.consultants.update', $user), [
            'name' => 'Updated',
            'surname' => 'User',
            'username' => 'updated.user',
            'email' => 'updated.user@example.com',
            'role' => 'ADMIN',
            'title' => 'Admin',
            'active' => 1,
            'permissions' => ['DASHBOARD_VIEW', 'MESSAGES_VIEW'],
        ])
        ->assertRedirect(route('admin.consultants.index'));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated',
        'role' => 'ADMIN',
    ]);
    $this->assertDatabaseMissing('user_permissions', [
        'user_id' => $user->id,
        'permission' => 'LISTINGS_VIEW',
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.consultants.destroy', $user))
        ->assertRedirect(route('admin.consultants.index'));

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('admin can update and delete messages', function () {
    $admin = adminUser();
    $message = ContactRequest::factory()->create(['status' => 'UNREAD']);

    $this->actingAs($admin)
        ->put(route('admin.messages.update', $message), ['status' => 'READ'])
        ->assertRedirect(route('admin.messages.index'));

    $this->assertDatabaseHas('contact_requests', [
        'id' => $message->id,
        'status' => 'READ',
    ]);

    $this->actingAs($admin)
        ->delete(route('admin.messages.destroy', $message))
        ->assertRedirect(route('admin.messages.index'));

    $this->assertDatabaseMissing('contact_requests', ['id' => $message->id]);
});
