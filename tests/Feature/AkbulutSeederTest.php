<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('database seeder inserts the akbulut seed data', function () {
    $this->seed();

    expect(DB::table('users')->count())->toBe(9)
        ->and(DB::table('properties')->count())->toBe(8)
        ->and(DB::table('property_images')->count())->toBe(24)
        ->and(DB::table('contact_requests')->count())->toBe(2)
        ->and(DB::table('cities')->count())->toBe(81)
        ->and(DB::table('districts')->count())->toBe(973)
        ->and(DB::table('neighborhoods')->count())->toBe(49655);

    $admin = DB::table('users')->where('username', 'admin')->first();

    expect($admin)->not->toBeNull()
        ->and($admin->role)->toBe('SUPER_ADMIN')
        ->and(Hash::check('1111', $admin->password))->toBeTrue()
        ->and(DB::table('user_permissions')->where('user_id', $admin->id)->count())->toBe(19);

    $consultant = DB::table('users')->where('slug', 'eser-celik')->first();

    expect($consultant)->not->toBeNull()
        ->and($consultant->name)->toBe('Eser')
        ->and($consultant->surname)->toBe('Çelik')
        ->and($consultant->role)->toBe('CONSULTANT');

    $featuredRent = DB::table('properties')
        ->where('slug', 'darica-deniz-yakini-kiralik-daire')
        ->first();

    expect($featuredRent)->not->toBeNull()
        ->and((bool) $featuredRent->featured)->toBeTrue()
        ->and((bool) $featuredRent->furnished)->toBeTrue()
        ->and((bool) $featuredRent->credit_eligible)->toBeFalse()
        ->and($featuredRent->city_id)->not->toBeNull()
        ->and($featuredRent->district_id)->not->toBeNull()
        ->and($featuredRent->neighborhood_id)->not->toBeNull();
});
