<?php

namespace Database\Factories;

use App\Models\Correspondence;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Correspondence>
 */
class CorrespondenceFactory extends Factory
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
            'direction' => fake()->randomElement(['inbound', 'outbound']),
            'source' => 'manual',
            'subject' => fake()->sentence(4),
            'from_addresses' => [fake()->safeEmail()],
            'to_addresses' => [fake()->safeEmail()],
            'cc_addresses' => [],
            'body' => fake()->paragraph(),
            'occurred_at' => now(),
            'created_by' => User::factory(),
        ];
    }
}
