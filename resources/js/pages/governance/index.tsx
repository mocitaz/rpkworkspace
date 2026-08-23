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

    return (
        <>
            <Head title="Tata Kelola & Kepatuhan Perkara (Governance)" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Minimalist Notion */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Tata Kelola &amp; Kepatuhan (Governance)
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Pencatatan korespondensi resmi, uji konflik kepentingan (conflict check), status legal hold, dan serah terima perkara.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                            {can.conflict && (
                                <Button
                                    variant="outline"
                                    onClick={() => setConflictModal(true)}
                                    className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                                >
                                    <Scale className="mr-1.5 size-3.5 text-[#787774]" />
                                    Jalankan Conflict Check
                                </Button>
                            )}
                            {can.correspondence && (
                                <Button
                                    onClick={() => setCorrespondenceModal(true)}
                                    className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    <Mail className="mr-1.5 size-3.5" />
                                    Log Korespondensi
                                </Button>
                            )}
                        </div>
                    </header>

                    {/* Compact 4-Column Stat Strips (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Korespondensi */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Log Korespondensi</span>
                                <Mail className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                    {metrics.total_correspondences} Komunikasi
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    surat &amp; email
                                </span>
                            </div>
                        </div>

                        {/* 2. Uji Konflik */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Conflict Checks</span>
                                <Scale className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.conflict_checks} Pemeriksaan
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    pihak lawan
                                </span>
                            </div>
                        </div>

                        {/* 3. Review Konflik Tertunda */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Perlu Keputusan Partner</span>
                                <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className={`font-mono text-base font-bold tracking-tight ${metrics.pending_conflicts > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-[#111111] dark:text-white'}`}>
                                    {metrics.pending_conflicts} Potensial
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    waiver / clearance
                                </span>
                            </div>
                        </div>

                        {/* 4. Legal Hold & Arsip */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Status Legal Hold</span>
                                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.legal_holds} Terkunci
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    {metrics.archived} diarsipkan
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 2 Main Columns: Correspondences & Conflict Checks */}
                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* Section 1: Korespondensi Terbaru */}
                        <div className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div>
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-6 items-center justify-center rounded-md bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-zinc-200">
                                            <Mail className="size-3.5" />
                                        </div>
                                        <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                            Korespondensi Perkara
                                        </h3>
                                    </div>
                                    <span className="font-mono text-[10px] text-[#787774]">
                                        {correspondences.length} entri
                                    </span>
                                </div>

                                {/* Filter Controls */}
                                <Form
                                    {...governanceRoutes.index.form()}
                                    className="my-3 space-y-2 rounded-lg border border-black/[0.06] bg-[#fafafa] p-2.5 dark:border-white/[0.06] dark:bg-zinc-800/40"
                                >
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="relative">
                                            <select
                                                name="matter_id"
                                                defaultValue={filters.matter_id ?? ''}
                                                className="h-7.5 w-full cursor-pointer appearance-none rounded-md border border-black/[0.08] bg-white pl-2.5 pr-7 text-[11px] font-medium text-[#111111] outline-none hover:bg-black/[0.02] focus:border-black/20 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                            >
                                                <option value="">Semua Matter</option>
                                                {matters.map((matter) => (
                                                    <option key={matter.id} value={matter.id}>
                                                        {matter.matter_number}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>

                                        <div className="relative">
                                            <select
                                                name="direction"
                                                defaultValue={filters.direction ?? ''}
                                                className="h-7.5 w-full cursor-pointer appearance-none rounded-md border border-black/[0.08] bg-white pl-2.5 pr-7 text-[11px] font-medium text-[#111111] outline-none hover:bg-black/[0.02] focus:border-black/20 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                            >
                                                <option value="">Arah: Semua</option>
                                                <option value="inbound">Masuk (Inbound)</option>
                                                <option value="outbound">Keluar (Outbound)</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Input
                                            name="search"
                                            placeholder="Cari subjek atau isi pesan..."
                                            defaultValue={filters.search}
                                            className="h-7.5 rounded-md border border-black/[0.08] bg-white text-[11px] dark:border-white/10 dark:bg-zinc-800"
                                        />
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            className="h-7.5 shrink-0 rounded-md border-black/10 bg-white px-3 text-[11px] font-medium text-[#111111] hover:bg-black/[0.03]"
                                        >
                                            Filter
                                        </Button>
                                    </div>
                                </Form>

                                {/* List Data */}
                                <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                    {correspondences.length ? (
                                        correspondences.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={correspondenceRoutes.show.url(item.id)}
                                                className="group block py-2.5 transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <h4 className="truncate text-xs font-semibold text-[#111111] group-hover:text-blue-600 dark:text-white dark:group-hover:text-sky-400">
                                                            {item.subject}
                                                        </h4>
                                                        <p className="mt-0.5 font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                                                            {item.matter.matter_number} · {item.direction === 'inbound' ? 'Surat Masuk' : 'Surat Keluar'} ({item.source})
                                                        </p>
                                                    </div>
                                                    <time className="font-mono text-[10px] text-[#787774] whitespace-nowrap">
                                                        {formatDate(item.occurred_at)}
                                                    </time>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="py-6 text-center text-xs text-[#787774] dark:text-zinc-500">
                                            Belum ada catatan korespondensi.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Conflict Checks */}
                        <div className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div>
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-6 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                            <Scale className="size-3.5" />
                                        </div>
                                        <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                            Hasil Conflict Checks
                                        </h3>
                                    </div>
                                    <span className="font-mono text-[10px] text-[#787774]">
                                        {conflictChecks.length} pemeriksaan
                                    </span>
                                </div>

                                <div className="divide-y divide-black/[0.04] pt-1 dark:divide-white/[0.04]">
                                    {conflictChecks.length ? (
                                        conflictChecks.map((item) => (
                                            <ConflictCheckRow
                                                key={item.id}
                                                item={item}
                                                canApprove={can.conflictApprove}
                                            />
                                        ))
                                    ) : (
                                        <p className="py-6 text-center text-xs text-[#787774] dark:text-zinc-500">
                                            Belum ada catatan conflict check.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Arsip, Legal Hold & Handover Perkara */}
                    <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5 dark:border-white/[0.04]">
                            <div className="flex items-center gap-2">
                                <div className="flex size-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <ShieldCheck className="size-3.5" />
                                </div>
                                <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                    Kontrol Arsip, Legal Hold &amp; Handover Perkara
                                </h3>
                            </div>
                        </div>

                        <div className="divide-y divide-black/[0.04] pt-1 dark:divide-white/[0.04]">
                            {matters.length ? (
                                matters.map((matter) => (
                                    <div
                                        key={matter.id}
                                        className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-semibold text-[#111111] dark:text-white">
                                                    {matter.matter_number}
                                                </span>
                                                <span className="truncate text-xs text-[#787774] dark:text-zinc-400">
                                                    — {matter.title}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-2">
                                                {matter.legal_hold_at ? (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-[#fdebec] px-1.5 py-0.2 text-[10px] font-semibold text-[#9f2f2d] dark:bg-rose-950/40 dark:text-rose-300">
                                                        <ShieldAlert className="size-3" /> Legal Hold Aktif
                                                    </span>
                                                ) : matter.archived_at ? (
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-black/[0.04] px-1.5 py-0.2 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                                        <Archive className="size-3" /> Diarsipkan
                                                    </span>
                                                ) : (
                                                    <StatusBadge value={matter.status} />
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            {can.legalHold && (
                                                <Form
                                                    {...(matter.legal_hold_at
                                                        ? legalHoldRoutes.destroy.form(matter.id)
                                                        : legalHoldRoutes.store.form(matter.id))}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className={`h-7 rounded-md text-[11px] font-medium ${
                                                            matter.legal_hold_at
                                                                ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                                                                : 'border-black/10 hover:bg-black/[0.03]'
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
                                                        className="h-7 rounded-md border-black/10 text-[11px] font-medium hover:bg-black/[0.03]"
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
                                                        className="h-7 rounded-md border-black/10 text-[11px] font-medium hover:bg-black/[0.03]"
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
                                <p className="py-6 text-center text-xs text-[#787774] dark:text-zinc-500">
                                    Belum ada data perkara.
                                </p>
                            )}
                        </div>

                        {/* Completed Handover Export Bundles */}
                        {exports.length > 0 && (
                            <div className="mt-4 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                <h4 className="text-[11px] font-bold text-[#787774] uppercase tracking-wider">
                                    Bundle Handover Tersedia
                                </h4>
                                <div className="mt-2 divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                                    {exports.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between py-2 text-xs"
                                        >
                                            <div>
                                                <span className="font-mono font-semibold">{item.matter.matter_number}</span>
                                                <span className="ml-2 text-[10px] text-[#787774]">Status: {item.status}</span>
                                            </div>
                                            {item.status === 'completed' && (
                                                <Button size="sm" variant="outline" className="h-6.5 rounded-md border-black/10 text-[10px]" asChild>
                                                    <a href={exportRoutes.download.url(item.id)}>
                                                        <Download className="mr-1 size-3" /> Unduh ZIP
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal: Log Korespondensi */}
            <Dialog open={correspondenceModal} onOpenChange={setCorrespondenceModal}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-xl dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                                <Mail className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                    Catat Korespondensi Resmi
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                    Dokumentasikan surat masuk/keluar, memo internal, atau email penting.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...correspondenceRoutes.store.form()}
                        className="space-y-3.5 pt-1"
                        onSuccess={() => setCorrespondenceModal(false)}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="matter_id" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Terkait Matter *
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="matter_id"
                                            name="matter_id"
                                            required
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-zinc-200"
                                        >
                                            <option value="">Pilih Matter Terkait</option>
                                            {matters.map((matter) => (
                                                <option key={matter.id} value={matter.id}>
                                                    {matter.matter_number} — {matter.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                    </div>
                                </div>

                                <input type="hidden" name="direction" value="outbound" />
                                <input type="hidden" name="source" value="manual" />

                                <Field name="subject" label="Subjek / Perihal Surat" placeholder="Contoh: Tanggapan Somasi & Klarifikasi Bukti" required />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field name="from_addresses" label="Dari (Pengirim)" placeholder="nama@instansi.com" required />
                                    <Field name="to_addresses" label="Kepada (Penerima)" placeholder="lawyer@raflaw.co.id" required />
                                </div>

                                <Field name="occurred_at" label="Tanggal & Waktu Komunikasi" type="datetime-local" required />

                                <div className="grid gap-1.5">
                                    <Label htmlFor="body" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Ringkasan / Isi Korespondensi
                                    </Label>
                                    <textarea
                                        id="body"
                                        name="body"
                                        rows={3}
                                        placeholder="Tuliskan pokok bahasan atau poin penting komunikasi..."
                                        className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs text-[#111111] outline-none transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                    />
                                </div>

                                <div className="space-y-2 rounded-xl border border-black/[0.08] bg-[#fafafa] p-3 dark:border-white/[0.08] dark:bg-zinc-800/40">
                                    <Label className="text-xs font-bold text-[#111111] dark:text-white">Lampirkan Dokumen Matter</Label>
                                    <div className="max-h-32 overflow-y-auto space-y-1.5 pt-1">
                                        {documents.length ? (
                                            documents.map((doc) => (
                                                <label key={doc.id} className="flex items-center gap-2 text-xs cursor-pointer hover:text-blue-600">
                                                    <input name="document_ids[]" type="checkbox" value={doc.id} className="rounded border-zinc-300 text-black" />
                                                    <span className="truncate">{doc.title}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-[11px] text-[#787774]">Belum ada dokumen yang tersedia untuk dilampirkan.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button type="button" variant="outline" onClick={() => setCorrespondenceModal(false)} className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03]">
                                        Batal
                                    </Button>
                                    <Button disabled={processing} className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black">
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
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                <Scale className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                    Jalankan Conflict Check
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                    Pemeriksaan silang nama pihak lawan, grup perusahaan, dan pihak terkait.
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
                                <div className="grid gap-1.5">
                                    <Label htmlFor="conflict-matter_id" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Terkait Matter (Opsional)
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="conflict-matter_id"
                                            name="matter_id"
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-zinc-200"
                                        >
                                            <option value="">Pra-Matter / Calon Klien Baru</option>
                                            {matters.map((matter) => (
                                                <option key={matter.id} value={matter.id}>
                                                    {matter.matter_number} — {matter.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Nama-Nama Pihak yang Diperiksa *
                                    </Label>
                                    <div className="space-y-1.5">
                                        {[0, 1, 2, 3].map((index) => (
                                            <Input
                                                key={index}
                                                name={`names[${index}]`}
                                                placeholder={index === 0 ? 'Nama utama / pihak lawan (Wajib)' : `Pihak terafiliasi ${index + 1} (Opsional)`}
                                                required={index === 0}
                                                className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212]"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-[#e1f3fe] p-2.5 text-[11px] text-[#1f6c9f] dark:bg-blue-950/30 dark:text-sky-300">
                                    Pemeriksaan akan mencocokkan basis data perkara, klien aktif, pihak lawan, dan relasi bisnis firma. Hasil berlaku 30 hari.
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button type="button" variant="outline" onClick={() => setConflictModal(false)} className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03]">
                                        Batal
                                    </Button>
                                    <Button disabled={processing} className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black">
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
        <div className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-[#111111] dark:text-white">
                        {item.subject_name}
                    </h4>
                    <StatusBadge value={item.status} />
                </div>

                <p className="mt-0.5 font-mono text-[10px] text-[#787774] dark:text-zinc-400">
                    {item.matter?.matter_number ?? 'Pra-Matter'} · Keputusan: <strong className="uppercase text-[#111111] dark:text-white">{item.decision}</strong>
                </p>

                {item.searched_names && item.searched_names.length > 0 && (
                    <p className="mt-1 text-[10px] text-[#787774]">
                        Diperiksa: {item.searched_names.join(', ')}
                    </p>
                )}

                {item.decision_note && (
                    <p className="mt-1 rounded-md bg-[#fafafa] p-2 text-[10px] text-[#2f3437] dark:bg-zinc-800 dark:text-zinc-300">
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
                        className="h-6.5 shrink-0 rounded-md border-black/10 px-2 text-[10px] font-medium text-[#111111] hover:bg-black/[0.03]"
                    >
                        Keputusan Partner
                    </Button>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#1c1c1e]">
                            <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                                <DialogTitle className="text-sm font-bold text-[#111111] dark:text-white">
                                    Keputusan Partner Conflict Check
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#787774]">
                                    Tetapkan persetujuan penanganan perkara atau pembatalan kuasa.
                                </DialogDescription>
                            </DialogHeader>

                            <Form
                                {...conflictRoutes.resolve.form(item.id)}
                                className="space-y-3.5 pt-1"
                                onSuccess={() => setOpen(false)}
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor={`decision-${item.id}`} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                                Keputusan Akhir
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id={`decision-${item.id}`}
                                                    name="decision"
                                                    defaultValue={item.status === 'blocked' ? 'blocked' : 'waived'}
                                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium outline-none focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                                >
                                                    <option value="waived">Waive / Disetujui dengan Catatan Khusus</option>
                                                    <option value="blocked">Tolak / Blocked (Dilarang Tangani)</option>
                                                    {item.status !== 'blocked' && <option value="cleared">Clear (Bebas Konflik)</option>}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                            </div>
                                        </div>

                                        <div className="grid gap-1.5">
                                            <Label htmlFor={`note-${item.id}`} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                                Alasan &amp; Dasar Keputusan *
                                            </Label>
                                            <textarea
                                                id={`note-${item.id}`}
                                                name="decision_note"
                                                rows={3}
                                                placeholder="Berikan justifikasi kepatuhan hukum / etika profesi..."
                                                required
                                                minLength={8}
                                                className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs text-[#111111] outline-none transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                            />
                                            {errors.decision_note && (
                                                <p className="text-xs text-rose-500">{errors.decision_note}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setOpen(false)}
                                                className="h-8 rounded-lg px-3 text-xs font-medium"
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                disabled={processing}
                                                className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white hover:bg-black dark:bg-white dark:text-black"
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
        <div className="grid gap-1.5">
            <Label htmlFor={name} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
            />
        </div>
    );
}

GovernanceIndex.layout = {
    breadcrumbs: [{ title: 'Governance', href: governanceRoutes.index() }],
};
