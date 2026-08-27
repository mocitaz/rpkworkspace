import {
    AlertTriangle,
    CheckCircle2,
    HelpCircle,
    Info,
    Trash2,
} from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

export type ConfirmVariant =
    | 'danger'
    | 'warning'
    | 'primary'
    | 'info'
    | 'destructive'
    | 'default';

export interface ConfirmDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title: string;
    description: string | ReactNode;
    confirmLabel?: string;
    confirmText?: string;
    cancelLabel?: string;
    cancelText?: string;
    variant?: ConfirmVariant;
    processing?: boolean;
    onConfirm: () => void | Promise<void>;
    children?: ReactNode;
}

const variantStyles: Record<
    ConfirmVariant,
    {
        iconBg: string;
        iconText: string;
        iconBorder: string;
        confirmButtonClass: string;
        DefaultIcon: React.ElementType;
    }
> = {
    danger: {
        iconBg: 'bg-rose-50 dark:bg-rose-950/40',
        iconText: 'text-rose-600 dark:text-rose-400',
        iconBorder: 'border-rose-100 dark:border-rose-900/40',
        confirmButtonClass:
            'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] shadow-2xs dark:bg-rose-600 dark:hover:bg-rose-500',
        DefaultIcon: Trash2,
    },
    destructive: {
        iconBg: 'bg-rose-50 dark:bg-rose-950/40',
        iconText: 'text-rose-600 dark:text-rose-400',
        iconBorder: 'border-rose-100 dark:border-rose-900/40',
        confirmButtonClass:
            'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] shadow-2xs dark:bg-rose-600 dark:hover:bg-rose-500',
        DefaultIcon: Trash2,
    },
    warning: {
        iconBg: 'bg-amber-50 dark:bg-amber-950/40',
        iconText: 'text-amber-600 dark:text-amber-400',
        iconBorder: 'border-amber-100 dark:border-amber-900/40',
        confirmButtonClass:
            'bg-amber-600 text-white hover:bg-amber-700 active:scale-[0.98] shadow-2xs dark:bg-amber-600 dark:hover:bg-amber-500',
        DefaultIcon: AlertTriangle,
    },
    primary: {
        iconBg: 'bg-blue-50 dark:bg-blue-950/40',
        iconText: 'text-blue-600 dark:text-blue-400',
        iconBorder: 'border-blue-100 dark:border-blue-900/40',
        confirmButtonClass:
            'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-2xs dark:bg-blue-600 dark:hover:bg-blue-500',
        DefaultIcon: CheckCircle2,
    },
    default: {
        iconBg: 'bg-blue-50 dark:bg-blue-950/40',
        iconText: 'text-blue-600 dark:text-blue-400',
        iconBorder: 'border-blue-100 dark:border-blue-900/40',
        confirmButtonClass:
            'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-2xs dark:bg-blue-600 dark:hover:bg-blue-500',
        DefaultIcon: CheckCircle2,
    },
    info: {
        iconBg: 'bg-slate-50 dark:bg-zinc-800',
        iconText: 'text-slate-700 dark:text-zinc-300',
        iconBorder: 'border-slate-200 dark:border-white/10',
        confirmButtonClass:
            'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] shadow-2xs dark:bg-white dark:text-slate-900 dark:hover:bg-zinc-100',
        DefaultIcon: Info,
    },
};

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    confirmText,
    cancelLabel,
    cancelText,
    variant = 'danger',
    processing = false,
    onConfirm,
    children,
}: ConfirmDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const effectiveOpen = isControlled ? open : internalOpen;
    const setEffectiveOpen = (val: boolean) => {
        if (!processing) {
            if (isControlled) {
                onOpenChange?.(val);
            } else {
                setInternalOpen(val);
            }
        }
    };

    const config = (variant && variantStyles[variant]) || variantStyles.danger;
    const Icon = config?.DefaultIcon || Trash2;
    const finalConfirmLabel = confirmLabel || confirmText || 'Konfirmasi';
    const finalCancelLabel = cancelLabel || cancelText || 'Batal';

    const handleConfirm = async () => {
        await onConfirm();
        if (!isControlled) {
            setInternalOpen(false);
        }
    };

    return (
        <>
            {!isControlled && children && (
                <span onClick={() => setEffectiveOpen(true)} className="inline-block cursor-pointer">
                    {children}
                </span>
            )}
            <Dialog open={effectiveOpen} onOpenChange={setEffectiveOpen}>
                <DialogContent className="max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                    <div className="border-b border-slate-100 bg-slate-50/60 p-5 dark:border-white/5 dark:bg-zinc-900/40">
                        <DialogHeader>
                            <div className="flex items-start gap-3">
                                <div
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${config.iconBorder} ${config.iconBg} ${config.iconText}`}
                                >
                                    <Icon className="size-5" />
                                </div>
                                <div className="space-y-1 text-left">
                                    <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                        {title}
                                    </DialogTitle>
                                    <DialogDescription className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                                        {description}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    {isControlled && children && <div className="p-5">{children}</div>}

                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-zinc-900/30">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={processing}
                            onClick={() => setEffectiveOpen(false)}
                            className="h-9 rounded-xl border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                            {finalCancelLabel}
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={processing}
                            onClick={handleConfirm}
                            className={`h-9 rounded-xl px-4 text-xs font-bold transition-all shadow-2xs ${config.confirmButtonClass}`}
                        >
                            {processing ? (
                                <>
                                    <Spinner className="mr-1.5 size-3.5" />
                                    Memproses...
                                </>
                            ) : (
                                finalConfirmLabel
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
