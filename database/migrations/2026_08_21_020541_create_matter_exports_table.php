<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('matter_exports', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('matter_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('queued')->index();
            $table->string('storage_disk')->nullable();
            $table->string('storage_path')->nullable()->unique();
            $table->string('checksum', 64)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->text('failure_message')->nullable();
            $table->foreignId('requested_by')->constrained('users')->restrictOnDelete();
            $table->timestamp('completed_at')->nullable()->index();
            $table->timestamps();
            $table->index(['matter_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matter_exports');
    }
};
