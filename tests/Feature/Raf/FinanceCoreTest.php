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
use App\Models\Client;
use App\Models\Matter;
use App\Services\AuditService;
use App\Services\MatterFinancialOverview;
use App\WorkflowStatus;

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
    $quotation = app(CreateQuotation::class)->handle([
        'client_id' => $client->getKey(),
        'title' => 'Proposal pendampingan',
        'items' => [['description' => 'Fee', 'quantity' => 1, 'unit_amount' => 2_000_000]],
    ], $actor, app(GenerateDocumentNumber::class));

    app(ApproveQuotation::class)->handle($quotation, $actor, 'Disetujui partner.');

    expect($quotation->refresh()->status)->toBe('approved')
        ->and($quotation->approved_by)->toBe($actor->getKey())
        ->and($quotation->approved_at)->not->toBeNull();
});
