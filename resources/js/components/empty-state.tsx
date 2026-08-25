import type { ElementType, ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({
    icon: Icon = Inbox,
    title,
    description,
    action,
    className = '',
}: {
    icon?: ElementType | ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}) {
    const isIconComponent =
        typeof Icon === 'function' ||
        (typeof Icon === 'object' && Icon !== null && 'render' in Icon);

    return (
        <div
            className={`flex flex-col items-center justify-center px-4 py-10 text-center ${className}`}
        >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 shadow-2xs dark:bg-white/[0.06] dark:text-zinc-300">
                {isIconComponent ? (
                    // @ts-ignore
                    <Icon className="size-5.5 stroke-[1.75]" />
                ) : (
                    Icon
                )}
            </div>
            <h3 className="mt-3.5 text-sm font-bold text-slate-900 dark:text-white">
                {title}
            </h3>
            {description && (
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
