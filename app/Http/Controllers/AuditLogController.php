<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
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
                ->with('actor:id,name,email')
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
}
