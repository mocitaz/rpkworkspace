<?php

namespace App\Http\Controllers;

use App\Actions\CreateMatter;
use App\Actions\EnsureConflictCheckCleared;
use App\Actions\RunConflictCheck;
use App\Actions\UpdateMatter;
use App\Http\Requests\StoreMatterConflictCheckRequest;
use App\Http\Requests\StoreMatterRequest;
use App\Http\Requests\UpdateMatterRequest;
use App\Models\Client;
use App\Models\ConflictCheck;
use App\Models\Document;
use App\Models\Matter;
use App\Models\PracticeArea;
use App\Models\User;
use App\Notifications\MatterAssignedNotification;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MatterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Matter::class);
        $search = $request->string('search')->trim()->toString();

        return Inertia::render('matters/index', [
            'matters' => Matter::query()->visibleTo($request->user())
                ->with(['client:id,display_name,type,client_number', 'practiceArea:id,name', 'responsiblePartner:id,name,avatar_path'])
                ->withMin(['deadlines as next_deadline' => fn ($query) => $query->where('status', 'open')->where('due_at', '>=', now())], 'due_at')
                ->when($search, fn ($query) => $query->where(fn ($nested) => $nested->where('matter_number', 'like', "%{$search}%")->orWhere('title', 'like', "%{$search}%")))
                ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
                ->when($request->integer('practice_area_id'), fn ($query, $id) => $query->where('practice_area_id', $id))
                ->when($request->boolean('mine'), fn ($query) => $query->whereHas('members', fn ($members) => $members->whereKey($request->user()->getKey())))
                ->latest('updated_at')->paginate(15)->withQueryString(),
            'practiceAreas' => PracticeArea::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name']),
            'filters' => $request->only(['search', 'status', 'practice_area_id', 'mine']),
            'can' => ['create' => $request->user()->can('create', Matter::class)],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', Matter::class);

        $conflictCheck = $request->filled('conflict_check')
            ? ConflictCheck::query()->whereKey($request->string('conflict_check')->toString())->firstOrFail([
                'id', 'client_id', 'subject_name', 'searched_names', 'matches', 'status', 'decision', 'decision_note', 'expires_at',
            ])
            : null;

        return Inertia::render('matters/create', [
            'clients' => Client::query()->where('status', 'active')->orderBy('display_name')->get(['id', 'client_number', 'display_name']),
            'practiceAreas' => PracticeArea::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name']),
            'users' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'position_title']),
            'parentMatters' => Matter::query()->visibleTo($request->user())->whereNotIn('status', ['closed', 'archived'])->orderBy('matter_number')->get(['id', 'matter_number', 'title']),
            'conflictCheck' => $conflictCheck,
            'canRunConflictCheck' => $request->user()->hasPermission('conflict.manage'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMatterRequest $request, CreateMatter $createMatter, EnsureConflictCheckCleared $conflicts, AuditService $audit): RedirectResponse
    {
        $conflicts->forMatter($request->validated('conflict_check_id'), $request->validated('client_id'));
        $matter = $createMatter->handle($request->validated(), $request->user());
        $matter->members()->where('users.id', '!=', $request->user()->getKey())->where('users.is_active', true)->each(
            fn (User $user) => $user->notify((new MatterAssignedNotification($matter))->afterCommit()),
        );
        $audit->record($matter, 'matter.created', ['matter_number' => $matter->matter_number], $request->user(), $request);

        return to_route('matters.show', $matter)->with('success', 'Matter berhasil dibuat.');
    }

    public function storeConflictCheck(StoreMatterConflictCheckRequest $request, RunConflictCheck $run): RedirectResponse
    {
        $client = Client::query()->whereKey($request->validated('client_id'))->sole();
        $check = $run->handle($request->user(), $request->validated('names'), $client);

        return to_route('matters.create', ['conflict_check' => $check->getKey()])
            ->with('success', 'Conflict check selesai. Lengkapi data matter untuk melanjutkan intake.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Matter $matter): Response
    {
        Gate::authorize('view', $matter);
        $matter->load([
            'client:id,client_number,display_name,type,legal_name', 'practiceArea:id,name',
            'parentMatter:id,matter_number,title,relationship_type,status',
            'childMatters:id,parent_matter_id,matter_number,title,relationship_type,status,opened_at',
            'responsiblePartner:id,name,position_title,avatar_path', 'supervisingLawyer:id,name,position_title,avatar_path',
            'members:id,name,position_title,avatar_path', 'parties',
            'evidences' => fn ($query) => $query->with('creator:id,name')->orderBy('evidence_code', 'asc'),
            'chronologies' => fn ($query) => $query->orderBy('event_date', 'asc'),
            'deadlines' => fn ($query) => $query->where('status', 'open')->orderBy('due_at')->limit(8),
            'tasks' => fn ($query) => $query->with('assignee:id,name,avatar_path')->whereNotIn('status', ['completed', 'cancelled'])->orderBy('due_at')->limit(8),
            'events' => fn ($query) => $query->orderByDesc('starts_at')->limit(10),
            'documents' => fn ($query) => $query->with('currentVersion:id,document_id,version_number,file_size,mime_type')->latest('updated_at')->limit(8),
            'comments' => fn ($query) => $query->whereNull('parent_id')->with([
                'user:id,name,position_title,avatar_path',
                'reactions.user:id,name',
                'replies' => fn ($r) => $r->with(['user:id,name,position_title,avatar_path', 'reactions.user:id,name'])->oldest(),
            ])->orderByDesc('is_pinned')->latest(),
            'notes' => fn ($query) => $query->where(function ($notes) use ($request) {
                $notes->whereNull('private_to_id')->orWhere('private_to_id', $request->user()->getKey());
            })->latest()->limit(8),
        ]);

        return Inertia::render('matters/show', [
            'matter' => $matter,
            'firmStaff' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'position_title', 'avatar_path']),
            'can' => ['update' => $request->user()->can('update', $matter), 'uploadDocument' => $request->user()->can('create', Document::class)],
            'editOptions' => $request->user()->can('update', $matter) ? [
                'practiceAreas' => PracticeArea::query()->where('is_active', true)->orderBy('sort_order')->get(['id', 'name']),
                'users' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'position_title']),
                'parentMatters' => Matter::query()->visibleTo($request->user())->where('id', '!=', $matter->id)->whereNotIn('status', ['closed', 'archived'])->orderBy('matter_number')->get(['id', 'matter_number', 'title']),
            ] : null,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMatterRequest $request, Matter $matter, UpdateMatter $updateMatter, AuditService $audit): RedirectResponse
    {
        $updateMatter->handle($matter, $request->validated(), $request->user());
        $audit->record($matter, 'matter.updated', ['changed' => array_keys($matter->getChanges())], $request->user(), $request);

        return back()->with('success', 'Matter diperbarui.');
    }
}
