import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    CheckCircle2,
    ChevronDown,
    ExternalLink,
    FileCheck,
    Info,
    Lock,
    Scale,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
    Users,
    Zap,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoneyInput } from '@/components/ui/money-input';
import { Spinner } from '@/components/ui/spinner';
import UserPicker, { type UserOption } from '@/components/user-picker';
import * as matterRoutes from '@/routes/matters';
import * as conflictRoutes from '@/routes/matters/conflict-checks';
import * as governanceConflictRoutes from '@/routes/governance/conflict-checks';

type Choice = {
    id: number | string;
    name?: string;
    display_name?: string;
    client_number?: string;
    position_title?: string;
    department?: string;
    avatar_path?: string | null;
    email?: string;
};

type MatchItem = {
    id?: string | number;
    type: string;
    name: string;
    searched_query?: string;
    risk: 'clear' | 'potential_match' | 'blocked';
    similarity?: number;
    role_label?: string;
    matter_id?: string;
    matter_number?: string;
    matter_title?: string;
    matter_status?: string;
    responsible_partner?: string;
    details?: string;
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
        matches: MatchItem[];
        decision_note?: string;
        expires_at?: string;
    } | null;
    canRunConflictCheck: boolean;
}) {
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewResult, setPreviewResult] = useState<{
        status: string;
        match_count: number;
        matches: MatchItem[];
    } | null>(null);

    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [adverseNames, setAdverseNames] = useState<string[]>([
        '',
        '',
        '',
        '',
    ]);
    const [responsiblePartnerId, setResponsiblePartnerId] =
        useState<string>('');
    const [supervisingLawyerId, setSupervisingLawyerId] = useState<string>('');

    const isConflictCleared =
        conflictCheck &&
        (conflictCheck.status === 'clear' ||
            conflictCheck.decision === 'waived');

    const runLiveScan = async () => {
        const activeNames = adverseNames
            .map((n) => n.trim())
            .filter((n) => n.length > 0);
        if (activeNames.length === 0 && !selectedClientId) return;

        setPreviewLoading(true);
        try {
            const res = await fetch(governanceConflictRoutes.preview.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({
                    client_id: selectedClientId || undefined,
                    names: activeNames,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setPreviewResult(data);
            }
        } catch (e) {
            console.error('Error running live scan:', e);
        } finally {
            setPreviewLoading(false);
        }
    };

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
                                <Link href={matterRoutes.index.url()}>
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
                            <div className="mt-3 space-y-3">
                                <div
                                    className={`flex items-start gap-3 rounded-lg border p-3 text-xs ${
                                        isConflictCleared
                                            ? 'border-emerald-500/20 bg-emerald-50/60 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-200'
                                            : conflictCheck.status === 'blocked'
                                              ? 'border-rose-500/20 bg-rose-50/60 text-rose-900 dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-200'
                                              : 'border-amber-500/20 bg-amber-50/60 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-200'
                                    }`}
                                >
                                    {isConflictCleared ? (
                                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <ShieldAlert className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                    )}

                                    <div className="flex-1 space-y-1.5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
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
                                                    <span className="py-0.2 rounded bg-amber-500/20 px-1.5 font-mono text-[9px] font-bold text-amber-800 uppercase dark:text-amber-300">
                                                        Waiver Disetujui Partner
                                                    </span>
                                                )}
                                            </div>

                                            <Link
                                                href={governanceConflictRoutes.certificate.url(
                                                    conflictCheck.id,
                                                )}
                                                target="_blank"
                                                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-[10.5px] font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                            >
                                                <FileCheck className="size-3 text-blue-600 dark:text-blue-400" />
                                                Buka Sertifikat Resmi
                                                <ExternalLink className="size-2.5 text-slate-400" />
                                            </Link>
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

                                        {conflictCheck.matches &&
                                            conflictCheck.matches.length >
                                                0 && (
                                                <div className="mt-2 space-y-1 rounded-lg border border-slate-200/60 bg-white/70 p-2 dark:border-white/10 dark:bg-black/20">
                                                    <p className="text-[10.5px] font-bold text-slate-700 dark:text-zinc-300">
                                                        Daftar Entitas yang
                                                        Cocok (
                                                        {
                                                            conflictCheck
                                                                .matches.length
                                                        }
                                                        ):
                                                    </p>
                                                    <div className="max-h-28 space-y-1 overflow-y-auto">
                                                        {conflictCheck.matches.map(
                                                            (m, i) => (
                                                                <div
                                                                    key={i}
                                                                    className="flex items-center justify-between text-[10px]"
                                                                >
                                                                    <span className="font-medium">
                                                                        •{' '}
                                                                        {m.name}{' '}
                                                                        (
                                                                        {m.role_label ??
                                                                            m.type}
                                                                        )
                                                                    </span>
                                                                    {m.similarity && (
                                                                        <span className="font-mono font-bold text-slate-500">
                                                                            {
                                                                                m.similarity
                                                                            }
                                                                            %
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ) : canRunConflictCheck ? (
                            <Form
                                action={conflictRoutes.store.url()}
                                method="post"
                                className="mt-3 space-y-3.5"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="sm:col-span-2">
                                                <div className="grid gap-1">
                                                    <Label
                                                        htmlFor="conflict_client_id"
                                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                                    >
                                                        Klien yang Diperiksa
                                                    </Label>
                                                    <div className="relative">
                                                        <select
                                                            id="conflict_client_id"
                                                            name="client_id"
                                                            value={
                                                                selectedClientId
                                                            }
                                                            onChange={(e) =>
                                                                setSelectedClientId(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-8 pl-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                                                        >
                                                            <option value="">
                                                                -- Pilih Klien
                                                                --
                                                            </option>
                                                            {clients.map(
                                                                (item) => (
                                                                    <option
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        {
                                                                            item.client_number
                                                                        }{' '}
                                                                        -{' '}
                                                                        {
                                                                            item.display_name
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                                                    </div>
                                                    <InputError
                                                        message={
                                                            errors.client_id
                                                        }
                                                    />
                                                </div>
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
                                                                value={
                                                                    adverseNames[
                                                                        index
                                                                    ]
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const updated =
                                                                        [
                                                                            ...adverseNames,
                                                                        ];
                                                                    updated[
                                                                        index
                                                                    ] =
                                                                        e.target.value;
                                                                    setAdverseNames(
                                                                        updated,
                                                                    );
                                                                }}
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

                                        {/* Clean Conflict Check Inline Toolbar & Results */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-slate-50/60 px-3 py-2 text-xs dark:border-white/10 dark:bg-[#121418]">
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
                                                    <Scale className="size-3.5 text-slate-500 dark:text-zinc-400" />
                                                    <span className="font-medium text-slate-700 dark:text-zinc-300">
                                                        Pemeriksaan Benturan
                                                        Kepentingan
                                                    </span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={
                                                        previewLoading ||
                                                        (!selectedClientId &&
                                                            !adverseNames.some(
                                                                (n) =>
                                                                    n.trim()
                                                                        .length >
                                                                    0,
                                                            ))
                                                    }
                                                    onClick={runLiveScan}
                                                    className="h-7 rounded-md px-2.5 text-xs font-semibold text-slate-700 hover:bg-white hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                                                >
                                                    {previewLoading ? (
                                                        <>
                                                            <Spinner className="mr-1.5 size-3" />
                                                            Memeriksa
                                                            database...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Scale className="mr-1.5 size-3 text-slate-500" />
                                                            Cek Konflik
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                            {previewResult && (
                                                <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-white/10 dark:bg-[#121418]">
                                                    {previewResult.matches
                                                        .length > 0 ? (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                                    Ditemukan{' '}
                                                                    {
                                                                        previewResult.match_count
                                                                    }{' '}
                                                                    entitas
                                                                    serupa di
                                                                    database:
                                                                </span>
                                                                <span
                                                                    className={`rounded px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase ${
                                                                        previewResult.status ===
                                                                        'blocked'
                                                                            ? 'border border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                                                            : 'border border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                                                    }`}
                                                                >
                                                                    {previewResult.status ===
                                                                    'blocked'
                                                                        ? 'Benturan Langsung'
                                                                        : 'Potensi Benturan'}
                                                                </span>
                                                            </div>
                                                            <div className="max-h-28 space-y-1 overflow-y-auto pr-1">
                                                                {previewResult.matches.map(
                                                                    (m, i) => (
                                                                        <div
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="flex items-start justify-between gap-2 rounded border border-slate-100 bg-slate-50/70 p-1.5 text-[10.5px] dark:border-white/5 dark:bg-zinc-800/60"
                                                                        >
                                                                            <div className="min-w-0 flex-1">
                                                                                <div className="flex items-center gap-1.5">
                                                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                                                        {
                                                                                            m.name
                                                                                        }
                                                                                    </span>
                                                                                    <span className="py-0.2 rounded bg-slate-200/70 px-1 text-[9px] font-semibold text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
                                                                                        {m.role_label ??
                                                                                            m.type}
                                                                                    </span>
                                                                                </div>
                                                                                {m.details && (
                                                                                    <p className="mt-0.5 text-[9.5px] text-slate-500 dark:text-zinc-400">
                                                                                        {
                                                                                            m.details
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <span className="shrink-0 font-mono text-[9.5px] font-bold text-slate-700 dark:text-zinc-300">
                                                                                {
                                                                                    m.similarity
                                                                                }
                                                                                %
                                                                            </span>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-zinc-200">
                                                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                <span>
                                                                    Hasil
                                                                    pemeriksaan
                                                                    bersih
                                                                    (Nihil
                                                                    benturan
                                                                    kepentingan)
                                                                </span>
                                                            </div>
                                                            <span className="font-mono text-[10px] font-bold text-emerald-700 uppercase dark:text-emerald-400">
                                                                Clear
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
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
                                                Simpan &amp; Lanjutkan Intake
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
                            action={matterRoutes.store.url()}
                            method="post"
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

                                    {/* Subsection B: Informasi Kontrak */}
                                    <div className="border-t border-slate-100 pt-3.5 dark:border-white/[0.04]">
                                        <h3 className="mb-2.5 text-[11px] font-bold text-slate-500 uppercase dark:text-zinc-400">
                                            B. Informasi Kontrak &amp; Keuangan
                                        </h3>
                                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                            <div className="space-y-1.5 sm:col-span-2">
                                                <Label
                                                    htmlFor="budget_amount"
                                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                                >
                                                    Nilai Kontrak
                                                </Label>
                                                <MoneyInput
                                                    id="budget_amount"
                                                    name="budget_amount"
                                                    prefixText="Rp"
                                                    placeholder="0"
                                                />
                                                <InputError
                                                    message={
                                                        errors.budget_amount
                                                    }
                                                />
                                            </div>

                                            <SelectField
                                                label="Mata Uang"
                                                name="currency"
                                                defaultValue="IDR"
                                                error={errors.currency}
                                                options={[
                                                    {
                                                        value: 'IDR',
                                                        label: 'IDR — Rupiah',
                                                    },
                                                    {
                                                        value: 'USD',
                                                        label: 'USD — US Dollar',
                                                    },
                                                    {
                                                        value: 'SGD',
                                                        label: 'SGD — Singapore Dollar',
                                                    },
                                                ]}
                                            />

                                            <Field
                                                label="Tanggal Kontrak"
                                                name="contract_date"
                                                type="date"
                                                error={errors.contract_date}
                                            />

                                            <div className="sm:col-span-2 lg:col-span-2">
                                                <SelectField
                                                    label="Model Penagihan"
                                                    name="billing_model"
                                                    defaultValue=""
                                                    optional
                                                    error={errors.billing_model}
                                                    options={[
                                                        {
                                                            value: '',
                                                            label: '— Belum ditentukan —',
                                                        },
                                                        {
                                                            value: 'fixed_fee',
                                                            label: 'Fixed Fee',
                                                        },
                                                        {
                                                            value: 'retainer',
                                                            label: 'Retainer',
                                                        },
                                                        {
                                                            value: 'hourly',
                                                            label: 'Hourly Rate',
                                                        },
                                                        {
                                                            value: 'milestone',
                                                            label: 'Per Tahapan / Milestone',
                                                        },
                                                        {
                                                            value: 'success_fee',
                                                            label: 'Success Fee',
                                                        },
                                                        {
                                                            value: 'hybrid',
                                                            label: 'Hybrid',
                                                        },
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                        <p className="mt-2 text-[10.5px] text-slate-400 dark:text-zinc-500">
                                            Nilai kontrak menjadi dasar analisis
                                            profitabilitas dan tidak dihitung
                                            dari total invoice.
                                        </p>
                                    </div>

                                    {/* Subsection B: Penugasan Advokat */}
                                    <div className="border-t border-slate-100 pt-3.5 dark:border-white/[0.04]">
                                        <h3 className="mb-2.5 text-[11px] font-bold text-slate-500 uppercase dark:text-zinc-400">
                                            B. Penugasan Advokat &amp; Tim Hukum
                                        </h3>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor="responsible_partner_id"
                                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                                >
                                                    Partner Penanggung Jawab{' '}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <input
                                                    type="hidden"
                                                    name="responsible_partner_id"
                                                    value={responsiblePartnerId}
                                                />
                                                <UserPicker
                                                    id="responsible_partner_id"
                                                    value={responsiblePartnerId}
                                                    onChange={
                                                        setResponsiblePartnerId
                                                    }
                                                    users={
                                                        users as UserOption[]
                                                    }
                                                    placeholder="Pilih Partner Penanggung Jawab..."
                                                    disabledUserIds={
                                                        supervisingLawyerId
                                                            ? [
                                                                  supervisingLawyerId,
                                                              ]
                                                            : []
                                                    }
                                                    disabledReason="Dipilih sebagai Supervising Lawyer"
                                                    error={Boolean(
                                                        errors.responsible_partner_id,
                                                    )}
                                                />
                                                <InputError
                                                    message={
                                                        errors.responsible_partner_id
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <Label
                                                        htmlFor="supervising_lawyer_id"
                                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                                    >
                                                        Supervising Lawyer
                                                        (Opsional)
                                                    </Label>
                                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                        Opsional
                                                    </span>
                                                </div>
                                                <input
                                                    type="hidden"
                                                    name="supervising_lawyer_id"
                                                    value={supervisingLawyerId}
                                                />
                                                <UserPicker
                                                    id="supervising_lawyer_id"
                                                    value={supervisingLawyerId}
                                                    onChange={
                                                        setSupervisingLawyerId
                                                    }
                                                    users={
                                                        users as UserOption[]
                                                    }
                                                    placeholder="Pilih Supervising Lawyer (Opsional)..."
                                                    emptyOptionLabel="-- Tanpa Supervising Lawyer --"
                                                    allowClear
                                                    disabledUserIds={
                                                        responsiblePartnerId
                                                            ? [
                                                                  responsiblePartnerId,
                                                              ]
                                                            : []
                                                    }
                                                    disabledReason="Dipilih sebagai Partner Penanggung Jawab"
                                                    error={Boolean(
                                                        errors.supervising_lawyer_id,
                                                    )}
                                                />
                                                <InputError
                                                    message={
                                                        errors.supervising_lawyer_id
                                                    }
                                                />
                                            </div>
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
                                                    href={matterRoutes.index.url()}
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
        { title: 'Perkara', href: matterRoutes.index.url() },
        { title: 'Registrasi Perkara Baru', href: matterRoutes.create.url() },
    ],
};
