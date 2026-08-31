<?php

namespace App\Services;

use App\Models\Deadline;
use App\Models\GoogleCalendarConnection;
use App\Models\GoogleCalendarEvent;
use App\Models\Matter;
use App\Models\MatterEvent;
use App\Models\Task;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class GoogleCalendarService
{
    private const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';

    private const API_URL = 'https://www.googleapis.com/calendar/v3';

    public function authorizationUrl(string $state): string
    {
        $this->ensureConfigured();

        return self::AUTH_URL.'?'.http_build_query([
            'client_id' => config('services.google_calendar.client_id'),
            'redirect_uri' => $this->redirectUri(),
            'response_type' => 'code',
            'scope' => 'openid email https://www.googleapis.com/auth/calendar.app.created',
            'access_type' => 'offline',
            'prompt' => 'consent',
            'include_granted_scopes' => 'true',
            'state' => $state,
        ], '', '&', PHP_QUERY_RFC3986);
    }

    public function connect(User $user, string $code): GoogleCalendarConnection
    {
        $this->ensureConfigured();
        $token = Http::asForm()->post(self::TOKEN_URL, [
            'client_id' => config('services.google_calendar.client_id'),
            'client_secret' => config('services.google_calendar.client_secret'),
            'redirect_uri' => $this->redirectUri(),
            'grant_type' => 'authorization_code',
            'code' => $code,
        ])->throw()->json();

        $profile = Http::withToken($token['access_token'])
            ->get('https://openidconnect.googleapis.com/v1/userinfo')
            ->throw()
            ->json();

        $connection = GoogleCalendarConnection::query()->firstOrNew(['user_id' => $user->getKey()]);
        $connection->fill([
            'google_account_email' => $profile['email'] ?? null,
            'access_token' => $token['access_token'],
            'token_expires_at' => now()->addSeconds((int) ($token['expires_in'] ?? 3600)),
            'is_active' => true,
            'last_error' => null,
        ]);

        if (! empty($token['refresh_token'])) {
            $connection->refresh_token = $token['refresh_token'];
        }

        $connection->save();

        return $connection;
    }

    public function sync(GoogleCalendarConnection $connection): void
    {
        $connection->loadMissing('user');
        $calendarId = $this->ensureCalendar($connection);
        $sources = $this->sourcesFor($connection);
        $activeKeys = [];

        foreach ($sources as [$type, $source]) {
            $activeKeys[] = $type.':'.$source->getKey();
            $payload = $this->eventPayload($connection, $type, $source);
            $hash = hash('sha256', json_encode($payload, JSON_THROW_ON_ERROR));
            $mapping = $connection->events()
                ->where('source_type', $type)
                ->where('source_id', $source->getKey())
                ->first();

            if ($mapping?->content_hash === $hash) {
                continue;
            }

            $googleEventId = $mapping
                ? $this->updateEvent($connection, $calendarId, $mapping, $payload)
                : $this->createEvent($connection, $calendarId, $payload);

            $connection->events()->updateOrCreate(
                ['source_type' => $type, 'source_id' => $source->getKey()],
                ['google_event_id' => $googleEventId, 'content_hash' => $hash],
            );
        }

        $connection->events()->get()->each(function (GoogleCalendarEvent $mapping) use ($activeKeys, $connection, $calendarId): void {
            if (in_array($mapping->source_type.':'.$mapping->source_id, $activeKeys, true)) {
                return;
            }

            $response = $this->request($connection)
                ->delete($this->eventEndpoint($calendarId, $mapping->google_event_id));

            if (! $response->notFound()) {
                $response->throw();
            }

            $mapping->delete();
        });

        $connection->forceFill(['last_synced_at' => now(), 'last_error' => null])->save();
    }

    public function disconnect(GoogleCalendarConnection $connection): void
    {
        if ($connection->calendar_id) {
            $this->request($connection)->delete(self::API_URL.'/calendars/'.rawurlencode($connection->calendar_id));
        }

        Http::asForm()->post('https://oauth2.googleapis.com/revoke', ['token' => $connection->access_token]);
        $connection->delete();
    }

    private function ensureCalendar(GoogleCalendarConnection $connection): string
    {
        if ($connection->calendar_id) {
            return $connection->calendar_id;
        }

        $response = $this->request($connection)->post(self::API_URL.'/calendars', [
            'summary' => $connection->calendar_name.' — '.$connection->user->name,
            'description' => 'Kalender kerja resmi yang dikelola otomatis oleh RPK Workspace.',
            'timeZone' => config('raf.timezone'),
        ])->throw()->json();

        $connection->forceFill(['calendar_id' => $response['id']])->save();

        return $response['id'];
    }

    /** @return list<array{0: string, 1: Model}> */
    private function sourcesFor(GoogleCalendarConnection $connection): array
    {
        $user = $connection->user;
        $matterIds = Matter::query()->visibleTo($user)->select('id');
        $from = CarbonImmutable::now()->subDays(30)->startOfDay();
        $until = CarbonImmutable::now()->addYear()->endOfDay();
        $sources = [];

        if ($connection->sync_events) {
            MatterEvent::query()->with('matter:id,matter_number,title')->whereIn('matter_id', clone $matterIds)
                ->whereBetween('starts_at', [$from, $until])->each(function (MatterEvent $event) use (&$sources): void {
                    $sources[] = ['event', $event];
                });
        }

        if ($connection->sync_deadlines) {
            Deadline::query()->with('matter:id,matter_number,title')->whereIn('matter_id', clone $matterIds)
                ->whereBetween('due_at', [$from, $until])->whereNotIn('status', ['cancelled'])
                ->each(function (Deadline $deadline) use (&$sources): void {
                    $sources[] = ['deadline', $deadline];
                });
        }

        if ($connection->sync_tasks) {
            Task::query()->with('matter:id,matter_number,title')
                ->where(function ($query) use ($user, $matterIds): void {
                    $query->where('assignee_id', $user->getKey())
                        ->orWhere('reporter_id', $user->getKey())
                        ->orWhere('reviewer_id', $user->getKey())
                        ->orWhereIn('matter_id', clone $matterIds)
                        ->orWhereNull('matter_id');
                })
                ->whereBetween('due_at', [$from, $until])->whereNotIn('status', ['cancelled'])
                ->each(function (Task $task) use (&$sources): void {
                    $sources[] = ['task', $task];
                });
        }

        return $sources;
    }

    /** @return array<string, mixed> */
    private function eventPayload(GoogleCalendarConnection $connection, string $type, Model $source): array
    {
        $date = $type === 'event' ? $source->starts_at : $source->due_at;
        $end = $type === 'event' && $source->ends_at ? $source->ends_at : $date->copy()->addHour();
        $matter = $source->matter;
        $fullTitle = match ($type) {
            'event' => '[AGENDA '.($matter?->matter_number ?? 'RPK').'] '.$source->title,
            'deadline' => '[TENGGAT '.($matter?->matter_number ?? 'RPK').'] '.$source->title,
            default => '[TUGAS '.($matter?->matter_number ?? 'RPK').'] '.$source->title,
        };
        $summary = match ($connection->privacy_mode) {
            'full' => $fullTitle,
            'private' => 'Sibuk — RPK Workspace',
            default => match ($type) {
                'event' => 'Agenda Perkara RPK',
                'deadline' => 'Tenggat Perkara RPK',
                default => 'Tugas RPK Workspace',
            },
        };
        $description = $connection->privacy_mode === 'full'
            ? trim(($source->description ? $source->description."\n\n" : '').($matter ? 'Perkara: '.$matter->matter_number.' · '.$matter->title : 'Agenda internal RPK Workspace'))
            : 'Detail lengkap tersedia secara aman di RPK Workspace.';

        return [
            'summary' => $summary,
            'description' => $description."\n\n".$this->sourceUrl($type, $source),
            'location' => $connection->privacy_mode === 'private' ? null : ($source->location ?? null),
            'start' => ['dateTime' => $date->toIso8601String(), 'timeZone' => config('raf.timezone')],
            'end' => ['dateTime' => $end->toIso8601String(), 'timeZone' => config('raf.timezone')],
            'visibility' => 'private',
            'reminders' => ['useDefault' => false, 'overrides' => [
                ['method' => 'popup', 'minutes' => 1440],
                ['method' => 'popup', 'minutes' => 180],
            ]],
            'extendedProperties' => ['private' => [
                'rpk_source_type' => $type,
                'rpk_source_id' => (string) $source->getKey(),
            ]],
        ];
    }

    private function sourceUrl(string $type, Model $source): string
    {
        return match ($type) {
            'task' => route('tasks.show', $source),
            default => $source->matter ? route('matters.show', $source->matter) : route('calendar.index'),
        };
    }

    /** @param array<string, mixed> $payload */
    private function createEvent(GoogleCalendarConnection $connection, string $calendarId, array $payload): string
    {
        $response = $this->request($connection)->post($this->eventsEndpoint($calendarId), $payload)->throw()->json();

        return $response['id'];
    }

    /** @param array<string, mixed> $payload */
    private function updateEvent(GoogleCalendarConnection $connection, string $calendarId, GoogleCalendarEvent $mapping, array $payload): string
    {
        $response = $this->request($connection)->patch($this->eventEndpoint($calendarId, $mapping->google_event_id), $payload);

        if ($response->notFound()) {
            return $this->createEvent($connection, $calendarId, $payload);
        }

        return $response->throw()->json('id');
    }

    private function request(GoogleCalendarConnection $connection): PendingRequest
    {
        if ($connection->token_expires_at?->lte(now()->addMinute())) {
            $this->refreshAccessToken($connection);
        }

        return Http::acceptJson()->withToken($connection->access_token);
    }

    private function refreshAccessToken(GoogleCalendarConnection $connection): void
    {
        if (! $connection->refresh_token) {
            throw new \RuntimeException('Sesi Google Calendar telah berakhir. Hubungkan ulang akun Google Anda.');
        }

        $token = Http::asForm()->post(self::TOKEN_URL, [
            'client_id' => config('services.google_calendar.client_id'),
            'client_secret' => config('services.google_calendar.client_secret'),
            'grant_type' => 'refresh_token',
            'refresh_token' => $connection->refresh_token,
        ])->throw()->json();

        $connection->forceFill([
            'access_token' => $token['access_token'],
            'token_expires_at' => now()->addSeconds((int) ($token['expires_in'] ?? 3600)),
        ])->save();
    }

    private function eventsEndpoint(string $calendarId): string
    {
        return self::API_URL.'/calendars/'.rawurlencode($calendarId).'/events';
    }

    private function eventEndpoint(string $calendarId, string $eventId): string
    {
        return $this->eventsEndpoint($calendarId).'/'.rawurlencode($eventId);
    }

    private function redirectUri(): string
    {
        return config('services.google_calendar.redirect_uri') ?: route('calendar.google.callback');
    }

    private function ensureConfigured(): void
    {
        if (! config('services.google_calendar.client_id') || ! config('services.google_calendar.client_secret')) {
            throw new \RuntimeException('Integrasi Google Calendar belum dikonfigurasi oleh administrator.');
        }
    }
}
