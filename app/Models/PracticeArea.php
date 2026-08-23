<?php

namespace App\Models;

use Database\Factories\PracticeAreaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PracticeArea extends Model
{
    /** @use HasFactory<PracticeAreaFactory> */
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'is_active', 'sort_order'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    /** @return HasMany<Matter, $this> */
    public function matters(): HasMany
    {
        return $this->hasMany(Matter::class);
    }
}
