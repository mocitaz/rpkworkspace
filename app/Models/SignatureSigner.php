<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SignatureSigner extends Model
{
    use HasUlids;

    protected $fillable = ['signature_request_id', 'name', 'email', 'signing_order', 'signing_token', 'status', 'signed_at', 'last_reminded_at', 'signed_ip_address', 'signed_user_agent', 'accepted_name'];

    protected $hidden = ['signing_token', 'signed_ip_address', 'signed_user_agent'];

    protected $attributes = ['signing_order' => 1, 'status' => 'pending'];

    protected function casts(): array
    {
        return ['signed_at' => 'datetime', 'last_reminded_at' => 'datetime'];
    }

    /** @return BelongsTo<SignatureRequest, $this> */
    public function signatureRequest(): BelongsTo
    {
        return $this->belongsTo(SignatureRequest::class);
    }
}
