<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Deadline;
use App\Models\Document;
use App\Models\Matter;
use App\Models\MatterChronology;
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

        // 6. Recent Activities (Real DB AuditLog records with rich contextual metadata, categorization & direct links)
        $activities = AuditLog::query()->with('actor')->latest('created_at')->limit(4)->get()
            ->map(function ($log) {
                $evt = strtolower($log->event ?? '');
                $cat = strtolower($log->category ?? '');
                $meta = (array) ($log->metadata ?? []);
                $subjectId = (string) ($log->subject_id ?? '');

                $badge = 'Aktivitas';
                $badgeColor = 'slate';
                $title = 'Aktivitas Tercatat';
                $detail = 'Aktivitas sistem operasional';
                $iconType = 'system';
                $url = null;

                if (str_contains($evt, 'matter') || str_contains($cat, 'matter')) {
                    $badge = 'Perkara';
                    $badgeColor = 'blue';
                    $iconType = 'matter';
                    $code = $meta['matter_number'] ?? '';
                    $mTitle = $meta['title'] ?? 'Perkara Hukum';

                    if (str_contains($evt, 'created')) {
                        $title = 'Registrasi Perkara Baru';
                    } elseif (str_contains($evt, 'stage') || str_contains($evt, 'status')) {
                        $title = 'Pembaruan Status Perkara';
                    } elseif (str_contains($evt, 'legal_hold')) {
                        $title = 'Aktivasi Legal Hold';
                    } else {
                        $title = 'Pembaruan Berkas Perkara';
                    }

                    $detail = ($code ? "{$code} · " : '').$mTitle;
                    $url = $subjectId ? route('matters.show', $subjectId) : route('matters.index');
                } elseif (str_contains($evt, 'document') || str_contains($cat, 'document')) {
                    $badge = 'Dokumen';
                    $badgeColor = 'purple';
                    $iconType = 'document';
                    $docTitle = $meta['title'] ?? $meta['filename'] ?? $meta['original_filename'] ?? 'Berkas Dokumen';
                    $vNum = isset($meta['version_number']) ? " (v{$meta['version_number']})" : '';

                    if (str_contains($evt, 'preview')) {
                        $title = 'Pratinjau Dokumen Vault';
                        $detail = "Membuka berkas {$docTitle}{$vNum}";
                    } elseif (str_contains($evt, 'upload') || str_contains($evt, 'created')) {
                        $title = 'Unggah Dokumen Baru';
                        $detail = "Menambahkan berkas {$docTitle}{$vNum}";
                    } elseif (str_contains($evt, 'download')) {
                        $title = 'Unduh Berkas Dokumen';
                        $detail = "Mengunduh {$docTitle}{$vNum}";
                    } else {
                        $title = 'Pembaruan Dokumen';
                        $detail = "{$docTitle}{$vNum}";
                    }

                    $url = $subjectId ? route('documents.show', $subjectId) : route('documents.index');
                } elseif (str_contains($evt, 'client') || str_contains($cat, 'client')) {
                    $badge = 'Klien';
                    $badgeColor = 'emerald';
                    $iconType = 'client';
                    $clientName = $meta['display_name'] ?? $meta['legal_name'] ?? 'Klien Kantor';
                    $clientNum = $meta['client_number'] ?? '';

                    if (str_contains($evt, 'created')) {
                        $title = 'Registrasi Profil Klien';
                    } else {
                        $title = 'Pembaruan Data Klien';
                    }

                    $detail = ($clientNum ? "{$clientNum} · " : '').$clientName;
                    $url = $subjectId ? route('clients.show', $subjectId) : route('clients.index');
                } elseif (str_contains($evt, 'invoice') || str_contains($cat, 'invoice')) {
                    $badge = 'Invoice';
                    $badgeColor = 'amber';
                    $iconType = 'invoice';
                    $invNum = $meta['invoice_number'] ?? '';

                    if (str_contains($evt, 'paid')) {
                        $title = 'Pelunasan Invoice';
                        $detail = 'Invoice terbayar lunas '.($invNum ? "#{$invNum}" : '');
                    } elseif (str_contains($evt, 'pdf')) {
                        $title = 'Unduh PDF Invoice';
                        $detail = 'Mencetak salinan invoice '.($invNum ? "#{$invNum}" : '');
                    } else {
                        $title = 'Penerbitan Invoice';
                        $detail = 'Faktur tagihan jasa hukum '.($invNum ? "#{$invNum}" : '');
                    }

                    $url = route('finance.index');
                } elseif (str_contains($evt, 'quotation') || str_contains($cat, 'quotation')) {
                    $badge = 'Penawaran';
                    $badgeColor = 'blue';
                    $iconType = 'quotation';
                    $qtNum = $meta['quotation_number'] ?? '';

                    if (str_contains($evt, 'approved')) {
                        $title = 'Persetujuan Proposal Jasa';
                        $detail = 'Penawaran honorarium disetujui '.($qtNum ? "#{$qtNum}" : '');
                    } elseif (str_contains($evt, 'pdf')) {
                        $title = 'Unduh PDF Penawaran';
                        $detail = 'Mencetak proposal penawaran '.($qtNum ? "#{$qtNum}" : '');
                    } else {
                        $title = 'Pembuatan Penawaran';
                        $detail = 'Proposal penawaran honorarium '.($qtNum ? "#{$qtNum}" : '');
                    }

                    $url = route('finance.index');
                } elseif (str_contains($evt, 'payment') || str_contains($cat, 'payment')) {
                    $badge = 'Pembayaran';
                    $badgeColor = 'emerald';
                    $iconType = 'payment';
                    $title = 'Penerimaan Pembayaran';
                    $detail = 'Pencatatan kuitansi & penerimaan dana klien';
                    $url = route('finance.index');
                } elseif (str_contains($evt, 'task') || str_contains($cat, 'task')) {
                    $badge = 'Tugas';
                    $badgeColor = 'teal';
                    $iconType = 'task';
                    $taskTitle = $meta['title'] ?? 'Tugas Tim';

                    if (str_contains($evt, 'completed')) {
                        $title = 'Penyelesaian Tugas';
                    } else {
                        $title = 'Pembaruan Tugas Kerja';
                    }

                    $detail = $taskTitle;
                    $url = route('tasks.index');
                } elseif (str_contains($evt, 'signature') || str_contains($cat, 'signature')) {
                    $badge = 'E-Signature';
                    $badgeColor = 'indigo';
                    $iconType = 'signature';
                    $title = 'Tanda Tangan Digital';
                    $detail = 'Sertifikasi digital dokumen hukum terproses';
                    $url = route('documents.index');
                } elseif (str_contains($evt, 'correspondence') || str_contains($cat, 'correspondence')) {
                    $badge = 'Surat';
                    $badgeColor = 'cyan';
                    $iconType = 'correspondence';
                    $title = 'Korespondensi Hukum';
                    $detail = $meta['subject'] ?? 'Pencatatan surat keluar / masuk';
                    $url = $subjectId ? route('governance.correspondences.show', $subjectId) : route('governance.index');
                } elseif (str_contains($evt, 'user') || str_contains($cat, 'user')) {
                    $badge = 'Keamanan';
                    $badgeColor = 'slate';
                    $iconType = 'system';
                    $targetUser = $meta['name'] ?? $meta['email'] ?? 'akun staf';

                    if (str_contains($evt, 'login')) {
                        $title = 'Autentikasi Pengguna';
                        $detail = 'Sesi login berhasil diverifikasi';
                    } else {
                        $title = 'Pembaruan Profil & Akses';
                        $detail = "Penyesuaian konfigurasi akun {$targetUser}";
                    }

                    $url = route('admin.users.index');
                } else {
                    $title = ucwords(str_replace(['.', '_'], ' ', $log->event));
                    $detail = $log->category ? ucwords(str_replace('_', ' ', $log->category)) : 'Aktivitas kantor tercatat';
                    $url = route('admin.audit.index');
                }

                return [
                    'id' => $log->id,
                    'event' => $log->event,
                    'badge' => $badge,
                    'badge_color' => $badgeColor,
                    'title' => $title,
                    'detail' => $detail,
                    'subject' => $detail,
                    'icon_type' => $iconType,
                    'color' => $badgeColor,
                    'actor' => $log->actor?->name ?? 'Sistem Otomatis',
                    'actor_avatar' => $log->actor?->avatar_url ?? $log->actor?->avatar_path,
                    'time' => $log->created_at ? $log->created_at->diffForHumans() : 'Baru saja',
                    'created_at' => $log->created_at?->toIso8601String(),
                    'url' => $url,
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

        // 8. Recent Case Milestones (Perkembangan & Kronologi Perkara Terkini)
        $caseMilestones = MatterChronology::query()
            ->with([
                'matter:id,matter_number,title,client_id',
                'matter.client:id,display_name',
                'creator:id,name,avatar_path',
            ])
            ->whereIn('matter_id', $visibleMatterIds)
            ->orderByDesc('event_date')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($c) {
                $level = strtolower($c->importance_level ?? 'normal');
                $badgeColor = match ($level) {
                    'critical' => 'rose',
                    'high' => 'amber',
                    'low' => 'slate',
                    default => 'blue',
                };
                $badgeLabel = match ($level) {
                    'critical' => 'Krusial',
                    'high' => 'Signifikan',
                    'low' => 'Catatan',
                    default => 'Milestone',
                };

                return [
                    'id' => $c->id,
                    'title' => $c->title,
                    'description' => $c->description,
                    'event_date' => $c->event_date ? $c->event_date->translatedFormat('d M Y') : null,
                    'date_raw' => $c->event_date?->format('Y-m-d'),
                    'relative_time' => $c->event_date ? $c->event_date->diffForHumans() : null,
                    'importance_level' => $level,
                    'badge_label' => $badgeLabel,
                    'badge_color' => $badgeColor,
                    'evidence_reference' => $c->evidence_reference,
                    'witness_name' => $c->witness_name,
                    'matter_id' => $c->matter_id,
                    'matter_number' => $c->matter?->matter_number,
                    'matter_title' => $c->matter?->title,
                    'client_name' => $c->matter?->client?->display_name,
                    'creator_name' => $c->creator?->name ?? 'Advokat Tim',
                    'creator_avatar' => $c->creator?->avatar_url ?? $c->creator?->avatar_path,
                    'url' => route('matters.show', $c->matter_id),
                ];
            });

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
            'case_milestones' => $caseMilestones,
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
