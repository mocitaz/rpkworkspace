<?php

namespace App\Console\Commands;

use App\Jobs\SyncGoogleCalendar;
use App\Models\GoogleCalendarConnection;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('raf:sync-google-calendars')]
#[Description('Queue synchronization for all active Google Calendar connections')]
class SyncGoogleCalendars extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $count = 0;
        GoogleCalendarConnection::query()->where('is_active', true)->eachById(function (GoogleCalendarConnection $connection) use (&$count): void {
            SyncGoogleCalendar::dispatch($connection->getKey());
            $count++;
        });

        $this->info($count.' sinkronisasi Google Calendar dijadwalkan.');

        return self::SUCCESS;
    }
}
