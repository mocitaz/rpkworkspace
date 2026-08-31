<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskOverdueReminderDelivery extends Model
{
    protected $fillable = [
        'task_id',
        'user_id',
        'task_due_at',
        'overdue_days',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'task_due_at' => 'datetime',
            'overdue_days' => 'integer',
            'sent_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Task, $this> */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
