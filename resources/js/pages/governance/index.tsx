import { Form, Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    Archive,
    ArrowDownLeft,
    ArrowUpRight,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    Download,
    FileText,
    FolderKanban,
    Inbox,
    Layers,
    Mail,
    MessageSquare,
    Package,
    Paperclip,
    Plus,
    RotateCcw,
    Scale,
    Search,
    Send,
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
    client?: { id: string; display_name: string };
    creator?: { id: number; name: string };
    documents_count?: number;
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
    const [showExportsModal, setShowExportsModal] = useState(false);
    const [conflictSearch, setConflictSearch] = useState('');
    const [conflictStatusFilter, setConflictStatusFilter] = useState('');
    const [conflictMatterFilter, setConflictMatterFilter] = useState('');
    const [activeTab, setActiveTab] = useState<
        'all' | 'correspondence' | 'conflicts' | 'hold'
    >('all');

    const filteredConflictChecks = conflictChecks.filter((item) => {
        if (conflictSearch) {
            const q = conflictSearch.toLowerCase();
            const matchSubject = item.subject_name.toLowerCase().includes(q);
            const matchSearched = item.searched_names?.some((n) =>
                n.toLowerCase().includes(q),
            );
            const matchMatter =
                item.matter?.matter_number.toLowerCase().includes(q) ||
                item.matter?.title.toLowerCase().includes(q);
            if (!matchSubject && !matchSearched && !matchMatter) {
                return false;
            }
        }
        if (conflictStatusFilter) {
            if (conflictStatusFilter === 'clear' && item.status !== 'clear')
                return false;
            if (conflictStatusFilter === 'conflict' && item.status === 'clear')
                return false;
            if (
                conflictStatusFilter === 'pending' &&
                item.decision !== 'pending'
            )
                return false;
        }
        if (conflictMatterFilter && item.matter?.id !== conflictMatterFilter) {
            return false;
        }
        return true;
    });

    return (
        <>
            <Head title="Tata Kelola & Kepatuhan Perkara" />

            <div className="min-h-screen bg-[#fafafc] pb-16 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-3.5 px-4 py-3.5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Action Bar */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-200/60 pb-3 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-0.5">
                            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white">
                                Tata Kelola &amp; Kepatuhan
                            </h1>
                            <p className="text-[11px] text-slate-500 sm:text-xs dark:text-zinc-400">
                                Log korespondensi resmi, uji konflik kepentingan
                                (conflict check), status legal hold, dan serah
                                terima perkara.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                            {can.conflict && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setConflictModal(true)}
                                    className="h-7.5 rounded-lg border-slate-200/70 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                >
                                    <Scale className="mr-1.5 size-3.5 text-slate-500" />
                                    Jalankan Conflict Check
                                </Button>
                            )}
                            {can.correspondence && (
                                <Button
                                    size="sm"
                                    onClick={() => setCorrespondenceModal(true)}
                                    className="h-7.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                >
                                    <Mail className="mr-1.5 size-3.5" />
                                    Catat Korespondensi
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 2. Top 4 Compact Bento KPI Cards */}
                    <section className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Korespondensi */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    LOG KORESPONDENSI
                                </span>
                                <Mail className="size-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.total_correspondences}
                                </span>
                                <span className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    komunikasi
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                <span>Surat Masuk &amp; Keluar</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    Resmi
                                </span>
                            </div>
                        </div>

                        {/* 2. Uji Konflik */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    CONFLICT CHECKS
                                </span>
                                <Scale className="size-3.5 text-slate-500 dark:text-zinc-400" />
                            </div>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.conflict_checks}
                                </span>
                                <span className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    pemeriksaan
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                <span>Uji Pihak Lawan &amp; Afiliasi</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                    Etika
                                </span>
                            </div>
                        </div>

                        {/* 3. Review Konflik Tertunda */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    PERLU KEPUTUSAN
                                </span>
                                <AlertTriangle className="size-3.5 text-amber-500" />
                            </div>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span
                                    className={`font-mono text-xl font-bold tracking-tight ${metrics.pending_conflicts > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}
                                >
                                    {metrics.pending_conflicts}
                                </span>
                                <span className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    potensial
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                <span>Status</span>
                                <span
                                    className={`font-semibold ${metrics.pending_conflicts > 0 ? 'text-amber-600' : 'text-slate-700 dark:text-zinc-300'}`}
                                >
                                    {metrics.pending_conflicts > 0
                                        ? 'Menunggu Waiver'
                                        : 'Semua Ditinjau'}
                                </span>
                            </div>
                        </div>

                        {/* 4. Legal Hold & Arsip */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-bold tracking-wider uppercase">
                                    LEGAL HOLD &amp; ARSIP
                                </span>
                                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="mt-1.5 flex items-baseline gap-1.5">
                                <span className="font-mono text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.legal_holds}
                                </span>
                                <span className="text-[10.5px] text-slate-500 dark:text-zinc-400">
                                    hold aktif
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                <span>Perkara Diarsipkan</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                    {metrics.archived} Perkara
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Segmented Tab Navigation for Governance */}
                    <div className="flex [scrollbar-width:none] items-center gap-1 overflow-x-auto border-b border-slate-200/60 pb-2 [-ms-overflow-style:none] dark:border-white/[0.06] [&::-webkit-scrollbar]:hidden">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
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
                            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
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
                            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
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
                            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
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
                    <div className="grid items-start gap-3 lg:grid-cols-2">
                        {/* Section 1: Korespondensi Terbaru */}
                        {(activeTab === 'all' ||
                            activeTab === 'correspondence') && (
                            <div
                                className={
                                    activeTab === 'correspondence'
                                        ? 'lg:col-span-2'
                                        : ''
                                }
                            >
                                <div className="flex flex-col rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                                    {/* Header */}
                                    <div className="flex flex-col justify-between gap-2.5 border-b border-slate-100 pb-2.5 sm:flex-row sm:items-center dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                                <Mail className="size-3.5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Korespondensi Resmi Perkara
                                                </h3>
                                                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                    Log surat masuk, surat
                                                    keluar, dan panggilan resmi
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                {correspondences.length} entri
                                            </span>
                                            {can.correspondence && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        setCorrespondenceModal(
                                                            true,
                                                        )
                                                    }
                                                    className="h-7 rounded-lg bg-blue-600 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                                >
                                                    <Plus className="mr-1 size-3" />
                                                    Catat Surat
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Refined Filter Toolbar */}
                                    <Form
                                        {...governanceRoutes.index.form()}
                                        className="my-2.5 space-y-1.5 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2 dark:border-white/[0.04] dark:bg-[#121418]"
                                    >
                                        {/* Row 1: Search Input & Action Buttons */}
                                        <div className="flex gap-1.5">
                                            <div className="relative flex-1">
                                                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    name="search"
                                                    placeholder="Cari perihal surat, nomor, atau isi..."
                                                    defaultValue={
                                                        filters.search
                                                    }
                                                    className="h-7.5 rounded-lg border-slate-200/80 bg-white pl-8 text-xs text-slate-900 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100"
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                className="h-7.5 shrink-0 rounded-lg bg-slate-900 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                            >
                                                Filter
                                            </Button>
                                            {(filters.search ||
                                                filters.matter_id ||
                                                filters.direction ||
                                                filters.source) && (
                                                <Link
                                                    href={governanceRoutes.index.url()}
                                                    className="flex h-7.5 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                                    title="Reset Filter"
                                                >
                                                    <RotateCcw className="size-3 text-slate-400" />
                                                </Link>
                                            )}
                                        </div>

                                        {/* Row 2: Select Filters */}
                                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                            <div className="relative">
                                                <select
                                                    name="matter_id"
                                                    defaultValue={
                                                        filters.matter_id ?? ''
                                                    }
                                                    className="h-7.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200/80 bg-white pr-7 pl-2 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                >
                                                    <option value="">
                                                        Semua Perkara
                                                    </option>
                                                    {matters.map((matter) => (
                                                        <option
                                                            key={matter.id}
                                                            value={matter.id}
                                                        >
                                                            {
                                                                matter.matter_number
                                                            }{' '}
                                                            — {matter.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>

                                            <div className="relative">
                                                <select
                                                    name="direction"
                                                    defaultValue={
                                                        filters.direction ?? ''
                                                    }
                                                    className="h-7.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200/80 bg-white pr-7 pl-2 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                >
                                                    <option value="">
                                                        Arah: Semua
                                                    </option>
                                                    <option value="inbound">
                                                        Surat Masuk (Inbound)
                                                    </option>
                                                    <option value="outbound">
                                                        Surat Keluar (Outbound)
                                                    </option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                    </Form>

                                    {/* List Data / Empty State */}
                                    <div className="mt-0.5">
                                        {correspondences.length ? (
                                            <div className="max-h-[500px] space-y-1.5 overflow-y-auto pr-1">
                                                {correspondences.map((item) => {
                                                    const isInbound =
                                                        item.direction ===
                                                        'inbound';
                                                    return (
                                                        <Link
                                                            key={item.id}
                                                            href={correspondenceRoutes.show.url(
                                                                item.id,
                                                            )}
                                                            className="group flex flex-col justify-between gap-2.5 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs transition-all hover:border-blue-300 hover:bg-blue-50/20 hover:shadow-xs sm:flex-row sm:items-center sm:p-3 dark:border-white/[0.05] dark:bg-[#14161b] dark:hover:border-blue-800/50 dark:hover:bg-white/[0.02]"
                                                        >
                                                            <div className="flex min-w-0 flex-1 items-start gap-2.5">
                                                                {/* Direction Icon Badge */}
                                                                <div
                                                                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border transition-transform group-hover:scale-105 ${
                                                                        isInbound
                                                                            ? 'border-blue-200/80 bg-blue-50 text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/60 dark:text-blue-400'
                                                                            : 'border-emerald-200/80 bg-emerald-50 text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                                    }`}
                                                                >
                                                                    {isInbound ? (
                                                                        <Inbox className="size-3.5" />
                                                                    ) : (
                                                                        <Send className="size-3.5" />
                                                                    )}
                                                                </div>

                                                                {/* Text & Meta Details */}
                                                                <div className="min-w-0 flex-1 space-y-0.5">
                                                                    <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
                                                                        <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-mono font-bold text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                                                                            {
                                                                                item
                                                                                    .matter
                                                                                    .matter_number
                                                                            }
                                                                        </span>
                                                                        <span
                                                                            className={`inline-flex items-center rounded px-1.5 py-0.5 font-semibold ${
                                                                                isInbound
                                                                                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                                                                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                                                            }`}
                                                                        >
                                                                            {isInbound
                                                                                ? 'Surat Masuk'
                                                                                : 'Surat Keluar'}
                                                                        </span>
                                                                        <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600 capitalize dark:bg-zinc-800 dark:text-zinc-400">
                                                                            {
                                                                                item.source
                                                                            }
                                                                        </span>
                                                                        {item.documents_count &&
                                                                        item.documents_count >
                                                                            0 ? (
                                                                            <span className="inline-flex items-center gap-1 rounded bg-purple-50 px-1.5 py-0.5 font-semibold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                                                                                <Paperclip className="size-2.5" />
                                                                                {
                                                                                    item.documents_count
                                                                                }{' '}
                                                                                lampiran
                                                                            </span>
                                                                        ) : null}
                                                                    </div>

                                                                    <h4 className="line-clamp-1 text-xs font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                                        {
                                                                            item.subject
                                                                        }
                                                                    </h4>

                                                                    <div className="flex flex-wrap items-center gap-x-1.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                                        <span className="max-w-[280px] truncate font-medium text-slate-600 dark:text-zinc-300">
                                                                            {
                                                                                item
                                                                                    .matter
                                                                                    .title
                                                                            }
                                                                        </span>
                                                                        {item.client && (
                                                                            <>
                                                                                <span>
                                                                                    ·
                                                                                </span>
                                                                                <span className="max-w-[200px] truncate">
                                                                                    {
                                                                                        item
                                                                                            .client
                                                                                            .display_name
                                                                                    }
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Timestamp & Arrow Action */}
                                                            <div className="flex shrink-0 items-center justify-between gap-0.5 border-t border-slate-100 pt-1.5 pl-9.5 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:pt-0 sm:pl-0 dark:border-white/[0.04]">
                                                                <span className="font-mono text-[10.5px] font-semibold text-slate-600 dark:text-zinc-400">
                                                                    {formatDate(
                                                                        item.occurred_at,
                                                                    )}
                                                                </span>
                                                                <div className="flex items-center text-[10.5px] font-semibold text-blue-600 opacity-0 transition-all group-hover:opacity-100 dark:text-blue-400">
                                                                    <span>
                                                                        Detail
                                                                    </span>
                                                                    <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center px-3 py-8 text-center">
                                                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                                    <Mail className="size-4.5" />
                                                </div>
                                                <p className="mt-2.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                                    Belum Ada Log Korespondensi
                                                </p>
                                                <p className="mt-0.5 max-w-xs text-[10.5px] text-slate-400 dark:text-zinc-500">
                                                    Catat surat masuk, surat
                                                    keluar, relaas panggilan
                                                    pengadilan, atau email resmi
                                                    perkara.
                                                </p>
                                                {can.correspondence && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setCorrespondenceModal(
                                                                true,
                                                            )
                                                        }
                                                        className="mt-3 h-7.5 rounded-lg border-blue-200 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-950/40"
                                                    >
                                                        <Plus className="mr-1 size-3" />{' '}
                                                        Catat Korespondensi Baru
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Section 2: Conflict Checks */}
                        {(activeTab === 'all' || activeTab === 'conflicts') && (
                            <div
                                className={
                                    activeTab === 'conflicts'
                                        ? 'lg:col-span-2'
                                        : ''
                                }
                            >
                                <div className="flex flex-col rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                                    {/* Header */}
                                    <div className="flex flex-col justify-between gap-2.5 border-b border-slate-100 pb-2.5 sm:flex-row sm:items-center dark:border-white/[0.04]">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                                <Scale className="size-3.5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                                    Hasil Conflict Checks (Uji
                                                    Benturan)
                                                </h3>
                                                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                    Audit kepatuhan etika
                                                    profesi &amp; verifikasi
                                                    pihak lawan
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                                {conflictChecks.length} entri
                                            </span>
                                            {can.conflict && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        setConflictModal(true)
                                                    }
                                                    className="h-7 rounded-lg bg-slate-900 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                                >
                                                    <Plus className="mr-1 size-3" />
                                                    Uji Baru
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Matching Filter Toolbar */}
                                    <div className="my-2.5 space-y-1.5 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2 dark:border-white/[0.04] dark:bg-[#121418]">
                                        {/* Row 1: Search Input & Action/Reset Buttons */}
                                        <div className="flex gap-1.5">
                                            <div className="relative flex-1">
                                                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    value={conflictSearch}
                                                    onChange={(e) =>
                                                        setConflictSearch(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Cari nama pihak yang diperiksa..."
                                                    className="h-7.5 rounded-lg border-slate-200/80 bg-white pl-8 text-xs text-slate-900 focus:border-amber-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100"
                                                />
                                            </div>
                                            {(conflictSearch ||
                                                conflictStatusFilter ||
                                                conflictMatterFilter) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setConflictSearch('');
                                                        setConflictStatusFilter(
                                                            '',
                                                        );
                                                        setConflictMatterFilter(
                                                            '',
                                                        );
                                                    }}
                                                    className="flex h-7.5 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                                    title="Reset Filter"
                                                >
                                                    <RotateCcw className="size-3 text-slate-400" />
                                                </button>
                                            )}
                                            <div className="flex shrink-0 items-center gap-1">
                                                <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                                    <CheckCircle2 className="size-3 text-emerald-600" />
                                                    {
                                                        conflictChecks.filter(
                                                            (c) =>
                                                                c.status ===
                                                                'clear',
                                                        ).length
                                                    }
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                                    <AlertCircle className="size-3 text-amber-600" />
                                                    {
                                                        conflictChecks.filter(
                                                            (c) =>
                                                                c.status !==
                                                                'clear',
                                                        ).length
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        {/* Row 2: Select Filters */}
                                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                            <div className="relative">
                                                <select
                                                    value={conflictMatterFilter}
                                                    onChange={(e) =>
                                                        setConflictMatterFilter(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-7.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200/80 bg-white pr-7 pl-2 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-amber-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                >
                                                    <option value="">
                                                        Semua Perkara
                                                    </option>
                                                    {matters.map((matter) => (
                                                        <option
                                                            key={matter.id}
                                                            value={matter.id}
                                                        >
                                                            {
                                                                matter.matter_number
                                                            }{' '}
                                                            — {matter.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>

                                            <div className="relative">
                                                <select
                                                    value={conflictStatusFilter}
                                                    onChange={(e) =>
                                                        setConflictStatusFilter(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-7.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200/80 bg-white pr-7 pl-2 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-amber-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                >
                                                    <option value="">
                                                        Status: Semua
                                                    </option>
                                                    <option value="clear">
                                                        Bebas Benturan (Clear)
                                                    </option>
                                                    <option value="conflict">
                                                        Potensi Benturan
                                                        Kepentingan
                                                    </option>
                                                    <option value="pending">
                                                        Menunggu Keputusan
                                                        Partner
                                                    </option>
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* List Data / Empty State */}
                                    <div className="mt-0.5">
                                        {filteredConflictChecks.length ? (
                                            <div className="max-h-[500px] space-y-1.5 overflow-y-auto pr-1">
                                                {filteredConflictChecks.map(
                                                    (item) => (
                                                        <ConflictCheckRow
                                                            key={item.id}
                                                            item={item}
                                                            canApprove={
                                                                can.conflictApprove
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center px-3 py-8 text-center">
                                                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                                    <Scale className="size-4.5" />
                                                </div>
                                                <p className="mt-2.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                                    {conflictSearch ||
                                                    conflictStatusFilter ||
                                                    conflictMatterFilter
                                                        ? 'Tidak Ada Data yang Sesuai Filter'
                                                        : 'Uji Benturan Kepentingan Bersih'}
                                                </p>
                                                <p className="mt-0.5 max-w-xs text-[10.5px] text-slate-400 dark:text-zinc-500">
                                                    {conflictSearch ||
                                                    conflictStatusFilter ||
                                                    conflictMatterFilter
                                                        ? 'Coba sesuaikan kata kunci pencarian atau filter status Anda.'
                                                        : 'Uji kepatuhan etika profesi advokat terhadap calon klien atau pihak lawan perkara.'}
                                                </p>
                                                {can.conflict && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setConflictModal(
                                                                true,
                                                            )
                                                        }
                                                        className="mt-3 h-7.5 rounded-lg border-slate-200 text-xs font-semibold text-slate-900 hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-zinc-800"
                                                    >
                                                        <Scale className="mr-1 size-3" />{' '}
                                                        Jalankan Conflict Check
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 3: Arsip, Legal Hold & Handover Perkara */}
                    {(activeTab === 'all' || activeTab === 'hold') && (
                        <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-2xs sm:p-3.5 dark:border-white/[0.06] dark:bg-[#14161b]">
                            {/* Header */}
                            <div className="flex flex-col justify-between gap-2.5 border-b border-slate-100 pb-2.5 sm:flex-row sm:items-center dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                        <ShieldCheck className="size-3.5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Kontrol Arsip, Legal Hold &amp;
                                            Handover Perkara
                                        </h3>
                                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                                            Penguncian bukti litigasi, retensi
                                            berkas tertutup, dan paket serah
                                            terima klien
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                        {matters.length} perkara
                                    </span>
                                    {exports.length > 0 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setShowExportsModal(true)
                                            }
                                            className="h-7 rounded-lg border-blue-200 bg-blue-50 px-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300"
                                        >
                                            <Package className="mr-1.5 size-3" />
                                            Bundel Handover ({exports.length})
                                        </Button>
                                    )}
                                    <Button
                                        asChild
                                        size="sm"
                                        className="h-7 rounded-lg bg-slate-900 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                    >
                                        <Link href={matterRoutes.create.url()}>
                                            <Plus className="mr-1 size-3" />
                                            Perkara Baru
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Matching Info Summary Toolbar */}
                            <div className="my-2.5 space-y-1.5 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2 dark:border-white/[0.04] dark:bg-[#121418]">
                                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-1.5 py-0.5 font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                                        <ShieldAlert className="size-2.5 text-rose-600" />
                                        {
                                            matters.filter(
                                                (m) => m.legal_hold_at,
                                            ).length
                                        }{' '}
                                        Legal Hold Aktif
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        <Archive className="size-2.5 text-slate-500" />
                                        {
                                            matters.filter((m) => m.archived_at)
                                                .length
                                        }{' '}
                                        Diarsipkan
                                    </span>
                                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-1.5 py-0.5 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                                        <Download className="size-2.5 text-blue-600" />
                                        {exports.length} Bundel Handover Siap
                                        Unduh
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-400">
                                    <span className="truncate">
                                        Status Legal Hold melindungi seluruh
                                        berkas dan komunikasi perkara dari
                                        penghapusan selama proses litigasi.
                                    </span>
                                </div>
                            </div>

                            {/* Matters List Cards */}
                            <div className="mt-0.5">
                                {matters.length ? (
                                    <div className="max-h-[500px] space-y-1.5 overflow-y-auto pr-1">
                                        {matters.map((matter) => (
                                            <div
                                                key={matter.id}
                                                className="group flex flex-col justify-between gap-2.5 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs transition-all hover:border-emerald-300 hover:bg-emerald-50/10 hover:shadow-xs sm:flex-row sm:items-center sm:p-3 dark:border-white/[0.05] dark:bg-[#14161b] dark:hover:border-emerald-800/40"
                                            >
                                                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                                                    <div
                                                        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border transition-transform group-hover:scale-105 ${
                                                            matter.legal_hold_at
                                                                ? 'border-rose-200/80 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/60 dark:text-rose-400'
                                                                : matter.archived_at
                                                                  ? 'border-slate-200 bg-slate-100 text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                                                  : 'border-emerald-200/80 bg-emerald-50 text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                        }`}
                                                    >
                                                        {matter.legal_hold_at ? (
                                                            <ShieldAlert className="size-3.5" />
                                                        ) : matter.archived_at ? (
                                                            <Archive className="size-3.5" />
                                                        ) : (
                                                            <FolderKanban className="size-3.5" />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1 space-y-0.5">
                                                        <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
                                                            <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-mono font-bold text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                                                                {
                                                                    matter.matter_number
                                                                }
                                                            </span>
                                                            <StatusBadge
                                                                value={
                                                                    matter.status
                                                                }
                                                            />
                                                            {matter.legal_hold_at && (
                                                                <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                                                                    <ShieldAlert className="size-2.5" />{' '}
                                                                    Legal Hold
                                                                    Aktif
                                                                </span>
                                                            )}
                                                            {matter.archived_at && (
                                                                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                                    <Archive className="size-2.5" />{' '}
                                                                    Diarsipkan
                                                                </span>
                                                            )}
                                                        </div>

                                                        <Link
                                                            href={matterRoutes.show.url(
                                                                matter.id,
                                                            )}
                                                            className="line-clamp-1 block text-xs font-bold text-slate-900 transition-colors hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400"
                                                        >
                                                            {matter.title}
                                                        </Link>

                                                        <div className="flex flex-wrap items-center gap-x-1.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                            <span>
                                                                Klien:{' '}
                                                                {matter.client
                                                                    ?.display_name ??
                                                                    '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex shrink-0 flex-wrap items-center gap-1 pl-9.5 sm:pl-0">
                                                    {can.legalHold && (
                                                        <Form
                                                            {...(matter.legal_hold_at
                                                                ? legalHoldRoutes.destroy.form(
                                                                      matter.id,
                                                                  )
                                                                : legalHoldRoutes.store.form(
                                                                      matter.id,
                                                                  ))}
                                                        >
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className={`h-7 rounded-lg px-2 text-xs font-semibold shadow-2xs ${
                                                                    matter.legal_hold_at
                                                                        ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300'
                                                                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200'
                                                                }`}
                                                            >
                                                                <ShieldCheck className="mr-1 size-3" />
                                                                {matter.legal_hold_at
                                                                    ? 'Lepas Hold'
                                                                    : 'Pasang Hold'}
                                                            </Button>
                                                        </Form>
                                                    )}

                                                    {can.archive &&
                                                        matter.status ===
                                                            'closed' && (
                                                            <Form
                                                                {...matterGovernanceRoutes.archive.form(
                                                                    matter.id,
                                                                )}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 rounded-lg border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                                >
                                                                    <Archive className="mr-1 size-3" />
                                                                    Arsipkan
                                                                </Button>
                                                            </Form>
                                                        )}

                                                    {can.archive && (
                                                        <Form
                                                            {...matterExportRoutes.store.form(
                                                                matter.id,
                                                            )}
                                                        >
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-7 rounded-lg border-emerald-200 bg-emerald-50 px-2 text-xs font-semibold text-emerald-700 shadow-2xs hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                            >
                                                                <Download className="mr-1 size-3" />
                                                                Handover
                                                            </Button>
                                                        </Form>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                            <ShieldCheck className="size-5" />
                                        </div>
                                        <p className="mt-3 text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Tata Kelola &amp; Arsip Tertib
                                        </p>
                                        <p className="mt-1 max-w-xs text-[11px] text-slate-400 dark:text-zinc-500">
                                            Belum ada perkara terdaftar. Perkara
                                            aktif dapat diatur status Legal Hold
                                            atau diekspor sebagai bundel serah
                                            terima (handover) di sini.
                                        </p>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="mt-3.5 h-8 rounded-lg border-emerald-200 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                        >
                                            <Link href={matterRoutes.create.url()}>
                                                <Plus className="mr-1 size-3.5" />{' '}
                                                Registrasi Perkara Baru
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal: Log Korespondensi */}
            <Dialog
                open={correspondenceModal}
                onOpenChange={setCorrespondenceModal}
            >
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
                                    Dokumentasikan surat masuk/keluar, memo
                                    internal, atau email perkara.
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
                                <input
                                    type="hidden"
                                    name="direction"
                                    value="outbound"
                                />
                                <input
                                    type="hidden"
                                    name="source"
                                    value="manual"
                                />

                                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                                    {/* Left Column: Routing & Core Identifiers */}
                                    <div className="space-y-3">
                                        <div className="grid gap-1">
                                            <Label
                                                htmlFor="matter_id"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                            >
                                                Terkait Perkara{' '}
                                                <span className="text-rose-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id="matter_id"
                                                    name="matter_id"
                                                    required
                                                    className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/60 pr-8 pl-3 text-xs text-slate-900 outline-none hover:bg-slate-100/70 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                >
                                                    <option value="">
                                                        Pilih Perkara Terkait
                                                    </option>
                                                    {matters.map((matter) => (
                                                        <option
                                                            key={matter.id}
                                                            value={matter.id}
                                                        >
                                                            {
                                                                matter.matter_number
                                                            }{' '}
                                                            - {matter.title}
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
                                            <Label
                                                htmlFor="body"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                            >
                                                Ringkasan / Isi Korespondensi
                                            </Label>
                                            <textarea
                                                id="body"
                                                name="body"
                                                rows={3}
                                                placeholder="Tuliskan pokok bahasan atau poin penting komunikasi..."
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 text-xs leading-relaxed text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                            />
                                        </div>

                                        <div className="space-y-1.5 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]">
                                            <Label className="text-xs font-semibold text-slate-900 dark:text-white">
                                                Lampirkan Dokumen Perkara
                                            </Label>
                                            <div className="max-h-28 space-y-1 overflow-y-auto pt-0.5 pr-1">
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
                                                            <span className="truncate">
                                                                {doc.title}
                                                            </span>
                                                        </label>
                                                    ))
                                                ) : (
                                                    <p className="text-[11px] text-slate-500">
                                                        Belum ada dokumen yang
                                                        tersedia untuk
                                                        dilampirkan.
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
                                        onClick={() =>
                                            setCorrespondenceModal(false)
                                        }
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
                                    Pemeriksaan silang nama pihak lawan &amp;
                                    relasi bisnis.
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
                                    <Label
                                        htmlFor="conflict-matter_id"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Terkait Perkara (Opsional)
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="conflict-matter_id"
                                            name="matter_id"
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-100/70 focus:border-slate-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                        >
                                            <option value="">
                                                Pra-Matter / Calon Klien Baru
                                            </option>
                                            {matters.map((matter) => (
                                                <option
                                                    key={matter.id}
                                                    value={matter.id}
                                                >
                                                    {matter.matter_number} -{' '}
                                                    {matter.title}
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
                                    Pemeriksaan mencocokkan basis data perkara,
                                    klien, dan lawan. Berlaku 30 hari.
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

            {/* Handover Export Bundles Modal */}
            <Dialog open={showExportsModal} onOpenChange={setShowExportsModal}>
                <DialogContent className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <Package className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                    Bundel Handover Perkara (ZIP Export)
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Daftar arsip paket berkas perkara yang siap
                                    diunduh untuk serah terima klien.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="max-h-[380px] space-y-2 overflow-y-auto pt-2 pr-1">
                        {exports.length ? (
                            exports.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col justify-between gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 text-xs sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#121418]"
                                >
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="inline-flex items-center rounded-md bg-slate-200/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-800 dark:bg-white/10 dark:text-zinc-200">
                                                {item.matter.matter_number}
                                            </span>
                                            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                                Status: {item.status}
                                            </span>
                                        </div>
                                        <p className="truncate font-semibold text-slate-900 dark:text-white">
                                            {item.matter.title}
                                        </p>
                                    </div>
                                    {item.status === 'completed' && (
                                        <Button
                                            size="sm"
                                            className="h-7.5 shrink-0 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                            asChild
                                        >
                                            <a
                                                href={exportRoutes.download.url(
                                                    item.id,
                                                )}
                                            >
                                                <Download className="mr-1.5 size-3.5" />
                                                Unduh ZIP
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="py-6 text-center text-xs text-slate-400">
                                Belum ada bundel handover yang diekspor.
                            </p>
                        )}
                    </div>
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
    const isClear = item.status === 'clear';
    const requiresDecision =
        item.status !== 'clear' && item.decision === 'pending';

    return (
        <div className="group flex flex-col justify-between gap-2.5 rounded-xl border border-slate-200/70 bg-white p-2.5 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50/20 hover:shadow-xs sm:flex-row sm:items-center sm:p-3 dark:border-white/[0.05] dark:bg-[#14161b] dark:hover:border-white/10 dark:hover:bg-white/[0.02]">
            <div className="flex min-w-0 flex-1 items-start gap-2.5">
                {/* Status Icon Badge */}
                <div
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border transition-transform group-hover:scale-105 ${
                        isClear
                            ? 'border-emerald-200/80 bg-emerald-50 text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'border-amber-200/80 bg-amber-50 text-amber-600 dark:border-amber-900/40 dark:bg-amber-950/60 dark:text-amber-400'
                    }`}
                >
                    {isClear ? (
                        <CheckCircle2 className="size-3.5" />
                    ) : (
                        <Scale className="size-3.5" />
                    )}
                </div>

                {/* Text & Meta Details */}
                <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
                        <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-mono font-bold text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                            {item.matter?.matter_number ??
                                'Pra-Matter / Calon Klien'}
                        </span>
                        <StatusBadge value={item.status} />
                        <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 font-semibold uppercase ${
                                item.decision === 'approved'
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                    : item.decision === 'rejected'
                                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                                      : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
                            }`}
                        >
                            {item.decision}
                        </span>
                    </div>

                    <h4 className="line-clamp-1 text-xs font-bold text-slate-900 dark:text-white">
                        {item.subject_name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-1.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                        {item.searched_names &&
                        item.searched_names.length > 0 ? (
                            <span className="max-w-[280px] truncate">
                                Diperiksa: {item.searched_names.join(', ')}
                            </span>
                        ) : (
                            <span>Pemeriksaan tunggal nama pihak</span>
                        )}
                        {item.matter?.title && (
                            <>
                                <span>·</span>
                                <span className="max-w-[200px] truncate font-medium text-slate-600 dark:text-zinc-300">
                                    {item.matter.title}
                                </span>
                            </>
                        )}
                    </div>

                    {item.decision_note && (
                        <p className="mt-0.5 rounded-md bg-slate-50 p-1.5 text-[10px] text-slate-600 dark:bg-zinc-800/80 dark:text-zinc-300">
                            <MessageSquare className="mr-1 inline size-2.5 text-slate-500" />
                            <strong>Catatan Partner:</strong>{' '}
                            {item.decision_note}
                        </p>
                    )}
                </div>
            </div>

            {canApprove && requiresDecision && (
                <div className="flex shrink-0 items-center pl-9.5 sm:pl-0">
                    <Button
                        size="sm"
                        onClick={() => setOpen(true)}
                        className="h-7 rounded-lg bg-amber-600 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-amber-700"
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
                                    Tetapkan persetujuan penanganan perkara atau
                                    penolakan kuasa.
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
                                                    defaultValue={
                                                        item.status ===
                                                        'blocked'
                                                            ? 'blocked'
                                                            : 'waived'
                                                    }
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-2.5 text-xs text-slate-900 outline-none focus:border-slate-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                                >
                                                    <option value="waived">
                                                        Waive / Disetujui
                                                        Bersyarat
                                                    </option>
                                                    <option value="blocked">
                                                        Tolak / Blocked
                                                        (Dilarang)
                                                    </option>
                                                    {item.status !==
                                                        'blocked' && (
                                                        <option value="cleared">
                                                            Clear (Bebas
                                                            Benturan)
                                                        </option>
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
                                                <p className="text-xs text-rose-500">
                                                    {errors.decision_note}
                                                </p>
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
                </div>
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
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
            >
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
    breadcrumbs: [{ title: 'Tata Kelola', href: governanceRoutes.index.url() }],
};
