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
        Schema::create('google_calendar_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('google_calendar_connection_id')->constrained()->cascadeOnDelete();
            $table->string('source_type');
            $table->string('source_id');
            $table->string('google_event_id');
            $table->string('content_hash', 64);
            $table->timestamps();

            $table->unique(['google_calendar_connection_id', 'source_type', 'source_id'], 'google_calendar_source_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('google_calendar_events');
    }
};
