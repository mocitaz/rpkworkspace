<?php

use App\Models\Expense;
use App\Models\FinancialAccount;
use App\Models\Matter;
use App\Models\Payment;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('repairs imported finance classifications accounts and Davina payroll ownership', function () {
    $administrator = User::factory()->create([
        'name' => 'Muhamad Fajar Roni, S.H.',
        'email' => 'fajarroni@rpklawoffice.com',
    ]);
    $davina = User::factory()->create([
        'name' => 'Davina Putri Felisha',
        'email' => 'davina@rpklawoffice.com',
    ]);
    $matter = Matter::factory()->create(['matter_number' => 'RPK-2026-0001']);
    $cashAccount = FinancialAccount::create([
        'name' => 'Kas Kantor',
        'type' => 'cash',
        'currency' => 'IDR',
        'opening_balance' => 0,
        'current_balance' => 0,
        'is_active' => true,
        'created_by' => $administrator->id,
    ]);
    $bankAccount = FinancialAccount::create([
        'name' => 'Bank Operasional',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 0,
        'current_balance' => 0,
        'is_active' => true,
        'created_by' => $administrator->id,
    ]);

    $expense = Expense::factory()->create([
        'matter_id' => $matter->id,
        'account_id' => $cashAccount->id,
        'charge_to' => 'firm',
        'description' => 'ATK (EXP-20260729-001)',
        'amount' => 128_600,
        'status' => 'approved',
        'created_by' => $administrator->id,
    ]);
    $firmDeedExpense = Expense::factory()->create([
        'matter_id' => $matter->id,
        'account_id' => $cashAccount->id,
        'charge_to' => 'firm',
        'category' => 'court_fee',
        'description' => 'Biaya Pembuatan Akta Firma (EXP-20260827-012)',
        'amount' => 1_950_000,
        'status' => 'approved',
        'created_by' => $administrator->id,
    ]);
    $payment = Payment::factory()->create([
        'client_id' => $matter->client_id,
        'matter_id' => $matter->id,
        'account_id' => $cashAccount->id,
        'reference_number' => 'INC-20260729-001',
        'amount' => 16_000_000,
        'gross_amount' => 16_000_000,
        'net_amount' => 16_000_000,
        'recorded_by' => $administrator->id,
    ]);
    $payroll = Payroll::create([
        'payslip_number' => 'PAY-202607-002',
        'user_id' => $administrator->id,
        'period' => '2026-07',
        'basic_salary' => 500_000,
        'net_salary' => 500_000,
        'status' => 'paid',
        'created_by' => $administrator->id,
    ]);

    $this->artisan('finance:repair-import-2026', ['--apply' => true])
        ->assertSuccessful();

    expect($expense->refresh())
        ->charge_to->toBe('office')
        ->matter_id->toBeNull()
        ->and($firmDeedExpense->refresh()->category)->toBe('legal_administration')
        ->and($firmDeedExpense->charge_to)->toBe('office')
        ->and($firmDeedExpense->matter_id)->toBeNull()
        ->and($payment->refresh()->account_id)->toBe($bankAccount->id)
        ->and($payroll->refresh()->user_id)->toBe($davina->id)
        ->and($bankAccount->refresh()->current_balance)->toBe(13_921_400)
        ->and($cashAccount->refresh()->current_balance)->toBe(0);
});

test('previews finance import repairs without changing records', function () {
    $administrator = User::factory()->create([
        'name' => 'Muhamad Fajar Roni, S.H.',
        'email' => 'fajarroni@rpklawoffice.com',
    ]);
    User::factory()->create([
        'name' => 'Davina Putri Felisha',
        'email' => 'davina@rpklawoffice.com',
    ]);
    FinancialAccount::create([
        'name' => 'Bank Operasional',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 0,
        'current_balance' => 0,
        'is_active' => true,
        'created_by' => $administrator->id,
    ]);
    $matter = Matter::factory()->create(['matter_number' => 'RPK-2026-0001']);
    $expense = Expense::factory()->create([
        'matter_id' => $matter->id,
        'charge_to' => 'firm',
        'description' => 'ATK (EXP-20260729-001)',
        'status' => 'approved',
        'created_by' => $administrator->id,
    ]);

    $this->artisan('finance:repair-import-2026')->assertSuccessful();

    expect($expense->refresh())
        ->charge_to->toBe('firm')
        ->matter_id->toBe($matter->id);
});
