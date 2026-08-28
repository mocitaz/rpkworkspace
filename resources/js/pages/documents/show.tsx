import { Form, Head, Link, router, useForm } from '@inertiajs/react';
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
    Trash2,
    Upload,
    User,
} from 'lucide-react';
import { useRef, useState } from 'react';
import {
    DiscussionBox,
    type DiscussionComment,
    type DiscussionStaff,
} from '@/components/comments/discussion-box';
import { ConfirmDialog } from '@/components/confirm-dialog';
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
import { FileInput } from '@/components/ui/file-input';
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
            signing_token: string;
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
        delete?: boolean;
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
    const [signingVersionId, setSigningVersionId] = useState(
        document.versions[0]?.id || '',
    );
    const [signers, setSigners] = useState([{ name: '', email: '' }]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const selectedVersion =
        document.versions.find((version) => version.id === selectedVersionId) ??
        document.versions[0];

    return (
        <>
            <Head title={`Dokumen - ${document.title}`} />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Document Cockpit Bar */}
                    <div className="space-y-3 border-b border-slate-200/60 pb-5 dark:border-white/[0.06]">
                        {/* Top Tier: Breadcrumbs + Action Buttons */}
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            {/* Left: Breadcrumbs */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="-ml-2 h-7 px-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    <Link href={documentRoutes.index.url()}>
                                        <ArrowLeft className="mr-1 size-3.5 text-slate-400" />
                                        Repositori Dokumen
                                    </Link>
                                </Button>
                            </div>

                            {/* Right: Action Buttons */}
                            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                                {can.uploadVersion &&
                                    !document.matter?.legal_hold_at && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setWorkflowOpen('review')
                                            }
                                            className="h-7.5 rounded-lg border-slate-200/80 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                        >
                                            <PenLine className="mr-1 size-3 text-slate-400" />
                                            Ajukan Review
                                        </Button>
                                    )}

                                {can.signature &&
                                    !document.matter?.legal_hold_at && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setWorkflowOpen('signature')
                                            }
                                            className="h-7.5 rounded-lg border-purple-200 bg-purple-50/50 px-2.5 text-xs font-semibold text-purple-700 shadow-2xs hover:bg-purple-100/50 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300"
                                        >
                                            <QrCode className="mr-1 size-3 text-purple-600 dark:text-purple-400" />
                                            E-Sign Internal
                                        </Button>
                                    )}

                                {can.uploadVersion &&
                                    !document.matter?.legal_hold_at && (
                                        <Button
                                            size="sm"
                                            onClick={() => setOpen(true)}
                                            className="h-7.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95"
                                        >
                                            <FileUp className="mr-1 size-3.5" />
                                            + Versi Baru
                                        </Button>
                                    )}

                                {can.delete &&
                                    !document.matter?.legal_hold_at && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setShowDeleteConfirm(true)
                                            }
                                            className="h-7.5 rounded-lg border-rose-200 bg-rose-50/50 px-2.5 text-xs font-semibold text-rose-700 shadow-2xs hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
                                        >
                                            <Trash2 className="mr-1 size-3 text-rose-600 dark:text-rose-400" />
                                            Hapus
                                        </Button>
                                    )}
                            </div>
                        </div>

                        {/* Bottom Tier: Full-Width Document Title & Context Metadata */}
                        <div className="space-y-1.5">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-[26px] lg:leading-snug dark:text-white">
                                {document.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-zinc-400">
                                {document.matter ? (
                                    <>
                                        <div className="flex items-center gap-1.5">
                                            <span>Perkara:</span>
                                            <Link
                                                href={matterRoutes.show.url(
                                                    document.matter.id,
                                                )}
                                                className="font-mono font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {document.matter.matter_number} -{' '}
                                                {document.matter.title}
                                            </Link>
                                        </div>
                                    </>
                                ) : document.client ? (
                                    <>
                                        <div className="flex items-center gap-1.5">
                                            <span>Klien:</span>
                                            <Link
                                                href={clientRoutes.show.url(
                                                    document.client.id,
                                                )}
                                                className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                                {document.client.display_name}
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <span>Dokumen Umum Firma</span>
                                )}
                                <span>·</span>
                                <div>
                                    Dibuat oleh{' '}
                                    <strong className="font-semibold text-slate-900 dark:text-white">
                                        {document.creator.name}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legal Hold Warning Banner */}
                    {document.matter?.legal_hold_at && (
                        <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                            <ShieldAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-amber-200">
                                    Perkara dalam Status Legal Hold (
                                    {formatDate(
                                        document.matter.legal_hold_at,
                                        true,
                                    )}
                                    )
                                </p>
                                <p className="text-[11px] opacity-90">
                                    Seluruh perubahan operasional, penambahan
                                    versi baru dokumen, dan permohonan tanda
                                    tangan elektronik (E-Sign) dinonaktifkan
                                    sementara demi menjaga integritas pembuktian
                                    litigasi.
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
                                    <span className="text-[10px] font-semibold uppercase">
                                        VERSI DITINJAU
                                    </span>
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
                                    <span className="text-[10px] font-semibold uppercase">
                                        INTEGRITAS BERKAS
                                    </span>
                                    <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="mt-1.5 flex items-baseline justify-between">
                                    <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                                        Aman (Terverifikasi)
                                    </span>
                                    <span className="py-0.2 rounded bg-slate-100 px-1.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
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
                                    <span className="text-[10px] font-semibold uppercase">
                                        UKURAN BERKAS
                                    </span>
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
                                    <span className="text-[10px] font-semibold uppercase">
                                        TANGGAL RILIS
                                    </span>
                                    <FileCheck className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                </div>
                                <p className="mt-1.5 font-mono text-xs font-bold text-slate-900 dark:text-white">
                                    {formatDate(
                                        selectedVersion.created_at,
                                        true,
                                    )}
                                </p>
                                <div className="mt-2 truncate border-t border-slate-100 pt-1.5 font-mono text-[10px] text-slate-400">
                                    SHA:{' '}
                                    {selectedVersion.checksum.substring(0, 16)}
                                    ...
                                </div>
                            </div>
                        </section>
                    )}

                    {/* 3. Document Preview Viewport Section */}
                    {selectedVersion && (
                        <div
                            id="preview-viewport"
                            className="scroll-mt-6 overflow-hidden rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                        <Eye className="size-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Pratinjau Dokumen (v
                                        {selectedVersion.version_number}.0)
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2">
                                    {can.download &&
                                        selectedVersion.scan_status !==
                                            'infected' && (
                                            <Button
                                                size="sm"
                                                className="h-8 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
                                                asChild
                                            >
                                                <a
                                                    href={versionRoutes.download.url(
                                                        {
                                                            document:
                                                                document.id,
                                                            version:
                                                                selectedVersion.id,
                                                        },
                                                    )}
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
                                            <p className="font-bold">
                                                File Diblokir oleh Sistem
                                                Keamanan
                                            </p>
                                            <p className="text-[11px] opacity-90">
                                                {selectedVersion.scan_message ??
                                                    'Ancaman keamanan terdeteksi. Berkas tidak dapat diunduh.'}
                                            </p>
                                        </div>
                                    </div>
                                ) : isInlinePreview(
                                      selectedVersion.mime_type,
                                  ) ? (
                                    selectedVersion.mime_type ===
                                        'application/pdf' ||
                                    selectedVersion.mime_type.startsWith(
                                        'text/',
                                    ) ? (
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
                                        <FileText className="mx-auto mb-2 size-8 text-slate-300 dark:text-zinc-600" />
                                        <p className="font-semibold text-slate-800 dark:text-white">
                                            Pratinjau langsung tersedia untuk
                                            format PDF dan gambar.
                                        </p>
                                        <p className="mt-0.5 text-slate-500 dark:text-zinc-400">
                                            Gunakan tombol{' '}
                                            <strong>Unduh Berkas</strong> di
                                            atas untuk membuka dan meninjau
                                            dokumen ini di perangkat Anda.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 4. Row: Approval & Review + Riwayat Versi + Verifikasi E-Sign (3-in-a-row with uniform height & scroll) */}
                    <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
                        {/* 1. Approval Dokumen */}
                        <div className="flex h-[350px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                        <PenLine className="size-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Approval &amp; Review Dokumen
                                    </h3>
                                </div>
                                <span className="py-0.2 rounded bg-slate-100 px-1.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                    {document.approvals.length} Pengajuan
                                </span>
                            </div>

                            <div className="custom-scroll min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto pt-1 pr-1 dark:divide-white/[0.04]">
                                {document.approvals.length ? (
                                    document.approvals.map((approval) => (
                                        <div
                                            key={approval.id}
                                            className="space-y-2 py-3 text-xs"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                        {approval.reviewer.name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            Reviewer:{' '}
                                                            {
                                                                approval
                                                                    .reviewer
                                                                    .name
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <StatusBadge
                                                    value={approval.status}
                                                />
                                            </div>

                                            <div className="space-y-1 rounded-lg bg-slate-50/80 p-2.5 dark:bg-zinc-800/40">
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                    Diajukan oleh{' '}
                                                    <strong className="text-slate-800 dark:text-zinc-200">
                                                        {
                                                            approval.requester
                                                                .name
                                                        }
                                                    </strong>
                                                    {approval.request_note
                                                        ? ` — "${approval.request_note}"`
                                                        : ''}
                                                </p>
                                                {approval.resolution_note && (
                                                    <p className="border-t border-slate-200/50 pt-1 text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                                                        Catatan:{' '}
                                                        {
                                                            approval.resolution_note
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            {approval.status === 'pending' &&
                                                can.approve && (
                                                    <div className="flex items-center gap-2 pt-0.5">
                                                        <Form
                                                            action={approvalRoutes.resolve.url(
                                                                approval.id,
                                                            )}
                                                            method="patch"
                                                        >
                                                            <input
                                                                type="hidden"
                                                                name="approved"
                                                                value="1"
                                                            />
                                                            <Button
                                                                size="sm"
                                                                className="h-7 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                                                            >
                                                                Setujui
                                                            </Button>
                                                        </Form>
                                                        <Form
                                                            action={approvalRoutes.resolve.url(
                                                                approval.id,
                                                            )}
                                                            method="patch"
                                                        >
                                                            <input
                                                                type="hidden"
                                                                name="approved"
                                                                value="0"
                                                            />
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
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-6 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
                                        Belum ada pengajuan review pada dokumen
                                        ini.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 2. Version History */}
                        <div className="flex h-[350px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                        <FileClock className="size-3.5" />
                                    </div>
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                        Riwayat &amp; Log Seluruh Versi
                                    </h3>
                                </div>
                                <span className="py-0.2 rounded bg-slate-100 px-1.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                    {document.versions.length} Versi
                                </span>
                            </div>

                            <div className="custom-scroll min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto pr-1 dark:divide-white/[0.04]">
                                {document.versions.map((v, index) => (
                                    <div
                                        key={v.id}
                                        className="space-y-2 py-3 text-xs"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between gap-1.5">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                                        v{v.version_number}.0
                                                    </span>
                                                    {index === 0 && (
                                                        <span className="py-0.2 shrink-0 rounded bg-blue-50 px-1.5 font-mono text-[9.5px] font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                            TERKINI
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex shrink-0 items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant={
                                                            selectedVersion?.id ===
                                                            v.id
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        onClick={() => {
                                                            setSelectedVersionId(
                                                                v.id,
                                                            );
                                                            window.document
                                                                .getElementById(
                                                                    'preview-viewport',
                                                                )
                                                                ?.scrollIntoView(
                                                                    {
                                                                        behavior:
                                                                            'smooth',
                                                                    },
                                                                );
                                                        }}
                                                        className={`h-6 rounded px-2 text-[10.5px] font-semibold ${
                                                            selectedVersion?.id ===
                                                            v.id
                                                                ? 'bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-950'
                                                                : 'border-slate-200 hover:bg-slate-50 dark:border-white/10'
                                                        }`}
                                                    >
                                                        <Eye className="mr-1 size-2.5" />
                                                        {selectedVersion?.id ===
                                                        v.id
                                                            ? 'Ditinjau'
                                                            : 'Pratinjau'}
                                                    </Button>

                                                    {can.download &&
                                                        v.scan_status !==
                                                            'infected' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-6 rounded border-slate-200 px-2 text-[10.5px] font-semibold text-blue-600 hover:bg-slate-50 dark:border-white/10 dark:text-blue-400"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={versionRoutes.download.url(
                                                                        {
                                                                            document:
                                                                                document.id,
                                                                            version:
                                                                                v.id,
                                                                        },
                                                                    )}
                                                                >
                                                                    <Download className="mr-1 size-2.5" />
                                                                    Unduh
                                                                </a>
                                                            </Button>
                                                        )}
                                                </div>
                                            </div>
                                            <p className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                                {v.original_filename}
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                Oleh{' '}
                                                <strong className="text-slate-700 dark:text-zinc-300">
                                                    {v.uploader.name}
                                                </strong>{' '}
                                                ·{' '}
                                                {formatDate(v.created_at, true)}{' '}
                                                · {formatBytes(v.file_size)}
                                            </p>
                                            {v.notes && (
                                                <p className="rounded bg-slate-50 p-1.5 text-[11px] text-slate-700 dark:bg-zinc-800/40 dark:text-zinc-300">
                                                    Catatan: {v.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Penerimaan Internal & Verifikasi E-Sign */}
                        <div className="flex h-[350px] flex-col rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-zinc-100">
                                        <QrCode className="size-3.5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                            Penerimaan &amp; Verifikasi E-Sign
                                        </h3>
                                    </div>
                                </div>
                                <span className="py-0.2 rounded bg-slate-100 px-1.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                                    {document.signature_requests.length}{' '}
                                    Permintaan
                                </span>
                            </div>

                            <div className="custom-scroll min-h-0 flex-1 space-y-3 overflow-y-auto pt-1 pr-1">
                                {document.signature_requests.length ? (
                                    document.signature_requests.map(
                                        (request) => (
                                            <div
                                                key={request.id}
                                                className="space-y-2.5 rounded-lg border border-slate-200/80 bg-slate-50/50 p-3 text-xs dark:border-white/10 dark:bg-zinc-900/40"
                                            >
                                                {/* Header Row: Mode + Code + Status */}
                                                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200/60 pb-2 dark:border-white/5">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className="py-0.2 rounded bg-slate-200/80 px-1.5 font-mono text-[9.5px] font-bold text-slate-700 uppercase dark:bg-zinc-800 dark:text-zinc-300">
                                                            {request.mode ===
                                                            'sequential'
                                                                ? 'Berurutan'
                                                                : 'Paralel'}
                                                        </span>
                                                        <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                                                            Kode:{' '}
                                                            {
                                                                request.verification_code
                                                            }
                                                        </span>
                                                    </div>
                                                    <StatusBadge
                                                        value={request.status}
                                                    />
                                                </div>

                                                {/* Actions */}
                                                {request.status ===
                                                    'completed' && (
                                                    <div className="flex flex-wrap items-center gap-1">
                                                        <a
                                                            href={signatureArtifactRoutes.signedFinal.url(
                                                                request.id,
                                                            )}
                                                            className="inline-flex h-6 items-center gap-1 rounded bg-slate-900 px-2 text-[10.5px] font-bold text-white shadow-2xs transition-all hover:bg-black active:scale-95 dark:bg-white dark:text-slate-900"
                                                            title="Unduh Berkas PDF Resmi"
                                                        >
                                                            <Download className="size-2.5 text-emerald-400 dark:text-emerald-600" />
                                                            <span>
                                                                Unduh PDF
                                                            </span>
                                                        </a>
                                                        {request.certificate_path && (
                                                            <a
                                                                href={signatureArtifactRoutes.certificate.url(
                                                                    request.id,
                                                                )}
                                                                className="inline-flex h-6 items-center gap-1 rounded border border-slate-200 bg-white px-2 text-[10.5px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                                title="Unduh Sertifikat Pengesahan"
                                                            >
                                                                <FileCheck className="size-2.5 text-blue-600" />
                                                                <span>
                                                                    Sertifikat
                                                                </span>
                                                            </a>
                                                        )}
                                                        <a
                                                            href={signatureVerificationRoutes.verify.url(
                                                                request.verification_code,
                                                            )}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex h-6 items-center gap-1 rounded border border-slate-200 bg-white px-2 text-[10.5px] font-semibold text-blue-600 hover:bg-blue-50 dark:border-white/10 dark:bg-zinc-800 dark:text-blue-400"
                                                            title="Buka Halaman Verifikasi QR Publik"
                                                        >
                                                            <ExternalLink className="size-2.5" />
                                                            <span>
                                                                Verifikasi
                                                            </span>
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Signers List */}
                                                <div className="space-y-1.5 pt-0.5">
                                                    {request.signers.map(
                                                        (s, idx) => (
                                                            <div
                                                                key={
                                                                    s.id || idx
                                                                }
                                                                className="flex items-center gap-2 rounded border border-slate-200/80 bg-white p-2 shadow-2xs dark:border-white/10 dark:bg-[#14161b]"
                                                            >
                                                                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-[10px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                                    {idx + 1}
                                                                </div>
                                                                <div className="space-y-0.2 min-w-0 flex-1">
                                                                    <p className="truncate text-[11px] font-bold text-slate-900 dark:text-white">
                                                                        {s.name}
                                                                    </p>
                                                                    <p className="truncate text-[10px] text-slate-500">
                                                                        {
                                                                            s.email
                                                                        }
                                                                    </p>
                                                                    <p className="text-[10px]">
                                                                        {s.status ===
                                                                        'signed' ? (
                                                                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                                                                <Check className="size-2" />
                                                                                Ditandatangani{' '}
                                                                                {s.signed_at
                                                                                    ? formatDate(
                                                                                          s.signed_at,
                                                                                      )
                                                                                    : 'Selesai'}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="font-medium text-amber-600 dark:text-amber-400">
                                                                                Menunggu
                                                                                penandatanganan
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                </div>

                                                                {s.status ===
                                                                    'pending' &&
                                                                    s.signing_token && (
                                                                        <div className="flex shrink-0 items-center gap-1">
                                                                            <a
                                                                                href={`/sign/${s.signing_token}`}
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="inline-flex h-5.5 items-center justify-center gap-0.5 rounded bg-slate-900 px-1.5 text-[10px] font-bold text-white shadow-2xs transition-all hover:bg-black active:scale-95 dark:bg-white dark:text-slate-900"
                                                                            >
                                                                                <PenLine className="size-2" />
                                                                                TTD
                                                                            </a>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const url = `${window.location.origin}/sign/${s.signing_token}`;
                                                                                    navigator.clipboard.writeText(
                                                                                        url,
                                                                                    );
                                                                                    alert(
                                                                                        `Tautan tanda tangan disalin:\n${url}`,
                                                                                    );
                                                                                }}
                                                                                className="inline-flex h-5.5 items-center justify-center rounded border border-slate-200 bg-white px-1.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
                                                                                title="Salin tautan signer"
                                                                            >
                                                                                <Copy className="size-2" />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <p className="py-6 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
                                        Belum ada permintaan tanda tangan
                                        internal.
                                    </p>
                                )}
                            </div>
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
            <UploadVersionModal
                isOpen={open}
                onClose={() => setOpen(false)}
                documentId={document.id}
            />

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
                            Tugaskan rekan atau Partner untuk meninjau dan
                            menyetujui dokumen ini.
                        </DialogDescription>
                    </DialogHeader>

                    <Form
                        action={approvalRoutes.store.url(document.id)}
                        method="post"
                        className="space-y-3.5 pt-1"
                        onSuccess={() => setWorkflowOpen(null)}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="reviewer_id"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Pilih Reviewer *
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="reviewer_id"
                                            name="reviewer_id"
                                            required
                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-2.5 text-xs text-slate-900 outline-none hover:bg-slate-100/70 focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        >
                                            <option value="">
                                                Pilih Reviewer
                                            </option>
                                            {reviewers.map((reviewer) => (
                                                <option
                                                    key={reviewer.id}
                                                    value={reviewer.id}
                                                >
                                                    {reviewer.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    <InputError message={errors.reviewer_id} />
                                </div>

                                <div className="grid gap-1">
                                    <Label
                                        htmlFor="note"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
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
                                    Penerimaan internal dan verifikasi keabsahan
                                    digital dengan QR Code tersertifikasi.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        action={signatureRoutes.store.url(document.id)}
                        method="post"
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
                                        {errors.error ||
                                            (errors as any).general}
                                    </div>
                                )}

                                {/* Pilihan Versi Berkas untuk E-Sign */}
                                <div className="grid gap-2 rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 dark:border-white/10 dark:bg-zinc-800/40">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="document_version_id"
                                            className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-100"
                                        >
                                            <FileText className="size-3.5 text-blue-600 dark:text-blue-400" />
                                            Pilih Versi Berkas yang
                                            Ditandatangani *
                                        </Label>
                                        <span className="font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                            {document.versions.length} Versi
                                            Tersedia
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <select
                                            id="document_version_id"
                                            name="document_version_id"
                                            value={signingVersionId}
                                            onChange={(e) =>
                                                setSigningVersionId(
                                                    e.target.value,
                                                )
                                            }
                                            className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-3 text-xs font-medium text-slate-900 outline-none hover:bg-slate-50 focus:border-slate-900 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        >
                                            {document.versions.map((ver) => (
                                                <option
                                                    key={ver.id}
                                                    value={ver.id}
                                                >
                                                    Versi #{ver.version_number}{' '}
                                                    — {ver.original_filename} (
                                                    {formatBytes(ver.file_size)}{' '}
                                                    ·{' '}
                                                    {formatDate(ver.created_at)}
                                                    )
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                    </div>

                                    {/* Preview Kartu Versi yang Dipilih */}
                                    {(() => {
                                        const v =
                                            document.versions.find(
                                                (item) =>
                                                    item.id ===
                                                    signingVersionId,
                                            ) || document.versions[0];
                                        if (!v) return null;
                                        return (
                                            <div className="flex items-center justify-between gap-2 rounded-lg border border-blue-200/70 bg-blue-50/70 px-3 py-2 text-[11px] text-blue-950 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200">
                                                <div className="min-w-0 flex-1 truncate">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                                                            Versi v
                                                            {v.version_number}
                                                        </span>
                                                        <span className="text-blue-400 dark:text-blue-600">
                                                            ·
                                                        </span>
                                                        <span className="truncate font-semibold text-slate-900 dark:text-white">
                                                            {
                                                                v.original_filename
                                                            }
                                                        </span>
                                                    </div>
                                                    <p className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-zinc-400">
                                                        Diunggah oleh{' '}
                                                        {v.uploader?.name ||
                                                            'Staf'}{' '}
                                                        ·{' '}
                                                        {formatBytes(
                                                            v.file_size,
                                                        )}{' '}
                                                        ·{' '}
                                                        {formatDate(
                                                            v.created_at,
                                                        )}
                                                        {v.notes
                                                            ? ` · "${v.notes}"`
                                                            : ''}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 rounded bg-blue-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                                                    Terpilih
                                                </span>
                                            </div>
                                        );
                                    })()}
                                    <InputError
                                        message={
                                            (errors as any).document_version_id
                                        }
                                    />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label
                                        htmlFor="mode"
                                        className="text-xs font-bold text-slate-700 dark:text-zinc-200"
                                    >
                                        Alur Penandatanganan
                                    </Label>
                                    <div className="relative">
                                        <select
                                            id="mode"
                                            name="mode"
                                            className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-3 text-xs font-medium text-slate-900 outline-none hover:bg-slate-100/70 focus:border-slate-900 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        >
                                            <option value="sequential">
                                                Berurutan (Sequential) — Sesuai
                                                urutan pihak
                                            </option>
                                            <option value="parallel">
                                                Simultan (Paralel) — Bersamaan
                                                seluruh pihak
                                            </option>
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
                                                                setSigners(
                                                                    (cur) =>
                                                                        cur.filter(
                                                                            (
                                                                                _,
                                                                                i,
                                                                            ) =>
                                                                                i !==
                                                                                index,
                                                                        ),
                                                                )
                                                            }
                                                            className="cursor-pointer text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                                                        >
                                                            Hapus Pihak Ini
                                                        </button>
                                                    )}
                                                </div>

                                                {firmStaff.length > 0 && (
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                            Pilih dari Anggota
                                                            Tim RPK
                                                        </span>
                                                        <div className="relative">
                                                            <select
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const selectedId =
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        );
                                                                    if (
                                                                        !selectedId
                                                                    )
                                                                        return;
                                                                    const staff =
                                                                        firmStaff.find(
                                                                            (
                                                                                s,
                                                                            ) =>
                                                                                s.id ===
                                                                                selectedId,
                                                                        );
                                                                    if (staff) {
                                                                        setSigners(
                                                                            (
                                                                                cur,
                                                                            ) =>
                                                                                cur.map(
                                                                                    (
                                                                                        item,
                                                                                        i,
                                                                                    ) =>
                                                                                        i ===
                                                                                        index
                                                                                            ? {
                                                                                                  ...item,
                                                                                                  name: staff.name,
                                                                                                  email:
                                                                                                      (
                                                                                                          staff as any
                                                                                                      )
                                                                                                          .email ||
                                                                                                      '',
                                                                                              }
                                                                                            : item,
                                                                                ),
                                                                        );
                                                                    }
                                                                }}
                                                                defaultValue=""
                                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-2.5 text-xs text-slate-800 outline-none hover:bg-slate-50 focus:border-slate-900 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                            >
                                                                <option
                                                                    value=""
                                                                    disabled
                                                                >
                                                                    Pilih Staf /
                                                                    Partner
                                                                    Firma...
                                                                </option>
                                                                {firmStaff.map(
                                                                    (staff) => (
                                                                        <option
                                                                            key={
                                                                                staff.id
                                                                            }
                                                                            value={
                                                                                staff.id
                                                                            }
                                                                        >
                                                                            {
                                                                                staff.name
                                                                            }{' '}
                                                                            {(
                                                                                staff as any
                                                                            )
                                                                                .email
                                                                                ? `— ${(staff as any).email}`
                                                                                : ''}
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                            Nama Lengkap *
                                                        </span>
                                                        <Input
                                                            name={`signers[${index}][name]`}
                                                            placeholder="Nama penandatangan"
                                                            required
                                                            value={signer.name}
                                                            onChange={(e) =>
                                                                setSigners(
                                                                    (cur) =>
                                                                        cur.map(
                                                                            (
                                                                                item,
                                                                                i,
                                                                            ) =>
                                                                                i ===
                                                                                index
                                                                                    ? {
                                                                                          ...item,
                                                                                          name: e
                                                                                              .target
                                                                                              .value,
                                                                                      }
                                                                                    : item,
                                                                        ),
                                                                )
                                                            }
                                                            className="h-8 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                                                        />
                                                    </div>

                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                            Alamat Email *
                                                        </span>
                                                        <Input
                                                            name={`signers[${index}][email]`}
                                                            placeholder="email@instansi.id"
                                                            type="email"
                                                            required
                                                            value={signer.email}
                                                            onChange={(e) =>
                                                                setSigners(
                                                                    (cur) =>
                                                                        cur.map(
                                                                            (
                                                                                item,
                                                                                i,
                                                                            ) =>
                                                                                i ===
                                                                                index
                                                                                    ? {
                                                                                          ...item,
                                                                                          email: e
                                                                                              .target
                                                                                              .value,
                                                                                      }
                                                                                    : item,
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

                                                <InputError
                                                    message={
                                                        (errors as any)[
                                                            `signers.${index}.name`
                                                        ] ||
                                                        (errors as any)[
                                                            `signers.${index}.email`
                                                        ]
                                                    }
                                                />
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
                                        className="h-9 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
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

            {/* Modal Konfirmasi Hapus Dokumen */}
            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Hapus Dokumen Repositori"
                description={`Apakah Anda yakin ingin menghapus dokumen "${document.title}" beserta seluruh riwayat versinya? Tindakan ini akan dicatat dalam log audit.`}
                confirmLabel="Hapus Dokumen"
                variant="danger"
                processing={isDeleting}
                onConfirm={() => {
                    setIsDeleting(true);
                    router.delete(`/documents/${document.id}`, {
                        onFinish: () => {
                            setIsDeleting(false);
                            setShowDeleteConfirm(false);
                        },
                    });
                }}
            />
        </>
    );
}

function UploadVersionModal({
    isOpen,
    onClose,
    documentId,
}: {
    isOpen: boolean;
    onClose: () => void;
    documentId: string;
}) {
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            file: File | null;
            notes: string;
        }>({
            file: null,
            notes: '',
        });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(versionRoutes.store.url(documentId), {
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
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                        Unggah Versi Dokumen Baru
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                        Versi sebelumnya tetap tersimpan utuh dalam audit log.
                    </DialogDescription>
                </DialogHeader>

                {Object.keys(errors).length > 0 && (
                    <div className="my-2 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                        <div className="flex items-center gap-2 font-bold">
                            <ShieldAlert className="size-4 shrink-0 text-rose-600" />
                            <span>Gagal mengunggah versi baru:</span>
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
                            htmlFor="version-file"
                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                        >
                            Pilih Berkas Baru{' '}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <FileInput
                            id="version-file"
                            ref={fileInputRef}
                            required
                            buttonText="Pilih Berkas Baru"
                            placeholder="Klik atau seret revisi berkas baru..."
                            value={data.file}
                            onFileSelect={(file) => setData('file', file)}
                        />
                        <InputError message={errors.file} />
                    </div>

                    <div className="grid gap-1">
                        <Label
                            htmlFor="version-notes"
                            className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                        >
                            Catatan Perubahan / Rilis
                        </Label>
                        <textarea
                            id="version-notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
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
                                'Unggah Versi'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
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
        { title: 'Dokumen', href: documentRoutes.index.url() },
        { title: 'Detail Dokumen', href: '#' },
    ],
};
