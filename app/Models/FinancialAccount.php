<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FinancialAccount extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'name',
        'type',
        'account_number',
        'bank_name',
        'partner_id',
        'currency',
        'opening_balance',
        'current_balance',
        'description',
        'is_active',
        'created_by',
    ];

    protected $attributes = [
        'currency' => 'IDR',
        'is_active' => true,
        'opening_balance' => 0,
        'current_balance' => 0,
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'opening_balance' => 'integer',
            'current_balance' => 'integer',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function partner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'partner_id');
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<AccountTransfer, $this> */
    public function outgoingTransfers(): HasMany
    {
        return $this->hasMany(AccountTransfer::class, 'from_account_id');
    }

    /** @return HasMany<AccountTransfer, $this> */
    public function incomingTransfers(): HasMany
    {
        return $this->hasMany(AccountTransfer::class, 'to_account_id');
    }

    /** @return HasMany<Expense, $this> */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'account_id');
    }

    /** @return HasMany<Payment, $this> */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'account_id');
    }

    /** @return HasMany<PartnerTransaction, $this> */
    public function partnerTransactions(): HasMany
    {
        return $this->hasMany(PartnerTransaction::class, 'account_id');
    }

    /** @return HasMany<ClientTrustFund, $this> */
    public function clientTrustFunds(): HasMany
    {
        return $this->hasMany(ClientTrustFund::class, 'account_id');
    }

    /** @return HasMany<Payroll, $this> */
    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class, 'payment_account_id');
    }

    /**
     * Recalculate and update the account balance based on all underlying transactions.
     */
    public function recalculateBalance(): int
    {
        if ($this->type === 'partner_advance') {
            $partnerId = $this->partner_id;
            if (! $partnerId) {
                $this->updateQuietly(['current_balance' => (int) $this->opening_balance]);

                return (int) $this->opening_balance;
            }

            $directAdvances = (int) PartnerTransaction::query()
                ->where('partner_id', $partnerId)
                ->where('type', 'advance_incurred')
                ->whereIn('status', ['approved', 'completed'])
                ->sum('amount');

            $expensesPaidByPartner = (int) Expense::query()
                ->where('partner_id', $partnerId)
                ->whereNotIn('status', ['cancelled', 'draft'])
                ->sum('amount');

            $reimbursed = (int) PartnerTransaction::query()
                ->where('partner_id', $partnerId)
                ->where('type', 'advance_reimbursed')
                ->whereIn('status', ['approved', 'completed'])
                ->sum('amount');

            $bal = (int) $this->opening_balance + $directAdvances + $expensesPaidByPartner - $reimbursed;
            $this->updateQuietly(['current_balance' => $bal]);

            return $bal;
        }

        if ($this->type === 'client_trust') {
            $depositIn = (int) ClientTrustFund::query()
                ->where('account_id', $this->getKey())
                ->where('type', 'deposit_in')
                ->whereIn('status', ['approved', 'completed'])
                ->sum('amount');

            $disbursementOut = (int) ClientTrustFund::query()
                ->where('account_id', $this->getKey())
                ->where('type', 'disbursement_out')
                ->whereIn('status', ['approved', 'completed'])
                ->sum('amount');

            $bal = (int) $this->opening_balance + $depositIn - $disbursementOut;
            $this->updateQuietly(['current_balance' => $bal]);

            return $bal;
        }

        // Cash and Bank accounts
        $paymentsIn = (int) Payment::query()
            ->where('account_id', $this->getKey())
            ->whereNull('reversed_at')
            ->whereNull('refunded_at')
            ->sum('amount');

        $expensesOut = (int) Expense::query()
            ->where('account_id', $this->getKey())
            ->whereNotIn('status', ['cancelled', 'draft'])
            ->sum('amount');

        $payrollsOut = (int) Payroll::query()
            ->where('payment_account_id', $this->getKey())
            ->whereIn('status', ['approved', 'paid'])
            ->sum('net_salary');

        $transfersIn = (int) AccountTransfer::query()
            ->where('to_account_id', $this->getKey())
            ->where('status', 'completed')
            ->sum('amount');

        $transfersOut = (int) AccountTransfer::query()
            ->where('from_account_id', $this->getKey())
            ->where('status', 'completed')
            ->sum('amount');

        $partnerDistOut = (int) PartnerTransaction::query()
            ->where('account_id', $this->getKey())
            ->whereIn('type', ['profit_distribution', 'draw_prive'])
            ->whereIn('status', ['approved', 'completed'])
            ->sum('amount');

        $partnerAdvReimbursedOut = (int) PartnerTransaction::query()
            ->where('account_id', $this->getKey())
            ->where('type', 'advance_reimbursed')
            ->whereIn('status', ['approved', 'completed'])
            ->sum('amount');

        $partnerCapitalIn = (int) PartnerTransaction::query()
            ->where('account_id', $this->getKey())
            ->where('type', 'capital_injection')
            ->whereIn('status', ['approved', 'completed'])
            ->sum('amount');

        $bal = (int) $this->opening_balance + $paymentsIn - $expensesOut - $payrollsOut + $transfersIn - $transfersOut - $partnerDistOut - $partnerAdvReimbursedOut + $partnerCapitalIn;
        $this->updateQuietly(['current_balance' => $bal]);

        return $bal;
    }

    /**
     * Recalculate and synchronize all financial account balances.
     */
    public static function syncAllBalances(): void
    {
        static::query()->each(function (FinancialAccount $account): void {
            $account->recalculateBalance();
        });
    }
}
