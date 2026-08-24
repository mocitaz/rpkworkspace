import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronDown,
    Copy,
    FileCheck,
    FileCode,
    FilePlus,
    FileSpreadsheet,
    FileText,
    FileUp,
    FolderKanban,
    Layers,
    Plus,
    Search,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Upload,
    Wand2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
import * as documentRoutes from '@/routes/documents';
import * as matterRoutes from '@/routes/matters';

type DocumentTemplate = {
    id: string;
    name: string;
    document_type: string;
    original_filename: string;
    placeholders: string[] | Record<string, string> | null;
    status: 'active' | 'inactive';
    scan_status: 'clean' | 'infected' | 'pending' | 'unscanned';
    scan_message?: string;
    version: number;
    created_at: string;
    creator?: { id: number; name: string };
};

type Matter = {
    id: string;
    matter_number: string;
    title: string;
};

const typeLabels: Record<string, string> = {
    power_of_attorney: 'Surat Kuasa Khusus',
    contract: 'Perjanjian & Kontrak Bisnis',
    pleading: 'Gugatan & Jawaban Gugatan',
    legal_opinion: 'Legal Opinion / Pendapat Hukum',
    somasi: 'Somasi & Teguran Hukum',
    nda: 'Non-Disclosure Agreement (NDA)',
    engagement_letter: 'Surat Penawaran Jasa Hukum',
    other: 'Format Dokumen Hukum Lainnya',
};

export default function TemplatesIndex({
    templates,
    matters,
    metrics,
    can,
}: {
    templates: DocumentTemplate[];
    matters: Matter[];
    metrics: {
        total: number;
        active: number;
        clean_scanned: number;
        types_count: number;
    };
    can: { manage: boolean };
}) {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [generatingTemplate, setGeneratingTemplate] = useState<DocumentTemplate | null>(null);
    const [uploading, setUploading] = useState(false);

    const filteredTemplates = useMemo(() => {
        return templates.filter((tpl) => {
            const matchesSearch =
                tpl.name.toLowerCase().includes(search.toLowerCase()) ||
                tpl.original_filename.toLowerCase().includes(search.toLowerCase());
            const matchesType = selectedType === 'all' || tpl.document_type === selectedType;
            return matchesSearch && matchesType;
        });
    }, [templates, search, selectedType]);

    return (
        <>
            <Head title="Smart Legal Drafting — Template Dokumen Hukum" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8">
                    {/* Header Cockpit */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                    SMART DRAFTING ENGINE
                                </span>
                                <span className="text-slate-300 dark:text-zinc-700">•</span>
                                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                                    DOCX Variable Replacement
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Template &amp; Generator Dokumen Hukum
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Standardisasi draf gugatan, surat kuasa, somasi, dan kontrak bisnis dengan substitusi placeholder dinamis.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                asChild
                            >
                                <Link href={documentRoutes.index()}>
                                    <ArrowLeft className="mr-1 size-3 text-slate-400" />
                                    Repositori Dokumen
                                </Link>
                            </Button>

                            {can.manage && (
                                <Button
                                    size="sm"
                                    onClick={() => setUploading(true)}
                                    className="h-8 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
                                >
                                    <FileUp className="mr-1 size-3.5" />
                                    Unggah Template DOCX
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Bento Metrics */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold uppercase">Total Template</span>
                                <Layers className="size-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {metrics.total}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-400">Semua versi template terdaftar</p>
                        </div>

                        <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold uppercase">Template Aktif</span>
                                <FileCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {metrics.active}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-400">Siap dipakai drafting</p>
                        </div>

                        <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold uppercase">Lolos Pemindaian</span>
                                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {metrics.clean_scanned}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-400">Bebas makro &amp; malware</p>
                        </div>

                        <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400">
                                <span className="text-[11px] font-semibold uppercase">Kategori Dokumen</span>
                                <FolderKanban className="size-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {metrics.types_count}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate-400">Variasi jenis instrumen</p>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col gap-3 rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.06] dark:bg-[#14161b]">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama template atau berkas DOCX..."
                                className="h-8 pl-8 text-xs border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-[#121418]"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative min-w-[200px]">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/60 pr-8 pl-3 text-xs font-medium text-slate-700 outline-hidden hover:bg-slate-100 focus:border-blue-600 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                >
                                    <option value="all">Semua Kategori ({templates.length})</option>
                                    {Object.entries(typeLabels).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    {/* Template Grid */}
                    {filteredTemplates.length ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredTemplates.map((tpl) => {
                                const placeholdersList: string[] = Array.isArray(tpl.placeholders)
                                    ? tpl.placeholders
                                    : tpl.placeholders
                                      ? Object.keys(tpl.placeholders)
                                      : [];

                                return (
                                    <div
                                        key={tpl.id}
                                        className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all hover:border-blue-200 hover:shadow-md dark:border-white/[0.06] dark:bg-[#14161b] dark:hover:border-blue-900/50"
                                    >
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                                    {typeLabels[tpl.document_type] ?? tpl.document_type}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="rounded bg-slate-100 px-1.5 py-0.2 font-mono text-[9px] font-bold text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                                                        v{tpl.version}
                                                    </span>
                                                    {tpl.scan_status === 'clean' ? (
                                                        <span title="Lolos Scan Malware">
                                                            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                        </span>
                                                    ) : (
                                                        <span title="Pemindaian Berjalan">
                                                            <ShieldAlert className="size-3.5 text-amber-500" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {tpl.name}
                                                </h3>
                                                <p className="mt-0.5 font-mono text-[10px] text-slate-400 truncate">
                                                    {tpl.original_filename}
                                                </p>
                                            </div>

                                            {/* Variable Chips */}
                                            <div className="space-y-1 pt-1">
                                                <span className="text-[10px] font-semibold uppercase text-slate-400">
                                                    Variabel Tersedia ({placeholdersList.length}):
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {placeholdersList.slice(0, 4).map((p, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="rounded border border-slate-200/80 bg-slate-50 px-1.5 py-0.2 font-mono text-[9px] text-slate-600 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-300"
                                                        >
                                                            {`{{${p}}}`}
                                                        </span>
                                                    ))}
                                                    {placeholdersList.length > 4 && (
                                                        <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-medium text-slate-500 dark:bg-white/5">
                                                            +{placeholdersList.length - 4} lainnya
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/[0.04]">
                                            <span className="text-[10px] text-slate-400">
                                                Oleh {tpl.creator?.name ?? 'Admin'}
                                            </span>

                                            <Button
                                                size="sm"
                                                disabled={tpl.status !== 'active' || tpl.scan_status !== 'clean'}
                                                onClick={() => setGeneratingTemplate(tpl)}
                                                className="h-7 cursor-pointer rounded-lg bg-blue-600 px-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
                                            >
                                                <Wand2 className="mr-1 size-3" />
                                                Draft Perkara
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-[#14161b]">
                            <FileText className="size-10 text-slate-300 dark:text-zinc-600" />
                            <h3 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
                                Belum ada template yang sesuai
                            </h3>
                            <p className="mt-1 max-w-sm text-[11px] text-slate-400">
                                Unggah berkas Microsoft Word (.docx) dengan tag placeholder seperti {'{{NAMA_KLIEN}}'} untuk membuat generator dokumen otomatis.
                            </p>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Generator Drafting */}
            {generatingTemplate && (
                <GenerateModal
                    template={generatingTemplate}
                    matters={matters}
                    onClose={() => setGeneratingTemplate(null)}
                />
            )}

            {/* Modal Upload Template Baru */}
            {uploading && (
                <UploadModal onClose={() => setUploading(false)} />
            )}
        </>
    );
}

function GenerateModal({
    template,
    matters,
    onClose,
}: {
    template: DocumentTemplate;
    matters: Matter[];
    onClose: () => void;
}) {
    const placeholdersList: string[] = Array.isArray(template.placeholders)
        ? template.placeholders
        : template.placeholders
          ? Object.keys(template.placeholders)
          : [];

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl sm:max-w-2xl lg:max-w-3xl dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <Wand2 className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                Generate Draf Dokumen dari Template
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Template: <span className="font-semibold text-slate-800 dark:text-zinc-200">{template.name}</span> ({template.original_filename})
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    action={`/templates/${template.id}/generate`}
                    method="post"
                    className="space-y-4 pt-1"
                    onSuccess={onClose}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-3.5 sm:grid-cols-2">
                                <div className="grid gap-1">
                                    <Label htmlFor="matter_id" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Pilih Perkara Terkait <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <select
                                            name="matter_id"
                                            id="matter_id"
                                            required
                                            className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                        >
                                            <option value="">-- Pilih Perkara --</option>
                                            {matters.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.matter_number} — {m.title}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    {errors.matter_id && (
                                        <p className="text-xs text-rose-500">{errors.matter_id}</p>
                                    )}
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="title" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Nama / Judul Dokumen Hasil <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        required
                                        defaultValue={template.name}
                                        className="h-8.5 rounded-xl border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-rose-500">{errors.title}</p>
                                    )}
                                </div>
                            </div>

                            {placeholdersList.length > 0 && (
                                <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-white/[0.04] dark:bg-[#121418]">
                                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-white/[0.04]">
                                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider dark:text-zinc-200">
                                            Pengisian Substitusi Variabel ({placeholdersList.length})
                                        </span>
                                        <span className="text-[11px] text-slate-400">
                                            Otomatis menggantikan tag pada DOCX
                                        </span>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {placeholdersList.map((ph) => (
                                            <div key={ph} className="grid gap-1">
                                                <Label htmlFor={`ph_${ph}`} className="font-mono text-[10.5px] font-bold text-blue-600 dark:text-blue-400">
                                                    {`{{${ph}}}`}
                                                </Label>
                                                <Input
                                                    id={`ph_${ph}`}
                                                    name={`placeholders[${ph}]`}
                                                    placeholder={`Nilai untuk {{${ph}}}...`}
                                                    className="h-8 rounded-lg border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 dark:border-white/10 dark:bg-[#16181d] dark:text-white"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {Object.keys(errors).length > 0 && (
                                <p className="text-xs font-medium text-rose-600">
                                    {Object.values(errors).join(' ')}
                                </p>
                            )}

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8.5 rounded-xl border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="h-8.5 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:text-white"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3" />
                                            Memproses Draf...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-1.5 size-3.5" />
                                            Hasilkan Dokumen
                                        </>
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

function UploadModal({ onClose }: { onClose: () => void }) {
    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl sm:max-w-2xl lg:max-w-3xl dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <FileUp className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                Unggah Template Dokumen DOCX
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Berkas Microsoft Word (.docx) dengan tag placeholder {'{{VARIABLE_NAME}}'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form action="/templates" method="post" className="space-y-4 pt-1" onSuccess={onClose}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-3.5 sm:grid-cols-2">
                                <div className="grid gap-1">
                                    <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Nama Template <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        placeholder="Contoh: Surat Kuasa Khusus Litigasi Perdata"
                                        className="h-8.5 rounded-xl border-slate-200 bg-slate-50/70 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-rose-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="document_type" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Kategori Instrumen Hukum <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <select
                                            name="document_type"
                                            id="document_type"
                                            defaultValue="power_of_attorney"
                                            className="h-8.5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                        >
                                            {Object.entries(typeLabels).map(([k, v]) => (
                                                <option key={k} value={k}>
                                                    {v}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-slate-400" />
                                    </div>
                                    {errors.document_type && (
                                        <p className="text-xs text-rose-500">{errors.document_type}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="file" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                    Pilih Berkas DOCX (.docx) <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    required
                                    className="h-9.5 cursor-pointer rounded-xl border-slate-200 bg-slate-50/70 text-xs text-slate-900 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800 dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                                {errors.file && (
                                    <p className="text-xs text-rose-500">{errors.file}</p>
                                )}
                            </div>

                            {Object.keys(errors).length > 0 && (
                                <p className="text-xs font-medium text-rose-600">
                                    {Object.values(errors).join(' ')}
                                </p>
                            )}

                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onClose}
                                    className="h-8.5 rounded-xl border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    className="h-8.5 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95 dark:bg-blue-500 dark:text-white"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3" />
                                            Mengunggah...
                                        </>
                                    ) : (
                                        'Simpan Template'
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

TemplatesIndex.layout = {
    breadcrumbs: [
        { title: 'Dokumen', href: documentRoutes.index() },
        { title: 'Template Hukum', href: '#' },
    ],
};
