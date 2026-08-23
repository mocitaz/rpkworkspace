<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matter_number_sequences', function (Blueprint $table) {
            $table->unsignedSmallInteger('year')->primary();
            $table->unsignedBigInteger('next_value')->default(1);
            $table->timestamps();
        });

        Schema::create('matters', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('matter_number')->unique();
            $table->string('title');
            $table->foreignUlid('client_id')->constrained()->restrictOnDelete();
            $table->text('summary')->nullable();
            $table->foreignId('practice_area_id')->nullable()->constrained()->nullOnDelete();
            $table->string('matter_type')->nullable()->index();
            $table->string('status')->default('active')->index();
            $table->string('priority')->default('normal')->index();
            $table->string('confidentiality_level')->default('standard')->index();
            $table->foreignId('responsible_partner_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('supervising_lawyer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('opened_at')->nullable()->index();
            $table->date('closed_at')->nullable();
            $table->string('jurisdiction')->nullable();
            $table->string('court')->nullable();
            $table->string('external_case_number')->nullable()->index();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['status', 'priority', 'updated_at']);
            $table->index(['client_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matters');
        Schema::dropIfExists('matter_number_sequences');
    }
};
