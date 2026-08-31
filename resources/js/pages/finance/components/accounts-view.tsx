import { ArrowRightLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney } from '@/lib/format';
import type { ProofDocumentData } from './finance-proof-dialog';

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

    const totalOperationalLiquidity = totalCash + totalBank;
    const accountComposition = [
        { label: 'Kas Tunai', amount: totalCash, color: 'bg-blue-500' },
        {
            label: 'Giro & Tabungan',
            amount: totalBank,
            color: 'bg-sky-300',
        },
        {
            label: 'Titipan Klien',
            amount: totalTrust,
            color: 'bg-slate-400',
        },
        {
            label: 'Talangan Partner',
            amount: Math.abs(totalPartner),
            displayAmount: totalPartner,
            color: 'bg-amber-400',
        },
    ];
    const balanceScale = Math.max(
        accountComposition.reduce((total, item) => total + item.amount, 0),
        1,
    );
    const largestAccountBalance = Math.max(
        ...accounts.map((account) => Math.abs(account.current_balance)),
        1,
    );
    const typeLabels: Record<string, string> = {
        cash: 'Kas Tunai',
        bank: 'Bank Operasional',
        client_trust: 'Dana Titipan',
        partner_advance: 'Talangan Partner',
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
            {/* Header with KPI & Quick Actions */}
            <div className="flex flex-col gap-3 border-b border-slate-200/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.06]">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Daftar Rekening &amp; Saldo Kas Kantor
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                        Manajemen rekening operasional, giro perbankan, dan
                        pemindahan dana internal.
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
            <div className="grid gap-3 p-4 lg:grid-cols-5">
                <section className="relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-xl border border-blue-100 bg-[#eef5ff] p-4 lg:col-span-2 dark:border-blue-400/10 dark:bg-blue-500/[0.06]">
                    <div className="pointer-events-none absolute -top-12 -right-10 size-32 rounded-full border-[20px] border-white/60 dark:border-white/[0.025]" />
                    <p className="relative text-[10px] font-bold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-300">
                        Likuiditas Operasional
                    </p>
                    <p className="relative mt-1 font-mono text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                        {formatMoney(totalOperationalLiquidity, 'IDR')}
                    </p>
                    <p className="relative mt-1 text-[10px] text-slate-500 dark:text-zinc-400">
                        Kas tunai dan saldo rekening bank firma
                    </p>

                    <div className="relative mt-4 flex justify-between border-t border-blue-200/60 pt-3 text-[9.5px] font-medium text-slate-500 dark:border-white/[0.06] dark:text-zinc-400">
                        <span>Kas {formatMoney(totalCash, 'IDR')}</span>
                        <span>Bank {formatMoney(totalBank, 'IDR')}</span>
                    </div>
                </section>

                <section
                    data-testid="account-composition-panel"
                    className="flex min-h-[150px] flex-col rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 lg:col-span-3 dark:border-white/[0.06] dark:bg-white/[0.025]"
                >
                    <div>
                        <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase dark:text-zinc-400">
                            Komposisi Saldo
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-zinc-500">
                            Posisi dana dan kewajiban pada seluruh rekening
                        </p>
                    </div>
                    <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/[0.07]">
                        {accountComposition.map((item) => (
                            <div
                                key={item.label}
                                className={item.color}
                                style={{
                                    width: `${(item.amount / balanceScale) * 100}%`,
                                }}
                            />
                        ))}
                    </div>
                    <div className="mt-3 grid flex-1 grid-cols-2 divide-x divide-y divide-slate-200/70 sm:grid-cols-4 sm:divide-y-0 dark:divide-white/[0.06]">
                        {accountComposition.map((item) => (
                            <div key={item.label} className="px-3 first:pl-0">
                                <p className="truncate text-[9px] font-semibold text-slate-400 uppercase dark:text-zinc-500">
                                    {item.label}
                                </p>
                                <p className="mt-1 font-mono text-xs font-bold text-slate-950 dark:text-white">
                                    {formatMoney(
                                        item.displayAmount ?? item.amount,
                                        'IDR',
                                    )}
                                </p>
                                <p className="mt-0.5 text-[8.5px] text-slate-400 dark:text-zinc-500">
                                    Kontribusi{' '}
                                    {(
                                        (item.amount / balanceScale) *
                                        100
                                    ).toFixed(1)}
                                    %
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200/70 px-4 py-3 dark:border-white/[0.06]">
                <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Rekening Terdaftar
                    </h4>
                    <p className="text-[10px] text-slate-400">
                        Saldo dan identitas rekening aktif firma.
                    </p>
                </div>
                <span className="font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                    {accounts.length} rekening
                </span>
            </div>

            {/* Accounts Bento Grid */}
            <div className="grid gap-2.5 px-4 pb-4 sm:grid-cols-2">
                {accounts.map((acc) => {
                    return (
                        <div
                            key={acc.id}
                            className="flex flex-col justify-between rounded-xl border border-slate-200/70 bg-white p-3.5 transition-colors hover:border-slate-300 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-white/15"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-2">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                                {acc.name}
                                            </h4>
                                            <span className="text-[9px] font-bold text-blue-600 uppercase dark:text-blue-400">
                                                {typeLabels[acc.type] ??
                                                    acc.type}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-[10px] text-slate-400">
                                            {acc.bank_name ||
                                                (acc.type === 'cash'
                                                    ? 'Brankas Kantor'
                                                    : 'Rekening')}
                                            {acc.account_number
                                                ? ` — ${acc.account_number}`
                                                : ''}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-[9px] font-bold uppercase ${
                                            acc.is_active
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-slate-400 dark:text-zinc-500'
                                        }`}
                                    >
                                        {acc.is_active ? 'Aktif' : 'Non-Aktif'}
                                    </span>
                                </div>

                                {acc.description && (
                                    <p className="mt-2 line-clamp-2 text-[11px] text-slate-500 dark:text-zinc-400">
                                        {acc.description}
                                    </p>
                                )}
                            </div>

                            <div className="mt-3.5 border-t border-slate-100 pt-2.5 dark:border-white/5">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[10px] font-semibold text-slate-400">
                                        Saldo Saat Ini:
                                    </span>
                                    <span className="font-mono text-sm font-extrabold text-slate-900 dark:text-white">
                                        {formatMoney(
                                            acc.current_balance,
                                            'IDR',
                                        )}
                                    </span>
                                </div>
                                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                                    <div
                                        className="h-full rounded-full bg-blue-500"
                                        style={{
                                            width: `${(Math.abs(acc.current_balance) / largestAccountBalance) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Transfer History Table */}
            <div className="border-t border-slate-200/70 p-4 dark:border-white/[0.06]">
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
                            <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:border-white/5 dark:bg-white/[0.02]">
                                <tr>
                                    <th className="px-3.5 py-2">
                                        No. Transfer
                                    </th>
                                    <th className="px-3.5 py-2">Tanggal</th>
                                    <th className="px-3.5 py-2">
                                        Dari Rekening
                                    </th>
                                    <th className="px-3.5 py-2">Ke Rekening</th>
                                    <th className="px-3.5 py-2 text-right">
                                        Nominal
                                    </th>
                                    <th className="px-3.5 py-2">Catatan</th>
                                    <th className="px-3.5 py-2 text-center">
                                        Status
                                    </th>
                                    <th className="px-3.5 py-2 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {transfers.map((trf) => (
                                    <tr
                                        key={trf.id}
                                        className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                    >
                                        <td className="px-3.5 py-2.5 font-mono text-[11px] font-semibold text-slate-900 dark:text-white">
                                            {trf.transfer_number}
                                        </td>
                                        <td className="px-3.5 py-2.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                            {formatDate(
                                                trf.transferred_at ||
                                                    trf.transfer_date ||
                                                    '',
                                            )}
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
                                            <span className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">
                                                Berhasil
                                            </span>
                                        </td>
                                        <td className="px-3.5 py-2.5 text-center">
                                            {onViewDetail && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        onViewDetail(trf)
                                                    }
                                                    className="h-6 rounded px-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10"
                                                    title="Lihat Detail Mutasi Transfer"
                                                >
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
