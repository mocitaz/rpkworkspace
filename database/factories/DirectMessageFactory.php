<?php

namespace Database\Factories;

use App\Models\DirectMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DirectMessage>
 */
class DirectMessageFactory extends Factory
{
    protected $model = DirectMessage::class;

    public function definition(): array
    {
        return [
            'sender_id' => User::factory(),
            'recipient_id' => User::factory(),
            'reply_to_id' => null,
            'message' => fake()->paragraph(),
            'read_at' => fake()->boolean(70) ? now()->subMinutes(fake()->numberBetween(5, 300)) : null,
        ];
    }
}
