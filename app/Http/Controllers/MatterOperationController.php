<?php

namespace App\Http\Controllers;

use App\Actions\EnsureMatterIsNotOnLegalHold;
use App\Http\Requests\StoreMatterDeadlineRequest;
use App\Http\Requests\StoreMatterEventRequest;
use App\Http\Requests\StoreMatterNoteRequest;
use App\Http\Requests\StoreMatterPartyRequest;
use App\Models\Deadline;
use App\Models\Matter;
use App\Models\MatterEvent;
use App\Models\MatterEvidence;
use App\Models\MatterParty;
use App\Models\Note;
use App\Notifications\HearingScheduledNotification;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        $members = $matter->members()->where('users.id', '!=', $request->user()->getKey())->get();
        foreach ($members as $member) {
            $member->notify((new HearingScheduledNotification(
                hearingTitle: $event->title,
                hearingDate: $event->starts_at?->translatedFormat('l, d F Y') ?? now()->translatedFormat('l, d F Y'),
                hearingTime: $event->starts_at ? $event->starts_at->format('H:i').' WIB' : '09:00 WIB',
                courtName: $event->location ?? 'Pengadilan',
                matter: $matter,
                scheduledBy: $request->user()->name
            ))->afterCommit());
        }

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

    public function storeEvidence(Request $request, Matter $matter, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);

        $validated = $request->validate([
            'evidence_code' => ['required', 'string', 'max:32'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'originality' => ['required', 'string', 'in:original,legalized_copy,photocopy,digital'],
            'vault_location' => ['nullable', 'string', 'max:128'],
            'status' => ['required', 'string', 'in:in_vault,borrowed_for_hearing,submitted_to_court,returned_to_client'],
            'custodian_name' => ['nullable', 'string', 'max:128'],
            'custody_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $evidence = $matter->evidences()->create([
            ...$validated,
            'created_by' => $request->user()->getKey(),
        ]);

        $audit->record($evidence, 'matter.evidence_added', [
            'matter_id' => $matter->getKey(),
            'evidence_code' => $evidence->evidence_code,
            'vault_location' => $evidence->vault_location,
        ], $request->user(), $request);

        return back()->with('success', 'Alat bukti fisik berhasil dicatat di brankas.');
    }

    public function updateEvidence(Request $request, Matter $matter, MatterEvidence $evidence, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);

        $validated = $request->validate([
            'evidence_code' => ['required', 'string', 'max:32'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'originality' => ['required', 'string', 'in:original,legalized_copy,photocopy,digital'],
            'vault_location' => ['nullable', 'string', 'max:128'],
            'status' => ['required', 'string', 'in:in_vault,borrowed_for_hearing,submitted_to_court,returned_to_client'],
            'custodian_name' => ['nullable', 'string', 'max:128'],
            'custody_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $evidence->update($validated);

        $audit->record($evidence, 'matter.evidence_updated', [
            'matter_id' => $matter->getKey(),
            'evidence_code' => $evidence->evidence_code,
            'status' => $evidence->status,
        ], $request->user(), $request);

        return back()->with('success', 'Status alat bukti fisik berhasil diperbarui.');
    }

    public function destroyEvidence(Matter $matter, MatterEvidence $evidence, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);

        $code = $evidence->evidence_code;
        $evidence->delete();

        $audit->record($matter, 'matter.evidence_deleted', [
            'matter_id' => $matter->getKey(),
            'evidence_code' => $code,
        ], request()->user(), request());

        return back()->with('success', 'Alat bukti fisik berhasil dihapus.');
    }

    public function destroyParty(Matter $matter, MatterParty $party, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);

        $name = $party->name;
        $party->delete();

        $audit->record($matter, 'matter.party_deleted', [
            'matter_id' => $matter->getKey(),
            'name' => $name,
        ], request()->user(), request());

        return back()->with('success', 'Pihak terkait berhasil dihapus.');
    }

    public function destroyDeadline(Matter $matter, Deadline $deadline, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);

        $title = $deadline->title;
        $deadline->delete();

        $audit->record($matter, 'matter.deadline_deleted', [
            'matter_id' => $matter->getKey(),
            'title' => $title,
        ], request()->user(), request());

        return back()->with('success', 'Tenggat waktu berhasil dihapus.');
    }

    public function destroyEvent(Matter $matter, MatterEvent $event, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);

        $title = $event->title;
        $event->delete();

        $audit->record($matter, 'matter.event_deleted', [
            'matter_id' => $matter->getKey(),
            'title' => $title,
        ], request()->user(), request());

        return back()->with('success', 'Agenda sidang berhasil dihapus.');
    }

    public function destroyNote(Matter $matter, Note $note, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);

        $title = $note->title;
        $note->delete();

        $audit->record($matter, 'matter.note_deleted', [
            'matter_id' => $matter->getKey(),
            'title' => $title,
        ], request()->user(), request());

        return back()->with('success', 'Catatan internal berhasil dihapus.');
    }
}
