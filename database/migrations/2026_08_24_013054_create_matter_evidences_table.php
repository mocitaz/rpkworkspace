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
        Schema::create('matter_evidences', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('matter_id')->index();
            $table->string('evidence_code', 32); // e.g. Bukti P-1, Bukti T-1
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->string('originality', 32)->default('original'); // original, legalized_copy, photocopy, digital
            $table->string('vault_location', 128)->nullable(); // e.g. Brankas Litigasi Lt.2 / Bantex P-04
            $table->string('status', 32)->default('in_vault'); // in_vault, borrowed_for_hearing, submitted_to_court, returned_to_client
            $table->string('custodian_name', 128)->nullable();
            $table->text('custody_notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->foreign('matter_id')
                ->references('id')
                ->on('matters')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matter_evidences');
    }
};
