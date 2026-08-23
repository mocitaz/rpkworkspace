<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use App\Models\Document;
use App\Models\Matter;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Client::class);
        $search = $request->string('search')->trim()->toString();

        return Inertia::render('clients/index', [
            'clients' => Client::query()->with('relationshipPartner:id,name,position_title,avatar_path')->withCount(['contacts', 'matters'])
                ->when($search, fn ($query) => $query->where(fn ($nested) => $nested->where('display_name', 'like', "%{$search}%")->orWhere('client_number', 'like', "%{$search}%")))
                ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
                ->latest('updated_at')->paginate(15)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
            'can' => ['create' => $request->user()->can('create', Client::class)],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('create', Client::class);

        return Inertia::render('clients/create', [
            'partners' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'position_title', 'avatar_path']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request, AuditService $audit): RedirectResponse
    {
        $id = (string) Str::ulid();
        $client = Client::query()->create([
            ...$request->validated(),
            'id' => $id,
            'client_number' => 'RAF-C-'.now(config('raf.timezone'))->format('Y').'-'.Str::upper(Str::substr($id, -6)),
            'opened_at' => now()->toDateString(),
            'created_by' => $request->user()->getKey(),
        ]);
        $audit->record($client, 'client.created', ['client_number' => $client->client_number], $request->user(), $request);

        return to_route('clients.show', $client)->with('success', 'Klien berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Client $client): Response
    {
        Gate::authorize('view', $client);
        $canUpdate = $request->user()->can('update', $client);
        $client->load(['relationshipPartner:id,name,position_title,avatar_path', 'contacts' => fn ($query) => $query->orderBy('last_name')]);

        if ($canUpdate) {
            $client->makeVisible('tax_identifier');
        }

        $visibleMatters = Matter::query()->visibleTo($request->user())->whereBelongsTo($client)
            ->with(['practiceArea:id,name', 'responsiblePartner:id,name,position_title,avatar_path'])->latest('updated_at')->get();

        return Inertia::render('clients/show', [
            'client' => $client,
            'activeMatters' => $visibleMatters->whereNotIn('status', ['closed', 'archived'])->values(),
            'closedMatters' => $visibleMatters->whereIn('status', ['closed', 'archived'])->values(),
            'documents' => Document::query()->visibleTo($request->user())->whereBelongsTo($client)
                ->with('currentVersion:id,document_id,version_number,file_size')->latest('updated_at')->limit(8)->get(),
            'partners' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'position_title', 'avatar_path']),
            'can' => ['update' => $canUpdate],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Client $client): Response
    {
        Gate::authorize('update', $client);

        if ($request->user()->can('update', $client)) {
            $client->makeVisible('tax_identifier');
        }

        return Inertia::render('clients/edit', [
            'client' => $client,
            'partners' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'position_title', 'avatar_path']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client, AuditService $audit): RedirectResponse
    {
        $attributes = $request->validated();

        if (($attributes['tax_identifier'] ?? null) === null || $attributes['tax_identifier'] === '') {
            unset($attributes['tax_identifier']);
        }

        $client->update($attributes);
        $audit->record($client, 'client.updated', ['changed' => array_keys($client->getChanges())], $request->user(), $request);

        return to_route('clients.show', $client)->with('success', 'Data klien berhasil diperbarui.');
    }
}
