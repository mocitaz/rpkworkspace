<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('signature_requests', function (Blueprint $table) {
            $table->string('signed_final_disk')->nullable()->after('signed_record_path');
            $table->string('signed_final_path')->nullable()->after('signed_final_disk');
            $table->string('signed_final_status')->default('pending')->index()->after('signed_final_path');
            $table->string('signed_final_message')->nullable()->after('signed_final_status');
        });
    }

    public function down(): void
    {
        Schema::table('signature_requests', function (Blueprint $table) {
            $table->dropColumn(['signed_final_disk', 'signed_final_path', 'signed_final_status', 'signed_final_message']);
        });
    }
};
