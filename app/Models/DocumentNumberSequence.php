<?php

namespace App\Models;

use Database\Factories\DocumentNumberSequenceFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentNumberSequence extends Model
{
    /** @use HasFactory<DocumentNumberSequenceFactory> */
    use HasFactory;

    protected $fillable = ['type', 'year', 'next_value'];

    protected $attributes = ['next_value' => 1];
}
