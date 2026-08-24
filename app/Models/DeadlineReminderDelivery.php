<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeadlineReminderDelivery extends Model
{
    use HasFactory;

    protected $fillable = ['deadline_id', 'user_id', 'hours_before'];

    /** @return BelongsTo<Deadline, $this> */
    public function deadline(): BelongsTo
    {
        return $this->belongsTo(Deadline::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
