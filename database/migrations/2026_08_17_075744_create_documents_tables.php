<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('matter_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignUlid('client_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('document_type')->nullable()->index();
            $table->string('status')->default('draft')->index();
            $table->string('confidentiality_level')->default('standard')->index();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['matter_id', 'updated_at']);
            $table->index(['client_id', 'updated_at']);
        });

        Schema::create('document_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('document_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('version_number');
            $table->string('original_filename');
            $table->string('storage_disk');
            $table->string('storage_path')->unique();
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size');
            $table->string('checksum', 64)->index();
            $table->foreignId('uploaded_by')->constrained('users')->restrictOnDelete();
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['document_id', 'version_number']);
        });

        Schema::table('documents', function (Blueprint $table) {
            $table->foreignUlid('current_version_id')->nullable()->after('document_type')
                ->constrained('document_versions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropConstrainedForeignId('current_version_id');
        });
        Schema::dropIfExists('document_versions');
        Schema::dropIfExists('documents');
    }
};
