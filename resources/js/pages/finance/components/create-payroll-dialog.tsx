import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { ChevronDown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatMoney } from '@/lib/format';

export function CreatePayrollDialog({
    open,
    onOpenChange,
    staffUsers,
    accounts,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    staffUsers: {
        id: number;
        name: string;
        position_title?: string;
        department?: string;
        employee_code?: string;
        bank_name?: string;
        bank_account_number?: string;
    }[];
    accounts: { id: string; name: string }[];
}) {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const form = useForm({
        user_id: staffUsers[0]?.id?.toString() || '',
        period: currentMonth,
        basic_salary: 0,
        fixed_allowance: 0,
        transport_meal_allowance: 0,
        overtime_amount: 0,
        bonus_amount: 0,
        tax_deduction_amount: 0,
        deductions_amount: 0,
        status: 'draft',
        payment_account_id: accounts[0]?.id || '',
        notes: '',
    });

    const selectedUser = staffUsers.find((u) => u.id.toString() === form.data.user_id);

    const totalEarnings =
        (form.data.basic_salary || 0) +
        (form.data.fixed_allowance || 0) +
        (form.data.transport_meal_allowance || 0) +
        (form.data.overtime_amount || 0) +
        (form.data.bonus_amount || 0);

    const totalDeductions =
        (form.data.tax_deduction_amount || 0) +
        (form.data.deductions_amount || 0);

    const netSalary = totalEarnings - totalDeductions;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/finance/payrolls', {
            onSuccess: () => {
                form.reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                            <Users className="size-4" />
                        </div>
                        <DialogTitle className="text-sm font-bold uppercase">Input Gaji &amp; Honor Pegawai</DialogTitle>
                    </div>
                    <DialogDescription className="text-xs">
                        Buat perhitungan slip penghasilan bulanan staf, honor advokat, tunjangan, lembur, dan potongan.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="pay_user" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Pegawai / Advokat *
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="pay_user"
                                    required
                                    value={form.data.user_id}
                                    onChange={(e) => form.setData('user_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="">Pilih Pegawai</option>
                                    {staffUsers.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.position_title || 'Staf'})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="pay_period" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Periode Gaji (YYYY-MM) *
                            </Label>
                            <Input
                                id="pay_period"
                                type="month"
                                required
                                value={form.data.period}
                                onChange={(e) => form.setData('period', e.target.value)}
                                className="mt-1 h-8.5 text-xs font-mono"
                            />
                        </div>
                    </div>

                    {selectedUser && (
                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/70 p-2.5 text-[11px] text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                            Rekening Transfer:{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {selectedUser.bank_name || 'Bank'} - {selectedUser.bank_account_number || '(Belum diset di data profil)'}
                            </span>
                        </div>
                    )}

                    {/* Penghasilan Section */}
                    <div className="space-y-2 rounded-xl border border-emerald-200/70 bg-emerald-50/20 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                        <span className="text-[10.5px] font-bold text-emerald-700 uppercase tracking-wider dark:text-emerald-400">
                            1. Komponen Penerimaan (Earnings)
                        </span>
                        <div className="grid grid-cols-2 gap-2.5">
                            <div>
                                <Label htmlFor="basic_sal" className="font-semibold text-slate-700 dark:text-zinc-200">
                                    Gaji Pokok / Honor Dasar (Rp) *
                                </Label>
                                <Input
                                    id="basic_sal"
                                    type="number"
                                    required
                                    min="0"
                                    value={form.data.basic_salary}
                                    onChange={(e) => form.setData('basic_salary', parseInt(e.target.value) || 0)}
                                    className="mt-1 h-8 text-xs font-mono font-semibold"
                                />
                            </div>
                            <div>
                                <Label htmlFor="fixed_allow" className="font-semibold text-slate-700 dark:text-zinc-200">
                                    Tunjangan Jabatan (Rp)
                                </Label>
                                <Input
                                    id="fixed_allow"
                                    type="number"
                                    min="0"
                                    value={form.data.fixed_allowance}
                                    onChange={(e) => form.setData('fixed_allowance', parseInt(e.target.value) || 0)}
                                    className="mt-1 h-8 text-xs font-mono"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                            <div>
                                <Label htmlFor="trans_allow" className="font-semibold text-slate-700 dark:text-zinc-200">
                                    Transport &amp; Makan
                                </Label>
                                <Input
                                    id="trans_allow"
                                    type="number"
                                    min="0"
                                    value={form.data.transport_meal_allowance}
                                    onChange={(e) => form.setData('transport_meal_allowance', parseInt(e.target.value) || 0)}
                                    className="mt-1 h-8 text-xs font-mono"
                                />
                            </div>
                            <div>
                                <Label htmlFor="ot_amount" className="font-semibold text-slate-700 dark:text-zinc-200">
                                    Upah Lembur
                                </Label>
                                <Input
                                    id="ot_amount"
                                    type="number"
                                    min="0"
                                    value={form.data.overtime_amount}
                                    onChange={(e) => form.setData('overtime_amount', parseInt(e.target.value) || 0)}
                                    className="mt-1 h-8 text-xs font-mono"
                                />
                            </div>
                            <div>
                                <Label htmlFor="bonus_amount" className="font-semibold text-slate-700 dark:text-zinc-200">
                                    Bonus Perkara
                                </Label>
                                <Input
                                    id="bonus_amount"
                                    type="number"
                                    min="0"
                                    value={form.data.bonus_amount}
                                    onChange={(e) => form.setData('bonus_amount', parseInt(e.target.value) || 0)}
                                    className="mt-1 h-8 text-xs font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Potongan Section */}
                    <div className="space-y-2 rounded-xl border border-rose-200/70 bg-rose-50/20 p-3 dark:border-rose-500/20 dark:bg-rose-500/5">
                        <span className="text-[10.5px] font-bold text-rose-700 uppercase tracking-wider dark:text-rose-400">
                            2. Komponen Potongan (Deductions)
                        </span>
                        <div className="grid grid-cols-2 gap-2.5">
                            <div>
                                <Label htmlFor="tax_ded" className="font-semibold text-slate-700 dark:text-zinc-200">
                                    PPh 21 (Rp)
                                </Label>
                                <Input
                                    id="tax_ded"
                                    type="number"
                                    min="0"
                                    value={form.data.tax_deduction_amount}
                                    onChange={(e) => form.setData('tax_deduction_amount', parseInt(e.target.value) || 0)}
                                    className="mt-1 h-8 text-xs font-mono text-rose-600 dark:text-rose-400"
                                />
                            </div>
                            <div>
                                <Label htmlFor="other_ded" className="font-semibold text-slate-700 dark:text-zinc-200">
                                    Potongan Kasbon / BPJS (Rp)
                                </Label>
                                <Input
                                    id="other_ded"
                                    type="number"
                                    min="0"
                                    value={form.data.deductions_amount}
                                    onChange={(e) => form.setData('deductions_amount', parseInt(e.target.value) || 0)}
                                    className="mt-1 h-8 text-xs font-mono text-rose-600 dark:text-rose-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Net Salary Preview Box (Clean Highlight, No Harsh Dark Card) */}
                    <div className="flex items-center justify-between rounded-xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50/90 to-emerald-50/30 p-3 text-emerald-950 shadow-2xs dark:border-emerald-500/30 dark:from-emerald-950/30 dark:to-[#14161b] dark:text-white">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                                Gaji Bersih Diterima (Take Home Pay)
                            </span>
                            <div className="text-[11px] text-emerald-700/80 dark:text-zinc-400">
                                Bruto: {formatMoney(totalEarnings, 'IDR')} − Potongan: {formatMoney(totalDeductions, 'IDR')}
                            </div>
                        </div>
                        <div className="font-mono text-base font-bold text-emerald-800 dark:text-emerald-300">
                            {formatMoney(netSalary, 'IDR')}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        <div>
                            <Label htmlFor="pay_status" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Status Penggajian *
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="pay_status"
                                    value={form.data.status}
                                    onChange={(e) => form.setData('status', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="draft">Draft (Belum Disetujui)</option>
                                    <option value="approved">Disetujui (Siap Dibayar)</option>
                                    <option value="paid">Sudah Dibayarkan (Lunas)</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="pay_acc" className="font-semibold text-slate-700 dark:text-zinc-200">
                                Rekening Sumber Kas
                            </Label>
                            <div className="relative mt-1">
                                <select
                                    id="pay_acc"
                                    value={form.data.payment_account_id}
                                    onChange={(e) => form.setData('payment_account_id', e.target.value)}
                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-colors hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <option value="">Pilih Rekening Pembayaran</option>
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
                        <Label htmlFor="pay_notes" className="font-semibold text-slate-700 dark:text-zinc-200">
                            Catatan Tambahan
                        </Label>
                        <Input
                            id="pay_notes"
                            placeholder="cth: Termasuk insentif penutupan perkara PT KKG"
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
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
                            Simpan Payroll
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
