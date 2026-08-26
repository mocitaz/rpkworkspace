import React from 'react';
import { usePermission } from '@/hooks/use-permission';
import type { AppPermission } from '@/types/permissions';

export function Can({
    permission,
    any,
    role,
    fallback = null,
    children,
}: {
    permission?: AppPermission | AppPermission[];
    any?: AppPermission[];
    role?: string | string[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
}) {
    const { can, canAny, hasRole } = usePermission();

    if (role && !hasRole(role)) {
        return <>{fallback}</>;
    }

    if (any && !canAny(any)) {
        return <>{fallback}</>;
    }

    if (permission && !can(permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
