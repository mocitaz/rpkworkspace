import type { ReactNode } from 'react';

export function EmptyState({
    title,
    description,
    action,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex min-h-36 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-zinc-200/80 bg-zinc-50/50 px-6 py-8 text-center dark:border-zinc-800/80 dark:bg-zinc-900/30">
            <p className="text-[13px] font-medium text-foreground">{title}</p>
            {description && (
                <p className="max-w-md text-xs text-muted-foreground">
                    {description}
                </p>
            )}
            {action && <div className="mt-2.5">{action}</div>}
        </div>
    );
}
