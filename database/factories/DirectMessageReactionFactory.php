<?php

namespace Database\Factories;

use App\Models\DirectMessage;
use App\Models\DirectMessageReaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DirectMessageReaction>
 */
class DirectMessageReactionFactory extends Factory
{
    protected $model = DirectMessageReaction::class;

    public function definition(): array
    {
        return [
            'direct_message_id' => DirectMessage::factory(),
            'user_id' => User::factory(),
            'reaction' => fake()->randomElement(['thumbs_up', 'heart', 'check', 'star']),
        ];
    }
}
