<?php

namespace App\Models;

use DomainException;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatterEvidence extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'matter_evidences';

    protected $fillable = [
        'matter_id',
        'evidence_code',
        'title',
        'description',
        'originality',
        'vault_location',
        'status',
        'custodian_name',
        'custody_notes',
        'created_by',
    ];

    protected static function booted(): void
    {
        static::deleting(function (MatterEvidence $evidence): void {
            if ($evidence->matter()->whereNotNull('legal_hold_at')->exists()) {
                throw new DomainException('Alat bukti perkara dalam legal hold tidak dapat dihapus.');
            }
        });
    }

    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
