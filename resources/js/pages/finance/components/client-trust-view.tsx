import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney } from '@/lib/format';
import type { ProofDocumentData } from './finance-proof-dialog';

export type ClientTrustSummary = {
    total_deposit_in: number;
    total_disbursement_out: number;
    net_trust_balance: number;
    by_matter: {
        matter_id: string;
        matter_number: string;
        matter_title: string;
        client_name: string;
        deposit_in: number;
        disbursement_out: number;
        current_balance: number;
    }[];
};

export type ClientTrustFundItem = {
    id: string;
    transaction_number: string;
    client?: { id: string; display_name: string };
    matter?: { id: string; matter_number: string; title: string };
    account?: { id: string; name: string };
    bank_account?: { id: string; name: string };
    type: 'deposit_in' | 'disbursement_out' | 'deposit' | 'disbursement';
    amount: number;
    transaction_date: string;
    purpose: string;
    recipient_party?: string;
    notes?: string;
    status: string;
    proof_document?: ProofDocumentData | null;
    proofDocument?: ProofDocumentData | null;
};

export function ClientTrustView({
    trustSummary,
    trustFunds,
    onOpenCreateModal,
    onViewDetail,
}: {
    trustSummary?: ClientTrustSummary;
    trustFunds: ClientTrustFundItem[];
    onOpenCreateModal?: () => void;
    onViewDetail?: (item: ClientTrustFundItem) => void;
}) {
    const summary = trustSummary || {
        total_deposit_in: 0,
        total_disbursement_out: 0,
        net_trust_balance: 0,
        by_matter: [],
    };

    return (
        <div
            data-testid="client-trust-workspace"
            className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]"
        >
            {/* Header & Escrow Rules Notice */}
            <div className="flex flex-col gap-3 border-b border-slate-200/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.06]">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Dana Titipan Klien (Client Trust Funds / Escrow)
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                        Pemisahan ketat dana titipan klien dari rekening
                        operasional kantor.
                    </p>
                </div>
                {onOpenCreateModal && (
                    <Button
                        size="sm"
                        onClick={onOpenCreateModal}
                        className="h-8 gap-1.5 rounded-lg bg-slate-950 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
                    >
                        <Plus className="size-3.5" />
                        Catat Titipan / Penyaluran
                    </Button>
                )}
            </div>

            {/* Escrow Compliance Banner */}
            <div className="mx-4 mt-3 rounded-lg border border-slate-200/80 bg-slate-50/70 px-3 py-2.5 text-xs text-slate-700 dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-zinc-300">
                <p className="text-[11px] leading-relaxed">
                    <strong>Kepatuhan Etika Profesi:</strong> Saldo dana titipan
                    klien adalah kewajiban titipan (liabilitas) dan bukan
                    merupakan pendapatan kantor hingga disetorkan atau
                    disalurkan sesuai mandat perkara.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="mx-4 mt-3 grid overflow-hidden rounded-xl border border-slate-200/70 sm:grid-cols-3 dark:border-white/[0.06]">
                <div className="border-b border-slate-200/70 p-3.5 sm:border-r sm:border-b-0 dark:border-white/[0.06]">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Total Setoran Diterima
                    </span>
                    <p className="mt-1.5 font-mono text-base font-bold text-slate-950 dark:text-white">
                        {formatMoney(summary.total_deposit_in, 'IDR')}
                    </p>
                    <span className="text-[9.5px] text-slate-400">
                        Dana titipan masuk dari klien
                    </span>
                </div>

                <div className="border-b border-slate-200/70 p-3.5 sm:border-r sm:border-b-0 dark:border-white/[0.06]">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Total Penyaluran / Keluar
                    </span>
                    <p className="mt-1.5 font-mono text-base font-bold text-slate-950 dark:text-white">
                        {formatMoney(summary.total_disbursement_out, 'IDR')}
                    </p>
                    <span className="text-[9.5px] text-slate-400">
                        Penyaluran sesuai tujuan perkara
                    </span>
                </div>

                <div className="p-3.5">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                        Saldo Rekening Titipan (Net)
                    </span>
                    <p className="mt-1.5 font-mono text-base font-bold text-slate-950 dark:text-white">
                        {formatMoney(summary.net_trust_balance, 'IDR')}
                    </p>
                    <span className="text-[9.5px] text-slate-400">
                        Saldo aktif saat ini di rekening escrow
                    </span>
                </div>
            </div>

            {/* Trust Balance by Matter Table */}
            {summary.by_matter.length > 0 && (
                <div className="mx-4 mt-3 rounded-xl border border-slate-200/80 p-4 dark:border-white/10">
                    <h4 className="mb-2.5 text-xs font-bold text-slate-900 dark:text-white">
                        Rincian Saldo Titipan per Perkara (Matter Escrow
                        Balance)
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:border-white/5 dark:bg-white/[0.02]">
                                <tr>
                                    <th className="px-3 py-2">No. Perkara</th>
                                    <th className="px-3 py-2">Judul Perkara</th>
                                    <th className="px-3 py-2">Klien</th>
                                    <th className="px-3 py-2 text-right">
                                        Total Setor
                                    </th>
                                    <th className="px-3 py-2 text-right">
                                        Total Salur
                                    </th>
                                    <th className="px-3 py-2 text-right">
                                        Sisa Saldo
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {summary.by_matter.map((m) => (
                                    <tr
                                        key={m.matter_id}
                                        className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                    >
                                        <td className="px-3 py-2 font-mono text-[11px] font-semibold text-slate-900 dark:text-white">
                                            {m.matter_number}
                                        </td>
                                        <td className="px-3 py-2 font-medium text-slate-800 dark:text-zinc-200">
                                            {m.matter_title}
                                        </td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-zinc-400">
                                            {m.client_name}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono text-emerald-600 dark:text-emerald-400">
                                            {formatMoney(m.deposit_in, 'IDR')}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono text-rose-600 dark:text-rose-400">
                                            {formatMoney(
                                                m.disbursement_out,
                                                'IDR',
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                                            {formatMoney(
                                                m.current_balance,
                                                'IDR',
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Trust Fund Transactions Table */}
            <div className="m-4 rounded-xl border border-slate-200/80 p-4 dark:border-white/10">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            Riwayat Mutasi Dana Titipan Klien
                        </h4>
                        <p className="text-[11px] text-slate-400">
                            Pencatatan uang titipan masuk dan pengeluaran mandat
                            perkara.
                        </p>
                    </div>
                </div>

                {trustFunds.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                        Belum ada riwayat transaksi dana titipan klien.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:border-white/5 dark:bg-white/[0.02]">
                                <tr>
                                    <th className="px-3.5 py-2">
                                        No. Transaksi
                                    </th>
                                    <th className="px-3.5 py-2">Tanggal</th>
                                    <th className="px-3.5 py-2">
                                        Klien &amp; Perkara
                                    </th>
                                    <th className="px-3.5 py-2">Jenis</th>
                                    <th className="px-3.5 py-2">
                                        Tujuan / Mandat
                                    </th>
                                    <th className="px-3.5 py-2 text-right">
                                        Nominal
                                    </th>
                                    <th className="px-3.5 py-2 text-center">
                                        Status
                                    </th>
                                    <th className="px-3.5 py-2 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {trustFunds.map((tf) => {
                                    const isDeposit =
                                        tf.type === 'deposit_in' ||
                                        tf.type === 'deposit';

                                    return (
                                        <tr
                                            key={tf.id}
                                            className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                        >
                                            <td className="px-3.5 py-2.5 font-mono text-[11px] font-semibold text-slate-900 dark:text-white">
                                                {tf.transaction_number}
                                            </td>
                                            <td className="px-3.5 py-2.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                {formatDate(
                                                    tf.transaction_date,
                                                )}
                                            </td>
                                            <td className="px-3.5 py-2.5">
                                                <div className="font-semibold text-slate-900 dark:text-white">
                                                    {tf.client?.display_name ||
                                                        '-'}
                                                </div>
                                                {tf.matter && (
                                                    <div className="text-[10px] text-slate-400">
                                                        {
                                                            tf.matter
                                                                .matter_number
                                                        }
                                                        <span className="ml-2 border-l border-slate-200 pl-2 dark:border-white/10">
                                                            {tf.matter.title}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-3.5 py-2.5">
                                                <span
                                                    className={`text-[9.5px] font-bold ${isDeposit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                                                >
                                                    {isDeposit
                                                        ? 'Setoran Titipan'
                                                        : 'Penyaluran'}
                                                </span>
                                            </td>
                                            <td className="px-3.5 py-2.5 text-slate-700 dark:text-zinc-300">
                                                <div className="font-medium">
                                                    {tf.purpose}
                                                </div>
                                                {tf.recipient_party && (
                                                    <div className="text-[10px] text-slate-400">
                                                        Penerima:{' '}
                                                        {tf.recipient_party}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono font-bold">
                                                <span
                                                    className={
                                                        isDeposit
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-rose-600 dark:text-rose-400'
                                                    }
                                                >
                                                    {formatMoney(
                                                        tf.amount,
                                                        'IDR',
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-3.5 py-2.5 text-center">
                                                <span className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400">
                                                    Disetujui
                                                </span>
                                            </td>
                                            <td className="px-3.5 py-2.5 text-center">
                                                {onViewDetail && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            onViewDetail(tf)
                                                        }
                                                        className="h-6 rounded px-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/10"
                                                        title="Lihat Detail Dana Titipan"
                                                    >
                                                        Detail
                                                    </Button>
                                                )}
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
