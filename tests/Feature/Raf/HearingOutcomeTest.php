<?php

use App\Models\Client;
use App\Models\Comment;
use App\Models\Matter;
use App\Models\MatterEvent;
use App\Notifications\HearingOutcomeNotification;
use Illuminate\Support\Facades\Notification;

test('authorized user can record completed hearing outcome without next hearing', function () {
    Notification::fake();

    $partner = rafUser(['matter.view', 'matter.view.all', 'matter.update']);
    $attendee = rafUser(['matter.view', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create([
        'client_id' => $client->id,
        'responsible_partner_id' => $partner->id,
    ]);

    $associate = rafUser(['matter.view', 'matter.view.all']);
    $matter->members()->attach($associate);

    $event = MatterEvent::factory()->create([
        'matter_id' => $matter->id,
        'event_type' => 'court',
        'title' => 'Sidang Pembacaan Gugatan',
        'status' => 'scheduled',
        'starts_at' => now()->subDay(),
        'ends_at' => now()->subDay()->addHour(),
        'created_by' => $partner->id,
    ]);

    $response = $this->actingAs($partner)->post(route('matters.events.outcome', [$matter->id, $event->id]), [
        'status' => 'completed',
        'attended_by' => $attendee->id,
        'outcome' => 'Gugatan telah dibacakan di hadapan Majelis Hakim. Tergugat meminta waktu 2 minggu untuk Jawaban.',
        'judge_notes' => 'Hakim mengingatkan pihak Tergugat agar tidak terlambat menyampaikan Jawaban tertulis.',
        'schedule_next' => '0',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $event->refresh();
    expect($event->status)->toBe('completed')
        ->and($event->attended_by)->toBe($attendee->id)
        ->and($event->outcome)->toContain('Gugatan telah dibacakan')
        ->and($event->judge_notes)->toContain('Hakim mengingatkan')
        ->and($event->next_event_id)->toBeNull();

    // Check automatic matter discussion comment
    $comment = Comment::where('commentable_type', Matter::class)
        ->where('commentable_id', $matter->id)
        ->latest('id')
        ->first();

    expect($comment)->not->toBeNull()
        ->and($comment->body)->toContain('Hasil Sidang')
        ->and($comment->body)->toContain('Gugatan telah dibacakan');

    // Check audit log
    $this->assertDatabaseHas('audit_logs', [
        'event' => 'matter.hearing_outcome_recorded',
        'subject_type' => MatterEvent::class,
        'subject_id' => $event->id,
    ]);

    Notification::assertSentTo(
        $associate,
        HearingOutcomeNotification::class
    );
});

test('recording postponed hearing outcome automatically creates next hearing event and links it', function () {
    Notification::fake();

    $partner = rafUser(['matter.view', 'matter.view.all', 'matter.update']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create([
        'client_id' => $client->id,
        'responsible_partner_id' => $partner->id,
    ]);

    $event = MatterEvent::factory()->create([
        'matter_id' => $matter->id,
        'event_type' => 'court',
        'title' => 'Sidang Pembuktian Penggugat',
        'status' => 'scheduled',
        'starts_at' => now()->subDay(),
        'created_by' => $partner->id,
    ]);

    $nextDate = now()->addDays(7)->setTime(10, 0, 0)->format('Y-m-d\TH:i');

    $response = $this->actingAs($partner)->post(route('matters.events.outcome', [$matter->id, $event->id]), [
        'status' => 'postponed',
        'attended_by' => $partner->id,
        'outcome' => 'Pemeriksaan 2 orang saksi fakta Penggugat selesai. Sidang ditunda untuk giliran bukti surat Tergugat.',
        'judge_notes' => 'Tergugat wajib membawa bukti asli T-1 s/d T-10 pada sidang berikutnya.',
        'schedule_next' => '1',
        'next_title' => 'Sidang Pembuktian & Saksi Tergugat',
        'next_starts_at' => $nextDate,
        'next_location' => 'Ruang Sidang Oemar Seno Adji, PN Jakarta Pusat',
        'next_description' => 'Penyerahan bukti surat Tergugat dan pemeriksaan saksi Tergugat.',
    ]);

    $response->assertRedirect();
    $event->refresh();

    expect($event->status)->toBe('postponed')
        ->and($event->next_event_id)->not->toBeNull();

    $nextEvent = $event->nextEvent;
    expect($nextEvent)->not->toBeNull()
        ->and($nextEvent->matter_id)->toBe($matter->id)
        ->and($nextEvent->title)->toBe('Sidang Pembuktian & Saksi Tergugat')
        ->and($nextEvent->location)->toBe('Ruang Sidang Oemar Seno Adji, PN Jakarta Pusat')
        ->and($nextEvent->status)->toBe('scheduled');
});

test('user can update existing hearing outcome and view in calendar', function () {
    $partner = rafUser(['matter.view', 'matter.view.all', 'matter.update']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create([
        'client_id' => $client->id,
        'responsible_partner_id' => $partner->id,
    ]);

    $event = MatterEvent::factory()->create([
        'matter_id' => $matter->id,
        'event_type' => 'court',
        'title' => 'Sidang Mediasi',
        'status' => 'scheduled',
        'starts_at' => now()->addDay(),
        'created_by' => $partner->id,
    ]);

    // First record outcome
    $this->actingAs($partner)->post(route('matters.events.outcome', [$matter->id, $event->id]), [
        'status' => 'completed',
        'outcome' => 'Mediasi berhasil mencapai kesepakatan damai sebagian.',
        'schedule_next' => '0',
    ])->assertRedirect();

    // Now update outcome
    $this->actingAs($partner)->post(route('matters.events.outcome', [$matter->id, $event->id]), [
        'status' => 'completed',
        'outcome' => 'Mediasi berhasil mencapai kesepakatan perdamaian penuh (Akta Perdamaian).',
        'judge_notes' => 'Hakim mediator akan menerbitkan Akta Perdamaian.',
        'schedule_next' => '0',
    ])->assertRedirect();

    $event->refresh();
    expect($event->outcome)->toContain('Akta Perdamaian')
        ->and($event->judge_notes)->toContain('Hakim mediator');

    // Calendar page response check
    $response = $this->actingAs($partner)->get(route('calendar.index'));
    $response->assertOk();
});

test('recording hearing outcome is blocked when matter is on legal hold', function () {
    $partner = rafUser(['matter.view', 'matter.view.all', 'matter.update']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create([
        'client_id' => $client->id,
        'responsible_partner_id' => $partner->id,
        'legal_hold_at' => now(),
    ]);

    $event = MatterEvent::factory()->create([
        'matter_id' => $matter->id,
        'event_type' => 'court',
        'title' => 'Sidang Kasasi',
    ]);

    $this->withoutExceptionHandling();
    expect(fn () => $this->actingAs($partner)->post(route('matters.events.outcome', [$matter->id, $event->id]), [
        'status' => 'completed',
        'outcome' => 'Sidang berjalan lancar.',
    ]))->toThrow(DomainException::class);
});
