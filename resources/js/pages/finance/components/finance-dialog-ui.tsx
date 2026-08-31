import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { financeDialogTone } from './finance-dialog-design';
import type { FinanceDialogToneName } from './finance-dialog-design';

export function FinanceDialogHeader({
    icon: Icon,
    title,
    description,
    eyebrow,
    actions,
}: {
    icon: LucideIcon;
    title: ReactNode;
    description: ReactNode;
    tone?: FinanceDialogToneName;
    eyebrow?: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <DialogHeader className="shrink-0 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5 text-left sm:px-6 dark:border-white/[0.06] dark:bg-white/[0.025]">
            <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-start gap-x-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                    <Icon className="size-[18px]" />
                </div>
                <div
                    data-finance-dialog-copy
                    className="grid min-w-0 grid-rows-[13px_auto_auto] content-start pr-4"
                >
                    {eyebrow && (
                        <div className="truncate text-[10px] leading-[14px] font-semibold tracking-[0.14em] text-slate-400 uppercase dark:text-zinc-500">
                            {eyebrow}
                        </div>
                    )}
                    <DialogTitle className="mt-0.5 text-sm leading-[18px] font-semibold text-slate-950 dark:text-white">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="mt-0.5 max-w-3xl text-[11px] leading-[18px] text-slate-500 dark:text-zinc-400">
                        {description}
                    </DialogDescription>
                </div>
                {actions && (
                    <div className="mr-6 flex shrink-0 items-center gap-2 self-center">
                        {actions}
                    </div>
                )}
            </div>
        </DialogHeader>
    );
}

export function FinanceDialogBody({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6',
                className,
            )}
        >
            {children}
        </div>
    );
}

export function FinanceDialogSection({
    title,
    description,
    children,
    className,
}: {
    title?: ReactNode;
    description?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={cn(
                'rounded-xl border border-slate-200/80 bg-slate-50/45 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]',
                className,
            )}
        >
            {(title || description) && (
                <div className="mb-3 border-b border-slate-200/70 pb-3 dark:border-white/[0.06]">
                    {title && (
                        <h3 className="text-xs font-semibold text-slate-800 dark:text-zinc-100">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-zinc-400">
                            {description}
                        </p>
                    )}
                </div>
            )}
            {children}
        </section>
    );
}

export function FinanceDialogFooter({
    onCancel,
    processing = false,
    submitLabel,
    processingLabel = 'Menyimpan...',
    tone = 'primary',
    disabled = false,
    children,
}: {
    onCancel: () => void;
    processing?: boolean;
    submitLabel: string;
    processingLabel?: string;
    tone?: FinanceDialogToneName;
    disabled?: boolean;
    children?: ReactNode;
}) {
    return (
        <DialogFooter className="sticky bottom-0 z-10 flex shrink-0 flex-row items-center justify-between gap-3 border-t border-slate-100 bg-white/95 px-5 py-3.5 backdrop-blur-sm sm:px-6 dark:border-white/[0.06] dark:bg-[#14161b]/95">
            <div>{children}</div>
            <div className="ml-auto flex items-center gap-2.5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={processing}
                    className="h-9 rounded-lg px-4 text-xs font-semibold"
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    disabled={processing || disabled}
                    className={cn(
                        'h-9 min-w-32 rounded-lg px-4 text-xs font-semibold text-white shadow-xs',
                        financeDialogTone(tone).button,
                    )}
                >
                    {processing ? processingLabel : submitLabel}
                </Button>
            </div>
        </DialogFooter>
    );
}

export function FinanceDialogErrors({
    errors,
}: {
    errors: Record<string, string>;
}) {
    const messages = [...new Set(Object.values(errors))];

    if (messages.length === 0) {
        return null;
    }

    return (
        <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/25 dark:text-rose-300"
        >
            <p className="font-semibold">Periksa kembali data berikut:</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4">
                {messages.map((message) => (
                    <li key={message}>{message}</li>
                ))}
            </ul>
        </div>
    );
}
