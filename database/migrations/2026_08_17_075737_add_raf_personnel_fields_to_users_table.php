<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('position_title')->nullable()->after('name');
            $table->string('locale', 10)->default('id')->after('email_verified_at');
            $table->string('timezone', 64)->default('Asia/Jakarta')->after('locale');
            $table->boolean('is_active')->default(true)->index()->after('timezone');
            $table->timestamp('disabled_at')->nullable()->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['position_title', 'locale', 'timezone', 'is_active', 'disabled_at']);
        });
    }
};
