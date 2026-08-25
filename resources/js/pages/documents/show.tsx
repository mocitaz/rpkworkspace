import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowUpRight,
    Building2,
    Check,
    CheckCircle2,
    ChevronDown,
    Copy,
    Download,
    ExternalLink,
    Eye,
    FileCheck,
    FileCheck2,
    FileClock,
    FileText,
    FileUp,
    FolderKanban,
    PenLine,
    Plus,
    QrCode,
    RefreshCw,
    ScanText,
    ShieldAlert,
    ShieldCheck,
    Upload,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { DiscussionBox, type DiscussionComment, type DiscussionStaff } from '@/components/comments/discussion-box';
import { EmptyState } from '@/components/empty-state';
import InputError from '@/components/input-error';
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
import * as approvalRoutes from '@/routes/documents/approvals';
import * as signatureRoutes from '@/routes/documents/signature-requests';
import * as versionRoutes from '@/routes/documents/versions';
import * as matterRoutes from '@/routes/matters';
import * as signatureVerificationRoutes from '@/routes/signature';
import * as signatureArtifactRoutes from '@/routes/signature-requests';
import * as signatureReminderRoutes from '@/routes/signature-requests/reminders';

type Version = {
    id: string;
    version_number: number;
    original_filename: string;
    mime_type: string;
    file_size: number;
    checksum: string;
    notes?: string;
    created_at: string;
    uploader: { name: string };
    scan_status: string;
    scan_message?: string;
    scanned_at?: string;
    extraction_status: string;
    extracted_text?: string;
    extraction_metadata?: Record<string, unknown>;
    extracted_at?: string;
};

type Document = {
    id: string;
    title: string;
    document_type?: string;
    status: string;
    confidentiality_level: string;
    matter?: {
        id: string;
        matter_number: string;
        title: string;
        legal_hold_at?: string | null;
    };
    client?: { id: string; client_number: string; display_name: string };
    creator: { name: string };
    versions: Version[];
    approvals: {
        id: string;
        status: string;
        request_note?: string;
        resolution_note?: string;
        reviewer: { name: string };
        requester: { name: string };
    }[];
    signature_requests: {
        id: string;
        status: string;
        verification_code: string;
        mode: string;
        signed_record_path?: string;
        signed_final_path?: string;
        signed_final_status?: string;
        signed_final_message?: string;
        certificate_path?: string;
        signers: {
            id: string;
            name: string;
            email: string;
            status: string;
            signed_at?: string;
        }[];
    }[];
    comments?: DiscussionComment[];
};

export default function DocumentShow({
    document,
    firmStaff = [],
    can,
    reviewers,
}: {
    document: Document;
    firmStaff?: DiscussionStaff[];
    can: {
        uploadVersion: boolean;
        download: boolean;
        approve: boolean;
        signature: boolean;
    };
    reviewers: { id: number; name: string }[];
}) {
    const [open, setOpen] = useState(false);
    const [workflowOpen, setWorkflowOpen] = useState<
        'review' | 'signature' | null
    >(null);
    const [selectedVersionId, setSelectedVersionId] = useState(
        document.versions[0]?.id,
    );
    const [signers, setSigners] = useState([{ name: '', email: '' }]);

    const selectedVersion =
        document.versions.find((version) => version.id === selectedVersionId) ??
        document.versions[0];

    return (
        <>
            <Head title={`Dokumen - ${document.title}`} />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Title Toolbar (2 Baris Terpisah Rapi) */}
                    <div className="space-y-3.5 border-b border-slate-200/60 pb-5 dark:border-white/[0.06]">
                        {/* Baris 1: Navigasi Kembali & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-8 shrink-0 rounded-lg border-slate-200/70 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                            >
                                <Link href={documentRoutes.index()}>
                                    <ArrowLeft className="mr-1.5 size-3.5 text-slate-500" />
                                    Kembali ke Repositori
                                </Link>
                            </Button>

                            {/* Actions Toolbar */}
                            <div className="flex flex-wrap items-center gap-2">
                                {can.uploadVersion && !document.matter?.legal_hold_at && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setWorkflowOpen('review')}
                                        className="h-8 shrink-0 rounded-lg border-slate-200/70 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200"
                                    >
                                        <PenLine className="mr-1.5 size-3.5 text-slate-500" />
                                        Ajukan Review
                                    </Button>
                                )}
                                {can.signature && !document.matter?.legal_hold_at && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setWorkflowOpen('signature')}
                                        className="h-8 shrink-0 rounded-lg border-purple-200 bg-purple-50/50 px-3 text-xs font-semibold text-purple-700 shadow-2xs hover:bg-purple-100/50 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300"
                                    >
                                        <QrCode className="mr-1.5 size-3.5 text-purple-600" />
                                        E-Sign Internal
                                    </Button>
                                )}
                                {can.uploadVersion && !document.matter?.legal_hold_at && (
                                    <Button
                                        size="sm"
                                        onClick={() => setOpen(true)}
                                        className="h-8 shrink-0 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
                                    >
                                        <FileUp className="mr-1.5 size-3.5" />
                                        + Versi Baru
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Baris 2: Status Badges, Judul Dokumen & Metadata */}
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <StatusBadge value={document.status} />
                                <span
                                    className={`rounded px-1.5 py-0.2 text-[9.5px] font-semibold uppercase ${
                                        document.confidentiality_level === 'strictly_confidential'
                                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                                            : document.confidentiality_level === 'restricted'
                                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                              : 'bg-slate-100 text-slate-600 dark:bg-white/[0.06]'
                                    }`}
                                >
                                    {document.confidentiality_level}
                                </span>
                                <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9.5px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-zinc-300">
                                    {document.document_type ?? 'Dokumen'}
                                </span>
                                {document.matter?.legal_hold_at && (
                                    <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.2 text-[9.5px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                        <ShieldAlert className="size-2.5" />
                                        Legal Hold Aktif
                                    </span>
                                )}
                            </div>

                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                {document.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                                {document.matter ? (
                                    <>
                                        <span>Perkara:</span>
                                        <Link
                                            href={matterRoutes.show(document.matter.id)}
                                            className="font-mono font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            {document.matter.matter_number} - {document.matter.title}
                                        </Link>
                                    </>
                                ) : document.client ? (
                                    <>
                                        <span>Klien:</span>
                                        <Link
                                            href={clientRoutes.show(document.client.id)}
                                            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            {document.client.display_name}
                                        </Link>
                                    </>
                                ) : (
                                    <span>Dokumen Umum Firma</span>
                                )}
                                <span>·</span>
                                <span>Dibuat oleh <strong className="font-semibold text-slate-900 dark:text-white">{document.creator.name}</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Legal Hold Warning Banner */}
                    {document.matter?.legal_hold_at && (
                        <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                            <ShieldAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-amber-200">
                                    Perkara dalam Status Legal Hold ({formatDate(document.matter.legal_hold_at, true)})
                                </p>
                                <p className="text-[11px] opacity-90">
                                    Seluruh perubahan operasional, penambahan versi baru dokumen, dan permohonan tanda tangan elektronik (E-Sign) dinonaktifkan sementara demi menjaga integritas pembuktian litigasi.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 2. Top Bento Summary Cards for Selected Version */}
                    {selectedVersion && (
                        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {/* 1. Versi Terpilih */}
                            <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                    <span className="text-[10px] font-semibold uppercase">VERSI DITINJAU</span>
                                    <FileText className="size-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                                    <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        v{selectedVersion.version_number}.0
                                    </span>
                                    <p className="max-w-[130px] truncate font-mono text-[10.5px] text-slate-500 dark:text-zinc-400">
                                        {selectedVersion.original_filename}
                                    </p>
                                </div>
                                <div className="mt-2 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                    Berkas aktif ditinjau
                                </div>
                            </div>

                            {/* 2. Keamanan & Integritas */}
                            <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                    <span className="text-[10px] font-semibold uppercase">INTEGRITAS BERKAS</span>
                                    <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="mt-1.5 flex items-baseline justify-between">
                                    <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                                        Aman (Terverifikasi)
                                    </span>
                                    <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                        SHA-256
                                    </span>
                                </div>
                                <div className="mt-2 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                    Status proteksi &amp; keaslian berkas
                                </div>
                            </div>

                            {/* 3. Ukuran & Pengunggah */}
                            <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                    <span className="text-[10px] font-semibold uppercase">UKURAN BERKAS</span>
                                    <FileClock className="size-3.5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="mt-1.5 flex items-baseline justify-between">
                                    <span className="font-mono text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        {formatBytes(selectedVersion.file_size)}
                                    </span>
                                    <p className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                                        {selectedVersion.uploader.name}
                                    </p>
                                </div>
                                <div className="mt-2 border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 dark:border-white/[0.04]">
                                    Pengunggah versi
                                </div>
                            </div>

                            {/* 4. Tanggal Rilis */}
                            <div className="group rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                    <span className="text-[10px] font-semibold uppercase">TANGGAL RILIS</span>
                                    <FileCheck className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                </div>
                                <p className="mt-1.5 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                    {formatDate(selectedVersion.created_at, true)}
                                </p>
                                <div className="mt-2 border-t border-slate-100 pt-1.5 font-mono text-[10px] text-slate-400 truncate">
                                    SHA: {selectedVersion.checksum.substring(0, 16)}...
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 3. Document Preview Viewport Section */}
                    {selectedVersion && (
                        <div id="preview-viewport" className="scroll-mt-6 overflow-hidden rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                        <Eye className="size-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Pratinjau Dokumen (v{selectedVersion.version_number}.0)
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2">
                                    {can.download && selectedVersion.scan_status !== 'infected' && (
                                        <Button
                                            size="sm"
                                            className="h-8 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                            asChild
                                        >
                                            <a
                                                href={versionRoutes.download.url({
                                                    document: document.id,
                                                    version: selectedVersion.id,
                                                })}
                                            >
                                                <Download className="mr-1 size-3" />
                                                Unduh Berkas
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Viewport Content */}
                            <div className="pt-4">
                                {selectedVersion.scan_status === 'infected' ? (
                                    <div className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                                        <ShieldAlert className="size-4 shrink-0 text-rose-600" />
                                        <div>
                                            <p className="font-bold">File Diblokir oleh Sistem Keamanan</p>
                                            <p className="text-[11px] opacity-90">
                                                {selectedVersion.scan_message ?? 'Ancaman keamanan terdeteksi. Berkas tidak dapat diunduh.'}
                                            </p>
                                        </div>
                                    </div>
                                ) : isInlinePreview(selectedVersion.mime_type) ? (
                                    selectedVersion.mime_type === 'application/pdf' ||
                                    selectedVersion.mime_type.startsWith('text/') ? (
                                        <iframe
                                            title={`Preview ${selectedVersion.original_filename}`}
                                            src={versionRoutes.preview.url({
                                                document: document.id,
                                                version: selectedVersion.id,
                                            })}
                                            className="h-[65vh] w-full rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-zinc-900"
                                        />
                                    ) : (
                                        <div className="flex justify-center rounded-lg bg-slate-50 p-4 dark:bg-zinc-900">
                                            <img
                                                src={versionRoutes.preview.url({
                                                    document: document.id,
                                                    version: selectedVersion.id,
                                                })}
                                                alt={`Preview ${selectedVersion.original_filename}`}
                                                className="max-h-[65vh] rounded-lg object-contain shadow-2xs"
                                            />
                                        </div>
                                    )
                                ) : (
                                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center text-xs dark:border-white/10 dark:bg-zinc-800/30">
                                        <FileText className="mx-auto size-8 text-slate-300 dark:text-zinc-600 mb-2" />
                                        <p className="font-semibold text-slate-800 dark:text-white">
                                            Pratinjau langsung tersedia untuk format PDF dan gambar.
                                        </p>
                                        <p className="mt-0.5 text-slate-500 dark:text-zinc-400">
                                            Gunakan tombol <strong>Unduh Berkas</strong> di atas untuk membuka dan meninjau dokumen ini di perangkat Anda.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 4. Workflow Panel: Approval & Signature Requests */}
                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* 1. Approval Dokumen */}
                        <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                        <PenLine className="size-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Approval &amp; Review Dokumen
                                    </h3>
                                </div>
                                <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                    {document.approvals.length} Pengajuan
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 pt-1 dark:divide-white/[0.04]">
                                {document.approvals.length ? (
                                    document.approvals.map((approval) => (
                                        <div key={approval.id} className="space-y-1.5 py-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                                    Reviewer: {approval.reviewer.name}
                                                </span>
                                                <StatusBadge value={approval.status} />
                                            </div>

                                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                Diajukan oleh <strong className="text-slate-800 dark:text-zinc-300">{approval.requester.name}</strong>
                                                {approval.request_note ? ` · "${approval.request_note}"` : ''}
                                            </p>

                                            {approval.status === 'pending' && can.approve && (
                                                <div className="flex items-center gap-2 pt-1">
                                                    <Form {...approvalRoutes.resolve.form(approval.id)}>
                                                        <input type="hidden" name="approved" value="1" />
                                                        <Button
                                                            size="sm"
                                                            className="h-7 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 shadow-2xs"
                                                        >
                                                            Setujui
                                                        </Button>
                                                    </Form>
                                                    <Form {...approvalRoutes.resolve.form(approval.id)}>
                                                        <input type="hidden" name="approved" value="0" />
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                                                        >
                                                            Minta Revisi
                                                        </Button>
                                                    </Form>
                                                </div>
                                            )}

                                            {approval.resolution_note && (
                                                <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                    Catatan Keputusan: {approval.resolution_note}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-6 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
                                        Belum ada pengajuan review pada dokumen ini.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 2. Signature Requests & Acceptance */}
                        <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                        <QrCode className="size-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Penerimaan Internal &amp; Verifikasi E-Sign
                                    </h3>
                                </div>
                                <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                    {document.signature_requests.length} Permintaan
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 pt-1 dark:divide-white/[0.04]">
                                {document.signature_requests.length ? (
                                    document.signature_requests.map((request) => (
                                        <div key={request.id} className="space-y-3 py-3 text-xs">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        Alur: {request.mode === 'sequential' ? 'Berurutan (Sequential)' : 'Paralel (Serentak)'}
                                                    </span>
                                                </div>
                                                <StatusBadge value={request.status} />
                                            </div>

                                            {/* Signers List with direct signing actions */}
                                            <div className="space-y-2">
                                                {request.signers.map((s, idx) => (
                                                    <div
                                                        key={s.id || idx}
                                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-white/10 dark:bg-zinc-800/40"
                                                    >
                                                        <div className="min-w-0 space-y-0.5">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-bold text-slate-900 dark:text-white">
                                                                    {s.name}
                                                                </span>
                                                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                                    ({s.email})
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                                {s.status === 'signed' ? (
                                                                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                                                        <Check className="size-3" />
                                                                        Ditandatangani {s.signed_at ? formatDate(s.signed_at) : 'Selesai'}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-amber-600 font-medium dark:text-amber-400">
                                                                        Menunggu penandatanganan
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>

                                                        {s.status === 'pending' && (
                                                            <div className="flex items-center gap-1.5 shrink-0">
                                                                {s.signing_token && (
                                                                    <>
                                                                        <a
                                                                            href={`/sign/${s.signing_token}`}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="inline-flex h-7 items-center gap-1 rounded-lg bg-purple-600 px-2.5 text-xs font-bold text-white shadow-2xs hover:bg-purple-700 active:scale-95 transition-all"
                                                                        >
                                                                            <PenLine className="size-3" />
                                                                            Tanda Tangani
                                                                            <ExternalLink className="size-2.5 opacity-70" />
                                                                        </a>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const url = `${window.location.origin}/sign/${s.signing_token}`;
                                                                                navigator.clipboard.writeText(url);
                                                                                alert(`Tautan tanda tangan disalin:\n${url}`);
                                                                            }}
                                                                            className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                                                            title="Salin link tanda tangan signer"
                                                                        >
                                                                            <Copy className="size-3" />
                                                                            Salin Link
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-100/70 px-2.5 py-1.5 dark:bg-zinc-800/60">
                                                <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                    QR Code Verifikasi Publik:
                                                </span>
                                                <a
                                                    href={signatureVerificationRoutes.verify.url(request.verification_code)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-blue-600 hover:underline dark:text-blue-400"
                                                >
                                                    Kode: {request.verification_code}
                                                    <ArrowUpRight className="size-3" />
                                                </a>
                                            </div>

                                            {/* Download Artifacts when completed */}
                                            {request.status === 'completed' && (
                                                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20 space-y-2">
                                                    <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                                                        <FileCheck2 className="size-3.5" />
                                                        Dokumen telah selesai ditandatangani! Berkas PDF resmi telah dibubuhi QR Code sertifikasi dan stempel digital.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 text-xs pt-1">
                                                        <a
                                                            href={signatureArtifactRoutes.signedFinal.url(request.id)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95 transition-all"
                                                        >
                                                            <Download className="size-3.5" />
                                                            Unduh Berkas PDF (Dibubuhi TTD &amp; QR Code)
                                                        </a>
                                                        {request.certificate_path && (
                                                            <a
                                                                href={signatureArtifactRoutes.certificate.url(request.id)}
                                                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 active:scale-95 transition-all"
                                                            >
                                                                <FileCheck className="size-3.5 text-blue-600" />
                                                                Unduh Sertifikat PDF
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-6 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
                                        Belum ada permintaan tanda tangan internal.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 5. Version History Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                            <div className="flex items-center gap-2">
                                <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    <FileClock className="size-3.5" />
                                </div>
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Riwayat &amp; Log Seluruh Versi ({document.versions.length})
                                </h3>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                            {document.versions.map((v, index) => (
                                <div
                                    key={v.id}
                                    className="flex flex-col gap-2.5 py-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0 space-y-0.5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                v{v.version_number}.0
                                            </span>
                                            {index === 0 && (
                                                <span className="rounded bg-blue-50 px-1.5 py-0.2 font-mono text-[9.5px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                    TERKINI
                                                </span>
                                            )}
                                            <span className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                                {v.original_filename}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                                            Oleh <strong className="text-slate-700 dark:text-zinc-300">{v.uploader.name}</strong> · {formatDate(v.created_at, true)} · {formatBytes(v.file_size)}
                                        </p>
                                        {v.notes && (
                                            <p className="text-xs text-slate-700 dark:text-zinc-300">
                                                Catatan: {v.notes}
                                            </p>
                                        )}
                                        <p className="font-mono text-[10px] text-slate-400">
                                            SHA-256: {v.checksum}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-1.5">
                                        <Button
                                            size="sm"
                                            variant={selectedVersion?.id === v.id ? 'default' : 'outline'}
                                            onClick={() => {
                                                setSelectedVersionId(v.id);
                                                window.document.getElementById('preview-viewport')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className={`h-7 rounded-lg text-xs font-semibold ${
                                                selectedVersion?.id === v.id
                                                    ? 'bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-950'
                                                    : 'border-slate-200 hover:bg-slate-50 dark:border-white/10'
                                            }`}
                                        >
                                            <Eye className="mr-1 size-3" />
                                            {selectedVersion?.id === v.id ? 'Sedang Dilihat' : 'Pratinjau'}
                                        </Button>

                                        {can.download && v.scan_status !== 'infected' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 rounded-lg border-slate-200 text-xs font-semibold text-blue-600 hover:bg-slate-50 dark:border-white/10 dark:text-blue-400"
                                                asChild
                                            >
                                                <a href={versionRoutes.download.url({ document: document.id, version: v.id })}>
                                                    <Download className="mr-1 size-3" />
                                                    Unduh
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 6. Document Legal Drafting & Review Discussion */}
                    <DiscussionBox
                        commentableType="document"
                        commentableId={document.id}
                        comments={document.comments || []}
                        staffList={firmStaff || []}
                        title="Diskusi Legal Review & Catatan Draf"
                        subtitle="Kolaborasi penyusunan draf kontrak, catatan klausul ganti rugi, dan instruksi persetujuan partner."
                    />
                </main>
            </div>

            {/* Modal: Unggah Versi Baru */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                        <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                            Unggah Versi Dokumen Baru
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Versi sebelumnya tetap tersimpan utuh dalam audit log.
                        </DialogDescription>
                    </DialogHeader>

                    <Form
                        {...versionRoutes.store.form(document.id)}
                        className="space-y-3.5 pt-1"
                        onSuccess={() => setOpen(false)}
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-1">
                                    <Label htmlFor="version-file" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Pilih Berkas Baru *
                                    </Label>
                                    <Input
                                        id="version-file"
                                        name="file"
                                        type="file"
                                        required
                                        className="h-8 rounded-lg border border-slate-200 bg-slate-50/60 text-xs file:mr-2 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-0.5 file:text-xs file:font-semibold focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418]"
                                    />
                                    <InputError message={errors.file} />
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="version-notes" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Catatan Perubahan / Rilis
                                    </Label>
                                    <textarea
                                        id="version-notes"
                                        name="notes"
                                        rows={2}
                                        placeholder="Keterangan perbaikan draf, masukan partner, dll..."
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                    <InputError message={errors.notes} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOpen(false)}
                                        className="h-8 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Batal
                                    </Button>
                                    <Button
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
                                            'Unggah Versi'
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Modal: Ajukan Review */}
            <Dialog
                open={workflowOpen === 'review'}
                onOpenChange={(value) => !value && setWorkflowOpen(null)}
            >
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                        <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                            Ajukan Review Dokumen
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Tugaskan rekan atau Partner untuk meninjau dan menyetujui dokumen ini.
                        </DialogDescription>
                    </DialogHeader>

                    <Form
                        {...approvalRoutes.store.form(document.id)}
                        className="space-y-3.5 pt-1"
                        onSuccess={() => setWorkflowOpen(null)}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-1">
                                    <Label htmlFor="reviewer_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Pilih Reviewer *
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="reviewer_id"
                                            name="reviewer_id"
                                            required
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-100/70 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        >
                                            <option value="">Pilih Reviewer</option>
                                            {reviewers.map((reviewer) => (
                                                <option key={reviewer.id} value={reviewer.id}>
                                                    {reviewer.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    <InputError message={errors.reviewer_id} />
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="note" className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
                                        Catatan / Instruksi Review
                                    </Label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        rows={2}
                                        placeholder="Poin spesifik yang perlu diperiksa..."
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                    <InputError message={errors.note} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setWorkflowOpen(null)}
                                        className="h-8 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3.5" />
                                                Mengirim...
                                            </>
                                        ) : (
                                            'Kirim Permintaan'
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Modal: Kirim E-Sign Internal */}
            <Dialog
                open={workflowOpen === 'signature'}
                onOpenChange={(value) => !value && setWorkflowOpen(null)}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-6 pr-10 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-zinc-100">
                                <ShieldCheck className="size-4.5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                    Permohonan E-Sign Dokumen
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                    Penerimaan internal dan verifikasi keabsahan digital dengan QR Code tersertifikasi.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...signatureRoutes.store.form(document.id)}
                        className="space-y-4 pt-1"
                        onSuccess={() => {
                            setWorkflowOpen(null);
                            setSigners([{ name: '', email: '' }]);
                        }}
                    >
                        {({ processing, errors }) => (
                            <>
                                {(errors.error || (errors as any).general) && (
                                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                                        {errors.error || (errors as any).general}
                                    </div>
                                )}

                                <div className="grid gap-1.5">
                                    <Label htmlFor="mode" className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                                        Alur Penandatanganan
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="mode"
                                            name="mode"
                                            className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-3 text-xs font-medium text-slate-900 outline-none hover:bg-slate-100/70 focus:border-slate-900 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        >
                                            <option value="sequential">Berurutan (Sequential) — Sesuai urutan pihak</option>
                                            <option value="parallel">Simultan (Paralel) — Bersamaan seluruh pihak</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                                            Daftar Pihak Penandatangan
                                        </Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="h-7 rounded-lg border-slate-200 px-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200"
                                            onClick={() =>
                                                setSigners((c) => [
                                                    ...c,
                                                    { name: '', email: '' },
                                                ])
                                            }
                                        >
                                            + Tambah Penandatangan
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {signers.map((signer, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col gap-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 dark:border-white/10 dark:bg-zinc-800/40"
                                            >
                                                <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-100">
                                                        <span className="flex size-5 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">
                                                            {index + 1}
                                                        </span>
                                                        Pihak #{index + 1}
                                                    </span>

                                                    {signers.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSigners((cur) => cur.filter((_, i) => i !== index))
                                                            }
                                                            className="cursor-pointer text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                                                        >
                                                            Hapus Pihak Ini
                                                        </button>
                                                    )}
                                                </div>

                                                {firmStaff.length > 0 && (
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                                                            Pilih dari Anggota Tim RPK
                                                        </span>
                                                        <div className="relative">
                                                            <select
                                                                onChange={(e) => {
                                                                    const selectedId = Number(e.target.value);
                                                                    if (!selectedId) return;
                                                                    const staff = firmStaff.find((s) => s.id === selectedId);
                                                                    if (staff) {
                                                                        setSigners((cur) =>
                                                                            cur.map((item, i) =>
                                                                                i === index
                                                                                    ? {
                                                                                          ...item,
                                                                                          name: staff.name,
                                                                                          email: (staff as any).email || '',
                                                                                      }
                                                                                    : item,
                                                                            ),
                                                                        );
                                                                    }
                                                                }}
                                                                defaultValue=""
                                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-800 outline-none hover:bg-slate-50 focus:border-slate-900 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                            >
                                                                <option value="" disabled>
                                                                    Pilih Staf / Partner Firma...
                                                                </option>
                                                                {firmStaff.map((staff) => (
                                                                    <option key={staff.id} value={staff.id}>
                                                                        {staff.name} { (staff as any).email ? `— ${(staff as any).email}` : '' }
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                                                            Nama Lengkap *
                                                        </span>
                                                        <Input
                                                            name={`signers[${index}][name]`}
                                                            placeholder="Nama penandatangan"
                                                            required
                                                            value={signer.name}
                                                            onChange={(e) =>
                                                                setSigners((cur) =>
                                                                    cur.map((item, i) =>
                                                                        i === index ? { ...item, name: e.target.value } : item,
                                                                    ),
                                                                )
                                                            }
                                                            className="h-8 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                                                            Alamat Email *
                                                        </span>
                                                        <Input
                                                            name={`signers[${index}][email]`}
                                                            placeholder="email@instansi.id"
                                                            type="email"
                                                            required
                                                            value={signer.email}
                                                            onChange={(e) =>
                                                                setSigners((cur) =>
                                                                    cur.map((item, i) =>
                                                                        i === index ? { ...item, email: e.target.value } : item,
                                                                    ),
                                                                )
                                                            }
                                                            className="h-8 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                                                        />
                                                    </div>
                                                </div>

                                                <input
                                                    name={`signers[${index}][signing_order]`}
                                                    type="hidden"
                                                    value={index + 1}
                                                />

                                                <InputError message={(errors as any)[`signers.${index}.name`] || (errors as any)[`signers.${index}.email`]} />
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.signers} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setWorkflowOpen(null)}
                                        className="h-9 rounded-lg border-slate-200 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={processing}
                                        className="h-9 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 transition-all dark:bg-white dark:text-slate-900"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3.5" />
                                                Memproses...
                                            </>
                                        ) : (
                                            'Kirim Permintaan E-Sign'
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

function isInlinePreview(mimeType: string): boolean {
    return (
        mimeType === 'application/pdf' ||
        mimeType.startsWith('image/') ||
        mimeType.startsWith('text/')
    );
}

DocumentShow.layout = {
    breadcrumbs: [
        { title: 'Dokumen', href: documentRoutes.index() },
        { title: 'Detail Dokumen', href: '#' },
    ],
};
