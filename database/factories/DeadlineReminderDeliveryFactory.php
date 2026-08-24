<?php

namespace Database\Factories;

use App\Models\Deadline;
use App\Models\DeadlineReminderDelivery;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DeadlineReminderDelivery>
 */
class DeadlineReminderDeliveryFactory extends Factory
{
    protected $model = DeadlineReminderDelivery::class;

    public function definition(): array
    {
        return [
            'deadline_id' => Deadline::factory(),
            'user_id' => User::factory(),
            'hours_before' => fake()->randomElement([24, 48, 72, 168]),
        ];
    }
}
