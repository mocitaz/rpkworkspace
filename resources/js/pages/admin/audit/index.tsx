import { Form, Head, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock,
    Download,
    Filter,
    Layers,
    RotateCcw,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/format';
import * as auditRoutes from '@/routes/admin/audit';

type Log = {
    id: string;
    event: string;
    actor?: { name: string; email: string };
    subject_type?: string;
    subject_id?: string;
    metadata?: Record<string, unknown>;
    ip_address?: string;
    created_at: string;
};

type Page = {
    data: Log[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function AuditIndex({
    auditLogs,
    events,
    actors,
    metrics,
    filters,
}: {
    auditLogs: Page;
    events: string[];
    actors: { id: number; name: string }[];
    metrics: {
        total: number;
        today: number;
        actors_count: number;
        events_count: number;
    };
    filters: {
        event?: string;
        actor_id?: string;
        from?: string;
        until?: string;
    };
}) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [cleanOpen, setCleanOpen] = useState(false);

    return (
        <>
            <Head title="Audit Log & Jejak Aktivitas - Kepatuhan Hukum" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* Flash Success Notification */}
                    {flash?.success && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs font-semibold text-emerald-900 shadow-2xs dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {/* 1. Header Navigation & Action Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Audit Log &amp; Jejak Aktivitas
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Pelacakan riwayat aktivitas, modifikasi berkas perkara, akses finansial, dan audit trail kepatuhan hukum firma.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCleanOpen(true)}
                                className="h-8 rounded-lg border-rose-200 bg-white px-3 text-xs font-semibold text-rose-600 shadow-2xs hover:bg-rose-50 hover:border-rose-300 transition-all dark:border-rose-950/40 dark:bg-[#14161b] dark:text-rose-400 dark:hover:bg-rose-950/20"
                            >
                                <Trash2 className="mr-1.5 size-3.5 text-rose-600 dark:text-rose-400" />
                                Bersihkan Log
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                asChild
                            >
                                <a
                                    href={auditRoutes.exportMethod.url({
                                        query: filters,
                                    })}
                                    download
                                >
                                    <Download className="mr-1.5 size-3.5 text-blue-600 dark:text-blue-400" />
                                    Ekspor CSV Kepatuhan
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* 2. Top 4 Compact Bento KPI Cards */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Log */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">TOTAL REKAMAN AUDIT</span>
                                <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.total}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    log
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Immutable Ledger</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">Permanen</span>
                            </div>
                        </div>

                        {/* 2. Hari Ini */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">AKTIVITAS HARI INI</span>
                                <Activity className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.today}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    event
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>24 Jam Terakhir</span>
                                <span className="font-semibold text-emerald-600">Harian</span>
                            </div>
                        </div>

                        {/* 3. Pelaku Aktif */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">PELAKU TERIDENTIFIKASI</span>
                                <Users className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.actors_count}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    anggota
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Tercatat Beraksi</span>
                                <span className="font-semibold text-purple-600">Aktif</span>
                            </div>
                        </div>

                        {/* 4. Variasi Event */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">RAGAM EVENT</span>
                                <Layers className="size-3.5 text-amber-500" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {metrics.events_count}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    tipe
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Auth, Dokumen &amp; Finance</span>
                                <span className="font-semibold text-amber-600">Cakupan</span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Filter Bar */}
                    <Form
                        {...auditRoutes.index.form()}
                        className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 space-y-2 dark:border-white/[0.04] dark:bg-[#121418]"
                    >
                        {/* Row 1: Event Dropdown + Actor Dropdown + Reset + Count Badge */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative min-w-[200px] flex-1">
                                <select
                                    name="event"
                                    defaultValue={filters.event ?? ''}
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    <option value="">Semua Jenis Event</option>
                                    {events.map((ev) => (
                                        <option key={ev} value={ev}>
                                            {ev}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>

                            <div className="relative min-w-[200px] flex-1">
                                <select
                                    name="actor_id"
                                    defaultValue={filters.actor_id ?? ''}
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    <option value="">Semua Pelaku / Aktor</option>
                                    {actors.map((actor) => (
                                        <option key={actor.id} value={actor.id}>
                                            {actor.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>

                            {(filters.event || filters.actor_id || filters.from || filters.until) && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-8 shrink-0 rounded-lg border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                    title="Reset Semua Filter"
                                >
                                    <a href={auditRoutes.index.url()}>
                                        <RotateCcw className="size-3.5 text-slate-400" />
                                    </a>
                                </Button>
                            )}

                            <span className="shrink-0 rounded-md bg-white px-2 py-1 font-mono text-[11px] font-semibold text-slate-700 border border-slate-200/70 shadow-2xs dark:bg-zinc-800 dark:border-white/10 dark:text-zinc-300">
                                {auditLogs.total} log
                            </span>
                        </div>

                        {/* Row 2: Date Pickers + Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                                <div className="relative flex-1">
                                    <Input
                                        name="from"
                                        type="date"
                                        defaultValue={filters.from}
                                        aria-label="Dari tanggal"
                                        className="h-8 rounded-lg border-slate-200 bg-white text-xs text-slate-900 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                                <span className="text-xs text-slate-400 font-medium">s/d</span>
                                <div className="relative flex-1">
                                    <Input
                                        name="until"
                                        type="date"
                                        defaultValue={filters.until}
                                        aria-label="Sampai tanggal"
                                        className="h-8 rounded-lg border-slate-200 bg-white text-xs text-slate-900 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="sm"
                                className="h-8 shrink-0 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                            >
                                <Filter className="mr-1.5 size-3" /> Terapkan Filter
                            </Button>
                        </div>
                    </Form>

                    {/* 4. Audit Logs Table Card */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                        {auditLogs.data.length === 0 ? (
                            <div className="flex min-h-[320px] items-center justify-center p-8 text-center">
                                <EmptyState
                                    title="Tidak ada log audit ditemukan"
                                    description="Tidak ada rekaman aktivitas yang sesuai dengan kriteria filter yang Anda pilih."
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                            <th className="py-2.5 pr-3 pl-4">Waktu (WIB)</th>
                                            <th className="px-3 py-2.5">Event &amp; Objek</th>
                                            <th className="px-3 py-2.5">Pelaku / Aktor</th>
                                            <th className="px-3 py-2.5">Detail Perubahan</th>
                                            <th className="py-2.5 pr-4 pl-3 text-right">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {auditLogs.data.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                            >
                                                {/* Timestamp */}
                                                <td className="py-2.5 pr-3 pl-4 font-mono text-xs font-semibold whitespace-nowrap text-slate-600 dark:text-zinc-400">
                                                    {formatDate(log.created_at, true)}
                                                </td>

                                                {/* Event & Target Object */}
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex size-7.5 shrink-0 items-center justify-center rounded-lg border border-slate-200/70 bg-blue-50 text-blue-600 transition-transform group-hover:scale-105 dark:border-white/10 dark:bg-blue-950/40 dark:text-blue-400">
                                                            <Activity className="size-3.5" />
                                                        </div>
                                                        <div className="space-y-0.5 min-w-0">
                                                            <span className="rounded bg-blue-50 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                                {log.event}
                                                            </span>
                                                            <p className="font-mono text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                                {log.subject_type
                                                                    ? log.subject_type.split('\\').pop()
                                                                    : 'System'}
                                                                {log.subject_id
                                                                    ? ` · #${log.subject_id.slice(-8)}`
                                                                    : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Actor */}
                                                <td className="px-3 py-2.5 whitespace-nowrap">
                                                    <div>
                                                        <span className="font-semibold text-slate-900 dark:text-white">
                                                            {log.actor?.name ?? 'Sistem Otomatis'}
                                                        </span>
                                                        <p className="text-[10.5px] text-slate-500">
                                                            {log.actor?.email ?? 'system@internal'}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* JSON Metadata Details */}
                                                <td className="max-w-sm px-3 py-2.5">
                                                    <pre className="max-h-20 overflow-auto rounded-lg border border-slate-200/70 bg-slate-50/60 p-2 font-mono text-[10px] leading-relaxed text-slate-800 dark:border-white/5 dark:bg-zinc-800/40 dark:text-zinc-300">
                                                        {JSON.stringify(log.metadata ?? {}, null, 2)}
                                                    </pre>
                                                </td>

                                                {/* IP Address */}
                                                <td className="py-2.5 pr-4 pl-3 text-right font-mono text-xs font-semibold whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                    {log.ip_address ?? '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex flex-col justify-between gap-2.5 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center dark:border-white/[0.04] dark:bg-[#121418]">
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                                Menampilkan{' '}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {auditLogs.data.length}
                                </span>{' '}
                                dari{' '}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {auditLogs.total}
                                </span>{' '}
                                rekaman log
                            </span>
                            <Pagination links={auditLogs.links} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Clean & Prune Dialog Modal */}
            <CleanAuditLogsDialog
                open={cleanOpen}
                onOpenChange={setCleanOpen}
                totalLogs={metrics.total}
            />
        </>
    );
}

function CleanAuditLogsDialog({
    open,
    onOpenChange,
    totalLogs,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    totalLogs: number;
}) {
    const [retention, setRetention] = useState<string>('30');
    const [confirmed, setConfirmed] = useState<boolean>(false);

    const retentionOptions = [
        {
            value: '7',
            label: 'Lebih lama dari 7 Hari',
            desc: 'Pertahankan 1 minggu terakhir, hapus log yang lebih lama.',
            badge: '1 Minggu',
        },
        {
            value: '30',
            label: 'Lebih lama dari 30 Hari',
            desc: 'Pertahankan 1 bulan terakhir (Rekomendasi standar).',
            badge: '1 Bulan',
            isDefault: true,
        },
        {
            value: '90',
            label: 'Lebih lama dari 90 Hari',
            desc: 'Pertahankan 3 bulan terakhir untuk jejak triwulan.',
            badge: '3 Bulan',
        },
        {
            value: '180',
            label: 'Lebih lama dari 180 Hari',
            desc: 'Pertahankan 6 bulan terakhir untuk jejak semester.',
            badge: '6 Bulan',
        },
        {
            value: '365',
            label: 'Lebih lama dari 365 Hari',
            desc: 'Pertahankan 1 tahun terakhir untuk audit tahunan.',
            badge: '1 Tahun',
        },
        {
            value: 'all',
            label: 'Bersihkan Seluruh Riwayat Log (Semua)',
            desc: 'Kosongkan total seluruh log audit yang ada di database.',
            badge: 'Semua',
            isDanger: true,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                <div className="border-b border-slate-100 bg-slate-50/60 p-5 dark:border-white/5 dark:bg-zinc-900/40">
                    <DialogHeader>
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40">
                                <Trash2 className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                    Bersihkan &amp; Pemangkasan Log Audit
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Pilih durasi retensi penyimpanan untuk menghapus log aktivitas yang sudah lampau.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <Form
                    {...auditRoutes.prune.form()}
                    onSuccess={() => {
                        onOpenChange(false);
                        setConfirmed(false);
                    }}
                    className="p-5 space-y-4"
                >
                    {({ processing }) => (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                                    Pilih Batas Waktu Retensi (Durasi Hilang)
                                </Label>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {retentionOptions.map((opt) => {
                                        const isSelected = retention === opt.value;
                                        return (
                                            <label
                                                key={opt.value}
                                                className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all ${
                                                    isSelected
                                                        ? opt.isDanger
                                                            ? 'border-rose-500 bg-rose-50/50 dark:border-rose-500/80 dark:bg-rose-950/20'
                                                            : 'border-slate-900 bg-slate-50 dark:border-white dark:bg-zinc-800/60'
                                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-white/10 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/40'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="retention"
                                                    value={opt.value}
                                                    checked={isSelected}
                                                    onChange={() => setRetention(opt.value)}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                                                        {opt.label}
                                                    </span>
                                                    <span
                                                        className={`rounded px-1.5 py-0.2 font-mono text-[9.5px] font-bold ${
                                                            opt.isDanger
                                                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                                                : isSelected
                                                                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                                  : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                        }`}
                                                    >
                                                        {opt.badge}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                                    {opt.desc}
                                                </p>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Warning Card */}
                            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs dark:border-amber-900/40 dark:bg-amber-950/20">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                                    <div className="space-y-0.5 text-amber-900 dark:text-amber-300">
                                        <p className="font-bold">Konfirmasi Integritas &amp; Kepatuhan</p>
                                        <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90">
                                            Penghapusan log bersifat permanen. Aktivitas pembersihan ini akan dicatat sebagai event audit baru (<code>audit.pruned</code>) untuk menjaga akuntabilitas sistem. Total saat ini: <strong>{totalLogs}</strong> log.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Safety Checkbox */}
                            <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={confirmed}
                                    onChange={(e) => setConfirmed(e.target.checked)}
                                    className="mt-0.5 size-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-white/20 dark:bg-zinc-800"
                                />
                                <span className="text-xs text-slate-700 dark:text-zinc-300">
                                    Saya mengonfirmasi bahwa saya berwenang melakukan pembersihan data log audit kepatuhan ini.
                                </span>
                            </label>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    className="h-8 rounded-lg border-slate-200 text-xs font-semibold hover:bg-slate-50 dark:border-white/10"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!confirmed || processing}
                                    className="h-8 rounded-lg bg-rose-600 px-4 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    <Trash2 className="mr-1.5 size-3.5" />
                                    {processing ? 'Membersihkan...' : 'Bersihkan Log Sekarang'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

AuditIndex.layout = {
    breadcrumbs: [{ title: 'Audit Log', href: auditRoutes.index() }],
};
