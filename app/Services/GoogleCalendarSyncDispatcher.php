<?php

namespace App\Services;

use App\Jobs\SyncGoogleCalendar;
use App\Models\GoogleCalendarConnection;

class GoogleCalendarSyncDispatcher
{
    public function dispatchAll(): void
    {
        GoogleCalendarConnection::query()
            ->where('is_active', true)
            ->pluck('id')
            ->each(fn (int $connectionId) => SyncGoogleCalendar::dispatch($connectionId)->afterCommit());
    }
}
