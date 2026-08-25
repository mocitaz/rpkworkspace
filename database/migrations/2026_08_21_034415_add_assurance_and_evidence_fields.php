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
        Schema::table('signature_requests', function (Blueprint $table) {
            if (! Schema::hasColumn('signature_requests', 'assurance_level')) {
                $table->string('assurance_level', 32)->default('internal_acceptance')->after('status')->index();
            }
            if (! Schema::hasColumn('signature_requests', 'signed_final_started_at')) {
                $table->timestamp('signed_final_started_at')->nullable()->after('assurance_level');
            }
            if (! Schema::hasColumn('signature_requests', 'signed_final_completed_at')) {
                $table->timestamp('signed_final_completed_at')->nullable()->after('signed_final_started_at');
            }
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            if (! Schema::hasColumn('audit_logs', 'previous_hash')) {
                $table->string('previous_hash', 64)->nullable()->after('metadata');
            }
            if (! Schema::hasColumn('audit_logs', 'entry_hash')) {
                $table->string('entry_hash', 64)->nullable()->unique()->after('previous_hash');
            }
        });

        Schema::table('matter_exports', function (Blueprint $table) {
            if (! Schema::hasColumn('matter_exports', 'manifest_checksum')) {
                $table->string('manifest_checksum', 64)->nullable()->after('checksum');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matter_exports', function (Blueprint $table) {
            $table->dropColumn('manifest_checksum');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropUnique(['entry_hash']);
            $table->dropColumn(['previous_hash', 'entry_hash']);
        });

        Schema::table('signature_requests', function (Blueprint $table) {
            $table->dropIndex(['assurance_level']);
            $table->dropColumn(['assurance_level', 'signed_final_started_at', 'signed_final_completed_at']);
        });
    }
};
