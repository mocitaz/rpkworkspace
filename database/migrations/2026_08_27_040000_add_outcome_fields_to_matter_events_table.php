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
        Schema::table('matter_events', function (Blueprint $table) {
            $table->string('status')->default('scheduled')->after('event_type')->index();
            $table->text('outcome')->nullable()->after('description');
            $table->text('judge_notes')->nullable()->after('outcome');
            $table->ulid('next_event_id')->nullable()->after('judge_notes')->index();
            $table->foreignId('attended_by')->nullable()->after('owner_id')->constrained('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matter_events', function (Blueprint $table) {
            $table->dropForeign(['attended_by']);
            $table->dropColumn(['status', 'outcome', 'judge_notes', 'next_event_id', 'attended_by']);
        });
    }
};
