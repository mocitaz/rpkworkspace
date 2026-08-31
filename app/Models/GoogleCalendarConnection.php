<?php

namespace App\Models;

use Database\Factories\GoogleCalendarConnectionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GoogleCalendarConnection extends Model
{
    /** @use HasFactory<GoogleCalendarConnectionFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id', 'google_account_email', 'access_token', 'refresh_token', 'token_expires_at',
        'calendar_id', 'calendar_name', 'privacy_mode', 'sync_events', 'sync_deadlines',
        'sync_tasks', 'is_active', 'last_synced_at', 'last_error',
    ];

    protected $hidden = ['access_token', 'refresh_token'];

    protected function casts(): array
    {
        return [
            'access_token' => 'encrypted',
            'refresh_token' => 'encrypted',
            'token_expires_at' => 'datetime',
            'sync_events' => 'boolean',
            'sync_deadlines' => 'boolean',
            'sync_tasks' => 'boolean',
            'is_active' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<GoogleCalendarEvent, $this> */
    public function events(): HasMany
    {
        return $this->hasMany(GoogleCalendarEvent::class);
    }
}
