import { Link } from '@inertiajs/react';
import { ArrowUpRight, CheckCircle2, DollarSign, FolderKanban, TrendingDown, TrendingUp } from 'lucide-react';
import { formatMoney } from '@/lib/format';

export type ProfitabilityItem = {
    id: string;
    matter_number: string;
    title: string;
    client_name: string;
    status: string;
    contract_value: number;
    invoiced_amount: number;
    collected_amount: number;
    unbilled_contract: number;
    office_expenses: number;
    client_expenses: number;
    total_expenses: number;
    net_margin: number;
    margin_percentage: number;
};

export function ProfitabilityTable({ items }: { items: ProfitabilityItem[] }) {
    if (!items || items.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200/70 bg-white p-8 text-center dark:border-white/[0.06] dark:bg-[#14161b]">
                <FolderKanban className="mx-auto size-9 text-slate-300 dark:text-zinc-600" />
                <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-zinc-300">Belum Ada Data Profitabilitas Perkara</p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-500">Data akan otomatis terhitung saat nilai kontrak perkara diisi dan tagihan/biaya dicatat.</p>
            </div>
        );
    }

    const totalContract = items.reduce((acc, i) => acc + i.contract_value, 0);
    const totalInvoiced = items.reduce((acc, i) => acc + i.invoiced_amount, 0);
    const totalCollected = items.reduce((acc, i) => acc + i.collected_amount, 0);
    const totalExpenses = items.reduce((acc, i) => acc + i.total_expenses, 0);
    const totalMargin = items.reduce((acc, i) => acc + i.net_margin, 0);
    const avgMarginPct = totalCollected > 0 ? ((totalMargin / totalCollected) * 100).toFixed(1) : '0';

    return (
        <div className="space-y-3">
            {/* KPI Summary Strip */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                    <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">Total Nilai Kontrak</span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-slate-900 dark:text-white">{formatMoney(totalContract, 'IDR')}</p>
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                    <span className="text-[10px] font-semibold tracking-wider text-blue-500 uppercase">Sudah Ditagih</span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{formatMoney(totalInvoiced, 'IDR')}</p>
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                    <span className="text-[10px] font-semibold tracking-wider text-emerald-500 uppercase">Kas Diterima</span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(totalCollected, 'IDR')}</p>
                </div>
                <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                    <span className="text-[10px] font-semibold tracking-wider text-rose-500 uppercase">Biaya Terpakai</span>
                    <p className="mt-0.5 font-mono text-sm font-bold text-rose-600 dark:text-rose-400">{formatMoney(totalExpenses, 'IDR')}</p>
                </div>
                <div className="col-span-2 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-white p-3 shadow-2xs sm:col-span-1 dark:border-emerald-500/20 dark:from-emerald-950/20 dark:to-[#14161b]">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">Margin Firma</span>
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9.5px] font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">{avgMarginPct}%</span>
                    </div>
                    <p className="mt-0.5 font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">{formatMoney(totalMargin, 'IDR')}</p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                <div className="border-b border-slate-200/60 px-4 py-2.5 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 uppercase dark:text-white">Master &amp; Profitabilitas Perkara</h3>
                            <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">Analisis margin keuntungan, realisasi tagihan, dan pemakaian anggaran per perkara.</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                            {items.length} Perkara
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200/70 bg-slate-50/70 text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:border-white/[0.06] dark:bg-[#121418] dark:text-zinc-400">
                            <tr>
                                <th className="px-3.5 py-2.5">Perkara &amp; Klien</th>
                                <th className="px-3 py-2.5 text-right">Nilai Kontrak</th>
                                <th className="px-3 py-2.5 text-right">Ditagih</th>
                                <th className="px-3 py-2.5 text-right">Diterima</th>
                                <th className="px-3 py-2.5 text-right">Biaya Kantor</th>
                                <th className="px-3 py-2.5 text-right">Margin Laba</th>
                                <th className="px-3 py-2.5 text-center">Margin %</th>
                                <th className="px-3 py-2.5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700 dark:divide-white/[0.04] dark:text-zinc-300">
                            {items.map((item) => {
                                const isPositive = item.net_margin >= 0;
                                return (
                                    <tr key={item.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                                        <td className="px-3.5 py-2.5">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">{item.matter_number}</span>
                                                    <span className="rounded bg-slate-100 px-1 py-0.2 text-[9px] font-semibold text-slate-600 uppercase dark:bg-white/10 dark:text-zinc-300">
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-slate-900 line-clamp-1 dark:text-white">{item.title}</span>
                                                <span className="text-[10px] text-slate-400 dark:text-zinc-500">{item.client_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white">
                                            {formatMoney(item.contract_value, 'IDR')}
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-mono text-slate-600 dark:text-zinc-400">
                                            {formatMoney(item.invoiced_amount, 'IDR')}
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                            {formatMoney(item.collected_amount, 'IDR')}
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-mono text-rose-600 dark:text-rose-400">
                                            {formatMoney(item.total_expenses, 'IDR')}
                                        </td>
                                        <td className="px-3 py-2.5 text-right font-mono font-bold">
                                            <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                                {formatMoney(item.net_margin, 'IDR')}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                isPositive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                            }`}>
                                                {isPositive ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                                                {item.margin_percentage}%
                                            </span>
                                        </td>
                                        <td className="px-3 py-2.5 text-center">
                                            <Link
                                                href={`/finance?matter_id=${item.id}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                            >
                                                Filter <ArrowUpRight className="size-3" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
