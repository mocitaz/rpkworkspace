<?php

namespace App\Models;

use Database\Factories\DocumentVersionFactory;
use DomainException;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentVersion extends Model
{
    /** @use HasFactory<DocumentVersionFactory> */
    use HasFactory, HasUlids;

    public $timestamps = false;

    protected $fillable = [
        'document_id', 'version_number', 'original_filename', 'storage_disk', 'storage_path',
        'mime_type', 'file_size', 'checksum', 'scan_status', 'scan_message', 'scanned_at',
        'extraction_status', 'extracted_text', 'extraction_metadata', 'extracted_at',
        'uploaded_by', 'notes', 'created_at',
    ];

    protected $attributes = [
        'scan_status' => 'pending',
        'extraction_status' => 'pending',
    ];

    protected static function booted(): void
    {
        static::deleting(function (DocumentVersion $version): void {
            if ($version->document()->whereHas('matter', fn ($matter) => $matter->whereNotNull('legal_hold_at'))->exists()) {
                throw new DomainException('Versi dokumen perkara dalam legal hold tidak dapat dihapus.');
            }
        });
    }

    protected function casts(): array
    {
        return [
            'scanned_at' => 'datetime',
            'extraction_metadata' => 'array',
            'extracted_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Document, $this> */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    /** @return BelongsTo<User, $this> */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
