<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_number' => 'RPK-C-'.now()->format('Y').'-'.fake()->unique()->numerify('######'),
            'type' => 'organization',
            'legal_name' => fake()->unique()->company(),
            'display_name' => fake()->company(),
            'industry' => fake()->randomElement(['Energi', 'Teknologi', 'Properti', 'Manufaktur']),
            'email' => fake()->companyEmail(),
            'city' => fake()->city(),
            'country_code' => 'ID',
            'status' => 'active',
            'opened_at' => now()->subMonths(2),
            'relationship_partner_id' => User::factory(),
            'created_by' => User::factory(),
        ];
    }
}
