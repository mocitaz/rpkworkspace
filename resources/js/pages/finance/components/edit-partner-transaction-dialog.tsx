import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    ChevronDown,
    HandCoins,
    Info,
    Loader2,
    Save,
    Trash2,
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
import UserPicker, { type UserOption } from '@/components/user-picker';
import { formatMoney } from '@/lib/format';
import type { PartnerTransactionItem } from './partner-advances-view';

const TYPE_IMPACTS: Record<string, { label: string; impact: string }> = {
    advance_incurred: {
        label: 'Talangan Pribadi',
        impact: 'Partner menalangi biaya perkara/kantor. Saldo utang kantor ke partner BERTAMBAH (+).',
    },
    advance_reimbursed: {
        label: 'Pengembalian Talangan',
        impact: 'Kantor membayar kembali talangan ke partner. Saldo utang kantor ke partner BERKURANG (-).',
    },
    profit_distribution: {
        label: 'Pembagian Keuntungan',
        impact: 'Pencairan deviden/profit share partner dari rekening kas operasional kantor.',
    },
    capital_injection: {
        label: 'Setoran Modal Partner',
        impact: 'Penyetoran modal tambahan dari partner ke kas firma. Saldo kas bertambah (+).',
    },
    draw_prive: {
        label: 'Penarikan Prive Partner',
        impact: 'Pengambilan dana pribadi/prive oleh partner dari kas kantor. Saldo kas berkurang (-).',
    },
};

export function EditPartnerTransactionDialog({
    open,
    onOpenChange,
    transaction,
    partners,
    matters,
    accounts,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: PartnerTransactionItem | null;
    partners: UserOption[];
    matters: { id: string; matter_number: string; title: string }[];
    accounts: { id: string; name: string }[];
}) {
    const [data, setData] = useState({
        partner_id: '',
        type: 'advance_incurred',
        amount: 0,
        transaction_date: '',
        matter_id: '',
        account_id: '',
        notes: '',
        proof: null as File | null,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (transaction) {
            setData({
                partner_id:
                    transaction.partner?.id?.toString() ||
                    partners[0]?.id?.toString() ||
                    '',
                type: transaction.type || 'advance_incurred',
                amount: transaction.amount || 0,
                transaction_date: transaction.transaction_date
                    ? transaction.transaction_date.substring(0, 10)
                    : new Date().toISOString().split('T')[0],
                matter_id: transaction.matter?.id || '',
                account_id: transaction.account?.id || '',
                notes: transaction.notes || '',
                proof: null,
            });
            setErrors({});
        }
    }, [transaction, open]);

    if (!transaction) return null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('partner_id', data.partner_id);
        formData.append('type', data.type);
        formData.append('amount', data.amount.toString());
        formData.append('transaction_date', data.transaction_date);
        if (data.matter_id) formData.append('matter_id', data.matter_id);
        if (data.account_id) formData.append('account_id', data.account_id);
        if (data.notes) formData.append('notes', data.notes);
        if (data.proof) formData.append('proof', data.proof);

        router.post(`/finance/partner-transactions/${transaction.id}`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                onOpenChange(false);
            },
            onError: (err) => {
                setProcessing(false);
                setErrors(err);
            },
        });
    };

    const handleDelete = () => {
        if (confirm(`Apakah Anda yakin ingin menghapus transaksi partner ${transaction.transaction_number} (${formatMoney(transaction.amount, 'IDR')})? Saldo kas dan utang partner akan disesuaikan otomatis.`)) {
            setProcessing(true);
            router.delete(`/finance/partner-transactions/${transaction.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    onOpenChange(false);
                },
                onError: () => {
                    setProcessing(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <HandCoins className="size-4.5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                    Edit Transaksi &amp; Talangan Partner
                                </DialogTitle>
                                <span className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                    {transaction.transaction_number}
                                </span>
                            </div>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Perbarui rincian nominal talangan, rekening kas, atau perkaranya.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 pt-1 text-xs">
                    {/* Partner & Type Card */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Partner Terkait <span className="text-rose-500">*</span>
                                </Label>
                                <div className="mt-1">
                                    <UserPicker
                                        id="edit_partner_id"
                                        value={data.partner_id}
                                        onChange={(val) => setData({ ...data, partner_id: val })}
                                        users={partners}
                                        placeholder="Pilih Partner..."
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Jenis Transaksi <span className="text-rose-500">*</span>
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData({ ...data, type: e.target.value })}
                                        required
                                        className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="advance_incurred">Talangan Pribadi (+ Utang Kantor)</option>
                                        <option value="advance_reimbursed">Pengembalian Talangan (- Utang)</option>
                                        <option value="profit_distribution">Pembagian Keuntungan / Deviden</option>
                                        <option value="capital_injection">Setoran Modal Partner</option>
                                        <option value="draw_prive">Penarikan Prive / Modal</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        {/* Live Accounting Impact Banner */}
                        {TYPE_IMPACTS[data.type] && (
                            <div className="flex items-start gap-2 rounded-lg border border-amber-200/80 bg-amber-50/70 p-2 text-[11px] text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
                                <Info className="size-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                                <div>
                                    <span className="font-semibold">{TYPE_IMPACTS[data.type].label}:</span>{' '}
                                    <span>{TYPE_IMPACTS[data.type].impact}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Nominal & Date */}
                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div>
                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Nominal Transaksi (IDR) <span className="text-rose-500">*</span>
                            </Label>
                            <MoneyInput
                                required
                                value={data.amount}
                                onValueChange={(val) => setData({ ...data, amount: val })}
                                placeholder="0"
                                className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white font-mono text-xs font-semibold text-slate-900 dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Tanggal Transaksi <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                type="date"
                                required
                                value={data.transaction_date}
                                onChange={(e) => setData({ ...data, transaction_date: e.target.value })}
                                className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                            />
                        </div>
                    </div>

                    {/* Allocations & Accounts */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Terkait Perkara (Matter)
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        value={data.matter_id}
                                        onChange={(e) => setData({ ...data, matter_id: e.target.value })}
                                        className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-900 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="">-- Non-Perkara / Umum --</option>
                                        {matters.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.matter_number} — {m.title}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Rekening Kas Terlibat
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        value={data.account_id}
                                        onChange={(e) => setData({ ...data, account_id: e.target.value })}
                                        className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-900 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="">-- Tanpa Kas / Talangan Langsung --</option>
                                        {accounts.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Catatan / Keperluan Transaksi
                            </Label>
                            <Input
                                type="text"
                                value={data.notes}
                                onChange={(e) => setData({ ...data, notes: e.target.value })}
                                placeholder="cth: Talangan akomodasi persidangan PN Surabaya..."
                                className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                            />
                        </div>

                        <div>
                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Ganti / Unggah Bukti Transaksi (Opsional)
                            </Label>
                            <div className="mt-1">
                                <FileInput
                                    name="proof"
                                    accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
                                    buttonText="Pilih Berkas"
                                    placeholder="Unggah bukti baru..."
                                    onFileSelect={(file) => setData({ ...data, proof: file })}
                                />
                            </div>
                        </div>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-xl border border-rose-200/80 bg-rose-50/70 p-2.5 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                            <div className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-400">
                                <AlertCircle className="size-3.5 shrink-0" />
                                <span>Terdapat kesalahan validasi:</span>
                            </div>
                            <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-[11px]">
                                {Object.values(errors).map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <DialogFooter className="border-t border-slate-100 pt-3 dark:border-white/[0.06] flex flex-row items-center justify-between sm:justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            disabled={processing}
                            className="h-8.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 gap-1.5"
                        >
                            <Trash2 className="size-3.5" />
                            Hapus Transaksi
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                disabled={processing}
                                className="h-8.5 rounded-lg text-xs font-semibold"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-8.5 rounded-lg bg-amber-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 gap-1.5"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="size-3.5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-3.5" />
                                        Simpan Perubahan
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
