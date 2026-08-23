<?php

namespace Database\Factories;

use App\Models\Matter;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
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
            'title' => fake()->sentence(5),
            'description' => fake()->paragraph(),
            'assignee_id' => User::factory(),
            'reporter_id' => User::factory(),
            'status' => 'todo',
            'priority' => 'normal',
            'due_at' => now()->addDays(fake()->numberBetween(1, 20)),
        ];
    }
}
