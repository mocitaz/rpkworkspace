<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'currency' => 'IDR',
            'amount' => 1_000_000,
            'method' => 'bank_transfer',
            'received_at' => now(),
            'recorded_by' => User::factory(),
        ];
    }
}
