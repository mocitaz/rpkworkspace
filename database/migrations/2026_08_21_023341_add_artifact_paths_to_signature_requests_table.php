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
            $table->string('signed_record_disk')->nullable()->after('document_checksum');
            $table->string('signed_record_path')->nullable()->after('signed_record_disk');
            $table->string('certificate_disk')->nullable()->after('signed_record_path');
            $table->string('certificate_path')->nullable()->after('certificate_disk');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('signature_requests', function (Blueprint $table) {
            $table->dropColumn(['signed_record_disk', 'signed_record_path', 'certificate_disk', 'certificate_path']);
        });
    }
};
