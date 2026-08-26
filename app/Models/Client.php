<?php

namespace App\Models;

use Database\Factories\ClientFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Throwable;

class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'client_number', 'type', 'legal_name', 'display_name', 'industry', 'tax_identifier',
        'registration_identifier', 'website', 'phone', 'email', 'address_line_1',
        'address_line_2', 'city', 'province', 'postal_code', 'country_code', 'notes',
        'kyc_risk_level', 'kyc_status', 'kyc_checklist', 'kyc_assessed_at', 'kyc_assessed_by', 'kyc_notes',
        'status', 'relationship_partner_id', 'opened_at', 'closed_at', 'created_by',
    ];

    protected $hidden = ['tax_identifier'];

    protected $attributes = ['status' => 'active', 'country_code' => 'ID', 'kyc_risk_level' => 'low', 'kyc_status' => 'verified'];

    protected function casts(): array
    {
        return [
            'kyc_checklist' => 'array',
            'kyc_assessed_at' => 'date',
            'opened_at' => 'date',
            'closed_at' => 'date',
        ];
    }

    /**
     * Resilient encrypted attribute with fallback for mismatched APP_KEY or plaintext seed.
     */
    protected function taxIdentifier(): Attribute
    {
        return Attribute::make(
            get: function (?string $value): ?string {
                if (! $value) {
                    return null;
                }

                try {
                    return decrypt($value);
                } catch (Throwable) {
                    if (str_starts_with($value, 'eyJ')) {
                        return null;
                    }

                    return $value;
                }
            },
            set: function (?string $value): ?string {
                if (! $value) {
                    return null;
                }

                return encrypt($value);
            },
        );
    }

    /**
     * Fallback name attribute accessor.
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn (): string => (string) ($this->display_name ?: $this->legal_name),
        );
    }

    /** @return BelongsTo<User, $this> */
    public function kycAssessedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kyc_assessed_by');
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

    /** @return HasMany<ClientComplianceDocument, $this> */
    public function complianceDocuments(): HasMany
    {
        return $this->hasMany(ClientComplianceDocument::class)->orderBy('expires_at', 'asc');
    }
}
