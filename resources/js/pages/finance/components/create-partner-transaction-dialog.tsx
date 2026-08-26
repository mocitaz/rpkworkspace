import { useForm } from '@inertiajs/react';
import { ChevronDown, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreatePartnerTransactionDialog({
    open,
    onOpenChange,
    partners,
    matters,
    accounts,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    partners: { id: number; name: string }[];
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
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                            <HandCoins className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold uppercase">Catat Transaksi &amp; Talangan Partner</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs">
                        Catat talangan dana pribadi partner, pengembalian talangan dari kantor, pembagian hasil, atau prive.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="ptr_partner" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Partner *
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="ptr_partner"
                                    required
                                    value={form.data.partner_id}
                                    onChange={(e) => form.setData('partner_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="">Pilih Partner</option>
                                    {partners.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="ptr_type" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Jenis Transaksi *
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="ptr_type"
                                    value={form.data.type}
                                    onChange={(e) => form.setData('type', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="advance_incurred">Talangan Pribadi (+ Utang)</option>
                                    <option value="advance_reimbursed">Pengembalian Talangan (- Utang)</option>
                                    <option value="profit_distribution">Bagi Hasil / Profit Share</option>
                                    <option value="draw_prive">Penarikan Prive Partner</option>
                                    <option value="capital_injection">Setoran Modal Partner</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="ptr_amount" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Nominal (Rp) *
                            </Label>
                            <Input
                                id="ptr_amount"
                                type="number"
                                required
                                min="1"
                                value={form.data.amount}
                                onChange={(e) => form.setData('amount', parseInt(e.target.value) || 0)}
                                className="mt-1 h-8.5 text-xs font-mono font-bold"
                            />
                        </div>
                        <div>
                            <Label htmlFor="ptr_date" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Tanggal Transaksi *
                            </Label>
                            <Input
                                id="ptr_date"
                                type="date"
                                required
                                value={form.data.transaction_date}
                                onChange={(e) => form.setData('transaction_date', e.target.value)}
                                className="mt-1 h-8.5 text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="ptr_matter" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Perkara Terkait (Opsional)
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="ptr_matter"
                                    value={form.data.matter_id}
                                    onChange={(e) => form.setData('matter_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="">Non-Perkara / Umum</option>
                                    {matters.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.matter_number} - {m.title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="ptr_acc" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Akun Kas/Bank Pembayar
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="ptr_acc"
                                    value={form.data.account_id}
                                    onChange={(e) => form.setData('account_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="">Pilih Rekening Kas/Bank</option>
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
                        <Label htmlFor="ptr_notes" className="font-semibold text-slate-700 dark:text-zinc-200">
                            Keterangan Transaksi
                        </Label>
                        <Input
                            id="ptr_notes"
                            placeholder="cth: Talangan biaya akomodasi sidang luar kota"
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            className="mt-1 h-8.5 text-xs"
                        />
                    </div>

                    <div>
                        <Label className="font-semibold text-slate-700 dark:text-zinc-200">
                            Unggah Bukti / Kuitansi
                        </Label>
                        <FileInput
                            className="mt-1"
                            onFileSelect={(file) => form.setData('proof', file)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="h-8.5 text-xs font-semibold"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={form.processing}
                            className="h-8.5 bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                        >
                            Simpan Transaksi
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
