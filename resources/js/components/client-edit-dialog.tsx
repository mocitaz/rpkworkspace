import { Form } from '@inertiajs/react';
import { Building2, ChevronDown, Pencil } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import * as clientRoutes from '@/routes/clients';

type Client = {
    id: string;
    type: string;
    legal_name: string;
    display_name: string;
    industry?: string;
    tax_identifier?: string;
    registration_identifier?: string;
    website?: string;
    phone?: string;
    email?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    country_code: string;
    notes?: string;
    status: string;
    relationship_partner_id?: number;
    opened_at?: string;
    closed_at?: string;
};

type Partner = { id: number; name: string; position_title?: string };

export function ClientEditDialog({
    client,
    partners,
}: {
    client: Client;
    partners: Partner[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="h-8.5 rounded-full border-black/10 bg-white px-3.5 text-xs font-medium text-[#1d1d1f] shadow-2xs hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                >
                    <Pencil className="mr-1.5 size-3.5 text-[#86868b]" /> Edit Klien
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl border border-black/10 bg-white p-6 shadow-2xl sm:max-w-3xl dark:border-white/10 dark:bg-[#1c1c1e]">
                <DialogHeader className="border-b border-black/[0.04] pb-4 dark:border-white/[0.04]">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0071e3] dark:bg-blue-950/40 dark:text-[#2997ff]">
                            <Building2 className="size-4.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                                Edit Data & Profil Klien
                            </DialogTitle>
                            <DialogDescription className="text-xs text-[#86868b] dark:text-zinc-400">
                                Perubahan data identitas, kontak, dan penugasan partner akan dicatat ke dalam log audit sistem.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    {...clientRoutes.update.form(client.id)}
                    className="space-y-6 pt-2"
                    onSuccess={() => setOpen(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            {/* Section 1: Identitas & Klasifikasi Entitas */}
                            <div className="space-y-3.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">
                                    Identitas & Klasifikasi Entitas
                                </span>
                                <div className="grid gap-3.5 sm:grid-cols-2">
                                    <SelectField
                                        label="Tipe Klien"
                                        name="type"
                                        defaultValue={client.type}
                                        error={errors.type}
                                        options={[
                                            ['organization', 'Badan Hukum / Korporasi'],
                                            ['individual', 'Individu / Perorangan'],
                                        ]}
                                    />
                                    <SelectField
                                        label="Status Klien"
                                        name="status"
                                        defaultValue={client.status}
                                        error={errors.status}
                                        options={[
                                            ['active', 'Aktif'],
                                            ['inactive', 'Tidak Aktif'],
                                            ['closed', 'Ditutup'],
                                        ]}
                                    />
                                    <Field
                                        label="Nama Tampilan (Display Name)"
                                        name="display_name"
                                        defaultValue={client.display_name}
                                        error={errors.display_name}
                                        required
                                    />
                                    <Field
                                        label="Nama Legal Lengkap"
                                        name="legal_name"
                                        defaultValue={client.legal_name}
                                        error={errors.legal_name}
                                        required
                                    />
                                    <Field
                                        label="Sektor / Industri"
                                        name="industry"
                                        defaultValue={client.industry}
                                        error={errors.industry}
                                        className="sm:col-span-2"
                                    />
                                </div>
                            </div>

                            {/* Section 2: Penugasan Partner */}
                            <div className="space-y-3.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">
                                    Penugasan Partner
                                </span>
                                <div className="grid gap-3.5 sm:grid-cols-2">
                                    <SelectField
                                        label="Partner Penanggung Jawab"
                                        name="relationship_partner_id"
                                        defaultValue={client.relationship_partner_id?.toString() ?? ''}
                                        error={errors.relationship_partner_id}
                                        optional
                                        options={partners.map((partner) => [
                                            partner.id,
                                            `${partner.name}${partner.position_title ? ` — ${partner.position_title}` : ''}`,
                                        ])}
                                    />
                                </div>
                            </div>

                            {/* Section 3: Kontak & Domisili Kantor */}
                            <div className="space-y-3.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">
                                    Kontak Resmi & Lokasi Kantor
                                </span>
                                <div className="grid gap-3.5 sm:grid-cols-3">
                                    <Field
                                        label="Email Kantor"
                                        name="email"
                                        type="email"
                                        defaultValue={client.email}
                                        error={errors.email}
                                    />
                                    <Field
                                        label="Telepon Kantor"
                                        name="phone"
                                        defaultValue={client.phone}
                                        error={errors.phone}
                                    />
                                    <Field
                                        label="Website"
                                        name="website"
                                        type="url"
                                        defaultValue={client.website}
                                        error={errors.website}
                                    />
                                    <Field
                                        label="Alamat Gedung / Jalan"
                                        name="address_line_1"
                                        defaultValue={client.address_line_1}
                                        error={errors.address_line_1}
                                        className="sm:col-span-3"
                                    />
                                    <Field
                                        label="Alamat Lanjutan (Opsional)"
                                        name="address_line_2"
                                        defaultValue={client.address_line_2}
                                        error={errors.address_line_2}
                                        className="sm:col-span-3"
                                    />
                                    <Field
                                        label="Kota"
                                        name="city"
                                        defaultValue={client.city}
                                        error={errors.city}
                                    />
                                    <Field
                                        label="Provinsi"
                                        name="province"
                                        defaultValue={client.province}
                                        error={errors.province}
                                    />
                                    <Field
                                        label="Kode Pos"
                                        name="postal_code"
                                        defaultValue={client.postal_code}
                                        error={errors.postal_code}
                                    />
                                </div>
                            </div>

                            {/* Section 4: Legalitas & Catatan */}
                            <div className="space-y-3.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">
                                    Legalitas & Catatan Tambahan
                                </span>
                                <div className="grid gap-3.5 sm:grid-cols-2">
                                    <Field
                                        label="NPWP / Identitas Pajak"
                                        name="tax_identifier"
                                        defaultValue={client.tax_identifier}
                                        error={errors.tax_identifier}
                                    />
                                    <Field
                                        label="Nomor Registrasi / NIB"
                                        name="registration_identifier"
                                        defaultValue={client.registration_identifier}
                                        error={errors.registration_identifier}
                                    />
                                    <Field
                                        label="Tanggal Dibuka"
                                        name="opened_at"
                                        type="date"
                                        defaultValue={client.opened_at?.slice(0, 10)}
                                        error={errors.opened_at}
                                    />
                                    <Field
                                        label="Tanggal Ditutup"
                                        name="closed_at"
                                        type="date"
                                        defaultValue={client.closed_at?.slice(0, 10)}
                                        error={errors.closed_at}
                                    />
                                    <div className="grid gap-1.5 sm:col-span-2">
                                        <Label htmlFor="notes" className="text-xs font-medium text-[#1d1d1f] dark:text-zinc-200">
                                            Catatan / Ringkasan Klien
                                        </Label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows={3}
                                            defaultValue={client.notes}
                                            placeholder="Informasi penting mengenai klien..."
                                            className="w-full rounded-2xl border border-black/10 bg-[#fbfbfd] p-3 text-xs leading-relaxed text-[#1d1d1f] outline-none transition-colors focus:bg-white focus:ring-1 focus:ring-[#0071e3] dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                        />
                                        <InputError message={errors.notes} />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2.5 border-t border-black/[0.04] pt-4 dark:border-white/[0.04]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="h-8.5 rounded-full border-black/10 bg-white px-4 text-xs font-medium text-[#1d1d1f] hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                                >
                                    Batal
                                </Button>
                                <Button
                                    disabled={processing}
                                    className="h-8.5 rounded-full bg-[#0071e3] px-5 text-xs font-medium text-white shadow-2xs hover:bg-[#0077ed] active:scale-95 dark:bg-[#2997ff] dark:text-black"
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

function Field({
    label,
    name,
    defaultValue,
    error,
    required = false,
    className,
    type = 'text',
    maxLength,
}: {
    label: string;
    name: string;
    defaultValue?: string;
    error?: string;
    required?: boolean;
    className?: string;
    type?: string;
    maxLength?: number;
}) {
    return (
        <div className={`grid gap-1.5 ${className ?? ''}`}>
            <Label htmlFor={name} className="text-xs font-medium text-[#1d1d1f] dark:text-zinc-200">
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
                maxLength={maxLength}
                className="h-9 rounded-xl border border-black/10 bg-[#fbfbfd] text-xs text-[#1d1d1f] transition-colors focus:bg-white dark:border-white/10 dark:bg-zinc-800 dark:text-white"
            />
            <InputError message={error} />
        </div>
    );
}

function SelectField({
    label,
    name,
    defaultValue,
    error,
    options,
    optional = false,
}: {
    label: string;
    name: string;
    defaultValue?: string;
    error?: string;
    options: (string | number)[][];
    optional?: boolean;
}) {
    return (
        <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
                <Label htmlFor={name} className="text-xs font-medium text-[#1d1d1f] dark:text-zinc-200">
                    {label}
                </Label>
                {optional && (
                    <span className="text-[10px] text-[#86868b] dark:text-zinc-500">Opsional</span>
                )}
            </div>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    className="h-9 w-full cursor-pointer appearance-none rounded-xl border border-black/10 bg-[#fbfbfd] pl-3 pr-8.5 text-xs font-medium text-[#1d1d1f] outline-none transition-colors hover:bg-zinc-100 focus:bg-white focus:ring-1 focus:ring-[#0071e3] dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                >
                    {optional && <option value="">Tidak ditentukan</option>}
                    {options.map(([value, text]) => (
                        <option key={value} value={value}>
                            {text}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#86868b]" />
            </div>
            <InputError message={error} />
        </div>
    );
}
