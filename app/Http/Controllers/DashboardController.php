<?php

namespace App\Http\Controllers;

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

        return Inertia::render('dashboard', [
            'tasks' => Task::query()->with('matter:id,matter_number,title')->where('assignee_id', $user->getKey())
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
