export type FinanceDialogWidth = 'compact' | 'default' | 'wide' | 'preview';
export type FinanceDialogToneName =
    'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const widths: Record<FinanceDialogWidth, string> = {
    compact: 'sm:max-w-md',
    default: 'sm:max-w-xl',
    wide: 'sm:max-w-3xl',
    preview: 'sm:max-w-5xl',
};

const tones = {
    primary: {
        icon: 'border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400',
        button: 'bg-blue-600 hover:bg-blue-700',
    },
    success: {
        icon: 'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400',
        button: 'bg-blue-600 hover:bg-blue-700',
    },
    warning: {
        icon: 'border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400',
        button: 'bg-blue-600 hover:bg-blue-700',
    },
    danger: {
        icon: 'border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400',
        button: 'bg-rose-600 hover:bg-rose-700',
    },
    neutral: {
        icon: 'border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-300',
        button: 'bg-blue-600 hover:bg-blue-700',
    },
} satisfies Record<FinanceDialogToneName, { icon: string; button: string }>;

export function financeDialogPanelClass(width: FinanceDialogWidth): string {
    return `flex max-h-[92dvh] flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl ${widths[width]} dark:border-white/10 dark:bg-[#14161b] [&>[data-slot=dialog-header]]:shrink-0 [&>[data-slot=dialog-header]]:bg-slate-50/60 [&>[data-slot=dialog-header]]:px-5 [&>[data-slot=dialog-header]]:py-3.5 [&>[data-slot=dialog-header]]:dark:bg-white/[0.025] [&>[data-slot=dialog-header]>div]:items-start [&>[data-slot=dialog-header]>div]:gap-3.5 [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:flex [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:size-10 [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:shrink-0 [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:items-center [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:justify-center [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:rounded-xl [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:border [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:border-slate-200 [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:bg-slate-100 [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:text-slate-500 [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:shadow-none [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:dark:border-white/10 [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:dark:bg-white/[0.06] [&>[data-slot=dialog-header]>div>div:first-child:not([data-finance-dialog-copy])]:dark:text-zinc-400 [&_[data-slot=dialog-title]]:text-sm [&_[data-slot=dialog-title]]:leading-[18px] [&_[data-slot=dialog-title]]:font-semibold [&_[data-slot=dialog-description]]:mt-0.5 [&_[data-slot=dialog-description]]:max-w-3xl [&_[data-slot=dialog-description]]:text-[11px] [&_[data-slot=dialog-description]]:leading-[18px] [&>form]:min-h-0 [&>form]:flex-1 [&>form]:overflow-y-auto [&>form]:px-5 [&>form]:py-4 sm:[&>[data-slot=dialog-header]]:px-6 sm:[&>form]:px-6 [&_[data-slot=dialog-footer]]:sticky [&_[data-slot=dialog-footer]]:bottom-0 [&_[data-slot=dialog-footer]]:z-10 [&_[data-slot=dialog-footer]]:bg-white/95 [&_[data-slot=dialog-footer]]:pb-1 [&_[data-slot=dialog-footer]]:backdrop-blur-sm [&_[data-slot=dialog-footer]]:dark:bg-[#14161b]/95`;
}

export function financeDialogTone(
    tone: FinanceDialogToneName,
): (typeof tones)[FinanceDialogToneName] {
    return tones[tone];
}

export function financeExcelExportUrl(): string {
    return '/finance/export/excel';
}
