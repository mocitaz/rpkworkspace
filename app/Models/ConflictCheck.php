<?php

namespace App\Models;

use Database\Factories\ConflictCheckFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConflictCheck extends Model
{
    /** @use HasFactory<ConflictCheckFactory> */
    use HasFactory, HasUlids;

    protected $fillable = ['client_id', 'matter_id', 'quotation_id', 'subject_name', 'searched_names', 'matches', 'status', 'decision', 'decision_note', 'requested_by', 'reviewed_by', 'reviewed_at', 'expires_at'];

    protected $attributes = ['status' => 'clear', 'decision' => 'pending'];

    protected function casts(): array
    {
        return ['searched_names' => 'array', 'matches' => 'array', 'reviewed_at' => 'datetime', 'expires_at' => 'datetime'];
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<Matter, $this> */
    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }

    /** @return BelongsTo<Quotation, $this> */
    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    /** @return BelongsTo<User, $this> */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /** @return BelongsTo<User, $this> */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
