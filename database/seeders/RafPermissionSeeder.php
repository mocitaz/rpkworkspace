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
            Permission::query()->updateOrCreate(
                ['name' => $name],
                ['description' => Str::headline(str_replace('.', ' ', $name))],
            );
        }

        $approvalPermissionId = Permission::query()->where('name', 'conflict.approve')->value('id');
        if ($approvalPermissionId !== null) {
            Role::query()->whereIn('slug', ['administrator', 'managing-partner', 'partner'])
                ->get()
                ->each(fn (Role $role) => $role->permissions()->syncWithoutDetaching([$approvalPermissionId]));
        }
    }
}
