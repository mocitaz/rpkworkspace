<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('document_templates', function (Blueprint $table) {
            $table->ulid('root_template_id')->nullable()->index()->after('id');
            $table->unsignedInteger('version')->default(1)->after('status');
            $table->timestamp('superseded_at')->nullable()->after('version');
            $table->index(['root_template_id', 'version']);
        });
    }

    public function down(): void
    {
        Schema::table('document_templates', function (Blueprint $table) {
            $table->dropIndex(['root_template_id', 'version']);
            $table->dropColumn(['root_template_id', 'version', 'superseded_at']);
        });
    }
};
