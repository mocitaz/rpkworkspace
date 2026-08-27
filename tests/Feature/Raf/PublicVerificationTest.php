<?php

use App\Models\Client;
use App\Models\Correspondence;
use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use App\Models\Matter;
use App\Models\User;
use App\Services\PdfRenderer;

test('public invoice verification page returns 200 with accurate metadata', function () {
    $user = User::factory()->create(['name' => 'Adv. Roni, S.H.']);
    $client = Client::factory()->create([
        'display_name' => 'PT Surya Perkasa',
        'legal_name' => 'PT Surya Perkasa Nusantara Tbk',
    ]);
    $matter = Matter::factory()->create([
        'matter_number' => 'MAT-2026-088',
        'title' => 'Sengketa Kontrak Kerjasama Komersial',
        'client_id' => $client->id,
    ]);

    $invoice = Invoice::factory()->create([
        'invoice_number' => 'INV-2026-9901',
        'client_id' => $client->id,
        'matter_id' => $matter->id,
        'status' => 'paid',
        'subtotal_amount' => 15000000,
        'tax_rate' => 11,
        'tax_amount' => 1650000,
        'total_amount' => 16650000,
        'paid_amount' => 16650000,
        'outstanding_amount' => 0,
        'issued_at' => now()->subDays(5),
        'created_by' => $user->id,
    ]);

    InvoiceLineItem::factory()->create([
        'invoice_id' => $invoice->id,
        'description' => 'Jasa Penyusunan Legal Opinion Sengketa Arbitrase',
        'quantity' => 1,
        'unit_amount' => 15000000,
        'total_amount' => 15000000,
    ]);

    $response = $this->get(route('verify.invoice', $invoice->invoice_number));

    $response->assertOk();
    $response->assertSee('INV-2026-9901');
    $response->assertSee('PT Surya Perkasa');
    $response->assertSee('MAT-2026-088');
    $response->assertSee('Lunas (Paid)');
    $response->assertSee('Jasa Penyusunan Legal Opinion Sengketa Arbitrase');
});

test('public invoice verification returns 404 for invalid invoice number', function () {
    $response = $this->get(route('verify.invoice', 'INV-NON-EXISTENT'));
    $response->assertNotFound();
});

test('public invoice QR code endpoint returns valid SVG response', function () {
    $invoice = Invoice::factory()->create(['invoice_number' => 'INV-2026-QR01']);

    $response = $this->get(route('verify.invoice.qr', $invoice->invoice_number));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'image/svg+xml');
    expect($response->getContent())->toContain('<svg');
});

test('public correspondence verification page returns 200 with accurate metadata', function () {
    $user = User::factory()->create(['name' => 'Adv. Putra, S.H.']);
    $client = Client::factory()->create(['display_name' => 'CV Maju Jaya Abadi']);
    $matter = Matter::factory()->create([
        'matter_number' => 'MAT-2026-099',
        'title' => 'Somasi Keterlambatan Pembayaran Proyek',
        'client_id' => $client->id,
    ]);

    $correspondence = Correspondence::factory()->create([
        'matter_id' => $matter->id,
        'client_id' => $client->id,
        'direction' => 'outbound',
        'source' => 'email',
        'subject' => 'Surat Somasi I - Pemenuhan Kewajiban Kontraktual',
        'from_addresses' => ['legal@rpklaw.co.id'],
        'to_addresses' => ['direksi@kontraktor.com'],
        'cc_addresses' => ['management@majujaya.com'],
        'occurred_at' => now()->subDays(2),
        'created_by' => $user->id,
    ]);

    $response = $this->get(route('verify.correspondence', $correspondence));

    $response->assertOk();
    $response->assertSee('Surat Somasi I - Pemenuhan Kewajiban Kontraktual');
    $response->assertSee('MAT-2026-099');
    $response->assertSee('CV Maju Jaya Abadi');
    $response->assertSee('Surat Keluar (Outbound)');
    $response->assertSee('legal@rpklaw.co.id');
    $response->assertSee('direksi@kontraktor.com');
});

test('public correspondence QR code endpoint returns valid SVG response', function () {
    $matter = Matter::factory()->create();
    $correspondence = Correspondence::factory()->create([
        'matter_id' => $matter->id,
        'direction' => 'outbound',
    ]);

    $response = $this->get(route('verify.correspondence.qr', $correspondence));

    $response->assertOk();
    $response->assertHeader('Content-Type', 'image/svg+xml');
    expect($response->getContent())->toContain('<svg');
});

test('invoice PDF view renders with embedded verification QR code without errors', function () {
    $invoice = Invoice::factory()->create([
        'invoice_number' => 'INV-2026-PDF-TEST',
        'status' => 'issued',
        'subtotal_amount' => 10000000,
        'tax_rate' => 11,
        'tax_amount' => 1100000,
        'total_amount' => 11100000,
        'paid_amount' => 0,
        'outstanding_amount' => 11100000,
    ]);

    $invoice->loadMissing(['client', 'matter', 'lineItems']);
    $renderer = app(PdfRenderer::class);

    $pdfContent = $renderer->render('pdf.invoice', ['invoice' => $invoice]);
    expect($pdfContent)->not->toBeEmpty();
    expect(strlen($pdfContent))->toBeGreaterThan(1000);
});
