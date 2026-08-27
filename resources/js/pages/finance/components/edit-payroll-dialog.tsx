import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    Calendar,
    ChevronDown,
    CreditCard,
    Edit3,
    Loader2,
    Receipt,
    Save,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { FileInput } from '@/components/ui/file-input';
import { MoneyInput } from '@/components/ui/money-input';
import { Label } from '@/components/ui/label';
import { formatMoney, terbilang } from '@/lib/format';
import type { PayrollItem } from './payroll-view';

function getAvatarUrl(avatarPath?: string | null): string {
    if (!avatarPath || avatarPath.trim() === '') {
        return '/images/default-avatar.svg';
    }
    if (avatarPath.startsWith('http') || avatarPath.startsWith('/')) {
        return avatarPath;
    }
    return `/storage/${avatarPath}`;
}

export function EditPayrollDialog({
    open,
    onOpenChange,
    payroll,
    accounts,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payroll: PayrollItem | null;
    accounts: { id: string; name: string }[];
}) {
    const [data, setData] = useState<{
        basic_salary: number;
        fixed_allowance: number;
        transport_meal_allowance: number;
        overtime_amount: number;
        bonus_amount: number;
        tax_deduction_amount: number;
        deductions_amount: number;
        status: 'draft' | 'approved' | 'paid';
        payment_account_id: string;
        notes: string;
        proof: File | null;
    }>({
        basic_salary: 0,
        fixed_allowance: 0,
        transport_meal_allowance: 0,
        overtime_amount: 0,
        bonus_amount: 0,
        tax_deduction_amount: 0,
        deductions_amount: 0,
        status: 'draft',
        payment_account_id: '',
        notes: '',
        proof: null,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (payroll) {
            setData({
                basic_salary: payroll.basic_salary || 0,
                fixed_allowance: payroll.fixed_allowance || 0,
                transport_meal_allowance: payroll.transport_meal_allowance || 0,
                overtime_amount: payroll.overtime_amount || 0,
                bonus_amount: payroll.bonus_amount || 0,
                tax_deduction_amount: payroll.tax_deduction_amount || 0,
                deductions_amount: payroll.deductions_amount || 0,
                status: payroll.status || 'draft',
                payment_account_id: payroll.payment_account?.id || '',
                notes: payroll.notes || '',
                proof: null,
            });
            setErrors({});
        }
    }, [payroll, open]);

    if (!payroll) return null;

    const totalEarnings =
        (Number(data.basic_salary) || 0) +
        (Number(data.fixed_allowance) || 0) +
        (Number(data.transport_meal_allowance) || 0) +
        (Number(data.overtime_amount) || 0) +
        (Number(data.bonus_amount) || 0);

    const totalDeductions =
        (Number(data.tax_deduction_amount) || 0) +
        (Number(data.deductions_amount) || 0);

    const netSalary = Math.max(0, totalEarnings - totalDeductions);
    const payslipNumber = payroll.payslip_number || (payroll as any).payroll_number || '';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post(`/finance/payrolls/${payroll.id}`, {
            _method: 'put',
            ...data,
        }, {
            forceFormData: true,
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl sm:max-w-3xl dark:border-white/10 dark:bg-[#14161b]">
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            <Receipt className="size-4.5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                    Edit Slip Penghasilan
                                </DialogTitle>
                                {payslipNumber && (
                                    <span className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                        {payslipNumber}
                                    </span>
                                )}
                            </div>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Sesuaikan rincian penerimaan dan potongan gaji staf terkait.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 pt-1 text-xs">
                    {/* Employee Profile Banner */}
                    <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="flex items-center gap-2.5">
                            <Avatar className="size-8.5 rounded-lg border border-slate-200 dark:border-white/10">
                                <AvatarImage src={getAvatarUrl(payroll.user?.avatar)} />
                                <AvatarFallback className="rounded-lg text-xs font-bold">
                                    {payroll.user?.name?.slice(0, 2).toUpperCase() || 'ST'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                    {payroll.user?.name}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    {payroll.user?.position_title || 'Staf / Advokat'} • Periode: <strong className="font-mono text-slate-700 dark:text-zinc-300">{payroll.period}</strong>
                                </p>
                            </div>
                        </div>

                        {payroll.user?.bank_name && (
                            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                                <CreditCard className="size-3 text-emerald-600" />
                                <span>{payroll.user.bank_name} {payroll.user.bank_account_number}</span>
                            </div>
                        )}
                    </div>

                    {/* 2-Column Bento Grid */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {/* Left Card: Penghasilan */}
                        <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-white/[0.08] dark:bg-[#15171d]">
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-100">
                                            Penerimaan &amp; Tunjangan
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-2.5 space-y-2">
                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Gaji Pokok / Retainer Advokat
                                        </Label>
                                        <MoneyInput
                                            value={data.basic_salary}
                                            onValueChange={(val) => setData({ ...data, basic_salary: val })}
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Tunjangan Jabatan &amp; Keahlian
                                        </Label>
                                        <MoneyInput
                                            value={data.fixed_allowance}
                                            onValueChange={(val) => setData({ ...data, fixed_allowance: val })}
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Tunjangan Transport &amp; Makan
                                        </Label>
                                        <MoneyInput
                                            value={data.transport_meal_allowance}
                                            onValueChange={(val) => setData({ ...data, transport_meal_allowance: val })}
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Upah Lembur / Sidang Luar Kota
                                        </Label>
                                        <MoneyInput
                                            value={data.overtime_amount}
                                            onValueChange={(val) => setData({ ...data, overtime_amount: val })}
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Bonus Perkara &amp; Insentif
                                        </Label>
                                        <MoneyInput
                                            value={data.bonus_amount}
                                            onValueChange={(val) => setData({ ...data, bonus_amount: val })}
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Subtotal Bar */}
                            <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/60 px-2.5 py-1.5 text-xs dark:border-emerald-900/30 dark:bg-emerald-950/20">
                                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                                    Total Bruto (A)
                                </span>
                                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                    {formatMoney(totalEarnings)}
                                </span>
                            </div>
                        </div>

                        {/* Right Card: Potongan & Pengaturan Pencairan */}
                        <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-white/[0.08] dark:bg-[#15171d]">
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingDown className="size-3.5 text-rose-600 dark:text-rose-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-zinc-100">
                                            Potongan &amp; Pencairan
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-2.5 space-y-2">
                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Potongan Pajak PPh 21
                                        </Label>
                                        <MoneyInput
                                            value={data.tax_deduction_amount}
                                            onValueChange={(val) => setData({ ...data, tax_deduction_amount: val })}
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Potongan Lainnya / Pinjaman
                                        </Label>
                                        <MoneyInput
                                            value={data.deductions_amount}
                                            onValueChange={(val) => setData({ ...data, deductions_amount: val })}
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                                        <div>
                                            <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                                Status Slip
                                            </Label>
                                            <div className="relative mt-1">
                                                <select
                                                    value={data.status}
                                                    onChange={(e) => setData({ ...data, status: e.target.value as any })}
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2 text-xs font-medium text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="draft">Draft (Konsep)</option>
                                                    <option value="approved">Disetujui</option>
                                                    <option value="paid">Sudah Dibayar</option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                                Rekening Pembayar
                                            </Label>
                                            <div className="relative mt-1">
                                                <select
                                                    value={data.payment_account_id}
                                                    onChange={(e) => setData({ ...data, payment_account_id: e.target.value })}
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2 text-xs font-medium text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="">-- Rekening --</option>
                                                    {accounts.map((a) => (
                                                        <option key={a.id} value={a.id}>
                                                            {a.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Catatan / Keterangan Slip
                                        </Label>
                                        <Input
                                            type="text"
                                            value={data.notes}
                                            onChange={(e) => setData({ ...data, notes: e.target.value })}
                                            placeholder="cth: Penyesuaian potongan pinjaman..."
                                            className="mt-1 h-8 rounded-lg text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Ganti / Unggah Bukti Baru (Opsional)
                                        </Label>
                                        <div className="mt-1">
                                            <FileInput
                                                name="proof"
                                                accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
                                                buttonText="Pilih Berkas"
                                                placeholder="Unggah berkas bukti transfer baru..."
                                                onFileSelect={(file) => setData({ ...data, proof: file })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subtotal Bar */}
                            <div className="mt-3 flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50/60 px-2.5 py-1.5 text-xs dark:border-rose-900/30 dark:bg-rose-950/20">
                                <span className="font-semibold text-rose-800 dark:text-rose-300">
                                    Total Potongan (B)
                                </span>
                                <span className="font-mono font-bold text-rose-700 dark:text-rose-400">
                                    {formatMoney(totalDeductions)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Take Home Pay Summary Card */}
                    <div className="flex items-center justify-between rounded-xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/70 via-slate-50/50 to-emerald-50/50 p-3 shadow-2xs dark:border-white/10 dark:from-[#181a24] dark:to-[#121a18]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-white text-indigo-600 shadow-2xs dark:border-white/10 dark:bg-indigo-950/60 dark:text-indigo-400">
                                <Wallet className="size-4.5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold tracking-wider text-slate-700 uppercase dark:text-zinc-300">
                                    TAKE HOME PAY (PENGHASILAN BERSIH)
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
                                    <span>Bruto: <strong className="font-mono text-emerald-600">{formatMoney(totalEarnings)}</strong></span>
                                    <span>•</span>
                                    <span>Potongan: <strong className="font-mono text-rose-600">{formatMoney(totalDeductions)}</strong></span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="font-mono text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                                {formatMoney(netSalary)}
                            </div>
                            <div className="text-[10px] font-medium text-slate-400 italic">
                                {netSalary > 0 ? `${terbilang(netSalary)} Rupiah` : 'Nol Rupiah'}
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

                    <DialogFooter className="border-t border-slate-100 pt-3 dark:border-white/[0.06]">
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
                            className="h-8.5 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 gap-1.5"
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
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
