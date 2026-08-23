<?php

namespace App\Http\Controllers;

use App\Actions\EnsureMatterIsNotOnLegalHold;
use App\Http\Requests\StoreMatterDeadlineRequest;
use App\Http\Requests\StoreMatterEventRequest;
use App\Http\Requests\StoreMatterNoteRequest;
use App\Http\Requests\StoreMatterPartyRequest;
use App\Models\Matter;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class MatterOperationController extends Controller
{
    public function storeParty(StoreMatterPartyRequest $request, Matter $matter, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);
        $party = $matter->parties()->create([...$request->validated(), 'created_by' => $request->user()->getKey()]);
        $audit->record($party, 'matter.party_added', ['matter_id' => $matter->getKey()], $request->user(), $request);

        return back()->with('success', 'Pihak terkait ditambahkan.');
    }

    public function storeDeadline(StoreMatterDeadlineRequest $request, Matter $matter, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);
        $deadline = $matter->deadlines()->create([...$request->validated(), 'owner_id' => $request->user()->getKey(), 'created_by' => $request->user()->getKey()]);
        $audit->record($deadline, 'matter.deadline_added', ['matter_id' => $matter->getKey()], $request->user(), $request);

        return back()->with('success', 'Tenggat ditambahkan.');
    }

    public function storeEvent(StoreMatterEventRequest $request, Matter $matter, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);
        $event = $matter->events()->create([...$request->validated(), 'owner_id' => $request->user()->getKey(), 'created_by' => $request->user()->getKey()]);
        $audit->record($event, 'matter.event_added', ['matter_id' => $matter->getKey()], $request->user(), $request);

        return back()->with('success', 'Agenda ditambahkan.');
    }

    public function storeNote(StoreMatterNoteRequest $request, Matter $matter, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);
        $note = $matter->notes()->create([...$request->validated(), 'client_id' => $matter->client_id, 'created_by' => $request->user()->getKey()]);
        $audit->record($note, 'matter.note_added', ['matter_id' => $matter->getKey()], $request->user(), $request);

        return back()->with('success', 'Catatan ditambahkan.');
    }
}
