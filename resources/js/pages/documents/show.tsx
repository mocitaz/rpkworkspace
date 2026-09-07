import { Form, Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
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
    RotateCcw,
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
import { StatusText, StatusTextGroup } from '@/components/status-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useInitials } from '@/hooks/use-initials';
import UserPicker, { type UserOption } from '@/components/user-picker';
import {
    FinanceDialogFooter,
    FinanceDialogHeader,
} from '@/pages/finance/components/finance-dialog-ui';
import { financeDialogPanelClass } from '@/pages/finance/components/finance-dialog-design';
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
    uploader: {
        name: string;
        avatar_url?: string | null;
        avatar_path?: string | null;
    };
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
    creator: {
        name: string;
        avatar_url?: string | null;
        avatar_path?: string | null;
    };
    versions: Version[];
    approvals: {
        id: string;
        reviewer_id?: number | string;
        requester_id?: number | string;
        status: string;
        request_note?: string;
        resolution_note?: string;
        created_at?: string;
        reviewer: {
            id?: number | string;
            name: string;
            avatar_url?: string | null;
            avatar_path?: string | null;
        };
        requester: {
            id?: number | string;
            name: string;
            avatar_url?: string | null;
            avatar_path?: string | null;
        };
    }[];
    signature_requests: {
        id: string;
        status: string;
        verification_code: string;
        mode: string;
        expires_at?: string;
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
    reviewers = [],
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
    reviewers: UserOption[];
}) {
    const { auth } = usePage<{
        auth?: {
            user?: {
                id: number | string;
                name?: string;
                email?: string;
            };
        };
    }>().props;
    const getInitials = useInitials();
    const staffByEmail = new Map(
        firmStaff.map((s) => [s.email?.toLowerCase(), s]),
    );
    const [open, setOpen] = useState(false);
    const [workflowOpen, setWorkflowOpen] = useState<
        'review' | 'signature' | null
    >(null);
    const [selectedReviewerId, setSelectedReviewerId] = useState<string>('');
    const [approvingApproval, setApprovingApproval] = useState<{
        id: string;
        requesterName: string;
    } | null>(null);
    const [approvalNote, setApprovalNote] = useState('');
    const [isApproving, setIsApproving] = useState(false);

    const [revisingApproval, setRevisingApproval] = useState<{
        id: string;
        requesterName: string;
    } | null>(null);
    const [revisionNote, setRevisionNote] = useState('');
    const [isRevising, setIsRevising] = useState(false);

    const [selectedVersionId, setSelectedVersionId] = useState(
        document.versions[0]?.id,
    );
    const selectedVersion =
        document.versions.find((version) => version.id === selectedVersionId) ??
        document.versions[0];
    const [signingVersionId, setSigningVersionId] = useState(
        document.versions[0]?.id || '',
    );
    const [signers, setSigners] = useState([{ name: '', email: '' }]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isDefaultOrTest =
        !document.title ||
        document.title.toLowerCase().trim() === 'test' ||
        document.title.toLowerCase().trim() === 'dokumen';
    const officialDocTitle = isDefaultOrTest
        ? 'SURAT KUASA KHUSUS & BERITA ACARA ELEKTRONIK'
        : document.title;

    const documentDisplayStatus = (() => {
        const pendingApproval = document.approvals?.find(
            (a) => a.status === 'pending',
        );
        if (pendingApproval) {
            return 'Dalam Review';
        }

        const statusMap: Record<string, string> = {
            draft: 'Draf Dokumen',
            active: 'Aktif',
            in_review: 'Dalam Review',
            under_review: 'Dalam Review',
            approved: 'Disetujui',
            final: 'Dokumen Final',
            signed: 'Ditandatangani',
            archived: 'Diarsipkan',
        };
        return statusMap[document.status] || document.status;
    })();

    const confidentialityDisplay = (() => {
        const confMap: Record<string, string> = {
            standard: 'Standar',
            confidential: 'Rahasia',
            restricted: 'Terbatas',
            private: 'Privat',
            internal: 'Internal',
        };
        return (
            confMap[document.confidentiality_level] ||
            document.confidentiality_level
        );
    })();

    const handleApproveSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!approvingApproval) return;
        setIsApproving(true);
        router.patch(
            approvalRoutes.resolve.url(approvingApproval.id),
            {
                approved: 1,
                note: approvalNote.trim() || null,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsApproving(false);
                    setApprovingApproval(null);
                    setApprovalNote('');
                },
            },
        );
    };

    const handleRevisionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!revisingApproval || !revisionNote.trim()) return;
        setIsRevising(true);
        router.patch(
            approvalRoutes.resolve.url(revisingApproval.id),
            {
                approved: 0,
                note: revisionNote.trim(),
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsRevising(false);
                    setRevisingApproval(null);
                    setRevisionNote('');
                },
            },
        );
    };

    return (
        <>
            <Head title={`Dokumen - ${document.title}`} />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* Legal Hold Warning Banner */}
                    {document.matter?.legal_hold_at && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
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

                    {/* 1. Executive Document Cockpit Hero (Matching sign.blade.php) */}
                    <section className="group relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eaf3ff] p-5 shadow-[0_10px_28px_rgba(71,85,105,0.075)] sm:p-6 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#18202b]">
                        {/* 1. Ambient Breathing Radial Glow */}
                        <div className="matters-hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_83%_38%,rgba(147,197,253,0.34),transparent_30%),radial-gradient(circle_at_65%_115%,rgba(251,191,36,0.12),transparent_27%)]" />

                        {/* 2. Drifting Micro-Dot Matrix Pattern */}
                        <div className="matters-hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-[480px] [background-image:radial-gradient(rgba(59,130,246,0.24)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [background-size:18px_18px] opacity-30 md:block" />

                        {/* 3. Animated Vector Wave Lines with Drop Shadow */}
                        <svg
                            viewBox="0 0 560 200"
                            aria-hidden="true"
                            className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[480px] text-white/90 drop-shadow-[0_0_8px_rgba(96,165,250,0.35)] md:block"
                        >
                            <path
                                d="M8 165 C95 94 176 178 270 108 S430 49 554 72"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                className="matters-hero-line"
                                pathLength={1}
                            />
                            <path
                                d="M55 192 C138 136 213 187 302 128 S442 84 558 99"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                className="matters-hero-line matters-hero-line-secondary opacity-55"
                                pathLength={1}
                            />
                            <circle
                                cx="270"
                                cy="108"
                                r="3.5"
                                fill="currentColor"
                            />
                            <circle
                                cx="430"
                                cy="49"
                                r="2.5"
                                fill="currentColor"
                            />
                        </svg>

                        {/* 4. Content Area: Official Document & Matter Dossier */}
                        <div className="relative z-10 space-y-4">
                            {/* Top Navigation & Action Buttons */}
                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                {/* Left: Back Link */}
                                <div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        asChild
                                        className="-ml-2 h-7.5 px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                                    >
                                        <Link href={documentRoutes.index.url()}>
                                            <ArrowLeft className="mr-1.5 size-3.5 text-slate-400" />
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
                                                className="h-7.5 rounded-lg border-slate-200/80 bg-white/90 px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-white dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            >
                                                <PenLine className="mr-1.5 size-3 text-slate-400" />
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
                                                className="h-7.5 rounded-lg border-slate-200/80 bg-white/90 px-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-white dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                            >
                                                <QrCode className="mr-1.5 size-3 text-purple-600 dark:text-purple-400" />
                                                E-Sign Internal
                                            </Button>
                                        )}

                                    {can.uploadVersion &&
                                        !document.matter?.legal_hold_at && (
                                            <Button
                                                size="sm"
                                                onClick={() => setOpen(true)}
                                                className="h-7.5 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-98 dark:bg-white dark:text-slate-950 dark:hover:bg-zinc-200"
                                            >
                                                <FileUp className="mr-1.5 size-3.5" />
                                                Versi Baru
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
                                                className="h-7.5 rounded-lg border-slate-200/80 bg-white/90 px-2.5 text-xs font-semibold text-rose-600 shadow-2xs hover:border-rose-200 hover:bg-rose-50 dark:border-white/10 dark:bg-zinc-800/80 dark:text-rose-400 dark:hover:bg-rose-950/20"
                                            >
                                                <Trash2 className="mr-1.5 size-3 text-rose-500" />
                                                Hapus
                                            </Button>
                                        )}
                                </div>
                            </div>

                            {/* Hairline Divider */}
                            <div className="border-t border-slate-200/70 dark:border-white/[0.08]" />

                            {/* Official Document & Matter Dossier */}
                            <div className="max-w-5xl">
                                {/* Matter Reference & Title */}
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    {document.matter ? (
                                        <>
                                            <Link
                                                href={matterRoutes.show.url(
                                                    document.matter.id,
                                                )}
                                                className="font-mono text-xs font-bold tracking-wider text-slate-900 uppercase transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                                            >
                                                {document.matter.matter_number}
                                            </Link>
                                            <span className="text-slate-300 dark:text-zinc-700">
                                                /
                                            </span>
                                            <Link
                                                href={matterRoutes.show.url(
                                                    document.matter.id,
                                                )}
                                                className="text-xs font-medium text-slate-600 transition-colors hover:text-blue-600 sm:text-sm dark:text-zinc-400 dark:hover:text-blue-400"
                                            >
                                                {document.matter.title}
                                            </Link>
                                        </>
                                    ) : document.client ? (
                                        <>
                                            <Link
                                                href={clientRoutes.show.url(
                                                    document.client.id,
                                                )}
                                                className="font-mono text-xs font-bold tracking-wider text-slate-900 uppercase transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                                            >
                                                {document.client.client_number}
                                            </Link>
                                            <span className="text-slate-300 dark:text-zinc-700">
                                                /
                                            </span>
                                            <Link
                                                href={clientRoutes.show.url(
                                                    document.client.id,
                                                )}
                                                className="text-xs font-medium text-slate-600 transition-colors hover:text-blue-600 sm:text-sm dark:text-zinc-400 dark:hover:text-blue-400"
                                            >
                                                {document.client.display_name}
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-mono text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-zinc-100">
                                                RPK LAW FIRM
                                            </span>
                                            <span className="text-slate-300 dark:text-zinc-700">
                                                /
                                            </span>
                                            <span className="text-xs font-medium text-slate-600 sm:text-sm dark:text-zinc-400">
                                                Dokumen Umum Firma
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Document Title */}
                                <h1 className="mt-2 text-xl leading-snug font-black tracking-tight text-slate-950 sm:text-2xl lg:text-[26px] dark:text-white">
                                    {officialDocTitle}
                                </h1>

                                {/* Compact Metadata Strip (Status, Akses, Versi & Ukuran, Pemilik) */}
                                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:gap-x-7">
                                    <div className="inline-flex items-center gap-1.5 leading-none">
                                        <span className="text-[10.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            Status:
                                        </span>
                                        <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                                            {documentDisplayStatus}
                                        </span>
                                    </div>

                                    <div className="inline-flex items-center gap-1.5 leading-none">
                                        <span className="text-[10.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            Akses:
                                        </span>
                                        <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                                            {confidentialityDisplay}
                                        </span>
                                    </div>

                                    <div className="inline-flex items-center gap-1.5 leading-none">
                                        <span className="text-[10.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            Versi:
                                        </span>
                                        <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                            v{selectedVersion.version_number}.0
                                            <span className="font-normal text-slate-400 dark:text-zinc-500">
                                                {' · '}
                                            </span>
                                            {formatBytes(
                                                selectedVersion.file_size,
                                            )}
                                            <span className="font-normal text-slate-400 dark:text-zinc-500">
                                                {' '}
                                                ({document.versions.length}{' '}
                                                Versi Tersimpan)
                                            </span>
                                        </span>
                                    </div>

                                    <div className="inline-flex items-center gap-1.5 leading-none">
                                        <span className="text-[10.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            Pemilik:
                                        </span>
                                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-800 dark:text-zinc-200">
                                            <Avatar className="size-4 shrink-0 rounded-full border border-slate-200/80 shadow-2xs dark:border-white/10">
                                                <AvatarImage
                                                    src={
                                                        document.creator
                                                            .avatar_url ??
                                                        (document.creator
                                                            .avatar_path
                                                            ? `/storage/${document.creator.avatar_path}`
                                                            : undefined)
                                                    }
                                                    alt={document.creator.name}
                                                />
                                                <AvatarFallback className="bg-slate-100 text-[8px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                    {getInitials(
                                                        document.creator.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{document.creator.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Document Preview Viewport Section with Unified Toolbar */}
                    {selectedVersion && (
                        <div
                            id="preview-viewport"
                            className="scroll-mt-6 overflow-hidden rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs sm:p-5 dark:border-white/[0.06] dark:bg-[#14161b]"
                        >
                            {/* Unified Inspector Toolbar */}
                            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                {/* Left: Clean specs & status in one horizontal line */}
                                <div className="flex min-w-0 flex-1 items-center gap-2 text-xs">
                                    <span className="shrink-0 font-mono font-bold text-slate-950 dark:text-white">
                                        v{selectedVersion.version_number}.0
                                    </span>
                                    <span className="shrink-0 text-slate-300 dark:text-zinc-700">
                                        ·
                                    </span>
                                    <span className="shrink-0 font-mono text-[11px] font-semibold text-slate-600 uppercase dark:text-zinc-300">
                                        {selectedVersion.mime_type
                                            .split('/')
                                            .pop()
                                            ?.toUpperCase() || 'BERKAS'}
                                    </span>
                                    <span className="shrink-0 text-slate-300 dark:text-zinc-700">
                                        ·
                                    </span>
                                    <StatusTextGroup
                                        values={[
                                            document.status,
                                            document.confidentiality_level,
                                        ]}
                                        className="shrink-0"
                                    />
                                    <span className="shrink-0 text-slate-300 dark:text-zinc-700">
                                        ·
                                    </span>
                                    <span className="shrink-0 font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                                        {formatBytes(selectedVersion.file_size)}
                                    </span>
                                    <span className="shrink-0 text-slate-300 dark:text-zinc-700">
                                        ·
                                    </span>
                                    <span
                                        className="max-w-[150px] truncate font-mono text-[11px] text-slate-400 sm:max-w-[200px] lg:max-w-xs dark:text-zinc-500"
                                        title={
                                            selectedVersion.original_filename
                                        }
                                    >
                                        {selectedVersion.original_filename}
                                    </span>
                                </div>

                                {/* Right: Uploader Avatar, Date & Download Action */}
                                <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
                                    <div
                                        className="flex items-center gap-2"
                                        title={`Pengunggah: ${selectedVersion.uploader.name} (${formatDate(selectedVersion.created_at, true)})`}
                                    >
                                        <Avatar className="size-6 shrink-0 rounded-full border border-slate-200/80 shadow-2xs dark:border-white/10">
                                            <AvatarImage
                                                src={
                                                    selectedVersion.uploader
                                                        .avatar_url ??
                                                    (selectedVersion.uploader
                                                        .avatar_path
                                                        ? `/storage/${selectedVersion.uploader.avatar_path}`
                                                        : undefined)
                                                }
                                            />
                                            <AvatarFallback className="bg-slate-100 text-[9px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                {getInitials(
                                                    selectedVersion.uploader
                                                        .name,
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden font-mono text-[11px] text-slate-400 sm:inline dark:text-zinc-500">
                                            {formatDate(
                                                selectedVersion.created_at,
                                                true,
                                            )}
                                        </span>
                                    </div>

                                    {can.download &&
                                        selectedVersion.scan_status !==
                                            'infected' && (
                                            <Button
                                                size="sm"
                                                className="h-7 rounded-lg bg-slate-950 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
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
                                                    <Download className="mr-1.5 size-3" />
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
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Approval &amp; Review Dokumen
                                </h3>
                                <span className="font-mono text-[11px] text-slate-400 dark:text-zinc-500">
                                    {document.approvals.length} Pengajuan
                                </span>
                            </div>

                            <div className="custom-scroll min-h-0 flex-1 space-y-2.5 overflow-y-auto pt-1 pr-1">
                                {document.approvals.length ? (
                                    document.approvals.map((approval) => {
                                        const isAssignedReviewer = Boolean(
                                            auth?.user?.id &&
                                            ((approval.reviewer?.id &&
                                                String(approval.reviewer.id) ===
                                                    String(auth.user.id)) ||
                                                (approval.reviewer_id &&
                                                    String(
                                                        approval.reviewer_id,
                                                    ) ===
                                                        String(auth.user.id))),
                                        );

                                        return (
                                            <div
                                                key={approval.id}
                                                className="space-y-2 rounded-lg border border-slate-200/80 bg-slate-50/50 p-3 text-xs dark:border-white/10 dark:bg-zinc-900/40"
                                            >
                                                {/* Top Row: Reviewer + Action buttons / Status badge */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <Avatar className="size-6 shrink-0 rounded-full border border-slate-200/80 shadow-2xs dark:border-white/10">
                                                            <AvatarImage
                                                                src={
                                                                    approval
                                                                        .reviewer
                                                                        .avatar_url ??
                                                                    (approval
                                                                        .reviewer
                                                                        .avatar_path
                                                                        ? `/storage/${approval.reviewer.avatar_path}`
                                                                        : undefined)
                                                                }
                                                                alt={
                                                                    approval
                                                                        .reviewer
                                                                        .name
                                                                }
                                                            />
                                                            <AvatarFallback className="bg-slate-100 text-[9px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                                {getInitials(
                                                                    approval
                                                                        .reviewer
                                                                        .name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                                Reviewer:{' '}
                                                                {
                                                                    approval
                                                                        .reviewer
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-1.5">
                                                        {approval.status ===
                                                            'pending' &&
                                                        isAssignedReviewer &&
                                                        can.approve ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setRevisingApproval(
                                                                            {
                                                                                id: approval.id,
                                                                                requesterName:
                                                                                    approval
                                                                                        .requester
                                                                                        ?.name ||
                                                                                    'Pemohon',
                                                                            },
                                                                        );
                                                                        setRevisionNote(
                                                                            '',
                                                                        );
                                                                    }}
                                                                    className="inline-flex h-6 items-center gap-1 rounded border border-slate-200 bg-white px-2 text-[10.5px] font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 active:scale-95 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                                                    title="Minta Revisi Dokumen"
                                                                >
                                                                    <RotateCcw className="size-2.5 text-amber-600 dark:text-amber-400" />
                                                                    <span>
                                                                        Minta
                                                                        Revisi
                                                                    </span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setApprovingApproval(
                                                                            {
                                                                                id: approval.id,
                                                                                requesterName:
                                                                                    approval
                                                                                        .requester
                                                                                        ?.name ||
                                                                                    'Pemohon',
                                                                            },
                                                                        );
                                                                        setApprovalNote(
                                                                            '',
                                                                        );
                                                                    }}
                                                                    className="inline-flex h-6 items-center gap-1 rounded bg-slate-900 px-2 text-[10.5px] font-bold text-white shadow-2xs transition-all hover:bg-black active:scale-95 dark:bg-white dark:text-slate-900"
                                                                    title="Setujui Dokumen"
                                                                >
                                                                    <Check className="size-2.5 text-emerald-400 dark:text-emerald-600" />
                                                                    <span>
                                                                        Setujui
                                                                    </span>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <StatusText
                                                                value={
                                                                    approval.status
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Meta Row: Diajukan oleh + Tanggal */}
                                                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                    <span>Diajukan oleh</span>
                                                    <Avatar className="size-4 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                        <AvatarImage
                                                            src={
                                                                approval
                                                                    .requester
                                                                    .avatar_url ??
                                                                (approval
                                                                    .requester
                                                                    .avatar_path
                                                                    ? `/storage/${approval.requester.avatar_path}`
                                                                    : undefined)
                                                            }
                                                            alt={
                                                                approval
                                                                    .requester
                                                                    .name
                                                            }
                                                        />
                                                        <AvatarFallback className="bg-slate-100 text-[7px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                            {getInitials(
                                                                approval
                                                                    .requester
                                                                    .name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <strong className="text-slate-700 dark:text-zinc-300">
                                                        {
                                                            approval.requester
                                                                .name
                                                        }
                                                    </strong>
                                                    {approval.created_at && (
                                                        <>
                                                            <span className="text-slate-300 dark:text-zinc-700">
                                                                ·
                                                            </span>
                                                            <span>
                                                                {formatDate(
                                                                    approval.created_at,
                                                                    true,
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                    {approval.status ===
                                                        'pending' &&
                                                        (!isAssignedReviewer ||
                                                            !can.approve) && (
                                                            <>
                                                                <span className="text-slate-300 dark:text-zinc-700">
                                                                    ·
                                                                </span>
                                                                <span className="font-medium text-amber-600 dark:text-amber-400">
                                                                    Menunggu
                                                                    keputusan
                                                                </span>
                                                            </>
                                                        )}
                                                </div>

                                                {/* Notes (if any) */}
                                                {approval.request_note && (
                                                    <div className="rounded border border-slate-200/60 bg-white/80 p-2 text-[11px] text-slate-600 dark:border-white/5 dark:bg-zinc-800/40 dark:text-zinc-300">
                                                        <span className="font-medium text-slate-500 dark:text-zinc-400">
                                                            Pesan:{' '}
                                                        </span>
                                                        &ldquo;
                                                        {approval.request_note}
                                                        &rdquo;
                                                    </div>
                                                )}
                                                {approval.resolution_note && (
                                                    <div className="rounded border border-slate-200/60 bg-white/80 p-2 text-[11px] font-medium text-slate-700 dark:border-white/5 dark:bg-zinc-800/40 dark:text-zinc-300">
                                                        Catatan:{' '}
                                                        {
                                                            approval.resolution_note
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
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
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Riwayat &amp; Log Seluruh Versi
                                </h3>
                                <span className="font-mono text-[11px] text-slate-400 dark:text-zinc-500">
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
                                                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                                                            · Terkini
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
                                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                                <span>Oleh</span>
                                                <Avatar className="size-4 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                    <AvatarImage
                                                        src={
                                                            v.uploader
                                                                .avatar_url ??
                                                            (v.uploader
                                                                .avatar_path
                                                                ? `/storage/${v.uploader.avatar_path}`
                                                                : undefined)
                                                        }
                                                        alt={v.uploader.name}
                                                    />
                                                    <AvatarFallback className="bg-slate-100 text-[7px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                        {getInitials(
                                                            v.uploader.name,
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <strong className="text-slate-700 dark:text-zinc-300">
                                                    {v.uploader.name}
                                                </strong>
                                                <span className="text-slate-300 dark:text-zinc-700">
                                                    ·
                                                </span>
                                                <span>
                                                    {formatDate(
                                                        v.created_at,
                                                        true,
                                                    )}
                                                </span>
                                                <span className="text-slate-300 dark:text-zinc-700">
                                                    ·
                                                </span>
                                                <span>
                                                    {formatBytes(v.file_size)}
                                                </span>
                                            </div>
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
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Penerimaan &amp; Verifikasi E-Sign
                                </h3>
                                <span className="font-mono text-[11px] text-slate-400 dark:text-zinc-500">
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
                                                {/* Header Row: Code + Status */}
                                                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200/60 pb-2 dark:border-white/5">
                                                    <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                                                        Kode:{' '}
                                                        {
                                                            request.verification_code
                                                        }
                                                    </span>
                                                    <StatusText
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
                                                        (s, idx) => {
                                                            const staff =
                                                                s.email
                                                                    ? staffByEmail.get(
                                                                          s.email.toLowerCase(),
                                                                      )
                                                                    : undefined;
                                                            const isCurrentUserSigner =
                                                                Boolean(
                                                                    auth?.user &&
                                                                    ((s.email &&
                                                                        auth
                                                                            .user
                                                                            .email &&
                                                                        s.email
                                                                            .toLowerCase()
                                                                            .trim() ===
                                                                            auth.user.email
                                                                                .toLowerCase()
                                                                                .trim()) ||
                                                                        (staff &&
                                                                            String(
                                                                                staff.id,
                                                                            ) ===
                                                                                String(
                                                                                    auth
                                                                                        .user
                                                                                        .id,
                                                                                )) ||
                                                                        (s.name &&
                                                                            auth
                                                                                .user
                                                                                .name &&
                                                                            s.name
                                                                                .toLowerCase()
                                                                                .trim() ===
                                                                                auth.user.name
                                                                                    .toLowerCase()
                                                                                    .trim())),
                                                                );

                                                            return (
                                                                <div
                                                                    key={
                                                                        s.id ||
                                                                        idx
                                                                    }
                                                                    className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-white p-2 shadow-2xs dark:border-white/10 dark:bg-[#14161b]"
                                                                >
                                                                    <div className="relative shrink-0">
                                                                        <Avatar className="size-6.5 rounded-full border border-slate-200/80 shadow-2xs dark:border-white/10">
                                                                            <AvatarImage
                                                                                src={
                                                                                    staff?.avatar_path
                                                                                        ? `/storage/${staff.avatar_path}`
                                                                                        : undefined
                                                                                }
                                                                                alt={
                                                                                    s.name
                                                                                }
                                                                            />
                                                                            <AvatarFallback className="bg-slate-100 text-[9px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                                                                                {getInitials(
                                                                                    s.name,
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <span className="absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full bg-slate-900 text-[8px] font-bold text-white shadow-2xs dark:bg-zinc-700">
                                                                            {idx +
                                                                                1}
                                                                        </span>
                                                                    </div>
                                                                    <div className="space-y-0.2 min-w-0 flex-1">
                                                                        <p className="truncate text-[11px] font-bold text-slate-900 dark:text-white">
                                                                            {
                                                                                s.name
                                                                            }
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
                                                                                {isCurrentUserSigner && (
                                                                                    <a
                                                                                        href={`/sign/${s.signing_token}`}
                                                                                        target="_blank"
                                                                                        rel="noreferrer"
                                                                                        className="inline-flex h-5.5 items-center justify-center gap-0.5 rounded bg-slate-900 px-1.5 text-[10px] font-bold text-white shadow-2xs transition-all hover:bg-black active:scale-95 dark:bg-white dark:text-slate-900"
                                                                                    >
                                                                                        <PenLine className="size-2" />
                                                                                        TTD
                                                                                    </a>
                                                                                )}
                                                                                {(can.signature ||
                                                                                    isCurrentUserSigner) && (
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
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            );
                                                        },
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
                onOpenChange={(value) => {
                    if (!value) {
                        setWorkflowOpen(null);
                        setSelectedReviewerId('');
                    }
                }}
            >
                <DialogContent className="max-h-[85vh] w-full max-w-[calc(100%-2rem)] min-w-0 overflow-x-hidden overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
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
                        className="w-full min-w-0 space-y-3.5 pt-1"
                        onSuccess={() => {
                            setWorkflowOpen(null);
                            setSelectedReviewerId('');
                        }}
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid min-w-0 gap-1">
                                    <Label
                                        htmlFor="reviewer_id"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                                    >
                                        Pilih Reviewer *
                                    </Label>
                                    <input
                                        type="hidden"
                                        name="reviewer_id"
                                        value={selectedReviewerId}
                                    />
                                    <UserPicker
                                        id="reviewer_id"
                                        value={selectedReviewerId}
                                        onChange={setSelectedReviewerId}
                                        users={reviewers}
                                        placeholder="Pilih Reviewer..."
                                        error={Boolean(errors.reviewer_id)}
                                    />
                                    <InputError message={errors.reviewer_id} />
                                </div>

                                <div className="grid min-w-0 gap-1">
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
                                        className="w-full max-w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                    <InputError message={errors.note} />
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setWorkflowOpen(null);
                                            setSelectedReviewerId('');
                                        }}
                                        className="h-8 rounded-lg border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        disabled={
                                            processing || !selectedReviewerId
                                        }
                                        className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95 disabled:opacity-50"
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

            {/* Modal: Setujui Dokumen */}
            <Dialog
                open={approvingApproval !== null}
                onOpenChange={(isOpen) => {
                    if (!isOpen && !isApproving) {
                        setApprovingApproval(null);
                        setApprovalNote('');
                    }
                }}
            >
                <DialogContent className={financeDialogPanelClass('compact')}>
                    <FinanceDialogHeader
                        icon={CheckCircle2}
                        eyebrow="Approval Dokumen"
                        title="Setujui Dokumen"
                        description={`Konfirmasi persetujuan dokumen yang diajukan oleh ${approvingApproval?.requesterName || 'pemohon'}.`}
                    />

                    <form
                        onSubmit={handleApproveSubmit}
                        className="space-y-4 pt-1 text-xs"
                    >
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-white/[0.06] dark:bg-[#16181f]">
                            <div className="min-w-0">
                                <span className="block truncate text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                    {document.title}
                                </span>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                    Status berkas akan diperbarui menjadi
                                    disetujui (Approved).
                                </p>
                            </div>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                <FileCheck className="size-4" />
                            </div>
                        </div>

                        <div>
                            <Label
                                htmlFor="approve-note"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Catatan Persetujuan (Opsional)
                            </Label>
                            <textarea
                                id="approve-note"
                                rows={3}
                                value={approvalNote}
                                onChange={(e) =>
                                    setApprovalNote(e.target.value)
                                }
                                placeholder="Tambahkan catatan persetujuan jika diperlukan..."
                                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                        </div>

                        <FinanceDialogFooter
                            onCancel={() => {
                                setApprovingApproval(null);
                                setApprovalNote('');
                            }}
                            processing={isApproving}
                            submitLabel="Setujui Dokumen"
                            processingLabel="Menyetujui..."
                            tone="primary"
                            className="-mx-5 -mb-4 sm:-mx-6 sm:px-6"
                        />
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Minta Revisi Dokumen */}
            <Dialog
                open={revisingApproval !== null}
                onOpenChange={(isOpen) => {
                    if (!isOpen && !isRevising) {
                        setRevisingApproval(null);
                        setRevisionNote('');
                    }
                }}
            >
                <DialogContent className={financeDialogPanelClass('compact')}>
                    <FinanceDialogHeader
                        icon={AlertTriangle}
                        eyebrow="Approval Dokumen"
                        title="Permintaan Revisi Dokumen"
                        description={`Kembalikan berkas ke ${revisingApproval?.requesterName || 'pemohon'} disertai instruksi poin revisi.`}
                    />

                    <form
                        onSubmit={handleRevisionSubmit}
                        className="space-y-4 pt-1 text-xs"
                    >
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-white/[0.06] dark:bg-[#16181f]">
                            <div className="min-w-0">
                                <span className="block truncate text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                    {document.title}
                                </span>
                                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                                    Status berkas akan menjadi Perlu Revisi
                                    (Revision Requested).
                                </p>
                            </div>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                <FileClock className="size-4" />
                            </div>
                        </div>

                        <div>
                            <Label
                                htmlFor="revision-note"
                                className="text-xs font-semibold text-slate-700 dark:text-zinc-200"
                            >
                                Catatan / Poin Revisi{' '}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <textarea
                                id="revision-note"
                                rows={3}
                                required
                                value={revisionNote}
                                onChange={(e) =>
                                    setRevisionNote(e.target.value)
                                }
                                placeholder="Jelaskan pasal, klausul, atau halaman yang memerlukan perbaikan dari pemohon..."
                                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:border-white/10 dark:bg-[#121418] dark:text-white"
                            />
                            <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                                Catatan ini akan dikirimkan langsung ke pemohon
                                review.
                            </p>
                        </div>

                        <FinanceDialogFooter
                            onCancel={() => {
                                setRevisingApproval(null);
                                setRevisionNote('');
                            }}
                            processing={isRevising}
                            disabled={!revisionNote.trim()}
                            submitLabel="Kirim Permintaan Revisi"
                            processingLabel="Mengirim..."
                            tone="primary"
                            className="-mx-5 -mb-4 sm:-mx-6 sm:px-6"
                        />
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal: Kirim E-Sign Internal */}
            <Dialog
                open={workflowOpen === 'signature'}
                onOpenChange={(value) => !value && setWorkflowOpen(null)}
            >
                <DialogContent className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] min-w-0 overflow-x-hidden overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="min-w-0 border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-zinc-100">
                                <ShieldCheck className="size-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <DialogTitle className="truncate text-base font-bold text-slate-900 dark:text-white">
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
                        className="w-full min-w-0 space-y-4 pt-1"
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
                                <div className="grid w-full min-w-0 gap-2 rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 dark:border-white/10 dark:bg-zinc-800/40">
                                    <div className="flex min-w-0 items-center justify-between gap-2">
                                        <Label
                                            htmlFor="document_version_id"
                                            className="flex items-center gap-1.5 truncate text-xs font-bold text-slate-800 dark:text-zinc-100"
                                        >
                                            <FileText className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                            Pilih Versi Berkas E-Sign *
                                        </Label>
                                        <span className="shrink-0 font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                            {document.versions.length} Versi
                                        </span>
                                    </div>

                                    <div className="relative w-full min-w-0">
                                        <select
                                            id="document_version_id"
                                            name="document_version_id"
                                            value={signingVersionId}
                                            onChange={(e) =>
                                                setSigningVersionId(
                                                    e.target.value,
                                                )
                                            }
                                            className="h-9 w-full max-w-full min-w-0 cursor-pointer appearance-none truncate rounded-lg border border-slate-200 bg-white pr-8 pl-3 text-xs font-medium text-slate-900 outline-none hover:bg-slate-50 focus:border-slate-900 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        >
                                            {document.versions.map((ver) => {
                                                const shortFilename =
                                                    ver.original_filename
                                                        .length > 40
                                                        ? ver.original_filename.slice(
                                                              0,
                                                              37,
                                                          ) + '...'
                                                        : ver.original_filename;
                                                return (
                                                    <option
                                                        key={ver.id}
                                                        value={ver.id}
                                                        title={
                                                            ver.original_filename
                                                        }
                                                    >
                                                        Versi #
                                                        {ver.version_number} —{' '}
                                                        {shortFilename} (
                                                        {formatBytes(
                                                            ver.file_size,
                                                        )}{' '}
                                                        ·{' '}
                                                        {formatDate(
                                                            ver.created_at,
                                                        )}
                                                        )
                                                    </option>
                                                );
                                            })}
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
                                            <div className="w-full min-w-0 rounded-lg border border-blue-200/70 bg-blue-50/70 p-3 text-[11px] text-blue-950 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200">
                                                <div className="flex min-w-0 items-center justify-between gap-2">
                                                    <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                                        <span className="shrink-0 font-mono font-bold text-blue-700 dark:text-blue-300">
                                                            v{v.version_number}
                                                        </span>
                                                        <span className="shrink-0 text-blue-400 dark:text-blue-600">
                                                            ·
                                                        </span>
                                                        <span
                                                            className="min-w-0 flex-1 truncate font-semibold text-slate-900 dark:text-white"
                                                            title={
                                                                v.original_filename
                                                            }
                                                        >
                                                            {
                                                                v.original_filename
                                                            }
                                                        </span>
                                                    </div>
                                                    <span className="shrink-0 rounded bg-blue-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                                                        Terpilih
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500 dark:text-zinc-400">
                                                    <span>
                                                        Oleh{' '}
                                                        {v.uploader?.name ||
                                                            'Staf'}
                                                    </span>
                                                    <span>·</span>
                                                    <span>
                                                        {formatBytes(
                                                            v.file_size,
                                                        )}
                                                    </span>
                                                    <span>·</span>
                                                    <span>
                                                        {formatDate(
                                                            v.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                                {v.notes && (
                                                    <div className="mt-2 rounded-md border border-blue-100 bg-white/80 p-2 text-[11px] text-slate-700 dark:border-white/5 dark:bg-zinc-900/60 dark:text-zinc-300">
                                                        <span className="line-clamp-2 break-words text-slate-600 dark:text-zinc-300">
                                                            "{v.notes}"
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                    <InputError
                                        message={
                                            (errors as any).document_version_id
                                        }
                                    />
                                </div>

                                <input
                                    type="hidden"
                                    name="mode"
                                    value="parallel"
                                />

                                <div className="w-full min-w-0 space-y-3">
                                    <div className="flex min-w-0 items-center justify-between gap-2">
                                        <Label className="truncate text-xs font-bold text-slate-700 dark:text-zinc-200">
                                            Daftar Pihak Penandatangan
                                        </Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            className="h-7 shrink-0 rounded-lg border-slate-200 px-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-200"
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

                                    <div className="w-full min-w-0 space-y-3">
                                        {signers.map((signer, index) => (
                                            <div
                                                key={index}
                                                className="flex w-full min-w-0 flex-col gap-2.5 rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 dark:border-white/10 dark:bg-zinc-800/40"
                                            >
                                                <div className="flex min-w-0 items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                                                    <span className="flex items-center gap-1.5 truncate text-xs font-bold text-slate-800 dark:text-zinc-100">
                                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-[10px] font-bold text-white">
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
                                                            className="shrink-0 cursor-pointer text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                                                        >
                                                            Hapus Pihak Ini
                                                        </button>
                                                    )}
                                                </div>

                                                {firmStaff.length > 0 && (
                                                    <div className="w-full min-w-0 space-y-1">
                                                        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                            Pilih dari Anggota
                                                            Tim RPK
                                                        </span>
                                                        <div className="w-full min-w-0">
                                                            <UserPicker
                                                                users={
                                                                    firmStaff as UserOption[]
                                                                }
                                                                value={(() => {
                                                                    const matched =
                                                                        firmStaff.find(
                                                                            (
                                                                                s,
                                                                            ) =>
                                                                                s.email &&
                                                                                signer.email &&
                                                                                s.email.toLowerCase() ===
                                                                                    signer.email.toLowerCase(),
                                                                        );
                                                                    return matched
                                                                        ? String(
                                                                              matched.id,
                                                                          )
                                                                        : '';
                                                                })()}
                                                                onChange={(
                                                                    selectedId,
                                                                ) => {
                                                                    if (
                                                                        !selectedId
                                                                    ) {
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
                                                                                                  name: '',
                                                                                                  email: '',
                                                                                              }
                                                                                            : item,
                                                                                ),
                                                                        );
                                                                        return;
                                                                    }
                                                                    const staff =
                                                                        firmStaff.find(
                                                                            (
                                                                                s,
                                                                            ) =>
                                                                                String(
                                                                                    s.id,
                                                                                ) ===
                                                                                String(
                                                                                    selectedId,
                                                                                ),
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
                                                                placeholder="Pilih Staf / Partner Firma..."
                                                                allowClear
                                                                disabledUserIds={
                                                                    signers
                                                                        .filter(
                                                                            (
                                                                                _,
                                                                                i,
                                                                            ) =>
                                                                                i !==
                                                                                index,
                                                                        )
                                                                        .map(
                                                                            (
                                                                                other,
                                                                            ) => {
                                                                                const matched =
                                                                                    firmStaff.find(
                                                                                        (
                                                                                            s,
                                                                                        ) =>
                                                                                            s.email &&
                                                                                            other.email &&
                                                                                            s.email.toLowerCase() ===
                                                                                                other.email.toLowerCase(),
                                                                                    );
                                                                                return matched
                                                                                    ? String(
                                                                                          matched.id,
                                                                                      )
                                                                                    : null;
                                                                            },
                                                                        )
                                                                        .filter(
                                                                            Boolean,
                                                                        ) as string[]
                                                                }
                                                                disabledReason="Sudah dipilih pada pihak lain"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid w-full min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2">
                                                    <div className="min-w-0 space-y-1">
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
                                                            className="h-8 w-full min-w-0 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
                                                        />
                                                    </div>

                                                    <div className="min-w-0 space-y-1">
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
                                                            className="h-8 w-full min-w-0 rounded-lg border-slate-200 bg-white text-xs dark:border-white/10 dark:bg-[#121418]"
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
            <DialogContent className="max-h-[85vh] w-full max-w-[calc(100%-2rem)] min-w-0 overflow-x-hidden overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-md dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="min-w-0 border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <DialogTitle className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        Unggah Versi Dokumen Baru
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                        Versi sebelumnya tetap tersimpan utuh dalam audit log.
                    </DialogDescription>
                </DialogHeader>

                {Object.keys(errors).length > 0 && (
                    <div className="my-2 min-w-0 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                        <div className="flex min-w-0 items-center gap-2 font-bold">
                            <ShieldAlert className="size-4 shrink-0 text-rose-600" />
                            <span className="truncate">
                                Gagal mengunggah versi baru:
                            </span>
                        </div>
                        <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-[11px] break-words">
                            {Object.entries(errors).map(([key, msg]) => (
                                <li key={key}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="w-full min-w-0 space-y-3.5 pt-1"
                >
                    <div className="grid w-full min-w-0 gap-1">
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

                    <div className="grid w-full min-w-0 gap-1">
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
                            className="w-full max-w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
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
