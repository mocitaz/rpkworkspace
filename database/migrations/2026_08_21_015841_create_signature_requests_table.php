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
        Schema::create('signature_requests', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('document_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('document_version_id')->constrained('document_versions')->restrictOnDelete();
            $table->string('verification_code', 40)->unique();
            $table->string('mode')->default('sequential');
            $table->string('status')->default('draft')->index();
            $table->string('document_checksum', 64);
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('completed_at')->nullable()->index();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['document_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signature_requests');
    }
};
