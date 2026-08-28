import { getStatusTextItems } from '@/lib/status-text';
import { cn } from '@/lib/utils';

export function StatusText({
    value,
    className,
}: {
    value: string;
    className?: string;
}) {
    return <StatusTextGroup values={[value]} className={className} />;
}

export function StatusTextGroup({
    values,
    className,
}: {
    values: string[];
    className?: string;
}) {
    return (
        <span
            data-testid="status-text-group"
            className={cn(
                'inline-flex items-center text-[11px] font-semibold tracking-tight whitespace-nowrap',
                className,
            )}
        >
            {getStatusTextItems(values).map((item) => (
                <span key={`${item.value}-${item.label}`} className="contents">
                    {item.hasLeadingSeparator && (
                        <span
                            aria-hidden="true"
                            className="mx-1.5 text-slate-300 dark:text-zinc-600"
                        >
                            |
                        </span>
                    )}
                    <span className={item.colorClass}>{item.label}</span>
                </span>
            ))}
        </span>
    );
}
