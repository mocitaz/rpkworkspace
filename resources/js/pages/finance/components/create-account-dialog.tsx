import { useForm } from '@inertiajs/react';
import { Building, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MoneyInput } from '@/components/ui/money-input';
import { Label } from '@/components/ui/label';
import UserPicker, { type UserOption } from '@/components/user-picker';

export function CreateAccountDialog({
    open,
    onOpenChange,
    partners,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    partners: UserOption[];
}) {
    const form = useForm({
        name: '',
        type: 'bank',
        bank_name: '',
        account_number: '',
        partner_id: '',
        opening_balance: 0,
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/finance/accounts', {
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
                        <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                            <Building className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold uppercase">Tambah Akun Kas / Bank Baru</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs">
                        Buat rekening kas operasional, rekening bank firma, atau akun talangan partner.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 text-xs">
                    <div>
                        <Label htmlFor="acc_name" className="font-semibold text-slate-700 dark:text-zinc-200">
                            Nama Akun / Rekening *
                        </Label>
                        <Input
                            id="acc_name"
                            required
                            placeholder="cth: Bank Mandiri Operasional / Kas Tunai"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="mt-1 h-8.5 text-xs"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="acc_type" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Jenis Akun *
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="acc_type"
                                    value={form.data.type}
                                    onChange={(e) => form.setData('type', e.target.value as any)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="bank">Bank Operasional</option>
                                    <option value="cash">Kas Kantor Tunai</option>
                                    <option value="partner_advance">Kas Talangan Partner</option>
                                    <option value="client_trust">Dana Titipan Klien (Escrow)</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="acc_balance" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Saldo Awal (Rp) *
                            </Label>
                            <MoneyInput
                                id="acc_balance"
                                required
                                value={form.data.opening_balance}
                                onValueChange={(val) => form.setData('opening_balance', val)}
                                className="mt-1 h-8.5 text-xs font-mono"
                            />
                        </div>
                    </div>

                    {form.data.type === 'bank' && (
                        <div className="grid grid-cols-2 gap-2.5">
                            <div>
                                <Label htmlFor="bank_name" className="font-semibold text-slate-700 dark:text-zinc-200">
                                    Nama Bank
                                </Label>
                                <Input
                                    id="bank_name"
                                    placeholder="cth: Bank Mandiri / BCA"
                                    value={form.data.bank_name}
                                    onChange={(e) => form.setData('bank_name', e.target.value)}
                                    className="mt-1 h-8.5 text-xs"
                                />
                            </div>
                            <div>
                                <Label htmlFor="acc_num" className="font-semibold text-slate-700 dark:text-zinc-200">
                                    Nomor Rekening
                                </Label>
                                <Input
                                    id="acc_num"
                                    placeholder="cth: 131-00-2233445-5"
                                    value={form.data.account_number}
                                    onChange={(e) => form.setData('account_number', e.target.value)}
                                    className="mt-1 h-8.5 text-xs font-mono"
                                />
                            </div>
                        </div>
                    )}

                    {form.data.type === 'partner_advance' && (
                        <div>
                            <Label htmlFor="account_partner_id" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Partner Pemilik Akun *
                            </Label>
                            <div className="mt-1">
                                <UserPicker
                                    id="account_partner_id"
                                    value={form.data.partner_id}
                                    onChange={(val) => form.setData('partner_id', val)}
                                    users={partners}
                                    placeholder="Pilih Partner Pemilik..."
                                    emptyOptionLabel="-- Pilih Partner Pemilik --"
                                    allowClear
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <Label htmlFor="acc_desc" className="font-semibold text-slate-700 dark:text-zinc-200">
                            Keterangan / Catatan
                        </Label>
                        <Input
                            id="acc_desc"
                            placeholder="cth: Rekening penerimaan honorarium utama"
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                            className="mt-1 h-8.5 text-xs"
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
                            Simpan Akun
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
