<?php

namespace App\Http\Controllers;

use App\Models\Deadline;
use App\Models\Matter;
use App\Models\MatterEvent;
use App\Models\Task;
use App\Models\User;
use App\Services\IcsCalendarGenerator;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class CalendarController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $timezone = config('raf.timezone');
        $matterIds = Matter::query()->visibleTo($request->user())->select('id');
        $requestedMonth = $request->string('month')->toString();
        $month = preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $requestedMonth) === 1
            ? CarbonImmutable::parse($requestedMonth.'-01', $timezone)->startOfMonth()
            : CarbonImmutable::now($timezone)->startOfMonth();
        $from = $month->startOfWeek(CarbonInterface::MONDAY)->startOfDay();
        $until = $month->endOfMonth()->endOfWeek(CarbonInterface::SUNDAY)->endOfDay();

        $userId = $request->user()->getKey();

        $token = $request->user()->ensureCalendarToken();
        $feedUrl = route('calendar.feed', ['token' => $token]);
        $webcalUrl = preg_replace('/^https?:\/\//i', 'webcal://', $feedUrl);
        $googleCalendarUrl = 'https://calendar.google.com/calendar/render?cid='.urlencode($webcalUrl);

        return Inertia::render('calendar/index', [
            'deadlines' => Deadline::query()->with('matter:id,matter_number,title')->whereIn('matter_id', $matterIds)
                ->whereBetween('due_at', [$from, $until])->orderBy('due_at')->get(),
            'events' => MatterEvent::query()->with('matter:id,matter_number,title')->whereIn('matter_id', $matterIds)
                ->whereBetween('starts_at', [$from, $until])->orderBy('starts_at')->get(),
            'tasks' => Task::query()->with('matter:id,matter_number,title')
                ->where(function ($q) use ($userId, $matterIds) {
                    $q->where('assignee_id', $userId)
                        ->orWhere('reporter_id', $userId)
                        ->orWhere('reviewer_id', $userId)
                        ->orWhereIn('matter_id', $matterIds)
                        ->orWhereNull('matter_id');
                })
                ->whereBetween('due_at', [$from, $until])->whereNotIn('status', ['cancelled'])->orderBy('due_at')->get(),
            'range' => ['from' => $from->toDateString(), 'until' => $until->toDateString()],
            'month' => $month->format('Y-m'),
            'timezone' => $timezone,
            'feed' => [
                'token' => $token,
                'url' => $feedUrl,
                'webcal_url' => $webcalUrl,
                'google_url' => $googleCalendarUrl,
            ],
        ]);
    }

    /**
     * Live subscription feed for Apple Calendar, Google Calendar, and Android.
     */
    public function feed(string $token, IcsCalendarGenerator $generator): SymfonyResponse
    {
        $user = null;
        try {
            $user = User::query()->where('calendar_token', $token)->where('is_active', true)->first();
        } catch (\Throwable) {
        }

        if (! $user) {
            $user = User::query()->where('is_active', true)->get()->first(
                fn ($u) => hash_hmac('sha256', (string) $u->id, (string) config('app.key')) === $token
            );
        }

        if (! $user) {
            abort(404);
        }

        $userId = $user->getKey();
        $matterIds = Matter::query()->visibleTo($user)->select('id');
        $from = CarbonImmutable::now()->subDays(30)->startOfDay();
        $until = CarbonImmutable::now()->addDays(180)->endOfDay();

        $events = MatterEvent::query()->with('matter:id,matter_number,title')
            ->whereIn('matter_id', $matterIds)
            ->whereBetween('starts_at', [$from, $until])
            ->orderBy('starts_at')
            ->get();

        $deadlines = Deadline::query()->with('matter:id,matter_number,title')
            ->whereIn('matter_id', $matterIds)
            ->whereBetween('due_at', [$from, $until])
            ->orderBy('due_at')
            ->get();

        $tasks = Task::query()->with('matter:id,matter_number,title')
            ->where(function ($q) use ($userId, $matterIds) {
                $q->where('assignee_id', $userId)
                    ->orWhere('reporter_id', $userId)
                    ->orWhere('reviewer_id', $userId)
                    ->orWhereIn('matter_id', $matterIds)
                    ->orWhereNull('matter_id');
            })
            ->whereBetween('due_at', [$from, $until])
            ->whereNotIn('status', ['cancelled'])
            ->orderBy('due_at')
            ->get();

        $ics = $generator->generate($events, $deadlines, $tasks);

        return response($ics, 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Cache-Control' => 'no-cache, no-store, max-age=0, must-revalidate',
            'Content-Disposition' => 'inline; filename="rpk-law-firm-calendar.ics"',
        ]);
    }

    /**
     * Rotate the user's secret calendar token.
     */
    public function rotateToken(Request $request): RedirectResponse
    {
        try {
            $request->user()->forceFill(['calendar_token' => Str::random(48)])->save();
        } catch (\Throwable) {
        }

        return back()->with('success', 'Tautan kalender langganan berhasil diperbarui.');
    }

    public function exportIcs(Request $request, IcsCalendarGenerator $generator): SymfonyResponse
    {
        $userId = $request->user()->getKey();
        $matterIds = Matter::query()->visibleTo($request->user())->select('id');
        $from = CarbonImmutable::now()->subDays(14)->startOfDay();
        $until = CarbonImmutable::now()->addDays(90)->endOfDay();

        $events = MatterEvent::query()->with('matter:id,matter_number,title')
            ->whereIn('matter_id', $matterIds)
            ->whereBetween('starts_at', [$from, $until])
            ->orderBy('starts_at')
            ->get();

        $deadlines = Deadline::query()->with('matter:id,matter_number,title')
            ->whereIn('matter_id', $matterIds)
            ->whereBetween('due_at', [$from, $until])
            ->orderBy('due_at')
            ->get();

        $tasks = Task::query()->with('matter:id,matter_number,title')
            ->where(function ($q) use ($userId, $matterIds) {
                $q->where('assignee_id', $userId)
                    ->orWhere('reporter_id', $userId)
                    ->orWhere('reviewer_id', $userId)
                    ->orWhereIn('matter_id', $matterIds)
                    ->orWhereNull('matter_id');
            })
            ->whereBetween('due_at', [$from, $until])
            ->whereNotIn('status', ['cancelled'])
            ->orderBy('due_at')
            ->get();

        $ics = $generator->generate($events, $deadlines, $tasks);

        return response($ics, 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="RPK-Law-Firm-Calendar.ics"',
        ]);
    }
}
