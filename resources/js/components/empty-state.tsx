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
        <div className="flex min-h-36 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-8 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{title}</p>
            {description && (
                <p className="max-w-md text-xs text-slate-500 dark:text-zinc-400">
                    {description}
                </p>
            )}
            {action && <div className="mt-3">{action}</div>}
        </div>
    );
}
