<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Matter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        return [
            'commentable_type' => Matter::class,
            'commentable_id' => Matter::factory(),
            'parent_id' => null,
            'user_id' => User::factory(),
            'body' => fake()->paragraph(),
            'is_pinned' => false,
            'pinned_by' => null,
            'pinned_at' => null,
        ];
    }
}
