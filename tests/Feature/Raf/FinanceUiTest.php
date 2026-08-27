<?php

use App\Models\ConflictCheck;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\Expense;
use App\Models\FinancialAccount;
use App\Models\Invoice;
use App\Models\InvoiceLineItem;
use App\Models\Matter;
use App\Models\PartnerTransaction;
use App\Models\Payment;
use App\Models\Payroll;
use App\Models\Quotation;
use App\Models\QuoteLineItem;
use App\Models\SignatureRequest;
use App\Models\SignatureSigner;
use App\Services\PdfRenderer;
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

test('downloads professional payslip pdf document', function () {
    $user = rafUser(['matter.view', 'billing.view']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $payroll = Payroll::create([
        'payslip_number' => 'SLIP-2026-08-001',
        'user_id' => $user->id,
        'period' => '2026-08',
        'basic_salary' => 1500000,
        'fixed_allowance' => 0,
        'transport_meal_allowance' => 0,
        'overtime_amount' => 0,
        'bonus_amount' => 0,
        'tax_deduction_amount' => 0,
        'deductions_amount' => 0,
        'net_salary' => 1500000,
        'status' => 'paid',
        'paid_at' => now(),
        'notes' => 'Gaji pokok bulan Agustus 2026.',
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->get(route('finance.payrolls.slip', $payroll));

    $response
        ->assertSuccessful()
        ->assertHeader('content-type', 'application/pdf')
        ->assertHeader('x-content-type-options', 'nosniff');

    expect($response->getContent())->toStartWith('%PDF')
        ->and(strlen($response->getContent()))->toBeGreaterThan(10_000);
});

test('updates payroll salary components and status successfully', function () {
    $user = rafUser(['matter.view', 'billing.manage']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $payroll = Payroll::create([
        'payslip_number' => 'SLIP-2026-08-002',
        'user_id' => $user->id,
        'period' => '2026-08',
        'basic_salary' => 2000000,
        'fixed_allowance' => 500000,
        'transport_meal_allowance' => 250000,
        'overtime_amount' => 0,
        'bonus_amount' => 0,
        'tax_deduction_amount' => 0,
        'deductions_amount' => 0,
        'net_salary' => 2750000,
        'status' => 'draft',
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->put(route('finance.payrolls.update', $payroll), [
        'basic_salary' => 2500000,
        'fixed_allowance' => 500000,
        'transport_meal_allowance' => 300000,
        'overtime_amount' => 200000,
        'bonus_amount' => 1000000,
        'tax_deduction_amount' => 150000,
        'deductions_amount' => 50000,
        'status' => 'approved',
        'notes' => 'Penyesuaian bonus perkara dan lembur.',
    ]);

    $response->assertRedirect();
    $payroll->refresh();

    expect($payroll->basic_salary)->toBe(2500000)
        ->and($payroll->bonus_amount)->toBe(1000000)
        ->and($payroll->tax_deduction_amount)->toBe(150000)
        ->and($payroll->net_salary)->toBe(4300000) // (2500000 + 500000 + 300000 + 200000 + 1000000) - (150000 + 50000)
        ->and($payroll->status)->toBe('approved');
});

test('updates already paid payroll and adjusts financial account balance', function () {
    $user = rafUser(['matter.view', 'billing.manage']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $account = FinancialAccount::create([
        'name' => 'BCA Operasional',
        'account_number' => '1234567890',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 50000000,
        'current_balance' => 50000000,
        'is_active' => true,
    ]);

    $payroll = Payroll::create([
        'payslip_number' => 'SLIP-2026-08-003',
        'user_id' => $user->id,
        'period' => '2026-08',
        'basic_salary' => 3000000,
        'fixed_allowance' => 0,
        'transport_meal_allowance' => 0,
        'overtime_amount' => 0,
        'bonus_amount' => 0,
        'tax_deduction_amount' => 0,
        'deductions_amount' => 0,
        'net_salary' => 3000000,
        'status' => 'paid',
        'payment_account_id' => $account->id,
        'paid_at' => now(),
        'created_by' => $user->id,
    ]);

    // Update net salary to 4,000,000 (basic 4,000,000) -> difference is +1,000,000 disbursed
    $response = $this->actingAs($user)->put(route('finance.payrolls.update', $payroll), [
        'basic_salary' => 4000000,
        'fixed_allowance' => 0,
        'transport_meal_allowance' => 0,
        'overtime_amount' => 0,
        'bonus_amount' => 0,
        'tax_deduction_amount' => 0,
        'deductions_amount' => 0,
        'status' => 'paid',
        'payment_account_id' => $account->id,
        'notes' => 'Koreksi penambahan gaji pokok yang sudah dibayarkan.',
    ]);

    $response->assertRedirect();
    $payroll->refresh();
    $account->refresh();

    expect($payroll->net_salary)->toBe(4000000)
        ->and($payroll->status)->toBe('paid')
        ->and($account->current_balance)->toBe(49000000); // 50,000,000 - 1,000,000 (diff)
});

test('updates office expense and updates financial account balance', function () {
    $user = rafUser(['matter.view', 'billing.view', 'expense.manage']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $account = FinancialAccount::create([
        'name' => 'Mandiri Kas',
        'account_number' => '9876543210',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 20000000,
        'current_balance' => 19500000, // already decremented by 500,000
        'is_active' => true,
    ]);

    $expense = Expense::create([
        'category' => 'utilities',
        'charge_to' => 'office',
        'description' => 'Tagihan Listrik PLN Kantor',
        'vendor' => 'PLN Persero',
        'incurred_at' => now()->toDateString(),
        'amount' => 500000,
        'currency' => 'IDR',
        'account_id' => $account->id,
        'status' => 'approved',
        'created_by' => $user->id,
    ]);

    // Update amount from 500,000 to 750,000
    $response = $this->actingAs($user)->put(route('finance.expenses.update', $expense), [
        'category' => 'utilities',
        'charge_to' => 'office',
        'description' => 'Tagihan Listrik PLN Kantor (Koreksi Tambah Daya)',
        'vendor' => 'PLN Persero',
        'incurred_at' => now()->toDateString(),
        'amount' => 750000,
        'currency' => 'IDR',
        'account_id' => $account->id,
    ]);

    $response->assertRedirect();
    $expense->refresh();
    $account->refresh();

    expect($expense->amount)->toBe(750000)
        ->and($expense->description)->toBe('Tagihan Listrik PLN Kantor (Koreksi Tambah Daya)')
        ->and($account->current_balance)->toBe(19250000); // 19,500,000 + 500,000 (revert) - 750,000 (new) = 19,250,000
});

test('stores partner transaction with advance_repaid or advance_reimbursed successfully', function () {
    $user = rafUser(['matter.view', 'billing.manage']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $account = FinancialAccount::create([
        'name' => 'BCA Rekening Firma',
        'account_number' => '1122334455',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 30000000,
        'current_balance' => 30000000,
        'is_active' => true,
    ]);

    $partnerAccount = FinancialAccount::create([
        'name' => 'Rekap Utang Partner '.$user->name,
        'type' => 'partner_equity',
        'currency' => 'IDR',
        'opening_balance' => 5000000,
        'current_balance' => 5000000,
        'partner_id' => $user->id,
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->post(route('finance.partner-transactions.store'), [
        'partner_id' => $user->id,
        'type' => 'advance_repaid', // alias for advance_reimbursed
        'amount' => 1000000,
        'transaction_date' => now()->toDateString(),
        'account_id' => $account->id,
        'notes' => 'Pengembalian talangan tes',
    ]);

    $response->assertRedirect();
    $account->refresh();
    $partnerAccount->refresh();

    $trans = PartnerTransaction::latest('id')->first();
    expect($trans)->not->toBeNull()
        ->and($trans->type)->toBe('advance_reimbursed')
        ->and($trans->amount)->toBe(1000000)
        ->and($account->current_balance)->toBe(29000000)
        ->and($partnerAccount->current_balance)->toBe(4000000);
});

test('updates partner advance transaction and adjusts balances', function () {
    $user = rafUser(['matter.view', 'billing.manage']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $account = FinancialAccount::create([
        'name' => 'BCA Rekening Firma',
        'account_number' => '1122334455',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 30000000,
        'current_balance' => 28000000, // reimbursing 2,000,000
        'is_active' => true,
    ]);

    $partnerAccount = FinancialAccount::create([
        'name' => 'Rekap Utang Partner '.$user->name,
        'type' => 'partner_equity',
        'currency' => 'IDR',
        'opening_balance' => 5000000,
        'current_balance' => 3000000, // 5M - 2M reimbursed = 3M
        'partner_id' => $user->id,
        'is_active' => true,
    ]);

    $partnerTrans = PartnerTransaction::create([
        'transaction_number' => 'PTR-20260827-TEST',
        'partner_id' => $user->id,
        'type' => 'advance_reimbursed',
        'amount' => 2000000,
        'transaction_date' => now()->toDateString(),
        'account_id' => $account->id,
        'notes' => 'Pengembalian talangan awal',
        'status' => 'approved',
        'created_by' => $user->id,
    ]);

    // Update reimbursed amount from 2,000,000 to 1,000,000
    $response = $this->actingAs($user)->put(route('finance.partner-transactions.update', $partnerTrans), [
        'partner_id' => $user->id,
        'type' => 'advance_reimbursed',
        'amount' => 1000000,
        'transaction_date' => now()->toDateString(),
        'account_id' => $account->id,
        'notes' => 'Pengembalian talangan direvisi jadi 1 juta',
    ]);

    $response->assertRedirect();
    $partnerTrans->refresh();
    $account->refresh();
    $partnerAccount->refresh();

    expect($partnerTrans->amount)->toBe(1000000)
        ->and($account->current_balance)->toBe(29000000) // 28M + 2M - 1M = 29M
        ->and($partnerAccount->current_balance)->toBe(4000000); // 3M + 2M - 1M = 4M
});

test('public payslip verification page displays authenticity details', function () {
    $user = rafUser(['matter.view']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $payroll = Payroll::create([
        'payslip_number' => 'PAY-202608-VERIFY',
        'user_id' => $user->id,
        'period' => '2026-08',
        'basic_salary' => 5000000,
        'fixed_allowance' => 0,
        'transport_meal_allowance' => 0,
        'overtime_amount' => 0,
        'bonus_amount' => 0,
        'tax_deduction_amount' => 0,
        'deductions_amount' => 0,
        'net_salary' => 5000000,
        'status' => 'paid',
        'paid_at' => now(),
        'created_by' => $user->id,
    ]);

    $response = $this->get(route('verify.payslip', $payroll->payslip_number));
    $response->assertOk()
        ->assertSee('Verifikasi Keabsahan Slip Gaji')
        ->assertSee($payroll->payslip_number)
        ->assertSee($user->name);
});

test('allows authorized user to edit invoice details and line items via put route', function () {
    $user = rafUser(['matter.view', 'billing.view', 'billing.manage']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $matter = Matter::factory()->create(['responsible_partner_id' => $user->id]);
    $invoice = Invoice::factory()->create([
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
        'title' => 'Original Invoice',
        'status' => 'draft',
        'subtotal_amount' => 1_000_000,
        'total_amount' => 1_000_000,
        'outstanding_amount' => 1_000_000,
    ]);
    InvoiceLineItem::factory()->create([
        'invoice_id' => $invoice->id,
        'description' => 'Original Line Item',
        'quantity' => 1,
        'unit_amount' => 1_000_000,
        'total_amount' => 1_000_000,
    ]);

    $response = $this->actingAs($user)->put(route('finance.invoices.update', $invoice), [
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
        'title' => 'Edited Invoice Title',
        'status' => 'sent',
        'currency' => 'IDR',
        'issued_at' => '2026-08-27',
        'due_at' => '2026-09-10',
        'discount_amount' => 100_000,
        'tax_rate' => 11,
        'items' => [
            ['description' => 'Item Revisi 1', 'quantity' => 2, 'unit_amount' => 1_000_000],
            ['description' => 'Item Revisi 2', 'quantity' => 1, 'unit_amount' => 500_000],
        ],
    ]);

    $response->assertRedirect();
    $invoice->refresh();

    // subtotal = 2,500,000; discount = 100,000; taxable = 2,400,000; tax = 264,000; total = 2,664,000
    expect($invoice->title)->toBe('Edited Invoice Title')
        ->and($invoice->status)->toBe('sent')
        ->and($invoice->subtotal_amount)->toBe(2_500_000)
        ->and($invoice->discount_amount)->toBe(100_000)
        ->and($invoice->tax_amount)->toBe(264_000)
        ->and($invoice->total_amount)->toBe(2_664_000)
        ->and($invoice->outstanding_amount)->toBe(2_664_000)
        ->and($invoice->lineItems)->toHaveCount(2);
});

test('renders invoice show page with clients and matters props for editing', function () {
    $user = rafUser(['matter.view', 'billing.view']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $matter = Matter::factory()->create(['responsible_partner_id' => $user->id]);
    $invoice = Invoice::factory()->create([
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
    ]);
    InvoiceLineItem::factory()->create(['invoice_id' => $invoice->id]);

    $response = $this->actingAs($user)->get(route('finance.invoices.show', $invoice));

    $response->assertSuccessful()->assertInertia(fn (Assert $page) => $page
        ->component('finance/invoice-show')
        ->has('invoice')
        ->has('clients')
        ->has('matters')
    );
});

test('allows authorized user to edit quotation details and line items via put route', function () {
    $user = rafUser(['matter.view', 'quotation.manage', 'billing.view']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $matter = Matter::factory()->create(['responsible_partner_id' => $user->id]);
    $quotation = Quotation::factory()->create([
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
        'title' => 'Initial Quotation',
        'status' => 'draft',
        'subtotal_amount' => 1_000_000,
        'total_amount' => 1_000_000,
    ]);
    QuoteLineItem::factory()->create([
        'quotation_id' => $quotation->id,
        'description' => 'Original Item',
        'quantity' => 1,
        'unit_amount' => 1_000_000,
        'total_amount' => 1_000_000,
    ]);

    $response = $this->actingAs($user)->put(route('finance.quotations.update', $quotation), [
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
        'title' => 'Edited Quotation Title',
        'scope' => 'Updated scope of work description',
        'status' => 'sent',
        'currency' => 'IDR',
        'issued_at' => '2026-08-27',
        'valid_until' => '2026-09-30',
        'discount_amount' => 500_000,
        'tax_rate' => 11,
        'items' => [
            ['description' => 'Jasa Hukum Revisi', 'quantity' => 2, 'unit_amount' => 3_000_000],
        ],
    ]);

    $response->assertRedirect();
    $quotation->refresh();

    // subtotal = 6,000,000; discount = 500,000; taxable = 5,500,000; tax = 605,000; total = 6,105,000
    expect($quotation->title)->toBe('Edited Quotation Title')
        ->and($quotation->scope)->toBe('Updated scope of work description')
        ->and($quotation->status)->toBe('sent')
        ->and($quotation->subtotal_amount)->toBe(6_000_000)
        ->and($quotation->discount_amount)->toBe(500_000)
        ->and($quotation->tax_amount)->toBe(605_000)
        ->and($quotation->total_amount)->toBe(6_105_000)
        ->and($quotation->lineItems)->toHaveCount(1)
        ->and($quotation->lineItems->first()->description)->toBe('Jasa Hukum Revisi');
});

test('downloads professional payment receipt pdf and renders public verification page', function () {
    $user = rafUser(['matter.view', 'billing.view', 'payment.view']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $matter = Matter::factory()->create(['responsible_partner_id' => $user->id]);
    $account = FinancialAccount::create([
        'name' => 'BCA Operasional',
        'bank_name' => 'BCA',
        'account_number' => '1234567890',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 10000000,
        'current_balance' => 10000000,
        'is_active' => true,
    ]);

    $payment = Payment::create([
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
        'account_id' => $account->id,
        'currency' => 'IDR',
        'amount' => 5000000,
        'gross_amount' => 5000000,
        'tax_withheld' => 0,
        'net_amount' => 5000000,
        'method' => 'bank_transfer',
        'reference_number' => 'PAY-REC-2026-001',
        'notes' => 'Pembayaran uang muka penanganan perkara.',
        'received_at' => now(),
        'recorded_by' => $user->id,
    ]);

    $pdfResponse = $this->actingAs($user)->get(route('finance.payments.receipt', $payment));
    $pdfResponse
        ->assertSuccessful()
        ->assertHeader('content-type', 'application/pdf');

    expect($pdfResponse->getContent())->toStartWith('%PDF')
        ->and(strlen($pdfResponse->getContent()))->toBeGreaterThan(100_000);

    // Test public verification endpoint for receipt
    $verifyReceipt = $this->get(route('verify.payment-receipt', $payment->reference_number));
    $verifyReceipt->assertSuccessful()
        ->assertSee('Verifikasi Keabsahan Kuitansi Pembayaran')
        ->assertSee('PAY-REC-2026-001');

    $verifyReceiptQr = $this->get(route('verify.payment-receipt.qr', $payment->reference_number));
    $verifyReceiptQr->assertSuccessful()
        ->assertHeader('content-type', 'image/svg+xml');
});

test('renders public verification page and qr code for quotation', function () {
    $matter = Matter::factory()->create();
    $quotation = Quotation::factory()->create([
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
        'quotation_number' => 'QUO-2026-TEST-001',
        'title' => 'Penawaran Uji Coba',
        'total_amount' => 15000000,
    ]);
    QuoteLineItem::factory()->create([
        'quotation_id' => $quotation->id,
        'description' => 'Legal Advisory Service',
        'quantity' => 1,
        'unit_amount' => 15000000,
        'total_amount' => 15000000,
    ]);

    $verifyQuotation = $this->get(route('verify.quotation', $quotation->quotation_number));
    $verifyQuotation->assertSuccessful()
        ->assertSee('Verifikasi Surat Penawaran Biaya Jasa Hukum')
        ->assertSee('QUO-2026-TEST-001');

    $verifyQuotationQr = $this->get(route('verify.quotation.qr', $quotation->quotation_number));
    $verifyQuotationQr->assertSuccessful()
        ->assertHeader('content-type', 'image/svg+xml');
});

test('downloads professional conflict clearance certificate pdf and renders public verification page', function () {
    $user = rafUser(['matter.view', 'conflict.view', 'governance.view']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $matter = Matter::factory()->create(['responsible_partner_id' => $user->id]);
    $conflictCheck = ConflictCheck::create([
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
        'subject_name' => 'PT Sumber Makmur Sejahtera',
        'searched_names' => ['PT Sumber Makmur Sejahtera', 'Direktur Utama SMS'],
        'status' => 'clear',
        'decision' => 'approved',
        'decision_note' => 'Tidak ditemukan benturan kepentingan.',
        'requested_by' => $user->id,
        'reviewed_by' => $user->id,
        'reviewed_at' => now(),
    ]);

    $pdfResponse = $this->actingAs($user)->get(route('governance.conflict-checks.pdf', $conflictCheck));
    $pdfResponse
        ->assertSuccessful()
        ->assertHeader('content-type', 'application/pdf');

    expect($pdfResponse->getContent())->toStartWith('%PDF')
        ->and(strlen($pdfResponse->getContent()))->toBeGreaterThan(100_000);

    // Test public verification endpoint for conflict certificate
    $verifyConflict = $this->get(route('verify.conflict-certificate', $conflictCheck));
    $verifyConflict->assertSuccessful()
        ->assertSee('Verifikasi Surat Keterangan Bebas Benturan Kepentingan')
        ->assertSee('PT Sumber Makmur Sejahtera');

    $verifyConflictQr = $this->get(route('verify.conflict-certificate.qr', $conflictCheck));
    $verifyConflictQr->assertSuccessful()
        ->assertHeader('content-type', 'image/svg+xml');
});

test('downloads professional matter status report pdf and renders public verification page', function () {
    $user = rafUser(['matter.view']);
    $user->forceFill(['email_verified_at' => now()])->save();

    $matter = Matter::factory()->create([
        'responsible_partner_id' => $user->id,
        'title' => 'Sengketa Kontrak Kerjasama PT ABC',
        'summary' => 'Ringkasan posisi perkara hukum korporasi.',
    ]);

    $pdfResponse = $this->actingAs($user)->get(route('matters.status-report.pdf', $matter));
    $pdfResponse
        ->assertSuccessful()
        ->assertHeader('content-type', 'application/pdf');

    expect($pdfResponse->getContent())->toStartWith('%PDF')
        ->and(strlen($pdfResponse->getContent()))->toBeGreaterThan(100_000);

    // Test public verification endpoint for matter status report
    $verifyMatterStatus = $this->get(route('verify.matter-status', $matter));
    $verifyMatterStatus->assertSuccessful()
        ->assertSee('Verifikasi Laporan Perkembangan Perkara')
        ->assertSee($matter->matter_number);

    $verifyMatterStatusQr = $this->get(route('verify.matter-status.qr', $matter));
    $verifyMatterStatusQr->assertSuccessful()
        ->assertHeader('content-type', 'image/svg+xml');
});

test('renders professional signature certificate and audit record pdf templates and public verification', function () {
    $user = rafUser(['matter.view']);
    $matter = Matter::factory()->create(['responsible_partner_id' => $user->id]);
    $document = Document::factory()->create([
        'matter_id' => $matter->id,
        'client_id' => $matter->client_id,
        'title' => 'Surat Kuasa Khusus Litigasi',
    ]);
    $documentVersion = DocumentVersion::factory()->create([
        'document_id' => $document->id,
        'version_number' => 1,
        'original_filename' => 'surat-kuasa-khusus.pdf',
        'checksum' => hash('sha256', 'sample-doc-content'),
    ]);

    $signatureRequest = SignatureRequest::create([
        'document_id' => $document->id,
        'document_version_id' => $documentVersion->id,
        'verification_code' => 'SIG-2026-TEST-001',
        'mode' => 'sequential',
        'status' => 'completed',
        'document_checksum' => $documentVersion->checksum,
        'created_by' => $user->id,
        'completed_at' => now(),
    ]);

    SignatureSigner::create([
        'signature_request_id' => $signatureRequest->id,
        'name' => 'Budi Santoso',
        'email' => 'budi.santoso@example.com',
        'signer_title' => 'Direktur Utama',
        'signing_order' => 1,
        'signing_token' => 'token-test-1',
        'status' => 'signed',
        'signed_at' => now(),
        'signed_ip_address' => '127.0.0.1',
    ]);

    $pdfRenderer = app(PdfRenderer::class);
    $signatureRequest->loadMissing(['document.matter', 'document.client', 'documentVersion', 'signers']);

    // Render signature certificate
    $certPdf = $pdfRenderer->render('pdf.signature-certificate', ['signatureRequest' => $signatureRequest]);
    expect($certPdf)->toStartWith('%PDF')->and(strlen($certPdf))->toBeGreaterThan(100_000);

    // Render signature record
    $recordPdf = $pdfRenderer->render('pdf.signature-record', ['signatureRequest' => $signatureRequest]);
    expect($recordPdf)->toStartWith('%PDF')->and(strlen($recordPdf))->toBeGreaterThan(100_000);

    // Test signature verification page
    $verifyResponse = $this->get(route('signature.verify', $signatureRequest->verification_code));
    $verifyResponse->assertSuccessful()
        ->assertSee('SIG-2026-TEST-001')
        ->assertSee('Budi Santoso');
});
