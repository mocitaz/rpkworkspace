<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InvoiceLineItem>
 */
class InvoiceLineItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory(),
            'description' => fake()->sentence(),
            'quantity' => 1,
            'unit_amount' => 1_000_000,
            'total_amount' => 1_000_000,
            'sort_order' => 0,
        ];
    }
}
