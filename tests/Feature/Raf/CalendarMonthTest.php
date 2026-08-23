<?php

use App\Models\Deadline;
use App\Models\Matter;
use App\Models\MatterEvent;
use App\Models\Task;
use Carbon\CarbonImmutable;
use Inertia\Testing\AssertableInertia as Assert;

it('returns a complete calendar grid range for the requested month and only visible records', function () {
    $member = rafUser(['matter.view', 'task.view']);
    $outsider = rafUser(['matter.view']);
    $matter = Matter::factory()->recycle($member)->create();
    $matter->members()->attach($member, ['role' => 'member']);
    $hiddenMatter = Matter::factory()->recycle($outsider)->create(['confidentiality_level' => 'restricted']);
    $hiddenMatter->members()->attach($outsider, ['role' => 'member']);

    $dueAt = CarbonImmutable::parse('2026-09-15 10:00:00', config('raf.timezone'));
    Deadline::factory()->recycle([$matter, $member])->create(['matter_id' => $matter->getKey(), 'owner_id' => $member->getKey(), 'due_at' => $dueAt]);
    MatterEvent::factory()->recycle($matter)->create(['matter_id' => $matter->getKey(), 'starts_at' => $dueAt]);
    Task::factory()->recycle($member)->create(['assignee_id' => $member->getKey(), 'due_at' => $dueAt]);
    Deadline::factory()->recycle([$hiddenMatter, $outsider])->create(['matter_id' => $hiddenMatter->getKey(), 'owner_id' => $outsider->getKey(), 'due_at' => $dueAt]);

    $this->actingAs($member)->get(route('calendar.index', ['month' => '2026-09']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('calendar/index')
            ->where('month', '2026-09')
            ->where('range.from', '2026-08-31')
            ->where('range.until', '2026-10-04')
            ->has('deadlines', 1)
            ->has('events', 1)
            ->has('tasks', 1));
});
