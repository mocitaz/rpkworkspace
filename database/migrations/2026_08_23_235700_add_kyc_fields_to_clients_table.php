<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('kyc_risk_level')->default('low')->index()->after('notes');
            $table->string('kyc_status')->default('verified')->index()->after('kyc_risk_level');
            $table->json('kyc_checklist')->nullable()->after('kyc_status');
            $table->date('kyc_assessed_at')->nullable()->after('kyc_checklist');
            $table->foreignId('kyc_assessed_by')->nullable()->constrained('users')->nullOnDelete()->after('kyc_assessed_at');
            $table->text('kyc_notes')->nullable()->after('kyc_assessed_by');
        });
    }

    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropForeign(['kyc_assessed_by']);
            $table->dropColumn([
                'kyc_risk_level',
                'kyc_status',
                'kyc_checklist',
                'kyc_assessed_at',
                'kyc_assessed_by',
                'kyc_notes',
            ]);
        });
    }
};
