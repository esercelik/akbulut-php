<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated admins can visit the dashboard', function () {
    $user = User::factory()->create(['role' => 'SUPER_ADMIN']);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->has('stats.totalListings')
            ->has('recentListings')
            ->has('consultantSummaries'));
});

test('admin panel pages render through inertia', function (string $routeName, string $component) {
    $user = User::factory()->create(['role' => 'SUPER_ADMIN']);

    $this->actingAs($user)
        ->get(route($routeName))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['admin.dashboard', 'admin/dashboard'],
    ['admin.listings.index', 'admin/listings'],
    ['admin.consultants.index', 'admin/consultants'],
    ['admin.messages.index', 'admin/messages'],
    ['admin.settings.index', 'admin/settings'],
]);

test('users without dashboard permission cannot visit the admin dashboard', function () {
    $user = User::factory()->create(['role' => 'CONSULTANT']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertForbidden();
});
