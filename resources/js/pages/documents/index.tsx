import { Form, Head, Link } from '@inertiajs/react';
import {
    Building2,
    ChevronDown,
    FileCheck,
    FileClock,
    FileText,
    FileUp,
    FolderKanban,
    Plus,
    Search,
    ShieldAlert,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
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
    const initialMatterId = params.get('matter_id') ?? '';

    return (
        <>
            <Head title="Dokumen & Repositori Legal" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Minimalist Notion */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Dokumen &amp; Repositori Legal
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Penyimpanan privat berkas perkara, surat kuasa, alat bukti, dan audit jejak versi tersertifikasi.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        {can.upload && (
                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    onClick={() => setOpen(true)}
                                    className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    <FileUp className="mr-1.5 size-3.5" />
                                    Unggah Dokumen Privat
                                </Button>
                            </div>
                        )}
                    </header>

                    {/* Compact 4-Column Stat Strips (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Dokumen */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Total Vault Dokumen</span>
                                <FileText className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                    {metrics.total} Berkas
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    terenkripsi
                                </span>
                            </div>
                        </div>

                        {/* 2. Berkas Rahasia */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Kerahasiaan Terbatas</span>
                                <ShieldAlert className="size-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                    {metrics.confidential} Dokumen
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    restricted / rahasia
                                </span>
                            </div>
                        </div>

                        {/* 3. Dalam Review */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Dalam Review</span>
                                <FileClock className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.under_review} Berkas
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    menunggu approval
                                </span>
                            </div>
                        </div>

                        {/* 4. Cakupan Matter */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Cakupan Perkara</span>
                                <FolderKanban className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.linked_matters} Matter
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    lampiran aktif
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Filter & Search Bar */}
                    <Form
                        {...documentRoutes.index.form()}
                        className="flex flex-col gap-2 rounded-xl border border-black/[0.08] bg-white p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:flex-row sm:items-center dark:border-white/[0.08] dark:bg-[#1a1a1c]"
                    >
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#787774]" />
                            <Input
                                name="search"
                                defaultValue={filters.search}
                                placeholder="Cari judul dokumen atau kata kunci..."
                                className="h-8 w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-8 text-xs text-[#111111] outline-none placeholder:text-[#787774] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
                            />
                        </div>

                        <div className="relative min-w-[180px]">
                            <select
                                name="matter_id"
                                defaultValue={filters.matter_id ?? ''}
                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                            >
                                <option value="">Semua Perkara</option>
                                {matters.map((matter) => (
                                    <option key={matter.id} value={matter.id}>
                                        {matter.matter_number} — {matter.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                        </div>

                        <div className="relative min-w-[130px]">
                            <select
                                name="status"
                                defaultValue={filters.status ?? ''}
                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
                            >
                                <option value="">Semua Status</option>
                                <option value="draft">Draf</option>
                                <option value="under_review">Dalam Review</option>
                                <option value="approved">Disetujui</option>
                                <option value="final">Final</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                        </div>

                        <Button
                            type="submit"
                            variant="outline"
                            className="h-8 shrink-0 rounded-lg border-black/10 bg-white px-3.5 text-xs font-medium text-[#111111] hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                        >
                            Cari
                        </Button>
                    </Form>

                    {/* Documents Database Table */}
                    <div className="overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        {documents.data.length === 0 ? (
                            <div className="flex min-h-[380px] items-center justify-center p-12 text-center">
                                <EmptyState
                                    title="Belum ada dokumen yang sesuai pencarian"
                                    description="Seluruh dokumen legal disimpan secara privat dengan enkripsi ketat. Unggah berkas baru untuk memulai."
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-black/[0.04] bg-[#fafafa] text-[10px] font-semibold uppercase tracking-wider text-[#787774] dark:border-white/[0.06] dark:bg-[#161618]">
                                            <th className="py-2.5 pl-4 pr-3">Dokumen &amp; Kerahasiaan</th>
                                            <th className="py-2.5 px-3">Terkait Matter / Klien</th>
                                            <th className="py-2.5 px-3 text-center">Versi</th>
                                            <th className="py-2.5 px-3 text-right">Ukuran</th>
                                            <th className="py-2.5 px-3 text-center">Status</th>
                                            <th className="py-2.5 pl-3 pr-4 text-right">Pembaruan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.05]">
                                        {documents.data.map((document) => (
                                            <tr
                                                key={document.id}
                                                className="group transition-colors hover:bg-black/[0.01] dark:hover:bg-white/[0.02]"
                                            >
                                                {/* Document Title & Badges */}
                                                <td className="py-3 pl-4 pr-3">
                                                    <div className="space-y-1">
                                                        <Link
                                                            href={documentRoutes.show(document.id)}
                                                            className="font-semibold text-[#111111] hover:text-blue-600 hover:underline dark:text-white dark:hover:text-sky-400"
                                                        >
                                                            {document.title}
                                                        </Link>
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                            <span className="rounded bg-black/[0.04] px-1.5 py-0.2 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                                                {document.document_type ?? 'Dokumen Umum'}
                                                            </span>
                                                            <span
                                                                className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                                                                    document.confidentiality_level === 'strictly_confidential'
                                                                        ? 'bg-[#fdebec] text-[#9f2f2d] dark:bg-rose-950/40 dark:text-rose-300'
                                                                        : document.confidentiality_level === 'restricted'
                                                                          ? 'bg-[#fbf3db] text-[#956400] dark:bg-amber-950/40 dark:text-amber-300'
                                                                          : 'bg-black/[0.04] text-[#787774] dark:bg-white/[0.06]'
                                                                }`}
                                                            >
                                                                {document.confidentiality_level}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Matter / Client Info */}
                                                <td className="py-3 px-3 whitespace-nowrap">
                                                    {document.matter ? (
                                                        <Link
                                                            href={matterRoutes.show(document.matter.id)}
                                                            className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 hover:underline dark:text-sky-400"
                                                        >
                                                            <FolderKanban className="size-3 shrink-0 text-[#787774]" />
                                                            <span className="truncate max-w-[200px]">{document.matter.matter_number} · {document.matter.title}</span>
                                                        </Link>
                                                    ) : document.client ? (
                                                        <Link
                                                            href={clientRoutes.show(document.client.id)}
                                                            className="inline-flex items-center gap-1 text-[11px] text-[#787774] hover:underline dark:text-zinc-400"
                                                        >
                                                            <Building2 className="size-3 shrink-0" />
                                                            <span className="truncate max-w-[180px]">{document.client.display_name}</span>
                                                        </Link>
                                                    ) : (
                                                        <span className="text-[#787774] dark:text-zinc-500">—</span>
                                                    )}
                                                </td>

                                                {/* Version Chip */}
                                                <td className="py-3 px-3 text-center whitespace-nowrap">
                                                    <span className="font-mono text-[11px] font-semibold text-[#111111] dark:text-white">
                                                        v{document.current_version?.version_number ?? 1}.0
                                                    </span>
                                                </td>

                                                {/* File Size */}
                                                <td className="py-3 px-3 text-right whitespace-nowrap font-mono text-[11px] text-[#787774] dark:text-zinc-400">
                                                    {document.current_version?.file_size
                                                        ? formatBytes(document.current_version.file_size)
                                                        : '—'}
                                                </td>

                                                {/* Status Badge */}
                                                <td className="py-3 px-3 text-center whitespace-nowrap">
                                                    <StatusBadge value={document.status} />
                                                </td>

                                                {/* Updated At */}
                                                <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap font-mono text-[11px] text-[#787774] dark:text-zinc-400">
                                                    {formatDate(document.updated_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination Footer */}
                        <div className="flex flex-col justify-between gap-3 border-t border-black/[0.04] bg-[#fafafa] px-4 py-2.5 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#161618]">
                            <span className="text-xs text-[#787774] dark:text-zinc-400">
                                Menampilkan <span className="font-semibold text-[#111111] dark:text-white">{documents.data.length}</span> dari{' '}
                                <span className="font-semibold text-[#111111] dark:text-white">{documents.total}</span> berkas
                            </span>
                            <Pagination links={documents.links} />
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Dialog: Unggah Dokumen Privat */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-xl dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                                <FileUp className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                    Unggah Dokumen Privat
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                    Simpan berkas legal dengan kontrol akses, scan antivirus, dan ekstraksi teks otomatis.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...documentRoutes.store.form()}
                        className="space-y-3.5 pt-1"
                        resetOnSuccess
                        onSuccess={() => setOpen(false)}
                    >
                        {({ errors, processing }) => (
                            <>
                                <Field
                                    label="Judul Dokumen"
                                    name="title"
                                    error={errors.title}
                                    placeholder="Contoh: Perjanjian Kerjasama Distribusi Eksklusif"
                                    required
                                />

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="matter_id" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Terkait Matter
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="matter_id"
                                                name="matter_id"
                                                defaultValue={initialMatterId}
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                            >
                                                <option value="">Dokumen Umum (Tanpa Matter)</option>
                                                {matters.map((matter) => (
                                                    <option key={matter.id} value={matter.id}>
                                                        {matter.matter_number} — {matter.title}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                        <InputError message={errors.matter_id} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="client_id" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Klien Pemilik Berkas
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="client_id"
                                                name="client_id"
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                            >
                                                <option value="">Pilih Klien Terkait</option>
                                                {clients.map((client) => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.display_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                        <InputError message={errors.client_id} />
                                    </div>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="document_type" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Jenis Dokumen *
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="document_type"
                                                name="document_type"
                                                defaultValue="contract"
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                            >
                                                <option value="contract">Kontrak / Perjanjian</option>
                                                <option value="pleading">Gugatan / Jawaban / Replik</option>
                                                <option value="evidence">Alat Bukti Hukum</option>
                                                <option value="legal_opinion">Legal Opinion / Advice</option>
                                                <option value="power_of_attorney">Surat Kuasa Khusus</option>
                                                <option value="court_order">Putusan / Penetapan Pengadilan</option>
                                                <option value="other">Dokumen Lainnya</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="confidentiality_level" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Tingkat Kerahasiaan *
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="confidentiality_level"
                                                name="confidentiality_level"
                                                defaultValue="confidential"
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                            >
                                                <option value="internal">Internal Firma</option>
                                                <option value="confidential">Confidential (Rahasia)</option>
                                                <option value="restricted">Restricted (Sangat Terbatas)</option>
                                                <option value="strictly_confidential">Strictly Confidential (Ketat)</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="file" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Pilih Berkas Dokumen *
                                    </Label>
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        required
                                        className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs file:mr-2.5 file:rounded-md file:border-0 file:bg-zinc-200 file:px-2.5 file:py-0.5 file:text-xs focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212]"
                                    />
                                    <InputError message={errors.file} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="notes" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Catatan Rilis Versi Awal
                                    </Label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={2}
                                        placeholder="Keterangan draf awal, sumber file, atau instruksi review..."
                                        className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs leading-relaxed text-[#111111] outline-none transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                    />
                                    <InputError message={errors.notes} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03]"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        disabled={processing}
                                        className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black"
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
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function Field({
    label,
    name,
    error,
    placeholder,
    required = false,
}: {
    label: string;
    name: string;
    error?: string;
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
                type="text"
                placeholder={placeholder}
                required={required}
                className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
            />
            <InputError message={error} />
        </div>
    );
}

DocumentsIndex.layout = {
    breadcrumbs: [{ title: 'Dokumen', href: documentRoutes.index() }],
};
