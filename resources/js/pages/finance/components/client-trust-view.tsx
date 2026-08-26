import { ArrowDownLeft, ArrowUpRight, Lock, Plus, Shield, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney } from '@/lib/format';

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
    type: 'deposit_in' | 'disbursement_out';
    amount: number;
    transaction_date: string;
    purpose: string;
    recipient_party?: string;
    notes?: string;
    status: string;
};

export function ClientTrustView({
    trustSummary,
    trustFunds,
    onOpenTrustModal,
}: {
    trustSummary: ClientTrustSummary;
    trustFunds: ClientTrustFundItem[];
    onOpenTrustModal: () => void;
}) {
    return (
        <div className="space-y-4">
            {/* Header & Action */}
            <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-1.5">
                        <h2 className="text-sm font-bold text-slate-900 uppercase dark:text-white">Rekening Dana Titipan Klien (Trust / Escrow)</h2>
                        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[9.5px] font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                            Terisolasi
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                        Dana titipan klien untuk biaya perkara pengadilan (panjar SKUM, operasional pihak ketiga) yang terpisah mutlak dari kas kantor.
                    </p>
                </div>
                <Button
                    size="sm"
                    onClick={onOpenTrustModal}
                    className="h-7.5 rounded-lg bg-cyan-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-cyan-700 dark:bg-cyan-600 dark:text-white dark:hover:bg-cyan-500"
                >
                    <Plus className="mr-1 size-3.5" />
                    Catat Mutasi Titipan Klien
                </Button>
            </div>

            {/* Escrow KPI Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-purple-200/60 bg-purple-50/40 p-4 dark:border-purple-500/20 dark:bg-purple-500/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-bold text-purple-600 uppercase tracking-wider dark:text-purple-400">Saldo Dana Titipan Aktif</span>
                        <Lock className="size-4 text-purple-500" />
                    </div>
                    <p className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">{formatMoney(trustSummary.net_trust_balance, 'IDR')}</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">Dana milik klien yang belum terpakai</p>
                </div>

                <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                    <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider dark:text-emerald-400">Total Titipan Masuk</span>
                        <ArrowDownLeft className="size-4 text-emerald-500" />
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white">{formatMoney(trustSummary.total_deposit_in, 'IDR')}</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">Penerimaan panjar dari klien</p>
                </div>

                <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                    <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-bold text-rose-600 uppercase tracking-wider dark:text-rose-400">Total Pengeluaran Perkara</span>
                        <ArrowUpRight className="size-4 text-rose-500" />
                    </div>
                    <p className="mt-1 font-mono text-lg font-bold text-slate-900 dark:text-white">{formatMoney(trustSummary.total_disbursement_out, 'IDR')}</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400">Penyaluran resmi pengadilan / vendor</p>
                </div>
            </div>

            {/* Breakdown per Matter Table */}
            {trustSummary.by_matter.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                    <div className="border-b border-slate-200/60 px-4 py-2.5 dark:border-white/[0.06]">
                        <h3 className="text-xs font-bold text-slate-900 uppercase dark:text-white">Posisi Saldo Titipan per Perkara</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200/70 bg-slate-50/70 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/[0.06] dark:bg-[#121418] dark:text-zinc-400">
                                <tr>
                                    <th className="px-3.5 py-2">Perkara &amp; Klien</th>
                                    <th className="px-3 py-2 text-right">Dana Masuk</th>
                                    <th className="px-3 py-2 text-right">Dana Terpakai</th>
                                    <th className="px-3 py-2 text-right">Sisa Saldo Titipan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                {trustSummary.by_matter.map((m, idx) => (
                                    <tr key={m.matter_id || idx} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                                        <td className="px-3.5 py-2.5">
                                            <span className="font-mono text-[10.5px] font-bold text-blue-600 dark:text-blue-400">{m.matter_number}</span>
                                            <div className="font-semibold text-slate-900 dark:text-white">{m.matter_title}</div>
                                            <div className="text-[10px] text-slate-400">{m.client_name}</div>
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400">
                                            {formatMoney(m.deposit_in, 'IDR')}
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-mono text-rose-600 dark:text-rose-400">
                                            {formatMoney(m.disbursement_out, 'IDR')}
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-mono font-bold text-purple-600 dark:text-purple-400">
                                            {formatMoney(m.current_balance, 'IDR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Mutation Log Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                <div className="border-b border-slate-200/60 px-4 py-2.5 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase dark:text-white">Register Mutasi Dana Titipan Klien</h3>
                            <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">Log lengkap penerimaan panjar dan pengeluaran ke instansi/pengadilan.</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                            {trustFunds.length} Mutasi
                        </span>
                    </div>
                </div>

                {trustFunds.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-500">
                        Belum ada mutasi dana titipan klien tercatat.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200/70 bg-slate-50/70 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/[0.06] dark:bg-[#121418] dark:text-zinc-400">
                                <tr>
                                    <th className="px-3.5 py-2.5">No Mutasi &amp; Tanggal</th>
                                    <th className="px-3 py-2.5">Klien &amp; Perkara</th>
                                    <th className="px-3 py-2.5">Jenis &amp; Rekening</th>
                                    <th className="px-3 py-2.5">Keperluan / Penerima</th>
                                    <th className="px-3 py-2.5 text-right">Nominal</th>
                                    <th className="px-3 py-2.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                                {trustFunds.map((tf) => {
                                    const isDeposit = tf.type === 'deposit_in';
                                    return (
                                        <tr key={tf.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                                            <td className="px-3.5 py-2.5">
                                                <div className="font-mono text-[10.5px] font-bold text-blue-600 dark:text-blue-400">{tf.transaction_number}</div>
                                                <div className="text-[10px] text-slate-400">{formatDate(tf.transaction_date)}</div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="font-bold text-slate-900 dark:text-white">{tf.client?.display_name || '-'}</div>
                                                {tf.matter && <div className="font-mono text-[10px] text-slate-400">{tf.matter.matter_number}</div>}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${
                                                    isDeposit ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                                }`}>
                                                    {isDeposit ? 'Penerimaan Titipan (+)' : 'Pengeluaran Resmi (-)'}
                                                </span>
                                                <div className="mt-0.5 text-[10px] text-slate-400">{tf.account?.name || '-'}</div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="font-semibold text-slate-900 dark:text-white">{tf.purpose}</div>
                                                {tf.recipient_party && <div className="text-[10px] text-slate-400">Penerima: {tf.recipient_party}</div>}
                                            </td>
                                            <td className="px-3 py-2.5 text-right font-mono font-bold">
                                                <span className={isDeposit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                                    {formatMoney(tf.amount, 'IDR')}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                                    Disetujui
                                                </span>
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
