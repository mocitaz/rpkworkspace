<?php

namespace App\Models;

use Database\Factories\DeadlineFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property Carbon|null $due_at
 */
class Deadline extends Model
{
    /** @use HasFactory<DeadlineFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'matter_id', 'title', 'description', 'deadline_type', 'due_at', 'is_critical',
        'reminder_metadata', 'owner_id', 'status', 'completed_at', 'cancelled_at', 'created_by',
    ];

    protected $attributes = ['status' => 'open', 'is_critical' => false];

    protected function casts(): array
    {
        return [
            'due_at' => 'datetime', 'is_critical' => 'boolean', 'reminder_metadata' => 'array',
            'completed_at' => 'datetime', 'cancelled_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Matter, $this> */
    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }

    /** @return BelongsTo<User, $this> */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
