import { Form } from '@inertiajs/react';
import { ChevronDown, Pencil, ShieldCheck, UserCheck, Users, X } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
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
import * as matterRoutes from '@/routes/matters';

type Person = { id: number; name: string; position_title?: string; avatar_url?: string | null };
type Matter = {
    id: string;
    title: string;
    summary?: string;
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
}: {
    matter: Matter;
    practiceAreas: { id: number; name: string }[];
    users: Person[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] shadow-2xs hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                >
                    <Pencil className="mr-1.5 size-3.5 text-[#787774]" />
                    Edit Matter
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl sm:max-w-3xl dark:border-white/10 dark:bg-[#1c1c1e]">
                <DialogHeader className="border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                            <Pencil className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold tracking-tight text-[#111111] dark:text-white">
                                Edit Matter & Penugasan Tim
                            </DialogTitle>
                            <DialogDescription className="text-xs text-[#787774] dark:text-zinc-400">
                                Perubahan data perkara dan susunan advokat akan disimpan dalam log audit internal.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    {...matterRoutes.update.form(matter.id)}
                    className="space-y-5 pt-1"
                    onSuccess={() => setOpen(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            {/* Section 1: Informasi Utama */}
                            <div className="space-y-3.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#787774]">
                                    Informasi & Tata Kelola Perkara
                                </span>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label="Judul Perkara"
                                        name="title"
                                        value={matter.title}
                                        error={errors.title}
                                        required
                                        className="sm:col-span-2"
                                    />

                                    <Select
                                        label="Area Praktik"
                                        name="practice_area_id"
                                        value={matter.practice_area_id?.toString() ?? ''}
                                        error={errors.practice_area_id}
                                        optional
                                        options={practiceAreas.map((item) => [item.id, item.name])}
                                    />

                                    <Field
                                        label="Jenis Perkara"
                                        name="matter_type"
                                        value={matter.matter_type}
                                        error={errors.matter_type}
                                        placeholder="Contoh: EPC Contract & Land Acquisition"
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

                                    <Select
                                        label="Responsible Partner"
                                        name="responsible_partner_id"
                                        value={matter.responsible_partner_id.toString()}
                                        error={errors.responsible_partner_id}
                                        options={users.map(userOption)}
                                    />

                                    <Select
                                        label="Supervising Lawyer"
                                        name="supervising_lawyer_id"
                                        value={matter.supervising_lawyer_id?.toString() ?? ''}
                                        error={errors.supervising_lawyer_id}
                                        optional
                                        options={users.map(userOption)}
                                    />

                                    <Field
                                        label="Tanggal Dibuka"
                                        name="opened_at"
                                        type="date"
                                        value={matter.opened_at?.slice(0, 10)}
                                        error={errors.opened_at}
                                    />

                                    <Field
                                        label="Tanggal Ditutup"
                                        name="closed_at"
                                        type="date"
                                        value={matter.closed_at?.slice(0, 10)}
                                        error={errors.closed_at}
                                    />

                                    <Field
                                        label="Yurisdiksi"
                                        name="jurisdiction"
                                        value={matter.jurisdiction}
                                        error={errors.jurisdiction}
                                        placeholder="Indonesia"
                                    />

                                    <Field
                                        label="Pengadilan / Forum"
                                        name="court"
                                        value={matter.court}
                                        error={errors.court}
                                        placeholder="Pengadilan Negeri / Non-litigasi"
                                    />

                                    <Field
                                        label="Nomor Perkara Eksternal"
                                        name="external_case_number"
                                        value={matter.external_case_number}
                                        error={errors.external_case_number}
                                        placeholder="Nomor register perkara luar"
                                    />

                                    <div className="grid gap-1.5 sm:col-span-2">
                                        <Label htmlFor="matter-summary" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                            Ringkasan & Lingkup Perkara
                                        </Label>
                                        <textarea
                                            id="matter-summary"
                                            name="summary"
                                            rows={3}
                                            defaultValue={matter.summary}
                                            placeholder="Deskripsi ringkas ruang lingkup perkara..."
                                            className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs leading-relaxed text-[#111111] outline-none transition-colors placeholder:text-[#787774] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
                                        />
                                        <InputError message={errors.summary} />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Anggota Tim Advokat */}
                            <div className="space-y-3 rounded-xl border border-black/[0.06] bg-[#fafafa] p-4 dark:border-white/[0.06] dark:bg-zinc-900/40">
                                <div>
                                    <h4 className="text-xs font-semibold text-[#111111] dark:text-white">
                                        Susunan Tim Advokat
                                    </h4>
                                    <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                        Centang advokat yang bertugas aktif menangani perkara ini.
                                    </p>
                                </div>

                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {users.map((user) => (
                                        <label
                                            key={user.id}
                                            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-black/[0.06] bg-white p-2 transition-colors hover:border-black/20 dark:border-white/[0.06] dark:bg-[#1c1c1e] dark:hover:border-white/20"
                                        >
                                            <Checkbox
                                                name="member_ids[]"
                                                value={user.id}
                                                defaultChecked={matter.members.some((m) => m.id === user.id)}
                                                className="size-3.5 rounded border-zinc-300 text-[#111111]"
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-semibold text-[#111111] dark:text-white">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-[10px] text-[#787774] dark:text-zinc-400">
                                                    {user.position_title ?? 'Advokat'}
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.member_ids} />
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-end gap-2 border-t border-black/[0.04] pt-3 dark:border-white/[0.06]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="h-8 rounded-lg border-black/10 bg-white px-3 text-xs font-medium text-[#111111] hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
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
    return [user.id, `${user.name}${user.position_title ? ` — ${user.position_title}` : ''}`];
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
        <div className={`grid gap-1.5 ${className ?? ''}`}>
            <Label htmlFor={name} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={value}
                required={required}
                placeholder={placeholder}
                className="h-8 rounded-lg border-black/[0.08] bg-[#fbfbfa] text-xs text-[#111111] transition-colors focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
            />
            <InputError message={error} />
        </div>
    );
}

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
    options: (string | number)[][];
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
                    defaultValue={value}
                    required={!optional}
                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200 dark:hover:bg-white/[0.04]"
                >
                    {optional && <option value="">Tidak ditentukan</option>}
                    {options.map(([optValue, text]) => (
                        <option key={optValue} value={optValue}>
                            {text}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-[#787774]" />
            </div>
            <InputError message={error} />
        </div>
    );
}
