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
        Schema::create('conflict_checks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('client_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUlid('matter_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUlid('quotation_id')->nullable()->constrained()->nullOnDelete();
            $table->string('subject_name');
            $table->json('searched_names');
            $table->json('matches')->nullable();
            $table->string('status')->default('clear')->index();
            $table->string('decision')->default('pending')->index();
            $table->text('decision_note')->nullable();
            $table->foreignId('requested_by')->constrained('users')->restrictOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
            $table->index(['client_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conflict_checks');
    }
};
