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
use App\Models\User;
use App\Notifications\HearingOutcomeNotification;
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

    /**
     * Record outcome for a hearing / matter event and optionally schedule the next hearing.
     */
    public function recordOutcome(Request $request, Matter $matter, MatterEvent $event, EnsureMatterIsNotOnLegalHold $hold, AuditService $audit): RedirectResponse
    {
        Gate::authorize('update', $matter);
        $hold->handle($matter);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:completed,postponed,cancelled'],
            'outcome' => ['required', 'string', 'max:5000'],
            'judge_notes' => ['nullable', 'string', 'max:5000'],
            'attended_by' => ['nullable', 'integer', 'exists:users,id'],
            'schedule_next' => ['nullable', 'boolean'],
            'next_title' => ['required_if:schedule_next,true', 'nullable', 'string', 'max:255'],
            'next_starts_at' => ['required_if:schedule_next,true', 'nullable', 'date'],
            'next_location' => ['nullable', 'string', 'max:255'],
            'next_description' => ['nullable', 'string', 'max:2000'],
        ]);

        $attendedUserId = ! empty($validated['attended_by']) ? (int) $validated['attended_by'] : $request->user()->getKey();
        $attendedUser = User::query()->find($attendedUserId);

        $nextEvent = null;
        if (! empty($validated['schedule_next']) && ! empty($validated['next_title']) && ! empty($validated['next_starts_at'])) {
            $nextEvent = $matter->events()->create([
                'event_type' => $event->event_type ?? 'court_hearing',
                'status' => 'scheduled',
                'title' => $validated['next_title'],
                'starts_at' => $validated['next_starts_at'],
                'location' => $validated['next_location'] ?? $event->location,
                'description' => $validated['next_description'] ?? null,
                'owner_id' => $event->owner_id ?? $request->user()->getKey(),
                'created_by' => $request->user()->getKey(),
            ]);

            $audit->record($nextEvent, 'matter.event_added', [
                'matter_id' => $matter->getKey(),
                'from_outcome_of' => $event->getKey(),
            ], $request->user(), $request);

            // Notify team of scheduled next hearing
            $members = $matter->members()->where('users.id', '!=', $request->user()->getKey())->get();
            foreach ($members as $member) {
                $member->notify((new HearingScheduledNotification(
                    hearingTitle: $nextEvent->title,
                    hearingDate: $nextEvent->starts_at?->translatedFormat('l, d F Y') ?? now()->translatedFormat('l, d F Y'),
                    hearingTime: $nextEvent->starts_at ? $nextEvent->starts_at->format('H:i').' WIB' : '09:00 WIB',
                    courtName: $nextEvent->location ?? 'Pengadilan',
                    matter: $matter,
                    scheduledBy: $request->user()->name
                ))->afterCommit());
            }
        }

        $event->update([
            'status' => $validated['status'],
            'outcome' => $validated['outcome'],
            'judge_notes' => $validated['judge_notes'] ?? null,
            'attended_by' => $attendedUserId,
            'next_event_id' => $nextEvent?->getKey(),
        ]);

        // Add discussion comment to matter thread
        $statusLabel = match ($validated['status']) {
            'completed' => 'Selesai Sesuai Agenda',
            'postponed' => 'Ditunda / Sidang Lanjutan',
            'cancelled' => 'Dibatalkan',
            default => $validated['status'],
        };

        $commentBody = "⚖️ **[Hasil Sidang: {$event->title}]**\n\n".
            "**Status Sidang:** {$statusLabel}\n".
            '**Advokat Pendamping:** '.($attendedUser?->name ?? $request->user()->name)."\n\n".
            "**Ringkasan Hasil:**\n".$validated['outcome'];

        if (! empty($validated['judge_notes'])) {
            $commentBody .= "\n\n**Catatan / Arahan Majelis Hakim:**\n".$validated['judge_notes'];
        }

        if ($nextEvent) {
            $commentBody .= "\n\n**Jadwal Sidang Lanjutan:**\n".
                '📅 '.($nextEvent->starts_at?->translatedFormat('l, d F Y - H:i') ?? '-')." WIB\n".
                '📌 Agenda: '.$nextEvent->title."\n".
                '📍 Lokasi: '.($nextEvent->location ?? '-');
        }

        $matter->comments()->create([
            'user_id' => $request->user()->getKey(),
            'body' => $commentBody,
        ]);

        $audit->record($event, 'matter.hearing_outcome_recorded', [
            'matter_id' => $matter->getKey(),
            'status' => $validated['status'],
            'outcome' => $validated['outcome'],
            'next_event_id' => $nextEvent?->getKey(),
        ], $request->user(), $request);

        // Notify supervising partner and matter members
        $notificationRecipients = $matter->members()->where('users.id', '!=', $request->user()->getKey())->get();
        foreach ($notificationRecipients as $recipient) {
            $recipient->notify((new HearingOutcomeNotification(
                hearingTitle: $event->title,
                hearingDate: $event->starts_at?->translatedFormat('l, d F Y') ?? now()->translatedFormat('l, d F Y'),
                outcomeSummary: $validated['outcome'],
                courtName: $event->location ?? 'Pengadilan',
                matter: $matter,
                attendedBy: $attendedUser?->name ?? $request->user()->name,
                nextHearingDate: $nextEvent ? $nextEvent->starts_at?->translatedFormat('l, d F Y - H:i').' WIB' : null,
                nextHearingAgenda: $nextEvent?->title
            ))->afterCommit());
        }

        return back()->with('success', 'Catatan hasil sidang berhasil disimpan'.($nextEvent ? ' dan agenda sidang lanjutan telah dijadwalkan.' : '.'));
    }
}
