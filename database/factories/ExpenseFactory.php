<?php

namespace Database\Factories;

use App\Models\Expense;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
 */
class ExpenseFactory extends Factory
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
            'category' => 'court_fee',
            'description' => fake()->sentence(),
            'incurred_at' => now()->toDateString(),
            'amount' => 500_000,
            'currency' => 'IDR',
            'status' => 'draft',
            'created_by' => User::factory(),
        ];
    }
}
