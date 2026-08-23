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
        Schema::create('correspondences', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('matter_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('client_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUlid('contact_id')->nullable()->constrained()->nullOnDelete();
            $table->string('direction')->index();
            $table->string('source')->default('manual')->index();
            $table->string('subject');
            $table->json('from_addresses');
            $table->json('to_addresses');
            $table->json('cc_addresses')->nullable();
            $table->text('body')->nullable();
            $table->string('external_message_id')->nullable()->unique();
            $table->timestamp('occurred_at')->index();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['matter_id', 'occurred_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('correspondences');
    }
};
