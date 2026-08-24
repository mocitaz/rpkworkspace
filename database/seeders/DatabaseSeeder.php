<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the operational workspace with exactly 4 official RPK Law Firm accounts.
     */
    public function run(): void
    {
        $this->call(RafPermissionSeeder::class);

        $users = [
            [
                'name' => 'Muhamad Fajar Roni, S.H.',
                'email' => 'fajarroni@rpklawoffice.com',
                'position_title' => 'Managing Partner',
                'employee_code' => 'RPK-EMP-001',
                'department' => 'Executive & Strategic Litigation',
                'employment_type' => 'Permanent',
                'employment_status' => 'Active',
                'work_mode' => 'Hybrid',
                'joined_at' => now()->subYears(5)->startOfYear()->addDays(14)->toDateString(),
                'contract_end' => null,
                'leave_balance' => 14,
                'utilization' => 92,
                'performance_score' => 4.9,
                'next_review' => now()->addMonths(4)->toDateString(),
                'roles' => ['administrator', 'managing-partner', 'partner'],
            ],
            [
                'name' => 'M. Anggara Putra, S.H., M.H.',
                'email' => 'anggaraputra@rpklawoffice.com',
                'position_title' => 'Partner (Commercial Litigation & Arbitration)',
                'employee_code' => 'RPK-EMP-002',
                'department' => 'Dispute Resolution',
                'employment_type' => 'Permanent',
                'employment_status' => 'Active',
                'work_mode' => 'On-site',
                'joined_at' => now()->subYears(4)->startOfYear()->addMonths(2)->toDateString(),
                'contract_end' => null,
                'leave_balance' => 12,
                'utilization' => 95,
                'performance_score' => 4.8,
                'next_review' => now()->addMonths(4)->toDateString(),
                'roles' => ['partner', 'associate'],
            ],
            [
                'name' => 'Reza Evaldo Kusumah, S.H.',
                'email' => 'rezakusumah@rpklawoffice.com',
                'position_title' => 'Partner (Corporate, M&A & Energy)',
                'employee_code' => 'RPK-EMP-003',
                'department' => 'Corporate & Transactional',
                'employment_type' => 'Permanent',
                'employment_status' => 'Active',
                'work_mode' => 'Hybrid',
                'joined_at' => now()->subYears(4)->startOfYear()->addMonths(5)->toDateString(),
                'contract_end' => null,
                'leave_balance' => 15,
                'utilization' => 88,
                'performance_score' => 4.8,
                'next_review' => now()->addMonths(4)->toDateString(),
                'roles' => ['partner', 'associate'],
            ],
            [
                'name' => 'RPK Administrator',
                'email' => 'contact@rpklawoffice.com',
                'position_title' => 'Head of Legal Operations & Practice Management',
                'employee_code' => 'RPK-EMP-004',
                'department' => 'Firm Administration & Finance',
                'employment_type' => 'Permanent',
                'employment_status' => 'Active',
                'work_mode' => 'On-site',
                'joined_at' => now()->subYears(3)->startOfYear()->addMonths(7)->toDateString(),
                'contract_end' => null,
                'leave_balance' => 18,
                'utilization' => 82,
                'performance_score' => 4.7,
                'next_review' => now()->addMonths(4)->toDateString(),
                'roles' => ['administrator', 'finance', 'paralegal'],
            ],
        ];

        foreach ($users as $userData) {
            $user = User::query()->firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make('password'),
                    'position_title' => $userData['position_title'],
                    'employee_code' => $userData['employee_code'],
                    'department' => $userData['department'],
                    'employment_type' => $userData['employment_type'],
                    'employment_status' => $userData['employment_status'],
                    'work_mode' => $userData['work_mode'],
                    'joined_at' => $userData['joined_at'],
                    'contract_end' => $userData['contract_end'],
                    'leave_balance' => $userData['leave_balance'],
                    'utilization' => $userData['utilization'],
                    'performance_score' => $userData['performance_score'],
                    'next_review' => $userData['next_review'],
                    'is_active' => true,
                    'locale' => 'id',
                    'timezone' => 'Asia/Jakarta',
                    'email_verified_at' => now(),
                ],
            );

            // Update fields if user already existed
            $user->update([
                'name' => $userData['name'],
                'position_title' => $userData['position_title'],
                'employee_code' => $userData['employee_code'],
                'department' => $userData['department'],
                'employment_type' => $userData['employment_type'],
                'employment_status' => $userData['employment_status'],
                'work_mode' => $userData['work_mode'],
                'joined_at' => $userData['joined_at'],
                'contract_end' => $userData['contract_end'],
                'leave_balance' => $userData['leave_balance'],
                'utilization' => $userData['utilization'],
                'performance_score' => $userData['performance_score'],
                'next_review' => $userData['next_review'],
                'is_active' => true,
            ]);

            $roleIds = Role::query()->whereIn('slug', $userData['roles'])->pluck('id');
            $user->roles()->sync($roleIds);
        }

        $this->call(RafWorkspaceDemoSeeder::class);
    }
}
