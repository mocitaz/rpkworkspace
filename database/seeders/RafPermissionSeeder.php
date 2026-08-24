<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RafPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [];
        foreach ([
            'matter.view', 'matter.view.all', 'matter.create', 'matter.update', 'matter.archive',
            'client.view', 'client.manage', 'contact.view', 'contact.manage',
            'task.view', 'task.create', 'task.manage',
            'document.view', 'document.upload', 'document.download', 'document.delete', 'document.approve',
            'billing.view', 'billing.manage',
            'expense.view', 'expense.manage',
            'payment.view', 'payment.manage',
            'quotation.view', 'quotation.manage', 'quotation.approve',
            'template.view', 'template.manage',
            'signature.view', 'signature.manage',
            'correspondence.view', 'correspondence.manage',
            'conflict.view', 'conflict.manage', 'conflict.approve',
            'archive.view', 'archive.manage', 'archive.legal_hold.manage',
            'audit.view', 'admin.users.manage',
        ] as $name) {
            $permissions[$name] = Permission::query()->updateOrCreate(
                ['name' => $name],
                ['description' => Str::headline(str_replace('.', ' ', $name))],
            )->getKey();
        }

        $rolesData = [
            'administrator' => [
                'name' => 'Administrator Sistem',
                'description' => 'Akses penuh administrasi sistem, pengguna, tata kelola, dan konfigurasi.',
                'permissions' => array_values($permissions),
            ],
            'managing-partner' => [
                'name' => 'Managing Partner',
                'description' => 'Pimpinan firma dengan kewenangan penuh operasional, persetujuan, dan pengawasan perkara.',
                'permissions' => array_values($permissions),
            ],
            'partner' => [
                'name' => 'Partner',
                'description' => 'Partner penanggung jawab perkara, persetujuan dokumen, dan manajemen klien.',
                'permissions' => array_values(array_filter($permissions, fn ($id, $name) => ! in_array($name, ['admin.users.manage']), ARRAY_FILTER_USE_BOTH)),
            ],
            'associate' => [
                'name' => 'Associate',
                'description' => 'Advokat dan staf hukum pelaksana tugas, riset, dan penyusunan dokumen perkara.',
                'permissions' => array_values(array_filter($permissions, fn ($id, $name) => in_array($name, [
                    'matter.view', 'matter.create', 'matter.update',
                    'client.view', 'contact.view', 'contact.manage',
                    'task.view', 'task.create', 'task.manage',
                    'document.view', 'document.upload', 'document.download',
                    'correspondence.view', 'correspondence.manage',
                    'conflict.view', 'conflict.manage',
                    'template.view', 'signature.view',
                ]), ARRAY_FILTER_USE_BOTH)),
            ],
            'finance' => [
                'name' => 'Finance & Billing Specialist',
                'description' => 'Manajemen penagihan invoice, pembayaran honorarium, dan pencatatan pengeluaran.',
                'permissions' => array_values(array_filter($permissions, fn ($id, $name) => in_array($name, [
                    'matter.view', 'client.view', 'contact.view',
                    'billing.view', 'billing.manage',
                    'expense.view', 'expense.manage',
                    'payment.view', 'payment.manage',
                    'quotation.view', 'quotation.manage',
                    'document.view', 'document.download',
                ]), ARRAY_FILTER_USE_BOTH)),
            ],
        ];

        foreach ($rolesData as $slug => $data) {
            $role = Role::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $data['name'], 'description' => $data['description']],
            );

            $role->permissions()->sync($data['permissions']);
        }
    }
}
