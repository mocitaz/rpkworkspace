<?php

namespace App\Http\Controllers;

use App\Jobs\SyncGoogleCalendar;
use App\Models\GoogleCalendarConnection;
use App\Services\GoogleCalendarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GoogleCalendarController extends Controller
{
    public function redirect(Request $request, GoogleCalendarService $service): RedirectResponse
    {
        $state = Str::random(40);
        $request->session()->put('google_calendar_oauth_state', $state);

        return redirect()->away($service->authorizationUrl($state));
    }

    public function callback(Request $request, GoogleCalendarService $service): RedirectResponse
    {
        abort_unless(
            is_string($request->query('state'))
            && hash_equals((string) $request->session()->pull('google_calendar_oauth_state'), $request->query('state')),
            419,
        );

        if ($request->filled('error')) {
            return redirect()->route('calendar.index')->with('error', 'Akses Google Calendar dibatalkan.');
        }

        $request->validate(['code' => ['required', 'string']]);
        $connection = $service->connect($request->user(), $request->string('code')->toString());
        SyncGoogleCalendar::dispatch($connection->getKey());

        return redirect()->route('calendar.index')->with('success', 'Google Calendar berhasil dihubungkan dan sinkronisasi dimulai.');
    }

    public function update(Request $request): RedirectResponse
    {
        $connection = $this->connection($request);
        $attributes = $request->validate([
            'privacy_mode' => ['required', 'in:full,limited,private'],
            'sync_events' => ['required', 'boolean'],
            'sync_deadlines' => ['required', 'boolean'],
            'sync_tasks' => ['required', 'boolean'],
        ]);

        $connection->update($attributes);
        SyncGoogleCalendar::dispatch($connection->getKey());

        return back()->with('success', 'Pengaturan Google Calendar diperbarui.');
    }

    public function sync(Request $request): RedirectResponse
    {
        $connection = $this->connection($request);
        SyncGoogleCalendar::dispatch($connection->getKey());

        return back()->with('success', 'Sinkronisasi Google Calendar dijadwalkan.');
    }

    public function destroy(Request $request, GoogleCalendarService $service): RedirectResponse
    {
        $service->disconnect($this->connection($request));

        return back()->with('success', 'Google Calendar berhasil diputuskan.');
    }

    private function connection(Request $request): GoogleCalendarConnection
    {
        return GoogleCalendarConnection::query()->where('user_id', $request->user()->getKey())->sole();
    }
}
