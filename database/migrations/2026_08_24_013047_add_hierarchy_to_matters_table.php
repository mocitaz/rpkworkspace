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
        Schema::table('matters', function (Blueprint $table) {
            $table->ulid('parent_matter_id')->nullable()->after('client_id')->index();
            $table->string('relationship_type', 64)->nullable()->default('related_dispute')->after('parent_matter_id');

            $table->foreign('parent_matter_id')
                ->references('id')
                ->on('matters')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('matters', function (Blueprint $table) {
            $table->dropForeign(['parent_matter_id']);
            $table->dropColumn(['parent_matter_id', 'relationship_type']);
        });
    }
};
