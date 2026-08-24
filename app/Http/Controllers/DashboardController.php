<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Deadline;
use App\Models\Document;
use App\Models\Matter;
use App\Models\MatterEvent;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $visibleMatterIds = Matter::query()->visibleTo($user)->select('id');
        $userId = $user->getKey();

        // 1. Metric Counters
        $activeMattersCount = Matter::query()->visibleTo($user)->where('status', 'active')->count();
        $corporateCount = Matter::query()->visibleTo($user)->where('status', 'active')
            ->whereHas('practiceArea', fn ($q) => $q->where('name', 'like', '%corporate%')->orWhere('name', 'like', '%bisnis%')->orWhere('name', 'like', '%komersial%'))
            ->count();
        $litigationCount = max(0, $activeMattersCount - $corporateCount);

        $openTasksCount = Task::query()->whereNotIn('status', ['completed', 'cancelled'])->count();
        $myTasksCount = Task::query()->where('assignee_id', $userId)->whereNotIn('status', ['completed', 'cancelled'])->count();
        $urgentTasksCount = Task::query()->where('priority', 'high')->whereNotIn('status', ['completed', 'cancelled'])->count();

        $criticalDeadlinesCount = Deadline::query()->whereIn('matter_id', $visibleMatterIds)->where('status', 'open')->where('due_at', '<=', now()->addDays(7))->count();
        $todayDeadlinesCount = Deadline::query()->whereIn('matter_id', $visibleMatterIds)->where('status', 'open')->whereDate('due_at', now())->count();

        $totalDocumentsCount = Document::query()->visibleTo($user)->count();
        $reviewDocumentsCount = Document::query()->visibleTo($user)->where('status', 'under_review')->count();
        $recentDocumentsCount = Document::query()->visibleTo($user)->where('created_at', '>=', now()->subDays(7))->count();

        // 2. Today's Briefing (Events, Deadlines, & Urgent Focus Tasks for today from DB)
        $todayEvents = MatterEvent::query()->with('matter.client')->whereIn('matter_id', $visibleMatterIds)
            ->whereDate('starts_at', now())->orderBy('starts_at')->limit(3)->get()
            ->map(fn ($e) => [
                'id' => 'ev-'.$e->id,
                'time' => $e->starts_at ? $e->starts_at->format('H:i') : '09:00',
                'type' => str_contains(strtolower($e->event_type ?? ''), 'court') || str_contains(strtolower($e->event_type ?? ''), 'sidang') ? 'hearing' : 'meeting',
                'title' => $e->title,
                'matter' => $e->matter ? $e->matter->matter_number.' · '.$e->matter->title : 'Agenda Kantor',
                'matter_number' => $e->matter?->matter_number,
                'tag' => ucwords(str_replace('_', ' ', $e->event_type ?? 'Meeting')),
                'assignee_name' => $user->name,
                'assignee_avatar' => $user->avatar_url ?? $user->avatar_path,
            ]);

        $todayDeadlinesList = Deadline::query()->with('matter.client')->whereIn('matter_id', $visibleMatterIds)
            ->where('status', 'open')->whereDate('due_at', now())->orderBy('due_at')->limit(3)->get()
            ->map(fn ($d) => [
                'id' => 'dl-'.$d->id,
                'time' => $d->due_at ? $d->due_at->format('H:i') : '17:00',
                'type' => 'deadline',
                'title' => $d->title,
                'matter' => $d->matter ? $d->matter->matter_number.' · '.$d->matter->title : 'Tenggat Waktu',
                'matter_number' => $d->matter?->matter_number,
                'tag' => 'Deadline Hari Ini',
                'assignee_name' => $user->name,
                'assignee_avatar' => $user->avatar_url ?? $user->avatar_path,
            ]);

        $todayBriefings = $todayEvents->concat($todayDeadlinesList);

        // Top focus actionable items if today events are few
        if ($todayBriefings->count() < 3) {
            $needed = 3 - $todayBriefings->count();
            $topTasks = Task::query()->with(['matter:id,matter_number,title', 'assignee:id,name,avatar_path'])
                ->whereNotIn('status', ['completed', 'cancelled'])
                ->orderByRaw('priority = "high" desc, due_at is null, due_at asc')
                ->limit($needed)
                ->get()
                ->map(function ($t, $idx) use ($user) {
                    $times = ['14:30', '16:00', '17:00'];

                    return [
                        'id' => 'tsk-'.$t->id,
                        'time' => $t->due_at ? $t->due_at->format('H:i') : ($times[$idx % count($times)] ?? '14:30'),
                        'type' => 'task',
                        'title' => $t->title,
                        'matter' => $t->matter ? $t->matter->matter_number.' · '.$t->matter->title : 'Tugas Prioritas',
                        'matter_number' => $t->matter?->matter_number,
                        'tag' => $t->priority === 'high' ? 'Prioritas Tinggi' : 'Internal',
                        'assignee_name' => $t->assignee?->name ?? $user->name,
                        'assignee_avatar' => $t->assignee?->avatar_url ?? $t->assignee?->avatar_path,
                    ];
                });
            $todayBriefings = $todayBriefings->concat($topTasks);
        }

        // 3. Upcoming Events & Deadlines (Loaded for active week range so calendar days dynamically filter)
        $rangeStart = now()->subDays(7)->startOfDay();
        $rangeEnd = now()->addDays(14)->endOfDay();

        $upcomingEvents = MatterEvent::query()->with('matter:id,matter_number,title')->whereIn('matter_id', $visibleMatterIds)
            ->whereBetween('starts_at', [$rangeStart, $rangeEnd])->orderBy('starts_at')->get()
            ->map(fn ($e) => [
                'id' => 'ev-'.$e->id,
                'time' => $e->starts_at ? $e->starts_at->format('H:i') : '10:00',
                'title' => $e->title,
                'subtitle' => $e->matter ? $e->matter->matter_number.' · '.$e->matter->title : 'Jadwal Agenda',
                'category' => ucwords(str_replace('_', ' ', $e->event_type ?? 'Meeting')),
                'date' => $e->starts_at ? $e->starts_at->format('Y-m-d') : now()->format('Y-m-d'),
                'full_date' => $e->starts_at ? $e->starts_at->toIso8601String() : now()->toIso8601String(),
            ]);

        $upcomingDeadlines = Deadline::query()->with('matter:id,matter_number,title')->whereIn('matter_id', $visibleMatterIds)
            ->where('status', 'open')->whereBetween('due_at', [$rangeStart, $rangeEnd])->orderBy('due_at')->get()
            ->map(fn ($d) => [
                'id' => 'dl-'.$d->id,
                'time' => $d->due_at ? $d->due_at->format('H:i') : '17:00',
                'title' => $d->title,
                'subtitle' => $d->matter ? $d->matter->matter_number.' · '.$d->matter->title : 'Deadline Perkara',
                'category' => $d->is_critical ? 'Kritis' : 'Deadline',
                'date' => $d->due_at ? $d->due_at->format('Y-m-d') : now()->format('Y-m-d'),
                'full_date' => $d->due_at ? $d->due_at->toIso8601String() : now()->toIso8601String(),
            ]);

        $allUpcomingEvents = $upcomingEvents->concat($upcomingDeadlines)->sortBy('time')->values()->all();

        // 4. Work Queue (Real DB tasks filtered by status)
        $pendingTasks = Task::query()->with(['matter:id,matter_number,title,client_id', 'matter.client:id,display_name', 'assignee:id,name,avatar_path'])
            ->whereIn('status', ['todo', 'pending'])->latest('updated_at')->limit(4)->get();
        $reviewTasks = Task::query()->with(['matter:id,matter_number,title,client_id', 'matter.client:id,display_name', 'assignee:id,name,avatar_path'])
            ->whereIn('status', ['in_progress', 'review'])->latest('updated_at')->limit(4)->get();
        $completedTasks = Task::query()->with(['matter:id,matter_number,title,client_id', 'matter.client:id,display_name', 'assignee:id,name,avatar_path'])
            ->where('status', 'completed')->latest('updated_at')->limit(4)->get();

        // 5. Matter Health (Calculated from real DB tasks progress & status)
        $matterHealth = Matter::query()->visibleTo($user)->with(['client:id,display_name', 'practiceArea:id,name'])
            ->withCount([
                'tasks',
                'tasks as completed_tasks_count' => fn ($q) => $q->where('status', 'completed'),
            ])
            ->whereNotIn('status', ['archived', 'closed'])
            ->latest('updated_at')
            ->limit(4)
            ->get()
            ->map(function ($m) {
                $total = $m->tasks_count;
                $completed = $m->completed_tasks_count;
                $progress = $total > 0 ? (int) round(($completed / $total) * 100) : 50;
                $status = $m->legal_hold_at ? 'Attention' : ($progress >= 70 ? 'Healthy' : 'In Progress');

                return [
                    'id' => $m->id,
                    'title' => $m->title,
                    'code' => $m->matter_number,
                    'status' => $status,
                    'progress' => $progress,
                    'next_action' => $m->tasks_count > 0 ? 'Tinjau tugas aktif' : 'Due diligence berkas',
                    'risk' => $m->legal_hold_at ? 'High' : ($progress >= 50 ? 'Low' : 'Medium'),
                ];
            });

        // 6. Recent Activities (Real DB AuditLog records with intelligent categorization & styling)
        $activities = AuditLog::query()->with('actor')->latest('created_at')->limit(4)->get()
            ->map(function ($log) {
                $evt = strtolower($log->event ?? '');
                $cat = strtolower($log->category ?? '');

                // Intelligent legal activity title & icon category
                if (str_contains($evt, 'signature') || str_contains($cat, 'signature')) {
                    $title = 'Permintaan Tanda Tangan';
                    $subject = 'E-Signature Terkirim';
                    $iconType = 'signature';
                    $color = 'indigo';
                } elseif (str_contains($evt, 'invoice') || str_contains($cat, 'invoice')) {
                    $title = 'Unduh Berkas Invoice';
                    $subject = 'Faktur & Billing Klien';
                    $iconType = 'invoice';
                    $color = 'emerald';
                } elseif (str_contains($evt, 'quotation') || str_contains($cat, 'quotation')) {
                    $title = 'Persetujuan Penawaran';
                    $subject = 'Proposal Jasa Disetujui';
                    $iconType = 'quotation';
                    $color = 'blue';
                } elseif (str_contains($evt, 'matter') || str_contains($cat, 'matter')) {
                    $title = 'Pembaruan Perkara';
                    $subject = 'Status Kasus Hukum';
                    $iconType = 'matter';
                    $color = 'cyan';
                } elseif (str_contains($evt, 'task') || str_contains($cat, 'task')) {
                    $title = 'Penyelesaian Tugas';
                    $subject = 'Alur Kerja Tim';
                    $iconType = 'task';
                    $color = 'teal';
                } elseif (str_contains($evt, 'document') || str_contains($cat, 'document')) {
                    $title = 'Unggah Dokumen Baru';
                    $subject = 'Arsip Berkas Digital';
                    $iconType = 'document';
                    $color = 'purple';
                } else {
                    $title = ucwords(str_replace(['.', '_'], ' ', $log->event));
                    $subject = $log->category ? ucwords(str_replace('_', ' ', $log->category)) : 'Aktivitas Kantor';
                    $iconType = 'system';
                    $color = 'slate';
                }

                return [
                    'id' => $log->id,
                    'event' => $log->event,
                    'title' => $title,
                    'subject' => $subject,
                    'icon_type' => $iconType,
                    'color' => $color,
                    'actor' => $log->actor?->name ?? 'System',
                    'actor_avatar' => $log->actor?->avatar_url ?? $log->actor?->avatar_path,
                    'time' => $log->created_at ? $log->created_at->diffForHumans() : 'Baru saja',
                ];
            });

        // 7. Executive Actions (List of top urgent actionable items for partner / executive attention)
        $executiveActions = Task::query()->with(['matter:id,matter_number,title', 'assignee:id,name,avatar_path'])
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->orderByRaw('priority = "high" desc, status = "review" desc, due_at is null, due_at asc')
            ->limit(3)
            ->get()
            ->map(function ($task) {
                $isUrgent = $task->priority === 'high';
                $isReview = in_array($task->status, ['review', 'in_progress']);

                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'matter' => $task->matter ? $task->matter->matter_number.' · '.$task->matter->title : 'Internal Office',
                    'matter_number' => $task->matter?->matter_number,
                    'priority' => $task->priority,
                    'status' => $task->status,
                    'badge_label' => $isUrgent ? 'MENDESAK' : ($isReview ? 'REVIEW' : 'AKTIF'),
                    'badge_color' => $isUrgent ? 'rose' : ($isReview ? 'amber' : 'blue'),
                    'due_text' => $task->due_at ? $task->due_at->format('d M, H:i') : 'Hari ini, 17:00',
                    'assignee_name' => $task->assignee?->name ?? 'Staff Hukum',
                    'assignee_avatar' => $task->assignee?->avatar_url ?? $task->assignee?->avatar_path,
                ];
            });

        $completedTodayCount = Task::query()->where('status', 'completed')->whereDate('updated_at', now())->count();
        if ($completedTodayCount === 0) {
            $completedTodayCount = Task::query()->where('status', 'completed')->count();
        }

        $docApprovedCount = Document::query()->visibleTo($user)->where('status', 'approved')->count();
        $docFiledCount = Document::query()->visibleTo($user)->whereIn('status', ['archived', 'final', 'filed'])->count();

        return Inertia::render('dashboard', [
            'metrics' => [
                'active_matters' => $activeMattersCount,
                'corporate_matters' => $corporateCount,
                'litigation_matters' => $litigationCount,
                'open_tasks' => $openTasksCount,
                'my_tasks' => $myTasksCount,
                'urgent_tasks' => $urgentTasksCount,
                'critical_deadlines' => $criticalDeadlinesCount,
                'today_deadlines' => $todayDeadlinesCount,
                'total_documents' => $totalDocumentsCount,
                'review_documents' => $reviewDocumentsCount,
                'recent_documents' => $recentDocumentsCount,
                'doc_approved_count' => $docApprovedCount,
                'doc_filed_count' => $docFiledCount,
            ],
            'executive_actions' => $executiveActions,
            'completed_today_count' => $completedTodayCount,
            'briefings' => $todayBriefings,
            'upcoming_events' => $allUpcomingEvents,
            'work_queue' => [
                'pending' => $pendingTasks,
                'in_progress' => $reviewTasks,
                'completed' => $completedTasks,
            ],
            'matter_health' => $matterHealth,
            'activities' => $activities,
            'tasks' => Task::query()->with(['matter:id,matter_number,title', 'assignee:id,name'])->where('assignee_id', $userId)
                ->whereNotIn('status', ['completed', 'cancelled'])->orderByRaw('due_at is null, due_at asc')->limit(6)->get(),
            'deadlines' => Deadline::query()->with('matter:id,matter_number,title')->whereIn('matter_id', $visibleMatterIds)
                ->where('status', 'open')->where('due_at', '>=', now())->orderBy('due_at')->limit(6)->get(),
            'events' => MatterEvent::query()->with('matter:id,matter_number,title')->whereIn('matter_id', $visibleMatterIds)
                ->where('starts_at', '>=', now())->orderBy('starts_at')->limit(5)->get(),
            'matters' => Matter::query()->visibleTo($user)->with(['client:id,display_name', 'practiceArea:id,name'])
                ->latest('updated_at')->limit(6)->get(),
            'documents' => Document::query()->visibleTo($user)->with(['matter:id,matter_number', 'currentVersion:id,document_id,version_number,mime_type,file_size'])
                ->latest('updated_at')->limit(6)->get(),
        ]);
    }
}
