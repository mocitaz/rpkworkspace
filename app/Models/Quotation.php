<?php

namespace App\Models;

use Database\Factories\QuotationFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quotation extends Model
{
    /** @use HasFactory<QuotationFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'quotation_number', 'client_id', 'matter_id', 'title', 'scope', 'status', 'currency',
        'subtotal_amount', 'discount_amount', 'tax_rate', 'tax_amount', 'total_amount',
        'issued_at', 'valid_until', 'approved_by', 'approved_at', 'converted_at', 'created_by',
    ];

    protected $attributes = [
        'status' => 'draft', 'currency' => 'IDR', 'subtotal_amount' => 0,
        'discount_amount' => 0, 'tax_rate' => 0, 'tax_amount' => 0, 'total_amount' => 0,
    ];

    protected function casts(): array
    {
        return ['tax_rate' => 'decimal:2', 'issued_at' => 'date', 'valid_until' => 'date', 'approved_at' => 'datetime', 'converted_at' => 'datetime'];
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<Matter, $this> */
    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
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

    /** @return HasMany<QuoteLineItem, $this> */
    public function lineItems(): HasMany
    {
        return $this->hasMany(QuoteLineItem::class)->orderBy('sort_order');
    }

    /** @return HasMany<ConflictCheck, $this> */
    public function conflictChecks(): HasMany
    {
        return $this->hasMany(ConflictCheck::class);
    }

    /** @return HasMany<Invoice, $this> */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
