<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Quotation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Quotation>
 */
class QuotationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'quotation_number' => 'QT-'.fake()->unique()->numerify('####-####'),
            'client_id' => Client::factory(),
            'title' => fake()->sentence(4),
            'status' => 'draft',
            'currency' => 'IDR',
            'issued_at' => now()->toDateString(),
            'valid_until' => now()->addDays(30)->toDateString(),
            'created_by' => User::factory(),
        ];
    }
}
