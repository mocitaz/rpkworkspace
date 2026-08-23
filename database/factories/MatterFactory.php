<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Matter;
use App\Models\PracticeArea;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Matter>
 */
class MatterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'matter_number' => 'RAF-'.now()->format('Y').'-'.fake()->unique()->numerify('####'),
            'title' => fake()->randomElement(['Commercial Agreement Review', 'Corporate Restructuring', 'Employment Advisory', 'Commercial Dispute']),
            'client_id' => Client::factory(),
            'summary' => fake()->paragraph(),
            'practice_area_id' => PracticeArea::factory(),
            'matter_type' => 'Advisory',
            'status' => 'active',
            'priority' => 'normal',
            'confidentiality_level' => 'standard',
            'responsible_partner_id' => User::factory(),
            'opened_at' => now()->subMonth(),
            'created_by' => User::factory(),
        ];
    }
}
