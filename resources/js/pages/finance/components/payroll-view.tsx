import { router } from '@inertiajs/react';
import { AlertTriangle, Download, Paperclip, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatMoney } from '@/lib/format';
import { EditPayrollDialog } from './edit-payroll-dialog';
import { financeDialogPanelClass } from './finance-dialog-design';
import type {
    FinanceEntityProofTarget,
    ProofDocumentData,
} from './finance-proof-dialog';

export type PayrollItem = {
    id: string;
    payslip_number: string;
    user?: {
        id: number;
        name: string;
        email?: string;
        avatar_path?: string | null;
        position_title?: string;
        department?: string;
        employee_code?: string;
        bank_name?: string;
        bank_account_number?: string;
        bank_account_holder?: string;
    };
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
    proof_document?: ProofDocumentData | null;
    proofDocument?: ProofDocumentData | null;
};

export function PayrollView({
    payrolls,
    onOpenPayrollModal,
    accounts = [],
    onViewDetail,
    onViewProof,
}: {
    payrolls: PayrollItem[];
    onOpenPayrollModal: () => void;
    accounts?: { id: string; name: string }[];
    onViewDetail?: (payroll: PayrollItem) => void;
    onViewProof?: (target: FinanceEntityProofTarget) => void;
}) {
    const [selectedPayrollForEdit, setSelectedPayrollForEdit] =
        useState<PayrollItem | null>(null);
    const [paidConfirmPayroll, setPaidConfirmPayroll] =
        useState<PayrollItem | null>(null);

    const totalNet = payrolls.reduce((acc, p) => acc + p.net_salary, 0);
    const totalBasic = payrolls.reduce((acc, p) => acc + p.basic_salary, 0);
    const totalAllowances = payrolls.reduce(
        (acc, p) =>
            acc +
            p.fixed_allowance +
            p.transport_meal_allowance +
            p.overtime_amount +
            p.bonus_amount,
        0,
    );
    const totalDeductions = payrolls.reduce(
        (acc, p) => acc + p.deductions_amount + p.tax_deduction_amount,
        0,
    );
    const totalGross = totalBasic + totalAllowances;
    const payrollComposition = [
        { label: 'Gaji Pokok', amount: totalBasic, color: 'bg-blue-500' },
        {
            label: 'Tunjangan & Bonus',
            amount: totalAllowances,
            color: 'bg-sky-300',
        },
        {
            label: 'Potongan',
            amount: totalDeductions,
            color: 'bg-amber-400',
        },
    ];
    const payrollCompositionTotal = Math.max(
        payrollComposition.reduce((total, item) => total + item.amount, 0),
        1,
    );

    const handleUpdateStatus = (
        payrollId: string,
        status: 'approved' | 'paid',
    ) => {
        router.patch(
            `/finance/payrolls/${payrollId}/status`,
            { status },
            {
                preserveScroll: true,
            },
        );
    };

    const handleEditClick = (p: PayrollItem) => {
        if (p.status === 'paid') {
            setPaidConfirmPayroll(p);
        } else {
            setSelectedPayrollForEdit(p);
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
            {/* Header & Actions */}
            <div className="flex flex-col justify-between gap-2.5 border-b border-slate-200/70 px-4 py-3 sm:flex-row sm:items-center dark:border-white/[0.06]">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Penggajian &amp; Honor Tenaga Kerja
                    </h2>
                    <p className="mt-0.5 max-w-4xl text-[11px] text-slate-500 dark:text-zinc-400">
                        Pencatatan gaji pokok, tunjangan jabatan, uang
                        makan/transport, upah lembur, bonus perkara, potongan
                        PPh 21, dan cetak slip gaji digital.
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
            <div className="grid gap-3 p-4 lg:grid-cols-5">
                <section className="relative flex min-h-[142px] flex-col justify-between overflow-hidden rounded-xl border border-blue-100 bg-[#eef5ff] p-4 lg:col-span-2 dark:border-blue-400/10 dark:bg-blue-500/[0.06]">
                    <div className="pointer-events-none absolute -top-12 -right-10 size-32 rounded-full border-[20px] border-white/60 dark:border-white/[0.025]" />
                    <p className="relative text-[10px] font-bold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-300">
                        Total Take Home Pay
                    </p>
                    <p className="relative mt-1 font-mono text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                        {formatMoney(totalNet, 'IDR')}
                    </p>
                    <p className="relative mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
                        Nilai bersih seluruh slip pada periode tercatat
                    </p>
                    <div className="relative mt-4 flex items-end justify-between border-t border-blue-200/60 pt-3 text-[9.5px] font-medium text-slate-500 dark:border-white/[0.06] dark:text-zinc-400">
                        <span>Payroll tercatat</span>
                        <span>{payrolls.length} slip</span>
                    </div>
                </section>

                <section
                    data-testid="payroll-composition-panel"
                    className="flex min-h-[142px] flex-col rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 lg:col-span-3 dark:border-white/[0.06] dark:bg-white/[0.025]"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase dark:text-zinc-400">
                                Komposisi Payroll
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                                Struktur nilai bruto dan pengurang gaji
                            </p>
                        </div>
                        <p className="font-mono text-xs font-bold text-slate-700 dark:text-zinc-200">
                            Bruto {formatMoney(totalGross, 'IDR')}
                        </p>
                    </div>
                    <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.07]">
                        {payrollComposition.map((item) => (
                            <div
                                key={item.label}
                                className={item.color}
                                style={{
                                    width: `${(item.amount / payrollCompositionTotal) * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                    <div className="mt-3 grid flex-1 divide-y divide-slate-200/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/[0.06]">
                        {payrollComposition.map((item) => (
                            <div
                                key={item.label}
                                className="py-2 first:pl-0 sm:px-3 sm:py-0"
                            >
                                <div className="flex items-center gap-1.5 text-[9.5px] font-semibold text-slate-500 dark:text-zinc-400">
                                    <span
                                        className={`size-1.5 rounded-full ${item.color}`}
                                    />
                                    {item.label}
                                </div>
                                <p className="mt-1 font-mono text-sm font-bold text-slate-950 dark:text-white">
                                    {formatMoney(item.amount, 'IDR')}
                                </p>
                                <p className="mt-0.5 text-[9px] text-slate-400 dark:text-zinc-500">
                                    Kontribusi{' '}
                                    {(
                                        (item.amount /
                                            payrollCompositionTotal) *
                                        100
                                    ).toFixed(1)}
                                    %
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Payroll Table */}
            <div className="border-t border-slate-200/70 dark:border-white/[0.06]">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Daftar Payroll Pegawai &amp; Advokat
                            </h3>
                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                Rincian slip penghasilan per personel per
                                periode.
                            </p>
                        </div>
                        <span className="font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                            {payrolls.length} Slip
                        </span>
                    </div>
                </div>

                {payrolls.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                        Belum ada slip gaji tercatat. Klik "Input Gaji Pegawai"
                        untuk membuat payroll baru.
                    </div>
                ) : (
                    <div className="mx-4 mb-4 overflow-x-auto rounded-xl border border-slate-200/70 dark:border-white/[0.06]">
                        <table className="w-full min-w-[920px] text-left text-xs">
                            <thead className="border-b border-slate-200/70 bg-slate-50/70 text-[9.5px] font-bold tracking-wider text-slate-400 uppercase dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-zinc-500">
                                <tr>
                                    <th className="px-3.5 py-2.5">Personel</th>
                                    <th className="px-3 py-2.5">
                                        Periode &amp; Slip
                                    </th>
                                    <th className="px-3 py-2.5 text-right">
                                        Gaji Pokok
                                    </th>
                                    <th className="px-3 py-2.5 text-right">
                                        Penyesuaian
                                    </th>
                                    <th className="px-3 py-2.5 text-right">
                                        Take Home Pay
                                    </th>
                                    <th className="px-3 py-2.5 text-center">
                                        Status
                                    </th>
                                    <th className="px-3 py-2.5 text-right">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.05]">
                                {payrolls.map((p) => {
                                    const totalAllowance =
                                        p.fixed_allowance +
                                        p.transport_meal_allowance +
                                        p.overtime_amount;
                                    const totalDeduct =
                                        p.deductions_amount +
                                        p.tax_deduction_amount;
                                    const statusLabel = {
                                        draft: 'Draf',
                                        approved: 'Disetujui',
                                        paid: 'Dibayarkan',
                                    }[p.status];
                                    const statusClass =
                                        p.status === 'paid'
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : p.status === 'approved'
                                              ? 'text-blue-600 dark:text-blue-400'
                                              : 'text-amber-600 dark:text-amber-400';

                                    return (
                                        <tr
                                            key={p.id}
                                            className="transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.02]"
                                        >
                                            <td className="px-3.5 py-2.5">
                                                <p className="font-bold text-slate-950 dark:text-white">
                                                    {p.user?.name || 'Pegawai'}
                                                </p>
                                                <p className="mt-0.5 text-[10px] text-slate-500 dark:text-zinc-400">
                                                    {p.user?.position_title ||
                                                        'Staf'}
                                                </p>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <p className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
                                                    {p.period}
                                                </p>
                                                <p className="mt-0.5 font-mono text-[9.5px] text-slate-400 dark:text-zinc-500">
                                                    {p.payslip_number}
                                                </p>
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-800 dark:text-zinc-200">
                                                {formatMoney(
                                                    p.basic_salary,
                                                    'IDR',
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5 text-right">
                                                <p className="font-mono text-[10.5px] font-semibold text-slate-700 dark:text-zinc-300">
                                                    +{' '}
                                                    {formatMoney(
                                                        totalAllowance +
                                                            p.bonus_amount,
                                                        'IDR',
                                                    )}
                                                </p>
                                                <p className="mt-0.5 font-mono text-[9.5px] text-slate-400 dark:text-zinc-500">
                                                    −{' '}
                                                    {formatMoney(
                                                        totalDeduct,
                                                        'IDR',
                                                    )}
                                                </p>
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-950 dark:text-white">
                                                {formatMoney(
                                                    p.net_salary,
                                                    'IDR',
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                <span
                                                    className={`text-[9.5px] font-bold uppercase ${statusClass}`}
                                                >
                                                    {statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center justify-end gap-1">
                                                    {onViewProof && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                onViewProof({
                                                                    id: p.id,
                                                                    entity: 'payrolls',
                                                                    title: `Bukti Pembayaran Gaji: ${p.payslip_number}`,
                                                                    subtitle: `${p.user?.name || 'Pegawai'} • ${formatMoney(p.net_salary, 'IDR')}`,
                                                                    proof_document:
                                                                        p.proof_document ||
                                                                        p.proofDocument,
                                                                })
                                                            }
                                                            className={`size-6.5 rounded-lg ${
                                                                p.proof_document ||
                                                                p.proofDocument
                                                                    ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                                                                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200'
                                                            }`}
                                                            title={
                                                                p.proof_document ||
                                                                p.proofDocument
                                                                    ? 'Lihat Bukti Pembayaran Gaji'
                                                                    : 'Unggah Bukti Pembayaran Gaji'
                                                            }
                                                        >
                                                            <Paperclip className="size-3.5" />
                                                        </Button>
                                                    )}
                                                    {onViewDetail && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                onViewDetail(p)
                                                            }
                                                            className="h-6 rounded px-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10"
                                                            title="Lihat Rincian Slip Gaji"
                                                        >
                                                            Detail
                                                        </Button>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleEditClick(p)
                                                        }
                                                        className="h-6 rounded border-slate-200 bg-white px-1.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                    >
                                                        <Pencil className="mr-0.5 size-2.5" />
                                                        Edit
                                                    </Button>

                                                    {p.status === 'draft' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    p.id,
                                                                    'approved',
                                                                )
                                                            }
                                                            className="h-6 rounded px-1.5 text-[10px] font-semibold"
                                                        >
                                                            Setujui
                                                        </Button>
                                                    )}
                                                    {p.status ===
                                                        'approved' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleUpdateStatus(
                                                                    p.id,
                                                                    'paid',
                                                                )
                                                            }
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

            {/* Modal Konfirmasi Slip Gaji yang Sudah Dibayarkan */}
            <Dialog
                open={!!paidConfirmPayroll}
                onOpenChange={(open) => !open && setPaidConfirmPayroll(null)}
            >
                <DialogContent className={financeDialogPanelClass('compact')}>
                    <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                <AlertTriangle className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                    Konfirmasi Edit Slip Gaji Lunas
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Peringatan status pembayaran &amp;
                                    penyesuaian kas.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {paidConfirmPayroll && (
                        <div className="space-y-2.5 px-5 py-4 text-xs sm:px-6">
                            <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-amber-900 dark:border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-200">
                                <p className="text-xs leading-relaxed font-semibold">
                                    Slip gaji untuk{' '}
                                    <strong>
                                        {paidConfirmPayroll.user?.name}
                                    </strong>{' '}
                                    (Periode:{' '}
                                    <strong>{paidConfirmPayroll.period}</strong>
                                    ) sudah berstatus{' '}
                                    <span className="font-bold text-amber-700 dark:text-amber-300">
                                        DIBAYARKAN (LUNAS)
                                    </span>
                                    .
                                </p>
                                <p className="mt-1 text-[11px] text-amber-800/90 dark:text-amber-300/80">
                                    Apakah Anda yakin ingin tetap mengedit
                                    komponen gaji ini? Perubahan nominal take
                                    home pay dapat mempengaruhi mutasi
                                    pembukuan.
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5 font-mono text-[11px] text-slate-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
                                <div className="flex justify-between">
                                    <span>No. Slip:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {paidConfirmPayroll.payslip_number}
                                    </span>
                                </div>
                                <div className="mt-1 flex justify-between">
                                    <span>Take Home Pay:</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatMoney(
                                            paidConfirmPayroll.net_salary,
                                            'IDR',
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 border-t border-slate-100 px-5 py-3.5 sm:px-6 dark:border-white/[0.06]">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPaidConfirmPayroll(null)}
                            className="h-8.5 rounded-lg border-slate-200 px-3.5 text-xs font-semibold hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                        >
                            Batal
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                if (paidConfirmPayroll) {
                                    setSelectedPayrollForEdit(
                                        paidConfirmPayroll,
                                    );
                                    setPaidConfirmPayroll(null);
                                }
                            }}
                            className="h-8.5 rounded-lg bg-amber-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                        >
                            Ya, Tetap Edit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Form Edit Payroll */}
            <EditPayrollDialog
                open={!!selectedPayrollForEdit}
                onOpenChange={(open) =>
                    !open && setSelectedPayrollForEdit(null)
                }
                payroll={selectedPayrollForEdit}
                accounts={accounts}
            />
        </div>
    );
}
