import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Clock,
    FileText,
    FolderKanban,
    Mail,
    Paperclip,
    Send,
    ShieldCheck,
    Upload,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
            <Head title={`Korespondensi — ${correspondence.subject}`} />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Minimalist Notion */}
                    <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                        <div className="space-y-1.5">
                            <Link
                                href={governanceRoutes.index()}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#787774] transition-colors hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white"
                            >
                                <ArrowLeft className="size-3.5" />
                                Kembali ke Governance
                            </Link>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                                        isInbound
                                            ? 'bg-[#e1f3fe] text-[#1f6c9f] dark:bg-blue-950/40 dark:text-sky-300'
                                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    }`}
                                >
                                    {isInbound ? <Mail className="size-3" /> : <Send className="size-3" />}
                                    {isInbound ? 'Surat Masuk' : 'Surat Keluar'} ({correspondence.source})
                                </span>
                                <span className="rounded-md bg-black/[0.04] px-2 py-0.5 font-mono text-[11px] text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                    {formatDate(correspondence.occurred_at, true)}
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                {correspondence.subject}
                            </h1>

                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Terkait Perkara{' '}
                                <Link
                                    href={matterRoutes.show(correspondence.matter.id)}
                                    className="font-mono font-semibold text-blue-600 hover:underline dark:text-sky-400"
                                >
                                    {correspondence.matter.matter_number} — {correspondence.matter.title}
                                </Link>
                                {correspondence.client && ` · Klien ${correspondence.client.display_name}`}
                            </p>
                        </div>
                    </header>

                    {/* 2-Column Grid Layout */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Message & Attachments (2 Columns) */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Message Card */}
                            <div className="rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <div className="border-b border-black/[0.04] pb-3.5 space-y-2 text-xs dark:border-white/[0.04]">
                                    <div className="flex items-start gap-2">
                                        <span className="w-16 shrink-0 font-medium text-[#787774]">Dari:</span>
                                        <span className="font-mono font-semibold text-[#111111] dark:text-white">
                                            {correspondence.from_addresses.join(', ')}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="w-16 shrink-0 font-medium text-[#787774]">Kepada:</span>
                                        <span className="font-mono font-semibold text-[#111111] dark:text-white">
                                            {correspondence.to_addresses.join(', ')}
                                        </span>
                                    </div>
                                    {correspondence.cc_addresses && correspondence.cc_addresses.length > 0 && (
                                        <div className="flex items-start gap-2">
                                            <span className="w-16 shrink-0 font-medium text-[#787774]">CC:</span>
                                            <span className="font-mono text-[#787774] dark:text-zinc-400">
                                                {correspondence.cc_addresses.join(', ')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="py-4 text-xs leading-relaxed text-[#111111] whitespace-pre-wrap dark:text-zinc-200">
                                    {correspondence.body || (
                                        <p className="italic text-[#787774]">Tidak ada ringkasan atau isi pesan tercatat.</p>
                                    )}
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div className="rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-2">
                                        <Paperclip className="size-3.5 text-[#787774]" />
                                        <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                            Lampiran Berkas ({correspondence.documents.length})
                                        </h3>
                                    </div>
                                </div>

                                <div className="pt-3 space-y-3">
                                    {correspondence.documents.length > 0 ? (
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {correspondence.documents.map((document) => (
                                                <Link
                                                    key={document.id}
                                                    href={documentRoutes.show(document.id)}
                                                    className="group flex items-center justify-between gap-2.5 rounded-lg border border-black/[0.06] bg-[#fafafa] p-2.5 text-xs transition-colors hover:bg-black/[0.02] dark:border-white/[0.06] dark:bg-zinc-800/40 dark:hover:bg-zinc-800"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#1f6c9f] dark:bg-blue-950/40 dark:text-sky-300">
                                                            <FileText className="size-3.5" />
                                                        </div>
                                                        <span className="truncate font-medium text-[#111111] group-hover:text-blue-600 dark:text-white dark:group-hover:text-sky-400">
                                                            {document.title}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-[#787774]">Belum ada dokumen lampiran terkait korespondensi ini.</p>
                                    )}

                                    {/* Upload Form */}
                                    {canUploadAttachment && (
                                        <Form
                                            {...attachmentRoutes.store.form(correspondence.id)}
                                            className="rounded-lg border border-black/[0.08] bg-[#fafafa] p-3.5 dark:border-white/[0.08] dark:bg-zinc-800/40"
                                        >
                                            {({ processing, errors }) => (
                                                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
                                                    <div className="flex-1 space-y-1">
                                                        <Label htmlFor="attachment-file" className="text-xs font-semibold text-[#111111] dark:text-white">
                                                            Unggah Dokumen Lampiran Baru
                                                        </Label>
                                                        <Input
                                                            id="attachment-file"
                                                            name="file"
                                                            type="file"
                                                            required
                                                            className="h-8 rounded-lg border border-black/[0.08] bg-white text-xs file:mr-2.5 file:rounded-md file:border-0 file:bg-zinc-100 file:px-2.5 file:py-0.5 file:text-xs dark:bg-zinc-800"
                                                        />
                                                        {errors.file && <p className="text-xs text-rose-500">{errors.file}</p>}
                                                    </div>
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
                                                            <>
                                                                <Upload className="mr-1.5 size-3.5" />
                                                                Upload Lampiran
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
                        <div className="space-y-3">
                            {/* Linked Matter Card */}
                            <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <span className="text-[10px] font-bold tracking-wider text-[#787774] uppercase">
                                    Perkara Terkait
                                </span>
                                <div className="mt-1.5 space-y-0.5">
                                    <Link
                                        href={matterRoutes.show(correspondence.matter.id)}
                                        className="group block"
                                    >
                                        <span className="font-mono text-xs font-bold text-blue-600 group-hover:underline dark:text-sky-400">
                                            {correspondence.matter.matter_number}
                                        </span>
                                        <p className="text-xs font-medium text-[#111111] dark:text-white mt-0.5">
                                            {correspondence.matter.title}
                                        </p>
                                    </Link>
                                </div>
                            </div>

                            {/* Client Info Card */}
                            {correspondence.client && (
                                <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <span className="text-[10px] font-bold tracking-wider text-[#787774] uppercase">
                                        Klien
                                    </span>
                                    <div className="mt-1.5">
                                        <Link
                                            href={clientRoutes.show(correspondence.client.id)}
                                            className="font-semibold text-xs text-[#111111] hover:text-blue-600 dark:text-white dark:hover:text-sky-400"
                                        >
                                            {correspondence.client.display_name}
                                        </Link>
                                        {correspondence.client.client_number && (
                                            <p className="font-mono text-[10px] text-[#787774] mt-0.5">
                                                {correspondence.client.client_number}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Audit Meta Card */}
                            <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <span className="text-[10px] font-bold tracking-wider text-[#787774] uppercase">
                                    Catatan Tata Kelola
                                </span>
                                <div className="mt-2 space-y-1.5 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#787774]">Pencatat:</span>
                                        <span className="font-medium text-[#111111] dark:text-white">
                                            {correspondence.creator.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#787774]">Waktu Pencatatan:</span>
                                        <span className="font-mono text-[10px] text-[#787774]">
                                            {formatDate(correspondence.occurred_at, true)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 border-t border-black/[0.04] dark:border-white/[0.04]">
                                        <span className="text-[#787774]">Integritas:</span>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                            <ShieldCheck className="size-3" />
                                            Terverifikasi
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
        { title: 'Governance', href: governanceRoutes.index() },
        { title: 'Detail Korespondensi', href: correspondenceRoutes.show(':correspondence') },
    ],
};
