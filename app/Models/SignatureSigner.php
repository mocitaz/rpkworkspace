<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SignatureSigner extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'signature_request_id',
        'name',
        'email',
        'signing_order',
        'signing_token',
        'status',
        'signed_at',
        'last_reminded_at',
        'signed_ip_address',
        'signed_user_agent',
        'accepted_name',
        'signature_data',
        'page_number',
        'position_x',
        'position_y',
        'stamp_layout',
        'name_position',
        'signer_title',
        'stamp_width',
        'stamp_height',
        'show_qr',
        'show_name',
        'show_title',
        'show_border',
        'signature_type',
    ];

    protected $hidden = ['signed_ip_address', 'signed_user_agent', 'signature_data'];

    protected $attributes = ['signing_order' => 1, 'status' => 'pending'];

    protected $appends = ['signing_url'];

    protected function casts(): array
    {
        return [
            'signed_at' => 'datetime',
            'last_reminded_at' => 'datetime',
            'page_number' => 'integer',
            'position_x' => 'float',
            'position_y' => 'float',
            'stamp_width' => 'float',
            'stamp_height' => 'float',
            'show_qr' => 'boolean',
            'show_name' => 'boolean',
            'show_title' => 'boolean',
            'show_border' => 'boolean',
        ];
    }

    public function getSigningUrlAttribute(): string
    {
        return route('signature.sign.show', (string) $this->signing_token);
    }

    /** @return BelongsTo<SignatureRequest, $this> */
    public function signatureRequest(): BelongsTo
    {
        return $this->belongsTo(SignatureRequest::class);
    }
}
