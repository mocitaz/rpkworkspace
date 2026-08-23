import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    CheckCircle2,
    ChevronDown,
    Info,
    Lock,
    ShieldAlert,
    ShieldCheck,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import * as matterRoutes from '@/routes/matters';
import * as conflictRoutes from '@/routes/matters/conflict-checks';

type Choice = {
    id: number | string;
    name?: string;
    display_name?: string;
    client_number?: string;
    position_title?: string;
};

export default function MatterCreate({
    clients,
    practiceAreas,
    users,
    conflictCheck,
    canRunConflictCheck,
}: {
    clients: Choice[];
    practiceAreas: Choice[];
    users: Choice[];
    conflictCheck?: {
        id: string;
        client_id: string;
        status: string;
        decision: string;
        subject_name: string;
        searched_names: string[];
        matches: unknown[];
        decision_note?: string;
        expires_at?: string;
    } | null;
    canRunConflictCheck: boolean;
}) {
    const isConflictCleared =
        conflictCheck &&
        (conflictCheck.status === 'clear' || conflictCheck.decision === 'waived');

    return (
        <>
            <Head title="Buat Matter Baru" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Notion Minimalist Header */}
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                Buat Matter Baru
                            </h1>
                            <p className="text-xs text-[#787774] dark:text-zinc-400">
                                Nomor perkara unik akan dibuat otomatis oleh sistem setelah formulir disimpan.
                            </p>
                        </div>

                        {/* Right: Back Action */}
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                variant="outline"
                                className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                                asChild
                            >
                                <Link href={matterRoutes.index()}>
                                    <ArrowLeft className="mr-1.5 size-3.5" />
                                    Kembali ke Daftar Matter
                                </Link>
                            </Button>
                        </div>
                    </header>

                    {/* Section 1: Conflict Check (Langkah Wajib) */}
                    <section className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        <div className="flex items-center justify-between border-b border-black/[0.04] pb-3.5 dark:border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-[#e1f3fe] text-[#1f6c9f] dark:bg-blue-950/50 dark:text-sky-300">
                                    <ShieldCheck className="size-4" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider dark:text-white">
                                            1. Pemeriksaan Benturan Kepentingan (Conflict Check)
                                        </h2>
                                        <span className="rounded bg-[#fdebec] px-1.5 py-0.2 text-[9px] font-bold text-[#9f2f2d] uppercase dark:bg-rose-950/50 dark:text-rose-300">
                                            Wajib
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                        Pilih klien dan daftarkan pihak lawan/terkait untuk menyaring kepatuhan etik sebelum matter dibuka.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* If Conflict Check is active / completed */}
                        {conflictCheck ? (
                            <div className="mt-4 space-y-3">
                                <div
                                    className={`flex items-start gap-3 rounded-lg border p-3.5 text-xs ${
                                        isConflictCleared
                                            ? 'border-emerald-500/20 bg-[#edf3ec] text-[#2d5530] dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-200'
                                            : 'border-amber-500/20 bg-[#fbf3db] text-[#7a5300] dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-200'
                                    }`}
                                >
                                    {isConflictCleared ? (
                                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <ShieldAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                    )}

                                    <div className="flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold">
                                                Status Conflict Check:{' '}
                                                <span className="capitalize">{conflictCheck.status.replace('_', ' ')}</span>
                                            </p>
                                            {conflictCheck.decision === 'waived' && (
                                                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase">
                                                    Waiver Disetujui
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-[11px] leading-relaxed opacity-90">
                                            <span className="font-medium">Pihak yang diperiksa:</span>{' '}
                                            {conflictCheck.searched_names.join(', ')}
                                        </p>

                                        {conflictCheck.decision === 'waived' ? (
                                            <p className="text-[11px] opacity-90">
                                                Catatan persetujuan partner: {conflictCheck.decision_note ?? 'Tercatat.'}
                                            </p>
                                        ) : conflictCheck.status === 'clear' ? (
                                            <p className="text-[11px] opacity-90">
                                                Tidak ditemukan potensi konflik kepentingan dengan klien maupun pihak terdaftar.
                                            </p>
                                        ) : (
                                            <p className="text-[11px] opacity-90">
                                                Memerlukan waiver atau keputusan partner berwenang sebelum Matter dapat diproses.
                                            </p>
                                        )}

                                        {conflictCheck.expires_at && (
                                            <p className="pt-0.5 font-mono text-[10px] opacity-75">
                                                Hasil berlaku sampai:{' '}
                                                {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(
                                                    new Date(conflictCheck.expires_at),
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : canRunConflictCheck ? (
                            /* Form Run Conflict Check */
                            <Form {...conflictRoutes.store.form()} className="mt-4 space-y-4">
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-3.5 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <SelectField
                                                    label="Klien yang Diperiksa"
                                                    name="client_id"
                                                    error={errors.client_id}
                                                    options={clients.map((item) => ({
                                                        value: item.id,
                                                        label: `${item.client_number} — ${item.display_name}`,
                                                    }))}
                                                />
                                            </div>

                                            <div className="space-y-1.5 sm:col-span-2">
                                                <Label className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                                    Pihak Lawan / Pihak Terkait yang Diperiksa
                                                </Label>
                                                <div className="grid gap-2 sm:grid-cols-2">
                                                    {[0, 1, 2, 3].map((index) => (
                                                        <Input
                                                            key={index}
                                                            name={`names[${index}]`}
                                                            placeholder={
                                                                index === 0
                                                                    ? 'Lawan transaksi, pihak lawan, atau perusahaan'
                                                                    : 'Tambahkan pihak lain (opsional)'
                                                            }
                                                            className="h-8 rounded-lg border-black/[0.08] bg-[#fbfbfa] text-xs focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212]"
                                                        />
                                                    ))}
                                                </div>
                                                <InputError message={errors.names} />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-black/[0.04] pt-3 dark:border-white/[0.06]">
                                            <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                Pemeriksaan memindai basis data klien, perkara aktif, dan riwayat sengketa.
                                            </p>

                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-8 rounded-lg bg-[#111111] px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                            >
                                                {processing && <Spinner className="mr-1.5 size-3.5" />}
                                                Jalankan Conflict Check
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        ) : (
                            <div className="mt-3 rounded-lg border border-amber-500/20 bg-[#fbf3db] p-3 text-xs text-[#7a5300] dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-200">
                                Conflict check wajib dilakukan oleh partner atau user yang memiliki hak otorisasi.
                            </div>
                        )}
                    </section>

                    {/* Section 2: Informasi & Parameter Matter */}
                    <section className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                        <div className="flex items-center justify-between border-b border-black/[0.04] pb-3.5 dark:border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-zinc-200">
                                    <Briefcase className="size-4" />
                                </div>
                                <div>
                                    <h2 className="text-xs font-bold text-[#111111] uppercase tracking-wider dark:text-white">
                                        2. Informasi & Parameter Perkara
                                    </h2>
                                    <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                        Lengkapi spesifikasi perkara hukum, tim penanggung jawab, dan klasifikasi kerahasiaan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {!isConflictCleared && (
                            <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-amber-500/20 bg-[#fbf3db] p-3 text-xs text-[#7a5300] dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-200">
                                <Info className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                <span>
                                    Formulir perkara dapat dilengkapi, namun tombol simpan hanya aktif setelah <strong>Conflict Check</strong> selesai disetujui.
                                </span>
                            </div>
                        )}

                        <Form {...matterRoutes.store.form()} className="mt-5 space-y-5" resetOnSuccess>
                            {({ errors, processing }) => (
                                <>
                                    <input
                                        type="hidden"
                                        name="conflict_check_id"
                                        value={conflictCheck?.id ?? ''}
                                    />

                                    {/* Subsection A: Identitas Perkara */}
                                    <div className="space-y-3.5">
                                        <div className="grid gap-3.5 sm:grid-cols-2">
                                            {/* Judul Matter */}
                                            <div className="sm:col-span-2">
                                                <Field
                                                    label="Judul Perkara / Matter"
                                                    name="title"
                                                    placeholder="Contoh: Project Aurora — EPC Contract & Land Acquisition"
                                                    error={errors.title}
                                                />
                                            </div>

                                            {/* Klien */}
                                            <div>
                                                {conflictCheck ? (
                                                    <div className="grid gap-1.5">
                                                        <Label className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                                            Klien Terpilih
                                                        </Label>
                                                        <input
                                                            type="hidden"
                                                            name="client_id"
                                                            value={conflictCheck.client_id}
                                                        />
                                                        <div className="flex h-8 items-center justify-between rounded-lg border border-black/[0.08] bg-[#fbfbfa] px-3 text-xs font-medium text-[#111111] dark:border-white/[0.1] dark:bg-[#121212] dark:text-white">
                                                            <span>
                                                                {clients.find(
                                                                    (c) => String(c.id) === conflictCheck.client_id,
                                                                )?.display_name ?? 'Klien dari Conflict Check'}
                                                            </span>
                                                            <Lock className="size-3 text-[#787774]" />
                                                        </div>
                                                        <InputError message={errors.client_id} />
                                                    </div>
                                                ) : (
                                                    <SelectField
                                                        label="Klien"
                                                        name="client_id"
                                                        error={errors.client_id}
                                                        options={clients.map((item) => ({
                                                            value: item.id,
                                                            label: `${item.client_number} — ${item.display_name}`,
                                                        }))}
                                                    />
                                                )}
                                            </div>

                                            {/* Area Praktik */}
                                            <div>
                                                <SelectField
                                                    label="Area Praktik Hukum"
                                                    name="practice_area_id"
                                                    error={errors.practice_area_id}
                                                    options={practiceAreas.map((item) => ({
                                                        value: item.id,
                                                        label: item.name ?? '',
                                                    }))}
                                                />
                                            </div>

                                            {/* Jenis Matter */}
                                            <div>
                                                <Field
                                                    label="Jenis Matter"
                                                    name="matter_type"
                                                    placeholder="Contoh: Advisory, Transactional, Dispute"
                                                    error={errors.matter_type}
                                                />
                                            </div>

                                            {/* Tanggal Dibuka */}
                                            <div>
                                                <Field
                                                    label="Tanggal Dibuka"
                                                    name="opened_at"
                                                    type="date"
                                                    error={errors.opened_at}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subsection B: Penugasan Tim */}
                                    <div className="border-t border-black/[0.04] pt-4 dark:border-white/[0.06]">
                                        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                            Penugasan Tim & Advokat
                                        </h3>
                                        <div className="grid gap-3.5 sm:grid-cols-2">
                                            <SelectField
                                                label="Partner Penanggung Jawab"
                                                name="responsible_partner_id"
                                                error={errors.responsible_partner_id}
                                                options={users.map((item) => ({
                                                    value: item.id,
                                                    label: `${item.name} ${item.position_title ? `— ${item.position_title}` : ''}`,
                                                }))}
                                            />

                                            <SelectField
                                                label="Supervising Lawyer"
                                                name="supervising_lawyer_id"
                                                optional
                                                error={errors.supervising_lawyer_id}
                                                options={users.map((item) => ({
                                                    value: item.id,
                                                    label: `${item.name} ${item.position_title ? `— ${item.position_title}` : ''}`,
                                                }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Subsection C: Klasifikasi & Tata Kelola */}
                                    <div className="border-t border-black/[0.04] pt-4 dark:border-white/[0.06]">
                                        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                            Klasifikasi & Tata Kelola
                                        </h3>
                                        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                                            <SelectField
                                                label="Status"
                                                name="status"
                                                defaultValue="active"
                                                error={errors.status}
                                                options={[
                                                    { value: 'prospective', label: 'Prospektif' },
                                                    { value: 'active', label: 'Aktif' },
                                                    { value: 'on_hold', label: 'Ditunda' },
                                                ]}
                                            />

                                            <SelectField
                                                label="Prioritas"
                                                name="priority"
                                                defaultValue="normal"
                                                error={errors.priority}
                                                options={[
                                                    { value: 'low', label: 'Rendah' },
                                                    { value: 'normal', label: 'Normal' },
                                                    { value: 'high', label: 'Tinggi' },
                                                    { value: 'critical', label: 'Kritis' },
                                                ]}
                                            />

                                            <SelectField
                                                label="Tingkat Kerahasiaan"
                                                name="confidentiality_level"
                                                defaultValue="standard"
                                                error={errors.confidentiality_level}
                                                options={[
                                                    { value: 'standard', label: 'Standar' },
                                                    { value: 'confidential', label: 'Rahasia' },
                                                    { value: 'restricted', label: 'Sangat Terbatas' },
                                                ]}
                                            />

                                            <Field
                                                label="Yurisdiksi"
                                                name="jurisdiction"
                                                placeholder="Contoh: DKI Jakarta, RI"
                                                error={errors.jurisdiction}
                                            />
                                        </div>
                                    </div>

                                    {/* Subsection D: Ringkasan & Deskripsi */}
                                    <div className="border-t border-black/[0.04] pt-4 dark:border-white/[0.06]">
                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="summary"
                                                className="text-xs font-medium text-[#2f3437] dark:text-zinc-200"
                                            >
                                                Ringkasan & Lingkup Penanganan Perkara
                                            </Label>
                                            <textarea
                                                id="summary"
                                                name="summary"
                                                rows={4}
                                                placeholder="Jelaskan secara ringkas latar belakang kasus, sasaran hukum klien, dan ruang lingkup pekerjaan..."
                                                className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-3 text-xs leading-relaxed text-[#111111] outline-none transition-colors placeholder:text-[#787774] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white dark:focus:border-white/20"
                                            />
                                            <InputError message={errors.summary} />
                                        </div>
                                    </div>

                                    {/* Bottom Sticky Action Bar */}
                                    <div className="flex flex-col justify-between gap-3 border-t border-black/[0.04] pt-4 sm:flex-row sm:items-center dark:border-white/[0.06]">
                                        <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                            Pastikan seluruh data dan otorisasi telah sesuai sebelum menyimpan matter.
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                                                asChild
                                            >
                                                <Link href={matterRoutes.index()}>Batal</Link>
                                            </Button>

                                            <Button
                                                type="submit"
                                                disabled={processing || !isConflictCleared}
                                                className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-black active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Spinner className="mr-1.5 size-3.5" />
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    'Simpan & Buat Matter'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Form>
                    </section>
                </main>
            </div>
        </>
    );
}

function Field({
    label,
    name,
    error,
    className,
    type = 'text',
    placeholder,
}: {
    label: string;
    name: string;
    error?: string;
    className?: string;
    type?: string;
    placeholder?: string;
}) {
    return (
        <div className={`grid gap-1.5 ${className ?? ''}`}>
            <Label htmlFor={name} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                {label}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className="h-8 rounded-lg border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] transition-colors focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
            />
            <InputError message={error} />
        </div>
    );
}

function SelectField({
    label,
    name,
    error,
    options,
    defaultValue = '',
    optional = false,
}: {
    label: string;
    name: string;
    error?: string;
    options: { value: string | number; label: string }[];
    defaultValue?: string;
    optional?: boolean;
}) {
    return (
        <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
                <Label htmlFor={name} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                    {label}
                </Label>
                {optional && (
                    <span className="text-[10px] text-[#787774] dark:text-zinc-500">Opsional</span>
                )}
            </div>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    required={!optional}
                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200 dark:hover:bg-white/[0.04]"
                >
                    <option value="">{optional ? 'Tidak ditentukan' : 'Pilih...'}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
            </div>
            <InputError message={error} />
        </div>
    );
}

MatterCreate.layout = {
    breadcrumbs: [
        { title: 'Matters', href: matterRoutes.index() },
        { title: 'Buat Matter', href: matterRoutes.create() },
    ],
};
