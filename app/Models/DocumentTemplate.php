<?php

namespace App\Models;

use Database\Factories\DocumentTemplateFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentTemplate extends Model
{
    /** @use HasFactory<DocumentTemplateFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'name', 'document_type', 'storage_disk', 'storage_path', 'original_filename',
        'checksum', 'placeholders', 'status', 'scan_status', 'scan_message', 'scanned_at', 'version', 'root_template_id', 'superseded_at', 'created_by',
    ];

    protected $attributes = ['status' => 'active'];

    protected function casts(): array
    {
        return ['placeholders' => 'array', 'superseded_at' => 'datetime', 'scanned_at' => 'datetime'];
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<DocumentTemplateGeneration, $this> */
    public function generations(): HasMany
    {
        return $this->hasMany(DocumentTemplateGeneration::class);
    }
}
