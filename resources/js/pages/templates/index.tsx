import { Form, Head } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronDown,
    Copy,
    FileCheck,
    FilePlus2,
    FileText,
    Files,
    Layers,
    Pencil,
    Plus,
    RefreshCw,
    ShieldAlert,
    ShieldCheck,
    WandSparkles,
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
import * as templateRoutes from '@/routes/templates';
import templateVersionRoutes from '@/routes/templates/versions';

type Template = {
    id: string;
    name: string;
    document_type?: string;
    original_filename: string;
    placeholders?: string[];
    status: string;
    scan_status: string;
    scan_message?: string;
    version: number;
    creator: { name: string };
};

type Matter = {
    id: string;
    matter_number: string;
    title: string;
};

export default function TemplateIndex({
    templates,
    matters,
    metrics,
    can,
}: {
    templates: Template[];
    matters: Matter[];
    metrics: {
        total: number;
        active: number;
        clean_scanned: number;
        types_count: number;
    };
    can: { manage: boolean };
}) {
    const [upload, setUpload] = useState(false);
    const [generate, setGenerate] = useState<Template | null>(null);
    const [edit, setEdit] = useState<Template | null>(null);
    const [version, setVersion] = useState<Template | null>(null);

    return (
        <>
            <Head title="Template Dokumen Legal (DOCX)" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Header Minimalist Notion */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Template Dokumen Legal (DOCX)
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Standardisasi draf kontrak, surat kuasa, dan gugatan dengan placeholder dinamis {'{{client.name}}'} dan otomasi pembuatan berkas.
                            </p>
                        </div>

                        {/* Right: Actions */}
                        {can.manage && (
                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    onClick={() => setUpload(true)}
                                    className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                >
                                    <FilePlus2 className="mr-1.5 size-3.5" />
                                    Unggah Template DOCX
                                </Button>
                            </div>
                        )}
                    </header>

                    {/* Compact 4-Column Stat Strips (h-[76px]) */}
                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* 1. Total Template */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Total Koleksi Template</span>
                                <Files className="size-3.5 text-[#1f6c9f] dark:text-sky-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                    {metrics.total} Master File
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    standar firma
                                </span>
                            </div>
                        </div>

                        {/* 2. Template Aktif */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Siap Digenerate</span>
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {metrics.active} Aktif
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    siap perkara
                                </span>
                            </div>
                        </div>

                        {/* 3. Lolos Scan Antivirus */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Terverifikasi Bersih</span>
                                <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-purple-600 dark:text-purple-400">
                                    {metrics.clean_scanned} Terpindai
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    bebas virus/makro
                                </span>
                            </div>
                        </div>

                        {/* 4. Kategori Dokumen */}
                        <div className="flex h-[76px] flex-col justify-between rounded-xl border border-black/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <div className="flex items-center justify-between text-[11px] font-medium text-[#787774] dark:text-zinc-400">
                                <span>Ragam Kategori</span>
                                <Layers className="size-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex items-baseline justify-between">
                                <span className="font-mono text-base font-bold tracking-tight text-[#111111] dark:text-white">
                                    {metrics.types_count} Jenis
                                </span>
                                <span className="text-[10px] text-[#787774] dark:text-zinc-400">
                                    kontrak, somasi, litigasi
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Template Cards Grid */}
                    {templates.length === 0 ? (
                        <div className="flex min-h-[380px] items-center justify-center rounded-xl border border-black/[0.08] bg-white p-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                            <EmptyState
                                title="Belum ada template DOCX tersimpan"
                                description="Unggah master file Microsoft Word (.docx) dengan tag placeholder seperti {{client.name}} untuk memulai otomasi pembuatan dokumen."
                            />
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {templates.map((template) => (
                                <article
                                    key={template.id}
                                    className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:border-black/20 dark:border-white/[0.08] dark:bg-[#1a1a1c] dark:hover:border-white/20"
                                >
                                    <div>
                                        {/* Top Meta Bar */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-7 items-center justify-center rounded-md bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                                                    <FileText className="size-3.5" />
                                                </div>
                                                <div>
                                                    <span className="rounded bg-black/[0.04] px-1.5 py-0.2 text-[10px] font-medium text-[#787774] dark:bg-white/[0.06] dark:text-zinc-300">
                                                        {template.document_type ?? 'Dokumen Legal'}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="font-mono text-[10px] font-semibold text-[#787774]">
                                                v{template.version}.0
                                            </span>
                                        </div>

                                        {/* Title & Author */}
                                        <h3 className="mt-2.5 text-xs font-bold text-[#111111] dark:text-white">
                                            {template.name}
                                        </h3>
                                        <p className="mt-0.5 font-mono text-[10px] text-[#787774] dark:text-zinc-400 truncate">
                                            {template.original_filename} · Oleh {template.creator.name}
                                        </p>

                                        {/* Scan Status Badge */}
                                        <div className="mt-2 flex items-center gap-1.5">
                                            {template.scan_status === 'clean' ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                                    <ShieldCheck className="size-3" /> Bersih Antivirus
                                                </span>
                                            ) : template.scan_status === 'pending' ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                                                    <RefreshCw className="size-3 animate-spin" /> Pemindaian...
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-rose-600 dark:text-rose-400">
                                                    <ShieldAlert className="size-3" /> Berkas Ditolak
                                                </span>
                                            )}
                                        </div>

                                        {/* Placeholders Chip Bar */}
                                        <div className="mt-2.5 space-y-1 rounded-lg border border-black/[0.06] bg-[#fafafa] p-2 dark:border-white/[0.06] dark:bg-zinc-800/40">
                                            <span className="text-[9px] font-bold text-[#787774] uppercase tracking-wider">
                                                Tag Placeholder:
                                            </span>
                                            <div className="flex flex-wrap gap-1 pt-0.5">
                                                {template.placeholders && template.placeholders.length > 0 ? (
                                                    template.placeholders.map((p) => (
                                                        <span
                                                            key={p}
                                                            className="rounded bg-white px-1.5 py-0.2 font-mono text-[9px] font-medium text-blue-600 border border-black/[0.06] dark:border-white/[0.06] dark:bg-zinc-700 dark:text-sky-300"
                                                        >
                                                            {`{{${p}}}`}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-[#787774]">
                                                        Tanpa tag placeholder variabel
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.04] pt-2.5 dark:border-white/[0.04]">
                                        <StatusBadge value={template.status} />

                                        <div className="flex items-center gap-1">
                                            {can.manage && template.scan_status === 'clean' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => setGenerate(template)}
                                                    className="h-6.5 rounded-md bg-[#111111] px-2.5 text-[10px] font-semibold text-white hover:bg-black dark:bg-white dark:text-black"
                                                >
                                                    <WandSparkles className="mr-1 size-3" />
                                                    Generate
                                                </Button>
                                            )}

                                            {can.manage && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setEdit(template)}
                                                        className="h-6.5 w-6.5 rounded-md p-0 text-[#787774] hover:bg-black/[0.04] hover:text-[#111111]"
                                                        title="Edit Metadata"
                                                    >
                                                        <Pencil className="size-3" />
                                                    </Button>

                                                    <Form {...templateRoutes.duplicate.form(template.id)}>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            type="submit"
                                                            className="h-6.5 w-6.5 rounded-md p-0 text-[#787774] hover:bg-black/[0.04] hover:text-[#111111]"
                                                            title="Duplikat Template"
                                                        >
                                                            <Copy className="size-3" />
                                                        </Button>
                                                    </Form>

                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setVersion(template)}
                                                        className="h-6.5 w-6.5 rounded-md p-0 text-[#787774] hover:bg-black/[0.04] hover:text-[#111111]"
                                                        title="Revisi File Baru"
                                                    >
                                                        <RefreshCw className="size-3" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal 1: Upload Template */}
            <Dialog open={upload} onOpenChange={setUpload}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                                <FilePlus2 className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                    Unggah Template DOCX Master
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                    Pastikan berkas berformat .docx dan memiliki tag placeholder terstruktur.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <Form
                        {...templateRoutes.store.form()}
                        className="space-y-3.5 pt-1"
                        onSuccess={() => setUpload(false)}
                    >
                        {({ processing, errors }) => (
                            <>
                                <Field name="name" label="Nama Template" placeholder="Contoh: Perjanjian Kerjasama Standar 2026" required />

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
                                            <option value="pleading">Gugatan / Replik / Duplik</option>
                                            <option value="power_of_attorney">Surat Kuasa Khusus</option>
                                            <option value="legal_opinion">Legal Opinion / Advice</option>
                                            <option value="notice">Surat Peringatan / Somasi</option>
                                            <option value="other">Dokumen Lainnya</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                    </div>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="file" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                        Pilih File Master (.docx) *
                                    </Label>
                                    <Input
                                        id="file"
                                        name="file"
                                        type="file"
                                        accept=".docx"
                                        required
                                        className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs file:mr-2.5 file:rounded-md file:border-0 file:bg-zinc-200 file:px-2.5 file:py-0.5 file:text-xs focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212]"
                                    />
                                    {errors.file && <p className="text-xs text-rose-500">{errors.file}</p>}
                                </div>

                                <Field
                                    name="placeholders[0]"
                                    label="Placeholder Utama (Opsional)"
                                    placeholder="Contoh: client.name atau effective_date"
                                />

                                <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                    <Button type="button" variant="outline" onClick={() => setUpload(false)} className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03]">
                                        Batal
                                    </Button>
                                    <Button disabled={processing} className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black">
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-1.5 size-3.5" />
                                                Menyimpan...
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

            {/* Modal 2: Generate Document From Template */}
            <Dialog open={!!generate} onOpenChange={(open) => !open && setGenerate(null)}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-lg dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                <WandSparkles className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                    Generate Dokumen Baru
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                    Dari master template: <strong>{generate?.name}</strong>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {generate && (
                        <Form
                            {...templateRoutes.generate.form(generate.id)}
                            className="space-y-3.5 pt-1"
                            onSuccess={() => setGenerate(null)}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="generate_matter_id" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Terkait Matter Perkara *
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="generate_matter_id"
                                                name="matter_id"
                                                required
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                            >
                                                <option value="">Pilih Matter Terkait</option>
                                                {matters.map((m) => (
                                                    <option key={m.id} value={m.id}>
                                                        {m.matter_number} — {m.title}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                    </div>

                                    <Field name="title" label="Judul Dokumen yang Dihasilkan" placeholder={`Draf ${generate.name}`} required />

                                    {/* Placeholders Inputs */}
                                    {generate.placeholders && generate.placeholders.length > 0 && (
                                        <div className="space-y-2 rounded-xl border border-black/[0.08] bg-[#fafafa] p-3 dark:border-white/[0.08] dark:bg-zinc-800/40">
                                            <Label className="text-xs font-bold text-[#111111] dark:text-white">Isi Variabel Placeholder</Label>
                                            <div className="space-y-2 pt-1">
                                                {generate.placeholders.map((placeholder) => (
                                                    <Field
                                                        key={placeholder}
                                                        name={`placeholders[${placeholder}]`}
                                                        label={`Tag: {{${placeholder}}}`}
                                                        placeholder={`Masukkan nilai untuk ${placeholder}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                        <Button type="button" variant="outline" onClick={() => setGenerate(null)} className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03]">
                                            Batal
                                        </Button>
                                        <Button disabled={processing} className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black">
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-1.5 size-3.5" />
                                                    Menghasilkan Dokumen...
                                                </>
                                            ) : (
                                                'Generate Dokumen'
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal 3: Edit Template */}
            <Dialog open={!!edit} onOpenChange={(open) => !open && setEdit(null)}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <DialogTitle className="text-sm font-bold text-[#111111] dark:text-white">
                            Edit Metadata Template
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#787774]">
                            Perbarui nama, jenis dokumen, dan status aktif template.
                        </DialogDescription>
                    </DialogHeader>

                    {edit && (
                        <Form
                            {...templateRoutes.update.form(edit.id)}
                            className="space-y-3.5 pt-1"
                            onSuccess={() => setEdit(null)}
                        >
                            {({ processing }) => (
                                <>
                                    <Field name="name" label="Nama Template" defaultValue={edit.name} required />
                                    <Field name="document_type" label="Jenis Dokumen" defaultValue={edit.document_type} />
                                    <Field name="placeholders[0]" label="Placeholder" defaultValue={edit.placeholders?.[0]} />

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="edit-status" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Status
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="edit-status"
                                                name="status"
                                                defaultValue={edit.status}
                                                className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium outline-none focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
                                            >
                                                <option value="active">Aktif</option>
                                                <option value="inactive">Tidak Aktif</option>
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                        <Button type="button" variant="outline" onClick={() => setEdit(null)} className="h-8 rounded-lg px-3 text-xs font-medium">
                                            Batal
                                        </Button>
                                        <Button disabled={processing} className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white hover:bg-black dark:bg-white dark:text-black">
                                            Simpan Perubahan
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal 4: Upload Version */}
            <Dialog open={!!version} onOpenChange={(open) => !open && setVersion(null)}>
                <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-md dark:border-white/10 dark:bg-[#1c1c1e]">
                    <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.04]">
                        <DialogTitle className="text-sm font-bold text-[#111111] dark:text-white">
                            Upload Revisi Template Baru
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#787774]">
                            Versi lama akan diarsipkan otomatis dan digantikan oleh file revisi ini.
                        </DialogDescription>
                    </DialogHeader>

                    {version && (
                        <Form
                            {...templateVersionRoutes.store.form(version.id)}
                            className="space-y-3.5 pt-1"
                            onSuccess={() => setVersion(null)}
                        >
                            {({ processing, errors }) => (
                                <>
                                    <Field name="name" label="Nama Template" defaultValue={version.name} />

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="version-file" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Pilih Berkas DOCX Revisi *
                                        </Label>
                                        <Input
                                            id="version-file"
                                            name="file"
                                            type="file"
                                            accept=".docx"
                                            required
                                            className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs file:mr-2.5 file:rounded-md file:border-0 file:bg-zinc-200 file:px-2.5 file:py-0.5 file:text-xs focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212]"
                                        />
                                        {errors.file && <p className="text-xs text-rose-500">{errors.file}</p>}
                                    </div>

                                    <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.04]">
                                        <Button type="button" variant="outline" onClick={() => setVersion(null)} className="h-8 rounded-lg px-3 text-xs font-medium">
                                            Batal
                                        </Button>
                                        <Button disabled={processing} className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white hover:bg-black dark:bg-white dark:text-black">
                                            Simpan Versi Baru
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function Field({
    name,
    label,
    type = 'text',
    placeholder,
    defaultValue,
    required = false,
}: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    defaultValue?: string;
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
                defaultValue={defaultValue}
                required={required}
                className="h-8 rounded-lg border border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] transition-colors focus:border-black/20 focus:bg-white dark:border-white/10 dark:bg-[#121212] dark:text-white"
            />
        </div>
    );
}

TemplateIndex.layout = {
    breadcrumbs: [{ title: 'Template Dokumen', href: templateRoutes.index() }],
};
