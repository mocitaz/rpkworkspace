import { ArrowRightLeft, Building, DollarSign, Plus, User, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney } from '@/lib/format';

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
    transferred_at: string;
    reference_number?: string;
    notes?: string;
    status: string;
    creator?: { id: number; name: string };
};

export function AccountsView({
    accounts,
    transfers,
    onOpenTransferModal,
    onOpenAccountModal,
}: {
    accounts: FinancialAccountItem[];
    transfers: AccountTransferItem[];
    onOpenTransferModal: () => void;
    onOpenAccountModal: () => void;
}) {
    const totalCashBank = accounts
        .filter((a) => a.type === 'cash' || a.type === 'bank')
        .reduce((acc, a) => acc + a.current_balance, 0);

    const totalPartnerAdvances = accounts
        .filter((a) => a.type === 'partner_advance')
        .reduce((acc, a) => acc + a.current_balance, 0);

    const totalTrustFunds = accounts
        .filter((a) => a.type === 'client_trust')
        .reduce((acc, a) => acc + a.current_balance, 0);

    return (
        <div className="space-y-4">
            {/* Header & Quick Action Buttons */}
            <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase dark:text-white">Multi-Akun Kas &amp; Rekening Bank</h2>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Pengelolaan saldo kas kantor, rekening operasional, dana talangan partner, dan transfer internal.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenAccountModal}
                        className="h-7.5 rounded-lg border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                    >
                        <Plus className="mr-1 size-3.5" />
                        Tambah Akun
                    </Button>
                    <Button
                        size="sm"
                        onClick={onOpenTransferModal}
                        className="h-7.5 rounded-lg bg-purple-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-purple-700 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-500"
                    >
                        <ArrowRightLeft className="mr-1 size-3.5" />
                        Transfer Kas / Bank
                    </Button>
                </div>
            </div>

            {/* Account Balance Summary Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-blue-200/60 bg-blue-50/40 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider dark:text-blue-400">Kas &amp; Bank Operasional</span>
                        <Building className="size-4 text-blue-500" />
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white">{formatMoney(totalCashBank, 'IDR')}</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">Total likuiditas kantor siap pakai</p>
                </div>

                <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-bold text-amber-600 uppercase tracking-wider dark:text-amber-400">Talangan Partner Bersih</span>
                        <User className="size-4 text-amber-500" />
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white">{formatMoney(totalPartnerAdvances, 'IDR')}</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">Utang kantor kepada partner atas dana talangan</p>
                </div>

                <div className="rounded-xl border border-purple-200/60 bg-purple-50/40 p-4 dark:border-purple-500/20 dark:bg-purple-500/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider dark:text-purple-400">Dana Titipan Klien (Escrow)</span>
                        <Wallet className="size-4 text-purple-500" />
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white">{formatMoney(totalTrustFunds, 'IDR')}</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">Rekening terpisah biaya perkara pengadilan</p>
                </div>
            </div>

            {/* Account List Grid */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {accounts.map((acc) => {
                    const badgeColor =
                        acc.type === 'bank'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300'
                            : acc.type === 'partner_advance'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                              : acc.type === 'client_trust'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300'
                                : 'bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-zinc-300';

                    const typeLabel =
                        acc.type === 'bank'
                            ? 'Bank Operasional'
                            : acc.type === 'partner_advance'
                              ? 'Talangan Partner'
                              : acc.type === 'client_trust'
                                ? 'Dana Titipan Klien'
                                : 'Kas Kantor Tunai';

                    return (
                        <div
                            key={acc.id}
                            className="flex flex-col justify-between rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-1.5">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{acc.name}</span>
                                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${badgeColor}`}>
                                        {typeLabel}
                                    </span>
                                </div>
                                {acc.bank_name && (
                                    <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                                        {acc.bank_name} &bull; <span className="font-mono">{acc.account_number || '-'}</span>
                                    </p>
                                )}
                                {acc.partner && (
                                    <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                                        Partner: <span className="font-semibold text-slate-700 dark:text-zinc-300">{acc.partner.name}</span>
                                    </p>
                                )}
                                {acc.description && (
                                    <p className="mt-1 text-[10px] text-slate-400 dark:text-zinc-500">{acc.description}</p>
                                )}
                            </div>

                            <div className="mt-3.5 border-t border-slate-100 pt-2 dark:border-white/[0.04]">
                                <span className="text-[9.5px] font-semibold text-slate-400 uppercase">Saldo Berjalan:</span>
                                <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                                    {formatMoney(acc.current_balance, 'IDR')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Transfer History Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                <div className="border-b border-slate-200/60 px-4 py-2.5 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase dark:text-white">Register Transfer Antar Kas / Bank</h3>
                            <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">Riwayat mutasi pemindahan dana antar rekening internal firma.</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                            {transfers.length} Mutasi
                        </span>
                    </div>
                </div>

                {transfers.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                        Belum ada mutasi transfer antar kas/bank.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200/70 bg-slate-50/70 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/[0.06] dark:bg-[#121418] dark:text-zinc-400">
                                <tr>
                                    <th className="px-3.5 py-2.5">No Transfer &amp; Tanggal</th>
                                    <th className="px-3 py-2.5">Akun Asal</th>
                                    <th className="px-3 py-2.5">Akun Tujuan</th>
                                    <th className="px-3 py-2.5 text-right">Nominal Transfer</th>
                                    <th className="px-3 py-2.5">Catatan</th>
                                    <th className="px-3 py-2.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                {transfers.map((trf) => (
                                    <tr key={trf.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                                        <td className="px-3.5 py-2.5">
                                            <div className="font-mono text-[10.5px] font-bold text-blue-600 dark:text-blue-400">
                                                {trf.transfer_number}
                                            </div>
                                            <div className="text-[10px] text-slate-400">{formatDate(trf.transferred_at)}</div>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                                                {trf.from_account?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5">
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                {trf.to_account?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                                            {formatMoney(trf.amount, 'IDR')}
                                        </td>
                                        <td className="px-3 py-2.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                            {trf.notes || '-'}
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                Berhasil
                                            </span>
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
