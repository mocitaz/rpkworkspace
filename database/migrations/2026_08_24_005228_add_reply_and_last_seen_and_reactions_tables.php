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
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('last_seen_at')->nullable()->after('remember_token');
        });

        Schema::table('direct_messages', function (Blueprint $table) {
            $table->foreignUlid('reply_to_id')->nullable()->after('recipient_id')->constrained('direct_messages')->nullOnDelete();
        });

        Schema::create('direct_message_reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('direct_message_id')->constrained('direct_messages')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('reaction', 32); // 'thumbs_up', 'heart', 'check', 'star'
            $table->timestamps();

            $table->unique(['direct_message_id', 'user_id', 'reaction'], 'dmr_message_user_reaction_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('direct_message_reactions');

        Schema::table('direct_messages', function (Blueprint $table) {
            $table->dropForeign(['reply_to_id']);
            $table->dropColumn('reply_to_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('last_seen_at');
        });
    }
};
