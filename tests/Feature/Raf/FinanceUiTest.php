<?php

use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use App\Models\Matter;
use App\Models\Quotation;
use App\Models\QuoteLineItem;
use Inertia\Testing\AssertableInertia as Assert;

test('renders finance workspace for an authorized user', function () {
    $user = rafUser(['matter.view', 'billing.view']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $response = $this->actingAs($user)->get(route('finance.index'));

    $response->assertSuccessful()->assertInertia(fn (Assert $page) => $page->component('finance/index'));
});

test('downloads professional invoice and quotation pdf documents', function () {
    $user = rafUser(['matter.view', 'billing.view']);
    $matter = Matter::factory()->create(['responsible_partner_id' => $user->id]);
    $invoice = Invoice::factory()->create([
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
    ]);
    InvoiceLineItem::factory()->create(['invoice_id' => $invoice->id]);
    $quotation = Quotation::factory()->create([
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
    ]);
    QuoteLineItem::factory()->create(['quotation_id' => $quotation->id]);

    $invoiceResponse = $this->actingAs($user)->get(route('finance.invoices.pdf', $invoice));
    $quotationResponse = $this->actingAs($user)->get(route('finance.quotations.pdf', $quotation));

    $invoiceResponse
        ->assertSuccessful()
        ->assertHeader('content-type', 'application/pdf')
        ->assertHeader('x-content-type-options', 'nosniff');
    $quotationResponse
        ->assertSuccessful()
        ->assertHeader('content-type', 'application/pdf')
        ->assertHeader('x-content-type-options', 'nosniff');

    expect($invoiceResponse->getContent())->toStartWith('%PDF')
        ->and(strlen($invoiceResponse->getContent()))->toBeGreaterThan(100_000)
        ->and($quotationResponse->getContent())->toStartWith('%PDF')
        ->and(strlen($quotationResponse->getContent()))->toBeGreaterThan(100_000);
});

test('renders finance workspace filtered by specific matter_id parameter', function () {
    $user = rafUser(['matter.view', 'billing.view']);
    $matter = Matter::factory()->create(['responsible_partner_id' => $user->id, 'budget_amount' => 50000000, 'currency' => 'IDR']);
    Invoice::factory()->create([
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
        'outstanding_amount' => 5000000,
        'due_at' => now()->addDays(10),
    ]);

    $response = $this->actingAs($user)->get(route('finance.index', ['matter_id' => $matter->id]));

    $response->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('finance/index')
            ->where('selectedMatterId', $matter->id)
            ->has('overview')
        );
});
