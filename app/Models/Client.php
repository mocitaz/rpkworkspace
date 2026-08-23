<?php

namespace App\Models;

use Database\Factories\ClientFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'client_number', 'type', 'legal_name', 'display_name', 'industry', 'tax_identifier',
        'registration_identifier', 'website', 'phone', 'email', 'address_line_1',
        'address_line_2', 'city', 'province', 'postal_code', 'country_code', 'notes',
        'status', 'relationship_partner_id', 'opened_at', 'closed_at', 'created_by',
    ];

    protected $hidden = ['tax_identifier'];

    protected $attributes = ['status' => 'active', 'country_code' => 'ID'];

    protected function casts(): array
    {
        return [
            'tax_identifier' => 'encrypted',
            'opened_at' => 'date',
            'closed_at' => 'date',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function relationshipPartner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'relationship_partner_id');
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return HasMany<Contact, $this> */
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    /** @return HasMany<Matter, $this> */
    public function matters(): HasMany
    {
        return $this->hasMany(Matter::class);
    }

    /** @return HasMany<Document, $this> */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
