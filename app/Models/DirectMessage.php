<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DirectMessage extends Model
{
    use HasFactory, HasUlids;

    protected $fillable = [
        'sender_id',
        'recipient_id',
        'reply_to_id',
        'message',
        'read_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    /**
     * @return BelongsTo<DirectMessage, $this>
     */
    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(DirectMessage::class, 'reply_to_id');
    }

    /**
     * @return HasMany<DirectMessageReaction, $this>
     */
    public function reactions(): HasMany
    {
        return $this->hasMany(DirectMessageReaction::class);
    }
}
