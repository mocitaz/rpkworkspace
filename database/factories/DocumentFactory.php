<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
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
            'document_type' => fake()->randomElement(['contract', 'legal_opinion', 'correspondence']),
            'status' => 'draft',
            'confidentiality_level' => 'standard',
            'created_by' => User::factory(),
        ];
    }
}
