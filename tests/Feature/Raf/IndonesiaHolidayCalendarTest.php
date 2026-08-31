<?php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    config()->set('services.indonesia_holidays', [
        'url' => 'https://use.apiindonesia.id/api/v1/libur',
        'key' => 'holiday-test-key',
    ]);

    Cache::flush();
});

it('shows Indonesian national holidays for the requested calendar year', function () {
    Http::fake([
        'use.apiindonesia.id/*' => Http::response([
            'data' => [
                [
                    'id' => 'hol_2026_014',
                    'date' => '2026-08-17',
                    'name' => 'Hari Kemerdekaan Republik Indonesia',
                    'type' => 'nasional',
                    'is_joint_leave' => 0,
                    'description' => null,
                    'source' => 'SKB 3 Menteri',
                    'year' => 2026,
                    'is_active' => 1,
                ],
            ],
        ]),
    ]);

    $user = rafUser(['matter.view', 'task.view']);

    $this->actingAs($user)
        ->get(route('calendar.index', ['month' => '2026-08']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('holidays.0.date', '2026-08-17')
            ->where('holidays.0.name', 'Hari Kemerdekaan Republik Indonesia')
            ->where('holidays.0.is_joint_leave', false));
});

it('caches national holidays by year instead of calling the provider on every visit', function () {
    Http::fake([
        'use.apiindonesia.id/*' => Http::response(['data' => []]),
    ]);

    $user = rafUser(['matter.view', 'task.view']);

    $this->actingAs($user)->get(route('calendar.index', ['month' => '2026-08']))->assertSuccessful();
    expect(Cache::has('indonesia-holidays:2026'))->toBeTrue();
    $this->actingAs($user)->get(route('calendar.index', ['month' => '2026-09']))->assertSuccessful();

    $holidayRequests = Http::recorded()->filter(
        fn (array $pair): bool => str_starts_with($pair[0]->url(), 'https://use.apiindonesia.id/'),
    );

    expect($holidayRequests)->toHaveCount(1);
});

it('keeps the calendar available when the holiday provider fails', function () {
    Http::fake([
        'use.apiindonesia.id/*' => Http::response(['message' => 'Unavailable'], 503),
    ]);

    $user = rafUser(['matter.view', 'task.view']);

    $this->actingAs($user)
        ->get(route('calendar.index', ['month' => '2026-08']))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->where('holidays', []));
});
