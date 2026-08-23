<?php

namespace App\Models;

use Database\Factories\SignatureRequestFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property Carbon|null $expires_at
 * @property Carbon|null $sent_at
 * @property Carbon|null $completed_at
 */
class SignatureRequest extends Model
{
    /** @use HasFactory<SignatureRequestFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'document_id', 'document_version_id', 'verification_code', 'mode', 'status', 'assurance_level', 'document_checksum',
        'signed_record_disk', 'signed_record_path', 'signed_final_disk', 'signed_final_path', 'signed_final_status', 'signed_final_message', 'certificate_disk', 'certificate_path',
        'expires_at', 'sent_at', 'completed_at', 'signed_final_started_at', 'signed_final_completed_at', 'created_by',
    ];

    protected $attributes = ['mode' => 'sequential', 'status' => 'draft', 'signed_final_status' => 'pending'];

    protected function casts(): array
    {
        return ['expires_at' => 'datetime', 'sent_at' => 'datetime', 'completed_at' => 'datetime', 'signed_final_started_at' => 'datetime', 'signed_final_completed_at' => 'datetime'];
    }

    /** @return BelongsTo<Document, $this> */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    /** @return BelongsTo<DocumentVersion, $this> */
    public function documentVersion(): BelongsTo
    {
        return $this->belongsTo(DocumentVersion::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<SignatureSigner, $this> */
    public function signers(): HasMany
    {
        return $this->hasMany(SignatureSigner::class)->orderBy('signing_order');
    }
}
