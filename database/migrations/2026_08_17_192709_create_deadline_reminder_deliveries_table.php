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
        Schema::create('deadline_reminder_deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('deadline_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('hours_before');
            $table->timestamps();
            $table->unique(['deadline_id', 'user_id', 'hours_before'], 'drd_deadline_user_hours_unique');
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deadline_reminder_deliveries');
    }
};
