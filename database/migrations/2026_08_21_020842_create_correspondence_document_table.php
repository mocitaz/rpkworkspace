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
        Schema::create('correspondence_document', function (Blueprint $table) {
            $table->foreignUlid('correspondence_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('document_id')->constrained()->restrictOnDelete();
            $table->primary(['correspondence_id', 'document_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('correspondence_document');
    }
};
