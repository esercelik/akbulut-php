<?php

use App\Models\City;
use App\Models\ContactRequest;
use App\Models\District;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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
