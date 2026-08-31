<?php

namespace Database\Factories;

use App\Models\GoogleCalendarConnection;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GoogleCalendarConnection>
 */
class GoogleCalendarConnectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'google_account_email' => fake()->safeEmail(),
            'access_token' => fake()->sha256(),
            'refresh_token' => fake()->sha256(),
            'token_expires_at' => now()->addHour(),
            'calendar_id' => fake()->uuid().'@group.calendar.google.com',
            'calendar_name' => 'RPK Workspace',
            'privacy_mode' => 'limited',
            'sync_events' => true,
            'sync_deadlines' => true,
            'sync_tasks' => true,
            'is_active' => true,
        ];
    }
}
