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
        // 1. Financial Accounts (Kas Kantor, Bank Operasional, Dana Klien, Kas Talangan Partner)
        Schema::create('financial_accounts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name')->index();
            $table->string('type')->index(); // cash, bank, partner_advance, client_trust
            $table->string('account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->foreignId('partner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('currency', 3)->default('IDR');
            $table->bigInteger('opening_balance')->default(0);
            $table->bigInteger('current_balance')->default(0);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 2. Account Transfers (Transfer Antar Kas / Bank)
        Schema::create('account_transfers', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('transfer_number')->unique();
            $table->foreignUlid('from_account_id')->constrained('financial_accounts')->restrictOnDelete();
            $table->foreignUlid('to_account_id')->constrained('financial_accounts')->restrictOnDelete();
            $table->unsignedBigInteger('amount');
            $table->date('transferred_at')->index();
            $table->string('reference_number')->nullable();
            $table->text('notes')->nullable();
            $table->foreignUlid('proof_document_id')->nullable()->constrained('documents')->nullOnDelete();
            $table->string('status')->default('completed')->index();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });

        // 3. Partner Transactions (Talangan, Pengembalian Talangan, Prive, Bagi Hasil, Setoran Modal)
        Schema::create('partner_transactions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('transaction_number')->unique();
            $table->foreignId('partner_id')->constrained('users')->restrictOnDelete();
            $table->foreignUlid('matter_id')->nullable()->constrained('matters')->nullOnDelete();
            $table->string('type')->index(); // advance_incurred, advance_reimbursed, profit_distribution, capital_injection, draw_prive
            $table->unsignedBigInteger('amount');
            $table->date('transaction_date')->index();
            $table->foreignUlid('account_id')->nullable()->constrained('financial_accounts')->nullOnDelete();
            $table->foreignUlid('proof_document_id')->nullable()->constrained('documents')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->string('status')->default('approved')->index();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });

        // 4. Client Trust Funds (Dana Titipan Klien / Panjar Biaya Perkara)
        Schema::create('client_trust_funds', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('transaction_number')->unique();
            $table->foreignUlid('client_id')->constrained('clients')->restrictOnDelete();
            $table->foreignUlid('matter_id')->nullable()->constrained('matters')->nullOnDelete();
            $table->foreignUlid('account_id')->constrained('financial_accounts')->restrictOnDelete();
            $table->string('type')->index(); // deposit_in, disbursement_out
            $table->unsignedBigInteger('amount');
            $table->date('transaction_date')->index();
            $table->string('purpose');
            $table->string('recipient_party')->nullable();
            $table->foreignUlid('proof_document_id')->nullable()->constrained('documents')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->string('status')->default('approved')->index();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });

        // 5. Payrolls (Penggajian & Slip Gaji Bulanan)
        Schema::create('payrolls', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('payslip_number')->unique();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->string('period', 7)->index(); // YYYY-MM
            $table->unsignedBigInteger('basic_salary')->default(0);
            $table->unsignedBigInteger('fixed_allowance')->default(0);
            $table->unsignedBigInteger('transport_meal_allowance')->default(0);
            $table->unsignedBigInteger('overtime_amount')->default(0);
            $table->unsignedBigInteger('bonus_amount')->default(0);
            $table->unsignedBigInteger('deductions_amount')->default(0);
            $table->unsignedBigInteger('tax_deduction_amount')->default(0);
            $table->unsignedBigInteger('net_salary');
            $table->string('status')->default('draft')->index(); // draft, approved, paid
            $table->foreignUlid('payment_account_id')->nullable()->constrained('financial_accounts')->nullOnDelete();
            $table->timestamp('paid_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });

        // 6. Enhance Expenses table
        Schema::table('expenses', function (Blueprint $table) {
            $table->string('charge_to')->default('office')->after('category'); // office, client
            $table->foreignUlid('account_id')->nullable()->after('currency')->constrained('financial_accounts')->nullOnDelete();
            $table->foreignId('partner_id')->nullable()->after('account_id')->constrained('users')->nullOnDelete();
            $table->boolean('is_reimbursable')->default(false)->after('partner_id');
        });

        // 7. Enhance Payments table
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignUlid('account_id')->nullable()->after('matter_id')->constrained('financial_accounts')->nullOnDelete();
            $table->unsignedBigInteger('gross_amount')->nullable()->after('amount');
            $table->unsignedBigInteger('tax_withheld')->default(0)->after('gross_amount');
            $table->unsignedBigInteger('net_amount')->nullable()->after('tax_withheld');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['account_id']);
            $table->dropColumn(['account_id', 'gross_amount', 'tax_withheld', 'net_amount']);
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['account_id']);
            $table->dropForeign(['partner_id']);
            $table->dropColumn(['charge_to', 'account_id', 'partner_id', 'is_reimbursable']);
        });

        Schema::dropIfExists('payrolls');
        Schema::dropIfExists('client_trust_funds');
        Schema::dropIfExists('partner_transactions');
        Schema::dropIfExists('account_transfers');
        Schema::dropIfExists('financial_accounts');
    }
};
