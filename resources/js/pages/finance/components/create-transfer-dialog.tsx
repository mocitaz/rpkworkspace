import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    ArrowRightLeft,
    ChevronDown,
    Loader2,
    ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import { Label } from '@/components/ui/label';
import { formatMoney } from '@/lib/format';
import { financeDialogPanelClass } from './finance-dialog-design';

export function CreateTransferDialog({
    open,
    onOpenChange,
    accounts,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accounts: {
        id: string;
        name: string;
        current_balance: number;
        currency?: string;
    }[];
}) {
    const form = useForm({
        from_account_id: accounts[0]?.id || '',
        to_account_id: accounts[1]?.id || '',
        amount: 0,
        transferred_at: new Date().toISOString().split('T')[0],
        reference_number: '',
        notes: '',
        proof: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/finance/transfers', {
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    const sourceAccount = accounts.find(
        (a) => a.id === form.data.from_account_id,
    );
    const destAccount = accounts.find((a) => a.id === form.data.to_account_id);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={financeDialogPanelClass('default')}>
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                            <ArrowRightLeft className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                                Transfer Antar Rekening Kas / Bank
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Catat pemindahan dana internal antar pos
                                rekening atau kas kecil.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 pt-1 text-xs">
                    {/* Source & Destination Account Card */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            <div>
                                <Label
                                    htmlFor="from_acc"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                >
                                    Akun Asal (Pengirim) *
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        id="from_acc"
                                        required
                                        value={form.data.from_account_id}
                                        onChange={(e) =>
                                            form.setData(
                                                'from_account_id',
                                                e.target.value,
                                            )
                                        }
                                        className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600/30 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="">
                                            -- Pilih Akun Asal --
                                        </option>
                                        {accounts.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                </div>
                                {sourceAccount && (
                                    <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                        Saldo:{' '}
                                        <span className="font-mono font-semibold text-slate-700 dark:text-zinc-200">
                                            IDR{' '}
                                            {formatMoney(
                                                sourceAccount.current_balance,
                                            )}
                                        </span>
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    htmlFor="to_acc"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                >
                                    Akun Tujuan (Penerima) *
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        id="to_acc"
                                        required
                                        value={form.data.to_account_id}
                                        onChange={(e) =>
                                            form.setData(
                                                'to_account_id',
                                                e.target.value,
                                            )
                                        }
                                        className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600/30 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="">
                                            -- Pilih Akun Tujuan --
                                        </option>
                                        {accounts.map((a) => (
                                            <option
                                                key={a.id}
                                                value={a.id}
                                                disabled={
                                                    a.id ===
                                                    form.data.from_account_id
                                                }
                                            >
                                                {a.name}{' '}
                                                {a.id ===
                                                form.data.from_account_id
                                                    ? '(Sama)'
                                                    : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                </div>
                                {destAccount && (
                                    <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                        Saldo:{' '}
                                        <span className="font-mono font-semibold text-slate-700 dark:text-zinc-200">
                                            IDR{' '}
                                            {formatMoney(
                                                destAccount.current_balance,
                                            )}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Nominal & Date */}
                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div>
                            <Label
                                htmlFor="trf_amount"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Nominal Mutasi (IDR) *
                            </Label>
                            <MoneyInput
                                id="trf_amount"
                                required
                                value={form.data.amount}
                                onValueChange={(val) =>
                                    form.setData('amount', val)
                                }
                                className="mt-1 h-8.5 rounded-lg font-mono text-xs font-semibold"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="trf_date"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Tanggal Transfer *
                            </Label>
                            <Input
                                id="trf_date"
                                type="date"
                                required
                                value={form.data.transferred_at}
                                onChange={(e) =>
                                    form.setData(
                                        'transferred_at',
                                        e.target.value,
                                    )
                                }
                                className="mt-1 h-8.5 rounded-lg text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div>
                            <Label
                                htmlFor="trf_ref"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                No. Referensi Bank (Opsional)
                            </Label>
                            <Input
                                id="trf_ref"
                                placeholder="cth: REF-TRF-2026-0881"
                                value={form.data.reference_number}
                                onChange={(e) =>
                                    form.setData(
                                        'reference_number',
                                        e.target.value,
                                    )
                                }
                                className="mt-1 h-8.5 rounded-lg font-mono text-xs"
                            />
                        </div>
                        <div>
                            <Label
                                htmlFor="trf_notes"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Catatan / Keterangan
                            </Label>
                            <Input
                                id="trf_notes"
                                placeholder="cth: Pengisian dana petty cash kantor"
                                value={form.data.notes}
                                onChange={(e) =>
                                    form.setData('notes', e.target.value)
                                }
                                className="mt-1 h-8.5 rounded-lg text-xs"
                            />
                        </div>
                    </div>

                    {/* Proof Upload */}
                    <div>
                        <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                            Bukti Transfer / Mutasi Rekening (Opsional)
                        </Label>
                        <div className="mt-1">
                            <FileInput
                                name="proof"
                                accept="application/pdf,image/png,image/jpeg,image/webp"
                                buttonText="Pilih Berkas"
                                placeholder="Unggah struk / bukti transfer..."
                                onFileSelect={(file) =>
                                    form.setData('proof', file)
                                }
                            />
                        </div>
                    </div>

                    {Object.keys(form.errors).length > 0 && (
                        <div className="rounded-xl border border-rose-200/80 bg-rose-50/70 p-2.5 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                            <div className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-400">
                                <AlertCircle className="size-3.5 shrink-0" />
                                <span>Terdapat kesalahan validasi:</span>
                            </div>
                            <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-[11px]">
                                {Object.values(form.errors).map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <DialogFooter className="flex items-center justify-between border-t border-slate-100 pt-3 sm:justify-between dark:border-white/[0.06]">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
                            <span>Saldo kedua akun terupdate otomatis</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenChange(false)}
                                className="h-8.5 rounded-lg text-xs font-semibold"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={form.processing}
                                className="h-8.5 gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                {form.processing ? (
                                    <>
                                        <Loader2 className="size-3.5 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <ArrowRightLeft className="size-3.5" />
                                        Simpan Transfer
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
