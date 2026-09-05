<?php

use App\Actions\ApproveQuotation;
use App\Actions\CreateExpense;
use App\Actions\CreateInvoice;
use App\Actions\CreateQuotation;
use App\Actions\GenerateDocumentNumber;
use App\Actions\RecordPayment;
use App\Actions\RefundPayment;
use App\Actions\ReversePayment;
use App\Actions\TransitionInvoice;
use App\Actions\UpdateInvoice;
use App\Actions\UpdateQuotation;
use App\Models\Client;
use App\Models\FinancialAccount;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\Payment;
use App\Services\AuditService;
use App\Services\MatterFinancialOverview;
use App\WorkflowStatus;
use Illuminate\Support\Carbon;

it('allows finance managers to update matter contract terms', function () {
    $actor = rafUser(['billing.view', 'billing.manage']);
    $matter = Matter::factory()->recycle($actor)->create();

    $this->actingAs($actor)->patch(route('finance.matters.contract.update', $matter), [
        'budget_amount' => 225_000_000,
        'currency' => 'IDR',
        'contract_date' => '2026-09-01',
        'billing_model' => 'retainer',
    ])->assertSessionHasNoErrors();

    expect($matter->fresh())
        ->budget_amount->toBe(225_000_000)
        ->currency->toBe('IDR')
        ->contract_date->format('Y-m-d')->toBe('2026-09-01')
        ->billing_model->toBe('retainer');
});

it('calculates quotation and invoice totals on the server', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);
    $numbers = app(GenerateDocumentNumber::class);
    $items = [
        ['description' => 'Legal advisory', 'quantity' => 2, 'unit_amount' => 1_500_000],
        ['description' => 'Court filing', 'quantity' => 1, 'unit_amount' => 500_000],
    ];

    $quotation = app(CreateQuotation::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'title' => 'Proposal Pendampingan',
        'scope' => 'Pendampingan hukum',
        'discount_amount' => 250_000,
        'tax_rate' => 11,
        'items' => $items,
    ], $actor, $numbers);
    $invoice = app(CreateInvoice::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'quotation_id' => $quotation->getKey(),
        'title' => 'Tagihan Tahap Pertama',
        'status' => 'sent',
        'discount_amount' => 250_000,
        'tax_rate' => 11,
        'items' => $items,
    ], $actor, $numbers);

    expect($quotation->quotation_number)->toMatch('/^QT-\d{4}-0001$/')
        ->and($quotation->subtotal_amount)->toBe(3_500_000)
        ->and($quotation->tax_amount)->toBe(357_500)
        ->and($quotation->total_amount)->toBe(3_607_500)
        ->and($quotation->lineItems)->toHaveCount(2)
        ->and($invoice->invoice_number)->toMatch('/^INV-\d{4}-0001$/')
        ->and($invoice->outstanding_amount)->toBe(3_607_500)
        ->and($invoice->lineItems)->toHaveCount(2);
});

it('allocates partial payments without allowing invoice overpayment', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);
    $invoice = app(CreateInvoice::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'title' => 'Invoice',
        'status' => 'sent',
        'items' => [['description' => 'Fee', 'quantity' => 1, 'unit_amount' => 2_000_000]],
    ], $actor, app(GenerateDocumentNumber::class));

    $payment = app(RecordPayment::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'amount' => 1_250_000,
        'method' => 'bank_transfer',
        'received_at' => now(),
        'allocations' => [['invoice_id' => $invoice->getKey(), 'amount' => 1_250_000]],
    ], $actor, app(AuditService::class));

    expect($payment->allocations)->toHaveCount(1)
        ->and($invoice->fresh()->paid_amount)->toBe(1_250_000)
        ->and($invoice->fresh()->outstanding_amount)->toBe(750_000)
        ->and($invoice->fresh()->status)->toBe('sent');

    expect(fn () => app(RecordPayment::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'amount' => 1_000_000,
        'method' => 'bank_transfer',
        'received_at' => now(),
        'allocations' => [['invoice_id' => $invoice->getKey(), 'amount' => 1_000_000]],
    ], $actor, app(AuditService::class)))->toThrow(LogicException::class);
});

it('reverses a payment without deleting its financial audit trail', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);
    $invoice = app(CreateInvoice::class)->handle([
        'client_id' => $client->getKey(), 'matter_id' => $matter->getKey(), 'title' => 'Invoice', 'status' => 'sent',
        'items' => [['description' => 'Fee', 'quantity' => 1, 'unit_amount' => 2_000_000]],
    ], $actor, app(GenerateDocumentNumber::class));
    $payment = app(RecordPayment::class)->handle([
        'client_id' => $client->getKey(), 'matter_id' => $matter->getKey(), 'amount' => 2_000_000,
        'method' => 'bank_transfer', 'received_at' => now(),
        'allocations' => [['invoice_id' => $invoice->getKey(), 'amount' => 2_000_000]],
    ], $actor, app(AuditService::class));

    app(ReversePayment::class)->handle($payment, $actor, 'Transfer tercatat dua kali.');

    expect($payment->refresh()->reversed_at)->not->toBeNull()
        ->and($invoice->refresh()->paid_amount)->toBe(0)
        ->and($invoice->outstanding_amount)->toBe(2_000_000)
        ->and($invoice->status)->toBe('sent');
});

it('enforces official invoice transitions', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);
    $invoice = app(CreateInvoice::class)->handle([
        'client_id' => $client->getKey(), 'matter_id' => $matter->getKey(), 'title' => 'Invoice', 'status' => 'draft',
        'items' => [['description' => 'Fee', 'quantity' => 1, 'unit_amount' => 2_000_000]],
    ], $actor, app(GenerateDocumentNumber::class));

    app(TransitionInvoice::class)->handle($invoice, WorkflowStatus::Sent, $actor);

    expect($invoice->refresh()->status)->toBe('sent')->and($invoice->sent_at)->not->toBeNull();
});

it('requires a reason and zero payment balance before cancelling an invoice', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);
    $invoice = app(CreateInvoice::class)->handle([
        'client_id' => $client->getKey(), 'matter_id' => $matter->getKey(), 'title' => 'Invoice', 'status' => 'sent',
        'items' => [['description' => 'Fee', 'quantity' => 1, 'unit_amount' => 2_000_000]],
    ], $actor, app(GenerateDocumentNumber::class));
    app(RecordPayment::class)->handle([
        'client_id' => $client->getKey(), 'matter_id' => $matter->getKey(), 'amount' => 500_000,
        'method' => 'bank_transfer', 'received_at' => now(),
        'allocations' => [['invoice_id' => $invoice->getKey(), 'amount' => 500_000]],
    ], $actor, app(AuditService::class));

    expect(fn () => app(TransitionInvoice::class)->handle($invoice, WorkflowStatus::Cancelled, $actor, 'Duplikasi tagihan.'))
        ->toThrow(LogicException::class);
});

it('records a refund while restoring the invoice receivable and audit trail', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);
    $invoice = app(CreateInvoice::class)->handle([
        'client_id' => $client->getKey(), 'matter_id' => $matter->getKey(), 'title' => 'Invoice', 'status' => 'sent',
        'items' => [['description' => 'Fee', 'quantity' => 1, 'unit_amount' => 2_000_000]],
    ], $actor, app(GenerateDocumentNumber::class));
    $payment = app(RecordPayment::class)->handle([
        'client_id' => $client->getKey(), 'matter_id' => $matter->getKey(), 'amount' => 2_000_000,
        'method' => 'bank_transfer', 'received_at' => now(),
        'allocations' => [['invoice_id' => $invoice->getKey(), 'amount' => 2_000_000]],
    ], $actor, app(AuditService::class));

    app(RefundPayment::class)->handle($payment, $actor, 'Dana dikembalikan atas permintaan klien.');

    expect($payment->refresh()->refunded_at)->not->toBeNull()
        ->and($invoice->refresh()->paid_amount)->toBe(0)
        ->and($invoice->outstanding_amount)->toBe(2_000_000)
        ->and($invoice->status)->toBe('sent');
});

it('returns the financial overview of a matter', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create([
        'client_id' => $client->getKey(),
        'budget_amount' => 10_000_000,
    ]);
    $invoice = app(CreateInvoice::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'title' => 'Invoice',
        'status' => 'sent',
        'items' => [['description' => 'Fee', 'quantity' => 1, 'unit_amount' => 5_000_000]],
    ], $actor, app(GenerateDocumentNumber::class));
    app(RecordPayment::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'amount' => 3_000_000,
        'method' => 'bank_transfer',
        'received_at' => now(),
        'allocations' => [['invoice_id' => $invoice->getKey(), 'amount' => 3_000_000]],
    ], $actor, app(AuditService::class));
    app(CreateExpense::class)->handle([
        'matter_id' => $matter->getKey(),
        'category' => 'court_fee',
        'description' => 'Biaya panjar',
        'incurred_at' => now()->toDateString(),
        'amount' => 500_000,
        'status' => 'approved',
    ], $actor);

    expect(app(MatterFinancialOverview::class)->for($matter))->toMatchArray([
        'currency' => 'IDR',
        'budget_amount' => 10_000_000,
        'invoiced_amount' => 5_000_000,
        'payment_received_amount' => 3_000_000,
        'expense_amount' => 500_000,
        'receivable_amount' => 2_000_000,
        'margin_amount' => 2_500_000,
    ]);
});

it('records the partner approval of a quotation', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);
    $quotation = app(CreateQuotation::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'title' => 'Proposal pendampingan',
        'items' => [['description' => 'Fee', 'quantity' => 1, 'unit_amount' => 2_000_000]],
    ], $actor, app(GenerateDocumentNumber::class));

    app(ApproveQuotation::class)->handle($quotation, $actor, 'Disetujui partner.');

    expect($quotation->refresh()->status)->toBe('approved')
        ->and($quotation->approved_by)->toBe($actor->getKey())
        ->and($quotation->approved_at)->not->toBeNull();
});

it('calculates fractional tax rates with integer minor units', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);

    $invoice = app(CreateInvoice::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'title' => 'Invoice fractional tax',
        'tax_rate' => '11.25',
        'items' => [['description' => 'Fee', 'quantity' => 1, 'unit_amount' => 123_457]],
    ], $actor, app(GenerateDocumentNumber::class));

    expect($invoice->tax_amount)->toBe(13_889)
        ->and($invoice->total_amount)->toBe(137_346)
        ->and($invoice->outstanding_amount)->toBe(137_346);
});

it('places receivables in exact aging boundaries', function () {
    Carbon::setTestNow('2026-08-25 12:00:00');
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);

    foreach ([0, 1, 30, 31, 60, 61, 90, 91] as $daysPastDue) {
        Invoice::factory()->recycle([$actor, $client, $matter])->create([
            'client_id' => $client->getKey(),
            'matter_id' => $matter->getKey(),
            'status' => 'sent',
            'due_at' => today()->subDays($daysPastDue),
            'total_amount' => 100,
            'outstanding_amount' => 100,
            'paid_amount' => 0,
            'created_by' => $actor->getKey(),
        ]);
    }

    expect(app(MatterFinancialOverview::class)->for($matter)['aging'])->toBe([
        'current' => 100,
        '1_30' => 200,
        '31_60' => 200,
        '61_90' => 200,
        'over_90' => 100,
    ]);

    Carbon::setTestNow();
});

it('updates invoice and recalculates totals and line items', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);
    $numbers = app(GenerateDocumentNumber::class);

    $invoice = app(CreateInvoice::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'title' => 'Initial Invoice Title',
        'status' => 'draft',
        'currency' => 'IDR',
        'discount_amount' => 0,
        'tax_rate' => 0,
        'items' => [
            ['description' => 'Original Item 1', 'quantity' => 1, 'unit_amount' => 1_000_000],
        ],
    ], $actor, $numbers);

    expect($invoice->subtotal_amount)->toBe(1_000_000)
        ->and($invoice->total_amount)->toBe(1_000_000)
        ->and($invoice->lineItems)->toHaveCount(1);

    $updated = app(UpdateInvoice::class)->handle($invoice, [
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'title' => 'Updated Invoice Title',
        'status' => 'sent',
        'currency' => 'IDR',
        'discount_amount' => 200_000,
        'tax_rate' => 11,
        'items' => [
            ['description' => 'New Item A', 'quantity' => 2, 'unit_amount' => 1_500_000],
            ['description' => 'New Item B', 'quantity' => 1, 'unit_amount' => 500_000],
        ],
    ], $actor);

    // subtotal = 3,000,000 + 500,000 = 3,500,000
    // taxable = 3,500,000 - 200,000 = 3,300,000
    // tax = 3,300,000 * 11% = 363,000
    // total = 3,300,000 + 363,000 = 3,663,000
    expect($updated->title)->toBe('Updated Invoice Title')
        ->and($updated->status)->toBe('sent')
        ->and($updated->subtotal_amount)->toBe(3_500_000)
        ->and($updated->discount_amount)->toBe(200_000)
        ->and($updated->tax_amount)->toBe(363_000)
        ->and($updated->total_amount)->toBe(3_663_000)
        ->and($updated->outstanding_amount)->toBe(3_663_000)
        ->and($updated->lineItems)->toHaveCount(2)
        ->and($updated->lineItems->first()->description)->toBe('New Item A');
});

it('updates quotation and recalculates totals and line items', function () {
    $actor = rafUser();
    $client = Client::factory()->recycle($actor)->create();
    $matter = Matter::factory()->recycle($actor)->create(['client_id' => $client->getKey()]);
    $numbers = app(GenerateDocumentNumber::class);

    $quotation = app(CreateQuotation::class)->handle([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'title' => 'Proposal Asli',
        'scope' => 'Ruang lingkup awal',
        'status' => 'draft',
        'currency' => 'IDR',
        'discount_amount' => 0,
        'tax_rate' => 0,
        'items' => [
            ['description' => 'Konsultasi', 'quantity' => 1, 'unit_amount' => 5_000_000],
        ],
    ], $actor, $numbers);

    expect($quotation->subtotal_amount)->toBe(5_000_000)
        ->and($quotation->total_amount)->toBe(5_000_000)
        ->and($quotation->lineItems)->toHaveCount(1);

    $updated = app(UpdateQuotation::class)->handle($quotation, [
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'title' => 'Proposal Revisi Pendampingan',
        'scope' => 'Ruang lingkup diperluas hingga pengadilan tinggi',
        'status' => 'pending_approval',
        'currency' => 'IDR',
        'discount_amount' => 500_000,
        'tax_rate' => 11,
        'items' => [
            ['description' => 'Pendampingan Sidang', 'quantity' => 3, 'unit_amount' => 2_000_000],
            ['description' => 'Penyusunan Eksepsi', 'quantity' => 1, 'unit_amount' => 1_500_000],
        ],
    ], $actor);

    // subtotal = 6,000,000 + 1,500,000 = 7,500,000
    // taxable = 7,500,000 - 500,000 = 7,000,000
    // tax = 7,000,000 * 11% = 770,000
    // total = 7,000,000 + 770,000 = 7,770,000
    expect($updated->title)->toBe('Proposal Revisi Pendampingan')
        ->and($updated->scope)->toBe('Ruang lingkup diperluas hingga pengadilan tinggi')
        ->and($updated->status)->toBe('pending_approval')
        ->and($updated->subtotal_amount)->toBe(7_500_000)
        ->and($updated->discount_amount)->toBe(500_000)
        ->and($updated->tax_amount)->toBe(770_000)
        ->and($updated->total_amount)->toBe(7_770_000)
        ->and($updated->lineItems)->toHaveCount(2)
        ->and($updated->lineItems->first()->description)->toBe('Pendampingan Sidang');
});

it('auto-resolves client_id and validates allocations in storePayment endpoint', function () {
    $user = rafUser(['payment.manage', 'matter.view', 'billing.view']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $client = Client::factory()->recycle($user)->create();
    $matter = Matter::factory()->recycle($user)->create(['client_id' => $client->getKey()]);
    $account = FinancialAccount::create([
        'name' => 'Kas Operasional Kantor',
        'type' => 'cash',
        'currency' => 'IDR',
        'current_balance' => 10_000_000,
    ]);
    $invoice = Invoice::factory()->create([
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'status' => 'sent',
        'total_amount' => 33_500_000,
        'paid_amount' => 0,
        'outstanding_amount' => 33_500_000,
        'currency' => 'IDR',
    ]);

    // Test 1: Validation failure when allocation exceeds payment amount
    $failResponse = $this->actingAs($user)->post(route('finance.payments.store'), [
        'matter_id' => $matter->getKey(),
        'account_id' => $account->getKey(),
        'amount' => 5_000_000,
        'method' => 'Transfer bank',
        'received_at' => now()->toDateTimeLocalString(),
        'allocations' => [
            ['invoice_id' => $invoice->getKey(), 'amount' => 33_500_000],
        ],
    ]);

    $failResponse->assertSessionHasErrors(['allocations']);

    // Test 2: Success when allocation is valid and client_id is auto-resolved from matter
    $successResponse = $this->actingAs($user)->post(route('finance.payments.store'), [
        'matter_id' => $matter->getKey(),
        'account_id' => $account->getKey(),
        'amount' => 5_000_000,
        'method' => 'Transfer bank',
        'received_at' => now()->toDateTimeLocalString(),
        'allocations' => [
            ['invoice_id' => $invoice->getKey(), 'amount' => 5_000_000],
        ],
    ]);

    $successResponse->assertRedirect()->assertSessionHas('success');

    $payment = Payment::query()->latest()->first();
    expect($payment)->not->toBeNull()
        ->and($payment->client_id)->toBe($client->getKey())
        ->and($payment->matter_id)->toBe($matter->getKey())
        ->and($payment->amount)->toBe(5_000_000)
        ->and($payment->allocations)->toHaveCount(1);

    // Test 3: Success when both client_id and matter_id are null (penambahan kas umum / tanpa perkara & klien)
    $generalCashResponse = $this->actingAs($user)->post(route('finance.payments.store'), [
        'account_id' => $account->getKey(),
        'amount' => 2_500_000,
        'method' => 'Setor Tunai',
        'received_at' => now()->toDateTimeLocalString(),
    ]);

    $generalCashResponse->assertRedirect()->assertSessionHas('success');

    $generalPayment = Payment::query()->where('amount', 2_500_000)->first();
    expect($generalPayment)->not->toBeNull()
        ->and($generalPayment->client_id)->toBeNull()
        ->and($generalPayment->matter_id)->toBeNull()
        ->and($generalPayment->amount)->toBe(2_500_000);
});
