import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDownLeft,
    ArrowUpRight,
    ChevronDown,
    Loader2,
    Shield,
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

export function CreateClientTrustDialog({
    open,
    onOpenChange,
    clients,
    matters,
    trustAccounts,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clients: { id: string; display_name: string }[];
    matters: { id: string; matter_number: string; title: string }[];
    trustAccounts: { id: string; name: string; current_balance: number }[];
}) {
    const form = useForm({
        client_id: '',
        matter_id: '',
        account_id: trustAccounts[0]?.id || '',
        type: 'deposit_in',
        amount: 0,
        transaction_date: new Date().toISOString().slice(0, 10),
        notes: '',
        proof: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/finance/client-trust-funds', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                            <Shield className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                Catat Mutasi Dana Titipan Klien (Escrow)
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Catat penerimaan panjar perkara atau pengeluaran biaya resmi pengadilan.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 pt-1 text-xs">
                    {/* Transaction Direction Selection */}
                    <div>
                        <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                            Arah Mutasi Dana *
                        </Label>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => form.setData('type', 'deposit_in')}
                                className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                                    form.data.type === 'deposit_in'
                                        ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500 dark:border-emerald-500 dark:bg-emerald-950/30'
                                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#16181f]'
                                }`}
                            >
                                <div className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
                                    form.data.type === 'deposit_in'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50'
                                }`}>
                                    <ArrowDownLeft className="size-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                        Penerimaan Titipan (+)
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate">
                                        Setoran panjar klien
                                    </p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => form.setData('type', 'disbursement_out')}
                                className={`flex items-center gap-2 rounded-lg border p-2 text-left transition-all ${
                                    form.data.type === 'disbursement_out'
                                        ? 'border-rose-500 bg-rose-50/50 ring-1 ring-rose-500 dark:border-rose-500 dark:bg-rose-950/30'
                                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#16181f]'
                                }`}
                            >
                                <div className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
                                    form.data.type === 'disbursement_out'
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50'
                                }`}>
                                    <ArrowUpRight className="size-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                        Pengeluaran Titipan (-)
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate">
                                        Biaya resmi / pihak ke-3
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Parties & Matter Card */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="ctf_client" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Klien Pemilik Dana *
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        id="ctf_client"
                                        required
                                        value={form.data.client_id}
                                        onChange={(e) => form.setData('client_id', e.target.value)}
                                        className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-900 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/30 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="">-- Pilih Klien --</option>
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.display_name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="ctf_acc" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Rekening Titipan (Escrow) *
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        id="ctf_acc"
                                        required
                                        value={form.data.account_id}
                                        onChange={(e) => form.setData('account_id', e.target.value)}
                                        className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-900 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/30 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    >
                                        <option value="">-- Pilih Rekening --</option>
                                        {trustAccounts.map((a) => (
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
                            <Label htmlFor="ctf_matter" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Perkara Terkait (Opsional)
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="ctf_matter"
                                    value={form.data.matter_id}
                                    onChange={(e) => form.setData('matter_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-900 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/30 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                >
                                    <option value="">-- Non-Perkara / Titipan Umum --</option>
                                    {matters.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.matter_number} - {m.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Financial Amount & Date */}
                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="ctf_amount" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Nominal Mutasi (IDR) *
                            </Label>
                            <MoneyInput
                                id="ctf_amount"
                                required
                                value={form.data.amount}
                                onValueChange={(val) => form.setData('amount', val)}
                                className="mt-1 h-8.5 rounded-lg font-mono text-xs font-semibold"
                            />
                        </div>
                        <div>
                            <Label htmlFor="ctf_date" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Tanggal Transaksi *
                            </Label>
                            <Input
                                id="ctf_date"
                                type="date"
                                required
                                value={form.data.transaction_date}
                                onChange={(e) => form.setData('transaction_date', e.target.value)}
                                className="mt-1 h-8.5 rounded-lg text-xs"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="ctf_notes" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                            Keterangan / Tujuan Titipan
                        </Label>
                        <Input
                            id="ctf_notes"
                            placeholder="cth: Panjar biaya saksi ahli / pendaftaran kasasi"
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            className="mt-1 h-8.5 rounded-lg text-xs"
                        />
                    </div>

                    {/* Proof File Input */}
                    <div>
                        <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                            Bukti Setoran / Kuitansi (Opsional)
                        </Label>
                        <div className="mt-1">
                            <FileInput
                                accept="application/pdf,image/png,image/jpeg,image/webp"
                                buttonText="Pilih Berkas"
                                placeholder="Unggah bukti setoran / kuitansi..."
                                onFileSelect={(file) => form.setData('proof', file)}
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

                    <DialogFooter className="border-t border-slate-100 pt-3 dark:border-white/[0.06] flex items-center justify-between sm:justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <ShieldCheck className="size-3.5 text-cyan-600 dark:text-cyan-400" />
                            <span>Dana titipan diisolasi terpisah dari kas firma</span>
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
                                className="h-8.5 rounded-lg bg-cyan-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700 gap-1.5"
                            >
                                {form.processing ? (
                                    <>
                                        <Loader2 className="size-3.5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Shield className="size-3.5" />
                                        Simpan Mutasi
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
