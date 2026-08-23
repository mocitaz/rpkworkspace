<?php

namespace App\Models;

use Database\Factories\ExpenseFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    /** @use HasFactory<ExpenseFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'matter_id', 'category', 'description', 'vendor', 'incurred_at', 'amount', 'currency',
        'status', 'proof_document_id', 'approved_by', 'approved_at', 'created_by',
    ];

    protected $attributes = ['status' => 'draft', 'currency' => 'IDR'];

    protected function casts(): array
    {
        return ['incurred_at' => 'date', 'approved_at' => 'datetime'];
    }

    /** @return BelongsTo<Matter, $this> */
    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }

    /** @return BelongsTo<Document, $this> */
    public function proofDocument(): BelongsTo
    {
        return $this->belongsTo(Document::class, 'proof_document_id');
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
