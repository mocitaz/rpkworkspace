<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'name',
    'position_title',
    'employee_code',
    'department',
    'employment_type',
    'employment_status',
    'work_mode',
    'joined_at',
    'contract_end',
    'leave_balance',
    'utilization',
    'performance_score',
    'next_review',
    'avatar_path',
    'email',
    'email_verified_at',
    'password',
    'calendar_token',
    'locale',
    'timezone',
    'is_active',
    'disabled_at',
    'last_seen_at',
    'phone',
    'address',
    'ktp_address',
    'birth_date',
    'advocate_license_no',
    'bas_number',
    'bas_date',
    'kta_expiry_date',
    'practice_areas',
    'education',
    'hourly_rate',
    'bank_name',
    'bank_account_number',
    'bank_account_holder',
    'npwp',
    'matter_capacity_limit',
    'supervisor_name',
])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'avatar_url',
    ];

    /**
     * Get the user's avatar URL.
     */
    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->avatar_path ? '/storage/'.$this->avatar_path : '/images/default-avatar.svg',
        );
    }

    /** @return BelongsToMany<Role, $this> */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withPivot(['assigned_by', 'created_at']);
    }

    /** @return BelongsToMany<Matter, $this> */
    public function matters(): BelongsToMany
    {
        return $this->belongsToMany(Matter::class, 'matter_members')
            ->withPivot(['role', 'assigned_by', 'created_at']);
    }

    /** @return HasMany<AuditLog, $this> */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'actor_id');
    }

    /** @return HasMany<DirectMessage, $this> */
    public function directMessagesSent(): HasMany
    {
        return $this->hasMany(DirectMessage::class, 'sender_id');
    }

    /** @return HasMany<DirectMessage, $this> */
    public function directMessagesReceived(): HasMany
    {
        return $this->hasMany(DirectMessage::class, 'recipient_id');
    }

    public function hasPermission(string $permission): bool
    {
        return $this->roles()->whereHas('permissions', fn ($query) => $query->where('name', $permission))->exists();
    }

    public function hasRole(string ...$roles): bool
    {
        return $this->roles()->whereIn('slug', $roles)->exists();
    }

    public function ensureCalendarToken(): string
    {
        try {
            if (empty($this->calendar_token)) {
                $this->forceFill(['calendar_token' => Str::random(48)])->saveQuietly();
            }

            return $this->calendar_token ?? hash_hmac('sha256', (string) $this->id, (string) config('app.key'));
        } catch (\Throwable) {
            return hash_hmac('sha256', (string) $this->id, (string) config('app.key'));
        }
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
            'last_seen_at' => 'datetime',
            'disabled_at' => 'datetime',
            'joined_at' => 'date',
            'contract_end' => 'date',
            'next_review' => 'date',
            'birth_date' => 'date',
            'bas_date' => 'date',
            'kta_expiry_date' => 'date',
            'hourly_rate' => 'decimal:2',
            'matter_capacity_limit' => 'integer',
            'performance_score' => 'decimal:1',
        ];
    }
}
