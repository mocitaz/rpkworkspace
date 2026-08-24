<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DirectMessageReaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'direct_message_id',
        'user_id',
        'reaction',
    ];

    /**
     * @return BelongsTo<DirectMessage, $this>
     */
    public function directMessage(): BelongsTo
    {
        return $this->belongsTo(DirectMessage::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
