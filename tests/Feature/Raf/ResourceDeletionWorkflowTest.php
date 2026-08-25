<?php

use App\Models\AuditLog;
use App\Models\Contact;
use App\Models\Correspondence;
use App\Models\Deadline;
use App\Models\Document;
use App\Models\Expense;
use App\Models\Matter;
use App\Models\MatterEvent;
use App\Models\MatterParty;
use App\Models\Note;
use App\Models\Task;

it('allows authorized user to delete matter sub-resources and records audit trail', function () {
    $user = rafUser(['matter.view', 'matter.update', 'matter.manage']);
    $matter = Matter::factory()->recycle($user)->create();

    $party = MatterParty::factory()->create([
        'matter_id' => $matter->getKey(),
        'party_type' => 'opposing_party',
        'name' => 'Pihak Lawan PT XYZ',
        'created_by' => $user->getKey(),
    ]);
    $deadline = Deadline::factory()->create(['matter_id' => $matter->getKey()]);
    $event = MatterEvent::factory()->create(['matter_id' => $matter->getKey()]);
    $note = Note::factory()->create([
        'matter_id' => $matter->getKey(),
        'title' => 'Catatan Rahasia',
        'body' => 'Isi catatan hukum internal.',
        'created_by' => $user->getKey(),
    ]);

    // Delete Party
    $this->actingAs($user)->delete(route('matters.parties.destroy', [$matter, $party]))
        ->assertRedirect();
    $this->assertModelMissing($party);
    expect(AuditLog::query()->where('event', 'matter.party_deleted')->exists())->toBeTrue();

    // Delete Deadline
    $this->actingAs($user)->delete(route('matters.deadlines.destroy', [$matter, $deadline]))
        ->assertRedirect();
    $this->assertModelMissing($deadline);
    expect(AuditLog::query()->where('event', 'matter.deadline_deleted')->exists())->toBeTrue();

    // Delete Event
    $this->actingAs($user)->delete(route('matters.events.destroy', [$matter, $event]))
        ->assertRedirect();
    $this->assertModelMissing($event);
    expect(AuditLog::query()->where('event', 'matter.event_deleted')->exists())->toBeTrue();

    // Delete Note
    $this->actingAs($user)->delete(route('matters.notes.destroy', [$matter, $note]))
        ->assertRedirect();
    $this->assertModelMissing($note);
    expect(AuditLog::query()->where('event', 'matter.note_deleted')->exists())->toBeTrue();
});

it('allows authorized user or task reporter to delete tasks', function () {
    $manager = rafUser(['task.view', 'task.manage']);
    $reporter = rafUser(['task.view', 'task.create']);
    $outsider = rafUser(['task.view']);

    $task1 = Task::factory()->create([
        'matter_id' => null,
        'reporter_id' => $reporter->getKey(),
    ]);
    $task2 = Task::factory()->create([
        'matter_id' => null,
        'reporter_id' => $manager->getKey(),
    ]);

    // Outsider cannot delete
    $this->actingAs($outsider)->delete(route('tasks.destroy', $task1))->assertForbidden();

    // Reporter can delete their own task
    $this->actingAs($reporter)->delete(route('tasks.destroy', $task1))->assertRedirect();
    $this->assertModelMissing($task1);

    // Manager can delete any task
    $this->actingAs($manager)->delete(route('tasks.destroy', $task2))->assertRedirect();
    $this->assertModelMissing($task2);
    expect(AuditLog::query()->where('event', 'task.deleted')->exists())->toBeTrue();
});

it('allows authorized user to delete contacts', function () {
    $manager = rafUser(['contact.view', 'contact.manage']);
    $viewer = rafUser(['contact.view']);
    $contact = Contact::factory()->create();

    $this->actingAs($viewer)->delete(route('contacts.destroy', $contact))->assertForbidden();

    $this->actingAs($manager)->delete(route('contacts.destroy', $contact))->assertRedirect();
    $this->assertModelMissing($contact);
    expect(AuditLog::query()->where('event', 'contact.deleted')->exists())->toBeTrue();
});

it('allows authorized user to delete finance expenses', function () {
    $manager = rafUser(['billing.view', 'expense.manage', 'matter.view']);
    $viewer = rafUser(['billing.view', 'matter.view']);
    $matter = Matter::factory()->recycle($manager)->create();
    $expense = Expense::factory()->recycle($manager)->create(['matter_id' => $matter->getKey()]);

    $this->actingAs($viewer)->delete(route('finance.expenses.destroy', $expense))->assertForbidden();

    $this->actingAs($manager)->delete(route('finance.expenses.destroy', $expense))->assertRedirect();
    $this->assertModelMissing($expense);
    expect(AuditLog::query()->where('event', 'expense.deleted')->exists())->toBeTrue();
});

it('allows authorized user to delete governance correspondence', function () {
    $manager = rafUser(['correspondence.view', 'correspondence.manage', 'matter.view']);
    $viewer = rafUser(['correspondence.view', 'matter.view']);
    $matter = Matter::factory()->recycle($manager)->create();
    $correspondence = Correspondence::factory()->create([
        'matter_id' => $matter->getKey(),
        'direction' => 'inbound',
        'source' => 'manual',
        'subject' => 'Surat Panggilan Sidang',
        'from_addresses' => ['pengadilan@mahkamahagung.go.id'],
        'to_addresses' => ['litigasi@rpklawoffice.com'],
        'occurred_at' => now(),
        'created_by' => $manager->getKey(),
    ]);

    $this->actingAs($viewer)->delete(route('governance.correspondences.destroy', $correspondence))->assertForbidden();

    $this->actingAs($manager)->delete(route('governance.correspondences.destroy', $correspondence))
        ->assertRedirect(route('governance.index'));
    $this->assertModelMissing($correspondence);
    expect(AuditLog::query()->where('event', 'correspondence.deleted')->exists())->toBeTrue();
});

it('allows authorized user to delete documents', function () {
    $manager = rafUser(['document.view', 'document.delete', 'matter.view']);
    $viewer = rafUser(['document.view', 'matter.view']);
    $matter = Matter::factory()->recycle($manager)->create();
    $document = Document::factory()->recycle($matter)->create(['created_by' => $manager->getKey()]);

    $this->actingAs($viewer)->delete(route('documents.destroy', $document))->assertForbidden();

    $this->actingAs($manager)->delete(route('documents.destroy', $document))
        ->assertRedirect(route('documents.index'));
    $this->assertModelMissing($document);
    expect(AuditLog::query()->where('event', 'document.deleted')->exists())->toBeTrue();
});

it('blocks deletions when matter is placed on legal hold', function () {
    $user = rafUser(['matter.view', 'matter.update', 'matter.manage', 'document.view', 'document.delete', 'correspondence.view', 'correspondence.manage']);
    $matter = Matter::factory()->recycle($user)->create([
        'legal_hold_at' => now(),
        'legal_hold_reason' => 'Penyelidikan resmi institusi hukum',
    ]);

    $party = MatterParty::factory()->create([
        'matter_id' => $matter->getKey(),
        'party_type' => 'opposing_party',
        'name' => 'Pihak Terlindungi',
        'created_by' => $user->getKey(),
    ]);
    $document = Document::factory()->recycle($matter)->create(['created_by' => $user->getKey()]);
    $correspondence = Correspondence::factory()->create([
        'matter_id' => $matter->getKey(),
        'direction' => 'inbound',
        'source' => 'manual',
        'subject' => 'Surat Hold',
        'from_addresses' => ['hold@example.com'],
        'to_addresses' => ['litigasi@rpklawoffice.com'],
        'occurred_at' => now(),
        'created_by' => $user->getKey(),
    ]);

    // Deleting party on legal hold should throw DomainException
    $this->withoutExceptionHandling();
    expect(fn () => $this->actingAs($user)->delete(route('matters.parties.destroy', [$matter, $party])))
        ->toThrow(DomainException::class);
    $this->assertModelExists($party);

    // Deleting document on legal hold should throw DomainException
    expect(fn () => $this->actingAs($user)->delete(route('documents.destroy', $document)))
        ->toThrow(DomainException::class);
    $this->assertModelExists($document);

    // Deleting correspondence on legal hold should throw DomainException
    expect(fn () => $this->actingAs($user)->delete(route('governance.correspondences.destroy', $correspondence)))
        ->toThrow(DomainException::class);
    $this->assertModelExists($correspondence);
});
