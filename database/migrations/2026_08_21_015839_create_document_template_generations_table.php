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
        Schema::create('document_template_generations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('document_template_id')->constrained()->restrictOnDelete();
            $table->foreignUlid('document_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('matter_id')->nullable()->constrained()->nullOnDelete();
            $table->json('resolved_placeholders');
            $table->foreignId('generated_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['document_template_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_template_generations');
    }
};
