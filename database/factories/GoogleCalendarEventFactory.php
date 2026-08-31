<?php

namespace Database\Factories;

use App\Models\GoogleCalendarConnection;
use App\Models\GoogleCalendarEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GoogleCalendarEvent>
 */
class GoogleCalendarEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'google_calendar_connection_id' => GoogleCalendarConnection::factory(),
            'source_type' => 'task',
            'source_id' => fake()->uuid(),
            'google_event_id' => fake()->uuid(),
            'content_hash' => fake()->sha256(),
        ];
    }
}
