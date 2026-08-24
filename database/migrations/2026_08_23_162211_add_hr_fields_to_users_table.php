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
            $table->string('employee_code')->nullable()->unique()->after('position_title');
            $table->string('department')->nullable()->after('employee_code');
            $table->string('employment_type')->nullable()->after('department');
            $table->string('employment_status')->default('Active')->after('employment_type');
            $table->string('work_mode')->nullable()->after('employment_status');
            $table->date('joined_at')->nullable()->after('work_mode');
            $table->date('contract_end')->nullable()->after('joined_at');
            $table->unsignedSmallInteger('leave_balance')->default(12)->after('contract_end');
            $table->unsignedTinyInteger('utilization')->default(0)->after('leave_balance');
            $table->decimal('performance_score', 2, 1)->default(0)->after('utilization');
            $table->date('next_review')->nullable()->after('performance_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['employee_code']);
            $table->dropColumn([
                'employee_code',
                'department',
                'employment_type',
                'employment_status',
                'work_mode',
                'joined_at',
                'contract_end',
                'leave_balance',
                'utilization',
                'performance_score',
                'next_review',
            ]);
        });
    }
};
