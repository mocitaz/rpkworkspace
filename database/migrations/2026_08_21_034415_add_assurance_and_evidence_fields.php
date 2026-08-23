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
            $table->string('assurance_level', 32)->default('internal_acceptance')->after('status')->index();
            $table->timestamp('signed_final_started_at')->nullable()->after('signed_final_status');
            $table->timestamp('signed_final_completed_at')->nullable()->after('signed_final_started_at');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->string('previous_hash', 64)->nullable()->after('metadata');
            $table->string('entry_hash', 64)->nullable()->unique()->after('previous_hash');
        });

        Schema::table('matter_exports', function (Blueprint $table) {
            $table->string('manifest_checksum', 64)->nullable()->after('checksum');
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
