<?php

use App\Models\Client;
use App\Models\FinancialAccount;
use App\Models\Matter;
use App\Models\Payroll;
use App\Models\User;

test('finance manager can create financial account and transfer funds between accounts', function () {
    $user = rafUser(['billing.view', 'billing.manage']);

    $fromAcc = FinancialAccount::query()->create([
        'name' => 'Bank Mandiri Utama',
        'type' => 'bank',
        'opening_balance' => 10000000,
        'current_balance' => 10000000,
        'created_by' => $user->getKey(),
    ]);

    $toAcc = FinancialAccount::query()->create([
        'name' => 'Kas Kecil Kantor',
        'type' => 'cash',
        'opening_balance' => 0,
        'current_balance' => 0,
        'created_by' => $user->getKey(),
    ]);

    $response = $this->actingAs($user)->post(route('finance.transfers.store'), [
        'from_account_id' => $fromAcc->getKey(),
        'to_account_id' => $toAcc->getKey(),
        'amount' => 2500000,
        'transferred_at' => now()->toDateString(),
        'reference_number' => 'REF-TRF-001',
        'notes' => 'Pengisian kas kecil kantor',
    ]);

    $response->assertRedirect();
    expect($fromAcc->fresh()->current_balance)->toBe(7500000)
        ->and($toAcc->fresh()->current_balance)->toBe(2500000);
});

test('partner advance and reimbursement updates partner balance correctly', function () {
    $partner = rafUser(['billing.view', 'billing.manage']);
    $partner->update(['name' => 'Fajar Roni']);

    $bankAcc = FinancialAccount::query()->create([
        'name' => 'Bank Operasional',
        'type' => 'bank',
        'opening_balance' => 20000000,
        'current_balance' => 20000000,
    ]);

    $partnerAcc = FinancialAccount::query()->create([
        'name' => 'Kas Talangan Fajar Roni',
        'type' => 'partner_advance',
        'partner_id' => $partner->getKey(),
        'opening_balance' => 0,
        'current_balance' => 0,
    ]);

    // 1. Partner spends 1,000,000 personal money for firm
    $this->actingAs($partner)->post(route('finance.partner-transactions.store'), [
        'partner_id' => $partner->getKey(),
        'type' => 'advance_incurred',
        'amount' => 1000000,
        'transaction_date' => now()->toDateString(),
        'notes' => 'Talangan biaya transport sidang',
    ])->assertRedirect();

    expect($partnerAcc->fresh()->current_balance)->toBe(1000000);

    // 2. Firm reimburses partner 1,000,000 from Bank Operasional
    $this->actingAs($partner)->post(route('finance.partner-transactions.store'), [
        'partner_id' => $partner->getKey(),
        'type' => 'advance_reimbursed',
        'account_id' => $bankAcc->getKey(),
        'amount' => 1000000,
        'transaction_date' => now()->toDateString(),
        'notes' => 'Pengembalian talangan dari bank kantor',
    ])->assertRedirect();

    expect($partnerAcc->fresh()->current_balance)->toBe(0)
        ->and($bankAcc->fresh()->current_balance)->toBe(19000000);
});

test('client trust fund deposit and disbursement modifies trust account balance', function () {
    $user = rafUser(['billing.view', 'billing.manage', 'matter.view']);

    $client = Client::factory()->recycle($user)->create(['display_name' => 'PT KKG']);
    $matter = Matter::factory()->recycle($user)->create(['client_id' => $client->getKey()]);

    $trustAccount = FinancialAccount::query()->create([
        'name' => 'Bank BCA Titipan Klien',
        'type' => 'client_trust',
        'opening_balance' => 0,
        'current_balance' => 0,
    ]);

    // Deposit 5,000,000 for court fee
    $this->actingAs($user)->post(route('finance.client-trust-funds.store'), [
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'account_id' => $trustAccount->getKey(),
        'type' => 'deposit_in',
        'amount' => 5000000,
        'transaction_date' => now()->toDateString(),
        'purpose' => 'Titipan panjar biaya perkara kasasi',
    ])->assertRedirect();

    expect($trustAccount->fresh()->current_balance)->toBe(5000000);

    // Disbursement 3,000,000 to Pengadilan Negeri
    $this->actingAs($user)->post(route('finance.client-trust-funds.store'), [
        'client_id' => $client->getKey(),
        'matter_id' => $matter->getKey(),
        'account_id' => $trustAccount->getKey(),
        'type' => 'disbursement_out',
        'amount' => 3000000,
        'transaction_date' => now()->toDateString(),
        'purpose' => 'Pembayaran SKUM Pengadilan Negeri',
        'recipient_party' => 'Kepaniteraan PN Bandung',
    ])->assertRedirect();

    expect($trustAccount->fresh()->current_balance)->toBe(2000000);
});

test('payroll can be recorded and payslip can be generated', function () {
    $manager = rafUser(['billing.view', 'billing.manage']);
    $staff = User::factory()->create(['name' => 'Dafina Putri']);

    $bankAcc = FinancialAccount::query()->create([
        'name' => 'Bank Mandiri',
        'type' => 'bank',
        'opening_balance' => 10000000,
        'current_balance' => 10000000,
    ]);

    $this->actingAs($manager)->post(route('finance.payrolls.store'), [
        'user_id' => $staff->getKey(),
        'period' => '2026-08',
        'basic_salary' => 3000000,
        'fixed_allowance' => 500000,
        'transport_meal_allowance' => 500000,
        'overtime_amount' => 0,
        'bonus_amount' => 0,
        'deductions_amount' => 0,
        'tax_deduction_amount' => 0,
        'status' => 'approved',
        'payment_account_id' => $bankAcc->getKey(),
        'notes' => 'Gaji bulan Agustus 2026',
    ])->assertRedirect();

    $payroll = Payroll::query()->where('user_id', $staff->getKey())->where('period', '2026-08')->first();
    expect($payroll)->not->toBeNull()
        ->and($payroll->net_salary)->toBe(4000000);

    // Test payslip download
    $response = $this->actingAs($manager)->get(route('finance.payrolls.slip', $payroll));
    $response->assertOk()
        ->assertHeader('Content-Type', 'application/pdf');
});
