<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('matter_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('assignee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reporter_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('todo')->index();
            $table->string('priority')->default('normal')->index();
            $table->dateTimeTz('due_at')->nullable()->index();
            $table->dateTimeTz('completed_at')->nullable();
            $table->timestamps();
            $table->index(['assignee_id', 'status', 'due_at']);
            $table->index(['matter_id', 'status']);
        });

        Schema::create('deadlines', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('matter_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('deadline_type')->index();
            $table->dateTimeTz('due_at')->index();
            $table->boolean('is_critical')->default(false)->index();
            $table->json('reminder_metadata')->nullable();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('open')->index();
            $table->dateTimeTz('completed_at')->nullable();
            $table->dateTimeTz('cancelled_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['matter_id', 'status', 'due_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('deadlines');
        Schema::dropIfExists('tasks');
    }
};
