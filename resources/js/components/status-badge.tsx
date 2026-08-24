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
    const isCritical = ['critical', 'restricted', 'cancelled'].includes(value);
    const isWarning = [
        'high',
        'confidential',
        'revision_requested',
        'under_review',
        'waiting',
        'review',
        'todo',
    ].includes(value);
    const isSuccess = ['active', 'completed', 'approved', 'signed'].includes(
        value,
    );
    const isInfo = ['in_progress', 'draft', 'open'].includes(value);

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight whitespace-nowrap transition-colors',
                isCritical &&
                    'border-rose-200/60 bg-rose-50/90 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400',
                isWarning &&
                    'border-amber-200/60 bg-amber-50/90 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-400',
                isSuccess &&
                    'border-emerald-200/60 bg-emerald-50/90 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400',
                isInfo &&
                    'border-blue-200/60 bg-blue-50/90 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-400',
                !isCritical &&
                    !isWarning &&
                    !isSuccess &&
                    !isInfo &&
                    'border-slate-200/70 bg-slate-100/70 text-slate-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300',
                className,
            )}
        >
            <span
                className={cn(
                    'size-1.5 shrink-0 rounded-full',
                    isCritical && 'bg-rose-500',
                    isWarning && 'animate-pulse bg-amber-500',
                    isSuccess && 'bg-emerald-500',
                    isInfo && 'bg-blue-500',
                    !isCritical &&
                        !isWarning &&
                        !isSuccess &&
                        !isInfo &&
                        'bg-slate-400 dark:bg-zinc-500',
                )}
            />
            {labels[value] ?? value}
        </span>
    );
}
