<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_number' => 'INV-'.fake()->unique()->numerify('####-####'),
            'client_id' => Client::factory(),
            'matter_id' => Matter::factory(),
            'title' => fake()->sentence(4),
            'status' => 'draft',
            'currency' => 'IDR',
            'total_amount' => 1_000_000,
            'outstanding_amount' => 1_000_000,
            'created_by' => User::factory(),
        ];
    }
}
