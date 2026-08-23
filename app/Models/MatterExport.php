<?php

namespace App\Models;

use Database\Factories\MatterExportFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatterExport extends Model
{
    /** @use HasFactory<MatterExportFactory> */
    use HasFactory, HasUlids;

    protected $fillable = ['matter_id', 'status', 'storage_disk', 'storage_path', 'checksum', 'manifest_checksum', 'file_size', 'failure_message', 'requested_by', 'completed_at'];

    protected $attributes = ['status' => 'queued'];

    protected function casts(): array
    {
        return ['completed_at' => 'datetime'];
    }

    /** @return BelongsTo<Matter, $this> */
    public function matter(): BelongsTo
    {
        return $this->belongsTo(Matter::class);
    }

    /** @return BelongsTo<User, $this> */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }
}
