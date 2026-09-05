import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRightLeft,
    CheckCircle2,
    ChevronDown,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { formatMoney } from '@/lib/format';
import type { FinancialAccountItem } from './accounts-view';
import { financeDialogPanelClass } from './finance-dialog-design';
import {
    FinanceDialogErrors,
    FinanceDialogHeader,
} from './finance-dialog-ui';

export function DeleteAccountDialog({
    account,
    allAccounts,
    open,
    onOpenChange,
}: {
    account: FinancialAccountItem | null;
    allAccounts: FinancialAccountItem[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const availableAccounts = allAccounts.filter(
        (a) => account && a.id !== account.id,
    );

    const [mode, setMode] = useState<'transfer' | 'direct_delete'>('transfer');
    const [targetAccountId, setTargetAccountId] = useState<string>(
        availableAccounts[0]?.id || '',
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!account) {
        return null;
    }

    const selectedTarget = availableAccounts.find(
        (a) => a.id === targetAccountId,
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsDeleting(true);
        setErrors({});

        router.delete(`/finance/accounts/${account.id}`, {
            data: {
                mode,
                target_account_id: mode === 'transfer' ? targetAccountId : null,
            },
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleting(false);
                onOpenChange(false);
            },
            onError: (err) => {
                setIsDeleting(false);
                setErrors(err);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={financeDialogPanelClass('default')}>
                {/* Header matching CreateAccountDialog */}
                <FinanceDialogHeader
                    icon={Trash2}
                    tone="danger"
                    eyebrow="Kas & Bank"
                    title="Hapus Rekening Kas & Bank"
                    description="Pilih penanganan saldo dan riwayat transaksi rekening yang akan dihapus."
                />

                {/* Form & Content matching CreateAccountDialog */}
                <form onSubmit={handleSubmit} className="space-y-3.5 pt-1 text-xs">
                    <FinanceDialogErrors errors={errors} />

                    {/* Account Summary Card */}
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                    {account.name}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                                    {account.type}
                                </span>
                            </div>
                            <p className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                {account.bank_name || 'Kas Kantor'}
                                {account.account_number
                                    ? ` — ${account.account_number}`
                                    : ''}
                            </p>
                        </div>
                        <div className="shrink-0 text-right">
                            <span className="block text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                Saldo Saat Ini
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                {formatMoney(account.current_balance, 'IDR')}
                            </span>
                        </div>
                    </div>

                    {/* Action Selection (Option Cards styled identically to CreateAccountDialog account types) */}
                    <div>
                        <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                            Pilih Metode Penghapusan *
                        </Label>
                        <div className="mt-1 space-y-2">
                            {/* Option 1: Transfer */}
                            <button
                                type="button"
                                onClick={() => setMode('transfer')}
                                className={`w-full rounded-lg border p-2.5 text-left transition-all ${
                                    mode === 'transfer'
                                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-950/30'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 dark:border-white/10 dark:bg-[#16181f]'
                                }`}
                            >
                                <div className="flex items-start gap-2.5">
                                    <div
                                        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md ${
                                            mode === 'transfer'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 text-blue-600 dark:bg-white/10 dark:text-blue-400'
                                        }`}
                                    >
                                        <ArrowRightLeft className="size-3" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p
                                                className={`text-xs font-semibold ${
                                                    mode === 'transfer'
                                                        ? 'text-blue-900 dark:text-blue-200'
                                                        : 'text-slate-800 dark:text-zinc-200'
                                                }`}
                                            >
                                                Pindahkan Saldo & Riwayat Transaksi
                                            </p>
                                            <span className="text-[10px] font-bold tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
                                                Rekomendasi
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-[10px] text-slate-500 dark:text-zinc-400">
                                            Seluruh saldo dan riwayat pencatatan dialihkan ke rekening penampung yang dipilih.
                                        </p>

                                        {mode === 'transfer' && (
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="mt-2.5 border-t border-slate-200/70 pt-2.5 dark:border-white/[0.06]"
                                            >
                                                <Label
                                                    htmlFor="target_account_id"
                                                    className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-zinc-400"
                                                >
                                                    Pilih Rekening Tujuan Penampung *
                                                </Label>
                                                {availableAccounts.length === 0 ? (
                                                    <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                                                        Tidak ada rekening lain. Gunakan opsi hapus langsung di bawah.
                                                    </p>
                                                ) : (
                                                    <div className="relative mt-1">
                                                        <select
                                                            id="target_account_id"
                                                            value={targetAccountId}
                                                            onChange={(e) =>
                                                                setTargetAccountId(
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                        >
                                                            <option value="">
                                                                -- Pilih Rekening Tujuan --
                                                            </option>
                                                            {availableAccounts.map(
                                                                (a) => (
                                                                    <option
                                                                        key={a.id}
                                                                        value={a.id}
                                                                    >
                                                                        {a.name} (Saldo:{' '}
                                                                        {formatMoney(
                                                                            a.current_balance,
                                                                            'IDR',
                                                                        )}
                                                                        )
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                                    </div>
                                                )}

                                                {selectedTarget && (
                                                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-zinc-400">
                                                        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                        <span>Estimasi saldo gabungan:</span>
                                                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                                                            {formatMoney(
                                                                selectedTarget.current_balance +
                                                                    account.current_balance,
                                                                'IDR',
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Option 2: Direct Delete */}
                            <button
                                type="button"
                                onClick={() => setMode('direct_delete')}
                                className={`w-full rounded-lg border p-2.5 text-left transition-all ${
                                    mode === 'direct_delete'
                                        ? 'border-rose-600 bg-rose-50/50 ring-1 ring-rose-600 dark:border-rose-500 dark:bg-rose-950/30'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 dark:border-white/10 dark:bg-[#16181f]'
                                }`}
                            >
                                <div className="flex items-start gap-2.5">
                                    <div
                                        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md ${
                                            mode === 'direct_delete'
                                                ? 'bg-rose-600 text-white'
                                                : 'bg-slate-100 text-rose-600 dark:bg-white/10 dark:text-rose-400'
                                        }`}
                                    >
                                        <Trash2 className="size-3" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p
                                                className={`text-xs font-semibold ${
                                                    mode === 'direct_delete'
                                                        ? 'text-rose-900 dark:text-rose-200'
                                                        : 'text-slate-800 dark:text-zinc-200'
                                                }`}
                                            >
                                                Hapus Langsung Tanpa Pemindahan
                                            </p>
                                            <span className="text-[10px] font-bold tracking-wide text-rose-600 uppercase dark:text-rose-400">
                                                Saldo Dihapus
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-[10px] text-slate-500 dark:text-zinc-400">
                                            Rekening dihapus permanen. Mutasi transfer langsung terkait rekening ini akan dibersihkan.
                                        </p>

                                        {mode === 'direct_delete' && (
                                            <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200/80 bg-amber-50/80 p-2 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                                                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                                                <p className="text-[10px] leading-snug">
                                                    Sisa saldo sebesar{' '}
                                                    <span className="font-mono font-bold">
                                                        {formatMoney(
                                                            account.current_balance,
                                                            'IDR',
                                                        )}
                                                    </span>{' '}
                                                    akan dihapus permanen dari buku kas firma.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Footer with symmetrical corners & balanced vertical padding */}
                    <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6 dark:border-white/[0.06] dark:bg-[#151821]/60">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => onOpenChange(false)}
                            className="h-8 rounded-lg border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={
                                isDeleting ||
                                (mode === 'transfer' &&
                                    (!targetAccountId ||
                                        availableAccounts.length === 0))
                            }
                            className="h-8 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isDeleting
                                ? 'Menghapus...'
                                : mode === 'transfer'
                                  ? 'Pindahkan & Hapus'
                                  : 'Hapus Rekening'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
