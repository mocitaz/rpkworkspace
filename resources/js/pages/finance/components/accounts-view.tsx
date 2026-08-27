import { useState } from 'react';
import { ArrowRightLeft, Building, DollarSign, FileText, Plus, User, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney } from '@/lib/format';
import { type ProofDocumentData } from './finance-proof-dialog';

export type FinancialAccountItem = {
    id: string;
    name: string;
    type: 'cash' | 'bank' | 'partner_advance' | 'client_trust';
    account_number?: string;
    bank_name?: string;
    partner?: { id: number; name: string };
    opening_balance: number;
    current_balance: number;
    description?: string;
    is_active: boolean;
};

export type AccountTransferItem = {
    id: string;
    transfer_number: string;
    from_account?: { id: string; name: string };
    to_account?: { id: string; name: string };
    amount: number;
    transfer_date?: string;
    transferred_at: string;
    reference_number?: string;
    notes?: string;
    status: string;
    creator?: { id: number; name: string };
    proof_document?: ProofDocumentData | null;
    proofDocument?: ProofDocumentData | null;
};

export function AccountsView({
    accounts,
    transfers,
    onOpenTransferModal,
    onOpenAccountModal,
    onViewDetail,
}: {
    accounts: FinancialAccountItem[];
    transfers: AccountTransferItem[];
    onOpenTransferModal?: () => void;
    onOpenAccountModal?: () => void;
    onViewDetail?: (item: AccountTransferItem) => void;
}) {
    const totalCash = accounts
        .filter((a) => a.type === 'cash')
        .reduce((sum, a) => sum + a.current_balance, 0);

    const totalBank = accounts
        .filter((a) => a.type === 'bank')
        .reduce((sum, a) => sum + a.current_balance, 0);

    const totalTrust = accounts
        .filter((a) => a.type === 'client_trust')
        .reduce((sum, a) => sum + a.current_balance, 0);

    const totalPartner = accounts
        .filter((a) => a.type === 'partner_advance')
        .reduce((sum, a) => sum + a.current_balance, 0);

    const typeIcons: Record<string, typeof Wallet> = {
        cash: Wallet,
        bank: Building,
        client_trust: DollarSign,
        partner_advance: User,
    };

    const typeColors: Record<string, string> = {
        cash: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        bank: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        client_trust: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        partner_advance: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };

    return (
        <div className="space-y-4">
            {/* Header with KPI & Quick Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Daftar Rekening &amp; Saldo Kas Kantor
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Manajemen rekening operasional, giro perbankan, dan pemindahan dana internal.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {onOpenTransferModal && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onOpenTransferModal}
                            className="h-8 gap-1.5 rounded-lg border-slate-200 bg-white text-xs font-semibold shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181f] dark:hover:bg-white/10"
                        >
                            <ArrowRightLeft className="size-3.5" />
                            Transfer Antar Rekening
                        </Button>
                    )}
                    {onOpenAccountModal && (
                        <Button
                            size="sm"
                            onClick={onOpenAccountModal}
                            className="h-8 gap-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white shadow-2xs hover:bg-blue-500"
                        >
                            <Plus className="size-3.5" />
                            Tambah Rekening
                        </Button>
                    )}
                </div>
            </div>

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-white/10 dark:bg-[#14161b]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kas Tunai</span>
                    <p className="mt-1 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMoney(totalCash, 'IDR')}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-white/10 dark:bg-[#14161b]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Giro &amp; Tabungan Bank</span>
                    <p className="mt-1 font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                        {formatMoney(totalBank, 'IDR')}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-white/10 dark:bg-[#14161b]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rekening Titipan Klien</span>
                    <p className="mt-1 font-mono text-sm font-bold text-purple-600 dark:text-purple-400">
                        {formatMoney(totalTrust, 'IDR')}
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-2xs dark:border-white/10 dark:bg-[#14161b]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Saldo Talangan Partner</span>
                    <p className="mt-1 font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
                        {formatMoney(totalPartner, 'IDR')}
                    </p>
                </div>
            </div>

            {/* Accounts Bento Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.map((acc) => {
                    const Icon = typeIcons[acc.type] || Wallet;
                    const colorBadge = typeColors[acc.type] || 'bg-slate-500/10 text-slate-600 border-slate-500/20';

                    return (
                        <div
                            key={acc.id}
                            className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/10 dark:bg-[#14161b] dark:hover:border-white/20"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${colorBadge}`}>
                                            <Icon className="size-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                {acc.name}
                                            </h4>
                                            <p className="text-[10px] text-slate-400">
                                                {acc.bank_name || (acc.type === 'cash' ? 'Brankas Kantor' : 'Rekening')}
                                                {acc.account_number ? ` • ${acc.account_number}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                                            acc.is_active
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-zinc-400'
                                        }`}
                                    >
                                        {acc.is_active ? 'Aktif' : 'Non-Aktif'}
                                    </span>
                                </div>

                                {acc.description && (
                                    <p className="mt-2 text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2">
                                        {acc.description}
                                    </p>
                                )}
                            </div>

                            <div className="mt-3.5 border-t border-slate-100 pt-2.5 dark:border-white/5">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[10px] font-semibold text-slate-400">Saldo Saat Ini:</span>
                                    <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                                        {formatMoney(acc.current_balance, 'IDR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Transfer History Table */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#14161b]">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            Riwayat Pemindahan Dana (Transfer Mutasi)
                        </h4>
                        <p className="text-[11px] text-slate-400">
                            Log pemindahan saldo antar rekening kas dan bank.
                        </p>
                    </div>
                </div>

                {transfers.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                        Belum ada riwayat mutasi transfer antar rekening.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-white/5 dark:bg-white/[0.02]">
                                <tr>
                                    <th className="px-3.5 py-2">No. Transfer</th>
                                    <th className="px-3.5 py-2">Tanggal</th>
                                    <th className="px-3.5 py-2">Dari Rekening</th>
                                    <th className="px-3.5 py-2">Ke Rekening</th>
                                    <th className="px-3.5 py-2 text-right">Nominal</th>
                                    <th className="px-3.5 py-2">Catatan</th>
                                    <th className="px-3.5 py-2 text-center">Status</th>
                                    <th className="px-3.5 py-2 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {transfers.map((trf) => (
                                    <tr key={trf.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                                        <td className="px-3.5 py-2.5 font-mono text-[11px] font-semibold text-slate-900 dark:text-white">
                                            {trf.transfer_number}
                                        </td>
                                        <td className="px-3.5 py-2.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                            {formatDate(trf.transferred_at || trf.transfer_date || '')}
                                        </td>
                                        <td className="px-3.5 py-2.5 font-medium text-slate-700 dark:text-zinc-200">
                                            {trf.from_account?.name || '-'}
                                        </td>
                                        <td className="px-3.5 py-2.5 font-medium text-slate-700 dark:text-zinc-200">
                                            {trf.to_account?.name || '-'}
                                        </td>
                                        <td className="px-3.5 py-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                                            {formatMoney(trf.amount, 'IDR')}
                                        </td>
                                        <td className="px-3 py-2.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                            {trf.notes || '-'}
                                        </td>
                                        <td className="px-3.5 py-2.5 text-center">
                                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                Berhasil
                                            </span>
                                        </td>
                                        <td className="px-3.5 py-2.5 text-center">
                                            {onViewDetail && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onViewDetail(trf)}
                                                    className="h-6 rounded px-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10"
                                                    title="Lihat Detail Mutasi Transfer"
                                                >
                                                    <FileText className="mr-0.5 size-2.5" />
                                                    Detail
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
