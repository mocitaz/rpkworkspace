import { router } from '@inertiajs/react';
import { AlertTriangle, Download, FileText, Paperclip, Pencil, Plus } from 'lucide-react';
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
import type { FinanceEntityProofTarget, ProofDocumentData } from './finance-proof-dialog';

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
    const [selectedPayrollForEdit, setSelectedPayrollForEdit] = useState<PayrollItem | null>(null);
    const [paidConfirmPayroll, setPaidConfirmPayroll] = useState<PayrollItem | null>(null);

    const totalNet = payrolls.reduce((acc, p) => acc + p.net_salary, 0);
    const totalBasic = payrolls.reduce((acc, p) => acc + p.basic_salary, 0);
    const totalAllowances = payrolls.reduce((acc, p) => acc + p.fixed_allowance + p.transport_meal_allowance + p.overtime_amount + p.bonus_amount, 0);
    const totalDeductions = payrolls.reduce((acc, p) => acc + p.deductions_amount + p.tax_deduction_amount, 0);

    const handleUpdateStatus = (payrollId: string, status: 'approved' | 'paid') => {
        router.patch(`/finance/payrolls/${payrollId}/status`, { status }, {
            preserveScroll: true,
        });
    };

    const handleEditClick = (p: PayrollItem) => {
        if (p.status === 'paid') {
            setPaidConfirmPayroll(p);
        } else {
            setSelectedPayrollForEdit(p);
        }
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
                                                    {onViewProof && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => onViewProof({
                                                                id: p.id,
                                                                entity: 'payrolls',
                                                                title: `Bukti Pembayaran Gaji: ${p.payslip_number}`,
                                                                subtitle: `${p.user?.name || 'Pegawai'} • ${formatMoney(p.net_salary, 'IDR')}`,
                                                                proof_document: p.proof_document || p.proofDocument,
                                                            })}
                                                            className={`size-6.5 rounded-lg ${
                                                                p.proof_document || p.proofDocument
                                                                    ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                                                                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200'
                                                            }`}
                                                            title={
                                                                p.proof_document || p.proofDocument
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
                                                            onClick={() => onViewDetail(p)}
                                                            className="h-6 rounded px-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10"
                                                            title="Lihat Rincian Slip Gaji"
                                                        >
                                                            <FileText className="mr-0.5 size-2.5" />
                                                            Detail
                                                        </Button>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditClick(p)}
                                                        className="h-6 rounded border-slate-200 bg-white px-1.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                    >
                                                        <Pencil className="mr-0.5 size-2.5" />
                                                        Edit
                                                    </Button>

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

            {/* Modal Konfirmasi Slip Gaji yang Sudah Dibayarkan */}
            <Dialog open={!!paidConfirmPayroll} onOpenChange={(open) => !open && setPaidConfirmPayroll(null)}>
                <DialogContent className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
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
                                    Peringatan status pembayaran &amp; penyesuaian kas.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {paidConfirmPayroll && (
                        <div className="space-y-2.5 py-1 text-xs">
                            <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-amber-900 dark:border-amber-500/20 dark:bg-amber-950/20 dark:text-amber-200">
                                <p className="text-xs font-semibold leading-relaxed">
                                    Slip gaji untuk <strong>{paidConfirmPayroll.user?.name}</strong> (Periode: <strong>{paidConfirmPayroll.period}</strong>) sudah berstatus <span className="font-bold text-amber-700 dark:text-amber-300">DIBAYARKAN (LUNAS)</span>.
                                </p>
                                <p className="mt-1 text-[11px] text-amber-800/90 dark:text-amber-300/80">
                                    Apakah Anda yakin ingin tetap mengedit komponen gaji ini? Perubahan nominal take home pay dapat mempengaruhi mutasi pembukuan.
                                </p>
                            </div>

                            <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5 font-mono text-[11px] text-slate-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-400">
                                <div className="flex justify-between">
                                    <span>No. Slip:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">{paidConfirmPayroll.payslip_number}</span>
                                </div>
                                <div className="mt-1 flex justify-between">
                                    <span>Take Home Pay:</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(paidConfirmPayroll.net_salary, 'IDR')}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
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
                                    setSelectedPayrollForEdit(paidConfirmPayroll);
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
                onOpenChange={(open) => !open && setSelectedPayrollForEdit(null)}
                payroll={selectedPayrollForEdit}
                accounts={accounts}
            />
        </div>
    );
}
