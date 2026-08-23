<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matter_members', function (Blueprint $table) {
            $table->foreignUlid('matter_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('role')->default('member');
            $table->foreignId('assigned_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
            $table->primary(['matter_id', 'user_id']);
            $table->index(['user_id', 'role']);
        });

        Schema::create('matter_parties', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('matter_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('contact_id')->nullable()->constrained()->nullOnDelete();
            $table->string('party_type')->index();
            $table->string('name');
            $table->string('organization_name')->nullable()->index();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['matter_id', 'party_type']);
        });

        Schema::create('matter_events', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('matter_id')->constrained()->cascadeOnDelete();
            $table->string('event_type')->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTimeTz('starts_at')->index();
            $table->dateTimeTz('ends_at')->nullable();
            $table->string('location')->nullable();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['matter_id', 'starts_at']);
        });

        Schema::create('notes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('matter_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignUlid('client_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('classification')->default('internal')->index();
            $table->string('title')->nullable();
            $table->text('body');
            $table->foreignId('private_to_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['matter_id', 'created_at']);
            $table->index(['client_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
        Schema::dropIfExists('matter_events');
        Schema::dropIfExists('matter_parties');
        Schema::dropIfExists('matter_members');
    }
};
