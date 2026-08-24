import { Form, Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Archive,
    ArrowUpRight,
    CheckCircle2,
    ChevronDown,
    Download,
    FileText,
    FolderKanban,
    Layers,
    Mail,
    Plus,
    Scale,
    Search,
    ShieldAlert,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
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
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/format';
import * as governanceRoutes from '@/routes/governance';
import * as conflictRoutes from '@/routes/governance/conflict-checks';
import * as correspondenceRoutes from '@/routes/governance/correspondences';
import * as exportRoutes from '@/routes/governance/exports';
import * as matterGovernanceRoutes from '@/routes/governance/matters';
import * as matterExportRoutes from '@/routes/governance/matters/exports';
import * as legalHoldRoutes from '@/routes/governance/matters/legal-hold';
import * as matterRoutes from '@/routes/matters';

type Matter = {
    id: string;
    matter_number: string;
    title: string;
    status: string;
    legal_hold_at?: string;
    archived_at?: string;
    client?: { display_name: string };
};

type Correspondence = {
    id: string;
    subject: string;
    direction: string;
    source: string;
    occurred_at: string;
    matter: Matter;
};

type Document = {
    id: string;
    matter_id: string;
    title: string;
};

type ConflictCheck = {
    id: string;
    subject_name: string;
    status: string;
    decision: string;
    decision_note?: string;
    searched_names?: string[];
    expires_at?: string;
    matches?: unknown[];
    matter?: Matter;
};

type Export = {
    id: string;
    status: string;
    matter: Matter;
    completed_at?: string;
};

export default function GovernanceIndex({
    matters,
    metrics,
    correspondences,
    conflictChecks,
    exports,
    documents,
    filters,
    can,
}: {
    matters: Matter[];
    metrics: {
        total_correspondences: number;
        conflict_checks: number;
        pending_conflicts: number;
        legal_holds: number;
        archived: number;
    };
    correspondences: Correspondence[];
    conflictChecks: ConflictCheck[];
    exports: Export[];
    documents: Document[];
    filters: Record<string, string>;
    can: {
        correspondence: boolean;
        conflict: boolean;
        conflictApprove: boolean;
        archive: boolean;
        legalHold: boolean;
    };
}) {
    const [correspondenceModal, setCorrespondenceModal] = useState(false);
    const [conflictModal, setConflictModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'correspondence' | 'conflicts' | 'hold'>('all');

    return (
        <>
            <Head title="Tata Kelola & Kepatuhan Perkara" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Action Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Tata Kelola &amp; Kepatuhan
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Log korespondensi resmi, uji konflik kepentingan (conflict check), status legal hold, dan serah terima perkara.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                            {can.conflict && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setConflictModal(true)}
                                    className="h-8 rounded-lg border-slate-200/70 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <Scale className="mr-1.5 size-3.5 text-slate-500" />
                                    Jalankan Conflict Check
                                </Button>
                            )}
                            {can.correspondence && (
                                <Button
                                    size="sm"
                                    onClick={() => setCorrespondenceModal(true)}
                                    className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                >
                                    <Mail className="mr-1.5 size-3.5" />
                                    + Catat Korespondensi
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 2. Top 4 Compact Bento KPI Cards */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Korespondensi */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">LOG KORESPONDENSI</span>
                                <Mail className="size-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.total_correspondences}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    komunikasi
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Surat Masuk &amp; Keluar</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">Resmi</span>
                            </div>
                        </div>

                        {/* 2. Uji Konflik */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">CONFLICT CHECKS</span>
                                <Scale className="size-3.5 text-slate-500 dark:text-zinc-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.conflict_checks}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    pemeriksaan
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Uji Pihak Lawan &amp; Afiliasi</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">Etika</span>
                            </div>
                        </div>

                        {/* 3. Review Konflik Tertunda */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">PERLU KEPUTUSAN</span>
                                <AlertTriangle className="size-3.5 text-amber-500" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span
                                    className={`font-mono text-2xl font-bold tracking-tight ${metrics.pending_conflicts > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}
                                >
                                    {metrics.pending_conflicts}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    potensial
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Status</span>
                                <span className={`font-semibold ${metrics.pending_conflicts > 0 ? 'text-amber-600' : 'text-slate-700 dark:text-zinc-300'}`}>
                                    {metrics.pending_conflicts > 0 ? 'Menunggu Waiver' : 'Semua Ditinjau'}
                                </span>
                            </div>
                        </div>

                        {/* 4. Legal Hold & Arsip */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">LEGAL HOLD &amp; ARSIP</span>
                                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.legal_holds}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    hold aktif
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Perkara Diarsipkan</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">{metrics.archived} Perkara</span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Segmented Tab Switcher */}
                    <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200/60 pb-2.5 dark:border-white/[0.06]">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'all'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-950'
                                    : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-400'
                            }`}
                        >
                            <Layers className="size-3" />
                            Semua Modul
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('correspondence')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'correspondence'
                                    ? 'bg-blue-600 text-white shadow-2xs'
                                    : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-blue-50/50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-400'
                            }`}
                        >
                            <Mail className="size-3" />
                            Korespondensi ({correspondences.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('conflicts')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'conflicts'
                                    ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                    : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-400'
                            }`}
                        >
                            <Scale className="size-3" />
                            Conflict Checks ({conflictChecks.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('hold')}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                activeTab === 'hold'
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'border border-slate-200/70 bg-white text-slate-600 hover:bg-emerald-50/50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-400'
                            }`}
                        >
                            <ShieldCheck className="size-3" />
                            Legal Hold &amp; Handover ({matters.length})
                        </button>
                    </div>

                    {/* 4. Main 2-Column Grid */}
                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* Section 1: Korespondensi Terbaru */}
                        {(activeTab === 'all' || activeTab === 'correspondence') && (
                            <div className={activeTab === 'correspondence' ? 'lg:col-span-2' : ''}>
                                <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                                <Mail className="size-3.5" />
                                            </div>
                                            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Korespondensi Resmi Perkara
                                            </h3>
                                        </div>
                                        <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                            {correspondences.length} entri
                                        </span>
                                    </div>

                                    {/* Filter Controls */}
                                    <Form
                                        {...governanceRoutes.index.form()}
                                        className="my-3 space-y-2 rounded-lg border border-slate-200/60 bg-slate-50/60 p-2.5 dark:border-white/[0.04] dark:bg-[#121418]"
                                    >
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="relative">
                                                <select
                                                    name="matter_id"
                                                    defaultValue={filters.matter_id ?? ''}
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                >
                                                    <option value="">Semua Perkara</option>
                                                    {matters.map((matter) => (
                                                        <option key={matter.id} value={matter.id}>
                                                            {matter.matter_number}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                                            </div>

                                            <div className="relative">
                                                <select
                                                    name="direction"
                                                    defaultValue={filters.direction ?? ''}
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                >
                                                    <option value="">Arah: Semua</option>
                                                    <option value="inbound">Surat Masuk</option>
                                                    <option value="outbound">Surat Keluar</option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>

                                        <div className="flex gap-1.5">
                                            <Input
                                                name="search"
                                                placeholder="Cari subjek atau isi pesan..."
                                                defaultValue={filters.search}
                                                className="h-8 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-zinc-800"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                className="h-8 shrink-0 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                            >
                                                Filter
                                            </Button>
                                        </div>
                                    </Form>

                                    {/* List Data */}
                                    <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {correspondences.length ? (
                                            correspondences.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={correspondenceRoutes.show.url(item.id)}
                                                    className="group block py-2.5 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                >
                                                    <div className="flex items-start justify-between gap-2.5">
                                                        <div className="min-w-0">
                                                            <h4 className="truncate text-xs font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                                {item.subject}
                                                            </h4>
                                                            <p className="mt-0.5 font-mono text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                                <span className="font-semibold text-slate-700 dark:text-zinc-300">{item.matter.matter_number}</span> ·{' '}
                                                                <span className={`font-semibold ${item.direction === 'inbound' ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                                    {item.direction === 'inbound' ? 'Surat Masuk' : 'Surat Keluar'}
                                                                </span>{' '}
                                                                ({item.source})
                                                            </p>
                                                        </div>
                                                        <time className="font-mono text-[10.5px] font-semibold text-slate-500 dark:text-zinc-400 shrink-0">
                                                            {formatDate(item.occurred_at)}
                                                        </time>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="py-6 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
                                                Belum ada catatan korespondensi resmi.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Section 2: Conflict Checks */}
                        {(activeTab === 'all' || activeTab === 'conflicts') && (
                            <div className={activeTab === 'conflicts' ? 'lg:col-span-2' : ''}>
                                <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                                <Scale className="size-3.5" />
                                            </div>
                                            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Hasil Conflict Checks (Uji Benturan Kepentingan)
                                            </h3>
                                        </div>
                                        <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                            {conflictChecks.length} pemeriksaan
                                        </span>
                                    </div>

                                    <div className="divide-y divide-slate-100 pt-1 dark:divide-white/[0.04]">
                                        {conflictChecks.length ? (
                                            conflictChecks.map((item) => (
                                                <ConflictCheckRow
                                                    key={item.id}
                                                    item={item}
                                                    canApprove={can.conflictApprove}
                                                />
                                            ))
                                        ) : (
                                            <p className="py-6 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
                                                Belum ada catatan pemeriksaan conflict check.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 3: Arsip, Legal Hold & Handover Perkara */}
                    {(activeTab === 'all' || activeTab === 'hold') && (
                        <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                        <ShieldCheck className="size-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Kontrol Arsip, Legal Hold &amp; Handover Perkara
                                    </h3>
                                </div>
                                <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                    {matters.length} Perkara
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 pt-1 dark:divide-white/[0.04]">
                                {matters.length ? (
                                    matters.map((matter) => (
                                        <div
                                            key={matter.id}
                                            className="flex flex-col gap-2.5 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <Link
                                                        href={matterRoutes.show(matter.id)}
                                                        className="font-mono text-xs font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                                    >
                                                        {matter.matter_number}
                                                    </Link>
                                                    <span className="truncate text-xs text-slate-600 dark:text-zinc-400">
                                                        - {matter.title}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex items-center gap-1.5">
                                                    {matter.legal_hold_at ? (
                                                        <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.2 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                                                            <ShieldAlert className="size-2.5" />{' '}
                                                            Legal Hold Aktif
                                                        </span>
                                                    ) : matter.archived_at ? (
                                                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                                            <Archive className="size-2.5" />{' '}
                                                            Diarsipkan
                                                        </span>
                                                    ) : (
                                                        <StatusBadge value={matter.status} />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {can.legalHold && (
                                                    <Form
                                                        {...(matter.legal_hold_at
                                                            ? legalHoldRoutes.destroy.form(matter.id)
                                                            : legalHoldRoutes.store.form(matter.id))}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className={`h-7 rounded-lg px-2.5 text-xs font-semibold ${
                                                                matter.legal_hold_at
                                                                    ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                                                    : 'border-slate-200 hover:bg-slate-50 dark:border-white/10'
                                                            }`}
                                                        >
                                                            <ShieldCheck className="mr-1 size-3" />
                                                            {matter.legal_hold_at ? 'Lepas Hold' : 'Pasang Hold'}
                                                        </Button>
                                                    </Form>
                                                )}

                                                {can.archive && matter.status === 'closed' && (
                                                    <Form {...matterGovernanceRoutes.archive.form(matter.id)}>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 rounded-lg border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                                        >
                                                            <Archive className="mr-1 size-3" />
                                                            Arsipkan
                                                        </Button>
                                                    </Form>
                                                )}

                                                {can.archive && (
                                                    <Form {...matterExportRoutes.store.form(matter.id)}>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 rounded-lg border-slate-200 px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                                        >
                                                            <Download className="mr-1 size-3" />
                                                            Buat Handover
                                                        </Button>
                                                    </Form>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-6 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
                                        Belum ada data perkara.
                                    </p>
                                )}
                            </div>

                            {/* Completed Handover Export Bundles */}
                            {exports.length > 0 && (
                                <div className="mt-4 border-t border-slate-100 pt-3 dark:border-white/[0.04]">
                                    <h4 className="text-[10px] font-semibold text-slate-500 uppercase">
                                        Bundle Handover Tersedia (ZIP Export)
                                    </h4>
                                    <div className="mt-2 divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {exports.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between py-2 text-xs"
                                            >
                                                <div>
                                                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                                        {item.matter.matter_number}
                                                    </span>
                                                    <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                        Status: {item.status}
                                                    </span>
                                                </div>
                                                {item.status === 'completed' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 rounded-lg border-blue-200 bg-blue-50 px-2.5 text-xs font-semibold text-blue-700 shadow-2xs hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
                                                        asChild
                                                    >
                                                        <a href={exportRoutes.download.url(item.id)}>
                                                            <Download className="mr-1 size-3" />
                                                            Unduh ZIP
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal: Log Korespondensi */}
            <Dialog open={correspondenceModal} onOpenChange={setCorrespondenceModal}>
                <DialogContent className="max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl sm:max-w-2xl lg:max-w-3xl dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <Mail className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                    Catat Korespondensi Resmi
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Dokumentasikan surat masuk/keluar, memo internal, atau email perkara.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...correspondenceRoutes.store.form()}
                        className="space-y-4 pt-1"
                        onSuccess={() => setCorrespondenceModal(false)}
                    >
                        {({ processing, errors }) => (
                            <>
                                <input type="hidden" name="direction" value="outbound" />
                                <input type="hidden" name="source" value="manual" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                    {/* Left Column: Routing & Core Identifiers */}
                                    <div className="space-y-3">
                                        <div className="grid gap-1">
                                            <Label htmlFor="matter_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Terkait Perkara <span className="text-rose-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id="matter_id"
                                                    name="matter_id"
                                                    required
                                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/60 pr-8 pl-3 text-xs text-slate-900 outline-none hover:bg-slate-100/70 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="">Pilih Perkara Terkait</option>
                                                    {matters.map((matter) => (
                                                        <option key={matter.id} value={matter.id}>
                                                            {matter.matter_number} - {matter.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>

                                        <Field
                                            name="subject"
                                            label="Subjek / Perihal Surat"
                                            placeholder="Contoh: Tanggapan Somasi & Klarifikasi Bukti"
                                            required
                                        />

                                        <div className="grid gap-2 sm:grid-cols-2">
                                            <Field
                                                name="from_addresses"
                                                label="Dari (Pengirim)"
                                                placeholder="nama@instansi.com"
                                                required
                                            />
                                            <Field
                                                name="to_addresses"
                                                label="Kepada (Penerima)"
                                                placeholder="lawyer@rpklaw.co.id"
                                                required
                                            />
                                        </div>

                                        <Field
                                            name="occurred_at"
                                            label="Tanggal & Waktu Komunikasi"
                                            type="datetime-local"
                                            required
                                        />
                                    </div>

                                    {/* Right Column: Message Summary & Linked Documents */}
                                    <div className="space-y-3">
                                        <div className="grid gap-1">
                                            <Label htmlFor="body" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                                Ringkasan / Isi Korespondensi
                                            </Label>
                                            <textarea
                                                id="body"
                                                name="body"
                                                rows={3}
                                                placeholder="Tuliskan pokok bahasan atau poin penting komunikasi..."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white leading-relaxed"
                                            />
                                        </div>

                                        <div className="space-y-1.5 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                                Lampirkan Dokumen Perkara
                                            </Label>
                                            <div className="max-h-28 space-y-1 overflow-y-auto pr-1 pt-0.5">
                                                {documents.length ? (
                                                    documents.map((doc) => (
                                                        <label
                                                            key={doc.id}
                                                            className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 text-xs transition-colors hover:bg-white hover:text-blue-600 dark:hover:bg-zinc-800"
                                                        >
                                                            <input
                                                                name="document_ids[]"
                                                                type="checkbox"
                                                                value={doc.id}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="truncate">{doc.title}</span>
                                                        </label>
                                                    ))
                                                ) : (
                                                    <p className="text-[11px] text-slate-500">
                                                        Belum ada dokumen yang tersedia untuk dilampirkan.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-3.5 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCorrespondenceModal(false)}
                                        className="h-8.5 rounded-xl border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-8.5 rounded-xl bg-blue-600 px-4.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3.5" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            'Simpan Korespondensi'
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Modal: Conflict Check */}
            <Dialog open={conflictModal} onOpenChange={setConflictModal}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                <Scale className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                    Jalankan Conflict Check
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Pemeriksaan silang nama pihak lawan &amp; relasi bisnis.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...conflictRoutes.store.form()}
                        className="space-y-3.5 pt-1"
                        onSuccess={() => setConflictModal(false)}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-1">
                                    <Label htmlFor="conflict-matter_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Terkait Perkara (Opsional)
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="conflict-matter_id"
                                            name="matter_id"
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-100/70 focus:border-slate-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                        >
                                            <option value="">Pra-Matter / Calon Klien Baru</option>
                                            {matters.map((matter) => (
                                                <option key={matter.id} value={matter.id}>
                                                    {matter.matter_number} - {matter.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Nama-Nama Pihak yang Diperiksa *
                                    </Label>
                                    <div className="space-y-1.5">
                                        {[0, 1, 2, 3].map((index) => (
                                            <Input
                                                key={index}
                                                name={`names[${index}]`}
                                                placeholder={
                                                    index === 0
                                                        ? 'Nama utama / pihak lawan (Wajib)'
                                                        : `Pihak terafiliasi ${index + 1} (Opsional)`
                                                }
                                                required={index === 0}
                                                className="h-8 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-slate-500 focus:bg-white dark:border-white/10 dark:bg-[#121418]"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-blue-50/70 p-3 text-xs text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                                    Pemeriksaan mencocokkan basis data perkara, klien, dan lawan. Berlaku 30 hari.
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setConflictModal(false)}
                                        className="h-8 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3.5" />
                                                Memeriksa...
                                            </>
                                        ) : (
                                            'Jalankan Pemeriksaan'
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function ConflictCheckRow({
    item,
    canApprove,
}: {
    item: ConflictCheck;
    canApprove: boolean;
}) {
    const [open, setOpen] = useState(false);
    const requiresDecision = item.status !== 'clear' && item.decision === 'pending';

    return (
        <div className="flex items-start justify-between gap-3 py-2.5">
            <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.subject_name}
                    </h4>
                    <StatusBadge value={item.status} />
                </div>

                <p className="mt-0.5 font-mono text-[10.5px] text-slate-500 dark:text-zinc-400">
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">{item.matter?.matter_number ?? 'Pra-Matter'}</span> · Keputusan:{' '}
                    <strong className="text-slate-900 uppercase dark:text-white">
                        {item.decision}
                    </strong>
                </p>

                {item.searched_names && item.searched_names.length > 0 && (
                    <p className="mt-0.5 text-[10px] text-slate-500">
                        Diperiksa: {item.searched_names.join(', ')}
                    </p>
                )}

                {item.decision_note && (
                    <p className="mt-1.5 rounded-lg bg-slate-50 p-2 text-xs text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                        Catatan Partner: {item.decision_note}
                    </p>
                )}
            </div>

            {canApprove && requiresDecision && (
                <>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOpen(true)}
                        className="h-7 shrink-0 rounded-lg border-slate-200 px-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200"
                    >
                        Keputusan Partner
                    </Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                            <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                                <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                    Keputusan Partner Conflict Check
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Tetapkan persetujuan penanganan perkara atau penolakan kuasa.
                                </DialogDescription>
                            </DialogHeader>

                            <Form
                                {...conflictRoutes.resolve.form(item.id)}
                                className="space-y-3.5 pt-1"
                                onSuccess={() => setOpen(false)}
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor={`decision-${item.id}`}
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                            >
                                                Keputusan Akhir
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id={`decision-${item.id}`}
                                                    name="decision"
                                                    defaultValue={item.status === 'blocked' ? 'blocked' : 'waived'}
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-2.5 text-xs text-slate-900 outline-none focus:border-slate-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                                >
                                                    <option value="waived">Waive / Disetujui Bersyarat</option>
                                                    <option value="blocked">Tolak / Blocked (Dilarang)</option>
                                                    {item.status !== 'blocked' && (
                                                        <option value="cleared">Clear (Bebas Benturan)</option>
                                                    )}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>

                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor={`note-${item.id}`}
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                            >
                                                Alasan &amp; Dasar Keputusan *
                                            </Label>
                                            <textarea
                                                id={`note-${item.id}`}
                                                name="decision_note"
                                                rows={3}
                                                placeholder="Berikan justifikasi kepatuhan hukum / etika profesi..."
                                                required
                                                minLength={8}
                                                className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs text-slate-900 outline-none focus:border-slate-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                            />
                                            {errors.decision_note && (
                                                <p className="text-xs text-rose-500">{errors.decision_note}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setOpen(false)}
                                                className="h-8 rounded-lg px-3 text-xs font-semibold"
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                size="sm"
                                                disabled={processing}
                                                className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                            >
                                                Simpan Keputusan
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
}

function Field({
    name,
    label,
    type = 'text',
    placeholder,
    required = false,
}: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className="grid gap-1">
            <Label htmlFor={name} className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                className="h-8 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
        </div>
    );
}

GovernanceIndex.layout = {
    breadcrumbs: [{ title: 'Tata Kelola', href: governanceRoutes.index() }],
};
