<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientComplianceDocument extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'client_compliance_documents';

    protected $fillable = [
        'client_id',
        'document_type',
        'document_number',
        'title',
        'issued_at',
        'expires_at',
        'issuer',
        'notes',
        'file_path',
        'created_by',
    ];

    protected $casts = [
        'issued_at' => 'date',
        'expires_at' => 'date',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get computed status: expired, expiring_soon, active, or no_expiry.
     */
    public function getComplianceStatusAttribute(): string
    {
        if (! $this->expires_at) {
            return 'no_expiry';
        }

        if ($this->expires_at->endOfDay()->isPast()) {
            return 'expired';
        }

        if (now()->diffInDays($this->expires_at->endOfDay(), false) <= 60) {
            return 'expiring_soon';
        }

        return 'active';
    }
}
