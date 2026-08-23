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
        Schema::table('matters', function (Blueprint $table) {
            Schema::table('matters', function (Blueprint $table) {
                $table->timestamp('archived_at')->nullable()->index()->after('closed_at');
                $table->foreignId('archived_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('legal_hold_at')->nullable()->index()->after('archived_by');
                $table->foreignId('legal_hold_by')->nullable()->constrained('users')->nullOnDelete();
                $table->text('legal_hold_reason')->nullable()->after('legal_hold_by');
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matters', function (Blueprint $table) {
            Schema::table('matters', function (Blueprint $table) {
                $table->dropConstrainedForeignId('legal_hold_by');
                $table->dropColumn(['legal_hold_at', 'legal_hold_reason']);
                $table->dropConstrainedForeignId('archived_by');
                $table->dropColumn('archived_at');
            });
        });
    }
};
