<?php

use App\Models\AccountTransfer;
use App\Models\Expense;
use App\Models\FinancialAccount;
use App\Models\Payment;

test('forbids unauthorized users from deleting a financial account', function () {
    $user = rafUser(['matter.view', 'billing.view']);
    $account = FinancialAccount::create([
        'name' => 'Rekening Test',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 0,
        'current_balance' => 0,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->delete(route('finance.accounts.destroy', $account), [
        'mode' => 'direct_delete',
    ]);

    $response->assertForbidden();
    expect(FinancialAccount::query()->whereKey($account->getKey())->exists())->toBeTrue();
});

test('validates mode and target account on account deletion', function () {
    $user = rafUser(['billing.manage']);
    $account = FinancialAccount::create([
        'name' => 'Rekening Test',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 0,
        'current_balance' => 0,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    // Mode is required
    $this->actingAs($user)->delete(route('finance.accounts.destroy', $account), [])
        ->assertSessionHasErrors(['mode']);

    // If mode is transfer, target_account_id is required
    $this->actingAs($user)->delete(route('finance.accounts.destroy', $account), [
        'mode' => 'transfer',
    ])->assertSessionHasErrors(['target_account_id']);

    // Target account cannot be the account itself
    $this->actingAs($user)->delete(route('finance.accounts.destroy', $account), [
        'mode' => 'transfer',
        'target_account_id' => $account->getKey(),
    ])->assertSessionHasErrors(['target_account_id']);
});

test('can delete a financial account directly and clear its balance', function () {
    $user = rafUser(['billing.manage']);
    $account = FinancialAccount::create([
        'name' => 'Rekening Uji Coba',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 1_000_000,
        'current_balance' => 1_000_000,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->delete(route('finance.accounts.destroy', $account), [
        'mode' => 'direct_delete',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
    expect(FinancialAccount::query()->whereKey($account->getKey())->exists())->toBeFalse();
});

test('can delete an account and migrate its balance and transactions to a target account', function () {
    $user = rafUser(['billing.manage']);

    $sourceAccount = FinancialAccount::create([
        'name' => 'BCA Lama',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 1_000_000,
        'current_balance' => 1_000_000,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $targetAccount = FinancialAccount::create([
        'name' => 'Mandiri Baru',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 2_000_000,
        'current_balance' => 2_000_000,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $expense = Expense::factory()->create([
        'account_id' => $sourceAccount->getKey(),
        'amount' => 250_000,
        'status' => 'approved',
    ]);

    $payment = Payment::factory()->create([
        'account_id' => $sourceAccount->getKey(),
        'amount' => 500_000,
    ]);

    $response = $this->actingAs($user)->delete(route('finance.accounts.destroy', $sourceAccount), [
        'mode' => 'transfer',
        'target_account_id' => $targetAccount->getKey(),
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Source account should be deleted
    expect(FinancialAccount::query()->whereKey($sourceAccount->getKey())->exists())->toBeFalse();

    // Transactions should be migrated to target account
    expect($expense->fresh()->account_id)->toBe($targetAccount->getKey());
    expect($payment->fresh()->account_id)->toBe($targetAccount->getKey());

    // Target account opening balance should have accumulated source opening balance
    $freshTarget = $targetAccount->fresh();
    expect($freshTarget->opening_balance)->toBe(3_000_000);
});

test('can delete an account directly even when it has associated transfers or trust funds', function () {
    $user = rafUser(['billing.manage']);

    $accountA = FinancialAccount::create([
        'name' => 'Kas A',
        'type' => 'cash',
        'currency' => 'IDR',
        'opening_balance' => 1_000_000,
        'current_balance' => 1_000_000,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $accountB = FinancialAccount::create([
        'name' => 'Kas B',
        'type' => 'cash',
        'currency' => 'IDR',
        'opening_balance' => 500_000,
        'current_balance' => 500_000,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    AccountTransfer::create([
        'transfer_number' => 'TRF-TEST-001',
        'from_account_id' => $accountA->getKey(),
        'to_account_id' => $accountB->getKey(),
        'amount' => 100_000,
        'transferred_at' => now()->toDateString(),
        'status' => 'completed',
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->delete(route('finance.accounts.destroy', $accountA), [
        'mode' => 'direct_delete',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');
    expect(FinancialAccount::query()->whereKey($accountA->getKey())->exists())->toBeFalse();
    expect(AccountTransfer::query()->where('transfer_number', 'TRF-TEST-001')->exists())->toBeFalse();
});

test('forbids unauthorized users from updating a financial account', function () {
    $user = rafUser(['matter.view', 'billing.view']);
    $account = FinancialAccount::create([
        'name' => 'Rekening Asli',
        'type' => 'bank',
        'currency' => 'IDR',
        'opening_balance' => 1_000_000,
        'current_balance' => 1_000_000,
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->put(route('finance.accounts.update', $account), [
        'name' => 'Nama Baru Tidak Sah',
    ]);

    $response->assertForbidden();
    expect($account->fresh()->name)->toBe('Rekening Asli');
});

test('can update financial account details without modifying nominal balance', function () {
    $user = rafUser(['billing.manage']);
    $account = FinancialAccount::create([
        'name' => 'Mandiri Lama',
        'type' => 'bank',
        'bank_name' => 'Mandiri',
        'account_number' => '111-222-333',
        'currency' => 'IDR',
        'opening_balance' => 5_000_000,
        'current_balance' => 7_500_000,
        'description' => 'Catatan lama',
        'is_active' => true,
        'created_by' => $user->id,
    ]);

    $response = $this->actingAs($user)->put(route('finance.accounts.update', $account), [
        'name' => 'Mandiri Operasional Baru',
        'bank_name' => 'Bank Mandiri KC Sudirman',
        'account_number' => '999-888-777',
        'description' => 'Rekening utama honorarium terupdate',
        // Attempting to change balance should be ignored:
        'opening_balance' => 999_999_999,
        'current_balance' => 999_999_999,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $updated = $account->fresh();
    expect($updated->name)->toBe('Mandiri Operasional Baru')
        ->and($updated->bank_name)->toBe('Bank Mandiri KC Sudirman')
        ->and($updated->account_number)->toBe('999-888-777')
        ->and($updated->description)->toBe('Rekening utama honorarium terupdate')
        // Nominal balance MUST remain untouched:
        ->and((int) $updated->opening_balance)->toBe(5_000_000)
        ->and((int) $updated->current_balance)->toBe(7_500_000);
});
