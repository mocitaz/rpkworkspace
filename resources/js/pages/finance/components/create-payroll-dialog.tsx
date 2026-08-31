import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    Calendar,
    ChevronDown,
    CreditCard,
    Loader2,
    Receipt,
    TrendingDown,
    TrendingUp,
    Wallet,
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
import { FileInput } from '@/components/ui/file-input';
import { MoneyInput } from '@/components/ui/money-input';
import { Label } from '@/components/ui/label';
import UserPicker, { type UserOption } from '@/components/user-picker';
import { formatMoney, terbilang } from '@/lib/format';
import { financeDialogPanelClass } from './finance-dialog-design';

export function CreatePayrollDialog({
    open,
    onOpenChange,
    staffUsers,
    accounts,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    staffUsers: (UserOption & {
        employee_code?: string;
        position_title?: string;
        bank_name?: string;
        bank_account_number?: string;
        bank_account_holder?: string;
        department?: string;
    })[];
    accounts: { id: string; name: string }[];
}) {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const form = useForm<{
        user_id: string;
        period: string;
        basic_salary: number;
        fixed_allowance: number;
        transport_meal_allowance: number;
        overtime_amount: number;
        bonus_amount: number;
        tax_deduction_amount: number;
        deductions_amount: number;
        status: string;
        payment_account_id: string;
        notes: string;
        proof: File | null;
    }>({
        user_id: '',
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
        proof: null,
    });

    useEffect(() => {
        if (open) {
            form.setData((prev) => ({
                ...prev,
                user_id: '',
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
                proof: null,
            }));
            form.clearErrors();
        }
    }, [open]);

    const selectedUser = staffUsers.find(
        (u) => String(u.id) === String(form.data.user_id),
    );

    const totalEarnings =
        (Number(form.data.basic_salary) || 0) +
        (Number(form.data.fixed_allowance) || 0) +
        (Number(form.data.transport_meal_allowance) || 0) +
        (Number(form.data.overtime_amount) || 0) +
        (Number(form.data.bonus_amount) || 0);

    const totalDeductions =
        (Number(form.data.tax_deduction_amount) || 0) +
        (Number(form.data.deductions_amount) || 0);

    const netSalary = Math.max(0, totalEarnings - totalDeductions);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/finance/payrolls', {
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
            <DialogContent className={financeDialogPanelClass('wide')}>
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                            <Receipt className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 sm:text-base dark:text-white">
                                Input Slip Penghasilan (Payroll)
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Pilih pegawai dan susun rincian gaji serta
                                potongan secara otomatis.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-3.5 pt-1 text-xs">
                    {/* Section 1: Employee & Period Select */}
                    <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-[#16181f]">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Pegawai / Advokat Penerima Gaji{' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <div className="mt-1">
                                    <UserPicker
                                        id="payroll_user_id"
                                        value={form.data.user_id}
                                        onChange={(val) =>
                                            form.setData('user_id', val)
                                        }
                                        users={staffUsers}
                                        placeholder="-- Pilih Pegawai / Staf --"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                    Periode Penggajian (Bulan){' '}
                                    <span className="text-rose-500">*</span>
                                </Label>
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-indigo-600 dark:text-indigo-400">
                                        <Calendar className="size-3.5" />
                                    </div>
                                    <input
                                        type="month"
                                        value={form.data.period}
                                        onChange={(e) =>
                                            form.setData(
                                                'period',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        className="h-8.5 w-full cursor-pointer rounded-lg border border-slate-200 bg-white pr-2.5 pl-8 text-xs font-semibold text-slate-800 shadow-2xs outline-hidden transition-all hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Selected User Info Inline Badges */}
                        {selectedUser && (
                            <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-200/60 pt-2 text-[11px] dark:border-white/[0.06]">
                                {selectedUser.department && (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 font-medium text-slate-700 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300">
                                        <Building2 className="size-3 text-indigo-500" />
                                        <span>{selectedUser.department}</span>
                                    </span>
                                )}
                                {selectedUser.employee_code && (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-slate-700 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300">
                                        NIK:{' '}
                                        <strong>
                                            {selectedUser.employee_code}
                                        </strong>
                                    </span>
                                )}
                                {selectedUser.bank_name &&
                                selectedUser.bank_account_number ? (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50/60 px-2 py-0.5 text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-300">
                                        <CreditCard className="size-3 text-emerald-600" />
                                        <span>
                                            {selectedUser.bank_name} -{' '}
                                            {selectedUser.bank_account_number}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-[10.5px] text-amber-600 dark:text-amber-400">
                                        <AlertCircle className="size-3" />
                                        <span>
                                            Rekening belum terdaftar di profil
                                            staf
                                        </span>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Section 2: Compact 2-Column Bento Grid */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {/* Left Card: Komponen Penghasilan */}
                        <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-white/[0.08] dark:bg-[#15171d]">
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-zinc-100">
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
                                            value={form.data.basic_salary}
                                            onValueChange={(val) =>
                                                form.setData(
                                                    'basic_salary',
                                                    val,
                                                )
                                            }
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Tunjangan Jabatan &amp; Keahlian
                                        </Label>
                                        <MoneyInput
                                            value={form.data.fixed_allowance}
                                            onValueChange={(val) =>
                                                form.setData(
                                                    'fixed_allowance',
                                                    val,
                                                )
                                            }
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Tunjangan Transport &amp; Makan
                                        </Label>
                                        <MoneyInput
                                            value={
                                                form.data
                                                    .transport_meal_allowance
                                            }
                                            onValueChange={(val) =>
                                                form.setData(
                                                    'transport_meal_allowance',
                                                    val,
                                                )
                                            }
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Upah Lembur / Sidang Luar Kota
                                        </Label>
                                        <MoneyInput
                                            value={form.data.overtime_amount}
                                            onValueChange={(val) =>
                                                form.setData(
                                                    'overtime_amount',
                                                    val,
                                                )
                                            }
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Bonus Perkara &amp; Insentif
                                        </Label>
                                        <MoneyInput
                                            value={form.data.bonus_amount}
                                            onValueChange={(val) =>
                                                form.setData(
                                                    'bonus_amount',
                                                    val,
                                                )
                                            }
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Left Card Subtotal Bar */}
                            <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/60 px-2.5 py-1.5 text-xs dark:border-emerald-900/30 dark:bg-emerald-950/20">
                                <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                                    Total Bruto (A)
                                </span>
                                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                    {formatMoney(totalEarnings)}
                                </span>
                            </div>
                        </div>

                        {/* Right Card: Komponen Potongan & Pengaturan Pencairan */}
                        <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs dark:border-white/[0.08] dark:bg-[#15171d]">
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.06]">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingDown className="size-3.5 text-rose-600 dark:text-rose-400" />
                                        <span className="text-xs font-bold tracking-wider text-slate-800 uppercase dark:text-zinc-100">
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
                                            value={
                                                form.data.tax_deduction_amount
                                            }
                                            onValueChange={(val) =>
                                                form.setData(
                                                    'tax_deduction_amount',
                                                    val,
                                                )
                                            }
                                            placeholder="0"
                                            className="mt-1 h-8 rounded-lg font-mono text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Potongan Lainnya / Pinjaman
                                        </Label>
                                        <MoneyInput
                                            value={form.data.deductions_amount}
                                            onValueChange={(val) =>
                                                form.setData(
                                                    'deductions_amount',
                                                    val,
                                                )
                                            }
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
                                                    value={form.data.status}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'status',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2 text-xs font-medium text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="draft">
                                                        Draft (Konsep)
                                                    </option>
                                                    <option value="approved">
                                                        Disetujui
                                                    </option>
                                                    <option value="paid">
                                                        Sudah Dibayar
                                                    </option>
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
                                                    value={
                                                        form.data
                                                            .payment_account_id
                                                    }
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'payment_account_id',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2 text-xs font-medium text-slate-800 shadow-2xs outline-hidden focus:border-indigo-500 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="">
                                                        -- Rekening --
                                                    </option>
                                                    {accounts.map((a) => (
                                                        <option
                                                            key={a.id}
                                                            value={a.id}
                                                        >
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
                                            value={form.data.notes}
                                            onChange={(e) =>
                                                form.setData(
                                                    'notes',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="cth: Pembayaran honorarium periode berjalan..."
                                            className="mt-1 h-8 rounded-lg text-xs"
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-200">
                                            Bukti Transfer / Slip (Opsional)
                                        </Label>
                                        <div className="mt-1">
                                            <FileInput
                                                name="proof"
                                                accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
                                                buttonText="Pilih Berkas"
                                                placeholder="Unggah berkas bukti transfer..."
                                                onFileSelect={(file) =>
                                                    form.setData('proof', file)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Card Subtotal Bar */}
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

                    {/* Section 3: Take Home Pay Summary Card (Compact) */}
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
                                    <span>
                                        Bruto:{' '}
                                        <strong className="font-mono text-emerald-600">
                                            {formatMoney(totalEarnings)}
                                        </strong>
                                    </span>
                                    <span>•</span>
                                    <span>
                                        Potongan:{' '}
                                        <strong className="font-mono text-rose-600">
                                            {formatMoney(totalDeductions)}
                                        </strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="font-mono text-lg font-extrabold text-slate-900 sm:text-xl dark:text-white">
                                {formatMoney(netSalary)}
                            </div>
                            <div className="text-[10px] font-medium text-slate-400 italic">
                                {netSalary > 0
                                    ? `${terbilang(netSalary)} Rupiah`
                                    : 'Nol Rupiah'}
                            </div>
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
                            onClick={() => onOpenChange(false)}
                            disabled={form.processing}
                            className="h-8.5 rounded-lg text-xs font-semibold"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="h-8.5 gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            {form.processing ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Receipt className="size-3.5" />
                                    Simpan Slip
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
