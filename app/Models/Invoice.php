<?php

namespace App\Models;

use Database\Factories\InvoiceFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    /** @use HasFactory<InvoiceFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'invoice_number', 'client_id', 'matter_id', 'quotation_id', 'title', 'status', 'currency',
        'subtotal_amount', 'discount_amount', 'tax_rate', 'tax_amount', 'total_amount', 'paid_amount',
        'outstanding_amount', 'issued_at', 'due_at', 'sent_at', 'paid_at', 'cancelled_at', 'cancelled_by', 'cancellation_reason', 'created_by',
    ];

    protected $attributes = [
        'status' => 'draft', 'currency' => 'IDR', 'subtotal_amount' => 0, 'discount_amount' => 0,
        'tax_rate' => 0, 'tax_amount' => 0, 'total_amount' => 0, 'paid_amount' => 0, 'outstanding_amount' => 0,
    ];

    protected function casts(): array
    {
        return ['tax_rate' => 'decimal:2', 'issued_at' => 'date', 'due_at' => 'date', 'sent_at' => 'datetime', 'paid_at' => 'datetime', 'cancelled_at' => 'datetime'];
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

    /** @return BelongsTo<Quotation, $this> */
    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<InvoiceLineItem, $this> */
    public function lineItems(): HasMany
    {
        return $this->hasMany(InvoiceLineItem::class)->orderBy('sort_order');
    }

    /** @return HasMany<PaymentAllocation, $this> */
    public function paymentAllocations(): HasMany
    {
        return $this->hasMany(PaymentAllocation::class);
    }
}
