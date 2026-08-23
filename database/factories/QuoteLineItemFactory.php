<?php

namespace Database\Factories;

use App\Models\Quotation;
use App\Models\QuoteLineItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuoteLineItem>
 */
class QuoteLineItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'quotation_id' => Quotation::factory(),
            'description' => fake()->sentence(),
            'quantity' => 1,
            'unit_amount' => 1_000_000,
            'total_amount' => 1_000_000,
            'sort_order' => 0,
        ];
    }
}
