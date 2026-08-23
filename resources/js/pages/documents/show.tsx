import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    ChevronDown,
    Download,
    Eye,
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
    matter?: { id: string; matter_number: string; title: string; legal_hold_at?: string | null };
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
};

export default function DocumentShow({
    document,
    can,
    reviewers,
}: {
    document: Document;
    can: {
        uploadVersion: boolean;
        download: boolean;
        approve: boolean;
        signature: boolean;
    };
    reviewers: { id: number; name: string }[];
}) {
    const [open, setOpen] = useState(false);
    const [workflowOpen, setWorkflowOpen] = useState<'review' | 'signature' | null>(null);
    const [selectedVersionId, setSelectedVersionId] = useState(document.versions[0]?.id);
    const [signers, setSigners] = useState([{ name: '', email: '' }]);

    const selectedVersion =
        document.versions.find((version) => version.id === selectedVersionId) ??
        document.versions[0];

    return (
        <>
            <Head title={`Dokumen — ${document.title}`} />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Minimalist Notion */}
                    <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                        <div className="space-y-1.5">
                            <Link
                                href={documentRoutes.index()}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#787774] transition-colors hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white"
                            >
                                <ArrowLeft className="size-3.5" />
                                Kembali ke Repositori Dokumen
                            </Link>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <StatusBadge value={document.status} />
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
                                <span className="rounded bg-black/[0.04] px-1.5 py-0.2 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                    {document.document_type ?? 'Dokumen'}
                                </span>
                                {document.matter?.legal_hold_at && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#fdebec] px-1.5 py-0.2 text-[10px] font-bold text-[#9f2f2d] dark:bg-rose-950/60 dark:text-rose-300">
                                        <ShieldAlert className="size-3" />
                                        Legal Hold Aktif
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                {document.title}
                            </h1>

                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                {document.matter ? (
                                    <>
                                        Terkait Perkara{' '}
                                        <Link
                                            href={matterRoutes.show(document.matter.id)}
                                            className="font-mono font-semibold text-blue-600 hover:underline dark:text-sky-400"
                                        >
                                            {document.matter.matter_number} — {document.matter.title}
                                        </Link>
                                    </>
                                ) : document.client ? (
                                    <>
                                        Terkait Klien{' '}
                                        <Link
                                            href={clientRoutes.show(document.client.id)}
                                            className="font-semibold text-blue-600 hover:underline dark:text-sky-400"
                                        >
                                            {document.client.display_name}
                                        </Link>
                                    </>
                                ) : (
                                    'Dokumen Umum Firma'
                                )}
                                {' · '}Dibuat oleh {document.creator.name}
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex shrink-0 items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                            {can.uploadVersion && !document.matter?.legal_hold_at && (
                                <Button
                                    variant="outline"
                                    onClick={() => setWorkflowOpen('review')}
                                    className="h-8 shrink-0 whitespace-nowrap rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                                >
                                    <PenLine className="mr-1.5 size-3.5 text-[#787774]" />
                                    Ajukan Review
                                </Button>
                            )}
                            {can.signature && !document.matter?.legal_hold_at && (
                                <Button
                                    variant="outline"
                                    onClick={() => setWorkflowOpen('signature')}
                                    className="h-8 shrink-0 whitespace-nowrap rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                                >
                                    <QrCode className="mr-1.5 size-3.5 text-[#787774]" />
                                    E-sign Internal
                                </Button>
                            )}
                            {can.uploadVersion && !document.matter?.legal_hold_at && (
                                <Button
                                    onClick={() => setOpen(true)}
                                    className="h-8 shrink-0 whitespace-nowrap rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    <FileUp className="mr-1.5 size-3.5" />
                                    Unggah Versi Baru
                                </Button>
                            )}
                        </div>
                    </header>

                    {/* Legal Hold Warning Banner */}
                    {document.matter?.legal_hold_at && (
                        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-[#fbf3db]/60 p-3.5 text-xs text-[#956400] dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                            <ShieldAlert className="size-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div className="min-w-0">
                                <p className="font-bold text-[#111111] dark:text-amber-200">
                                    Perkara dalam Status Legal Hold ({formatDate(document.matter.legal_hold_at, true)})
                                </p>
                                <p className="text-[11px] opacity-90 mt-0.5">
                                    Seluruh perubahan operasional, penambahan versi baru dokumen, dan permohonan tanda tangan elektronik (E-Sign) dinonaktifkan sementara demi menjaga integritas pembuktian litigasi.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 3 Bento Summary Cards (h-[76px]) */}
                    {selectedVersion && (
                        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {/* 1. Versi Terpilih */}
                            <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                    <span>Versi Yang Dilihat</span>
                                    <FileText className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                                </div>
                                <div className="flex items-baseline justify-between min-w-0">
                                    <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                        v{selectedVersion.version_number}.0
                                    </span>
                                    <p className="truncate text-[10px] text-[#787774] dark:text-zinc-400 max-w-[140px]">
                                        {selectedVersion.original_filename}
                                    </p>
                                </div>
                            </div>

                            {/* 2. Keamanan & Ekstraksi */}
                            <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                    <span>Integritas &amp; Antivirus</span>
                                    <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <span className={`font-mono text-sm font-bold ${
                                        selectedVersion.scan_status === 'clean'
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : selectedVersion.scan_status === 'pending'
                                              ? 'text-amber-600 dark:text-amber-400'
                                              : 'text-rose-600 dark:text-rose-400'
                                    }`}>
                                        {selectedVersion.scan_status === 'clean' ? 'Bersih (Clean)' : selectedVersion.scan_status === 'pending' ? 'Memindai...' : 'Bahaya'}
                                    </span>
                                    <p className="text-[10px] text-[#787774] dark:text-zinc-400">
                                        OCR: {selectedVersion.extraction_status}
                                    </p>
                                </div>
                            </div>

                            {/* 3. Ukuran & Tanggal */}
                            <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                    <span>Ukuran &amp; Diunggah</span>
                                    <FileClock className="size-3.5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                        {formatBytes(selectedVersion.file_size)}
                                    </span>
                                    <p className="text-[10px] text-[#787774] dark:text-zinc-400">
                                        {selectedVersion.uploader.name}
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Preview Section */}
                    {selectedVersion && (
                        <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-6 items-center justify-center rounded-md bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-zinc-200">
                                        <Eye className="size-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                        Pratinjau Dokumen (v{selectedVersion.version_number}.0)
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2">
                                    {can.uploadVersion && (
                                        <Form
                                            {...versionRoutes.process.form({
                                                document: document.id,
                                                version: selectedVersion.id,
                                            })}
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 rounded-md border-black/10 text-[11px] font-medium hover:bg-black/[0.03]"
                                            >
                                                <RefreshCw className="mr-1 size-3" />
                                                Proses Ulang OCR
                                            </Button>
                                        </Form>
                                    )}

                                    {can.download && selectedVersion.scan_status !== 'infected' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 rounded-md border-black/10 text-[11px] font-medium hover:bg-black/[0.03]"
                                            asChild
                                        >
                                            <a
                                                href={versionRoutes.download.url({
                                                    document: document.id,
                                                    version: selectedVersion.id,
                                                })}
                                            >
                                                <Download className="mr-1 size-3" /> Unduh Berkas
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Viewport */}
                            <div className="pt-3">
                                {selectedVersion.scan_status === 'infected' ? (
                                    <div className="flex items-center gap-3 rounded-lg border border-rose-200 bg-[#fdebec] p-3 text-xs text-[#9f2f2d] dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                                        <ShieldAlert className="size-4.5 shrink-0" />
                                        <div>
                                            <p className="font-bold">File Diblokir oleh Sistem Keamanan</p>
                                            <p className="mt-0.5 text-[11px] opacity-90">
                                                {selectedVersion.scan_message ??
                                                    'Ancaman keamanan terdeteksi. Berkas tidak dapat diunduh atau dipratinjau.'}
                                            </p>
                                        </div>
                                    </div>
                                ) : isInlinePreview(selectedVersion.mime_type) ? (
                                    selectedVersion.mime_type === 'application/pdf' ? (
                                        <iframe
                                            title={`Preview ${selectedVersion.original_filename}`}
                                            src={versionRoutes.preview.url({
                                                document: document.id,
                                                version: selectedVersion.id,
                                            })}
                                            className="h-[65vh] w-full rounded-lg border border-black/[0.08] bg-[#fafafa] dark:border-white/10 dark:bg-zinc-900"
                                        />
                                    ) : (
                                        <div className="flex justify-center rounded-lg bg-[#fafafa] p-4 dark:bg-zinc-900">
                                            <img
                                                src={versionRoutes.preview.url({
                                                    document: document.id,
                                                    version: selectedVersion.id,
                                                })}
                                                alt={`Preview ${selectedVersion.original_filename}`}
                                                className="max-h-[65vh] rounded-lg object-contain shadow-xs"
                                            />
                                        </div>
                                    )
                                ) : selectedVersion.extracted_text ? (
                                    <div className="rounded-lg border border-black/[0.08] bg-[#fafafa] dark:border-white/10 dark:bg-zinc-900">
                                        <div className="flex items-center gap-2 border-b border-black/[0.04] bg-[#f5f5f5] px-3 py-1.5 text-[11px] font-semibold text-[#787774] dark:border-white/5 dark:bg-zinc-800/60">
                                            <ScanText className="size-3.5" />
                                            Teks Hasil Ekstraksi / OCR
                                        </div>
                                        <pre className="max-h-[50vh] overflow-auto p-3 font-mono text-xs leading-relaxed text-[#111111] whitespace-pre-wrap dark:text-zinc-200">
                                            {selectedVersion.extracted_text}
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed border-black/10 bg-[#fafafa] p-6 text-center text-xs dark:border-white/10 dark:bg-zinc-800/30">
                                        <p className="font-semibold text-[#111111] dark:text-white">
                                            Pratinjau visual belum tersedia untuk jenis file ini.
                                        </p>
                                        <p className="mt-1 text-[11px] text-[#787774] dark:text-zinc-400">
                                            Status ekstraksi: {selectedVersion.extraction_status}. Anda dapat mengunduh berkas langsung melalui tombol di atas.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Workflow Panel: Approval & Signature Requests */}
                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* 1. Approval Dokumen */}
                        <div className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div>
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-6 items-center justify-center rounded-md bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-zinc-200">
                                            <PenLine className="size-3.5" />
                                        </div>
                                        <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                            Approval &amp; Review Dokumen
                                        </h3>
                                    </div>
                                </div>

                                <div className="divide-y divide-black/[0.04] pt-1 dark:divide-white/[0.04]">
                                    {document.approvals.length ? (
                                        document.approvals.map((approval) => (
                                            <div key={approval.id} className="space-y-1.5 py-2.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs font-semibold text-[#111111] dark:text-white">
                                                        Reviewer: {approval.reviewer.name}
                                                    </span>
                                                    <StatusBadge value={approval.status} />
                                                </div>

                                                <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                    Diajukan oleh {approval.requester.name}
                                                    {approval.request_note ? ` · "${approval.request_note}"` : ''}
                                                </p>

                                                {approval.status === 'pending' && can.approve && (
                                                    <div className="flex items-center gap-2 pt-1">
                                                        <Form {...approvalRoutes.resolve.form(approval.id)}>
                                                            <input type="hidden" name="approved" value="1" />
                                                            <Button
                                                                size="sm"
                                                                className="h-6.5 rounded-md bg-[#111111] px-2.5 text-[10px] font-semibold text-white hover:bg-black dark:bg-white dark:text-black"
                                                            >
                                                                Setujui
                                                            </Button>
                                                        </Form>
                                                        <Form {...approvalRoutes.resolve.form(approval.id)}>
                                                            <input type="hidden" name="approved" value="0" />
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-6.5 rounded-md border-black/10 px-2.5 text-[10px] font-medium text-[#111111] hover:bg-black/[0.03]"
                                                            >
                                                                Minta Revisi
                                                            </Button>
                                                        </Form>
                                                    </div>
                                                )}

                                                {approval.resolution_note && (
                                                    <p className="rounded-md bg-[#fafafa] p-2 text-[10px] text-[#2f3437] dark:bg-zinc-800 dark:text-zinc-300">
                                                        Catatan Keputusan: {approval.resolution_note}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-6 text-center text-xs text-[#787774] dark:text-zinc-500">
                                            Belum ada pengajuan review pada dokumen ini.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Signature Requests & Acceptance */}
                        <div className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div>
                                <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5 dark:border-white/[0.04]">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-6 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                            <QrCode className="size-3.5" />
                                        </div>
                                        <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                            Penerimaan Internal &amp; Verifikasi E-Sign
                                        </h3>
                                    </div>
                                </div>

                                <div className="divide-y divide-black/[0.04] pt-1 dark:divide-white/[0.04]">
                                    {document.signature_requests.length ? (
                                        document.signature_requests.map((request) => (
                                            <div key={request.id} className="py-2.5 text-xs space-y-1.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-semibold text-[#111111] dark:text-white">
                                                        Mode: {request.mode === 'sequential' ? 'Berurutan' : 'Paralel'}
                                                    </span>
                                                    <StatusBadge value={request.status} />
                                                </div>

                                                <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                    {request.signers
                                                        .map((s) => `${s.name} (${s.status})`)
                                                        .join(' · ')}
                                                </p>

                                                <div className="flex items-center gap-2 pt-0.5">
                                                    <a
                                                        href={signatureVerificationRoutes.verify.url(request.verification_code)}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="font-mono text-[11px] font-semibold text-blue-600 hover:underline dark:text-sky-400"
                                                    >
                                                        Kode Verifikasi: {request.verification_code}
                                                    </a>
                                                </div>

                                                {/* Download Artifacts when completed */}
                                                {request.status === 'completed' && (
                                                    <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                                                        {request.signed_final_path && request.signed_final_status === 'completed' && (
                                                            <a
                                                                href={signatureArtifactRoutes.signedFinal.url(request.id)}
                                                                className="rounded-md border border-black/10 bg-[#fafafa] px-2 py-0.5 font-medium text-blue-600 hover:bg-black/[0.03] dark:bg-zinc-800"
                                                            >
                                                                Unduh Signed-Final PDF
                                                            </a>
                                                        )}
                                                        {request.certificate_path && (
                                                            <a
                                                                href={signatureArtifactRoutes.certificate.url(request.id)}
                                                                className="rounded-md border border-black/10 bg-[#fafafa] px-2 py-0.5 font-medium text-blue-600 hover:bg-black/[0.03] dark:bg-zinc-800"
                                                            >
                                                                Unduh Sertifikat PDF
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="py-6 text-center text-xs text-[#787774] dark:text-zinc-500">
                                            Belum ada permintaan tanda tangan internal.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Version History Table */}
                    <div className="rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5 dark:border-white/[0.04]">
                            <div className="flex items-center gap-2">
                                <div className="flex size-6 items-center justify-center rounded-md bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-zinc-200">
                                    <FileClock className="size-3.5" />
                                </div>
                                <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                                    Riwayat &amp; Log Seluruh Versi ({document.versions.length})
                                </h3>
                            </div>
                        </div>

                        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                            {document.versions.map((v, index) => (
                                <div
                                    key={v.id}
                                    className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="space-y-0.5 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-[#111111] dark:text-white">
                                                v{v.version_number}.0
                                            </span>
                                            {index === 0 && (
                                                <span className="rounded bg-[#e1f3fe] px-1.5 py-0.2 text-[10px] font-bold text-[#1f6c9f] dark:bg-blue-950/40 dark:text-sky-300">
                                                    AKTIF / TERKINI
                                                </span>
                                            )}
                                            <span className="truncate text-xs font-medium text-[#111111] dark:text-white">
                                                {v.original_filename}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                            Diunggah oleh {v.uploader.name} · {formatDate(v.created_at, true)} · {formatBytes(v.file_size)}
                                        </p>
                                        {v.notes && (
                                            <p className="text-[11px] text-[#2f3437] dark:text-zinc-300">
                                                Catatan: {v.notes}
                                            </p>
                                        )}
                                        <p className="font-mono text-[10px] text-[#787774]">
                                            SHA-256: {v.checksum}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant={selectedVersion?.id === v.id ? 'default' : 'outline'}
                                            onClick={() => setSelectedVersionId(v.id)}
                                            className={`h-7 rounded-md text-[11px] font-medium ${
                                                selectedVersion?.id === v.id
                                                    ? 'bg-[#111111] text-white hover:bg-black dark:bg-white dark:text-black'
                                                    : 'border-black/10 hover:bg-black/[0.03]'
                                            }`}
                                        >
                                            <Eye className="mr-1 size-3" />
                                            {selectedVersion?.id === v.id ? 'Sedang Dilihat' : 'Pratinjau'}
                                        </Button>

                                        {can.download && v.scan_status !== 'infected' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-7 rounded-md border-black/10 text-[11px] font-medium hover:bg-black/[0.03]"
                                                asChild
                                            >
                                                <a
                                                    href={versionRoutes.download.url({
                                                        document: document.id,
                                                        version: v.id,
                                                    })}
                                                >
                                                    <Download className="mr-1 size-3" /> Unduh
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal: Unggah Versi Baru */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <DialogTitle className="text-sm font-bold text-[#111111] dark:text-white">
                            Unggah Versi Dokumen Baru
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#787774]">
                            Versi sebelumnya tetap tersimpan utuh dan dapat diakses kembali sewaktu-waktu.
                        </DialogDescription>
                    </DialogHeader>

                    <Form
                        {...versionRoutes.store.form(document.id)}
                        className="space-y-3.5 pt-1"
                        onSuccess={() => setOpen(false)}
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="version-file" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Pilih Berkas Baru *
                                    </Label>
                                    <Input
                                        id="version-file"
                                        name="file"
                                        type="file"
                                        required
                                        className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs file:mr-2.5 file:rounded-md file:border-0 file:bg-zinc-200 file:px-2.5 file:py-0.5 file:text-xs focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212]"
                                    />
                                    <InputError message={errors.file} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="version-notes" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Catatan Perubahan / Rilis
                                    </Label>
                                    <textarea
                                        id="version-notes"
                                        name="notes"
                                        rows={2}
                                        placeholder="Keterangan perbaikan draf, masukan partner, dll..."
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
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <DialogTitle className="text-sm font-bold text-[#111111] dark:text-white">
                            Ajukan Review Dokumen
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#787774]">
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
                                <div className="grid gap-1.5">
                                    <Label htmlFor="reviewer_id" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Pilih Reviewer *
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="reviewer_id"
                                            name="reviewer_id"
                                            required
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                        >
                                            <option value="">Pilih Reviewer</option>
                                            {reviewers.map((reviewer) => (
                                                <option key={reviewer.id} value={reviewer.id}>
                                                    {reviewer.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                    </div>
                                    <InputError message={errors.reviewer_id} />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="note" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Catatan / Instruksi Review
                                    </Label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        rows={2}
                                        placeholder="Poin spesifik yang perlu diperiksa..."
                                        className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs text-[#111111] outline-none transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                    />
                                    <InputError message={errors.note} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setWorkflowOpen(null)}
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
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <DialogTitle className="text-sm font-bold text-[#111111] dark:text-white">
                            Kirim E-Sign Internal RPK
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#787774]">
                            Penerimaan internal dan verifikasi digital dengan QR code tersertifikasi.
                        </DialogDescription>
                    </DialogHeader>

                    <Form
                        {...signatureRoutes.store.form(document.id)}
                        className="space-y-3.5 pt-1"
                        onSuccess={() => {
                            setWorkflowOpen(null);
                            setSigners([{ name: '', email: '' }]);
                        }}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="mode" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Alur Penandatanganan
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="mode"
                                            name="mode"
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                        >
                                            <option value="sequential">Berurutan (Satu per satu)</option>
                                            <option value="parallel">Paralel (Serentak)</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Daftar Penandatangan (Signers)
                                        </Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="h-6.5 rounded-md border-black/10 px-2 text-[10px] font-medium text-[#111111] hover:bg-black/[0.03]"
                                            onClick={() => setSigners((c) => [...c, { name: '', email: '' }])}
                                        >
                                            + Tambah Signer
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {signers.map((signer, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col gap-2 rounded-lg border border-black/[0.08] bg-[#fafafa] p-2.5 sm:flex-row sm:items-center dark:border-white/10 dark:bg-zinc-800/40"
                                            >
                                                <Input
                                                    name={`signers[${index}][name]`}
                                                    placeholder="Nama lengkap"
                                                    required
                                                    value={signer.name}
                                                    onChange={(e) =>
                                                        setSigners((cur) =>
                                                            cur.map((item, i) =>
                                                                i === index ? { ...item, name: e.target.value } : item,
                                                            ),
                                                        )
                                                    }
                                                    className="h-7.5 rounded-md border-black/[0.08] bg-white text-xs dark:bg-[#121212]"
                                                />
                                                <Input
                                                    name={`signers[${index}][email]`}
                                                    type="email"
                                                    placeholder="email@perusahaan.com"
                                                    required
                                                    value={signer.email}
                                                    onChange={(e) =>
                                                        setSigners((cur) =>
                                                            cur.map((item, i) =>
                                                                i === index ? { ...item, email: e.target.value } : item,
                                                            ),
                                                        )
                                                    }
                                                    className="h-7.5 rounded-md border-black/[0.08] bg-white text-xs dark:bg-[#121212]"
                                                />
                                                <input
                                                    name={`signers[${index}][signing_order]`}
                                                    type="hidden"
                                                    value={index + 1}
                                                />
                                                {signers.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            setSigners((cur) => cur.filter((_, i) => i !== index))
                                                        }
                                                        className="h-7.5 shrink-0 px-2 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                                                    >
                                                        Hapus
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setWorkflowOpen(null)}
                                        className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03]"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        disabled={processing}
                                        className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black"
                                    >
                                        Kirim Signature Request
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
    return mimeType === 'application/pdf' || mimeType.startsWith('image/');
}

DocumentShow.layout = {
    breadcrumbs: [
        { title: 'Dokumen', href: documentRoutes.index() },
        { title: 'Detail Dokumen', href: '#' },
    ],
};
