<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payroll extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'payslip_number',
        'user_id',
        'period',
        'basic_salary',
        'fixed_allowance',
        'transport_meal_allowance',
        'overtime_amount',
        'bonus_amount',
        'deductions_amount',
        'tax_deduction_amount',
        'net_salary',
        'status',
        'payment_account_id',
        'paid_at',
        'approved_by',
        'approved_at',
        'notes',
        'proof_document_id',
        'created_by',
    ];

    protected $attributes = [
        'status' => 'draft',
        'basic_salary' => 0,
        'fixed_allowance' => 0,
        'transport_meal_allowance' => 0,
        'overtime_amount' => 0,
        'bonus_amount' => 0,
        'deductions_amount' => 0,
        'tax_deduction_amount' => 0,
    ];

    protected function casts(): array
    {
        return [
            'basic_salary' => 'integer',
            'fixed_allowance' => 'integer',
            'transport_meal_allowance' => 'integer',
            'overtime_amount' => 'integer',
            'bonus_amount' => 'integer',
            'deductions_amount' => 'integer',
            'tax_deduction_amount' => 'integer',
            'net_salary' => 'integer',
            'paid_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Document, $this> */
    public function proofDocument(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'proof_document_id');
    }

    /** @return BelongsTo<FinancialAccount, $this> */
    public function paymentAccount(): BelongsTo
    {
        return $this->belongsTo(FinancialAccount::class, 'payment_account_id');
    }

    /** @return BelongsTo<User, $this> */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
