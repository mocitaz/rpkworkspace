<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;

class RoleController extends Controller
{
    public function update(UpdateRoleRequest $request, Role $role, AuditService $audit): RedirectResponse
    {
        $permissionIds = $request->validated('permission_ids');

        if ($role->slug === 'administrator') {
            $administratorPermissionId = Permission::query()->where('name', 'admin.users.manage')->value('id');

            if (is_int($administratorPermissionId)) {
                $permissionIds[] = $administratorPermissionId;
            }
        }

        $permissionIds = array_values(array_unique(array_map('intval', $permissionIds)));
        $role->permissions()->sync($permissionIds);
        $audit->record($role, 'role.permissions_updated', ['permission_ids' => $permissionIds], $request->user(), $request);

        return back()->with('success', 'Izin role diperbarui.');
    }
}
