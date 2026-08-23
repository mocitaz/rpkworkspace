<?php

namespace App\Models;

use Database\Factories\MatterPartyFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatterParty extends Model
{
    /** @use HasFactory<MatterPartyFactory> */
    use HasFactory, HasUlids;

    protected $fillable = ['matter_id', 'contact_id', 'party_type', 'name', 'organization_name', 'notes', 'created_by'];

    /** @return BelongsTo<Matter, $this> */
    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }

    /** @return BelongsTo<Contact, $this> */
    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
