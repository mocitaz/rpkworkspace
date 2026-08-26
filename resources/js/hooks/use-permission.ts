import { usePage } from '@inertiajs/react';
import type { Auth } from '@/types/auth';
import type { AppPermission } from '@/types/permissions';

export function usePermission() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const permissions = new Set<string>(auth?.permissions ?? []);

    const can = (permission?: AppPermission | AppPermission[]): boolean => {
        if (!auth?.user) return false;
        if (!permission) return true;

        if (Array.isArray(permission)) {
            return permission.every((p) => permissions.has(p));
        }
        return permissions.has(permission);
    };

    const canAny = (permissionList?: AppPermission[]): boolean => {
        if (!auth?.user) return false;
        if (!permissionList || permissionList.length === 0) return true;

        return permissionList.some((p) => permissions.has(p));
    };

    const hasRole = (roleSlug: string | string[]): boolean => {
        if (!auth?.user) return false;
        const userRoles = Array.isArray(auth.user.roles)
            ? (auth.user.roles as Array<{ slug?: string; name?: string }>).map(
                  (r) => r.slug ?? r.name ?? '',
              )
            : [];

        if (Array.isArray(roleSlug)) {
            return roleSlug.some((slug) => userRoles.includes(slug));
        }
        return userRoles.includes(roleSlug);
    };

    const isAdmin = (): boolean => {
        return (
            hasRole(['administrator', 'managing-partner']) ||
            permissions.has('admin.users.manage')
        );
    };

    return {
        can,
        canAny,
        hasRole,
        isAdmin,
        permissions: auth?.permissions ?? [],
        user: auth?.user,
    };
}
