import type { ReactNode } from 'react';

export function PageHeader({
    title,
    description,
    actions,
}: {
    title: string;
    description?: string;
    actions?: ReactNode;
}) {
    return (
        <div className="flex flex-col justify-between gap-5 border-b border-border/80 pb-7 sm:flex-row sm:items-end">
            <div className="space-y-2">
                <p className="eyebrow">RPK Law Firm Workspace</p>
                <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground">
                    {title}
                </h1>
                {description && (
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}
