<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserPermission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserPermission>
 */
class UserPermissionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'permission' => fake()->randomElement([
                'DASHBOARD_VIEW',
                'LISTINGS_VIEW',
                'LISTINGS_CREATE',
                'LISTINGS_EDIT',
                'MESSAGES_VIEW',
            ]),
            'allowed' => true,
        ];
    }
}
