<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\Client;
use App\Models\Contact;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Contact::class);
        $search = $request->string('search')->trim()->toString();
        $clientId = $request->string('client_id')->trim()->toString();

        $query = Contact::query()->with('client:id,display_name')
            ->when($search, fn ($q) => $q->where(function ($nested) use ($search) {
                $nested->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('job_title', 'like', "%{$search}%")
                    ->orWhere('organization_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%");
            }))
            ->when($clientId, fn ($q) => $q->where('client_id', $clientId));

        $metrics = [
            'total' => Contact::query()->count(),
            'client_linked' => Contact::query()->whereNotNull('client_id')->count(),
            'independent' => Contact::query()->whereNull('client_id')->count(),
            'connected_clients' => Contact::query()->whereNotNull('client_id')->distinct('client_id')->count('client_id'),
        ];

        return Inertia::render('contacts/index', [
            'contacts' => $query->orderBy('last_name')->orderBy('first_name')->paginate(18)->withQueryString(),
            'clients' => Client::query()->where('status', 'active')->orderBy('display_name')->get(['id', 'display_name']),
            'metrics' => $metrics,
            'filters' => $request->only(['search', 'client_id']),
            'can' => ['create' => $request->user()->can('create', Contact::class)],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactRequest $request, AuditService $audit): RedirectResponse
    {
        $contact = Contact::query()->create([...$request->validated(), 'created_by' => $request->user()->getKey()]);
        $audit->record($contact, 'contact.created', [], $request->user(), $request);

        return back()->with('success', 'Kontak berhasil ditambahkan.');
    }
}
