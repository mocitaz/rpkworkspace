import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowUpRight,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    ExternalLink,
    FileText,
    FolderKanban,
    Inbox,
    Mail,
    Paperclip,
    Send,
    ShieldCheck,
    Upload,
    User,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileInput } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/format';
import * as clientRoutes from '@/routes/clients';
import * as documentRoutes from '@/routes/documents';
import * as governanceRoutes from '@/routes/governance';
import * as correspondenceRoutes from '@/routes/governance/correspondences';
import * as attachmentRoutes from '@/routes/governance/correspondences/attachments';
import * as matterRoutes from '@/routes/matters';

type Correspondence = {
    id: string;
    subject: string;
    direction: string;
    source: string;
    body?: string;
    from_addresses: string[];
    to_addresses: string[];
    cc_addresses?: string[];
    occurred_at: string;
    matter: { id: string; matter_number: string; title: string };
    client?: { id: string; client_number?: string; display_name: string };
    creator: { id: number; name: string };
    documents: { id: string; title: string }[];
};

export default function CorrespondenceShow({
    correspondence,
    canUploadAttachment,
}: {
    correspondence: Correspondence;
    canUploadAttachment: boolean;
}) {
    const isInbound = correspondence.direction === 'inbound';

    return (
        <>
            <Head title={`Detail Korespondensi - ${correspondence.subject}`} />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Cockpit Bar (Exact style of ClientShow) */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 lg:flex-row lg:items-center dark:border-white/[0.06]">
                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {correspondence.matter.matter_number}
                                </span>
                                <span className="text-slate-300 dark:text-zinc-700">•</span>
                                <span
                                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                        isInbound
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                    }`}
                                >
                                    {isInbound ? 'Surat Masuk (Inbound)' : 'Surat Keluar (Outbound)'}
                                </span>
                                <span className="text-slate-300 dark:text-zinc-700">•</span>
                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-white/[0.08] dark:text-zinc-300">
                                    Kanal: {correspondence.source}
                                </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                                {isInbound ? (
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-blue-200/60 bg-blue-50 text-blue-700 shadow-2xs dark:border-blue-900/40 dark:bg-blue-950/60 dark:text-blue-300">
                                        <Inbox className="size-4" />
                                    </div>
                                ) : (
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-emerald-200/60 bg-emerald-50 text-emerald-700 shadow-2xs dark:border-emerald-900/40 dark:bg-emerald-950/60 dark:text-emerald-300">
                                        <Send className="size-4" />
                                    </div>
                                )}
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                    {correspondence.subject}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                                <Link
                                    href={matterRoutes.show(correspondence.matter.id)}
                                    className="font-medium text-slate-700 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400"
                                >
                                    {correspondence.matter.title}
                                </Link>
                                {correspondence.client && (
                                    <>
                                        <span className="text-slate-300 dark:text-zinc-700">•</span>
                                        <Link
                                            href={clientRoutes.show(correspondence.client.id)}
                                            className="hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            Klien: {correspondence.client.display_name}
                                        </Link>
                                    </>
                                )}
                                <span className="text-slate-300 dark:text-zinc-700">•</span>
                                <span>{formatDate(correspondence.occurred_at, true)}</span>
                            </div>
                        </div>

                        {/* Cockpit Action Buttons */}
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                asChild
                            >
                                <Link href={governanceRoutes.index()}>
                                    <ArrowLeft className="mr-1 size-3 text-slate-400" />
                                    Kembali ke Tata Kelola
                                </Link>
                            </Button>

                            <Button
                                size="sm"
                                className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                                asChild
                            >
                                <Link href={matterRoutes.show(correspondence.matter.id)}>
                                    <Briefcase className="mr-1.5 size-3.5" />
                                    Buka Perkara Terkait
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* 2. Top 4 Overview Stat Cards (Exact style of ClientShow) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Arah & Kanal */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    Arah Korespondensi
                                </span>
                                <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    {isInbound ? <Inbox className="size-3.5" /> : <Send className="size-3.5" />}
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {isInbound ? 'Surat Masuk' : 'Surat Keluar'}
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                    Kanal {correspondence.source}
                                </p>
                            </div>
                        </div>

                        {/* 2. Waktu Kejadian */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    Waktu Komunikasi
                                </span>
                                <div className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                    <Clock className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                                    {formatDate(correspondence.occurred_at)}
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                    Tercatat resmi dalam berkas
                                </p>
                            </div>
                        </div>

                        {/* 3. Perkara Terkait */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    Nomor Perkara
                                </span>
                                <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    <Briefcase className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 truncate">
                                    {correspondence.matter.matter_number}
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                                    {correspondence.matter.title}
                                </p>
                            </div>
                        </div>

                        {/* 4. Pencatat & Integritas */}
                        <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    Pencatat Resmi
                                </span>
                                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    <ShieldCheck className="size-3.5" />
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                    {correspondence.creator.name}
                                </p>
                                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="size-3" />
                                    Terverifikasi Sah
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 3. Main Grid Layout (2 Cols Left, 1 Col Right) */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {/* Left Column (2 Cols): Correspondence Details & Documents */}
                        <div className="space-y-5 lg:col-span-2">
                            {/* Message Header & Body Card */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="space-y-2.5 border-b border-slate-100 pb-3.5 text-xs dark:border-white/[0.04]">
                                    <div className="flex items-start gap-2">
                                        <span className="w-16 shrink-0 font-semibold text-slate-400">
                                            Dari:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 font-mono font-semibold text-slate-900 dark:text-white">
                                            {correspondence.from_addresses.map((addr, idx) => (
                                                <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-white/[0.06]">
                                                    {addr}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-16 shrink-0 font-semibold text-slate-400">
                                            Kepada:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 font-mono font-semibold text-slate-900 dark:text-white">
                                            {correspondence.to_addresses.map((addr, idx) => (
                                                <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-white/[0.06]">
                                                    {addr}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {correspondence.cc_addresses && correspondence.cc_addresses.length > 0 && (
                                        <div className="flex items-start gap-2">
                                            <span className="w-16 shrink-0 font-semibold text-slate-400">
                                                CC:
                                            </span>
                                            <div className="flex flex-wrap gap-1.5 font-mono text-slate-600 dark:text-zinc-400">
                                                {correspondence.cc_addresses.map((addr, idx) => (
                                                    <span key={idx} className="rounded bg-slate-50 px-1.5 py-0.5 text-[11px] dark:bg-white/[0.04]">
                                                        {addr}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="py-4 text-xs leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-zinc-200">
                                    {correspondence.body || (
                                        <p className="text-slate-400 italic">
                                            Tidak ada ringkasan atau isi pesan tercatat.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                            <Paperclip className="size-3.5" />
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Lampiran Berkas ({correspondence.documents.length})
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-3">
                                    {correspondence.documents.length > 0 ? (
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {correspondence.documents.map((document) => (
                                                <Link
                                                    key={document.id}
                                                    href={documentRoutes.show(document.id)}
                                                    className="group flex items-center justify-between gap-2.5 rounded-lg border border-slate-200/70 bg-slate-50/60 p-2.5 text-xs transition-colors hover:border-slate-300 hover:bg-white dark:border-white/[0.04] dark:bg-[#121418] dark:hover:bg-zinc-800"
                                                >
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <div className="flex size-6 shrink-0 items-center justify-center rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                                                            <FileText className="size-3" />
                                                        </div>
                                                        <span className="truncate font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                            {document.title}
                                                        </span>
                                                    </div>
                                                    <ArrowUpRight className="size-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400">
                                            Belum ada dokumen lampiran terkait korespondensi ini.
                                        </p>
                                    )}

                                    {/* Upload Form */}
                                    {canUploadAttachment && (
                                        <Form
                                            {...attachmentRoutes.store.form(correspondence.id)}
                                            encType="multipart/form-data"
                                            className="rounded-lg border border-slate-200/60 bg-slate-50/60 p-3 dark:border-white/[0.04] dark:bg-[#121418]"
                                        >
                                            {({ processing, errors }) => (
                                                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
                                                    <div className="flex-1 space-y-1">
                                                        <Label
                                                            htmlFor="attachment-file"
                                                            className="text-xs font-semibold text-slate-900 dark:text-white"
                                                        >
                                                            Unggah Lampiran Baru
                                                        </Label>
                                                        <FileInput
                                                            id="attachment-file"
                                                            name="file"
                                                            required
                                                            buttonText="Pilih Lampiran"
                                                            placeholder="Pilih berkas surat / bukti..."
                                                        />
                                                        {errors.file && (
                                                            <p className="text-xs font-semibold text-rose-500">
                                                                {errors.file}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        disabled={processing}
                                                        className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <Spinner className="mr-1.5 size-3" />
                                                                Mengunggah...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="mr-1.5 size-3" />
                                                                Upload
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Context & Metadata */}
                        <div className="space-y-3.5">
                            {/* Linked Matter Card */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                    PERKARA TERKAIT
                                </span>
                                <div className="mt-1.5 space-y-0.5">
                                    <Link
                                        href={matterRoutes.show(correspondence.matter.id)}
                                        className="group block"
                                    >
                                        <span className="font-mono text-xs font-semibold text-blue-600 group-hover:underline dark:text-blue-400">
                                            {correspondence.matter.matter_number}
                                        </span>
                                        <p className="mt-0.5 text-xs font-medium text-slate-900 dark:text-white">
                                            {correspondence.matter.title}
                                        </p>
                                    </Link>
                                </div>
                                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 w-full rounded-lg text-xs font-semibold"
                                        asChild
                                    >
                                        <Link href={matterRoutes.show(correspondence.matter.id)}>
                                            Lihat Perkara
                                            <ArrowUpRight className="ml-1 size-3 text-slate-400" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Client Info Card */}
                            {correspondence.client && (
                                <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                        KLIEN
                                    </span>
                                    <div className="mt-1.5">
                                        <Link
                                            href={clientRoutes.show(correspondence.client.id)}
                                            className="text-xs font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                                        >
                                            {correspondence.client.display_name}
                                        </Link>
                                        {correspondence.client.client_number && (
                                            <p className="mt-0.5 font-mono text-[10px] text-slate-500">
                                                {correspondence.client.client_number}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 w-full rounded-lg text-xs font-semibold"
                                            asChild
                                        >
                                            <Link href={clientRoutes.show(correspondence.client.id)}>
                                                Lihat Klien
                                                <ArrowUpRight className="ml-1 size-3 text-slate-400" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Audit Meta Card */}
                            <div className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase dark:text-zinc-400">
                                    CATATAN TATA KELOLA
                                </span>
                                <div className="mt-2 space-y-1.5 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Pencatat:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {correspondence.creator.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Waktu:</span>
                                        <span className="font-mono text-[10.5px] font-semibold text-slate-700 dark:text-zinc-300">
                                            {formatDate(correspondence.occurred_at, true)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 dark:border-white/[0.04]">
                                        <span className="text-slate-500">Integritas:</span>
                                        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">
                                            <ShieldCheck className="size-3" />
                                            Terverifikasi Sah
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

CorrespondenceShow.layout = {
    breadcrumbs: [
        { title: 'Tata Kelola', href: governanceRoutes.index() },
        {
            title: 'Detail Korespondensi',
            href: correspondenceRoutes.show(':correspondence'),
        },
    ],
};
