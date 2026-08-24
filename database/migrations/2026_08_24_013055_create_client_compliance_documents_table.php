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
        Schema::create('client_compliance_documents', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('client_id')->index();
            $table->string('document_type', 64); // deed_establishment, deed_amendment_directors, nib, kbli_license, sk_menkumham, amdal_environmental, trademark_ip, tax_id, other
            $table->string('document_number', 128);
            $table->string('title', 255);
            $table->date('issued_at')->nullable();
            $table->date('expires_at')->nullable()->index();
            $table->string('issuer', 128)->nullable(); // e.g. Notaris / Kemenkumham / OSS BKPM
            $table->text('notes')->nullable();
            $table->string('file_path', 512)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->foreign('client_id')
                ->references('id')
                ->on('clients')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_compliance_documents');
    }
};
