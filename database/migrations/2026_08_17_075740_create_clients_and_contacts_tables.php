<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('client_number')->unique();
            $table->string('type')->index();
            $table->string('legal_name');
            $table->string('display_name')->index();
            $table->string('industry')->nullable()->index();
            $table->text('tax_identifier')->nullable();
            $table->string('registration_identifier')->nullable();
            $table->string('website')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country_code', 2)->default('ID');
            $table->text('notes')->nullable();
            $table->string('status')->default('active')->index();
            $table->foreignId('relationship_partner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('opened_at')->nullable()->index();
            $table->date('closed_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['status', 'updated_at']);
        });

        Schema::create('contacts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('client_id')->nullable()->constrained()->nullOnDelete();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('job_title')->nullable();
            $table->string('organization_name')->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('mobile')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->index(['client_id', 'last_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('clients');
    }
};
