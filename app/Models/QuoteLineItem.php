<?php

namespace App\Models;

use Database\Factories\QuoteLineItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteLineItem extends Model
{
    /** @use HasFactory<QuoteLineItemFactory> */
    use HasFactory;

    protected $fillable = ['quotation_id', 'description', 'quantity', 'unit_amount', 'total_amount', 'sort_order'];

    /** @return BelongsTo<Quotation, $this> */
    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }
}
