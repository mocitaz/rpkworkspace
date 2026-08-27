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
            $table->decimal('stamp_width', 5, 1)->default(50.0)->after('signer_title');
            $table->decimal('stamp_height', 5, 1)->default(30.0)->after('stamp_width');
            $table->boolean('show_qr')->default(true)->after('stamp_height');
            $table->boolean('show_name')->default(true)->after('show_qr');
            $table->boolean('show_title')->default(true)->after('show_name');
            $table->boolean('show_border')->default(true)->after('show_title');
            $table->string('signature_type')->default('draw')->after('show_border');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('signature_signers', function (Blueprint $table) {
            $table->dropColumn([
                'stamp_width',
                'stamp_height',
                'show_qr',
                'show_name',
                'show_title',
                'show_border',
                'signature_type',
            ]);
        });
    }
};
