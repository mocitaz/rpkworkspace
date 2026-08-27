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
        Schema::table('payrolls', function (Blueprint $table) {
            $table->foreignUlid('proof_document_id')->nullable()->after('notes')->constrained('documents')->nullOnDelete();
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->foreignUlid('proof_document_id')->nullable()->after('cancellation_reason')->constrained('documents')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payrolls', function (Blueprint $table) {
            $table->dropConstrainedForeignId('proof_document_id');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropConstrainedForeignId('proof_document_id');
        });
    }
};
