<?php

use App\Models\Client;
use App\Models\Matter;
use App\Models\MatterChronology;
use App\Models\MatterEvent;
use App\Models\Payment;

test('authenticated advocate can create and delete matter chronology', function () {
    $user = rafUser(['matter.view', 'matter.update', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create(['client_id' => $client->id, 'responsible_partner_id' => $user->id]);

    $response = $this->actingAs($user)->post(route('matters.chronologies.store', $matter), [
        'event_date' => '2026-05-15',
        'title' => 'Rapat Negosiasi Klausa Kontrak Subkontraktor',
        'description' => 'Pembahasan adendum perpanjangan waktu kerja.',
        'evidence_reference' => 'Bukti P-2 / Risalah Rapat',
        'witness_name' => 'Dr. Hendra Wijaya',
        'importance_level' => 'high',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('matter_chronologies', [
        'matter_id' => $matter->id,
        'title' => 'Rapat Negosiasi Klausa Kontrak Subkontraktor',
        'importance_level' => 'high',
    ]);

    $chronology = MatterChronology::where('matter_id', $matter->id)->first();
    $deleteResponse = $this->actingAs($user)->delete(route('matters.chronologies.destroy', [$matter, $chronology]));
    $deleteResponse->assertRedirect();
    $this->assertDatabaseMissing('matter_chronologies', ['id' => $chronology->id]);
});

test('authenticated user can download matter chronology PDF', function () {
    $user = rafUser(['matter.view', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create(['client_id' => $client->id, 'responsible_partner_id' => $user->id]);

    $matter->chronologies()->create([
        'event_date' => '2026-04-10',
        'title' => 'Pemberian Somasi Pertama',
        'importance_level' => 'critical',
    ]);

    $response = $this->actingAs($user)->get(route('matters.chronologies.pdf', $matter));
    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/pdf');
});

test('authenticated user can generate matter status report PDF', function () {
    $user = rafUser(['matter.view', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create(['client_id' => $client->id, 'responsible_partner_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('matters.status-report.pdf', $matter));
    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/pdf');
});

test('advocate can update courtroom checklist for a hearing', function () {
    $user = rafUser(['matter.view', 'matter.update', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create(['client_id' => $client->id, 'responsible_partner_id' => $user->id]);
    $event = MatterEvent::create([
        'matter_id' => $matter->id,
        'event_type' => 'court',
        'title' => 'Sidang Pembuktian Pertama di PN Bandung',
        'starts_at' => now()->addDays(3),
        'location' => 'Ruang Kusumah Atmadja',
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->put(route('matters.events.checklist.update', [$matter, $event]), [
        'checklist' => [
            ['text' => 'Surat Kuasa Khusus Asli bermaterai', 'checked' => true],
            ['text' => 'Daftar Alat Bukti Surat (P-1 s/d P-10)', 'checked' => false],
        ],
    ]);

    $response->assertRedirect();
    $event->refresh();
    expect($event->checklist)->toHaveCount(2)
        ->and($event->checklist[0]['checked'])->toBeTrue()
        ->and($event->checklist[1]['checked'])->toBeFalse();
});

test('user with permission can download official payment receipt PDF', function () {
    $user = rafUser(['payment.view', 'matter.view', 'matter.view.all']);
    $client = Client::factory()->create();
    $matter = Matter::factory()->create(['client_id' => $client->id, 'responsible_partner_id' => $user->id]);
    $payment = Payment::create([
        'client_id' => $client->id,
        'matter_id' => $matter->id,
        'amount' => 50000000,
        'currency' => 'IDR',
        'method' => 'bank_transfer',
        'reference_number' => 'PAY-TEST-001',
        'received_at' => now(),
        'recorded_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->get(route('finance.payments.receipt', $payment));
    $response->assertOk();
    $response->assertHeader('Content-Type', 'application/pdf');
});

test('authenticated user can export calendar iCal feed', function () {
    $user = rafUser(['calendar.view', 'matter.view', 'matter.view.all']);

    $response = $this->actingAs($user)->get(route('calendar.export.ics'));
    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/calendar; charset=utf-8');
    expect($response->getContent())->toContain('BEGIN:VCALENDAR')
        ->and($response->getContent())->toContain('END:VCALENDAR');
});

test('admin can export audit logs as CSV', function () {
    $admin = rafUser(['audit.view', 'admin.view']);

    $response = $this->actingAs($admin)->get(route('admin.audit.export'));
    $response->assertOk();
    $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
});
