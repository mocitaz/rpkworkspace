<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use App\Services\AuditService;
use Carbon\CarbonInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuditLogController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return $this->index($request);
    }

    public function index(Request $request): Response
    {
        abort_unless($request->user()->hasPermission('audit.view'), 403);

        $metrics = [
            'total' => AuditLog::query()->count(),
            'today' => AuditLog::query()->whereDate('created_at', today())->count(),
            'actors_count' => AuditLog::query()->distinct('actor_id')->count('actor_id'),
            'events_count' => AuditLog::query()->distinct('event')->count('event'),
        ];

        return Inertia::render('admin/audit/index', [
            'auditLogs' => AuditLog::query()
                ->with(['actor:id,name,email', 'subject'])
                ->when($request->string('event')->toString(), fn ($query, $event) => $query->where('event', $event))
                ->when($request->integer('actor_id'), fn ($query, $actorId) => $query->where('actor_id', $actorId))
                ->when($request->date('from'), fn ($query, $from) => $query->where('created_at', '>=', $from->startOfDay()))
                ->when($request->date('until'), fn ($query, $until) => $query->where('created_at', '<=', $until->endOfDay()))
                ->latest('created_at')
                ->paginate(30)
                ->withQueryString(),
            'events' => AuditLog::query()->select('event')->distinct()->orderBy('event')->pluck('event'),
            'actors' => User::query()->whereHas('auditLogs')->orderBy('name')->get(['id', 'name']),
            'metrics' => $metrics,
            'filters' => $request->only(['event', 'actor_id', 'from', 'until']),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        abort_unless($request->user()->hasPermission('audit.view'), 403);

        $query = AuditLog::query()
            ->with('actor:id,name,email')
            ->when($request->string('event')->toString(), fn ($q, $event) => $q->where('event', $event))
            ->when($request->integer('actor_id'), fn ($q, $actorId) => $q->where('actor_id', $actorId))
            ->when($request->date('from'), fn ($q, $from) => $q->where('created_at', '>=', $from->startOfDay()))
            ->when($request->date('until'), fn ($q, $until) => $q->where('created_at', '<=', $until->endOfDay()))
            ->latest('created_at');

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="rpk-audit-trail-'.now()->format('Ymd-His').'.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($query) {
            $handle = fopen('php://output', 'w');
            if ($handle === false) {
                return;
            }

            // UTF-8 BOM for Microsoft Excel compatibility
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'ID Log',
                'Waktu Kejadian (WIB)',
                'Nama Pengguna / Aktor',
                'Email Pengguna',
                'Aksi / Event',
                'Tipe Entitas',
                'ID Entitas',
                'Alamat IP',
                'Perangkat / User Agent',
                'Metadata / Payload JSON',
            ]);

            $query->chunk(500, function ($logs) use ($handle) {
                foreach ($logs as $log) {
                    $createdAt = $log->created_at instanceof CarbonInterface
                        ? $log->created_at->setTimezone(config('raf.timezone', 'Asia/Jakarta'))->format('Y-m-d H:i:s')
                        : ($log->created_at ? (string) $log->created_at : '-');

                    fputcsv($handle, [
                        $log->id,
                        $createdAt,
                        $log->actor?->name ?? 'System / Otomatis',
                        $log->actor?->email ?? '-',
                        $log->event,
                        $log->subject_type ? class_basename($log->subject_type) : '-',
                        $log->subject_id ?? '-',
                        $log->ip_address ?? '-',
                        $log->user_agent ?? '-',
                        json_encode($log->metadata, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }

    public function prune(Request $request): RedirectResponse
    {
        abort_unless($request->user()->hasPermission('audit.view'), 403);

        $validated = $request->validate([
            'retention' => ['required', 'string', 'in:7,30,90,180,365,all'],
        ]);

        $retention = $validated['retention'];
        $query = AuditLog::query();

        if ($retention !== 'all') {
            $days = (int) $retention;
            $cutoff = now()->subDays($days);
            $query->where('created_at', '<', $cutoff);
        }

        $deletedCount = $query->delete();

        // Record the prune event for compliance audit trail
        app(AuditService::class)->record(
            subject: $request->user(),
            event: 'audit.pruned',
            metadata: [
                'retention_option' => $retention,
                'records_deleted' => $deletedCount,
                'pruned_at' => now()->toIso8601String(),
            ],
            actor: $request->user(),
            request: $request,
            category: 'admin'
        );

        $label = match ($retention) {
            '7' => '7 hari',
            '30' => '30 hari (1 bulan)',
            '90' => '90 hari (3 bulan)',
            '180' => '180 hari (6 bulan)',
            '365' => '365 hari (1 tahun)',
            default => 'seluruh riwayat',
        };

        $message = $retention === 'all'
            ? "Seluruh riwayat log audit ({$deletedCount} rekaman) berhasil dibersihkan."
            : "Log audit yang lebih lama dari {$label} ({$deletedCount} rekaman) berhasil dibersihkan.";

        return back()->with('success', $message);
    }
}
