<?php

namespace Database\Factories;

use App\Models\Matter;
use App\Models\MatterEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MatterEvent>
 */
class MatterEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'matter_id' => Matter::factory(),
            'event_type' => fake()->randomElement(['hearing', 'meeting', 'filing', 'signing']),
            'title' => fake()->sentence(4),
            'starts_at' => now()->addDays(fake()->numberBetween(1, 30)),
            'created_by' => User::factory(),
        ];
    }
}
