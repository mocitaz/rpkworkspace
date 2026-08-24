<?php

namespace App\Models;

use Database\Factories\MatterEventFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatterEvent extends Model
{
    /** @use HasFactory<MatterEventFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'matter_id', 'event_type', 'title', 'description', 'starts_at', 'ends_at',
        'location', 'checklist', 'owner_id', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'checklist' => 'array',
        ];
    }

    /** @return BelongsTo<Matter, $this> */
    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }
}
