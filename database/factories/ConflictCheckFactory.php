<?php

namespace Database\Factories;

use App\Models\ConflictCheck;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ConflictCheck>
 */
class ConflictCheckFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subject_name' => fake()->company(),
            'searched_names' => [fake()->company(), fake()->name()],
            'matches' => [],
            'status' => 'clear',
            'decision' => 'pending',
            'requested_by' => User::factory(),
        ];
    }
}
