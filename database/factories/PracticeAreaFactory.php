<?php

namespace Database\Factories;

use App\Models\PracticeArea;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<PracticeArea>
 */
class PracticeAreaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $name = fake()->unique()->company(),
            'slug' => Str::slug($name),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(1, 20),
        ];
    }
}
