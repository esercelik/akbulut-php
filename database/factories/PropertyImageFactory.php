<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PropertyImage>
 */
class PropertyImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'image_url' => fake()->imageUrl(1400, 900, 'real estate'),
            'alt' => fake()->sentence(3),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
