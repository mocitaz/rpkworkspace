<?php

namespace Database\Factories;

use App\Models\Deadline;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Deadline>
 */
class DeadlineFactory extends Factory
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
            'title' => fake()->sentence(4),
            'deadline_type' => fake()->randomElement(['filing', 'hearing', 'contractual', 'internal']),
            'due_at' => now()->addDays(fake()->numberBetween(2, 30)),
            'is_critical' => fake()->boolean(20),
            'owner_id' => User::factory(),
            'status' => 'open',
            'created_by' => User::factory(),
        ];
    }
}
