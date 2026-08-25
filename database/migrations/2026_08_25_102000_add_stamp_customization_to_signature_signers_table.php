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
            $table->string('stamp_layout')->default('sig_left')->after('position_y');
            $table->string('name_position')->default('bottom')->after('stamp_layout');
            $table->string('signer_title')->nullable()->after('name_position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('signature_signers', function (Blueprint $table) {
            $table->dropColumn(['stamp_layout', 'name_position', 'signer_title']);
        });
    }
};
