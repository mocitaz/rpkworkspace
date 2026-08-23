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
        Schema::table('document_versions', function (Blueprint $table) {
            $table->string('scan_status')->default('pending')->index()->after('checksum');
            $table->string('scan_message')->nullable()->after('scan_status');
            $table->timestamp('scanned_at')->nullable()->after('scan_message');
            $table->string('extraction_status')->default('pending')->index()->after('scanned_at');
            $table->longText('extracted_text')->nullable()->after('extraction_status');
            $table->json('extraction_metadata')->nullable()->after('extracted_text');
            $table->timestamp('extracted_at')->nullable()->after('extraction_metadata');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_versions', function (Blueprint $table) {
            $table->dropColumn([
                'scan_status',
                'scan_message',
                'scanned_at',
                'extraction_status',
                'extracted_text',
                'extraction_metadata',
                'extracted_at',
            ]);
        });
    }
};
