<?php

namespace App\Jobs;

use App\Models\GoogleCalendarConnection;
use App\Services\GoogleCalendarService;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class SyncGoogleCalendar implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public int $tries = 3;

    /** @var list<int> */
    public array $backoff = [30, 120, 600];

    public function __construct(public int $connectionId)
    {
        $this->onQueue(config('raf.queues.calendar', 'notifications'));
    }

    /**
     * Execute the job.
     */
    public function handle(GoogleCalendarService $service): void
    {
        $connection = GoogleCalendarConnection::query()->where('is_active', true)->find($this->connectionId);

        if (! $connection) {
            return;
        }

        try {
            $service->sync($connection);
        } catch (Throwable $exception) {
            $connection->forceFill(['last_error' => $exception->getMessage()])->save();

            throw $exception;
        }
    }

    public function uniqueId(): string
    {
        return (string) $this->connectionId;
    }
}
