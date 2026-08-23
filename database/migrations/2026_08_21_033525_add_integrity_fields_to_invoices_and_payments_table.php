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
        Schema::table('invoices', function (Blueprint $table) {
            $table->timestamp('cancelled_at')->nullable()->after('paid_at');
            $table->foreignId('cancelled_by')->nullable()->after('cancelled_at')->constrained('users')->nullOnDelete();
            $table->text('cancellation_reason')->nullable()->after('cancelled_by');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->timestamp('refunded_at')->nullable()->after('reversed_at');
            $table->foreignId('refunded_by')->nullable()->after('refunded_at')->constrained('users')->nullOnDelete();
            $table->text('refund_reason')->nullable()->after('refunded_by');
        });

        Schema::table('document_templates', function (Blueprint $table) {
            $table->string('scan_status', 32)->default('pending')->after('status')->index();
            $table->text('scan_message')->nullable()->after('scan_status');
            $table->timestamp('scanned_at')->nullable()->after('scan_message');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_templates', function (Blueprint $table) {
            $table->dropIndex(['scan_status']);
            $table->dropColumn(['scan_status', 'scan_message', 'scanned_at']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('refunded_by');
            $table->dropColumn(['refunded_at', 'refund_reason']);
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropConstrainedForeignId('cancelled_by');
            $table->dropColumn(['cancelled_at', 'cancellation_reason']);
        });
    }
};
