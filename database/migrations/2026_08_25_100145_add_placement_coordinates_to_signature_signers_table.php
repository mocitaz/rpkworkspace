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
        Schema::table('signature_signers', function (Blueprint $table) {
            $table->unsignedSmallInteger('page_number')->nullable()->after('signature_data');
            $table->decimal('position_x', 5, 2)->nullable()->after('page_number');
            $table->decimal('position_y', 5, 2)->nullable()->after('position_x');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('signature_signers', function (Blueprint $table) {
            $table->dropColumn(['page_number', 'position_x', 'position_y']);
        });
    }
};
