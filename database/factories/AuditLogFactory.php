<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'actor_id' => User::factory(),
            'event' => 'test.recorded',
            'subject_type' => User::class,
            'subject_id' => '1',
            'metadata' => [],
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Pest',
            'created_at' => now(),
        ];
    }
}
