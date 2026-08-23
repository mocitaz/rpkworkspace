<?php

namespace Database\Factories;

use App\DocumentNumberType;
use App\Models\DocumentNumberSequence;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentNumberSequence>
 */
class DocumentNumberSequenceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(DocumentNumberType::cases())->value,
            'year' => (int) now(config('raf.timezone'))->format('Y'),
            'next_value' => 1,
        ];
    }
}
