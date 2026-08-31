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
        Schema::create('task_overdue_reminder_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->dateTimeTz('task_due_at');
            $table->unsignedSmallInteger('overdue_days');
            $table->dateTimeTz('sent_at');
            $table->timestamps();

            $table->unique(
                ['task_id', 'user_id', 'task_due_at', 'overdue_days'],
                'task_overdue_delivery_unique',
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_overdue_reminder_deliveries');
    }
};
