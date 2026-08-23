<?php

namespace App\Models;

use Database\Factories\DocumentFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    /** @use HasFactory<DocumentFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'matter_id', 'client_id', 'title', 'document_type', 'current_version_id',
        'status', 'confidentiality_level', 'created_by',
    ];

    protected $attributes = ['status' => 'draft', 'confidentiality_level' => 'standard'];

    /**
     * @param  Builder<Document>  $query
     * @return Builder<Document>
     */
    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        if (! $user->hasPermission('document.view')) {
            return $query->whereRaw('1 = 0');
        }

        $visibleMatterIds = Matter::query()->visibleTo($user)->select('id');

        return $query->where(function (Builder $query) use ($visibleMatterIds) {
            $query->whereNull('matter_id')
                ->orWhereIn('matter_id', $visibleMatterIds);
        });
    }

    /** @return BelongsTo<Matter, $this> */
    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<DocumentVersion, $this> */
    public function currentVersion(): BelongsTo
    {
        return $this->belongsTo(DocumentVersion::class, 'current_version_id');
    }

    /** @return HasMany<DocumentVersion, $this> */
    public function versions(): HasMany
    {
        return $this->hasMany(DocumentVersion::class)->latest('version_number');
    }

    /** @return HasMany<DocumentApproval, $this> */
    public function approvals(): HasMany
    {
        return $this->hasMany(DocumentApproval::class);
    }

    /** @return HasMany<SignatureRequest, $this> */
    public function signatureRequests(): HasMany
    {
        return $this->hasMany(SignatureRequest::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
