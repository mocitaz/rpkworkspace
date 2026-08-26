import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    Calendar,
    Check,
    ChevronDown,
    FolderKanban,
    Gavel,
    Lock,
    Scale,
    Shield,
    ShieldAlert,
    UserCheck,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import * as matterRoutes from '@/routes/matters';

type Person = {
    id: number;
    name: string;
    position_title?: string;
    avatar_url?: string | null;
};

type Client = {
    id: string;
    client_number: string;
    display_name: string;
    type: string;
    legal_name?: string;
};

type PracticeArea = {
    id: number;
    name: string;
};

type Matter = {
    id: string;
    matter_number: string;
    title: string;
    summary?: string;
    client: Client;
    parent_matter_id?: string | null;
    relationship_type?: string;
    practice_area_id?: number;
    matter_type?: string;
    status: string;
    priority: string;
    confidentiality_level: string;
    responsible_partner_id: number;
    supervising_lawyer_id?: number;
    opened_at?: string;
    closed_at?: string;
    jurisdiction?: string;
    court?: string;
    external_case_number?: string;
    members: Person[];
};

export default function MatterEdit({
    matter,
    practiceAreas,
    users,
    parentMatters = [],
}: {
    matter: Matter;
    practiceAreas: PracticeArea[];
    users: Person[];
    parentMatters?: { id: string; matter_number: string; title: string }[];
}) {
    const getInitials = useInitials();
    const [selectedMembers, setSelectedMembers] = useState<number[]>(
        matter.members.map((m) => m.id),
    );

    const toggleMember = (id: number) => {
        setSelectedMembers((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    return (
        <>
            <Head title={`Edit Perkara: ${matter.matter_number}`} />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* Header Navigation */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                    <FolderKanban className="size-3" />
                                    {matter.matter_number}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-white/[0.06] dark:text-zinc-300">
                                    <Building2 className="size-3 text-slate-400" />
                                    {matter.client?.display_name ?? 'Klien Terdaftar'}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Edit Parameter Perkara &amp; Tim Advokat
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Perubahan status perkara dan penugasan tim dicatat ke dalam log audit firma.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center">
                            <Button
                                variant="outline"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                asChild
                            >
                                <Link href={matterRoutes.show.url(matter.id)}>
                                    <ArrowLeft className="mr-1 size-3.5 text-slate-400" />
                                    Kembali ke Detail Perkara
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Main Edit Form */}
                    <Form
                        {...matterRoutes.update.form(matter.id)}
                        className="space-y-5"
                    >
                        {({ errors, processing }) => (
                            <>
                                {/* Section 1: Identitas & Klasifikasi Pokok */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <Briefcase className="size-4 text-blue-600 dark:text-blue-400" />
                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                            1. Identitas Pokok &amp; Klasifikasi Perkara
                                        </h2>
                                    </div>

                                    <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <Field
                                                label="Judul Perkara / Matter"
                                                name="title"
                                                defaultValue={matter.title}
                                                required
                                                error={errors.title}
                                                placeholder="Contoh: Gugatan Wanprestasi Perjanjian Kerjasama Distribusi"
                                            />
                                        </div>

                                        <div>
                                            <div className="grid gap-1">
                                                <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                    Klien Terkait (Terkunci)
                                                </Label>
                                                <div className="flex h-8 items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 text-xs font-medium text-slate-900 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200">
                                                    <span className="truncate">
                                                        {matter.client?.client_number} - {matter.client?.display_name}
                                                    </span>
                                                    <Lock className="size-3 shrink-0 text-slate-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <SelectField
                                                label="Area Praktik Hukum"
                                                name="practice_area_id"
                                                defaultValue={matter.practice_area_id?.toString() ?? ''}
                                                error={errors.practice_area_id}
                                                optional
                                                options={practiceAreas.map((item) => ({
                                                    value: item.id,
                                                    label: item.name,
                                                }))}
                                            />
                                        </div>

                                        <div>
                                            <Field
                                                label="Sub-Tipe / Jenis Matter"
                                                name="matter_type"
                                                defaultValue={matter.matter_type ?? ''}
                                                error={errors.matter_type}
                                                placeholder="Contoh: Commercial Dispute, Advisory, Merger"
                                            />
                                        </div>

                                        <div>
                                            <SelectField
                                                label="Perkara Induk / Parent Matter"
                                                name="parent_matter_id"
                                                defaultValue={matter.parent_matter_id ?? ''}
                                                optional
                                                error={errors.parent_matter_id}
                                                options={[
                                                    {
                                                        value: '',
                                                        label: '— Bukan Perkara Turunan / Standalone —',
                                                    },
                                                    ...parentMatters.map((item) => ({
                                                        value: item.id,
                                                        label: `${item.matter_number} - ${item.title}`,
                                                    })),
                                                ]}
                                            />
                                        </div>

                                        <div>
                                            <SelectField
                                                label="Tipe Relasi Tingkat Perkara"
                                                name="relationship_type"
                                                defaultValue={matter.relationship_type ?? 'related_dispute'}
                                                error={errors.relationship_type}
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
                                                label="Yurisdiksi Hukum"
                                                name="jurisdiction"
                                                defaultValue={matter.jurisdiction ?? ''}
                                                placeholder="Contoh: Indonesia / DKI Jakarta"
                                                error={errors.jurisdiction}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Section 2: Status, Prioritas & Kerahasiaan */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <Scale className="size-4 text-purple-600 dark:text-purple-400" />
                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                            2. Parameter Status, Prioritas &amp; Kerahasiaan
                                        </h2>
                                    </div>

                                    <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
                                        <SelectField
                                            label="Status Perkara"
                                            name="status"
                                            defaultValue={matter.status}
                                            required
                                            error={errors.status}
                                            options={[
                                                { value: 'prospective', label: 'Prospektif' },
                                                { value: 'active', label: 'Aktif' },
                                                { value: 'on_hold', label: 'Ditunda' },
                                                { value: 'closed', label: 'Ditutup' },
                                                { value: 'archived', label: 'Diarsipkan' },
                                            ]}
                                        />

                                        <SelectField
                                            label="Tingkat Prioritas"
                                            name="priority"
                                            defaultValue={matter.priority}
                                            required
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
                                            defaultValue={matter.confidentiality_level}
                                            required
                                            error={errors.confidentiality_level}
                                            options={[
                                                { value: 'standard', label: 'Standar' },
                                                { value: 'confidential', label: 'Rahasia' },
                                                { value: 'restricted', label: 'Sangat Terbatas / Restricted' },
                                            ]}
                                        />
                                    </div>
                                </section>

                                {/* Section 3: Forum Pengadilan & Registrasi */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <Gavel className="size-4 text-amber-600 dark:text-amber-400" />
                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                            3. Forum Pengadilan &amp; Register Eksternal
                                        </h2>
                                    </div>

                                    <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                                        <Field
                                            label="Pengadilan / Lembaga Arbitrase"
                                            name="court"
                                            defaultValue={matter.court ?? ''}
                                            placeholder="PN Jakarta Pusat / BANI / Non-Litigasi"
                                            error={errors.court}
                                        />

                                        <Field
                                            label="No. Register Perkara Eksternal"
                                            name="external_case_number"
                                            defaultValue={matter.external_case_number ?? ''}
                                            placeholder="Contoh: 142/Pdt.G/2026/PN.Jkt.Pst"
                                            error={errors.external_case_number}
                                        />

                                        <Field
                                            label="Tanggal Dibuka"
                                            name="opened_at"
                                            type="date"
                                            defaultValue={matter.opened_at?.slice(0, 10) ?? ''}
                                            error={errors.opened_at}
                                        />

                                        <Field
                                            label="Tanggal Ditutup (Opsional)"
                                            name="closed_at"
                                            type="date"
                                            defaultValue={matter.closed_at?.slice(0, 10) ?? ''}
                                            error={errors.closed_at}
                                        />
                                    </div>
                                </section>

                                {/* Section 4: Kepemimpinan & Supervisi */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                                        <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                            4. Kepemimpinan &amp; Advokat Supervisi
                                        </h2>
                                    </div>

                                    <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                                        <SelectField
                                            label="Partner Penanggung Jawab (Responsible Partner)"
                                            name="responsible_partner_id"
                                            defaultValue={matter.responsible_partner_id?.toString()}
                                            required
                                            error={errors.responsible_partner_id}
                                            options={users.map((item) => ({
                                                value: item.id,
                                                label: `${item.name} ${item.position_title ? `(${item.position_title})` : ''}`,
                                            }))}
                                        />

                                        <SelectField
                                            label="Advokat Supervisi (Supervising Lawyer)"
                                            name="supervising_lawyer_id"
                                            defaultValue={matter.supervising_lawyer_id?.toString() ?? ''}
                                            optional
                                            error={errors.supervising_lawyer_id}
                                            options={users.map((item) => ({
                                                value: item.id,
                                                label: `${item.name} ${item.position_title ? `(${item.position_title})` : ''}`,
                                            }))}
                                        />
                                    </div>
                                </section>

                                {/* Section 5: Susunan Tim Advokat & Kuasa Hukum */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2">
                                            <Users className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                5. Susunan Tim Advokat &amp; Kuasa Hukum
                                            </h2>
                                        </div>
                                        <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                            {selectedMembers.length} Ditugaskan
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                                            Pilih advokat dan staf hukum yang memiliki hak akses dan penugasan pada perkara ini.
                                        </p>

                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {users.map((user) => {
                                                const isChecked = selectedMembers.includes(user.id);
                                                return (
                                                    <label
                                                        key={user.id}
                                                        onClick={() => toggleMember(user.id)}
                                                        className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-2.5 text-xs transition-all ${
                                                            isChecked
                                                                ? 'border-blue-500/60 bg-blue-50/20 shadow-2xs dark:border-blue-500/40 dark:bg-blue-950/10'
                                                                : 'border-slate-200/70 bg-white hover:border-slate-300 dark:border-white/[0.04] dark:bg-[#16181d] dark:hover:border-white/10'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name="member_ids[]"
                                                            value={user.id}
                                                            checked={isChecked}
                                                            onChange={() => {}}
                                                            className="sr-only"
                                                        />
                                                        <div className="flex min-w-0 items-center gap-2.5">
                                                            <Avatar className="size-7 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                                                <AvatarImage src={user.avatar_url ?? undefined} />
                                                                <AvatarFallback className="text-[9px] font-bold">
                                                                    {getInitials(user.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0">
                                                                <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                                                    {user.name}
                                                                </p>
                                                                <p className="truncate text-[10px] text-slate-400">
                                                                    {user.position_title ?? 'Advokat'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className={`flex size-4.5 shrink-0 items-center justify-center rounded-md border ${
                                                                isChecked
                                                                    ? 'border-blue-600 bg-blue-600 text-white'
                                                                    : 'border-slate-300 bg-white dark:border-zinc-700 dark:bg-zinc-800'
                                                            }`}
                                                        >
                                                            {isChecked && <Check className="size-3 stroke-[3]" />}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <InputError message={errors.member_ids} />
                                    </div>
                                </section>

                                {/* Section 6: Ringkasan & Ruang Lingkup */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="grid gap-1.5">
                                        <Label
                                            htmlFor="summary"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            6. Ringkasan &amp; Ruang Lingkup Penanganan Perkara
                                        </Label>
                                        <textarea
                                            id="summary"
                                            name="summary"
                                            rows={3.5}
                                            defaultValue={matter.summary ?? ''}
                                            placeholder="Deskripsikan fakta hukum, isu pokok, dan batasan ruang lingkup penanganan..."
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-900 outline-hidden transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        />
                                        <InputError message={errors.summary} />
                                    </div>
                                </section>

                                {/* Action Buttons */}
                                <div className="flex flex-col justify-between gap-3 border-t border-slate-200/60 pt-4 sm:flex-row sm:items-center dark:border-white/[0.06]">
                                    <p className="text-[11px] text-slate-400">
                                        Seluruh perubahan akan dicatat ke dalam audit trail firma secara otomatis.
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8.5 rounded-lg border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                            asChild
                                        >
                                            <Link href={matterRoutes.show.url(matter.id)}>
                                                Batal
                                            </Link>
                                        </Button>

                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={processing}
                                            className="h-8.5 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-1.5 size-3" />
                                                    Menyimpan Perubahan...
                                                </>
                                            ) : (
                                                'Simpan Perubahan Perkara'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </main>
            </div>
        </>
    );
}

function Field({
    label,
    name,
    defaultValue,
    error,
    required = false,
    className,
    type = 'text',
    placeholder,
}: {
    label: string;
    name: string;
    defaultValue?: string;
    error?: string;
    required?: boolean;
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
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
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
    defaultValue = '',
    error,
    options,
    required = false,
    optional = false,
}: {
    label: string;
    name: string;
    defaultValue?: string;
    error?: string;
    options: { value: string | number; label: string }[];
    required?: boolean;
    optional?: boolean;
}) {
    return (
        <div className="grid gap-1">
            <div className="flex items-center justify-between">
                <Label
                    htmlFor={name}
                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                >
                    {label} {required && <span className="text-rose-500">*</span>}
                </Label>
                {optional && <span className="text-[10px] text-slate-400">Opsional</span>}
            </div>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    required={required}
                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                >
                    {optional && <option value="">Tidak ditentukan</option>}
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

MatterEdit.layout = {
    breadcrumbs: [
        { title: 'Perkara', href: matterRoutes.index.url() },
        { title: 'Edit Perkara', href: '#' },
    ],
};
