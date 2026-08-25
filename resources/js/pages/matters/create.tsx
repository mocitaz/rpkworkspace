import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    CheckCircle2,
    ChevronDown,
    Info,
    Lock,
    Scale,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
    Users,
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
    parentMatters = [],
    conflictCheck,
    canRunConflictCheck,
}: {
    clients: Choice[];
    practiceAreas: Choice[];
    users: Choice[];
    parentMatters?: { id: string; matter_number: string; title: string }[];
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
        (conflictCheck.status === 'clear' ||
            conflictCheck.decision === 'waived');

    return (
        <>
            <Head title="Registrasi Perkara Baru" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Registrasi Perkara Baru
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Nomor perkara resmi kantor (contoh:{' '}
                                <strong className="font-mono text-slate-700 dark:text-zinc-300">
                                    RPK-2026-XXXX
                                </strong>
                                ) akan dibuat otomatis oleh sistem.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center">
                            <Button
                                variant="outline"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                asChild
                            >
                                <Link href={matterRoutes.index()}>
                                    <ArrowLeft className="mr-1 size-3.5 text-slate-400" />
                                    Kembali ke Daftar Perkara
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Tahap 1: Conflict Check */}
                    <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Tahap 1: Pemeriksaan Benturan Kepentingan
                                    (Conflict Check)
                                </h2>
                                <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                                    Wajib Etik
                                </span>
                            </div>
                        </div>

                        {conflictCheck ? (
                            <div className="mt-3">
                                <div
                                    className={`flex items-start gap-3 rounded-lg border p-3 text-xs ${
                                        isConflictCleared
                                            ? 'border-emerald-500/20 bg-emerald-50/60 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-200'
                                            : 'border-amber-500/20 bg-amber-50/60 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-200'
                                    }`}
                                >
                                    {isConflictCleared ? (
                                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <ShieldAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                    )}

                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold">
                                                Status Conflict Check:{' '}
                                                <span className="capitalize">
                                                    {conflictCheck.status.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                            </p>
                                            {conflictCheck.decision ===
                                                'waived' && (
                                                <span className="py-0.2 rounded bg-amber-500/20 px-1.5 font-mono text-[9px] font-bold uppercase">
                                                    Waiver Disetujui Partner
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] opacity-90">
                                            <span className="font-semibold">
                                                Pihak yang diperiksa:
                                            </span>{' '}
                                            {conflictCheck.searched_names.join(
                                                ', ',
                                            )}
                                        </p>
                                        {conflictCheck.expires_at && (
                                            <p className="font-mono text-[10px] opacity-75">
                                                Berlaku hingga:{' '}
                                                {new Intl.DateTimeFormat(
                                                    'id-ID',
                                                    { dateStyle: 'medium' },
                                                ).format(
                                                    new Date(
                                                        conflictCheck.expires_at,
                                                    ),
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : canRunConflictCheck ? (
                            <Form
                                {...conflictRoutes.store.form()}
                                className="mt-3 space-y-3.5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <SelectField
                                                    label="Klien yang Diperiksa"
                                                    name="client_id"
                                                    error={errors.client_id}
                                                    options={clients.map(
                                                        (item) => ({
                                                            value: item.id,
                                                            label: `${item.client_number} - ${item.display_name}`,
                                                        }),
                                                    )}
                                                />
                                            </div>

                                            <div className="space-y-1.5 sm:col-span-2">
                                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                    Pihak Lawan / Pihak Terkait
                                                    yang Diperiksa
                                                </Label>
                                                <div className="grid gap-2 sm:grid-cols-2">
                                                    {[0, 1, 2, 3].map(
                                                        (index) => (
                                                            <Input
                                                                key={index}
                                                                name={`names[${index}]`}
                                                                placeholder={
                                                                    index === 0
                                                                        ? 'Nama pihak lawan / perusahaan...'
                                                                        : 'Nama pihak lain (opsional)...'
                                                                }
                                                                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <InputError
                                                    message={errors.names}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/[0.04]">
                                            <p className="text-[11px] text-slate-400">
                                                Memindai basis data perkara,
                                                sengketa, dan kontak klien.
                                            </p>

                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={processing}
                                                className="h-8 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-500"
                                            >
                                                {processing && (
                                                    <Spinner className="mr-1.5 size-3" />
                                                )}
                                                Jalankan Conflict Check
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        ) : (
                            <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-50/60 p-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-200">
                                Conflict check wajib diinisiasi oleh partner
                                atau advokat dengan otorisasi penanganan
                                perkara.
                            </div>
                        )}
                    </section>

                    {/* Tahap 2: Informasi & Parameter Perkara */}
                    <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                            <div className="flex items-center gap-2">
                                <Briefcase className="size-4 text-purple-600 dark:text-purple-400" />
                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Tahap 2: Informasi &amp; Parameter Perkara
                                </h2>
                            </div>
                        </div>

                        {!isConflictCleared && (
                            <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-50/60 p-2.5 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-200">
                                <Info className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                                <span>
                                    Formulir dapat diisi terlebih dahulu. Tombol
                                    simpan perkara akan aktif setelah{' '}
                                    <strong>Tahap 1 (Conflict Check)</strong>{' '}
                                    selesai atau disetujui.
                                </span>
                            </div>
                        )}

                        <Form
                            {...matterRoutes.store.form()}
                            className="mt-4 space-y-4"
                            resetOnSuccess
                        >
                            {({ errors, processing }) => (
                                <>
                                    <input
                                        type="hidden"
                                        name="conflict_check_id"
                                        value={conflictCheck?.id ?? ''}
                                    />

                                    {/* Subsection A: Identitas Pokok */}
                                    <div className="space-y-3">
                                        <h3 className="text-[11px] font-bold text-slate-500 uppercase dark:text-zinc-400">
                                            A. Identitas Pokok Perkara
                                        </h3>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <Field
                                                    label="Judul Perkara / Matter"
                                                    name="title"
                                                    placeholder="Contoh: Project Aurora — EPC Contract & Advisory"
                                                    error={errors.title}
                                                />
                                            </div>

                                            <div>
                                                {conflictCheck ? (
                                                    <div className="grid gap-1">
                                                        <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                            Klien Terpilih
                                                        </Label>
                                                        <input
                                                            type="hidden"
                                                            name="client_id"
                                                            value={
                                                                conflictCheck.client_id
                                                            }
                                                        />
                                                        <div className="flex h-8 items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 text-xs font-medium text-slate-900 dark:border-white/10 dark:bg-[#121418] dark:text-white">
                                                            <span>
                                                                {clients.find(
                                                                    (c) =>
                                                                        String(
                                                                            c.id,
                                                                        ) ===
                                                                        conflictCheck.client_id,
                                                                )
                                                                    ?.display_name ??
                                                                    'Klien dari Conflict Check'}
                                                            </span>
                                                            <Lock className="size-3 text-slate-400" />
                                                        </div>
                                                        <InputError
                                                            message={
                                                                errors.client_id
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    <SelectField
                                                        label="Klien"
                                                        name="client_id"
                                                        error={errors.client_id}
                                                        options={clients.map(
                                                            (item) => ({
                                                                value: item.id,
                                                                label: `${item.client_number} - ${item.display_name}`,
                                                            }),
                                                        )}
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <SelectField
                                                    label="Area Praktik Hukum"
                                                    name="practice_area_id"
                                                    error={
                                                        errors.practice_area_id
                                                    }
                                                    options={practiceAreas.map(
                                                        (item) => ({
                                                            value: item.id,
                                                            label:
                                                                item.name ?? '',
                                                        }),
                                                    )}
                                                />
                                            </div>

                                            <div>
                                                <SelectField
                                                    label="Perkara Induk / Parent Matter (Opsional)"
                                                    name="parent_matter_id"
                                                    optional
                                                    error={
                                                        errors.parent_matter_id
                                                    }
                                                    options={[
                                                        {
                                                            value: '',
                                                            label: '— Bukan Perkara Turunan / Standalone —',
                                                        },
                                                        ...parentMatters.map(
                                                            (item) => ({
                                                                value: item.id,
                                                                label: `${item.matter_number} - ${item.title}`,
                                                            }),
                                                        ),
                                                    ]}
                                                />
                                            </div>

                                            <div>
                                                <SelectField
                                                    label="Tipe Relasi Tingkat Perkara"
                                                    name="relationship_type"
                                                    defaultValue="related_dispute"
                                                    error={
                                                        errors.relationship_type
                                                    }
                                                    options={[
                                                        {
                                                            value: 'related_dispute',
                                                            label: 'Sengketa Terkait / Turunan',
                                                        },
                                                        {
                                                            value: 'appeal_pt',
                                                            label: 'Tingkat Banding (Pengadilan Tinggi)',
                                                        },
                                                        {
                                                            value: 'cassation_ma',
                                                            label: 'Tingkat Kasasi (Mahkamah Agung)',
                                                        },
                                                        {
                                                            value: 'judicial_review_pk',
                                                            label: 'Peninjauan Kembali (PK)',
                                                        },
                                                        {
                                                            value: 'execution',
                                                            label: 'Permohonan Eksekusi Putusan',
                                                        },
                                                        {
                                                            value: 'counterclaim_reconvention',
                                                            label: 'Gugatan Rekonvensi / Balik',
                                                        },
                                                    ]}
                                                />
                                            </div>

                                            <div>
                                                <Field
                                                    label="Jenis / Tipe Matter"
                                                    name="matter_type"
                                                    placeholder="Contoh: Advisory, Transactional, Dispute"
                                                    error={errors.matter_type}
                                                />
                                            </div>

                                            <div>
                                                <Field
                                                    label="Tanggal Pembukaan Kasus"
                                                    name="opened_at"
                                                    type="date"
                                                    error={errors.opened_at}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subsection B: Penugasan Advokat */}
                                    <div className="border-t border-slate-100 pt-3.5 dark:border-white/[0.04]">
                                        <h3 className="mb-2.5 text-[11px] font-bold text-slate-500 uppercase dark:text-zinc-400">
                                            B. Penugasan Advokat &amp; Tim Hukum
                                        </h3>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <SelectField
                                                label="Partner Penanggung Jawab"
                                                name="responsible_partner_id"
                                                error={
                                                    errors.responsible_partner_id
                                                }
                                                options={users.map((item) => ({
                                                    value: item.id,
                                                    label: `${item.name} ${item.position_title ? `(${item.position_title})` : ''}`,
                                                }))}
                                            />

                                            <SelectField
                                                label="Supervising Lawyer (Opsional)"
                                                name="supervising_lawyer_id"
                                                optional
                                                error={
                                                    errors.supervising_lawyer_id
                                                }
                                                options={users.map((item) => ({
                                                    value: item.id,
                                                    label: `${item.name} ${item.position_title ? `(${item.position_title})` : ''}`,
                                                }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Subsection C: Klasifikasi & Kerahasiaan */}
                                    <div className="border-t border-slate-100 pt-3.5 dark:border-white/[0.04]">
                                        <h3 className="mb-2.5 text-[11px] font-bold text-slate-500 uppercase dark:text-zinc-400">
                                            C. Klasifikasi &amp; Kerahasiaan
                                        </h3>
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                            <SelectField
                                                label="Status"
                                                name="status"
                                                defaultValue="active"
                                                error={errors.status}
                                                options={[
                                                    {
                                                        value: 'prospective',
                                                        label: 'Prospektif',
                                                    },
                                                    {
                                                        value: 'active',
                                                        label: 'Aktif',
                                                    },
                                                    {
                                                        value: 'on_hold',
                                                        label: 'Ditunda',
                                                    },
                                                ]}
                                            />

                                            <SelectField
                                                label="Prioritas"
                                                name="priority"
                                                defaultValue="normal"
                                                error={errors.priority}
                                                options={[
                                                    {
                                                        value: 'low',
                                                        label: 'Rendah',
                                                    },
                                                    {
                                                        value: 'normal',
                                                        label: 'Normal',
                                                    },
                                                    {
                                                        value: 'high',
                                                        label: 'Tinggi',
                                                    },
                                                    {
                                                        value: 'critical',
                                                        label: 'Kritis',
                                                    },
                                                ]}
                                            />

                                            <SelectField
                                                label="Tingkat Kerahasiaan"
                                                name="confidentiality_level"
                                                defaultValue="standard"
                                                error={
                                                    errors.confidentiality_level
                                                }
                                                options={[
                                                    {
                                                        value: 'standard',
                                                        label: 'Standar',
                                                    },
                                                    {
                                                        value: 'confidential',
                                                        label: 'Rahasia',
                                                    },
                                                    {
                                                        value: 'restricted',
                                                        label: 'Sangat Terbatas',
                                                    },
                                                ]}
                                            />

                                            <Field
                                                label="Yurisdiksi Hukum"
                                                name="jurisdiction"
                                                placeholder="Contoh: DKI Jakarta, RI"
                                                error={errors.jurisdiction}
                                            />
                                        </div>
                                    </div>

                                    {/* Subsection D: Ringkasan */}
                                    <div className="border-t border-slate-100 pt-3.5 dark:border-white/[0.04]">
                                        <div className="grid gap-1.5">
                                            <Label
                                                htmlFor="summary"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Ringkasan &amp; Lingkup
                                                Penanganan Perkara
                                            </Label>
                                            <textarea
                                                id="summary"
                                                name="summary"
                                                rows={3}
                                                placeholder="Jelaskan secara ringkas latar belakang kasus hukum dan batasan penanganan..."
                                                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-900 outline-hidden transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                            />
                                            <InputError
                                                message={errors.summary}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center dark:border-white/[0.04]">
                                        <p className="text-[11px] text-slate-400">
                                            Pastikan parameter dan data telah
                                            sesuai sebelum menyimpan.
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                                asChild
                                            >
                                                <Link
                                                    href={matterRoutes.index()}
                                                >
                                                    Batal
                                                </Link>
                                            </Button>

                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={
                                                    processing ||
                                                    !isConflictCleared
                                                }
                                                className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Spinner className="mr-1.5 size-3" />
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
        <div className={`grid gap-1 ${className ?? ''}`}>
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
            >
                {label}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
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
        <div className="grid gap-1">
            <div className="flex items-center justify-between">
                <Label
                    htmlFor={name}
                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                >
                    {label}
                </Label>
                {optional && (
                    <span className="text-[10px] text-slate-400">Opsional</span>
                )}
            </div>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    required={!optional}
                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                >
                    <option value="">
                        {optional ? 'Tidak ditentukan' : 'Pilih...'}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
            </div>
            <InputError message={error} />
        </div>
    );
}

MatterCreate.layout = {
    breadcrumbs: [
        { title: 'Perkara', href: matterRoutes.index() },
        { title: 'Registrasi Perkara Baru', href: matterRoutes.create() },
    ],
};
