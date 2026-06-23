<?php

use App\Models\City;
use App\Models\District;
use App\Models\Neighborhood;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('public real estate pages render through inertia', function (string $url, string $component) {
    $this->get($url)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['/', 'site/home'],
    ['/about', 'site/about'],
    ['/contact', 'site/contact'],
    ['/admin/login', 'site/admin-login'],
]);

test('public listings page renders database backed listings', function () {
    $consultant = User::factory()->create([
        'role' => 'CONSULTANT',
        'active' => true,
    ]);
    $property = Property::factory()->for($consultant, 'consultant')->create([
        'status' => 'ACTIVE',
        'title' => 'Active Public Listing',
    ]);
    PropertyImage::factory()->for($property)->create(['sort_order' => 0]);

    $this->get(route('listings.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/listings')
            ->has('properties', 1)
            ->where('properties.0.title', 'Active Public Listing'));
});

test('home page exposes portfolio search options', function () {
    City::query()->create([
        'source_id' => 41,
        'name' => 'Kocaeli',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/home')
            ->has('filterOptions.cities', 1)
            ->where('filterOptions.cities.0.name', 'Kocaeli')
            ->where('filterOptions.listingTypes.SALE', fn (string $label): bool => $label !== '')
            ->where('filterOptions.propertyTypes.APARTMENT', 'Daire'));
});

test('public listings page filters by location ids from portfolio search', function () {
    $consultant = User::factory()->create([
        'role' => 'CONSULTANT',
        'active' => true,
    ]);
    $city = City::query()->create([
        'source_id' => 41,
        'name' => 'Kocaeli',
    ]);
    $district = District::query()->create([
        'city_id' => $city->id,
        'source_id' => 1,
        'name' => 'Izmit',
    ]);
    $neighborhood = Neighborhood::query()->create([
        'district_id' => $district->id,
        'source_id' => 1,
        'source_semt_id' => 1,
        'name' => 'Yahya Kaptan',
    ]);

    $matchingProperty = Property::factory()->for($consultant, 'consultant')->create([
        'status' => 'ACTIVE',
        'title' => 'Matching Location Id Listing',
        'city_id' => $city->id,
        'district_id' => $district->id,
        'neighborhood_id' => $neighborhood->id,
    ]);
    PropertyImage::factory()->for($matchingProperty)->create(['sort_order' => 0]);

    Property::factory()->for($consultant, 'consultant')->create([
        'status' => 'ACTIVE',
        'title' => 'Different Location Id Listing',
    ]);

    $this->get(route('listings.index', [
        'cityId' => $city->id,
        'districtId' => $district->id,
        'neighborhoodId' => $neighborhood->id,
    ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/listings')
            ->where('filters.cityId', fn (int|string $cityId): bool => (int) $cityId === $city->id)
            ->where('filters.districtId', fn (int|string $districtId): bool => (int) $districtId === $district->id)
            ->where('filters.neighborhoodId', fn (int|string $neighborhoodId): bool => (int) $neighborhoodId === $neighborhood->id)
            ->has('properties', 1)
            ->where('properties.0.title', 'Matching Location Id Listing'));
});

test('public listings page filters by location type and price range', function () {
    $consultant = User::factory()->create([
        'role' => 'CONSULTANT',
        'active' => true,
    ]);

    $matchingProperty = Property::factory()->for($consultant, 'consultant')->create([
        'status' => 'ACTIVE',
        'title' => 'Matching Filtered Listing',
        'city' => 'Kocaeli',
        'district' => 'İzmit',
        'listing_type' => 'SALE',
        'property_type' => 'APARTMENT',
        'price' => 2500000,
    ]);
    PropertyImage::factory()->for($matchingProperty)->create(['sort_order' => 0]);

    Property::factory()->for($consultant, 'consultant')->create([
        'status' => 'ACTIVE',
        'title' => 'Outside Price Listing',
        'city' => 'Kocaeli',
        'district' => 'İzmit',
        'listing_type' => 'SALE',
        'property_type' => 'APARTMENT',
        'price' => 9000000,
    ]);

    Property::factory()->for($consultant, 'consultant')->create([
        'status' => 'ACTIVE',
        'title' => 'Different District Listing',
        'city' => 'Kocaeli',
        'district' => 'Kartepe',
        'listing_type' => 'SALE',
        'property_type' => 'APARTMENT',
        'price' => 2500000,
    ]);

    $this->get(route('listings.index', [
        'city' => 'Kocaeli',
        'district' => 'İzmit',
        'listingType' => 'SALE',
        'propertyType' => 'APARTMENT',
        'minPrice' => 1000000,
        'maxPrice' => 3000000,
    ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/listings')
            ->where('filters.city', 'Kocaeli')
            ->where('filters.district', 'İzmit')
            ->where('filters.minPrice', '1000000')
            ->where('filters.maxPrice', '3000000')
            ->has('properties', 1)
            ->where('properties.0.title', 'Matching Filtered Listing'));
});

test('public listings price filters must be numeric', function () {
    $this->from(route('home'))
        ->get(route('listings.index', ['minPrice' => 'not-a-number']))
        ->assertRedirect(route('home'))
        ->assertSessionHasErrors('minPrice');
});

test('public listing detail exposes consultant portfolio link data', function () {
    $consultant = User::factory()->create([
        'slug' => 'detail-consultant',
        'role' => 'CONSULTANT',
        'active' => true,
    ]);
    $property = Property::factory()->for($consultant, 'consultant')->create([
        'slug' => 'active-public-listing',
        'status' => 'ACTIVE',
        'city' => 'Kocaeli',
        'district' => 'Izmit',
    ]);
    PropertyImage::factory()
        ->for($property)
        ->count(7)
        ->sequence(fn ($sequence) => ['sort_order' => $sequence->index])
        ->create();
    $relatedProperty = Property::factory()->for($consultant, 'consultant')->create([
        'status' => 'ACTIVE',
        'title' => 'Related Public Listing',
        'city' => 'Kocaeli',
        'district' => 'Izmit',
    ]);
    PropertyImage::factory()->for($relatedProperty)->create(['sort_order' => 0]);

    $this->get(route('listings.show', $property->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/listing-detail')
            ->where('property.advisor.slug', 'detail-consultant')
            ->where('property.advisor.url', route('consultants.show', ['consultant' => 'detail-consultant']))
            ->has('property.gallery', 7)
            ->has('relatedProperties', 1)
            ->where('relatedProperties.0.title', 'Related Public Listing'));
});

test('consultant portfolio page lists only active listings for that consultant', function () {
    $consultant = User::factory()->create([
        'slug' => 'test-consultant',
        'role' => 'CONSULTANT',
        'active' => true,
    ]);
    $otherConsultant = User::factory()->create([
        'role' => 'CONSULTANT',
        'active' => true,
    ]);

    $activeProperty = Property::factory()->for($consultant, 'consultant')->create([
        'status' => 'ACTIVE',
        'title' => 'Active Consultant Listing',
    ]);
    PropertyImage::factory()->for($activeProperty)->create(['sort_order' => 0]);

    Property::factory()->for($consultant, 'consultant')->create([
        'status' => 'PASSIVE',
        'title' => 'Passive Consultant Listing',
    ]);
    Property::factory()->for($otherConsultant, 'consultant')->create([
        'status' => 'ACTIVE',
        'title' => 'Other Consultant Listing',
    ]);

    $this->get(route('consultants.show', ['consultant' => $consultant->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/consultant-portfolio')
            ->where('consultant.slug', 'test-consultant')
            ->has('properties', 1)
            ->where('properties.0.title', 'Active Consultant Listing'));
});

test('consultant portfolio page can render an empty active portfolio', function () {
    $consultant = User::factory()->create([
        'slug' => 'empty-consultant',
        'role' => 'CONSULTANT',
        'active' => true,
    ]);

    Property::factory()->for($consultant, 'consultant')->create([
        'status' => 'PASSIVE',
    ]);

    $this->get(route('consultants.show', ['consultant' => $consultant->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('site/consultant-portfolio')
            ->has('properties', 0));
});
