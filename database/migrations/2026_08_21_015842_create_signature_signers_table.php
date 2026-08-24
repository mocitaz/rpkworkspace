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
        Schema::create('signature_signers', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('signature_request_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('email')->index();
            $table->unsignedSmallInteger('signing_order')->default(1);
            $table->string('signing_token', 64)->unique();
            $table->string('status')->default('pending')->index();
            $table->timestamp('signed_at')->nullable();
            $table->timestamp('last_reminded_at')->nullable()->index();
            $table->string('signed_ip_address', 45)->nullable();
            $table->text('signed_user_agent')->nullable();
            $table->string('accepted_name')->nullable();
            $table->timestamps();
            $table->unique(['signature_request_id', 'email'], 'ss_request_email_unique');
            $table->index(['signature_request_id', 'signing_order', 'status'], 'ss_request_order_status_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signature_signers');
    }
};
