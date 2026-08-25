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
            // 1. Kontak Pribadi & Domisili
            $table->string('phone', 30)->nullable()->after('email');
            $table->text('address')->nullable()->after('phone');
            $table->text('ktp_address')->nullable()->after('address');
            $table->date('birth_date')->nullable()->after('ktp_address');

            // 2. Legalitas & Kredensial Profesi Advokat
            $table->string('advocate_license_no', 100)->nullable()->after('position_title');
            $table->string('bas_number', 100)->nullable()->after('advocate_license_no');
            $table->date('bas_date')->nullable()->after('bas_number');
            $table->date('kta_expiry_date')->nullable()->after('bas_date');
            $table->text('practice_areas')->nullable()->after('kta_expiry_date');
            $table->string('education', 255)->nullable()->after('practice_areas');

            // 3. Operasional Keuangan & Billing Perkara
            $table->decimal('hourly_rate', 14, 2)->nullable()->after('education');
            $table->string('bank_name', 100)->nullable()->after('hourly_rate');
            $table->string('bank_account_number', 50)->nullable()->after('bank_name');
            $table->string('bank_account_holder', 150)->nullable()->after('bank_account_number');
            $table->string('npwp', 50)->nullable()->after('bank_account_holder');

            // 4. Manajemen Staf & Kapasitas
            $table->unsignedSmallInteger('matter_capacity_limit')->default(10)->after('npwp');
            $table->string('supervisor_name', 150)->nullable()->after('matter_capacity_limit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'address',
                'ktp_address',
                'birth_date',
                'advocate_license_no',
                'bas_number',
                'bas_date',
                'kta_expiry_date',
                'practice_areas',
                'education',
                'hourly_rate',
                'bank_name',
                'bank_account_number',
                'bank_account_holder',
                'npwp',
                'matter_capacity_limit',
                'supervisor_name',
            ]);
        });
    }
};
