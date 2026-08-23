<?php

namespace App\Models;

use Database\Factories\CorrespondenceFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Correspondence extends Model
{
    /** @use HasFactory<CorrespondenceFactory> */
    use HasFactory, HasUlids;

    protected $fillable = ['matter_id', 'client_id', 'contact_id', 'direction', 'source', 'subject', 'from_addresses', 'to_addresses', 'cc_addresses', 'body', 'external_message_id', 'occurred_at', 'created_by'];

    protected $attributes = ['source' => 'manual'];

    protected function casts(): array
    {
        return ['from_addresses' => 'array', 'to_addresses' => 'array', 'cc_addresses' => 'array', 'occurred_at' => 'datetime'];
    }

    /** @return BelongsTo<Matter, $this> */
    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<Contact, $this> */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return BelongsToMany<Document, $this> */
    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class);
    }
}
