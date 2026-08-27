import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    Calendar,
    ChevronDown,
    CreditCard,
    DollarSign,
    FolderKanban,
    HandCoins,
    Upload,
    UserCheck,
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

export function CreatePartnerTransactionDialog({
    open,
    onOpenChange,
    partners,
    matters,
    accounts,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    partners: UserOption[];
    matters: { id: string; matter_number: string; title: string }[];
    accounts: { id: string; name: string }[];
}) {
    const form = useForm({
        partner_id: partners[0]?.id?.toString() || '',
        type: 'advance_incurred',
        amount: 0,
        transaction_date: new Date().toISOString().split('T')[0],
        matter_id: '',
        account_id: '',
        notes: '',
        proof: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/finance/partner-transactions', {
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl sm:max-w-2xl dark:border-white/10 dark:bg-[#121418]">
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-950/50 dark:text-amber-400">
                                <HandCoins className="size-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                    Catat Transaksi &amp; Talangan Partner
                                </DialogTitle>
                                <DialogDescription className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                    Catat talangan dana pribadi partner, pengembalian talangan, pembagian hasil, atau prive.
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4 pt-2">
                    {/* Section 1: Partner & Transaction Type */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="mb-2.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                            Pihak Partner &amp; Jenis Transaksi
                        </div>
                        <div className="grid gap-3.5 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Partner Terkait <span className="text-red-500">*</span>
                                </Label>
                                <div className="mt-1">
                                    <UserPicker
                                        id="partner_id"
                                        value={form.data.partner_id}
                                        onChange={(val) => form.setData('partner_id', val)}
                                        users={partners}
                                        placeholder="Pilih Partner Terkait..."
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Jenis Transaksi <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative mt-1">
                                    <select
                                        value={form.data.type}
                                        onChange={(e) => form.setData('type', e.target.value)}
                                        required
                                        className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                    >
                                        <option value="advance_incurred">Talangan Pribadi (+ Utang Kantor ke Partner)</option>
                                        <option value="advance_reimbursed">Pengembalian Talangan (- Utang Kantor ke Partner)</option>
                                        <option value="profit_distribution">Pembagian Keuntungan / Deviden (+ Hak Partner)</option>
                                        <option value="capital_injection">Tambahan Modal / Setoran Partner (+ Ekuitas Firma)</option>
                                        <option value="draw_prive">Penarikan Prive / Modal (- Saldo Partner)</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Financial Amount & Date */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="mb-2.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                            Nominal &amp; Periode Transaksi
                        </div>
                        <div className="grid gap-3.5 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Nominal Transaksi (IDR) <span className="text-red-500">*</span>
                                </Label>
                                <MoneyInput
                                    required
                                    value={form.data.amount}
                                    onValueChange={(val) =>
                                        form.setData('amount', val)
                                    }
                                    placeholder="0"
                                    className="mt-1 h-9 rounded-lg border-slate-200 bg-white font-mono text-xs font-bold text-slate-900 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Tanggal Transaksi <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    required
                                    value={form.data.transaction_date}
                                    onChange={(e) =>
                                        form.setData('transaction_date', e.target.value)
                                    }
                                    className="mt-1 h-9 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-zinc-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Allocations & Accounts */}
                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="mb-2.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                            Alokasi Perkara &amp; Rekening Kas
                        </div>
                        <div className="space-y-3">
                            <div className="grid gap-3.5 sm:grid-cols-2">
                                <div>
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Terkait Perkara (Matter)
                                    </Label>
                                    <div className="relative mt-1">
                                        <select
                                            value={form.data.matter_id}
                                            onChange={(e) => form.setData('matter_id', e.target.value)}
                                            className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                        >
                                            <option value="">-- Tanpa Perkara (Operasional Umum Kantor) --</option>
                                            {matters.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.matter_number} — {m.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Rekening Kas / Bank Kantor Terlibat
                                    </Label>
                                    <div className="relative mt-1">
                                        <select
                                            value={form.data.account_id}
                                            onChange={(e) => form.setData('account_id', e.target.value)}
                                            className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                        >
                                            <option value="">-- Tanpa Rekening Kantor (Langsung Tunai/Pribadi) --</option>
                                            {accounts.map((a) => (
                                                <option key={a.id} value={a.id}>
                                                    {a.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Catatan / Keterangan Transaksi
                                </Label>
                                <Input
                                    type="text"
                                    value={form.data.notes}
                                    onChange={(e) => form.setData('notes', e.target.value)}
                                    placeholder="cth: Talangan biaya operasional sidang mendesak di PN Bandung..."
                                    className="mt-1 h-9 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-zinc-800"
                                />
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Unggah Bukti Transfer / Nota (Opsional)
                                </Label>
                                <div className="mt-1">
                                    <FileInput
                                        name="proof"
                                        accept="application/pdf,image/png,image/jpeg,image/webp"
                                        buttonText="Pilih Berkas"
                                        placeholder="Pilih file bukti transfer..."
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            form.setData('proof', file);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {Object.keys(form.errors).length > 0 && (
                        <div className="rounded-xl border border-rose-200/80 bg-rose-50/70 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                            <div className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-400">
                                <AlertCircle className="size-4 shrink-0" />
                                <span>Terdapat kesalahan pengisian data:</span>
                            </div>
                            <ul className="mt-1.5 list-inside list-disc space-y-0.5 pl-1 text-[11.5px]">
                                {Object.values(form.errors).map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <DialogFooter className="border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={form.processing}
                            className="h-9 rounded-xl border-slate-200 px-4 text-xs font-medium hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="h-9 rounded-xl bg-amber-600 px-5 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700 active:scale-95 dark:bg-amber-600 dark:hover:bg-amber-500"
                        >
                            {form.processing ? 'Menyimpan...' : 'Simpan Transaksi Partner'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
