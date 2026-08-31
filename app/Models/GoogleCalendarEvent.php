<?php

namespace App\Models;

use Database\Factories\GoogleCalendarEventFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoogleCalendarEvent extends Model
{
    /** @use HasFactory<GoogleCalendarEventFactory> */
    use HasFactory;

    protected $fillable = [
        'google_calendar_connection_id', 'source_type', 'source_id', 'google_event_id', 'content_hash',
    ];

    /** @return BelongsTo<GoogleCalendarConnection, $this> */
    public function connection(): BelongsTo
    {
        return $this->belongsTo(GoogleCalendarConnection::class, 'google_calendar_connection_id');
    }
}
