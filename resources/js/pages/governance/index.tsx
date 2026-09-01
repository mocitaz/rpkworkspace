import { Form, Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Archive,
    ArrowDownLeft,
    ArrowUpRight,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Clock,
    Download,
    ExternalLink,
    FileCheck,
    FileText,
    Mail,
    MessageSquare,
    Package,
    Plus,
    RotateCcw,
    Scale,
    Search,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    Users,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { GovernanceComplianceHero } from '@/components/governance-compliance-hero';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
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

type MatchItem = {
    type: string;
    id: string;
    name: string;
    searched_query?: string;
    risk: 'blocked' | 'potential_match';
    similarity: number;
    role_label?: string;
    details?: string;
    matter_id?: string;
    matter_number?: string;
    matter_title?: string;
    matter_status?: string;
    responsible_partner?: string;
};

type ConflictCheck = {
    id: string;
    subject_name: string;
    status: string;
    decision: string;
    decision_note?: string;
    searched_names?: string[];
    expires_at?: string;
    created_at?: string;
    reviewed_at?: string;
    matches?: MatchItem[];
    matter?: Matter;
    client?: { id: string; client_number: string; display_name: string };
    requester?: { id: number; name: string };
    reviewer?: { id: number; name: string };
};

type Export = {
    id: string;
    status: string;
    matter: Matter;
    completed_at?: string;
};

const governanceCompactButtonClass =
    'h-6.5 gap-1 rounded-md px-2 text-[10px] font-semibold';
const governanceDialogPanelClass =
    'max-h-[90dvh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]';
const governanceDialogFooterClass =
    'sticky bottom-0 z-10 -mx-5 -mb-5 mt-5 flex items-center justify-end gap-2.5 border-t border-slate-100 bg-white/95 px-5 py-3.5 backdrop-blur-sm sm:-mx-6 sm:px-6 dark:border-white/[0.06] dark:bg-[#14161b]/95';
const governanceDialogCancelButtonClass =
    'h-9 rounded-lg border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200';
const governanceDialogPrimaryButtonClass =
    'h-9 rounded-lg px-4 text-xs font-semibold text-white shadow-xs';

function GovernanceDialogHeader({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    eyebrow: ReactNode;
    title: ReactNode;
    description: ReactNode;
}) {
    return (
        <DialogHeader className="border-b border-slate-100 bg-slate-50/60 px-5 py-3.5 text-left sm:px-6 dark:border-white/[0.06] dark:bg-white/[0.025]">
            <div className="grid min-h-9 grid-cols-[36px_minmax(0,1fr)] items-center gap-3 pr-6">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                    <Icon className="size-4.5" strokeWidth={1.8} />
                </div>
                <div className="min-w-0 self-center">
                    <DialogTitle className="text-sm leading-5 font-semibold text-slate-950 sm:text-base dark:text-white">
                        {title}
                    </DialogTitle>
                    <p className="truncate text-[11px] leading-4 text-slate-500 dark:text-zinc-400">
                        {description}
                    </p>
                </div>
            </div>
        </DialogHeader>
    );
}

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
    const [matterSearch, setMatterSearch] = useState('');
    const [matterStatusFilter, setMatterStatusFilter] = useState('');
    const [activeTab, setActiveTab] = useState<
        'correspondence' | 'conflicts' | 'hold'
    >('correspondence');

    const governanceTabClass = (
        tab: 'correspondence' | 'conflicts' | 'hold',
    ): string =>
        `relative shrink-0 border-b-2 px-1 pt-1 pb-2 text-[11px] font-semibold transition-colors ${
            activeTab === tab
                ? 'border-slate-950 text-slate-950 dark:border-white dark:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
        }`;

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

    const filteredMatters = matters.filter((matter) => {
        const query = matterSearch.trim().toLowerCase();
        const matchesSearch =
            !query ||
            matter.matter_number.toLowerCase().includes(query) ||
            matter.title.toLowerCase().includes(query) ||
            matter.client?.display_name.toLowerCase().includes(query);

        const matchesStatus =
            !matterStatusFilter ||
            (matterStatusFilter === 'legal_hold' && matter.legal_hold_at) ||
            (matterStatusFilter === 'archived' && matter.archived_at) ||
            (matterStatusFilter === 'active' &&
                !matter.legal_hold_at &&
                !matter.archived_at);

        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Head title="Tata Kelola & Kepatuhan Perkara" />

            <div className="min-h-screen bg-[#fafafc] pb-24 md:pb-10 dark:bg-[#0c0d10]">
                <main className="w-full space-y-5 px-4 pt-2.5 pb-8 sm:px-6 sm:pt-3.5 lg:px-8">
                    <GovernanceComplianceHero
                        correspondences={metrics.total_correspondences}
                        conflictChecks={metrics.conflict_checks}
                        pendingConflicts={metrics.pending_conflicts}
                        legalHolds={metrics.legal_holds}
                        archivedMatters={metrics.archived}
                        canRunConflictCheck={can.conflict}
                        canCreateCorrespondence={can.correspondence}
                        onRunConflictCheck={() => setConflictModal(true)}
                        onCreateCorrespondence={() =>
                            setCorrespondenceModal(true)
                        }
                    />
                    {/* 1. Header Navigation & Action Bar */}
                    <div className="hidden">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Tata Kelola &amp; Kepatuhan
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
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
                    <section className="hidden">
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

                    {/* 3. Governance workspace tabs */}
                    <div className="flex [scrollbar-width:none] items-center gap-8 overflow-x-auto border-b border-slate-200/60 [-ms-overflow-style:none] dark:border-white/[0.06] [&::-webkit-scrollbar]:hidden">
                        <button
                            type="button"
                            onClick={() => setActiveTab('correspondence')}
                            className={governanceTabClass('correspondence')}
                        >
                            Korespondensi · {correspondences.length}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('conflicts')}
                            className={governanceTabClass('conflicts')}
                        >
                            Conflict Checks · {conflictChecks.length}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('hold')}
                            className={governanceTabClass('hold')}
                        >
                            Legal Hold &amp; Handover · {matters.length}
                        </button>
                    </div>
                    {/* 4. Active governance workspace */}
                    <div>
                        {/* Section 1: Korespondensi Terbaru */}
                        {activeTab === 'correspondence' && (
                            <div>
                                <div className="flex min-h-[500px] flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    {/* Header */}
                                    <div className="flex shrink-0 flex-col justify-between gap-2.5 border-b border-slate-100 px-4 py-3.5 sm:flex-row sm:items-center dark:border-white/[0.04]">
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
                                            <span className="font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
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
                                        action={governanceRoutes.index.url()}
                                        method="get"
                                        className="mx-4 my-3 space-y-1.5 rounded-lg border border-slate-200/60 bg-slate-50/50 p-2 dark:border-white/[0.04] dark:bg-[#121418]"
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
                                    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                                        {correspondences.length ? (
                                            <div className="overflow-hidden rounded-lg border border-slate-200/70 dark:border-white/[0.06]">
                                                <div className="hidden grid-cols-[minmax(0,1fr)_7rem] gap-4 border-b border-slate-200/70 bg-slate-50/80 px-3 py-2 text-[9px] font-semibold tracking-[0.1em] text-slate-400 uppercase sm:grid dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-zinc-500">
                                                    <span>
                                                        Korespondensi &amp;
                                                        Perkara
                                                    </span>
                                                    <span className="text-right">
                                                        Tanggal
                                                    </span>
                                                </div>
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
                                                            className="group flex flex-col justify-between gap-2.5 border-b border-slate-100 bg-white px-3 py-3 transition-colors last:border-b-0 hover:bg-slate-50/70 sm:flex-row sm:items-center dark:border-white/[0.05] dark:bg-[#14161b] dark:hover:bg-white/[0.025]"
                                                        >
                                                            <div className="min-w-0 flex-1 border-l-2 border-blue-500 pl-3">
                                                                <div className="min-w-0 flex-1 space-y-0.5">
                                                                    <div className="flex flex-wrap items-center gap-1 text-[9.5px]">
                                                                        <span className="font-mono font-semibold text-slate-500 dark:text-zinc-400">
                                                                            {
                                                                                item
                                                                                    .matter
                                                                                    .matter_number
                                                                            }
                                                                        </span>
                                                                        <span className="text-slate-300 dark:text-zinc-700">
                                                                            ·
                                                                        </span>
                                                                        <span
                                                                            className={`font-semibold ${
                                                                                isInbound
                                                                                    ? 'text-blue-600 dark:text-blue-400'
                                                                                    : 'text-emerald-600 dark:text-emerald-400'
                                                                            }`}
                                                                        >
                                                                            {isInbound
                                                                                ? 'Surat Masuk'
                                                                                : 'Surat Keluar'}
                                                                        </span>
                                                                        <span className="text-slate-300 dark:text-zinc-700">
                                                                            ·
                                                                        </span>
                                                                        <span className="font-medium text-slate-500 capitalize dark:text-zinc-400">
                                                                            {
                                                                                item.source
                                                                            }
                                                                        </span>
                                                                        {item.documents_count &&
                                                                        item.documents_count >
                                                                            0 ? (
                                                                            <span className="font-semibold text-violet-600 dark:text-violet-400">
                                                                                ·{' '}
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
                                            <div className="flex h-full min-h-[220px] flex-col items-center justify-center px-3 py-6 text-center">
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
                        {activeTab === 'conflicts' && (
                            <div>
                                <div className="flex min-h-[500px] flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    {/* Header */}
                                    <div className="flex shrink-0 flex-col justify-between gap-2.5 border-b border-slate-100 px-4 py-3.5 sm:flex-row sm:items-center dark:border-white/[0.04]">
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
                                            <span className="font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                {conflictChecks.length} entri
                                            </span>
                                            {can.conflict && (
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        setConflictModal(true)
                                                    }
                                                    className={`${governanceCompactButtonClass} bg-slate-900 text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900`}
                                                >
                                                    <Plus className="size-3" />
                                                    Uji Baru
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Matching Filter Toolbar */}
                                    <div className="mx-4 my-3 shrink-0 space-y-1.5 rounded-lg border border-slate-200/60 bg-slate-50/50 p-2 dark:border-white/[0.04] dark:bg-[#121418]">
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
                                            <div className="flex shrink-0 items-center gap-3 text-[10px] font-semibold">
                                                <span className="text-emerald-600 dark:text-emerald-400">
                                                    {
                                                        conflictChecks.filter(
                                                            (c) =>
                                                                c.status ===
                                                                'clear',
                                                        ).length
                                                    }{' '}
                                                    clear
                                                </span>
                                                <span className="text-amber-600 dark:text-amber-400">
                                                    {
                                                        conflictChecks.filter(
                                                            (c) =>
                                                                c.status !==
                                                                'clear',
                                                        ).length
                                                    }{' '}
                                                    perlu tinjauan
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
                                    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                                        {filteredConflictChecks.length ? (
                                            <div className="overflow-hidden rounded-lg border border-slate-200/70 dark:border-white/[0.06]">
                                                <div className="hidden grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-slate-200/70 bg-slate-50/80 px-3 py-2 text-[9px] font-semibold tracking-[0.1em] text-slate-400 uppercase sm:grid dark:border-white/[0.06] dark:bg-white/[0.025] dark:text-zinc-500">
                                                    <span>
                                                        Pihak &amp; Hasil
                                                        Pemeriksaan
                                                    </span>
                                                    <span className="text-right">
                                                        Tindakan
                                                    </span>
                                                </div>
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
                                            <div className="flex h-full min-h-[220px] flex-col items-center justify-center px-3 py-6 text-center">
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
                                                        className={`${governanceCompactButtonClass} mt-3 border-slate-200 text-slate-900 hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-zinc-800`}
                                                    >
                                                        <Scale className="size-3" />{' '}
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
                    {activeTab === 'hold' && (
                        <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            {/* Header */}
                            <div className="flex shrink-0 flex-col justify-between gap-2.5 border-b border-slate-100 px-4 py-3.5 sm:flex-row sm:items-center dark:border-white/[0.04]">
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
                                            className={`${governanceCompactButtonClass} border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300`}
                                        >
                                            <Package className="size-3" />
                                            Bundel Handover ({exports.length})
                                        </Button>
                                    )}
                                    <Button
                                        asChild
                                        size="sm"
                                        className={`${governanceCompactButtonClass} bg-slate-900 text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900`}
                                    >
                                        <Link href={matterRoutes.create.url()}>
                                            <Plus className="size-3" />
                                            Perkara Baru
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Matter Search & Status Filter */}
                            <div className="mx-4 my-3 flex flex-col gap-1.5 rounded-lg border border-slate-200/60 bg-slate-50/50 p-2 sm:flex-row dark:border-white/[0.04] dark:bg-[#121418]">
                                <div className="relative min-w-0 flex-1">
                                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        value={matterSearch}
                                        onChange={(event) =>
                                            setMatterSearch(event.target.value)
                                        }
                                        placeholder="Cari nomor perkara, judul, atau klien..."
                                        className="h-7.5 rounded-lg border-slate-200/80 bg-white pl-8 text-xs text-slate-900 focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-100"
                                    />
                                </div>
                                <div className="relative sm:w-44">
                                    <select
                                        value={matterStatusFilter}
                                        onChange={(event) =>
                                            setMatterStatusFilter(
                                                event.target.value,
                                            )
                                        }
                                        className="h-7.5 w-full cursor-pointer appearance-none rounded-lg border border-slate-200/80 bg-white pr-7 pl-2 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-emerald-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="legal_hold">
                                            Legal Hold Aktif
                                        </option>
                                        <option value="archived">
                                            Diarsipkan
                                        </option>
                                        <option value="active">Aktif</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            {/* Matters List Cards */}
                            <div className="px-4 pb-4">
                                {filteredMatters.length ? (
                                    <div className="max-h-[440px] overflow-y-auto rounded-lg border border-slate-200/70 dark:border-white/[0.06]">
                                        <div className="sticky top-0 z-10 hidden grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-slate-200/70 bg-slate-50 px-3 py-2 text-[9px] font-semibold tracking-[0.1em] text-slate-400 uppercase sm:grid dark:border-white/[0.06] dark:bg-[#181a20] dark:text-zinc-500">
                                            <span>Perkara &amp; Status</span>
                                            <span className="text-right">
                                                Tindakan
                                            </span>
                                        </div>
                                        {filteredMatters.map((matter) => {
                                            const matterAccentClass =
                                                matter.legal_hold_at
                                                    ? 'border-rose-500'
                                                    : matter.archived_at
                                                      ? 'border-slate-400'
                                                      : 'border-emerald-500';

                                            return (
                                                <div
                                                    key={matter.id}
                                                    className="group flex flex-col justify-between gap-2.5 border-b border-slate-100 bg-white px-3 py-3 transition-colors last:border-b-0 hover:bg-slate-50/70 sm:flex-row sm:items-center dark:border-white/[0.05] dark:bg-[#14161b] dark:hover:bg-white/[0.025]"
                                                >
                                                    <div
                                                        className={`min-w-0 flex-1 border-l-2 pl-3 ${matterAccentClass}`}
                                                    >
                                                        <div className="min-w-0 flex-1 space-y-0.5">
                                                            <div className="flex flex-wrap items-center gap-1.5 text-[9.5px] font-semibold">
                                                                <span className="font-mono text-slate-500 dark:text-zinc-400">
                                                                    {
                                                                        matter.matter_number
                                                                    }
                                                                </span>
                                                                <span className="text-slate-300 dark:text-zinc-700">
                                                                    ·
                                                                </span>
                                                                <span className="text-emerald-600 capitalize dark:text-emerald-400">
                                                                    {matter.status.replaceAll(
                                                                        '_',
                                                                        ' ',
                                                                    )}
                                                                </span>
                                                                {matter.legal_hold_at && (
                                                                    <span className="text-rose-600 dark:text-rose-400">
                                                                        · Legal
                                                                        Hold
                                                                        Aktif
                                                                    </span>
                                                                )}
                                                                {matter.archived_at && (
                                                                    <span className="text-slate-500 dark:text-zinc-400">
                                                                        ·
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
                                                                    {matter
                                                                        .client
                                                                        ?.display_name ??
                                                                        '-'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex shrink-0 flex-wrap items-center gap-1">
                                                        {can.legalHold && (
                                                            <Form
                                                                action={
                                                                    matter.legal_hold_at
                                                                        ? legalHoldRoutes.destroy.url(
                                                                              matter.id,
                                                                          )
                                                                        : legalHoldRoutes.store.url(
                                                                              matter.id,
                                                                          )
                                                                }
                                                                method={
                                                                    matter.legal_hold_at
                                                                        ? 'delete'
                                                                        : 'post'
                                                                }
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className={`${governanceCompactButtonClass} shadow-2xs ${
                                                                        matter.legal_hold_at
                                                                            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300'
                                                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200'
                                                                    }`}
                                                                >
                                                                    <ShieldCheck className="size-3" />
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
                                                                    action={matterGovernanceRoutes.archive.url(
                                                                        matter.id,
                                                                    )}
                                                                    method="post"
                                                                >
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className={`${governanceCompactButtonClass} border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200`}
                                                                    >
                                                                        <Archive className="size-3" />
                                                                        Arsipkan
                                                                    </Button>
                                                                </Form>
                                                            )}

                                                        {can.archive && (
                                                            <Form
                                                                action={matterExportRoutes.store.url(
                                                                    matter.id,
                                                                )}
                                                                method="post"
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className={`${governanceCompactButtonClass} border-emerald-200 bg-emerald-50 text-emerald-700 shadow-2xs hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300`}
                                                                >
                                                                    <Download className="size-3" />
                                                                    Handover
                                                                </Button>
                                                            </Form>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                                            <Link
                                                href={matterRoutes.create.url()}
                                            >
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
                <DialogContent
                    className={`${governanceDialogPanelClass} gap-0 sm:max-w-2xl lg:max-w-3xl`}
                >
                    <GovernanceDialogHeader
                        icon={Mail}
                        eyebrow="Korespondensi Perkara"
                        title="Catat Korespondensi Resmi"
                        description="Dokumentasikan surat masuk/keluar, memo internal, atau email perkara."
                    />

                    <Form
                        action={correspondenceRoutes.store.url()}
                        method="post"
                        className="space-y-4 px-5 py-5 sm:px-6"
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

                                <div className={governanceDialogFooterClass}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCorrespondenceModal(false)
                                        }
                                        className={
                                            governanceDialogCancelButtonClass
                                        }
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className={`${governanceDialogPrimaryButtonClass} bg-blue-600 hover:bg-blue-700`}
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
            <ConflictCheckModal
                open={conflictModal}
                onOpenChange={setConflictModal}
                matters={matters}
            />

            {/* Handover Export Bundles Modal */}
            <Dialog open={showExportsModal} onOpenChange={setShowExportsModal}>
                <DialogContent
                    className={`${governanceDialogPanelClass} sm:max-w-lg`}
                >
                    <GovernanceDialogHeader
                        icon={Package}
                        eyebrow="Arsip & Serah Terima"
                        title="Bundel Handover Perkara"
                        description="Daftar arsip ZIP perkara yang siap diunduh untuk proses serah terima klien."
                    />

                    <div className="max-h-[380px] space-y-2 overflow-y-auto px-5 py-5 sm:px-6">
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

function ConflictCheckModal({
    open,
    onOpenChange,
    matters,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    matters: Matter[];
}) {
    const [names, setNames] = useState<string[]>(['', '', '']);
    const [selectedMatterId, setSelectedMatterId] = useState<string>('');
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewResult, setPreviewResult] = useState<{
        status: string;
        match_count: number;
        matches: MatchItem[];
    } | null>(null);

    const handleNameChange = (index: number, val: string) => {
        const next = [...names];
        next[index] = val;
        setNames(next);
    };

    const addNameField = () => {
        if (names.length < 10) {
            setNames([...names, '']);
        }
    };

    const removeNameField = (index: number) => {
        if (names.length > 1) {
            setNames(names.filter((_, i) => i !== index));
        }
    };

    const runLiveScan = async () => {
        const validNames = names.filter((n) => n.trim().length > 0);
        if (!validNames.length) return;

        setPreviewLoading(true);
        try {
            const res = await fetch(conflictRoutes.preview.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content ?? '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    names: validNames,
                    matter_id: selectedMatterId || null,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setPreviewResult(data);
            }
        } catch (e) {
            console.error('Error running live scan:', e);
        } finally {
            setPreviewLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={`${governanceDialogPanelClass} gap-0 sm:max-w-xl`}
            >
                <GovernanceDialogHeader
                    icon={Scale}
                    eyebrow="Kepatuhan & Etik"
                    title="Conflict of Interest Checker"
                    description="Pindai silang basis data klien, mantan klien, pihak lawan, dan saksi perkara firma."
                />

                <Form
                    action={conflictRoutes.store.url()}
                    method="post"
                    className="space-y-4 px-5 py-5 sm:px-6"
                    onSuccess={() => {
                        onOpenChange(false);
                        setPreviewResult(null);
                    }}
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
                                        value={selectedMatterId}
                                        onChange={(e) =>
                                            setSelectedMatterId(e.target.value)
                                        }
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
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Daftar Nama Pihak yang Diperiksa *
                                    </Label>
                                    <span className="text-[10px] text-slate-400">
                                        Mencakup nama PT, CV, perorangan, NIK,
                                        atau NPWP
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    {names.map((val, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-1.5"
                                        >
                                            <div className="relative flex-1">
                                                <Input
                                                    name={`names[${idx}]`}
                                                    value={val}
                                                    onChange={(e) =>
                                                        handleNameChange(
                                                            idx,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={
                                                        idx === 0
                                                            ? '1. Calon Klien / Nama Utama (Wajib)'
                                                            : idx === 1
                                                              ? '2. Pihak Lawan 1 (Adverse Party)'
                                                              : idx === 2
                                                                ? '3. Pihak Lawan 2 / Kuasa Hukum Lawan'
                                                                : `${idx + 1}. Afiliasi / Direksi / Pemilik Manfaat (UBO)`
                                                    }
                                                    required={idx === 0}
                                                    className="h-8 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-slate-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-100"
                                                />
                                            </div>
                                            {idx > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNameField(idx)
                                                    }
                                                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                                                    title="Hapus baris"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {names.length < 10 && (
                                    <button
                                        type="button"
                                        onClick={addNameField}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                    >
                                        <Plus className="size-3" /> Tambah Pihak
                                        / Afiliasi Lainnya
                                    </button>
                                )}
                            </div>

                            {/* Live Scan Action & Results Box */}
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/10 dark:bg-[#121418]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Zap className="size-3.5 text-amber-500" />
                                        <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                                            Pemindaian Kilat (Live Scan Preview)
                                        </span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={
                                            previewLoading ||
                                            !names.some(
                                                (n) => n.trim().length > 0,
                                            )
                                        }
                                        onClick={runLiveScan}
                                        className="h-7 rounded-lg border-amber-300 bg-amber-50/80 px-2.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                                    >
                                        {previewLoading ? (
                                            <>
                                                <Spinner className="mr-1 size-3" />
                                                Memindai...
                                            </>
                                        ) : (
                                            <>
                                                <Zap className="mr-1 size-3" />
                                                Pindai Kilat
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {previewResult && (
                                    <div className="mt-3 space-y-2 border-t border-slate-200/60 pt-2.5 dark:border-white/10">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                                Hasil Preview:{' '}
                                                <strong>
                                                    {previewResult.match_count}{' '}
                                                    Temuan
                                                </strong>
                                            </span>
                                            <span
                                                className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                                                    previewResult.status ===
                                                    'clear'
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                        : previewResult.status ===
                                                            'blocked'
                                                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                }`}
                                            >
                                                {previewResult.status ===
                                                'clear'
                                                    ? '✓ Bebas Benturan (Clear)'
                                                    : previewResult.status ===
                                                        'blocked'
                                                      ? '✕ Benturan Langsung (Blocked)'
                                                      : '⚠ Potensi Benturan'}
                                            </span>
                                        </div>

                                        {previewResult.matches.length > 0 && (
                                            <div className="max-h-36 space-y-1.5 overflow-y-auto pr-1">
                                                {previewResult.matches.map(
                                                    (m, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2 text-[11px] dark:border-white/10 dark:bg-zinc-800"
                                                        >
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                                        {m.name}
                                                                    </span>
                                                                    <span className="py-0.2 rounded bg-slate-100 px-1 text-[9.5px] font-semibold text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
                                                                        {m.role_label ??
                                                                            m.type}
                                                                    </span>
                                                                </div>
                                                                {m.details && (
                                                                    <p className="mt-0.5 text-[10px] text-slate-500 dark:text-zinc-400">
                                                                        {
                                                                            m.details
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <span className="shrink-0 font-mono text-[10px] font-bold text-slate-700 dark:text-zinc-300">
                                                                {m.similarity}%
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg bg-blue-50/70 p-3 text-xs text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
                                Pemeriksaan mencakup database perkara, klien,
                                mantan klien, dan pihak lawan. Sertifikat
                                berlaku 30 hari kalender.
                            </div>

                            <div className={governanceDialogFooterClass}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onOpenChange(false)}
                                    className={
                                        governanceDialogCancelButtonClass
                                    }
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className={`${governanceDialogPrimaryButtonClass} bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900`}
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3.5" />
                                            Menerbitkan...
                                        </>
                                    ) : (
                                        'Simpan & Terbitkan Hasil Resmi'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function ConflictCheckRow({
    item,
    canApprove,
}: {
    item: ConflictCheck;
    canApprove: boolean;
}) {
    const [openDecisionModal, setOpenDecisionModal] = useState(false);
    const [showMatches, setShowMatches] = useState(false);
    const isClear =
        item.status === 'clear' ||
        item.decision === 'cleared' ||
        item.decision === 'approved';
    const isBlocked = item.status === 'blocked' && item.decision !== 'waived';
    const requiresDecision =
        item.status !== 'clear' && item.decision === 'pending';
    const matchesCount = item.matches?.length ?? 0;
    const conflictAccentClass = isClear
        ? 'border-emerald-500'
        : isBlocked
          ? 'border-rose-500'
          : 'border-amber-500';

    return (
        <div className="group border-b border-slate-100 bg-white px-3 py-3 transition-colors last:border-b-0 hover:bg-slate-50/70 dark:border-white/[0.05] dark:bg-[#14161b] dark:hover:bg-white/[0.025]">
            <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
                <div
                    className={`min-w-0 flex-1 border-l-2 pl-3 ${conflictAccentClass}`}
                >
                    <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5 text-[9.5px]">
                            <span className="font-mono font-semibold text-slate-500 dark:text-zinc-400">
                                {item.matter?.matter_number ??
                                    'Pra-Matter / Calon Klien'}
                            </span>
                            <span className="text-slate-300 dark:text-zinc-700">
                                ·
                            </span>
                            <span
                                className={`font-semibold uppercase ${
                                    isClear
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : isBlocked
                                          ? 'text-rose-600 dark:text-rose-400'
                                          : 'text-amber-600 dark:text-amber-400'
                                }`}
                            >
                                {item.status.replaceAll('_', ' ')}
                            </span>
                            <span
                                className={`font-semibold uppercase ${
                                    item.decision === 'approved' ||
                                    item.decision === 'cleared'
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : item.decision === 'waived'
                                          ? 'text-blue-600 dark:text-blue-400'
                                          : item.decision === 'blocked'
                                            ? 'text-rose-600 dark:text-rose-400'
                                            : 'text-amber-600 dark:text-amber-400'
                                }`}
                            >
                                · {item.decision.replaceAll('_', ' ')}
                            </span>
                            {item.reviewer && (
                                <span className="text-slate-400 dark:text-zinc-500">
                                    • Ditinjau oleh: {item.reviewer.name}
                                </span>
                            )}
                        </div>

                        <h4 className="line-clamp-1 text-xs font-bold text-slate-900 dark:text-white">
                            {item.subject_name}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-1.5 text-[10.5px] text-slate-500 dark:text-zinc-400">
                            {item.searched_names &&
                            item.searched_names.length > 0 ? (
                                <span className="max-w-[320px] truncate">
                                    Pihak diperiksa:{' '}
                                    {item.searched_names.join(', ')}
                                </span>
                            ) : (
                                <span>Pemeriksaan tunggal nama pihak</span>
                            )}
                            {item.matter?.title && (
                                <>
                                    <span>·</span>
                                    <span className="max-w-[220px] truncate font-medium text-slate-600 dark:text-zinc-300">
                                        {item.matter.title}
                                    </span>
                                </>
                            )}
                        </div>

                        {item.decision_note && (
                            <p className="mt-1 inline-flex w-fit max-w-full items-start rounded-md bg-slate-50 px-2 py-1.5 text-[10.5px] text-slate-700 dark:bg-zinc-800/80 dark:text-zinc-200">
                                <MessageSquare className="mt-0.5 mr-1 size-3 shrink-0 text-slate-500" />
                                <span className="min-w-0 break-words whitespace-normal">
                                    <strong>
                                        Catatan Justifikasi Partner:
                                    </strong>{' '}
                                    {item.decision_note}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Action Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {matchesCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMatches(!showMatches)}
                            className={`${governanceCompactButtonClass} text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800`}
                        >
                            {matchesCount} Temuan
                            {showMatches ? (
                                <ChevronUp className="ml-1 size-3" />
                            ) : (
                                <ChevronDown className="ml-1 size-3" />
                            )}
                        </Button>
                    )}

                    {/* Certificate Action Button */}
                    <Button
                        variant="outline"
                        size="sm"
                        className={`${governanceCompactButtonClass} border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-zinc-800`}
                        asChild
                    >
                        <Link href={conflictRoutes.certificate.url(item.id)}>
                            <FileCheck className="mr-1 size-3 text-blue-600 dark:text-blue-400" />
                            Sertifikat
                        </Link>
                    </Button>

                    {/* Partner Waiver Action Button */}
                    {canApprove && (
                        <Button
                            size="sm"
                            onClick={() => setOpenDecisionModal(true)}
                            className={`${governanceCompactButtonClass} text-white shadow-2xs ${
                                requiresDecision
                                    ? 'bg-amber-600 hover:bg-amber-700'
                                    : 'bg-slate-700 hover:bg-slate-800 dark:bg-zinc-700'
                            }`}
                        >
                            <Scale className="mr-1 size-3" />
                            {requiresDecision
                                ? 'Beri Keputusan Partner'
                                : 'Ubah Keputusan'}
                        </Button>
                    )}
                </div>
            </div>

            {/* Expandable Matches Breakdown Table */}
            {showMatches && item.matches && item.matches.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-white/[0.06]">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                            Rincian Hasil Pencocokan Database Firma:
                        </p>
                        <div className="grid gap-1.5 sm:grid-cols-2">
                            {item.matches.map((match, idx) => (
                                <div
                                    key={idx}
                                    className={`rounded-lg border p-2 text-xs ${
                                        match.risk === 'blocked'
                                            ? 'border-rose-200 bg-rose-50/50 dark:border-rose-950 dark:bg-rose-950/20'
                                            : 'border-slate-200 bg-slate-50/70 dark:border-white/10 dark:bg-zinc-900/60'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-1.5">
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {match.name}
                                        </span>
                                        <span className="font-mono text-[10.5px] font-bold text-slate-700 dark:text-zinc-300">
                                            {match.similarity}% Kemiripan
                                        </span>
                                    </div>
                                    <div className="mt-1 flex flex-wrap items-center gap-1 text-[9.5px]">
                                        <span
                                            className={`py-0.2 rounded px-1.5 font-bold uppercase ${
                                                match.risk === 'blocked'
                                                    ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                                                    : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                                            }`}
                                        >
                                            {match.role_label ?? match.type}
                                        </span>
                                        {match.responsible_partner && (
                                            <span className="text-slate-500">
                                                Partner:{' '}
                                                {match.responsible_partner}
                                            </span>
                                        )}
                                    </div>
                                    {match.details && (
                                        <p className="mt-1 text-[10px] text-slate-600 dark:text-zinc-400">
                                            {match.details}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Partner Decision Modal */}
            <Dialog
                open={openDecisionModal}
                onOpenChange={setOpenDecisionModal}
            >
                <DialogContent
                    className={`${governanceDialogPanelClass} sm:max-w-md`}
                >
                    <GovernanceDialogHeader
                        icon={ShieldCheck}
                        eyebrow="Review Conflict Check"
                        title="Keputusan Etik Partner"
                        description="Tetapkan clearance, waiver, atau penolakan penanganan perkara berdasarkan hasil pemeriksaan."
                    />

                    <Form
                        action={conflictRoutes.resolve.url(item.id)}
                        method="patch"
                        className="space-y-3.5 px-5 py-5 sm:px-6"
                        onSuccess={() => setOpenDecisionModal(false)}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor={`decision-${item.id}`}
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Keputusan Akhir *
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id={`decision-${item.id}`}
                                            name="decision"
                                            defaultValue={
                                                item.decision !== 'pending'
                                                    ? item.decision
                                                    : item.status === 'blocked'
                                                      ? 'waived'
                                                      : 'cleared'
                                            }
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-2.5 text-xs text-slate-900 outline-none focus:border-slate-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        >
                                            <option value="waived">
                                                Waive / Disetujui Bersyarat
                                                (Waiver Etik)
                                            </option>
                                            <option value="blocked">
                                                Tolak / Blocked (Dilarang
                                                Ditangani)
                                            </option>
                                            {item.status !== 'blocked' && (
                                                <option value="cleared">
                                                    Clear (Bebas Benturan)
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
                                        Alasan &amp; Dasar Keputusan Etik *
                                    </Label>
                                    <textarea
                                        id={`note-${item.id}`}
                                        name="decision_note"
                                        rows={3}
                                        defaultValue={item.decision_note ?? ''}
                                        placeholder="Berikan justifikasi kepatuhan hukum / pertimbangan independensi etik..."
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

                                <div className={governanceDialogFooterClass}>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setOpenDecisionModal(false)
                                        }
                                        className={
                                            governanceDialogCancelButtonClass
                                        }
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className={`${governanceDialogPrimaryButtonClass} bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900`}
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
