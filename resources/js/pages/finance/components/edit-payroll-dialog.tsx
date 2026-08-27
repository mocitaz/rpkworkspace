import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronDown,
    CreditCard,
    Edit3,
    FileText,
    MinusCircle,
    PlusCircle,
    TrendingDown,
    TrendingUp,
    UserCheck,
    Users,
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
    const [data, setData] = useState({
        basic_salary: 0,
        fixed_allowance: 0,
        transport_meal_allowance: 0,
        overtime_amount: 0,
        bonus_amount: 0,
        tax_deduction_amount: 0,
        deductions_amount: 0,
        status: 'draft' as 'draft' | 'approved' | 'paid',
        payment_account_id: '',
        notes: '',
    });
    const [processing, setProcessing] = useState(false);

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
            });
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
        router.put(`/finance/payrolls/${payroll.id}`, data, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                onOpenChange(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl sm:max-w-4xl dark:border-white/10 dark:bg-[#121418]">
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 pb-4 dark:border-white/[0.06]">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/20 dark:bg-indigo-950/50 dark:text-indigo-400">
                                <Edit3 className="size-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                        Edit Slip Penghasilan (Payroll)
                                    </DialogTitle>
                                    {payslipNumber ? (
                                        <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                            {payslipNumber}
                                        </span>
                                    ) : null}
                                </div>
                                <DialogDescription className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                    Perbarui rincian slip honorarium &amp; gaji untuk pegawai / advokat terpilih.
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4 pt-1">
                    {/* Section 1: Employee Identity Card with Profile Photo */}
                    <div className="flex flex-col gap-3.5 rounded-xl border border-slate-200/80 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/70 p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.06] dark:from-[#16181f] dark:via-[#13151a] dark:to-[#16181f]">
                        <div className="flex items-center gap-3.5">
                            <Avatar className="size-11 shrink-0 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200/80 dark:border-zinc-800 dark:ring-white/10">
                                <AvatarImage
                                    src={getAvatarUrl(payroll.user?.avatar_path)}
                                    alt={payroll.user?.name || 'Pegawai'}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-sm font-bold text-white shadow-inner">
                                    {(payroll.user?.name || 'P').charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        {payroll.user?.name}
                                    </span>
                                    {payroll.user?.employee_code && (
                                        <span className="rounded-md border border-slate-200/80 bg-slate-100/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                            NIK: {payroll.user.employee_code}
                                        </span>
                                    )}
                                    {payroll.user?.bank_name && payroll.user?.bank_account_number ? (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200/80 bg-emerald-50/50 px-2 py-0.5 text-[10.5px] font-medium text-emerald-800 shadow-2xs dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-300">
                                            <CreditCard className="size-3 text-emerald-600 dark:text-emerald-400" />
                                            <span>
                                                {payroll.user.bank_name} - {payroll.user.bank_account_number}
                                                {payroll.user.bank_account_holder ? ` (a.n. ${payroll.user.bank_account_holder})` : ''}
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-md border border-rose-200/80 bg-rose-50/70 px-2 py-0.5 text-[10px] font-medium text-rose-700 shadow-2xs dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                                            <AlertCircle className="size-3 text-rose-600 dark:text-rose-400" />
                                            <span>Belum ada data rekening di profil staf (rekening pada slip akan kosong)</span>
                                        </span>
                                    )}
                                </div>
                                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                                    <span>{payroll.user?.position_title || 'Advokat / Staf'}</span>
                                    {payroll.user?.department && (
                                        <>
                                            <span className="text-slate-300 dark:text-zinc-600">•</span>
                                            <span>{payroll.user.department}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right side: Period Badge */}
                        <div className="flex items-center gap-2 self-start rounded-lg border border-indigo-100 bg-indigo-50/70 px-3 py-1.5 sm:self-center dark:border-indigo-900/40 dark:bg-indigo-950/30">
                            <Calendar className="size-4 text-indigo-600 dark:text-indigo-400" />
                            <div className="text-xs">
                                <span className="text-slate-500 dark:text-zinc-400">Periode: </span>
                                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">{payroll.period}</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Perfect 5-vs-5 Symmetrical Bento Grid */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Left Card: Komponen Penghasilan (5 Input Items) */}
                        <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#15171d]">
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-950/50 dark:text-emerald-400">
                                            <TrendingUp className="size-4" />
                                        </div>
                                        <span className="text-xs font-bold tracking-wide text-slate-800 uppercase dark:text-zinc-100">
                                            Penerimaan &amp; Tunjangan
                                        </span>
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10.5px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                        5 Komponen
                                    </span>
                                </div>

                                <div className="mt-3.5 space-y-3">
                                    {/* 1. Gaji Pokok */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Gaji Pokok / Retainer Advokat
                                            </Label>
                                            {Number(data.basic_salary) > 0 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    Tercantum
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-zinc-800/80 dark:text-zinc-500">
                                                    Rp 0 (disembunyikan)
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative mt-1.5">
                                            <MoneyInput
                                                value={data.basic_salary}
                                                onValueChange={(val) =>
                                                    setData({ ...data, basic_salary: val })
                                                }
                                                placeholder="0"
                                                className="h-9 w-full rounded-lg border-slate-200 bg-white font-mono text-xs shadow-2xs transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-100"
                                            />
                                        </div>
                                    </div>

                                    {/* 2. Tunjangan Jabatan */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Tunjangan Jabatan &amp; Keahlian
                                            </Label>
                                            {Number(data.fixed_allowance) > 0 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    Tercantum
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-zinc-800/80 dark:text-zinc-500">
                                                    Rp 0 (disembunyikan)
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative mt-1.5">
                                            <MoneyInput
                                                value={data.fixed_allowance}
                                                onValueChange={(val) =>
                                                    setData({ ...data, fixed_allowance: val })
                                                }
                                                placeholder="0"
                                                className="h-9 w-full rounded-lg border-slate-200 bg-white font-mono text-xs shadow-2xs transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-100"
                                            />
                                        </div>
                                    </div>

                                    {/* 3. Tunjangan Transport & Makan */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Tunjangan Transport &amp; Makan
                                            </Label>
                                            {Number(data.transport_meal_allowance) > 0 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    Tercantum
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-zinc-800/80 dark:text-zinc-500">
                                                    Rp 0 (disembunyikan)
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative mt-1.5">
                                            <MoneyInput
                                                value={data.transport_meal_allowance}
                                                onValueChange={(val) =>
                                                    setData({ ...data, transport_meal_allowance: val })
                                                }
                                                placeholder="0"
                                                className="h-9 w-full rounded-lg border-slate-200 bg-white font-mono text-xs shadow-2xs transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-100"
                                            />
                                        </div>
                                    </div>

                                    {/* 4. Upah Lembur */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Upah Lembur &amp; Sidang Luar Kota
                                            </Label>
                                            {Number(data.overtime_amount) > 0 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    Tercantum
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-zinc-800/80 dark:text-zinc-500">
                                                    Rp 0 (disembunyikan)
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative mt-1.5">
                                            <MoneyInput
                                                value={data.overtime_amount}
                                                onValueChange={(val) =>
                                                    setData({ ...data, overtime_amount: val })
                                                }
                                                placeholder="0"
                                                className="h-9 w-full rounded-lg border-slate-200 bg-white font-mono text-xs shadow-2xs transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-100"
                                            />
                                        </div>
                                    </div>

                                    {/* 5. Bonus Perkara */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Bonus Perkara &amp; Insentif Prestasi
                                            </Label>
                                            {Number(data.bonus_amount) > 0 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    Tercantum
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-zinc-800/80 dark:text-zinc-500">
                                                    Rp 0 (disembunyikan)
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative mt-1.5">
                                            <MoneyInput
                                                value={data.bonus_amount}
                                                onValueChange={(val) =>
                                                    setData({ ...data, bonus_amount: val })
                                                }
                                                placeholder="0"
                                                className="h-9 w-full rounded-lg border-slate-200 bg-white font-mono text-xs shadow-2xs transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Left Card Subtotal Bar */}
                            <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs dark:border-emerald-900/30 dark:bg-emerald-950/20">
                                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                                    Total Penerimaan Bruto (A)
                                </span>
                                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                    {formatMoney(totalEarnings)}
                                </span>
                            </div>
                        </div>

                        {/* Right Card: Komponen Potongan & Pengaturan Pencairan (5 Input Items) */}
                        <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-white/[0.08] dark:bg-[#15171d]">
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-500/20 dark:bg-rose-950/50 dark:text-rose-400">
                                            <TrendingDown className="size-4" />
                                        </div>
                                        <span className="text-xs font-bold tracking-wide text-slate-800 uppercase dark:text-zinc-100">
                                            Potongan &amp; Pembayaran
                                        </span>
                                    </div>
                                    <span className="rounded-full bg-rose-50 px-2 py-0.5 font-mono text-[10.5px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                        5 Komponen
                                    </span>
                                </div>

                                <div className="mt-3.5 space-y-3">
                                    {/* 1. Potongan Pajak PPh 21 */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Potongan Pajak PPh 21
                                            </Label>
                                            {Number(data.tax_deduction_amount) > 0 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
                                                    <span className="size-1.5 rounded-full bg-rose-500"></span>
                                                    Tercantum
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-zinc-800/80 dark:text-zinc-500">
                                                    Rp 0 (disembunyikan)
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative mt-1.5">
                                            <MoneyInput
                                                value={data.tax_deduction_amount}
                                                onValueChange={(val) =>
                                                    setData({ ...data, tax_deduction_amount: val })
                                                }
                                                placeholder="0"
                                                className="h-9 w-full rounded-lg border-slate-200 bg-white font-mono text-xs shadow-2xs transition-all focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-100"
                                            />
                                        </div>
                                    </div>

                                    {/* 2. Potongan BPJS / Kasbon / Lainnya */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Potongan BPJS / Kasbon / Lainnya
                                            </Label>
                                            {Number(data.deductions_amount) > 0 ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">
                                                    <span className="size-1.5 rounded-full bg-rose-500"></span>
                                                    Tercantum
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:bg-zinc-800/80 dark:text-zinc-500">
                                                    Rp 0 (disembunyikan)
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative mt-1.5">
                                            <MoneyInput
                                                value={data.deductions_amount}
                                                onValueChange={(val) =>
                                                    setData({ ...data, deductions_amount: val })
                                                }
                                                placeholder="0"
                                                className="h-9 w-full rounded-lg border-slate-200 bg-white font-mono text-xs shadow-2xs transition-all focus:border-rose-500 focus:ring-1 focus:ring-rose-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-100"
                                            />
                                        </div>
                                    </div>

                                    {/* 3. Rekening Kas/Bank Pembayaran */}
                                    <div>
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                            Rekening Sumber Kas / Bank
                                        </Label>
                                        <div className="relative mt-1.5">
                                            <select
                                                value={data.payment_account_id}
                                                onChange={(e) =>
                                                    setData({ ...data, payment_account_id: e.target.value })
                                                }
                                                className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                            >
                                                <option value="">-- Pilih Rekening Kas/Bank Kantor --</option>
                                                {accounts.map((a) => (
                                                    <option key={a.id} value={a.id}>
                                                        {a.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
                                        </div>
                                    </div>

                                    {/* 4. Status Pembayaran Slip */}
                                    <div>
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                            Status Slip Gaji <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative mt-1.5">
                                            <select
                                                value={data.status}
                                                onChange={(e) =>
                                                    setData({
                                                        ...data,
                                                        status: e.target.value as any,
                                                    })
                                                }
                                                required
                                                className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-9 pl-3 text-xs font-medium text-slate-800 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                            >
                                                <option value="draft">Draft (Konsep Perhitungan)</option>
                                                <option value="approved">Disetujui Partner (Approved)</option>
                                                <option value="paid">Telah Dibayar (Paid)</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-400" />
                                        </div>
                                    </div>

                                    {/* 5. Catatan / Keterangan Slip */}
                                    <div>
                                        <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                            Catatan Tambahan (Opsional)
                                        </Label>
                                        <div className="relative mt-1.5">
                                            <Input
                                                type="text"
                                                value={data.notes}
                                                onChange={(e) =>
                                                    setData({ ...data, notes: e.target.value })
                                                }
                                                placeholder="cth: Penyesuaian potongan pinjaman..."
                                                className="h-9 w-full rounded-lg border-slate-200 bg-white text-xs shadow-2xs transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Card Subtotal Bar */}
                            <div className="mt-4 flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50/60 px-3 py-2 text-xs dark:border-rose-900/30 dark:bg-rose-950/20">
                                <span className="font-semibold text-rose-800 dark:text-rose-300">
                                    Total Potongan (B)
                                </span>
                                <span className="font-mono font-bold text-rose-700 dark:text-rose-400">
                                    {formatMoney(totalDeductions)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Take Home Pay Summary Card (Clean Bright Concept) */}
                    <div className="relative overflow-hidden rounded-xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/70 via-slate-50/50 to-emerald-50/50 p-4 shadow-2xs dark:border-white/10 dark:from-[#181a24] dark:via-[#14161f] dark:to-[#121a18]">
                        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-white text-indigo-600 shadow-2xs dark:border-white/10 dark:bg-indigo-950/60 dark:text-indigo-400">
                                    <Wallet className="size-5" />
                                </div>
                                <div>
                                    <div className="text-[10.5px] font-bold tracking-wider text-slate-800 uppercase dark:text-zinc-200">
                                        PENGHASILAN BERSIH YANG DITERIMA (TAKE HOME PAY)
                                    </div>
                                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                                        <span>Penerimaan: <strong className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(totalEarnings)}</strong></span>
                                        <span className="text-slate-300 dark:text-zinc-600">•</span>
                                        <span>Potongan: <strong className="font-mono font-bold text-rose-600 dark:text-rose-400">{formatMoney(totalDeductions)}</strong></span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-left sm:text-right">
                                <div className="font-mono text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                    {formatMoney(netSalary)}
                                </div>
                                <div className="mt-0.5 text-[11px] font-medium text-slate-500 capitalize italic dark:text-zinc-400">
                                    {netSalary > 0 ? `${terbilang(netSalary)} Rupiah` : 'Nol Rupiah'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t border-slate-100 pt-4 dark:border-white/[0.06]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                            className="h-9 rounded-xl border-slate-200 px-4 text-xs font-medium hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-9 rounded-xl bg-indigo-600 px-5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 active:scale-95 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan Slip'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
