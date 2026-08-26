<?php

namespace App\Models;

use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'task_number', 'matter_id', 'title', 'category', 'stage', 'description',
        'assignee_id', 'reporter_id', 'reviewer_id', 'status', 'priority',
        'due_at', 'completed_at', 'start_date', 'is_billable',
        'estimated_hours', 'actual_hours', 'checklists', 'completion_notes',
    ];

    protected $attributes = [
        'status' => 'todo',
        'priority' => 'normal',
        'is_billable' => false,
        'category' => 'general',
    ];

    protected static function booted(): void
    {
        static::creating(function (Task $task) {
            if (empty($task->task_number)) {
                $year = now()->format('Y');
                $lastTask = static::query()
                    ->where('task_number', 'like', "TSK-{$year}-%")
                    ->orderByDesc('task_number')
                    ->first();
                $nextSeq = 1;
                if ($lastTask && preg_match('/TSK-\d{4}-(\d+)/', (string) $lastTask->task_number, $matches)) {
                    $nextSeq = ((int) $matches[1]) + 1;
                }
                $task->task_number = sprintf('TSK-%s-%04d', $year, $nextSeq);
            }
        });
    }

    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
            'completed_at' => 'datetime',
            'start_date' => 'date',
            'is_billable' => 'boolean',
            'estimated_hours' => 'decimal:2',
            'actual_hours' => 'decimal:2',
            'checklists' => 'array',
        ];
    }

    /** @return BelongsTo<Matter, $this> */
    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }

    /** @return BelongsTo<User, $this> */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    /** @return BelongsTo<User, $this> */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    /** @return BelongsTo<User, $this> */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /** @return MorphMany<Comment, $this> */
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
