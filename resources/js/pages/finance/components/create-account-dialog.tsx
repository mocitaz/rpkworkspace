import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Banknote,
    Building2,
    ChevronDown,
    Landmark,
    Loader2,
    Shield,
    Users,
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

    const accountTypes = [
        { id: 'bank', label: 'Bank Operasional', desc: 'Rekening giro/tabungan firma', icon: Landmark, color: 'text-blue-600 dark:text-blue-400' },
        { id: 'cash', label: 'Kas Tunai', desc: 'Petty cash kantor', icon: Banknote, color: 'text-emerald-600 dark:text-emerald-400' },
        { id: 'partner_advance', label: 'Talangan Partner', desc: 'Pos utang/piutang partner', icon: Users, color: 'text-amber-600 dark:text-amber-400' },
        { id: 'client_trust', label: 'Dana Titipan Klien', desc: 'Rekening escrow/titipan perkara', icon: Shield, color: 'text-cyan-600 dark:text-cyan-400' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <Building2 className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                Tambah Akun Kas / Bank Baru
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Buat rekening kas operasional, rekening bank firma, atau pos talangan partner.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 pt-1 text-xs">
                    {/* Account Type Grid */}
                    <div>
                        <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                            Jenis Akun *
                        </Label>
                        <div className="mt-1 grid grid-cols-2 gap-2">
                            {accountTypes.map((type) => {
                                const Icon = type.icon;
                                const isSelected = form.data.type === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => form.setData('type', type.id as any)}
                                        className={`flex items-start gap-2 rounded-lg border p-2 text-left transition-all ${
                                            isSelected
                                                ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 dark:border-blue-500 dark:bg-blue-950/30'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 dark:border-white/10 dark:bg-[#16181f]'
                                        }`}
                                    >
                                        <div className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/10 ' + type.color}`}>
                                            <Icon className="size-3" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-xs font-semibold ${isSelected ? 'text-blue-900 dark:text-blue-200' : 'text-slate-800 dark:text-zinc-200'}`}>
                                                {type.label}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                                                {type.desc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div>
                            <Label htmlFor="acc_name" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Nama Akun / Rekening *
                            </Label>
                            <Input
                                id="acc_name"
                                required
                                placeholder="cth: Bank Mandiri Operasional / Kas Tunai Jakarta"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                            />
                        </div>

                        <div>
                            <Label htmlFor="acc_balance" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Saldo Awal (IDR) *
                            </Label>
                            <MoneyInput
                                id="acc_balance"
                                required
                                value={form.data.opening_balance}
                                onValueChange={(val) => form.setData('opening_balance', val)}
                                className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white font-mono text-xs font-semibold dark:border-white/10 dark:bg-[#121418]"
                            />
                        </div>

                        {form.data.type === 'bank' && (
                            <div className="grid gap-2 sm:grid-cols-2 pt-0.5">
                                <div>
                                    <Label htmlFor="bank_name" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Nama Bank
                                    </Label>
                                    <Input
                                        id="bank_name"
                                        placeholder="cth: Bank Mandiri / BCA"
                                        value={form.data.bank_name}
                                        onChange={(e) => form.setData('bank_name', e.target.value)}
                                        className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="acc_num" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Nomor Rekening
                                    </Label>
                                    <Input
                                        id="acc_num"
                                        placeholder="cth: 131-00-2233445-5"
                                        value={form.data.account_number}
                                        onChange={(e) => form.setData('account_number', e.target.value)}
                                        className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white font-mono text-xs dark:border-white/10 dark:bg-[#121418]"
                                    />
                                </div>
                            </div>
                        )}

                        {form.data.type === 'partner_advance' && (
                            <div className="pt-0.5">
                                <Label htmlFor="account_partner_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
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

                        <div className="pt-0.5">
                            <Label htmlFor="acc_desc" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                Catatan / Deskripsi (Opsional)
                            </Label>
                            <Input
                                id="acc_desc"
                                placeholder="cth: Rekening utama penampung honorarium perkara"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                className="mt-1 h-8.5 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
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

                    <DialogFooter className="border-t border-slate-100 pt-3 dark:border-white/[0.06]">
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
                            className="h-8.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 gap-1.5"
                        >
                            {form.processing ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Building2 className="size-3.5" />
                                    Simpan Akun
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
