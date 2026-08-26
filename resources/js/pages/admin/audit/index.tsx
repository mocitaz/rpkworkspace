import { Form, Head, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronDown,
    Code2,
    Copy,
    Download,
    Filter,
    Layers,
    RotateCcw,
    ShieldCheck,
    Trash2,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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

// Event labels and color themes
const eventThemeMap: Record<
    string,
    { label: string; bg: string; text: string; border: string }
> = {
    created: {
        label: 'Data Baru',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/50',
    },
    store: {
        label: 'Data Baru',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/50',
    },
    updated: {
        label: 'Pembaruan',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/50',
    },
    update: {
        label: 'Pembaruan',
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/50',
    },
    deleted: {
        label: 'Penghapusan',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800/50',
    },
    destroy: {
        label: 'Penghapusan',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800/50',
    },
    workflow_transition: {
        label: 'Ubah Status',
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        text: 'text-indigo-700 dark:text-indigo-300',
        border: 'border-indigo-200 dark:border-indigo-800/50',
    },
    monetary_change: {
        label: 'Nilai Keuangan',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800/50',
    },
    signed: {
        label: 'Tanda Tangan',
        bg: 'bg-purple-50 dark:bg-purple-950/40',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-200 dark:border-purple-800/50',
    },
    dispatched: {
        label: 'Terkirim',
        bg: 'bg-cyan-50 dark:bg-cyan-950/40',
        text: 'text-cyan-700 dark:text-cyan-300',
        border: 'border-cyan-200 dark:border-cyan-800/50',
    },
    verified: {
        label: 'Terverifikasi',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800/50',
    },
    pruned: {
        label: 'Pembersihan Log',
        bg: 'bg-slate-100 dark:bg-zinc-800',
        text: 'text-slate-700 dark:text-zinc-300',
        border: 'border-slate-200 dark:border-white/10',
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
    const [cleanOpen, setCleanOpen] = useState(false);
    const [selectedLogForRaw, setSelectedLogForRaw] = useState<Log | null>(
        null,
    );

    return (
        <>
            <Head title="Audit Log & Jejak Aktivitas - RPK App" />

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
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Log */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold tracking-wider uppercase">
                                    Total Rekaman Audit
                                </span>
                                <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.total.toLocaleString('id-ID')}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    log
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Ledger Kepatuhan</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    Permanen
                                </span>
                            </div>
                        </div>

                        {/* 2. Hari Ini */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold tracking-wider uppercase">
                                    Aktivitas Hari Ini
                                </span>
                                <Activity className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.today.toLocaleString('id-ID')}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    event
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>24 Jam Terakhir</span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    Harian
                                </span>
                            </div>
                        </div>

                        {/* 3. Pelaku Aktif */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold tracking-wider uppercase">
                                    Pelaku Teridentifikasi
                                </span>
                                <Users className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.actors_count.toLocaleString(
                                        'id-ID',
                                    )}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    pengguna
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Tercatat Beraksi</span>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                    Aktif
                                </span>
                            </div>
                        </div>

                        {/* 4. Variasi Event */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold tracking-wider uppercase">
                                    Ragam Event
                                </span>
                                <Layers className="size-3.5 text-amber-500" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {metrics.events_count.toLocaleString(
                                        'id-ID',
                                    )}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    tipe
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Perkara, Berkas &amp; Billing</span>
                                <span className="font-semibold text-amber-600 dark:text-amber-400">
                                    Cakupan
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Filter Bar */}
                    <Form
                        {...auditRoutes.index.form()}
                        className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 dark:border-white/[0.04] dark:bg-[#121418]"
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

                        {/* Row 2: Date Pickers + Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex min-w-[280px] flex-1 items-center gap-2">
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
                                className="h-8 shrink-0 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
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
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                            <th className="py-3 pr-3 pl-4">
                                                Waktu (WIB)
                                            </th>
                                            <th className="min-w-[160px] px-3 py-3">
                                                Aktivitas &amp; Objek
                                            </th>
                                            <th className="min-w-[160px] px-3 py-3">
                                                Pelaku / Aktor
                                            </th>
                                            <th className="min-w-[340px] px-3 py-3">
                                                Detail Perubahan
                                            </th>
                                            <th className="py-3 pr-4 pl-3 text-right">
                                                IP &amp; Audit
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {auditLogs.data.map((log) => {
                                            const rawSubjectType =
                                                log.subject_type
                                                    ? (log.subject_type
                                                          .split('\\')
                                                          .pop() ?? 'System')
                                                    : 'System';
                                            const friendlySubjectType =
                                                subjectTypeLabels[
                                                    rawSubjectType
                                                ] || rawSubjectType;
                                            const eventKey =
                                                log.event.split('.').pop() ||
                                                log.event;
                                            const theme = eventThemeMap[
                                                eventKey
                                            ] || {
                                                label: eventKey.replace(
                                                    /_/g,
                                                    ' ',
                                                ),
                                                bg: 'bg-slate-100 dark:bg-zinc-800',
                                                text: 'text-slate-700 dark:text-zinc-300',
                                                border: 'border-slate-200 dark:border-white/10',
                                            };

                                            // Determine real readable subject name
                                            let realSubjectName =
                                                friendlySubjectType;
                                            if (log.event === 'audit.pruned') {
                                                realSubjectName =
                                                    'Sistem Log Audit';
                                            } else if (log.subject) {
                                                const s = log.subject as Record<
                                                    string,
                                                    unknown
                                                >;
                                                if (
                                                    s.name &&
                                                    typeof s.name === 'string'
                                                ) {
                                                    realSubjectName = s.name;
                                                } else if (
                                                    s.title &&
                                                    typeof s.title === 'string'
                                                ) {
                                                    realSubjectName = s.title;
                                                } else if (s.invoice_number) {
                                                    realSubjectName = `Invoice #${s.invoice_number}`;
                                                } else if (s.payment_number) {
                                                    realSubjectName = `Pembayaran #${s.payment_number}`;
                                                } else if (s.reference_number) {
                                                    realSubjectName = `Surat #${s.reference_number}`;
                                                } else if (s.court_name) {
                                                    realSubjectName = String(
                                                        s.court_name,
                                                    );
                                                }
                                            } else if (
                                                rawSubjectType === 'User' &&
                                                log.actor?.name
                                            ) {
                                                realSubjectName =
                                                    log.actor.name;
                                            }

                                            return (
                                                <tr
                                                    key={log.id}
                                                    className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                >
                                                    {/* Timestamp */}
                                                    <td className="py-3 pr-3 pl-4 align-top font-mono text-xs font-semibold whitespace-nowrap text-slate-600 dark:text-zinc-400">
                                                        {formatDate(
                                                            log.created_at,
                                                            true,
                                                        )}
                                                    </td>

                                                    {/* Event & Target Object */}
                                                    <td className="px-3 py-3 align-top">
                                                        <div className="space-y-1">
                                                            <div>
                                                                <span
                                                                    className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-tight ${theme.bg} ${theme.text} ${theme.border}`}
                                                                >
                                                                    {
                                                                        theme.label
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span
                                                                    className="line-clamp-1 block font-semibold text-slate-900 dark:text-white"
                                                                    title={
                                                                        realSubjectName
                                                                    }
                                                                >
                                                                    {
                                                                        realSubjectName
                                                                    }
                                                                </span>
                                                                {log.event !==
                                                                    'audit.pruned' && (
                                                                    <span className="block text-[10.5px] text-slate-400 dark:text-zinc-500">
                                                                        {
                                                                            friendlySubjectType
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Actor */}
                                                    <td className="px-3 py-3 align-top whitespace-nowrap">
                                                        <div className="space-y-0.5">
                                                            <span className="block font-semibold text-slate-900 dark:text-white">
                                                                {log.actor
                                                                    ?.name ??
                                                                    'Sistem Otomatis'}
                                                            </span>
                                                            <p className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                                {log.actor
                                                                    ?.email ??
                                                                    'system@internal'}
                                                            </p>
                                                        </div>
                                                    </td>

                                                    {/* Simple Human-Readable Narrative Detail */}
                                                    <td className="px-3 py-3 align-top">
                                                        <AuditDetailCell
                                                            log={log}
                                                        />
                                                    </td>

                                                    {/* IP Address & Raw Modal Trigger */}
                                                    <td className="py-3 pr-4 pl-3 text-right align-top whitespace-nowrap">
                                                        <div className="space-y-1">
                                                            <span className="font-mono text-xs font-semibold text-slate-600 dark:text-zinc-400">
                                                                {log.ip_address ??
                                                                    '-'}
                                                            </span>
                                                            <div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSelectedLogForRaw(
                                                                            log,
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-400 transition-colors hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400"
                                                                    title="Lihat Rincian Teknis / JSON"
                                                                >
                                                                    <Code2 className="size-3" />
                                                                    <span>
                                                                        Data
                                                                        Teknis
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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

            {/* Technical Raw Log Detail Modal */}
            <RawLogDetailDialog
                log={selectedLogForRaw}
                onClose={() => setSelectedLogForRaw(null)}
            />
        </>
    );
}

/**
 * Human-Readable Narrative & Visual Diff Component (Clean, No Emojis)
 */
function AuditDetailCell({ log }: { log: Log }) {
    const metadata = log.metadata ?? {};

    // 1. Audit Log Pruned Event
    if (log.event === 'audit.pruned') {
        const deleted = metadata.records_deleted ?? 0;
        const opt = String(metadata.retention_option ?? 'all');
        const optLabel =
            valueLabels[opt] ||
            (opt === 'all' ? 'Semua Riwayat' : `Lebih dari ${opt} Hari`);

        return (
            <p className="text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                Membersihkan <strong>{String(deleted)}</strong> rekaman log
                audit lama (Opsi: {optLabel}).
            </p>
        );
    }

    // 2. Workflow Transition (from -> to)
    if (metadata.workflow && typeof metadata.workflow === 'object') {
        const wf = metadata.workflow as { from?: string; to?: string };
        const fromLabel = wf.from ? valueLabels[wf.from] || wf.from : 'Awal';
        const toLabel = wf.to ? valueLabels[wf.to] || wf.to : 'Tujuan';

        return (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-800 dark:text-zinc-200">
                <span>Mengubah status alur kerja:</span>
                <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-slate-50/90 px-2 py-0.5 dark:border-white/10 dark:bg-white/[0.03]">
                    <span className="font-semibold text-slate-600 dark:text-zinc-400">
                        {fromLabel}
                    </span>
                    <ArrowRight className="size-3 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-slate-900 dark:text-white">
                        {toLabel}
                    </span>
                </div>
            </div>
        );
    }

    // 3. Monetary Change (before -> after, currency)
    if (metadata.amount && typeof metadata.amount === 'object') {
        const amt = metadata.amount as {
            before?: number;
            after?: number;
            currency?: string;
        };
        const curr = amt.currency || 'IDR';

        return (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-800 dark:text-zinc-200">
                <span>Menyesuaikan nilai nominal:</span>
                <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-slate-50/90 px-2 py-0.5 dark:border-white/10 dark:bg-white/[0.03]">
                    <span className="font-medium text-slate-500 dark:text-zinc-400">
                        {formatCurrency(amt.before, curr)}
                    </span>
                    <ArrowRight className="size-3 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(amt.after, curr)}
                    </span>
                </div>
            </div>
        );
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
            )
                return false;
            return JSON.stringify(beforeObj[k]) !== JSON.stringify(afterObj[k]);
        });

        if (allKeys.length === 1) {
            const k = allKeys[0];
            return (
                <p className="text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                    Memperbarui <strong>{formatFieldKey(k)}</strong> dari{' '}
                    <em>"{formatValue(beforeObj[k])}"</em> menjadi{' '}
                    <strong>"{formatValue(afterObj[k])}"</strong>.
                </p>
            );
        }

        if (allKeys.length > 1) {
            return (
                <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                        Memperbarui {allKeys.length} rincian:
                    </p>
                    <div className="space-y-0.5">
                        {allKeys.slice(0, 3).map((k) => (
                            <div
                                key={k}
                                className="flex flex-wrap items-center gap-1.5 text-xs"
                            >
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                    {formatFieldKey(k)}:
                                </span>
                                <span className="text-slate-400 line-through dark:text-zinc-500">
                                    {formatValue(beforeObj[k])}
                                </span>
                                <ArrowRight className="size-3 shrink-0 text-blue-600 dark:text-blue-400" />
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {formatValue(afterObj[k])}
                                </span>
                            </div>
                        ))}
                        {allKeys.length > 3 && (
                            <span className="block text-[10.5px] text-slate-400 italic dark:text-zinc-500">
                                + {allKeys.length - 3} rincian perubahan lainnya
                            </span>
                        )}
                    </div>
                </div>
            );
        }
    }

    // 5. Named Common System Events
    const namedEvents: Record<string, string> = {
        'client.created': 'Mendaftarkan data profil klien baru.',
        'client.updated': 'Memperbarui rincian informasi klien.',
        'client.compliance_added':
            'Menambahkan dokumen kepatuhan / izin berusaha klien.',
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
        'matter.chronology_added':
            'Menambahkan kronologi peristiwa hukum perkara.',
        'matter.chronology_deleted': 'Menghapus catatan kronologi perkara.',
        'matter.legal_hold_placed':
            'Menerapkan status Legal Hold pada berkas perkara.',
        'matter.legal_hold_released':
            'Mencabut status Legal Hold pada berkas perkara.',
        'document.uploaded': 'Mengunggah berkas dokumen baru.',
        'document.downloaded': 'Mengunduh salinan berkas dokumen.',
        'document.approved': 'Menyetujui draf dokumen hukum.',
        'document.revision_requested':
            'Mengajukan permintaan revisi pada draf dokumen.',
        'document.approval_requested':
            'Mengajukan permohonan persetujuan draf dokumen.',
        'signature.request_sent':
            'Mengirimkan permohonan tanda tangan digital kepada pihak terkait.',
        'signature.signer_completed':
            'Penandatangan telah menyelesaikan proses tanda tangan digital.',
        'signature.signed_final_processed':
            'Menghasilkan berkas final bertanda tangan digital tersertifikasi.',
        'signature.reminder_resent':
            'Mengirimkan ulang notifikasi pengingat tanda tangan.',
        'invoice.generated': 'Menerbitkan tagihan invoice baru kepada klien.',
        'invoice.cancelled': 'Membatalkan tagihan invoice.',
        'payment.recorded': 'Mencatat penerimaan pembayaran tagihan klien.',
        'payment.verified': 'Memverifikasi bukti transfer pembayaran klien.',
        'payment.refunded': 'Melakukan pengembalian pembayaran klien (refund).',
        'payment.reversed': 'Membatalkan pencatatan pembayaran (reversal).',
        'correspondence.logged': 'Mencatat surat korespondensi resmi baru.',
        'correspondence.dispatched':
            'Mendistribusikan surat korespondensi keluar.',
        'staff.created': 'Mendaftarkan akun staf / advokat baru.',
        'staff.updated': 'Memperbarui data akun staf / advokat.',
        'user.invited': 'Mengundang pengguna baru ke dalam workspace.',
        'user.deleted': 'Menghapus akun pengguna dari workspace.',
        'conflict.checked':
            'Menjalankan pemeriksaan potensi konflik kepentingan.',
        'conflict.resolved': 'Menyelesaikan pemeriksaan konflik kepentingan.',
        'template.created': 'Membuat template draf hukum baru.',
        'template.duplicated': 'Menduplikasi template draf hukum.',
        'template.document_generated':
            'Menghasilkan draf dokumen otomatis dari template.',
    };

    if (namedEvents[log.event]) {
        let extraNote = '';
        if (metadata.title) extraNote = ` (${metadata.title})`;
        else if (metadata.client_number)
            extraNote = ` (No. ${metadata.client_number})`;
        else if (metadata.version_number)
            extraNote = ` (Versi ${metadata.version_number})`;
        else if (metadata.reason) extraNote = ` (Alasan: ${metadata.reason})`;

        return (
            <p className="text-xs leading-relaxed font-medium text-slate-800 dark:text-zinc-200">
                {namedEvents[log.event]}
                {extraNote}
            </p>
        );
    }

    // 6. Direct narrative strings (message, reason, note, description)
    if (
        metadata.message ||
        metadata.reason ||
        metadata.description ||
        metadata.note ||
        metadata.action
    ) {
        const text = String(
            metadata.message ||
                metadata.reason ||
                metadata.description ||
                metadata.note ||
                metadata.action,
        );
        return (
            <p className="text-xs leading-relaxed font-medium text-slate-800 dark:text-zinc-200">
                {text}
            </p>
        );
    }

    // 7. Arbitrary Key-Value Badges (clean pairs)
    const rawKeys = Object.keys(metadata).filter(
        (k) => !['ip', 'user_agent', 'browser', 'pruned_at'].includes(k),
    );

    if (rawKeys.length > 0) {
        return (
            <div className="flex flex-wrap gap-1.5">
                {rawKeys.map((k) => (
                    <span
                        key={k}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200/80 bg-slate-50/80 px-2 py-0.5 text-[11px] text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300"
                    >
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {formatFieldKey(k)}:
                        </span>
                        <span>{formatValue(metadata[k])}</span>
                    </span>
                ))}
            </div>
        );
    }

    // Default Fallback
    return (
        <span className="text-xs text-slate-400 italic dark:text-zinc-500">
            Aktivitas tercatat tanpa rincian atribut khusus.
        </span>
    );
}

/**
 * Technical Raw Data Modal Dialog
 */
function RawLogDetailDialog({
    log,
    onClose,
}: {
    log: Log | null;
    onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);

    if (!log) return null;

    const copyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(log, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={!!log} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                <div className="border-b border-slate-100 bg-slate-50/60 p-5 dark:border-white/5 dark:bg-zinc-900/40">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="flex size-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-400">
                                    <Code2 className="size-4.5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                        Rincian Teknis &amp; Integritas Ledger
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                        Log #{log.id} ·{' '}
                                        {formatDate(log.created_at, true)}
                                    </DialogDescription>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={copyJson}
                                className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800"
                            >
                                {copied ? (
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
                        </div>
                    </DialogHeader>
                </div>

                <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-white/[0.02]">
                            <span className="text-[10.5px] font-semibold tracking-wider text-slate-500 uppercase">
                                Event &amp; Kategori
                            </span>
                            <p className="font-mono font-bold text-slate-900 dark:text-white">
                                {log.event}{' '}
                                {log.category ? `(${log.category})` : ''}
                            </p>
                        </div>
                        <div className="space-y-1 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-white/[0.02]">
                            <span className="text-[10.5px] font-semibold tracking-wider text-slate-500 uppercase">
                                Pelaku / Aktor
                            </span>
                            <p className="font-medium text-slate-900 dark:text-white">
                                {log.actor?.name ?? 'Sistem Otomatis'}{' '}
                                <span className="font-mono text-slate-400">
                                    ({log.actor?.email ?? 'system'})
                                </span>
                            </p>
                        </div>
                        <div className="space-y-1 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-white/[0.02]">
                            <span className="text-[10.5px] font-semibold tracking-wider text-slate-500 uppercase">
                                IP Address &amp; Jaringan
                            </span>
                            <p className="font-mono font-medium text-slate-900 dark:text-white">
                                {log.ip_address ?? '127.0.0.1'}
                            </p>
                        </div>
                        <div className="space-y-1 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-white/[0.02]">
                            <span className="text-[10.5px] font-semibold tracking-wider text-slate-500 uppercase">
                                Target Objek Model
                            </span>
                            <p className="truncate font-mono font-medium text-slate-900 dark:text-white">
                                {log.subject_type ?? '-'} (#
                                {log.subject_id ?? '-'})
                            </p>
                        </div>
                    </div>

                    {/* Cryptographic SHA256 Ledger Hashes */}
                    {(log.entry_hash || log.previous_hash) && (
                        <div className="space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/50 p-3 text-xs dark:border-white/5 dark:bg-white/[0.02]">
                            <span className="text-[10.5px] font-semibold tracking-wider text-slate-500 uppercase">
                                Cryptographic Ledger Hashes (SHA-256)
                            </span>
                            {log.entry_hash && (
                                <div>
                                    <span className="block text-[10px] text-slate-400">
                                        Entry Hash:
                                    </span>
                                    <p className="font-mono text-[11px] break-all text-slate-800 select-all dark:text-zinc-200">
                                        {log.entry_hash}
                                    </p>
                                </div>
                            )}
                            {log.previous_hash && (
                                <div>
                                    <span className="block text-[10px] text-slate-400">
                                        Previous Hash:
                                    </span>
                                    <p className="font-mono text-[11px] break-all text-slate-500 select-all dark:text-zinc-400">
                                        {log.previous_hash}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Raw JSON Payload */}
                    <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                            Raw Metadata Payload
                        </span>
                        <pre className="max-h-56 overflow-auto rounded-xl border border-slate-200 bg-slate-900 p-3.5 font-mono text-[11px] leading-relaxed text-emerald-400 dark:border-white/10 dark:bg-black/80">
                            {JSON.stringify(log.metadata ?? {}, null, 2)}
                        </pre>
                    </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 p-4 dark:border-white/5 dark:bg-zinc-900/40">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="h-8 rounded-lg border-slate-200 text-xs font-semibold hover:bg-slate-50 dark:border-white/10"
                    >
                        Tutup
                    </Button>
                </div>
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
                    {...auditRoutes.prune.form()}
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
