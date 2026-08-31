<?php

use App\Jobs\SyncGoogleCalendar;
use App\Models\GoogleCalendarConnection;
use App\Models\GoogleCalendarEvent;
use App\Models\Matter;
use App\Models\MatterEvent;
use App\Services\GoogleCalendarService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    config()->set('services.google_calendar', [
        'client_id' => 'google-client-id',
        'client_secret' => 'google-client-secret',
        'redirect_uri' => 'https://workspace.test/calendar/google/callback',
    ]);
});

it('starts Google OAuth with a protected state and narrow calendar scope', function () {
    $user = rafUser(['calendar.view']);

    $response = $this->actingAs($user)->get(route('calendar.google.redirect'));

    $response->assertRedirectContains('accounts.google.com/o/oauth2/v2/auth');
    $location = $response->headers->get('Location');
    parse_str((string) parse_url($location, PHP_URL_QUERY), $query);

    expect($query['client_id'])->toBe('google-client-id')
        ->and($query['scope'])->toContain('calendar.app.created')
        ->and($query['access_type'])->toBe('offline')
        ->and(session('google_calendar_oauth_state'))->toBe($query['state']);
});

it('stores encrypted OAuth credentials and queues the first synchronization', function () {
    Queue::fake();
    Http::fake([
        'oauth2.googleapis.com/token' => Http::response([
            'access_token' => 'access-secret',
            'refresh_token' => 'refresh-secret',
            'expires_in' => 3600,
        ]),
        'openidconnect.googleapis.com/v1/userinfo' => Http::response([
            'email' => 'advokat@example.com',
        ]),
    ]);
    $user = rafUser(['calendar.view']);

    $this->actingAs($user)
        ->withSession(['google_calendar_oauth_state' => 'valid-state'])
        ->get(route('calendar.google.callback', ['state' => 'valid-state', 'code' => 'oauth-code']))
        ->assertRedirect(route('calendar.index'));

    $connection = GoogleCalendarConnection::query()->sole();
    expect($connection->google_account_email)->toBe('advokat@example.com')
        ->and($connection->access_token)->toBe('access-secret')
        ->and($connection->refresh_token)->toBe('refresh-secret')
        ->and($connection->getRawOriginal('access_token'))->not->toBe('access-secret');
    Queue::assertPushed(SyncGoogleCalendar::class, fn (SyncGoogleCalendar $job) => $job->connectionId === $connection->getKey());
});

it('keeps the existing refresh token when Google omits it during reconnection', function () {
    Http::fake([
        'oauth2.googleapis.com/token' => Http::response([
            'access_token' => 'new-access-secret',
            'expires_in' => 3600,
        ]),
        'openidconnect.googleapis.com/v1/userinfo' => Http::response([
            'email' => 'advokat@example.com',
        ]),
    ]);
    $user = rafUser(['calendar.view']);
    GoogleCalendarConnection::factory()->for($user)->create([
        'refresh_token' => 'existing-refresh-secret',
    ]);

    app(GoogleCalendarService::class)->connect($user, 'oauth-code');

    expect(GoogleCalendarConnection::query()->sole()->refresh_token)
        ->toBe('existing-refresh-secret');
});

it('rejects an OAuth callback with an invalid state', function () {
    $user = rafUser(['calendar.view']);

    $this->actingAs($user)
        ->withSession(['google_calendar_oauth_state' => 'expected'])
        ->get(route('calendar.google.callback', ['state' => 'different', 'code' => 'oauth-code']))
        ->assertStatus(419);
});

it('creates one private Google event and does not duplicate unchanged content', function () {
    Http::fake([
        'www.googleapis.com/calendar/v3/calendars/*/events' => Http::response(['id' => 'google-event-1']),
    ]);
    $user = rafUser(['matter.view', 'matter.view.all', 'calendar.view']);
    $matter = Matter::factory()->recycle($user)->create();
    $event = MatterEvent::factory()->recycle($matter)->create([
        'matter_id' => $matter->getKey(),
        'title' => 'Sidang Rahasia Klien',
        'starts_at' => now()->addDay(),
    ]);
    $connection = GoogleCalendarConnection::factory()->for($user)->create([
        'privacy_mode' => 'limited',
        'sync_deadlines' => false,
        'sync_tasks' => false,
    ]);

    $service = app(GoogleCalendarService::class);
    $service->sync($connection);
    $service->sync($connection->fresh());

    expect(GoogleCalendarEvent::query()->count())->toBe(1)
        ->and(GoogleCalendarEvent::query()->sole()->source_id)->toBe($event->getKey());

    Http::assertSentCount(1);
    Http::assertSent(fn ($request) => $request->method() === 'POST'
        && $request['summary'] === 'Agenda Perkara RPK'
        && $request['visibility'] === 'private'
        && ! str_contains($request['summary'], 'Sidang Rahasia Klien'));
});

it('keeps a stale mapping when Google fails to delete the remote event', function () {
    Http::fake([
        'www.googleapis.com/calendar/v3/calendars/*/events/*' => Http::response([], 500),
    ]);
    $user = rafUser(['matter.view']);
    $connection = GoogleCalendarConnection::factory()->for($user)->create([
        'sync_events' => false,
        'sync_deadlines' => false,
        'sync_tasks' => false,
    ]);
    GoogleCalendarEvent::factory()->for($connection, 'connection')->create();

    expect(fn () => app(GoogleCalendarService::class)->sync($connection))
        ->toThrow(Exception::class)
        ->and(GoogleCalendarEvent::query()->count())->toBe(1);
});

it('exposes connection status on Calendar and protects settings by current user', function () {
    Queue::fake();
    $user = rafUser(['calendar.view']);
    $other = rafUser(['calendar.view']);
    GoogleCalendarConnection::factory()->for($user)->create(['privacy_mode' => 'limited']);
    GoogleCalendarConnection::factory()->for($other)->create(['privacy_mode' => 'private']);

    $this->actingAs($user)->get(route('calendar.index'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('googleCalendar.configured', true)
            ->where('googleCalendar.connection.privacy_mode', 'limited'));

    $this->actingAs($user)->put(route('calendar.google.update'), [
        'privacy_mode' => 'full',
        'sync_events' => true,
        'sync_deadlines' => false,
        'sync_tasks' => true,
    ])->assertRedirect();

    expect(GoogleCalendarConnection::query()->whereBelongsTo($user)->sole()->privacy_mode)->toBe('full')
        ->and(GoogleCalendarConnection::query()->whereBelongsTo($other)->sole()->privacy_mode)->toBe('private');
    Queue::assertPushed(SyncGoogleCalendar::class);
});

it('queues connected calendars when a calendar source changes', function () {
    Queue::fake();
    $user = rafUser(['matter.view', 'matter.view.all']);
    $matter = Matter::factory()->recycle($user)->create();
    $connection = GoogleCalendarConnection::factory()->for($user)->create();

    MatterEvent::factory()->recycle($matter)->create(['matter_id' => $matter->getKey()]);

    Queue::assertPushed(SyncGoogleCalendar::class, fn (SyncGoogleCalendar $job) => $job->connectionId === $connection->getKey());
});
