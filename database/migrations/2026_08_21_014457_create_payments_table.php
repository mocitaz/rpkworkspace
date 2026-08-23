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
        Schema::create('payments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('client_id')->constrained()->restrictOnDelete();
            $table->foreignUlid('matter_id')->nullable()->constrained()->nullOnDelete();
            $table->string('currency', 3)->default('IDR');
            $table->unsignedBigInteger('amount');
            $table->string('method');
            $table->string('reference_number')->nullable()->index();
            $table->text('notes')->nullable();
            $table->timestamp('received_at')->index();
            $table->foreignUlid('proof_document_id')->nullable()->constrained('documents')->nullOnDelete();
            $table->foreignId('recorded_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['client_id', 'received_at']);
            $table->index(['matter_id', 'received_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
