import { router } from '@inertiajs/react';
import { CheckCircle2, Download, FileText, Plus, Users, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/format';

export type PayrollItem = {
    id: string;
    payslip_number: string;
    user?: { id: number; name: string; position_title?: string; department?: string; employee_code?: string };
    period: string;
    basic_salary: number;
    fixed_allowance: number;
    transport_meal_allowance: number;
    overtime_amount: number;
    bonus_amount: number;
    deductions_amount: number;
    tax_deduction_amount: number;
    net_salary: number;
    status: 'draft' | 'approved' | 'paid';
    payment_account?: { id: string; name: string };
    paid_at?: string;
    notes?: string;
};

export function PayrollView({
    payrolls,
    onOpenPayrollModal,
}: {
    payrolls: PayrollItem[];
    onOpenPayrollModal: () => void;
}) {
    const totalNet = payrolls.reduce((acc, p) => acc + p.net_salary, 0);
    const totalBasic = payrolls.reduce((acc, p) => acc + p.basic_salary, 0);
    const totalAllowances = payrolls.reduce((acc, p) => acc + p.fixed_allowance + p.transport_meal_allowance + p.overtime_amount + p.bonus_amount, 0);
    const totalDeductions = payrolls.reduce((acc, p) => acc + p.deductions_amount + p.tax_deduction_amount, 0);

    const handleUpdateStatus = (payrollId: string, status: 'approved' | 'paid') => {
        router.patch(`/finance/payrolls/${payrollId}/status`, { status }, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4">
            {/* Header & Actions */}
            <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase dark:text-white">Penggajian &amp; Honor Tenaga Kerja (Payroll)</h2>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Pencatatan gaji pokok, tunjangan jabatan, uang makan/transport, upah lembur, bonus perkara, potongan PPh 21, dan cetak slip gaji digital.
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={onOpenPayrollModal}
                    className="h-7.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                >
                    <Plus className="mr-1 size-3.5" />
                    Input Gaji Pegawai
                </Button>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Total Gaji Pokok</span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-slate-900 dark:text-white">{formatMoney(totalBasic, 'IDR')}</p>
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                    <span className="text-[10px] font-semibold tracking-wider text-blue-500 uppercase">Tunjangan &amp; Bonus</span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{formatMoney(totalAllowances, 'IDR')}</p>
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                    <span className="text-[10px] font-semibold tracking-wider text-rose-500 uppercase">Potongan (PPh21/BPJS)</span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-rose-600 dark:text-rose-400">{formatMoney(totalDeductions, 'IDR')}</p>
                </div>
                <div className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-white p-3.5 shadow-2xs dark:border-emerald-500/20 dark:from-emerald-950/20 dark:to-[#14161b]">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">Total Take Home Pay</span>
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">Netto</span>
                    </div>
                    <p className="mt-0.5 font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">{formatMoney(totalNet, 'IDR')}</p>
                </div>
            </div>

            {/* Payroll Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                <div className="border-b border-slate-200/60 px-4 py-2.5 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase dark:text-white">Daftar Payroll Pegawai &amp; Advokat</h3>
                            <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">Rincian slip penghasilan per personel per periode.</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                            {payrolls.length} Slip
                        </span>
                    </div>
                </div>

                {payrolls.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                        Belum ada slip gaji tercatat. Klik "Input Gaji Pegawai" untuk membuat payroll baru.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200/70 bg-slate-50/70 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/[0.06] dark:bg-[#121418] dark:text-zinc-400">
                                <tr>
                                    <th className="px-3.5 py-2.5">Pegawai &amp; Periode</th>
                                    <th className="px-3 py-2.5 text-right">Gaji Pokok</th>
                                    <th className="px-3 py-2.5 text-right">Tunjangan &amp; Lembur</th>
                                    <th className="px-3 py-2.5 text-right">Bonus</th>
                                    <th className="px-3 py-2.5 text-right">Potongan</th>
                                    <th className="px-3 py-2.5 text-right">Gaji Bersih</th>
                                    <th className="px-3 py-2.5 text-center">Status</th>
                                    <th className="px-3 py-2.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                {payrolls.map((p) => {
                                    const totalAllowance = p.fixed_allowance + p.transport_meal_allowance + p.overtime_amount;
                                    const totalDeduct = p.deductions_amount + p.tax_deduction_amount;

                                    const statusBadges: Record<string, { label: string; color: string }> = {
                                        draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-zinc-300' },
                                        approved: { label: 'Disetujui', color: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' },
                                        paid: { label: 'Dibayarkan', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
                                    };

                                    const badge = statusBadges[p.status] || { label: p.status, color: 'bg-slate-100 text-slate-700' };

                                    return (
                                        <tr key={p.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                                            <td className="px-3.5 py-2.5">
                                                <div className="font-bold text-slate-900 dark:text-white">{p.user?.name || 'Pegawai'}</div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                                    <span className="font-mono text-blue-600 dark:text-blue-400">{p.period}</span>
                                                    <span>&bull;</span>
                                                    <span>{p.user?.position_title || 'Staf'}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono text-slate-700 dark:text-zinc-300">
                                                {formatMoney(p.basic_salary, 'IDR')}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono text-slate-700 dark:text-zinc-300">
                                                {formatMoney(totalAllowance, 'IDR')}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono text-blue-600 dark:text-blue-400">
                                                {formatMoney(p.bonus_amount, 'IDR')}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono text-rose-600 dark:text-rose-400">
                                                {formatMoney(totalDeduct, 'IDR')}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatMoney(p.net_salary, 'IDR')}
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${badge.color}`}>
                                                    {badge.label}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    {p.status === 'draft' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUpdateStatus(p.id, 'approved')}
                                                            className="h-6 rounded px-1.5 text-[10px] font-semibold"
                                                        >
                                                            Setujui
                                                        </Button>
                                                    )}
                                                    {p.status === 'approved' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(p.id, 'paid')}
                                                            className="h-6 rounded bg-emerald-600 px-1.5 text-[10px] font-semibold text-white hover:bg-emerald-500"
                                                        >
                                                            Bayar
                                                        </Button>
                                                    )}
                                                    <a
                                                        href={`/finance/payrolls/${p.id}/slip`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex h-6 items-center gap-1 rounded border border-slate-200 bg-white px-1.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                    >
                                                        <Download className="size-2.5" />
                                                        Slip Gaji
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
