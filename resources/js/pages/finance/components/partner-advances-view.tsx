import { AlertTriangle, Paperclip, Pencil, Plus } from 'lucide-react';
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
import { financeDialogPanelClass } from './finance-dialog-design';
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

    const partnerComposition = advancesSummary.map((partner, index) => ({
        ...partner,
        shortName: partner.partner_name.replace(/,.*$/, ''),
        amount: Math.abs(partner.net_due_to_partner),
        color: ['bg-blue-500', 'bg-sky-300', 'bg-amber-400'][index % 3],
    }));
    const partnerCompositionTotal = Math.max(
        partnerComposition.reduce(
            (total, partner) => total + partner.amount,
            0,
        ),
        1,
    );

    const typeLabels: Record<string, { label: string; textClass: string }> = {
        advance_incurred: {
            label: 'Talangan Partner (+)',
            textClass: 'text-amber-600 dark:text-amber-400',
        },
        advance_reimbursed: {
            label: 'Pengembalian Talangan (-)',
            textClass: 'text-emerald-600 dark:text-emerald-400',
        },
        profit_distribution: {
            label: 'Pembagian Bagi Hasil',
            textClass: 'text-blue-600 dark:text-blue-400',
        },
        capital_injection: {
            label: 'Setoran Modal (+)',
            textClass: 'text-blue-600 dark:text-blue-400',
        },
        draw_prive: {
            label: 'Penarikan Prive (-)',
            textClass: 'text-slate-600 dark:text-zinc-400',
        },
    };

    return (
        <div
            data-testid="partner-advances-workspace"
            className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]"
        >
            {/* Header & Actions */}
            <div className="flex flex-col justify-between gap-2.5 border-b border-slate-200/70 px-4 py-3 sm:flex-row sm:items-center dark:border-white/[0.06]">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                        Talangan &amp; Hak Partner
                    </h2>
                    <p className="mt-0.5 max-w-4xl text-[11px] text-slate-500 dark:text-zinc-400">
                        Rekapitulasi utang kantor kepada partner atas dana
                        pribadi talangan operasional/perkara, pengembalian
                        talangan, prive, dan bagi hasil.
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={onOpenPartnerModal}
                    className="h-7.5 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
                >
                    <Plus className="mr-1 size-3.5" />
                    Catat Transaksi Partner
                </Button>
            </div>

            {/* Partner Advances Summary Card & Table (Mirroring Excel Sheet TALANGAN_PARTNER) */}
            <div className="grid gap-3 p-4 lg:grid-cols-5">
                <section className="relative flex min-h-[142px] flex-col justify-between overflow-hidden rounded-xl border border-blue-100 bg-[#eef5ff] p-4 lg:col-span-2 dark:border-blue-400/10 dark:bg-blue-500/[0.06]">
                    <div className="pointer-events-none absolute -top-12 -right-10 size-32 rounded-full border-[20px] border-white/60 dark:border-white/[0.025]" />
                    <p className="relative text-[10px] font-bold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-300">
                        Total Utang Partner Bersih
                    </p>
                    <p className="relative mt-1 font-mono text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                        {formatMoney(totalDueToPartners, 'IDR')}
                    </p>
                    <p className="relative mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
                        Kewajiban firma setelah pengembalian talangan
                    </p>
                    <div className="relative mt-4 flex items-end justify-between border-t border-blue-200/60 pt-3 text-[9.5px] font-medium text-slate-500 dark:border-white/[0.06] dark:text-zinc-400">
                        <span>Posisi kewajiban tercatat</span>
                        <span>{advancesSummary.length} partner</span>
                    </div>
                </section>

                <section
                    data-testid="partner-composition-panel"
                    className="flex min-h-[142px] flex-col rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 lg:col-span-3 dark:border-white/[0.06] dark:bg-white/[0.025]"
                >
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase dark:text-zinc-400">
                            Komposisi Kewajiban Partner
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                            Distribusi utang bersih firma per partner
                        </p>
                    </div>
                    <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.07]">
                        {partnerComposition.map((partner) => (
                            <div
                                key={partner.partner_id || partner.account_id}
                                className={partner.color}
                                style={{
                                    width: `${(partner.amount / partnerCompositionTotal) * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                    <div className="mt-3 grid flex-1 divide-y divide-slate-200/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-white/[0.06]">
                        {partnerComposition.map((partner) => (
                            <div
                                key={partner.partner_id || partner.account_id}
                                className="py-2 first:pl-0 sm:px-3 sm:py-0"
                            >
                                <p className="truncate text-[9px] font-semibold text-slate-400 uppercase dark:text-zinc-500">
                                    {partner.shortName}
                                </p>
                                <p className="mt-1 font-mono text-sm font-bold text-slate-950 dark:text-white">
                                    {formatMoney(
                                        partner.net_due_to_partner,
                                        'IDR',
                                    )}
                                </p>
                                <p className="mt-0.5 text-[9px] text-slate-400 dark:text-zinc-500">
                                    Kontribusi{' '}
                                    {(
                                        (partner.amount /
                                            partnerCompositionTotal) *
                                        100
                                    ).toFixed(1)}
                                    %
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="border-t border-slate-200/70 px-4 py-3 dark:border-white/[0.06]">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Rincian Posisi Talangan
                        </h3>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                            Rekonsiliasi saldo awal, talangan, pengembalian,
                            bagi hasil, dan prive.
                        </p>
                    </div>
                </div>

                <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200/70 dark:border-white/[0.06]">
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
                                                <span className="border-l border-slate-200 pl-2 font-mono text-[10px] text-slate-500 dark:border-white/10 dark:text-zinc-400">
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
                                    <td className="px-3 py-2.5 text-right font-mono font-semibold whitespace-nowrap text-slate-800 dark:text-zinc-200">
                                        {formatMoney(
                                            partner.advances_incurred,
                                            'IDR',
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono font-semibold whitespace-nowrap text-slate-800 dark:text-zinc-200">
                                        {formatMoney(
                                            partner.advances_reimbursed,
                                            'IDR',
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono font-bold whitespace-nowrap text-slate-950 dark:text-white">
                                        {formatMoney(
                                            partner.net_due_to_partner,
                                            'IDR',
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap text-slate-800 dark:text-zinc-200">
                                        {formatMoney(
                                            partner.profit_distributed,
                                            'IDR',
                                        )}
                                    </td>
                                    <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap text-slate-800 dark:text-zinc-200">
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
            <div className="border-t border-slate-200/70 dark:border-white/[0.06]">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Register Transaksi &amp; Mutasi Partner
                            </h3>
                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                Log lengkap pencatatan talangan, reimbursement,
                                penarikan prive, dan pembagian laba.
                            </p>
                        </div>
                        <span className="font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                            {transactions.length} Transaksi
                        </span>
                    </div>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                        Belum ada riwayat transaksi partner.
                    </div>
                ) : (
                    <div className="mx-4 mb-4 overflow-x-auto rounded-xl border border-slate-200/70 dark:border-white/[0.06]">
                        <table className="w-full min-w-[1120px] text-left text-xs">
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
                                        textClass:
                                            'text-slate-600 dark:text-zinc-400',
                                    };

                                    return (
                                        <tr
                                            key={t.id}
                                            className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                                        >
                                            <td className="px-3.5 py-2.5 whitespace-nowrap">
                                                <div>
                                                    <span className="font-mono text-xs font-bold text-slate-950 dark:text-white">
                                                        {t.transaction_number}
                                                    </span>
                                                    <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                                                        {formatDate(
                                                            t.transaction_date,
                                                        )}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5 font-bold whitespace-nowrap text-slate-900 dark:text-white">
                                                {t.partner?.name || '-'}
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                <span
                                                    className={`text-[10px] font-bold whitespace-nowrap ${typeInfo.textClass}`}
                                                >
                                                    {typeInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 whitespace-nowrap">
                                                {t.matter ? (
                                                    <span className="font-mono text-xs font-semibold text-slate-700 dark:text-zinc-300">
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
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase dark:text-emerald-400">
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
                <DialogContent className={financeDialogPanelClass('compact')}>
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
                        <div className="space-y-3 px-5 py-4 text-xs sm:px-6">
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

                    <DialogFooter className="gap-2 border-t border-slate-100 px-5 py-3.5 sm:px-6 dark:border-white/[0.06]">
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
