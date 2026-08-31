<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('raf:send-deadline-reminders')
    ->hourly()
    ->timezone(config('raf.timezone'))
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('raf:send-task-overdue-reminders')
    ->hourly()
    ->timezone(config('raf.timezone'))
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('raf:send-signature-reminders')
    ->hourly()
    ->timezone(config('raf.timezone'))
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('raf:mark-overdue-invoices')
    ->dailyAt('00:10')
    ->timezone(config('raf.timezone'))
    ->withoutOverlapping()
    ->onOneServer();
