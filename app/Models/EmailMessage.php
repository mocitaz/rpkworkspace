<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailMessage extends Model
{
    use HasUlids;

    protected $fillable = ['sender_id', 'matter_id', 'client_id', 'correspondence_id', 'from_address', 'to_addresses', 'cc_addresses', 'bcc_addresses', 'subject', 'body', 'status', 'queued_at', 'sent_at', 'failed_at', 'error_message'];

    protected function casts(): array
    {
        return ['to_addresses' => 'array', 'cc_addresses' => 'array', 'bcc_addresses' => 'array', 'queued_at' => 'datetime', 'sent_at' => 'datetime', 'failed_at' => 'datetime'];
    }

    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }
}
