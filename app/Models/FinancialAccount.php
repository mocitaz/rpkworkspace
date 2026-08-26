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
}
