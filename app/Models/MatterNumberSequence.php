<?php

namespace App\Models;

use Database\Factories\MatterNumberSequenceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatterNumberSequence extends Model
{
    /** @use HasFactory<MatterNumberSequenceFactory> */
    use HasFactory;

    protected $primaryKey = 'year';

    public $incrementing = false;

    protected $keyType = 'int';

    protected $fillable = ['year', 'next_value'];
}
