import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const labels: Record<string, string> = {
    active: 'Aktif',
    prospective: 'Prospektif',
    on_hold: 'Ditunda',
    closed: 'Ditutup',
    archived: 'Diarsipkan',
    todo: 'Belum Dimulai',
    in_progress: 'Dikerjakan',
    waiting: 'Menunggu',
    review: 'Menunggu Review',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    draft: 'Draf',
    under_review: 'Dalam Review',
    revision_requested: 'Perlu Revisi',
    approved: 'Disetujui',
    final: 'Final',
    signed: 'Ditandatangani',
    low: 'Rendah',
    normal: 'Normal',
    high: 'Tinggi',
    critical: 'Kritis',
    open: 'Terbuka',
    standard: 'Standar',
    confidential: 'Rahasia',
    restricted: 'Terbatas',
};

export function StatusBadge({
    value,
    className,
}: {
    value: string;
    className?: string;
}) {
    const isCritical = ['critical', 'restricted'].includes(value);
    const isWarning = ['high', 'confidential', 'revision_requested', 'under_review'].includes(value);
    const isSuccess = ['active', 'completed', 'approved', 'signed'].includes(value);
    const isInfo = ['in_progress', 'review'].includes(value);

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight shadow-xs',
                isCritical &&
                    'border-red-200/80 bg-red-50/80 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300',
                isWarning &&
                    'border-amber-200/80 bg-amber-50/80 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300',
                isSuccess &&
                    'border-emerald-200/80 bg-emerald-50/80 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300',
                isInfo &&
                    'border-blue-200/80 bg-blue-50/80 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300',
                !isCritical && !isWarning && !isSuccess && !isInfo &&
                    'border-zinc-200/80 bg-zinc-100/70 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300',
                className,
            )}
        >
            <span
                className={cn(
                    'size-1.5 rounded-full shrink-0',
                    isCritical && 'bg-red-500',
                    isWarning && 'bg-amber-500',
                    isSuccess && 'bg-emerald-500',
                    isInfo && 'bg-blue-500',
                    !isCritical && !isWarning && !isSuccess && !isInfo && 'bg-muted-foreground/40'
                )}
            />
            {labels[value] ?? value}
        </span>
    );
}
