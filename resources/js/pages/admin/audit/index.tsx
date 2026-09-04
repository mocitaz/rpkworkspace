import { Form, Head, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Code2,
    Copy,
    Download,
    Eye,
    Filter,
    Layers,
    RotateCcw,
    ShieldCheck,
    Trash2,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { AuditLogHero } from '@/components/audit-log-hero';
import { EmptyState } from '@/components/empty-state';
import { Pagination } from '@/components/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { formatDate } from '@/lib/format';
import * as auditRoutes from '@/routes/admin/audit';

type Log = {
    id: string;
    event: string;
    category?: string;
    actor?: { id: number; name: string; email: string };
    subject_type?: string;
    subject_id?: string;
    subject?: Record<string, unknown> | null;
    metadata?: Record<string, unknown>;
    entry_hash?: string;
    previous_hash?: string;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
};

type Page = {
    data: Log[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

// Indonesian translations for subject models
const subjectTypeLabels: Record<string, string> = {
    Matter: 'Perkara Hukum',
    Client: 'Klien',
    Document: 'Dokumen / Berkas',
    Task: 'Tugas Perkara',
    Invoice: 'Tagihan Invoice',
    Payment: 'Pembayaran',
    Hearing: 'Jadwal Sidang',
    Event: 'Agenda Kalender',
    Chronology: 'Kronologi Fakta',
    EvidencePhysicalAsset: 'Alat Bukti Fisik',
    Correspondence: 'Korespondensi Resmi',
    User: 'Akun Pengguna',
    Staff: 'Staf / Advokat',
    Compliance: 'Kepatuhan & Izin',
    System: 'Sistem',
};

// Event labels and solid text color themes (No badges, text-only solid colors)
const eventThemeMap: Record<
    string,
    { label: string; textSolid: string }
> = {
    created: {
        label: 'Data Baru',
        textSolid: 'text-emerald-600 dark:text-emerald-400',
    },
    store: {
        label: 'Data Baru',
        textSolid: 'text-emerald-600 dark:text-emerald-400',
    },
    updated: {
        label: 'Pembaruan',
        textSolid: 'text-blue-600 dark:text-blue-400',
    },
    update: {
        label: 'Pembaruan',
        textSolid: 'text-blue-600 dark:text-blue-400',
    },
    deleted: {
        label: 'Penghapusan',
        textSolid: 'text-rose-600 dark:text-rose-400',
    },
    destroy: {
        label: 'Penghapusan',
        textSolid: 'text-rose-600 dark:text-rose-400',
    },
    workflow_transition: {
        label: 'Ubah Status',
        textSolid: 'text-indigo-600 dark:text-indigo-400',
    },
    monetary_change: {
        label: 'Nilai Keuangan',
        textSolid: 'text-amber-600 dark:text-amber-400',
    },
    signed: {
        label: 'Tanda Tangan',
        textSolid: 'text-purple-600 dark:text-purple-400',
    },
    dispatched: {
        label: 'Terkirim',
        textSolid: 'text-cyan-600 dark:text-cyan-400',
    },
    verified: {
        label: 'Terverifikasi',
        textSolid: 'text-emerald-600 dark:text-emerald-400',
    },
    pruned: {
        label: 'Pembersihan Log',
        textSolid: 'text-slate-600 dark:text-zinc-400',
    },
};

// Field names translated to Indonesian
const fieldLabels: Record<string, string> = {
    title: 'Judul',
    name: 'Nama',
    display_name: 'Nama Tampilan',
    email: 'Email',
    phone: 'No. Telepon',
    address: 'Alamat',
    status: 'Status',
    stage: 'Tahapan Perkara',
    budget: 'Anggaran',
    amount: 'Nominal',
    total_amount: 'Total Tagihan',
    due_date: 'Batas Waktu',
    start_date: 'Tanggal Mulai',
    end_date: 'Tanggal Selesai',
    hearing_date: 'Jadwal Sidang',
    court: 'Pengadilan',
    jurisdiction: 'Yurisdiksi',
    matter_number: 'No. Perkara',
    external_case_number: 'No. Register Pengadilan',
    matter_type: 'Jenis Perkara',
    confidentiality_level: 'Kerahasiaan',
    is_active: 'Status Aktif',
    notes: 'Catatan',
    description: 'Deskripsi',
    summary: 'Ringkasan',
    assigned_to: 'Penanggung Jawab',
    priority: 'Prioritas',
    classification: 'Klasifikasi',
    relationship_type: 'Relasi Perkara',
    client_id: 'ID Klien',
    matter_id: 'ID Perkara',
    user_id: 'ID Pengguna',
    role: 'Peran',
    version: 'Versi',
    file_size: 'Ukuran Berkas',
    mime_type: 'Tipe Berkas',
    currency: 'Mata Uang',
    outcome: 'Hasil Sidang',
    judge_panel: 'Majelis Hakim',
    location: 'Lokasi',
    retention: 'Durasi Retensi',
    retention_option: 'Opsi Retensi',
    records_deleted: 'Jumlah Log Dihapus',
    reason: 'Alasan',
    action: 'Tindakan',
    client_number: 'No. Klien',
    employee_code: 'Kode Pegawai',
};

// Status and value dictionary
const valueLabels: Record<string, string> = {
    draft: 'Draf',
    active: 'Aktif / Berjalan',
    in_progress: 'Sedang Berjalan',
    pending: 'Menunggu',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    closed: 'Ditutup',
    on_hold: 'Ditunda',
    open: 'Terbuka',
    review: 'Sedang Ditinjau',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    paid: 'Lunas',
    unpaid: 'Belum Lunas',
    overdue: 'Jatuh Tempo',
    verified: 'Terverifikasi',
    dispatched: 'Terkirim',
    litigation: 'Litigasi',
    non_litigation: 'Non-Litigasi',
    advisory: 'Konsultasi Hukum',
    corporate: 'Korporasi',
    criminal: 'Pidana',
    civil: 'Perdata',
    high: 'Tinggi',
    medium: 'Sedang',
    low: 'Rendah',
    critical: 'Kritis',
    all: 'Semua Riwayat',
    '7': 'Lebih dari 7 Hari',
    '30': 'Lebih dari 30 Hari',
    '90': 'Lebih dari 90 Hari',
    '180': 'Lebih dari 180 Hari',
    '365': 'Lebih dari 1 Tahun',
    true: 'Ya / Aktif',
    false: 'Tidak / Non-aktif',
};

function formatValue(val: unknown): string {
    if (val === null || val === undefined) {
        return 'Kosong';
    }
    if (typeof val === 'boolean') {
        return val ? 'Ya / Aktif' : 'Tidak / Non-aktif';
    }
    if (typeof val === 'number') {
        return val.toLocaleString('id-ID');
    }
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (!trimmed) {
            return 'Kosong';
        }
        if (valueLabels[trimmed.toLowerCase()]) {
            return valueLabels[trimmed.toLowerCase()];
        }
        if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
            return formatDate(trimmed);
        }
        return trimmed;
    }
    if (Array.isArray(val)) {
        return val.map((v) => formatValue(v)).join(', ');
    }
    if (typeof val === 'object') {
        return JSON.stringify(val);
    }
    return String(val);
}

function formatFieldKey(key: string): string {
    if (fieldLabels[key]) {
        return fieldLabels[key];
    }
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCurrency(val: unknown, currency = 'IDR'): string {
    if (typeof val === 'number') {
        return `${currency === 'IDR' ? 'Rp ' : currency + ' '}${val.toLocaleString('id-ID')}`;
    }
    return formatValue(val);
}

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
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;
    const getInitials = useInitials();
    const [cleanOpen, setCleanOpen] = useState(false);
    const [selectedLogForRaw, setSelectedLogForRaw] = useState<Log | null>(
        null,
    );

    return (
        <>
            <Head title="Audit Log & Jejak Aktivitas - RPK App" />

            <div className="min-h-screen bg-[#fafafc] pb-24 md:pb-10 dark:bg-[#0c0d10]">
                <main className="w-full space-y-5 px-4 pt-2.5 pb-8 sm:px-6 sm:pt-3.5 lg:px-8">
                    {/* Flash Success Notification */}
                    {flash?.success && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs font-semibold text-emerald-900 shadow-2xs dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            <span>{flash.success}</span>
                        </div>
                    )}

                    <AuditLogHero
                        metrics={metrics}
                        exportUrl={auditRoutes.exportMethod.url({
                            query: filters,
                        })}
                        onClean={() => setCleanOpen(true)}
                    />

                    {/* 1. Header Navigation & Action Bar */}
                    <div className="hidden">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Audit Log &amp; Jejak Aktivitas
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Pelacakan riwayat aktivitas, modifikasi berkas
                                perkara, akses finansial, dan audit trail
                                kepatuhan hukum firma.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCleanOpen(true)}
                                className="h-8 rounded-lg border-rose-200 bg-white px-3 text-xs font-semibold text-rose-600 shadow-2xs transition-all hover:border-rose-300 hover:bg-rose-50 dark:border-rose-950/40 dark:bg-[#14161b] dark:text-rose-400 dark:hover:bg-rose-950/20"
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

                    {/* 2. Top 4 Compact KPI Cards */}
                    <section className="hidden">
                        {/* 1. Total Log */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase sm:text-[11px]">
                                    Total Rekaman
                                </span>
                                <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                    {metrics.total.toLocaleString('id-ID')}
                                </span>
                                <span className="text-[10px] text-slate-500 sm:text-[11px] dark:text-zinc-400">
                                    log
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500 sm:text-[11px] dark:border-white/[0.04]">
                                <span>Ledger Kepatuhan</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    Permanen
                                </span>
                            </div>
                        </div>

                        {/* 2. Hari Ini */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase sm:text-[11px]">
                                    Hari Ini
                                </span>
                                <Activity className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-emerald-600 sm:text-2xl dark:text-emerald-400">
                                    {metrics.today.toLocaleString('id-ID')}
                                </span>
                                <span className="text-[10px] text-slate-500 sm:text-[11px] dark:text-zinc-400">
                                    event
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500 sm:text-[11px] dark:border-white/[0.04]">
                                <span>24 Jam Terakhir</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    Harian
                                </span>
                            </div>
                        </div>

                        {/* 3. Pelaku Aktif */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase sm:text-[11px]">
                                    Pelaku Aktif
                                </span>
                                <Users className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-purple-600 sm:text-2xl dark:text-purple-400">
                                    {metrics.actors_count.toLocaleString(
                                        'id-ID',
                                    )}
                                </span>
                                <span className="text-[10px] text-slate-500 sm:text-[11px] dark:text-zinc-400">
                                    user
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500 sm:text-[11px] dark:border-white/[0.04]">
                                <span>Tercatat Beraksi</span>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                    Aktif
                                </span>
                            </div>
                        </div>

                        {/* 4. Variasi Event */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase sm:text-[11px]">
                                    Ragam Event
                                </span>
                                <Layers className="size-3.5 text-amber-500" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-amber-600 sm:text-2xl dark:text-amber-400">
                                    {metrics.events_count.toLocaleString(
                                        'id-ID',
                                    )}
                                </span>
                                <span className="text-[10px] text-slate-500 sm:text-[11px] dark:text-zinc-400">
                                    tipe
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500 sm:text-[11px] dark:border-white/[0.04]">
                                <span>Cakupan Sistem</span>
                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                    Audit
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Filter Bar */}
                    <Form
                        action={auditRoutes.index.url()}
                        method="get"
                        className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 dark:border-white/[0.04] dark:bg-[#121418]"
                    >
                        {/* Row 1: Event Dropdown + Actor Dropdown + Reset + Count Badge */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="relative w-full flex-1">
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

                            <div className="relative w-full flex-1">
                                <select
                                    name="actor_id"
                                    defaultValue={filters.actor_id ?? ''}
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    <option value="">
                                        Semua Pelaku / Aktor
                                    </option>
                                    {actors.map((actor) => (
                                        <option key={actor.id} value={actor.id}>
                                            {actor.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>

                            <div className="flex items-center gap-2">
                                {(filters.event ||
                                    filters.actor_id ||
                                    filters.from ||
                                    filters.until) && (
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

                                <span className="shrink-0 rounded-md border border-slate-200/70 bg-white px-2 py-1 font-mono text-[11px] font-semibold text-slate-700 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                    {auditLogs.total} log
                                </span>
                            </div>
                        </div>

                        {/* Row 2: Date Pickers + Action Buttons */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="flex w-full flex-1 items-center gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        name="from"
                                        type="date"
                                        defaultValue={filters.from}
                                        aria-label="Dari tanggal"
                                        className="h-8 rounded-lg border-slate-200 bg-white text-xs text-slate-900 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                                <span className="text-xs font-medium text-slate-400">
                                    s/d
                                </span>
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
                                className="h-8 w-full shrink-0 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 sm:w-auto dark:bg-white dark:text-slate-900"
                            >
                                <Filter className="mr-1.5 size-3" /> Terapkan
                                Filter
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
                            <>
                                {/* Mobile Cards (sm:hidden) */}
                                <div className="divide-y divide-slate-100 sm:hidden dark:divide-white/[0.04]">
                                    {auditLogs.data.map((log) => {
                                        const rawSubjectType = log.subject_type
                                            ? (log.subject_type.split('\\').pop() ?? 'System')
                                            : 'System';
                                        const friendlySubjectType =
                                            subjectTypeLabels[rawSubjectType] || rawSubjectType;
                                        const eventKey =
                                            log.event.split('.').pop() || log.event;
                                        const theme = eventThemeMap[eventKey] || {
                                            label: eventKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                                            textSolid: 'text-slate-600 dark:text-zinc-400',
                                        };
                                        const realSubjectName = getRealSubjectName(log, friendlySubjectType);
                                        const narrative = getAuditNarrative(log);

                                        return (
                                            <div
                                                key={log.id}
                                                onClick={() => setSelectedLogForRaw(log)}
                                                className="block cursor-pointer p-3.5 transition-colors hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-white/[0.02]"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                            <span className={`font-semibold ${theme.textSolid}`}>
                                                                {theme.label}
                                                            </span>
                                                            <span>·</span>
                                                            <span>{friendlySubjectType}</span>
                                                        </div>
                                                        <p className="mt-0.5 line-clamp-1 text-xs font-bold text-slate-900 dark:text-white">
                                                            {realSubjectName}
                                                        </p>
                                                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
                                                            {narrative}
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <Avatar className="size-5 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                <AvatarFallback className="text-[7px] font-bold">
                                                                    {getInitials(log.actor?.name ?? 'Sistem')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="truncate text-[11px] font-medium text-slate-700 dark:text-zinc-200">
                                                                {log.actor?.name ?? 'Sistem Otomatis'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">&bull;</span>
                                                            <span className="font-mono text-[10px] text-slate-400">
                                                                {log.ip_address ?? '127.0.0.1'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="mt-1 size-4 shrink-0 text-slate-400" />
                                                </div>
                                                <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] dark:border-white/[0.04]">
                                                    <span className="font-mono text-slate-400">
                                                        Log #{log.id}
                                                    </span>
                                                    <span className="font-mono text-slate-500 dark:text-zinc-400">
                                                        {formatDate(log.created_at, true)} WIB
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop Data Table (hidden sm:block) */}
                                <div className="hidden overflow-x-auto sm:block">
                                    <table className="w-full table-fixed text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                                <th className="w-[13%] py-2.5 pr-3 pl-4 font-semibold">
                                                    Waktu
                                                </th>
                                                <th className="w-[12%] px-3 py-2.5 font-semibold">
                                                    Aktivitas
                                                </th>
                                                <th className="w-[19%] px-3 py-2.5 font-semibold">
                                                    Objek &amp; Target
                                                </th>
                                                <th className="w-[16%] px-3 py-2.5 font-semibold">
                                                    Pelaku
                                                </th>
                                                <th className="w-[37%] px-3 py-2.5 font-semibold">
                                                    Detail Perubahan
                                                </th>
                                                <th className="w-[3%] py-2.5 pr-4 pl-1 text-right font-semibold"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                            {auditLogs.data.map((log) => {
                                                const rawSubjectType = log.subject_type
                                                    ? (log.subject_type.split('\\').pop() ?? 'System')
                                                    : 'System';
                                                const friendlySubjectType =
                                                    subjectTypeLabels[rawSubjectType] || rawSubjectType;
                                                const eventKey =
                                                    log.event.split('.').pop() || log.event;
                                                const theme = eventThemeMap[eventKey] || {
                                                    label: eventKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                                                    textSolid: 'text-slate-600 dark:text-zinc-400',
                                                };
                                                const realSubjectName = getRealSubjectName(log, friendlySubjectType);
                                                const narrative = getAuditNarrative(log);

                                                return (
                                                    <tr
                                                        key={log.id}
                                                        onClick={() => setSelectedLogForRaw(log)}
                                                        className="group cursor-pointer transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                    >
                                                        {/* 1. Waktu */}
                                                        <td className="py-2.5 pr-3 pl-4 font-mono text-[11px] whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                            {formatDate(log.created_at, true)}
                                                        </td>

                                                        {/* 2. Aktivitas (Text Only, Solid Color) */}
                                                        <td className="px-3 py-2.5 whitespace-nowrap">
                                                            <span className={`text-xs font-semibold ${theme.textSolid}`}>
                                                                {theme.label}
                                                            </span>
                                                        </td>

                                                        {/* 3. Objek & Target */}
                                                        <td className="px-3 py-2.5">
                                                            <div className="min-w-0 space-y-0.5">
                                                                <p
                                                                    title={realSubjectName}
                                                                    className="truncate text-xs font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                                                                >
                                                                    {realSubjectName}
                                                                </p>
                                                                <span className="block truncate font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                                    {friendlySubjectType}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* 4. Pelaku / Aktor with Avatar */}
                                                        <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <Avatar className="size-6 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                    <AvatarFallback className="text-[8px] font-bold">
                                                                        {getInitials(log.actor?.name ?? 'Sistem')}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="min-w-0 flex-1 truncate">
                                                                    <p
                                                                        className="truncate text-xs font-semibold text-slate-900 dark:text-white"
                                                                        title={log.actor?.name ?? 'Sistem Otomatis'}
                                                                    >
                                                                        {log.actor?.name ?? 'Sistem Otomatis'}
                                                                    </p>
                                                                    <p className="truncate text-[10px] text-slate-400 dark:text-zinc-500">
                                                                        {log.ip_address ?? '127.0.0.1'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* 5. Detail Perubahan (Paragraph Only) */}
                                                        <td className="px-3 py-2.5">
                                                            <p
                                                                className="line-clamp-2 text-xs leading-relaxed text-slate-700 dark:text-zinc-300"
                                                                title={narrative}
                                                            >
                                                                {narrative}
                                                            </p>
                                                        </td>

                                                        {/* 6. Action Arrow */}
                                                        <td className="py-2.5 pr-4 pl-1 text-right whitespace-nowrap">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedLogForRaw(log);
                                                                }}
                                                                className="inline-flex size-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                                            >
                                                                <ChevronRight className="size-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
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

            {/* Technical Raw Log Detail Modal */}
            <RawLogDetailDialog
                log={selectedLogForRaw}
                onClose={() => setSelectedLogForRaw(null)}
            />
        </>
    );
}

// Helper to derive readable subject title
function getRealSubjectName(log: Log, friendlySubjectType: string): string {
    if (log.event === 'audit.pruned') {
        return 'Sistem Log Audit';
    }
    if (log.subject) {
        const s = log.subject as Record<string, unknown>;
        if (s.name && typeof s.name === 'string') return s.name;
        if (s.title && typeof s.title === 'string') return s.title;
        if (s.invoice_number) return `Invoice #${s.invoice_number}`;
        if (s.payment_number) return `Pembayaran #${s.payment_number}`;
        if (s.reference_number) return `Surat #${s.reference_number}`;
        if (s.court_name) return String(s.court_name);
        if (s.matter_number) return `Perkara #${s.matter_number}`;
    }
    const rawSubjectType = log.subject_type
        ? (log.subject_type.split('\\').pop() ?? 'System')
        : 'System';
    if (rawSubjectType === 'User' && log.actor?.name) {
        return log.actor.name;
    }
    return friendlySubjectType;
}

const namedEvents: Record<string, string> = {
    'client.created': 'Mendaftarkan data profil klien baru.',
    'client.updated': 'Memperbarui rincian informasi klien.',
    'client.compliance_added': 'Menambahkan dokumen kepatuhan / izin berusaha klien.',
    'client.compliance_updated': 'Memperbarui dokumen kepatuhan klien.',
    'client.compliance_deleted': 'Menghapus dokumen kepatuhan klien.',
    'matter.created': 'Membuka berkas perkara hukum baru.',
    'matter.archived': 'Menutup dan mengarsipkan berkas perkara.',
    'matter.party_added': 'Menambahkan pihak terkait pada perkara.',
    'matter.deadline_added': 'Menambahkan tenggat waktu proses perkara.',
    'matter.event_added': 'Menambahkan agenda kegiatan perkara.',
    'matter.note_added': 'Menambahkan catatan hukum pada perkara.',
    'matter.evidence_added': 'Menambahkan alat bukti berkas perkara.',
    'matter.evidence_updated': 'Memperbarui data alat bukti perkara.',
    'matter.evidence_deleted': 'Menghapus alat bukti berkas perkara.',
    'matter.chronology_added': 'Menambahkan kronologi peristiwa hukum perkara.',
    'matter.chronology_deleted': 'Menghapus catatan kronologi perkara.',
    'matter.legal_hold_placed': 'Menerapkan status Legal Hold pada berkas perkara.',
    'matter.legal_hold_released': 'Mencabut status Legal Hold pada berkas perkara.',
    'document.uploaded': 'Mengunggah berkas dokumen baru ke brankas.',
    'document.downloaded': 'Mengunduh salinan berkas dokumen.',
    'document.approved': 'Menyetujui draf dokumen hukum.',
    'document.revision_requested': 'Mengajukan permintaan revisi pada draf dokumen.',
    'document.approval_requested': 'Mengajukan permohonan persetujuan draf dokumen.',
    'signature.request_sent': 'Mengirimkan permohonan tanda tangan digital kepada pihak terkait.',
    'signature.signer_completed': 'Penandatangan telah menyelesaikan proses tanda tangan digital.',
    'signature.signed_final_processed': 'Menghasilkan berkas final bertanda tangan digital tersertifikasi.',
    'signature.reminder_resent': 'Mengirimkan ulang notifikasi pengingat tanda tangan.',
    'invoice.generated': 'Menerbitkan tagihan invoice baru kepada klien.',
    'invoice.cancelled': 'Membatalkan tagihan invoice.',
    'payment.recorded': 'Mencatat penerimaan pembayaran tagihan klien.',
    'payment.verified': 'Memverifikasi bukti transfer pembayaran klien.',
    'payment.refunded': 'Melakukan pengembalian pembayaran klien (refund).',
    'payment.reversed': 'Membatalkan pencatatan pembayaran (reversal).',
    'correspondence.logged': 'Mencatat surat korespondensi resmi baru.',
    'correspondence.dispatched': 'Mendistribusikan surat korespondensi keluar.',
    'staff.created': 'Mendaftarkan akun staf / advokat baru.',
    'staff.updated': 'Memperbarui data akun staf / advokat.',
    'user.invited': 'Mengundang pengguna baru ke dalam workspace.',
    'user.deleted': 'Menghapus akun pengguna dari workspace.',
    'conflict.checked': 'Menjalankan pemeriksaan potensi konflik kepentingan.',
    'conflict.resolved': 'Menyelesaikan pemeriksaan konflik kepentingan.',
    'template.created': 'Membuat template draf hukum baru.',
    'template.duplicated': 'Menduplikasi template draf hukum.',
    'template.document_generated': 'Menghasilkan draf dokumen otomatis dari template.',
};

/**
 * Pure Paragraph Narrative Generator for Audit Details
 */
function getAuditNarrative(log: Log): string {
    const metadata = log.metadata ?? {};

    // 1. Audit Log Pruned Event
    if (log.event === 'audit.pruned') {
        const deleted = metadata.records_deleted ?? 0;
        const opt = String(metadata.retention_option ?? 'all');
        const optLabel =
            valueLabels[opt] ||
            (opt === 'all' ? 'Semua Riwayat' : `Lebih dari ${opt} Hari`);
        return `Pembersihan log audit: ${String(deleted)} rekaman log lama dihapus dari sistem (opsi: ${optLabel}).`;
    }

    // 2. Workflow Transition (from -> to)
    if (metadata.workflow && typeof metadata.workflow === 'object') {
        const wf = metadata.workflow as { from?: string; to?: string };
        const fromLabel = wf.from ? valueLabels[wf.from] || wf.from : 'Awal';
        const toLabel = wf.to ? valueLabels[wf.to] || wf.to : 'Tujuan';
        return `Mengubah status alur kerja dari "${fromLabel}" menjadi "${toLabel}".`;
    }

    // 3. Monetary Change (before -> after, currency)
    if (metadata.amount && typeof metadata.amount === 'object') {
        const amt = metadata.amount as {
            before?: number;
            after?: number;
            currency?: string;
        };
        const curr = amt.currency || 'IDR';
        const beforeStr = formatCurrency(amt.before, curr);
        const afterStr = formatCurrency(amt.after, curr);
        return `Menyesuaikan nilai nominal transaksi dari ${beforeStr} menjadi ${afterStr}.`;
    }

    // 4. Field Changes (before -> after)
    if (metadata.changes && typeof metadata.changes === 'object') {
        const ch = metadata.changes as {
            before?: Record<string, unknown>;
            after?: Record<string, unknown>;
        };
        const beforeObj = ch.before ?? {};
        const afterObj = ch.after ?? {};

        const allKeys = Array.from(
            new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]),
        ).filter((k) => {
            if (
                ['updated_at', 'created_at', 'id', 'remember_token'].includes(k)
            ) {
                return false;
            }
            return JSON.stringify(beforeObj[k]) !== JSON.stringify(afterObj[k]);
        });

        if (allKeys.length === 1) {
            const k = allKeys[0];
            const beforeVal = formatValue(beforeObj[k]);
            const afterVal = formatValue(afterObj[k]);
            if (beforeVal === 'Kosong') {
                return `Menetapkan nilai ${formatFieldKey(k)} menjadi "${afterVal}".`;
            }
            return `Memperbarui ${formatFieldKey(k)} dari "${beforeVal}" menjadi "${afterVal}".`;
        }

        if (allKeys.length > 1) {
            const phrases = allKeys.map((k) => {
                const b = formatValue(beforeObj[k]);
                const a = formatValue(afterObj[k]);
                return `${formatFieldKey(k)} ("${b}" → "${a}")`;
            });
            return `Memperbarui ${allKeys.length} rincian: ${phrases.join(', ')}.`;
        }
    }

    // 5. Named Common System Events
    if (namedEvents[log.event]) {
        let extra = '';
        if (metadata.title) extra = ` (${metadata.title})`;
        else if (metadata.client_number) extra = ` (No. ${metadata.client_number})`;
        else if (metadata.version_number) extra = ` (Versi ${metadata.version_number})`;
        else if (metadata.reason) extra = ` dengan alasan: ${metadata.reason}`;
        return `${namedEvents[log.event]}${extra}`;
    }

    // 6. Direct narrative strings
    if (
        metadata.message ||
        metadata.reason ||
        metadata.description ||
        metadata.note ||
        metadata.action
    ) {
        return String(
            metadata.message ||
                metadata.reason ||
                metadata.description ||
                metadata.note ||
                metadata.action,
        );
    }

    // 7. Arbitrary Key-Value Pairs
    const rawKeys = Object.keys(metadata).filter(
        (k) => !['ip', 'user_agent', 'browser', 'pruned_at'].includes(k),
    );
    if (rawKeys.length > 0) {
        const items = rawKeys.map(
            (k) => `${formatFieldKey(k)}: ${formatValue(metadata[k])}`,
        );
        return `Rincian atribut: ${items.join(', ')}.`;
    }

    return 'Aktivitas sistem tercatat dalam ledger tanpa rincian atribut khusus.';
}

/**
 * Executive Audit Log Detail Modal (Matching Finance & Governance Detail Modals)
 */
function RawLogDetailDialog({
    log,
    onClose,
}: {
    log: Log | null;
    onClose: () => void;
}) {
    const [copiedJson, setCopiedJson] = useState(false);
    const [copiedHash, setCopiedHash] = useState(false);
    const getInitials = useInitials();

    if (!log) return null;

    const rawSubjectType = log.subject_type
        ? (log.subject_type.split('\\').pop() ?? 'System')
        : 'System';
    const friendlySubjectType = subjectTypeLabels[rawSubjectType] || rawSubjectType;
    const eventKey = log.event.split('.').pop() || log.event;
    const theme = eventThemeMap[eventKey] || {
        label: eventKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        textSolid: 'text-slate-600 dark:text-zinc-400',
    };
    const realSubjectName = getRealSubjectName(log, friendlySubjectType);
    const narrative = getAuditNarrative(log);

    const copyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(log, null, 2));
        setCopiedJson(true);
        setTimeout(() => setCopiedJson(false), 2000);
    };

    const copyHash = (hash: string) => {
        navigator.clipboard.writeText(hash);
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2000);
    };

    // Extract changes table if available
    const metadata = log.metadata ?? {};
    const changes = metadata.changes as {
        before?: Record<string, unknown>;
        after?: Record<string, unknown>;
    } | undefined;
    const beforeObj = changes?.before ?? {};
    const afterObj = changes?.after ?? {};
    const changeKeys = Array.from(
        new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]),
    ).filter((k) => {
        if (['updated_at', 'created_at', 'id', 'remember_token'].includes(k)) return false;
        return JSON.stringify(beforeObj[k]) !== JSON.stringify(afterObj[k]);
    });

    return (
        <Dialog open={!!log} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="flex max-h-[90vh] w-[95vw] sm:max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                {/* 1. Header Matching Finance / Email Dialogs */}
                <DialogHeader className="shrink-0 border-b border-slate-100 bg-slate-50/60 px-5 py-4 text-left sm:px-6 dark:border-white/[0.06] dark:bg-white/[0.025]">
                    <div className="flex items-start justify-between gap-3 pr-6">
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                                <ShieldCheck className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`text-xs font-semibold ${theme.textSolid}`}>
                                        {theme.label}
                                    </span>
                                    <span className="text-slate-300 dark:text-zinc-600">&bull;</span>
                                    <span className="font-mono text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                        Log #{log.id}
                                    </span>
                                </div>
                                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white truncate">
                                    {realSubjectName}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    {friendlySubjectType} &bull; Tercatat pada {formatDate(log.created_at, true)} WIB
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* 2. Scrollable Body Content */}
                <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                    {/* Meta Summary Card */}
                    <div className="grid grid-cols-1 gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 text-xs sm:grid-cols-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
                        {/* Actor */}
                        <div className="flex items-center gap-2.5">
                            <Avatar className="size-8 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                <AvatarFallback className="text-xs font-bold">
                                    {getInitials(log.actor?.name ?? 'Sistem')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <span className="block text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                    Pelaku / Aktor
                                </span>
                                <p className="truncate font-semibold text-slate-900 dark:text-white">
                                    {log.actor?.name ?? 'Sistem Otomatis'}
                                </p>
                                <p className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                    {log.actor?.email ?? 'system@internal'}
                                </p>
                            </div>
                        </div>

                        {/* Waktu & IP */}
                        <div>
                            <span className="block text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                Waktu &amp; IP Jaringan
                            </span>
                            <p className="font-semibold text-slate-900 dark:text-white">
                                {formatDate(log.created_at, true)} WIB
                            </p>
                            <p className="font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                                IP: {log.ip_address ?? '127.0.0.1'}
                            </p>
                        </div>

                        {/* Subject Target */}
                        <div className="border-t border-slate-200/60 pt-2 dark:border-white/5">
                            <span className="block text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                Objek Sasaran
                            </span>
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                                {realSubjectName}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                {friendlySubjectType} {log.subject_id ? `(#${log.subject_id})` : ''}
                            </p>
                        </div>

                        {/* Event Code */}
                        <div className="border-t border-slate-200/60 pt-2 dark:border-white/5">
                            <span className="block text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                Kode Event &amp; Kategori
                            </span>
                            <p className="font-mono font-semibold text-slate-900 dark:text-white truncate">
                                {log.event}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                Kategori: {log.category ?? 'Audit Trail'}
                            </p>
                        </div>
                    </div>

                    {/* Detail Perubahan (Narasi Utama) */}
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/10 dark:bg-[#12141a]">
                        <div className="border-b border-slate-100 pb-2 mb-2.5 text-[10.5px] font-bold tracking-wider text-slate-400 uppercase dark:border-white/5 dark:text-zinc-500">
                            Detail Perubahan &amp; Narasi Aktivitas
                        </div>
                        <p className="text-xs leading-relaxed font-medium text-slate-800 dark:text-zinc-200">
                            {narrative}
                        </p>

                        {/* If specific field changes exist, show a clean comparison table */}
                        {changeKeys.length > 0 && (
                            <div className="mt-3.5 overflow-hidden rounded-lg border border-slate-200/80 dark:border-white/10">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-200/80 bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/10 dark:bg-white/[0.04]">
                                            <th className="px-3 py-2 font-semibold">Atribut</th>
                                            <th className="px-3 py-2 font-semibold">Sebelum</th>
                                            <th className="px-3 py-2 font-semibold">Sesudah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {changeKeys.map((k) => (
                                            <tr key={k}>
                                                <td className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-300">
                                                    {formatFieldKey(k)}
                                                </td>
                                                <td className="px-3 py-2 text-slate-400 line-through dark:text-zinc-500">
                                                    {formatValue(beforeObj[k])}
                                                </td>
                                                <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">
                                                    {formatValue(afterObj[k])}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Cryptographic Ledger Hashes */}
                    {(log.entry_hash || log.previous_hash) && (
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 text-xs dark:border-white/[0.06] dark:bg-white/[0.02]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                    Integritas Ledger Kriptografi (SHA-256)
                                </span>
                                {log.entry_hash && (
                                    <button
                                        type="button"
                                        onClick={() => copyHash(log.entry_hash!)}
                                        className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                    >
                                        {copiedHash ? (
                                            <>
                                                <Check className="size-3 text-emerald-600" />
                                                <span className="text-emerald-600 font-semibold">Tersalin</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="size-3" />
                                                <span>Salin Hash</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            {log.entry_hash && (
                                <div className="space-y-0.5 mb-2">
                                    <span className="block text-[9.5px] text-slate-400 dark:text-zinc-500">Entry Hash:</span>
                                    <p className="font-mono text-[10.5px] break-all text-slate-800 dark:text-zinc-200 select-all">
                                        {log.entry_hash}
                                    </p>
                                </div>
                            )}
                            {log.previous_hash && (
                                <div className="space-y-0.5">
                                    <span className="block text-[9.5px] text-slate-400 dark:text-zinc-500">Previous Hash (Chained):</span>
                                    <p className="font-mono text-[10.5px] break-all text-slate-500 dark:text-zinc-400 select-all">
                                        {log.previous_hash}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Collapsible Raw Metadata JSON */}
                    <details className="group rounded-xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#12141a]">
                        <summary className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 select-none hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-white/[0.02]">
                            <span>Lihat Metadata Teknis Lengkap (JSON)</span>
                            <ChevronDown className="size-3.5 text-slate-400 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="border-t border-slate-100 p-3 dark:border-white/5">
                            <pre className="max-h-52 overflow-auto rounded-lg border border-slate-200 bg-slate-900 p-3 font-mono text-[10.5px] leading-relaxed text-emerald-400 dark:border-white/10 dark:bg-black/90">
                                {JSON.stringify(log.metadata ?? {}, null, 2)}
                            </pre>
                        </div>
                    </details>
                </div>

                {/* 3. Footer Matching Finance Dialogs */}
                <DialogFooter className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6 dark:border-white/[0.06] dark:bg-white/[0.02]">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyJson}
                        className="h-8.5 rounded-lg border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                        {copiedJson ? (
                            <>
                                <Check className="mr-1.5 size-3.5 text-emerald-600" />
                                Tersalin
                            </>
                        ) : (
                            <>
                                <Copy className="mr-1.5 size-3.5 text-slate-500" />
                                Salin JSON
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="h-8.5 rounded-lg border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/10"
                    >
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
            <DialogContent className="max-w-xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                <div className="border-b border-slate-100 bg-slate-50/60 p-5 dark:border-white/5 dark:bg-zinc-900/40">
                    <DialogHeader>
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400">
                                <Trash2 className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                    Bersihkan &amp; Pemangkasan Log Audit
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Pilih durasi retensi penyimpanan untuk
                                    menghapus log aktivitas yang sudah lampau.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                <Form
                    action={auditRoutes.prune.url()}
                    method="post"
                    onSuccess={() => {
                        onOpenChange(false);
                        setConfirmed(false);
                    }}
                    className="space-y-4 p-5"
                >
                    {({ processing }) => (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-zinc-300">
                                    Pilih Batas Waktu Retensi (Durasi Hilang)
                                </Label>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {retentionOptions.map((opt) => {
                                        const isSelected =
                                            retention === opt.value;
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
                                                    onChange={() =>
                                                        setRetention(opt.value)
                                                    }
                                                    className="sr-only"
                                                />
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {opt.label}
                                                    </span>
                                                    <span
                                                        className={`py-0.2 rounded px-1.5 font-mono text-[9.5px] font-bold ${
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
                                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                    <div className="space-y-0.5 text-amber-900 dark:text-amber-300">
                                        <p className="font-bold">
                                            Konfirmasi Integritas &amp;
                                            Kepatuhan
                                        </p>
                                        <p className="text-[11px] text-amber-800/90 dark:text-amber-400/90">
                                            Penghapusan log bersifat permanen.
                                            Aktivitas pembersihan ini akan
                                            dicatat sebagai event audit baru (
                                            <code>audit.pruned</code>) untuk
                                            menjaga akuntabilitas sistem. Total
                                            saat ini:{' '}
                                            <strong>{totalLogs}</strong> log.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Safety Checkbox */}
                            <label className="flex cursor-pointer items-start gap-2 pt-1 select-none">
                                <input
                                    type="checkbox"
                                    checked={confirmed}
                                    onChange={(e) =>
                                        setConfirmed(e.target.checked)
                                    }
                                    className="mt-0.5 size-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 dark:border-white/20 dark:bg-zinc-800"
                                />
                                <span className="text-xs text-slate-700 dark:text-zinc-300">
                                    Saya mengonfirmasi bahwa saya berwenang
                                    melakukan pembersihan data log audit
                                    kepatuhan ini.
                                </span>
                            </label>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/5">
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
                                    className="h-8 rounded-lg bg-rose-600 px-4 text-xs font-bold text-white shadow-2xs transition-all hover:bg-rose-700 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <Trash2 className="mr-1.5 size-3.5" />
                                    {processing
                                        ? 'Membersihkan...'
                                        : 'Bersihkan Log Sekarang'}
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
    breadcrumbs: [{ title: 'Audit Log', href: auditRoutes.index.url() }],
};
