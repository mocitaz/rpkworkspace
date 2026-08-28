import { Form, Head, Link, useForm } from '@inertiajs/react';
import {
    Building2,
    ChevronDown,
    Eye,
    FileCheck,
    FileClock,
    FileSpreadsheet,
    FileText,
    FileUp,
    FolderKanban,
    Plus,
    RotateCcw,
    Search,
    ShieldAlert,
    ShieldCheck,
} from 'lucide-react';
import { useRef, useState } from 'react';
import {
    DocumentPreviewModal,
    type PreviewableDocument,
} from '@/components/documents/document-preview-modal';
import { DocumentsVaultHero } from '@/components/documents-vault-hero';
import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { formatBytes, formatDate } from '@/lib/format';
import * as clientRoutes from '@/routes/clients';
import * as documentRoutes from '@/routes/documents';
import * as matterRoutes from '@/routes/matters';

type Document = {
    id: string;
    title: string;
    document_type?: string;
    status: string;
    confidentiality_level: string;
    updated_at: string;
    matter?: { id: string; matter_number: string; title: string };
    client?: { id: string; display_name: string };
    current_version?: {
        version_number: number;
        mime_type: string;
        file_size: number;
        created_at: string;
    };
};

type Page = {
    data: Document[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function DocumentsIndex({
    documents,
    matters,
    clients,
    metrics,
    filters,
    can,
}: {
    documents: Page;
    matters: {
        id: string;
        matter_number: string;
        title: string;
        client_id: string;
    }[];
    clients: { id: string; display_name: string }[];
    metrics: {
        total: number;
        confidential: number;
        under_review: number;
        linked_matters: number;
    };
    filters: {
        search?: string;
        status?: string;
        matter_id?: string;
        document_type?: string;
    };
    can: { upload: boolean };
}) {
    const params = new URLSearchParams(window.location.search);
    const [open, setOpen] = useState(() => params.has('upload'));
    const [previewDoc, setPreviewDoc] = useState<PreviewableDocument | null>(
        null,
    );
    const initialMatterId = params.get('matter_id') ?? '';

    return (
        <>
            <Head title="Dokumen & Repositori Legal - Vault Privat" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    <DocumentsVaultHero
                        metrics={metrics}
                        canUpload={can.upload}
                        onUpload={() => setOpen(true)}
                    />
                    {/* 1. Header Navigation & Action Bar */}
                    <div className="hidden">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Dokumen &amp; Repositori Legal
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Penyimpanan privat berkas perkara, surat kuasa,
                                alat bukti, dan audit jejak versi
                                tersertifikasi.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                            {can.upload && (
                                <Button
                                    size="sm"
                                    onClick={() => setOpen(true)}
                                    className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                >
                                    <FileUp className="mr-1.5 size-3.5" />+
                                    Unggah Dokumen Privat
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* 2. Top 4 Compact Bento KPI Cards */}
                    <section className="hidden">
                        {/* 1. Total Dokumen */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    TOTAL VAULT DOKUMEN
                                </span>
                                <FileText className="size-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {metrics.total}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    berkas
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Tersimpan Enkripsi</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    Privat
                                </span>
                            </div>
                        </div>

                        {/* 2. Berkas Rahasia */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    KERAHASIAAN TERBATAS
                                </span>
                                <ShieldAlert className="size-3.5 text-amber-500" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {metrics.confidential}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    berkas
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Restricted Access</span>
                                <span className="font-semibold text-amber-600">
                                    Rahasia
                                </span>
                            </div>
                        </div>

                        {/* 3. Dalam Review */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    DALAM REVIEW
                                </span>
                                <FileClock className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.under_review}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    antrean
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Approval Pending</span>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                    Review
                                </span>
                            </div>
                        </div>

                        {/* 4. Cakupan Matter */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold">
                                    CAKUPAN PERKARA
                                </span>
                                <FolderKanban className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.linked_matters}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    perkara
                                </span>
                            </div>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-white/[0.04]">
                                <span>Tautan Perkara</span>
                                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                    Aktif
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* 3. Filter & Search Toolbar */}
                    <Form
                        action={documentRoutes.index.url()}
                        method="get"
                        className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50/50 p-2.5 dark:border-white/[0.04] dark:bg-[#121418]"
                    >
                        {/* Row 1: Search, Reset, Count */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Cari judul dokumen, kata kunci, atau nomor perkara..."
                                    className="h-8 w-full rounded-lg border-slate-200 bg-white pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                {(filters.search ||
                                    filters.status ||
                                    filters.matter_id ||
                                    filters.document_type) && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="h-8 shrink-0 rounded-lg border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                        title="Reset Semua Filter"
                                    >
                                        <Link href={documentRoutes.index.url()}>
                                            <RotateCcw className="size-3.5 text-slate-400" />
                                        </Link>
                                    </Button>
                                )}
                                <span className="shrink-0 rounded-md border border-slate-200/70 bg-white px-2 py-1 font-mono text-[11px] font-semibold text-slate-700 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                    {documents.total} berkas
                                </span>
                            </div>
                        </div>

                        {/* Row 2: Select Matter, Select Status, Submit button */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="relative w-full flex-1">
                                <select
                                    name="matter_id"
                                    defaultValue={filters.matter_id ?? ''}
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    <option value="">Semua Perkara</option>
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
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>

                            <div className="relative w-full sm:w-44">
                                <select
                                    name="status"
                                    defaultValue={filters.status ?? ''}
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-7 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-50 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="draft">Draf</option>
                                    <option value="under_review">
                                        Dalam Review
                                    </option>
                                    <option value="approved">Disetujui</option>
                                    <option value="final">Final</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>

                            <Button
                                type="submit"
                                size="sm"
                                className="h-8 w-full shrink-0 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 sm:w-auto dark:bg-white dark:text-slate-900"
                            >
                                Terapkan Filter
                            </Button>
                        </div>
                    </Form>

                    {/* 4. Documents Database Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                        {documents.data.length === 0 ? (
                            <div className="flex min-h-[340px] items-center justify-center p-8 text-center">
                                <EmptyState
                                    icon={FileText}
                                    title={
                                        filters.search ||
                                        filters.status ||
                                        filters.matter_id ||
                                        filters.document_type
                                            ? 'Belum ada dokumen yang sesuai pencarian'
                                            : 'Vault Dokumen Kosong'
                                    }
                                    description={
                                        filters.search ||
                                        filters.status ||
                                        filters.matter_id ||
                                        filters.document_type
                                            ? 'Tidak ditemukan berkas dengan kriteria filter yang Anda pilih. Coba sesuaikan kata kunci atau reset filter.'
                                            : 'Seluruh berkas perkara, draf kontrak, dan dokumen legal disimpan secara privat dengan enkripsi ketat.'
                                    }
                                    action={
                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            {can.upload && (
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpen(true)
                                                    }
                                                    className="h-8 cursor-pointer rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                                >
                                                    <Plus className="mr-1 size-3.5" />{' '}
                                                    Unggah Dokumen Baru
                                                </Button>
                                            )}
                                            {(filters.search ||
                                                filters.status ||
                                                filters.matter_id ||
                                                filters.document_type) && (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="h-8 rounded-lg border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                                >
                                                    <Link
                                                        href={documentRoutes.index.url()}
                                                    >
                                                        Reset Filter
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    }
                                />
                            </div>
                        ) : (
                            <>
                                {/* Mobile Cards (sm:hidden) */}
                                <div className="divide-y divide-slate-100 sm:hidden dark:divide-white/[0.04]">
                                    {documents.data.map((document) => (
                                        <div
                                            key={document.id}
                                            className="space-y-2 p-3.5"
                                        >
                                            <div className="flex items-start gap-2.5">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-blue-50 text-blue-600 dark:border-white/10 dark:bg-blue-950/40 dark:text-blue-400">
                                                    <FileText className="size-4" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={documentRoutes.show.url(
                                                            document.id,
                                                        )}
                                                        className="line-clamp-2 text-xs font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                                    >
                                                        {document.title}
                                                    </Link>
                                                    {document.matter && (
                                                        <Link
                                                            href={matterRoutes.show.url(
                                                                document.matter
                                                                    .id,
                                                            )}
                                                            className="mt-0.5 inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                        >
                                                            <FolderKanban className="size-2.5 shrink-0" />
                                                            <span className="truncate">
                                                                {
                                                                    document
                                                                        .matter
                                                                        .matter_number
                                                                }{' '}
                                                                ·{' '}
                                                                {
                                                                    document
                                                                        .matter
                                                                        .title
                                                                }
                                                            </span>
                                                        </Link>
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setPreviewDoc(document)
                                                    }
                                                    className="h-7 shrink-0 rounded-lg px-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400"
                                                >
                                                    <Eye className="mr-1 size-3" />
                                                    Lihat
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2 text-[10px] dark:border-white/[0.04]">
                                                <StatusBadge
                                                    value={document.status}
                                                />
                                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-white">
                                                    v
                                                    {document.current_version
                                                        ?.version_number ?? 1}
                                                    .0
                                                </span>
                                                {document.current_version
                                                    ?.file_size ? (
                                                    <span className="font-mono text-slate-500 dark:text-zinc-400">
                                                        {formatBytes(
                                                            document
                                                                .current_version
                                                                .file_size,
                                                        )}
                                                    </span>
                                                ) : null}
                                                <span className="ml-auto font-mono text-slate-400 dark:text-zinc-500">
                                                    {formatDate(
                                                        document.updated_at,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table (hidden sm:block) */}
                                <div className="hidden overflow-x-auto sm:block">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                                <th className="py-2.5 pr-3 pl-4 font-semibold">
                                                    Nama Dokumen &amp; Tipe
                                                </th>
                                                <th className="px-3 py-2.5 font-semibold">
                                                    Terkait Perkara / Klien
                                                </th>
                                                <th className="px-3 py-2.5 text-center font-semibold">
                                                    Versi
                                                </th>
                                                <th className="px-3 py-2.5 text-right font-semibold">
                                                    Ukuran
                                                </th>
                                                <th className="px-3 py-2.5 text-center font-semibold">
                                                    Status
                                                </th>
                                                <th className="px-3 py-2.5 text-right font-semibold">
                                                    Diperbarui
                                                </th>
                                                <th className="py-2.5 pr-4 pl-3 text-center font-semibold">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                            {documents.data.map((document) => (
                                                <tr
                                                    key={document.id}
                                                    className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                >
                                                    {/* Document Title & Badges */}
                                                    <td className="py-2.5 pr-3 pl-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-blue-50 text-blue-600 transition-transform group-hover:scale-105 dark:border-white/10 dark:bg-blue-950/40 dark:text-blue-400">
                                                                <FileText className="size-4" />
                                                            </div>
                                                            <div className="min-w-0 space-y-0.5">
                                                                <Link
                                                                    href={documentRoutes.show.url(
                                                                        document.id,
                                                                    )}
                                                                    className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                                                                >
                                                                    {
                                                                        document.title
                                                                    }
                                                                </Link>
                                                                <div className="flex flex-wrap items-center gap-1">
                                                                    <span className="py-0.2 rounded bg-slate-100 px-1.5 text-[9.5px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                                                        {document.document_type ??
                                                                            'Dokumen Umum'}
                                                                    </span>
                                                                    <span
                                                                        className={`py-0.2 rounded px-1.5 text-[9.5px] font-semibold ${
                                                                            document.confidentiality_level ===
                                                                            'strictly_confidential'
                                                                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                                                                                : document.confidentiality_level ===
                                                                                    'restricted'
                                                                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                                                                  : 'bg-slate-100 text-slate-600 dark:bg-white/[0.06]'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            document.confidentiality_level
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Matter / Client Info */}
                                                    <td className="px-3 py-2.5 whitespace-nowrap">
                                                        {document.matter ? (
                                                            <Link
                                                                href={matterRoutes.show.url(
                                                                    document
                                                                        .matter
                                                                        .id,
                                                                )}
                                                                className="inline-flex items-center gap-1 font-mono text-xs text-blue-600 hover:underline dark:text-blue-400"
                                                            >
                                                                <FolderKanban className="size-3 shrink-0 text-slate-400" />
                                                                <span className="max-w-[200px] truncate font-semibold">
                                                                    {
                                                                        document
                                                                            .matter
                                                                            .matter_number
                                                                    }{' '}
                                                                    ·{' '}
                                                                    {
                                                                        document
                                                                            .matter
                                                                            .title
                                                                    }
                                                                </span>
                                                            </Link>
                                                        ) : document.client ? (
                                                            <Link
                                                                href={clientRoutes.show.url(
                                                                    document
                                                                        .client
                                                                        .id,
                                                                )}
                                                                className="inline-flex items-center gap-1 text-xs text-slate-700 hover:underline dark:text-zinc-300"
                                                            >
                                                                <Building2 className="size-3 shrink-0 text-slate-400" />
                                                                <span className="max-w-[160px] truncate font-semibold">
                                                                    {
                                                                        document
                                                                            .client
                                                                            .display_name
                                                                    }
                                                                </span>
                                                            </Link>
                                                        ) : (
                                                            <span className="text-slate-400 dark:text-zinc-500">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Version Chip */}
                                                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                        <span className="py-0.2 rounded bg-slate-100 px-1.5 font-mono text-[11px] font-semibold text-slate-900 dark:bg-zinc-800 dark:text-white">
                                                            v
                                                            {document
                                                                .current_version
                                                                ?.version_number ??
                                                                1}
                                                            .0
                                                        </span>
                                                    </td>

                                                    {/* File Size */}
                                                    <td className="px-3 py-2.5 text-right font-mono text-xs whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                        {document
                                                            .current_version
                                                            ?.file_size
                                                            ? formatBytes(
                                                                  document
                                                                      .current_version
                                                                      .file_size,
                                                              )
                                                            : '-'}
                                                    </td>

                                                    {/* Status Badge */}
                                                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                        <StatusBadge
                                                            value={
                                                                document.status
                                                            }
                                                        />
                                                    </td>

                                                    {/* Updated At */}
                                                    <td className="px-3 py-2.5 text-right font-mono text-[11px] whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                        {formatDate(
                                                            document.updated_at,
                                                        )}
                                                    </td>

                                                    {/* Action: Quick Preview */}
                                                    <td className="py-2.5 pr-4 pl-3 text-center whitespace-nowrap">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setPreviewDoc(
                                                                    document,
                                                                )
                                                            }
                                                            className="h-7 cursor-pointer rounded-lg border-slate-200 bg-white px-2 text-xs font-semibold text-blue-600 shadow-2xs hover:border-blue-300 hover:bg-blue-50/80 active:scale-95 dark:border-white/10 dark:bg-[#14161b] dark:text-blue-400"
                                                        >
                                                            <Eye className="mr-1 size-3" />
                                                            Pratinjau
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {/* Pagination Footer */}
                        <div className="flex flex-col justify-between gap-2.5 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-center dark:border-white/[0.04] dark:bg-[#121418]">
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                                Menampilkan{' '}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {documents.data.length}
                                </span>{' '}
                                dari{' '}
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {documents.total}
                                </span>{' '}
                                berkas
                            </span>
                            <Pagination links={documents.links} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Instant Document & PDF Modal Previewer */}
            <DocumentPreviewModal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                document={previewDoc}
            />

            {/* Modal Dialog: Unggah Dokumen Privat */}
            <UploadDocumentModal
                isOpen={open}
                onClose={() => setOpen(false)}
                matters={matters}
                clients={clients}
                initialMatterId={initialMatterId}
            />
        </>
    );
}

function UploadDocumentModal({
    isOpen,
    onClose,
    matters,
    clients,
    initialMatterId = '',
}: {
    isOpen: boolean;
    onClose: () => void;
    matters: {
        id: string;
        matter_number: string;
        title: string;
        client_id: string;
    }[];
    clients: { id: string; display_name: string }[];
    initialMatterId?: string;
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            title: string;
            matter_id: string;
            client_id: string;
            document_type: string;
            confidentiality_level: string;
            status: string;
            file: File | null;
            notes: string;
        }>({
            title: '',
            matter_id: initialMatterId,
            client_id: '',
            document_type: '',
            confidentiality_level: 'standard',
            status: 'draft',
            file: null,
            notes: '',
        });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(documentRoutes.store.url(), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    reset();
                    clearErrors();
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <FileUp className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                Unggah Dokumen Privat
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Simpan berkas legal dengan kontrol akses, scan
                                antivirus, dan ekstraksi teks.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {Object.keys(errors).length > 0 && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                        <div className="flex items-center gap-2 font-bold">
                            <ShieldAlert className="size-4 shrink-0 text-rose-600" />
                            <span>Gagal mengunggah dokumen:</span>
                        </div>
                        <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-[11px]">
                            {Object.entries(errors).map(([key, msg]) => (
                                <li key={key}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
                    <div className="grid gap-1">
                        <Label
                            htmlFor="title"
                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                        >
                            Judul Dokumen{' '}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Contoh: Perjanjian Kerjasama Distribusi Eksklusif"
                            required
                            className="h-8 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div className="grid gap-1">
                            <Label
                                htmlFor="matter_id"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Terkait Perkara (Matter)
                            </Label>
                            <div className="relative">
                                <select
                                    id="matter_id"
                                    value={data.matter_id}
                                    onChange={(e) =>
                                        setData('matter_id', e.target.value)
                                    }
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-100/70 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                >
                                    <option value="">
                                        Dokumen Umum (Tanpa Matter)
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
                            <InputError message={errors.matter_id} />
                        </div>

                        <div className="grid gap-1">
                            <Label
                                htmlFor="client_id"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Terkait Klien
                            </Label>
                            <div className="relative">
                                <select
                                    id="client_id"
                                    value={data.client_id}
                                    onChange={(e) =>
                                        setData('client_id', e.target.value)
                                    }
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-100/70 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                >
                                    <option value="">
                                        Pilih Klien (Opsional)
                                    </option>
                                    {clients.map((client) => (
                                        <option
                                            key={client.id}
                                            value={client.id}
                                        >
                                            {client.display_name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                            <InputError message={errors.client_id} />
                        </div>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                        <div className="grid gap-1">
                            <Label
                                htmlFor="document_type"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Kategori / Tipe Dokumen
                            </Label>
                            <Input
                                id="document_type"
                                value={data.document_type}
                                onChange={(e) =>
                                    setData('document_type', e.target.value)
                                }
                                placeholder="Contoh: Kontrak, Alat Bukti, Surat Kuasa"
                                className="h-8 rounded-lg border-slate-200 bg-slate-50/60 text-xs text-slate-900 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                            <InputError message={errors.document_type} />
                        </div>

                        <div className="grid gap-1">
                            <Label
                                htmlFor="confidentiality_level"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Tingkat Kerahasiaan
                            </Label>
                            <div className="relative">
                                <select
                                    id="confidentiality_level"
                                    value={data.confidentiality_level}
                                    onChange={(e) =>
                                        setData(
                                            'confidentiality_level',
                                            e.target.value,
                                        )
                                    }
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-100/70 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                >
                                    <option value="standard">
                                        Standar Internal
                                    </option>
                                    <option value="confidential">
                                        Confidential (Rahasia)
                                    </option>
                                    <option value="restricted">
                                        Restricted (Terbatas)
                                    </option>
                                    <option value="strictly_confidential">
                                        Strictly Confidential (Sangat Rahasia)
                                    </option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                            <InputError
                                message={errors.confidentiality_level}
                            />
                        </div>
                    </div>

                    <div className="grid gap-1">
                        <Label
                            htmlFor="file"
                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                        >
                            Pilih Berkas Dokumen (PDF, DOCX, XLSX, dll){' '}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <FileInput
                            id="file"
                            ref={fileInputRef}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                            required
                            buttonText="Pilih Berkas"
                            placeholder="Klik atau seret berkas dokumen..."
                            value={data.file}
                            onFileSelect={(file) => setData('file', file)}
                        />
                        <InputError message={errors.file} />
                    </div>

                    <div className="grid gap-1">
                        <Label
                            htmlFor="notes"
                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                        >
                            Catatan Dokumen / Keterangan (Opsional)
                        </Label>
                        <textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows={2}
                            placeholder="Keterangan draf, ringkasan berkas, atau instruksi..."
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            disabled={processing}
                            className="h-8 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
                        >
                            {processing ? (
                                <>
                                    <Spinner className="mr-1.5 size-3.5" />
                                    Mengunggah...
                                </>
                            ) : (
                                'Unggah Dokumen'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    name,
    type = 'text',
    error,
    placeholder,
    required = false,
}: {
    label: string;
    name: string;
    type?: string;
    error?: string;
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
            <InputError message={error} />
        </div>
    );
}

DocumentsIndex.layout = {
    breadcrumbs: [{ title: 'Dokumen', href: documentRoutes.index.url() }],
};
