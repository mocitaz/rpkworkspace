<?php

namespace App\Models;

use Database\Factories\MatterFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Matter extends Model
{
    /** @use HasFactory<MatterFactory> */
    use HasFactory, HasUlids;

    protected $fillable = [
        'matter_number', 'title', 'client_id', 'summary', 'budget_amount', 'currency', 'practice_area_id', 'matter_type',
        'status', 'priority', 'confidentiality_level', 'responsible_partner_id',
        'supervising_lawyer_id', 'opened_at', 'closed_at', 'jurisdiction', 'court',
        'external_case_number', 'archived_at', 'archived_by', 'legal_hold_at', 'legal_hold_by',
        'legal_hold_reason', 'created_by',
    ];

    protected $attributes = [
        'status' => 'active',
        'priority' => 'normal',
        'confidentiality_level' => 'standard',
        'budget_amount' => 0,
        'currency' => 'IDR',
    ];

    protected function casts(): array
    {
        return ['opened_at' => 'date', 'closed_at' => 'date', 'archived_at' => 'datetime', 'legal_hold_at' => 'datetime'];
    }

    /**
     * @param  Builder<Matter>  $query
     * @return Builder<Matter>
     */
    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        if (! $user->hasPermission('matter.view')) {
            return $query->whereRaw('1 = 0');
        }

        if ($user->hasPermission('matter.view.all')) {
            return $query;
        }

        return $query->where(function (Builder $query) use ($user) {
            $query->where('confidentiality_level', 'standard')
                ->orWhere('responsible_partner_id', $user->getKey())
                ->orWhere('supervising_lawyer_id', $user->getKey())
                ->orWhereHas('members', fn (Builder $members) => $members->whereKey($user->getKey()));
        });
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<PracticeArea, $this> */
    public function practiceArea(): BelongsTo
    {
        return $this->belongsTo(PracticeArea::class);
    }

    /** @return BelongsTo<User, $this> */
    public function responsiblePartner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsible_partner_id');
    }

    /** @return BelongsTo<User, $this> */
    public function supervisingLawyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervising_lawyer_id');
    }

    /** @return BelongsTo<User, $this> */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** @return BelongsToMany<User, $this> */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'matter_members')
            ->withPivot(['role', 'assigned_by', 'created_at']);
    }

    /** @return HasMany<MatterParty, $this> */
    public function parties(): HasMany
    {
        return $this->hasMany(MatterParty::class);
    }

    /** @return HasMany<Task, $this> */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /** @return HasMany<Deadline, $this> */
    public function deadlines(): HasMany
    {
        return $this->hasMany(Deadline::class);
    }

    /** @return HasMany<MatterEvent, $this> */
    public function events(): HasMany
    {
        return $this->hasMany(MatterEvent::class);
    }

    /** @return HasMany<Note, $this> */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }

    /** @return HasMany<Document, $this> */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    /** @return HasMany<Correspondence, $this> */
    public function correspondences(): HasMany
    {
        return $this->hasMany(Correspondence::class);
    }

    /** @return HasMany<ConflictCheck, $this> */
    public function conflictChecks(): HasMany
    {
        return $this->hasMany(ConflictCheck::class);
    }

    /** @return HasMany<MatterExport, $this> */
    public function exports(): HasMany
    {
        return $this->hasMany(MatterExport::class);
    }

    /** @return HasMany<Quotation, $this> */
    public function quotations(): HasMany
    {
        return $this->hasMany(Quotation::class);
    }

    /** @return HasMany<Invoice, $this> */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /** @return HasMany<Expense, $this> */
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    /** @return HasMany<Payment, $this> */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
