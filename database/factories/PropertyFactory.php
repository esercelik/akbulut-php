<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraphs(3, true),
            'price' => fake()->numberBetween(25000, 20000000),
            'city' => fake()->city(),
            'district' => fake()->citySuffix(),
            'neighborhood' => fake()->streetName(),
            'address' => fake()->address(),
            'property_type' => fake()->randomElement(['APARTMENT', 'VILLA', 'OFFICE', 'SHOP', 'LAND']),
            'listing_type' => fake()->randomElement(['SALE', 'RENT']),
            'square_meters' => fake()->numberBetween(60, 500),
            'room_count' => fake()->randomElement(['1+1', '2+1', '3+1', '4+1', '5+1']),
            'building_age' => fake()->optional()->randomElement(['0', '1-5', '6-10', '11-15', '16+']),
            'floor' => fake()->optional()->randomElement(['Bahçe', '1', '2', '3', 'Ara Kat']),
            'total_floors' => fake()->optional()->numberBetween(1, 20),
            'heating' => fake()->optional()->randomElement(['Kombi', 'Merkezi', 'Klima']),
            'bathroom_count' => fake()->numberBetween(1, 4),
            'balcony' => fake()->boolean(),
            'furnished' => fake()->boolean(),
            'usage_status' => fake()->optional()->randomElement(['EMPTY', 'TENANTED', 'OWNER_OCCUPIED']),
            'deed_status' => fake()->optional()->randomElement(['Kat Mülkiyetli', 'Kat İrtifaklı', 'Arsa Tapulu']),
            'credit_eligible' => fake()->boolean(),
            'status' => 'ACTIVE',
            'featured' => fake()->boolean(20),
            'consultant_id' => User::factory(),
        ];
    }
}
