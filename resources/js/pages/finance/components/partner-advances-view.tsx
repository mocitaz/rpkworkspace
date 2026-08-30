import { AlertTriangle, FileText, Paperclip, Pencil, Plus } from 'lucide-react';
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
import type { UserOption } from '@/components/user-picker';
import { formatDate, formatMoney } from '@/lib/format';
import { EditPartnerTransactionDialog } from './edit-partner-transaction-dialog';
import type {
    FinanceEntityProofTarget,
    ProofDocumentData,
} from './finance-proof-dialog';

export type PartnerAdvanceSummaryItem = {
    account_id: string;
    account_name: string;
    partner_id: number;
    partner_name: string;
    opening_balance: number;
    advances_incurred: number;
    advances_reimbursed: number;
    profit_distributed: number;
    prive_drawn: number;
    net_due_to_partner: number;
};

export type PartnerTransactionItem = {
    id: string;
    transaction_number: string;
    partner?: { id: number; name: string };
    matter?: { id: string; matter_number: string; title: string };
    type:
        | 'advance_incurred'
        | 'advance_reimbursed'
        | 'profit_distribution'
        | 'capital_injection'
        | 'draw_prive';
    amount: number;
    transaction_date: string;
    account?: { id: string; name: string };
    notes?: string;
    status: string;
    proof_document?: ProofDocumentData | null;
    proofDocument?: ProofDocumentData | null;
};

export function PartnerAdvancesView({
    advancesSummary,
    transactions,
    onOpenPartnerModal,
    partners = [],
    matters = [],
    accounts = [],
    onViewDetail,
    onViewProof,
}: {
    advancesSummary: PartnerAdvanceSummaryItem[];
    transactions: PartnerTransactionItem[];
    onOpenPartnerModal: () => void;
    partners?: UserOption[];
    matters?: { id: string; matter_number: string; title: string }[];
    accounts?: { id: string; name: string }[];
    onViewDetail?: (transaction: PartnerTransactionItem) => void;
    onViewProof?: (target: FinanceEntityProofTarget) => void;
}) {
    const [selectedTransForEdit, setSelectedTransForEdit] =
        useState<PartnerTransactionItem | null>(null);
    const [confirmTransForEdit, setConfirmTransForEdit] =
        useState<PartnerTransactionItem | null>(null);

    const totalDueToPartners = advancesSummary.reduce(
        (acc, p) => acc + p.net_due_to_partner,
        0,
    );

    const typeLabels: Record<string, { label: string; color: string }> = {
        advance_incurred: {
            label: 'Talangan Partner (+)',
            color: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
        },
        advance_reimbursed: {
            label: 'Pengembalian Talangan (-)',
            color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        },
        profit_distribution: {
            label: 'Pembagian Bagi Hasil',
            color: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        },
        capital_injection: {
            label: 'Setoran Modal (+)',
            color: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
        },
        draw_prive: {
            label: 'Penarikan Prive (-)',
            color: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        },
    };

    return (
        <div className="space-y-4">
            {/* Header & Actions */}
            <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase dark:text-white">
                        Talangan &amp; Hak Partner
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Rekapitulasi utang kantor kepada partner atas dana
                        pribadi talangan operasional/perkara, pengembalian
                        talangan, prive, dan bagi hasil.
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={onOpenPartnerModal}
                    className="h-7.5 rounded-lg bg-amber-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700 dark:bg-amber-600 dark:text-white dark:hover:bg-amber-500"
                >
                    <Plus className="mr-1 size-3.5" />
                    Catat Transaksi Partner
                </Button>
            </div>

            {/* Partner Advances Summary Card & Table (Mirroring Excel Sheet TALANGAN_PARTNER) */}
            <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                <div className="flex items-center justify-between border-b border-slate-200/60 bg-amber-50/30 px-4 py-2.5 dark:border-white/[0.06] dark:bg-amber-500/5">
                    <div>
                        <h3 className="text-xs font-bold text-amber-900 uppercase dark:text-amber-300">
                            Posisi Talangan &amp; Kewajiban Firma ke Partner
                        </h3>
                        <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                            Pembayaran pribadi untuk operasional kantor/perkara
                            tercatat sebagai utang firma ke partner.
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-[9.5px] font-semibold text-slate-400 uppercase">
                            Total Utang Partner Bersih:
                        </span>
                        <p className="font-mono text-base font-bold text-amber-600 dark:text-amber-400">
                            {formatMoney(totalDueToPartners, 'IDR')}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200/70 bg-slate-50/70 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/[0.06] dark:bg-[#121418] dark:text-zinc-400">
                            <tr>
                                <th className="px-3.5 py-2.5 whitespace-nowrap">
                                    Nama Partner
                                </th>
                                <th className="px-3 py-2.5 text-right whitespace-nowrap">
                                    Saldo Awal
                                </th>
                                <th className="px-3 py-2.5 text-right whitespace-nowrap">
                                    Talangan Berjalan (+)
                                </th>
                                <th className="px-3 py-2.5 text-right whitespace-nowrap">
                                    Pengembalian (-)
                                </th>
                                <th className="px-3 py-2.5 text-right whitespace-nowrap">
                                    Utang Partner Bersih
                                </th>
                                <th className="px-3 py-2.5 text-right whitespace-nowrap">
                                    Bagi Hasil
                                </th>
                                <th className="px-3 py-2.5 text-right whitespace-nowrap">
                                    Prive
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                            {advancesSummary.map((partner) => (
                                <tr
                                    key={
                                        partner.partner_id || partner.account_id
                                    }
                                    className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                                >
                                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {partner.partner_name}
                                            </span>
                                            {partner.account_name && (
                                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-white/5 dark:text-zinc-400">
                                                    {partner.account_name}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap text-slate-600 dark:text-zinc-400">
                                        {formatMoney(
                                            partner.opening_balance,
                                            'IDR',
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono font-semibold whitespace-nowrap text-rose-600 dark:text-rose-400">
                                        {formatMoney(
                                            partner.advances_incurred,
                                            'IDR',
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono font-semibold whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                                        {formatMoney(
                                            partner.advances_reimbursed,
                                            'IDR',
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono font-bold whitespace-nowrap text-amber-600 dark:text-amber-400">
                                        {formatMoney(
                                            partner.net_due_to_partner,
                                            'IDR',
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap text-blue-600 dark:text-blue-400">
                                        {formatMoney(
                                            partner.profit_distributed,
                                            'IDR',
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap text-purple-600 dark:text-purple-400">
                                        {formatMoney(
                                            partner.prive_drawn,
                                            'IDR',
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Partner Transactions Table (Mirroring Excel Sheet PARTNER) */}
            <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                <div className="border-b border-slate-200/60 px-4 py-2.5 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                Register Transaksi &amp; Mutasi Partner
                            </h3>
                            <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                Log lengkap pencatatan talangan, reimbursement,
                                penarikan prive, dan pembagian laba.
                            </p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                            {transactions.length} Transaksi
                        </span>
                    </div>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                        Belum ada riwayat transaksi partner.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200/70 bg-slate-50/70 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/[0.06] dark:bg-[#121418] dark:text-zinc-400">
                                <tr>
                                    <th className="px-3.5 py-2.5 whitespace-nowrap">
                                        No Transaksi &amp; Tanggal
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        Partner
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        Jenis Transaksi
                                    </th>
                                    <th className="px-3 py-2.5 whitespace-nowrap">
                                        Perkara / Rekening
                                    </th>
                                    <th className="px-3 py-2.5 text-right whitespace-nowrap">
                                        Nominal
                                    </th>
                                    <th className="px-3 py-2.5">Keterangan</th>
                                    <th className="px-3 py-2.5 text-center whitespace-nowrap">
                                        Status
                                    </th>
                                    <th className="px-3 py-2.5 text-center whitespace-nowrap">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                {transactions.map((t) => {
                                    const typeInfo = typeLabels[t.type] || {
                                        label: t.type,
                                        color: 'bg-slate-100 text-slate-700',
                                    };

                                    return (
                                        <tr
                                            key={t.id}
                                            className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                                        >
                                            <td className="px-3.5 py-2.5 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                        {t.transaction_number}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                                                        •{' '}
                                                        {formatDate(
                                                            t.transaction_date,
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5 font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                {t.partner?.name || '-'}
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold whitespace-nowrap ${typeInfo.color}`}
                                                >
                                                    {typeInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                {t.matter ? (
                                                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                                                        {t.matter.matter_number}
                                                    </span>
                                                ) : t.account ? (
                                                    <span className="text-xs text-slate-600 dark:text-zinc-300">
                                                        {t.account.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                {formatMoney(t.amount, 'IDR')}
                                            </td>
                                            <td
                                                className="max-w-[320px] truncate px-3 py-2.5 text-xs text-slate-500 dark:text-zinc-400"
                                                title={t.notes || ''}
                                            >
                                                {t.notes || '-'}
                                            </td>
                                            <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    <span className="size-1.5 rounded-full bg-emerald-500"></span>
                                                    Disetujui
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {onViewProof && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                onViewProof({
                                                                    id: t.id,
                                                                    entity: 'partner-transactions',
                                                                    title: `Bukti Transaksi Partner: ${t.transaction_number}`,
                                                                    subtitle: `${t.partner?.name || 'Partner'} • ${formatMoney(t.amount, 'IDR')}`,
                                                                    proof_document:
                                                                        t.proof_document ||
                                                                        t.proofDocument,
                                                                })
                                                            }
                                                            className={`size-7 rounded-lg ${
                                                                t.proof_document ||
                                                                t.proofDocument
                                                                    ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                                                                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-zinc-500 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200'
                                                            }`}
                                                            title={
                                                                t.proof_document ||
                                                                t.proofDocument
                                                                    ? 'Lihat Bukti Transaksi Partner'
                                                                    : 'Unggah Bukti Transaksi Partner'
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
                                                                onViewDetail(t)
                                                            }
                                                            className="h-7 rounded-lg px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10"
                                                            title="Lihat Rincian Transaksi Partner"
                                                        >
                                                            <FileText className="mr-1 size-3" />
                                                            Detail
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setConfirmTransForEdit(
                                                                t,
                                                            )
                                                        }
                                                        className="h-7 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                    >
                                                        <Pencil className="mr-1 size-3 text-slate-400" />
                                                        Edit
                                                    </Button>
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

            {/* Modal Konfirmasi Edit Transaksi Disetujui */}
            <Dialog
                open={Boolean(confirmTransForEdit)}
                onOpenChange={(open) => !open && setConfirmTransForEdit(null)}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                <AlertTriangle className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                    Edit Transaksi Rekonsiliasi
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Transaksi ini memengaruhi saldo pembukuan
                                    firma.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {confirmTransForEdit && (
                        <div className="space-y-3 pt-2 text-xs">
                            <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                                <p className="font-semibold text-amber-900 dark:text-amber-200">
                                    Perhatian Penyesuaian Saldo:
                                </p>
                                <p className="mt-1 text-[11px] text-amber-800/90 dark:text-amber-300/80">
                                    Apakah Anda yakin ingin mengedit transaksi
                                    ini? Perubahan nominal atau jenis transaksi
                                    akan otomatis menyesuaikan saldo kas dan
                                    saldo utang partner.
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConfirmTransForEdit(null)}
                            className="h-8.5 rounded-lg border-slate-200 px-3.5 text-xs font-semibold hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                        >
                            Batal
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                if (confirmTransForEdit) {
                                    setSelectedTransForEdit(
                                        confirmTransForEdit,
                                    );
                                    setConfirmTransForEdit(null);
                                }
                            }}
                            className="h-8.5 rounded-lg bg-amber-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                        >
                            Ya, Tetap Edit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Form Edit Transaksi Partner */}
            <EditPartnerTransactionDialog
                open={!!selectedTransForEdit}
                onOpenChange={(open) => !open && setSelectedTransForEdit(null)}
                transaction={selectedTransForEdit}
                partners={partners}
                matters={matters}
                accounts={accounts}
            />
        </div>
    );
}
