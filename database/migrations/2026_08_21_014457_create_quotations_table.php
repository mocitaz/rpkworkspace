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
        Schema::create('quotations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('quotation_number')->unique();
            $table->foreignUlid('client_id')->constrained()->restrictOnDelete();
            $table->foreignUlid('matter_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('scope')->nullable();
            $table->string('status')->default('draft')->index();
            $table->string('currency', 3)->default('IDR');
            $table->unsignedBigInteger('subtotal_amount')->default(0);
            $table->unsignedBigInteger('discount_amount')->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->unsignedBigInteger('tax_amount')->default(0);
            $table->unsignedBigInteger('total_amount')->default(0);
            $table->date('issued_at')->nullable();
            $table->date('valid_until')->nullable()->index();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('converted_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['client_id', 'status', 'issued_at']);
            $table->index(['matter_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
