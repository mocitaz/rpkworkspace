import { useForm } from '@inertiajs/react';
import { ArrowRightLeft, ChevronDown } from 'lucide-react';
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
import { MoneyInput } from '@/components/ui/money-input';
import { Label } from '@/components/ui/label';

export function CreateTransferDialog({
    open,
    onOpenChange,
    accounts,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accounts: { id: string; name: string; current_balance: number }[];
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                            <ArrowRightLeft className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold uppercase">Transfer Dana Antar Kas / Bank</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs">
                        Catat pemindahan saldo internal antar rekening kas, bank, atau talangan partner.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="from_acc" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Akun Asal (Pengirim) *
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="from_acc"
                                    required
                                    value={form.data.from_account_id}
                                    onChange={(e) => form.setData('from_account_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="">Pilih Akun Asal</option>
                                    {accounts.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="to_acc" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Akun Tujuan (Penerima) *
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="to_acc"
                                    required
                                    value={form.data.to_account_id}
                                    onChange={(e) => form.setData('to_account_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="">Pilih Akun Tujuan</option>
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

                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="trf_amount" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Nominal Transfer (Rp) *
                            </Label>
                            <MoneyInput
                                id="trf_amount"
                                required
                                value={form.data.amount}
                                onValueChange={(val) => form.setData('amount', val)}
                                className="mt-1 h-8.5 text-xs font-mono font-bold"
                            />
                        </div>
                        <div>
                            <Label htmlFor="trf_date" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Tanggal Transfer *
                            </Label>
                            <Input
                                id="trf_date"
                                type="date"
                                required
                                value={form.data.transferred_at}
                                onChange={(e) => form.setData('transferred_at', e.target.value)}
                                className="mt-1 h-8.5 text-xs"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="trf_ref" className="font-semibold text-slate-700 dark:text-zinc-200">
                            No. Referensi / Bukti Mutasi
                        </Label>
                        <Input
                            id="trf_ref"
                            placeholder="cth: REF-MANDIRI-99210"
                            value={form.data.reference_number}
                            onChange={(e) => form.setData('reference_number', e.target.value)}
                            className="mt-1 h-8.5 text-xs"
                        />
                    </div>

                    <div>
                        <Label htmlFor="trf_notes" className="font-semibold text-slate-700 dark:text-zinc-200">
                            Catatan Transfer
                        </Label>
                        <Input
                            id="trf_notes"
                            placeholder="cth: Pengisian kas kecil kantor minggu I"
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            className="mt-1 h-8.5 text-xs"
                        />
                    </div>

                    <div>
                        <Label className="font-semibold text-slate-700 dark:text-zinc-200">
                            Unggah Bukti Transfer / Struk
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
                            Proses Transfer
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
