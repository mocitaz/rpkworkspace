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
        'matter_id', 'event_type', 'status', 'title', 'description', 'outcome',
        'judge_notes', 'next_event_id', 'starts_at', 'ends_at',
        'location', 'checklist', 'owner_id', 'attended_by', 'created_by',
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

    /** @return BelongsTo<MatterEvent, $this> */
    public function nextEvent(): BelongsTo
    {
        return $this->belongsTo(MatterEvent::class, 'next_event_id');
    }

    /** @return BelongsTo<User, $this> */
    public function attendee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'attended_by');
    }

    /** @return BelongsTo<User, $this> */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
