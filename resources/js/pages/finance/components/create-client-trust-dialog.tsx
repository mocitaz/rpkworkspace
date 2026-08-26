import { useForm } from '@inertiajs/react';
import { ChevronDown, Lock } from 'lucide-react';
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
    trustAccounts: { id: string; name: string }[];
}) {
    const form = useForm({
        client_id: clients[0]?.id || '',
        matter_id: '',
        account_id: trustAccounts[0]?.id || '',
        type: 'deposit_in',
        amount: 0,
        transaction_date: new Date().toISOString().split('T')[0],
        purpose: '',
        recipient_party: '',
        notes: '',
        proof: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/finance/client-trust-funds', {
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
                        <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400">
                            <Lock className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold uppercase">Catat Mutasi Dana Titipan Klien</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs">
                        Catat penerimaan panjar perkara dari klien atau pengeluaran resmi ke instansi pengadilan/pihak ketiga.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="ctf_client" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Klien Pemilik Dana *
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="ctf_client"
                                    required
                                    value={form.data.client_id}
                                    onChange={(e) => form.setData('client_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="">Pilih Klien</option>
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
                            <Label htmlFor="ctf_type" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Jenis Mutasi *
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="ctf_type"
                                    value={form.data.type}
                                    onChange={(e) => form.setData('type', e.target.value as any)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="deposit_in">Penerimaan Titipan Panjar (+)</option>
                                    <option value="disbursement_out">Pengeluaran Biaya Resmi (-)</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="ctf_matter" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Perkara Terkait
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="ctf_matter"
                                    value={form.data.matter_id}
                                    onChange={(e) => form.setData('matter_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="">Non-Perkara / Titipan Umum</option>
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
                            <Label htmlFor="ctf_acc" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Rekening Titipan (Escrow) *
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="ctf_acc"
                                    required
                                    value={form.data.account_id}
                                    onChange={(e) => form.setData('account_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="">Pilih Rekening Titipan</option>
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

                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="ctf_amount" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Nominal Dana (Rp) *
                            </Label>
                            <Input
                                id="ctf_amount"
                                type="number"
                                required
                                min="1"
                                value={form.data.amount}
                                onChange={(e) => form.setData('amount', parseInt(e.target.value) || 0)}
                                className="mt-1 h-8.5 text-xs font-mono font-bold"
                            />
                        </div>
                        <div>
                            <Label htmlFor="ctf_date" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Tanggal Mutasi *
                            </Label>
                            <Input
                                id="ctf_date"
                                type="date"
                                required
                                value={form.data.transaction_date}
                                onChange={(e) => form.setData('transaction_date', e.target.value)}
                                className="mt-1 h-8.5 text-xs"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="ctf_purpose" className="font-semibold text-slate-700 dark:text-zinc-200">
                            Keperluan Titipan / Pembayaran *
                        </Label>
                        <Input
                            id="ctf_purpose"
                            required
                            placeholder="cth: Biaya Panjar SKUM Kasasi Mahkamah Agung"
                            value={form.data.purpose}
                            onChange={(e) => form.setData('purpose', e.target.value)}
                            className="mt-1 h-8.5 text-xs"
                        />
                    </div>

                    {form.data.type === 'disbursement_out' && (
                        <div>
                            <Label htmlFor="ctf_recipient" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Penerima Dana / Instansi
                            </Label>
                            <Input
                                id="ctf_recipient"
                                placeholder="cth: Kepaniteraan Pengadilan Negeri Bandung"
                                value={form.data.recipient_party}
                                onChange={(e) => form.setData('recipient_party', e.target.value)}
                                className="mt-1 h-8.5 text-xs"
                            />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="ctf_notes" className="font-semibold text-slate-700 dark:text-zinc-200">
                            Catatan Tambahan
                        </Label>
                        <Input
                            id="ctf_notes"
                            placeholder="cth: Diterima via transfer giro escrow"
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                            className="mt-1 h-8.5 text-xs"
                        />
                    </div>

                    <div>
                        <Label className="font-semibold text-slate-700 dark:text-zinc-200">
                            Unggah Bukti Setor / Kuitansi SKUM
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
                            Simpan Mutasi
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
