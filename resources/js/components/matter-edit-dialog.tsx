import { Form } from '@inertiajs/react';
import {
    Briefcase,
    Calendar,
    Check,
    ChevronDown,
    Gavel,
    Pencil,
    Scale,
    Shield,
    ShieldAlert,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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

type Matter = {
    id: string;
    title: string;
    summary?: string;
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

export function MatterEditDialog({
    matter,
    practiceAreas,
    users,
    parentMatters = [],
}: {
    matter: Matter;
    practiceAreas: { id: number; name: string }[];
    users: Person[];
    parentMatters?: { id: string; matter_number: string; title: string }[];
}) {
    const getInitials = useInitials();
    const [open, setOpen] = useState(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 cursor-pointer rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                >
                    <Pencil className="mr-1 size-3 text-slate-400" />
                    Edit Perkara
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-2xl dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <Scale className="size-3.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Edit Parameter Perkara &amp; Tim Advokat
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Perubahan status perkara dan penugasan tim
                                dicatat ke dalam log audit firma.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    action={matterRoutes.update.url(matter.id)}
                    method="put"
                    className="space-y-4 pt-1"
                    onSuccess={() => setOpen(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            {/* Section 1: Informasi & Klasifikasi Perkara */}
                            <div className="space-y-2.5">
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    1. Informasi &amp; Tata Kelola Perkara
                                </span>

                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <Field
                                        label="Judul Perkara"
                                        name="title"
                                        value={matter.title}
                                        error={errors.title}
                                        required
                                        className="sm:col-span-2"
                                        placeholder="Contoh: Sengketa Wanprestasi Perjanjian Kerjasama"
                                    />

                                    <Select
                                        label="Area Praktik"
                                        name="practice_area_id"
                                        value={
                                            matter.practice_area_id?.toString() ??
                                            ''
                                        }
                                        error={errors.practice_area_id}
                                        optional
                                        options={practiceAreas.map((item) => [
                                            item.id,
                                            item.name,
                                        ])}
                                    />

                                    <Field
                                        label="Sub-Tipe Perkara"
                                        name="matter_type"
                                        value={matter.matter_type}
                                        error={errors.matter_type}
                                        placeholder="Contoh: Commercial Dispute"
                                    />

                                    <Select
                                        label="Perkara Induk / Parent Matter (Opsional)"
                                        name="parent_matter_id"
                                        value={matter.parent_matter_id ?? ''}
                                        error={errors.parent_matter_id}
                                        optional
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

                                    <Select
                                        label="Tipe Relasi Tingkat Perkara"
                                        name="relationship_type"
                                        value={
                                            matter.relationship_type ??
                                            'related_dispute'
                                        }
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

                                    <Select
                                        label="Status Perkara"
                                        name="status"
                                        value={matter.status}
                                        error={errors.status}
                                        options={statusOptions}
                                    />

                                    <Select
                                        label="Prioritas"
                                        name="priority"
                                        value={matter.priority}
                                        error={errors.priority}
                                        options={priorityOptions}
                                    />

                                    <Select
                                        label="Tingkat Kerahasiaan"
                                        name="confidentiality_level"
                                        value={matter.confidentiality_level}
                                        error={errors.confidentiality_level}
                                        options={confidentialityOptions}
                                    />

                                    <Field
                                        label="Yurisdiksi Hukum"
                                        name="jurisdiction"
                                        value={matter.jurisdiction}
                                        error={errors.jurisdiction}
                                        placeholder="Indonesia / DKI Jakarta"
                                    />
                                </div>
                            </div>

                            {/* Section 2: Forum Sidang & Register Eksternal */}
                            <div className="space-y-2.5">
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    2. Forum Pengadilan &amp; Register Eksternal
                                </span>

                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <Field
                                        label="Pengadilan / Lembaga Arbitrase"
                                        name="court"
                                        value={matter.court}
                                        error={errors.court}
                                        placeholder="PN Jakarta Pusat / BANI / Non-Litigasi"
                                    />

                                    <Field
                                        label="No. Register Perkara Eksternal"
                                        name="external_case_number"
                                        value={matter.external_case_number}
                                        error={errors.external_case_number}
                                        placeholder="Contoh: 142/Pdt.G/2026/PN.Jkt.Pst"
                                    />

                                    <Field
                                        label="Tanggal Dibuka"
                                        name="opened_at"
                                        type="date"
                                        value={matter.opened_at?.slice(0, 10)}
                                        error={errors.opened_at}
                                    />

                                    <Field
                                        label="Tanggal Ditutup (Opsional)"
                                        name="closed_at"
                                        type="date"
                                        value={matter.closed_at?.slice(0, 10)}
                                        error={errors.closed_at}
                                    />
                                </div>
                            </div>

                            {/* Section 3: Responsible Partner & Lead Supervisi */}
                            <div className="space-y-2.5">
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    3. Kepemimpinan &amp; Advokat Supervisi
                                </span>

                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <Select
                                        label="Responsible Partner (Penanggung Jawab)"
                                        name="responsible_partner_id"
                                        value={matter.responsible_partner_id.toString()}
                                        error={errors.responsible_partner_id}
                                        options={users.map(userOption)}
                                    />

                                    <Select
                                        label="Supervising Lawyer"
                                        name="supervising_lawyer_id"
                                        value={
                                            matter.supervising_lawyer_id?.toString() ??
                                            ''
                                        }
                                        error={errors.supervising_lawyer_id}
                                        optional
                                        options={users.map(userOption)}
                                    />
                                </div>
                            </div>

                            {/* Section 4: Tim Advokat (Interactive Compact Selection) */}
                            <div className="space-y-2 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 dark:border-white/[0.06] dark:bg-[#121418]">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                        Susunan Tim Advokat &amp; Kuasa Hukum
                                    </span>
                                    <span className="rounded-md bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                        {selectedMembers.length} Ditugaskan
                                    </span>
                                </div>

                                <div className="grid gap-1.5 sm:grid-cols-2">
                                    {users.map((user) => {
                                        const isChecked =
                                            selectedMembers.includes(user.id);
                                        return (
                                            <label
                                                key={user.id}
                                                onClick={() =>
                                                    toggleMember(user.id)
                                                }
                                                className={`group flex cursor-pointer items-center justify-between gap-2 rounded-lg border p-2 text-xs transition-all ${
                                                    isChecked
                                                        ? 'border-blue-500/60 bg-white shadow-2xs dark:border-blue-500/40 dark:bg-[#16181d]'
                                                        : 'border-slate-200/70 bg-white/70 hover:border-slate-300 dark:border-white/[0.04] dark:bg-[#14161b]'
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
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <Avatar className="size-6 shrink-0 rounded-full border border-slate-200 dark:border-white/10">
                                                        <AvatarImage
                                                            src={
                                                                user.avatar_url ??
                                                                undefined
                                                            }
                                                        />
                                                        <AvatarFallback className="text-[8px] font-bold">
                                                            {getInitials(
                                                                user.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                                            {user.name}
                                                        </p>
                                                        <p className="truncate text-[10px] text-slate-400">
                                                            {user.position_title ??
                                                                'Advokat'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                                                        isChecked
                                                            ? 'border-blue-600 bg-blue-600 text-white'
                                                            : 'border-slate-300 bg-white dark:border-zinc-700 dark:bg-zinc-800'
                                                    }`}
                                                >
                                                    {isChecked && (
                                                        <Check className="size-3 stroke-[3]" />
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                                <InputError message={errors.member_ids} />
                            </div>

                            {/* Section 5: Ringkasan & Ruang Lingkup */}
                            <div className="grid gap-1">
                                <Label
                                    htmlFor="matter-summary"
                                    className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                >
                                    Ringkasan &amp; Lingkup Perkara
                                </Label>
                                <textarea
                                    id="matter-summary"
                                    name="summary"
                                    rows={2.5}
                                    defaultValue={matter.summary}
                                    placeholder="Deskripsikan fakta hukum dan ruang lingkup penanganan perkara..."
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-900 outline-hidden transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                />
                                <InputError message={errors.summary} />
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-white/[0.06]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setOpen(false)}
                                    className="h-8 rounded-lg border-slate-200 px-3 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-300"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={processing}
                                    className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-1.5 size-3" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Perubahan'
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

const statusOptions = [
    ['prospective', 'Prospektif'],
    ['active', 'Aktif'],
    ['on_hold', 'Ditunda'],
    ['closed', 'Ditutup'],
    ['archived', 'Diarsipkan'],
];

const priorityOptions = [
    ['low', 'Rendah'],
    ['normal', 'Normal'],
    ['high', 'Tinggi'],
    ['critical', 'Kritis'],
];

const confidentialityOptions = [
    ['standard', 'Standar'],
    ['confidential', 'Rahasia'],
    ['highly_confidential', 'Sangat Rahasia'],
];

function userOption(user: Person): [number, string] {
    return [
        user.id,
        `${user.name}${user.position_title ? ` (${user.position_title})` : ''}`,
    ];
}

function Field({
    label,
    name,
    value,
    error,
    required = false,
    className,
    type = 'text',
    placeholder,
}: {
    label: string;
    name: string;
    value?: string;
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
                defaultValue={value}
                required={required}
                placeholder={placeholder}
                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
            />
            <InputError message={error} />
        </div>
    );
}

type SelectOption =
    (string | number)[] | { value: string | number; label: string };

function Select({
    label,
    name,
    value,
    error,
    options,
    optional = false,
}: {
    label: string;
    name: string;
    value?: string;
    error?: string;
    options: SelectOption[];
    optional?: boolean;
}) {
    const normalizedOptions = options.map((opt) => {
        if (Array.isArray(opt)) {
            return { value: opt[0], label: String(opt[1]) };
        }
        return opt;
    });

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
                    defaultValue={value}
                    required={!optional}
                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 outline-hidden transition-colors hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                >
                    {optional && <option value="">Tidak ditentukan</option>}
                    {normalizedOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
            </div>
            <InputError message={error} />
        </div>
    );
}
