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
        Schema::create('matter_chronologies', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('matter_id')->constrained('matters')->cascadeOnDelete();
            $table->date('event_date');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('evidence_reference')->nullable();
            $table->string('witness_name')->nullable();
            $table->string('importance_level', 30)->default('normal');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['matter_id', 'event_date']);
        });

        Schema::table('matter_events', function (Blueprint $table) {
            $table->json('checklist')->nullable()->after('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matter_events', function (Blueprint $table) {
            $table->dropColumn('checklist');
        });

        Schema::dropIfExists('matter_chronologies');
    }
};
