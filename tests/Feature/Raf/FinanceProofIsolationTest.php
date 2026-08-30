<?php

use App\Models\AccountTransfer;
use App\Models\Client;
use App\Models\ClientTrustFund;
use App\Models\Document;
use App\Models\Expense;
use App\Models\FinancialAccount;
use App\Models\Invoice;
use App\Models\Matter;
use App\Models\PartnerTransaction;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('private');
});

it('attaches uploaded proof when creating an invoice and isolates it from documents index', function () {
    $user = rafUser(['matter.view', 'matter.view.all', 'billing.view', 'billing.manage', 'document.view', 'client.view']);
    $client = Client::factory()->recycle($user)->create();
    $matter = Matter::factory()->recycle($user)->create(['client_id' => $client->id]);

    $pdfProof = UploadedFile::fake()->create('bukti_invoice.pdf', 150, 'application/pdf');

    $response = $this->actingAs($user)->post('/finance/invoices', [
        'client_id' => $client->id,
        'matter_id' => $matter->id,
        'title' => 'Tagihan Retainer Bulanan',
        'status' => 'sent',
        'currency' => 'IDR',
        'discount_amount' => 0,
        'tax_rate' => 11,
        'items' => [
            ['description' => 'Jasa Retainer', 'quantity' => 1, 'unit_amount' => 5_000_000],
        ],
        'proof' => $pdfProof,
    ]);

    $response->assertRedirect();

    $invoice = Invoice::query()->where('title', 'Tagihan Retainer Bulanan')->firstOrFail();
    expect($invoice->proof_document_id)->not->toBeNull();

    $proofDoc = $invoice->proofDocument;
    expect($proofDoc)->not->toBeNull()
        ->and($proofDoc->document_type)->toBe('financial_proof')
        ->and($proofDoc->title)->toContain($invoice->invoice_number);

    // Verify /documents index does not list financial proof
    $docsResponse = $this->actingAs($user)->get('/documents');
    $docsResponse->assertOk();
    $docsResponse->assertInertia(fn ($page) => $page
        ->where('documents.data', fn ($docs) => collect($docs)->every(fn ($d) => $d['document_type'] !== 'financial_proof'))
    );

    // Financial proofs must not be presented as client legal documents.
    $clientResponse = $this->actingAs($user)->get(route('clients.show', $client));
    $clientResponse->assertOk();
    $clientResponse->assertInertia(fn ($page) => $page->has('documents', 0));
});

it('attaches uploaded proof when creating and updating payroll', function () {
    $user = rafUser(['matter.view', 'matter.view.all', 'billing.view', 'billing.manage']);
    $employee = User::factory()->create(['name' => 'Staff Finance']);

    $proofFile = UploadedFile::fake()->image('bukti_transfer_gaji.jpg');

    $createResponse = $this->actingAs($user)->post('/finance/payrolls', [
        'user_id' => $employee->id,
        'period' => now()->format('Y-m'),
        'basic_salary' => 6_000_000,
        'fixed_allowance' => 500_000,
        'deductions_amount' => 100_000,
        'status' => 'paid',
        'notes' => 'Gaji Bulan Ini',
        'proof' => $proofFile,
    ]);

    $createResponse->assertRedirect();

    $payroll = Payroll::query()->where('user_id', $employee->id)->firstOrFail();
    expect($payroll->proof_document_id)->not->toBeNull();
    expect($payroll->proofDocument->document_type)->toBe('financial_proof');

    // Update with replacement proof
    $newProofFile = UploadedFile::fake()->create('slip_gaji_baru.pdf', 100, 'application/pdf');

    $updateResponse = $this->actingAs($user)->post("/finance/payrolls/{$payroll->id}", [
        '_method' => 'PUT',
        'basic_salary' => 6_500_000,
        'fixed_allowance' => 500_000,
        'deductions_amount' => 100_000,
        'status' => 'paid',
        'notes' => 'Penyesuaian gaji',
        'proof' => $newProofFile,
    ]);

    $updateResponse->assertRedirect();

    $payroll->refresh();
    expect($payroll->basic_salary)->toBe(6_500_000)
        ->and($payroll->proofDocument->document_type)->toBe('financial_proof');
});

it('uploads and destroys proof on existing expenses via generic proof endpoint', function () {
    $user = rafUser(['matter.view', 'matter.view.all', 'billing.view', 'billing.manage']);
    $expense = Expense::factory()->recycle($user)->create([
        'amount' => 1_250_000,
        'description' => 'Panjar Perkara PN',
    ]);

    $file = UploadedFile::fake()->create('kuitansi_panjar.pdf', 80, 'application/pdf');

    $uploadResponse = $this->actingAs($user)->post("/finance/expenses/{$expense->id}/proof", [
        'proof' => $file,
    ]);

    $uploadResponse->assertRedirect();

    $expense->refresh();
    expect($expense->proof_document_id)->not->toBeNull();
    $docId = $expense->proof_document_id;

    // Delete proof
    $deleteResponse = $this->actingAs($user)->delete("/finance/expenses/{$expense->id}/proof");
    $deleteResponse->assertRedirect();

    $expense->refresh();
    expect($expense->proof_document_id)->toBeNull();
    expect(Document::query()->find($docId))->toBeNull();
});

it('uploads and manages proof for transfers, partner transactions, and client trust funds', function () {
    $user = rafUser(['matter.view', 'matter.view.all', 'billing.view', 'billing.manage']);
    $accountA = FinancialAccount::create([
        'name' => 'BCA Operasional',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 100_000_000,
        'current_balance' => 100_000_000,
        'is_active' => true,
    ]);
    $accountB = FinancialAccount::create([
        'name' => 'Mandiri Penampungan',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 50_000_000,
        'current_balance' => 50_000_000,
        'is_active' => true,
    ]);

    $transfer = AccountTransfer::create([
        'transfer_number' => 'TRF-202608-001',
        'from_account_id' => $accountA->id,
        'to_account_id' => $accountB->id,
        'amount' => 10_000_000,
        'transferred_at' => now(),
        'reference_number' => 'TRF-001',
        'created_by' => $user->id,
    ]);

    $transferProof = UploadedFile::fake()->image('bukti_transfer_bank.png');
    $this->actingAs($user)->post("/finance/transfers/{$transfer->id}/proof", [
        'proof' => $transferProof,
    ])->assertRedirect();

    $transfer->refresh();
    expect($transfer->proof_document_id)->not->toBeNull();
    expect($transfer->proofDocument->document_type)->toBe('financial_proof');

    // Partner transaction
    $partnerAdv = PartnerTransaction::create([
        'transaction_number' => 'PT-202608-001',
        'partner_id' => $user->id,
        'account_id' => $accountA->id,
        'amount' => 2_000_000,
        'type' => 'advance',
        'transaction_date' => now(),
        'notes' => 'Talangan sidang luar kota',
        'created_by' => $user->id,
    ]);

    $advProof = UploadedFile::fake()->image('bukti_talangan.jpg');
    $this->actingAs($user)->post("/finance/partner-transactions/{$partnerAdv->id}/proof", [
        'proof' => $advProof,
    ])->assertRedirect();

    $partnerAdv->refresh();
    expect($partnerAdv->proof_document_id)->not->toBeNull();

    // Client Trust Fund
    $client = Client::factory()->recycle($user)->create();
    $matter = Matter::factory()->recycle($user)->create(['client_id' => $client->id]);

    $trustFund = ClientTrustFund::create([
        'transaction_number' => 'CTF-202608-001',
        'client_id' => $client->id,
        'matter_id' => $matter->id,
        'account_id' => $accountA->id,
        'amount' => 15_000_000,
        'type' => 'deposit',
        'transaction_date' => now(),
        'purpose' => 'Titipan Panjar Ganti Rugi',
        'created_by' => $user->id,
    ]);

    $trustProof = UploadedFile::fake()->create('titipan_dana.pdf', 90, 'application/pdf');
    $this->actingAs($user)->post("/finance/client-trust-funds/{$trustFund->id}/proof", [
        'proof' => $trustProof,
    ])->assertRedirect();

    $trustFund->refresh();
    expect($trustFund->proof_document_id)->not->toBeNull();
});
