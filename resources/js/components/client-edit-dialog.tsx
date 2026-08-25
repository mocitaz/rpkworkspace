import { Form } from '@inertiajs/react';
import { Building2, ChevronDown, Pencil, ShieldAlert, ShieldCheck } from 'lucide-react';
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
import * as clientRoutes from '@/routes/clients';

export type Client = {
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
    kyc_risk_level?: string;
    kyc_status?: string;
    kyc_checklist?: Record<string, boolean> | null;
    kyc_assessed_at?: string;
    kyc_assessed_by?: number;
    kyc_notes?: string;
    status: string;
    relationship_partner_id?: number;
    opened_at?: string;
    closed_at?: string;
};

export type Partner = { id: number; name: string; position_title?: string };

const KYC_DOCUMENT_ITEMS = [
    { key: 'director_id', label: 'Kartu Identitas Direksi & Penanggung Jawab (KTP / Paspor)' },
    { key: 'tax_id', label: 'Nomor Pokok Wajib Pajak (NPWP Korporasi / Perorangan)' },
    { key: 'business_license', label: 'Nomor Induk Berusaha (NIB) / Izin Usaha Sektoral' },
    { key: 'incorporation_deed', label: 'Akta Pendirian Perusahaan & SK Pengesahan Kemenkumham' },
    { key: 'articles_amendment', label: 'Akta Perubahan Anggaran Dasar & Susunan Pengurus (Beneficial Ownership)' },
    { key: 'aml_declaration', label: 'Formulir Deklarasi Kepatuhan Anti-Pencucian Uang (AML Statement)' },
];

export function ClientEditDialog({
    client,
    partners,
    trigger,
    defaultTab,
}: {
    client: Client;
    partners: Partner[];
    trigger?: React.ReactNode;
    defaultTab?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                    >
                        <Pencil className="mr-1 size-3 text-slate-400" />
                        Edit Klien
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-slate-200/80 bg-white p-5 shadow-xl sm:max-w-2xl dark:border-white/10 dark:bg-[#14161b]">
                <DialogHeader className="border-b border-slate-100 pb-3 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <Building2 className="size-3.5" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white">
                                Edit Profil Klien &amp; Kepatuhan KYC
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                Perubahan data identitas, kontak, dan hasil uji tuntas KYC manual dicatat ke audit log.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form
                    {...clientRoutes.update.form(client.id)}
                    className="space-y-4 pt-1"
                    onSuccess={() => setOpen(false)}
                >
                    {({ errors, processing }) => (
                        <>
                            <input type="hidden" name="country_code" value={client.country_code ?? 'ID'} />

                            {Object.keys(errors).length > 0 && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                                    <div className="flex items-center gap-2 font-bold">
                                        <ShieldAlert className="size-4 shrink-0 text-rose-600" />
                                        <span>Gagal memperbarui profil klien:</span>
                                    </div>
                                    <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-[11px]">
                                        {Object.entries(errors).map(([key, msg]) => (
                                            <li key={key}>{msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Section 1: Identitas & Klasifikasi Entitas */}
                            <div className="space-y-2.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    1. Identitas &amp; Klasifikasi Entitas
                                </span>
                                <div className="grid gap-2.5 sm:grid-cols-2">
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
                            <div className="space-y-2.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    2. Penugasan Partner Penanggung Jawab
                                </span>
                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <SelectField
                                        label="Partner Penanggung Jawab"
                                        name="relationship_partner_id"
                                        defaultValue={
                                            client.relationship_partner_id?.toString() ?? ''
                                        }
                                        error={errors.relationship_partner_id}
                                        optional
                                        options={partners.map((partner) => [
                                            partner.id,
                                            `${partner.name}${partner.position_title ? ` (${partner.position_title})` : ''}`,
                                        ])}
                                    />
                                </div>
                            </div>

                            {/* Section 3: Kontak & Domisili Kantor */}
                            <div className="space-y-2.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    3. Kontak Resmi &amp; Domisili Kantor
                                </span>
                                <div className="grid gap-2.5 sm:grid-cols-3">
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

                            {/* Section 4: Legalitas Identitas */}
                            <div className="space-y-2.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    4. Nomor Registrasi &amp; Perpajakan
                                </span>
                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <Field
                                        label="NPWP"
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
                                    <div className="grid gap-1 sm:col-span-2">
                                        <Label
                                            htmlFor="notes"
                                            className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                        >
                                            Catatan / Ringkasan Klien
                                        </Label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            rows={2}
                                            defaultValue={client.notes}
                                            placeholder="Informasi umum mengenai klien..."
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-900 transition-colors outline-hidden focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                        />
                                        <InputError message={errors.notes} />
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: Penilaian Manual KYC & AML */}
                            <div className="space-y-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-white/[0.06] dark:bg-[#121418]">
                                <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2.5 dark:border-white/[0.05]">
                                    <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                            5. Penilaian Kepatuhan KYC &amp; AML Manual
                                        </span>
                                    </div>
                                </div>

                                <div className="grid gap-2.5 sm:grid-cols-2">
                                    <SelectField
                                        label="Status Verifikasi KYC"
                                        name="kyc_status"
                                        defaultValue={client.kyc_status ?? 'verified'}
                                        error={errors.kyc_status}
                                        options={[
                                            ['verified', 'Terverifikasi (Verified)'],
                                            ['in_review', 'Dalam Penelaahan (In Review)'],
                                            ['pending_documents', 'Menunggu Dokumen (Pending)'],
                                            ['rejected', 'Ditolak / Risiko Tinggi (Rejected)'],
                                        ]}
                                    />
                                    <SelectField
                                        label="Tingkat Risiko AML"
                                        name="kyc_risk_level"
                                        defaultValue={client.kyc_risk_level ?? 'low'}
                                        error={errors.kyc_risk_level}
                                        options={[
                                            ['low', 'Risiko Rendah (Low Risk)'],
                                            ['medium', 'Risiko Menengah (Medium Risk)'],
                                            ['high', 'Risiko Tinggi (High Risk - EDD)'],
                                        ]}
                                    />
                                    <SelectField
                                        label="Partner Penilai KYC"
                                        name="kyc_assessed_by"
                                        defaultValue={
                                            client.kyc_assessed_by?.toString() ??
                                            client.relationship_partner_id?.toString() ??
                                            ''
                                        }
                                        error={errors.kyc_assessed_by}
                                        optional
                                        options={partners.map((partner) => [
                                            partner.id,
                                            `${partner.name}${partner.position_title ? ` (${partner.position_title})` : ''}`,
                                        ])}
                                    />
                                    <Field
                                        label="Tanggal Penilaian"
                                        name="kyc_assessed_at"
                                        type="date"
                                        defaultValue={
                                            client.kyc_assessed_at?.slice(0, 10) ??
                                            new Date().toISOString().slice(0, 10)
                                        }
                                        error={errors.kyc_assessed_at}
                                    />
                                </div>

                                {/* Checklist */}
                                <div className="space-y-2 pt-1">
                                    <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                        Checklist Verifikasi Dokumen Legalitas (Manual)
                                    </Label>
                                    <div className="space-y-1.5 rounded-lg border border-slate-200/70 bg-white p-2.5 dark:border-white/10 dark:bg-[#14161b]">
                                        {KYC_DOCUMENT_ITEMS.map((item) => {
                                            const isChecked = client.kyc_checklist
                                                ? Boolean(client.kyc_checklist[item.key])
                                                : true;

                                            return (
                                                <label
                                                    key={item.key}
                                                    className="flex cursor-pointer items-start gap-2 rounded p-1 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name={`kyc_checklist[${item.key}]`}
                                                        value="1"
                                                        defaultChecked={isChecked}
                                                        className="mt-0.5 size-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-slate-700 dark:text-zinc-200">
                                                        {item.label}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* KYC Notes */}
                                <div className="grid gap-1 pt-1">
                                    <Label
                                        htmlFor="kyc_notes"
                                        className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                    >
                                        Catatan Uji Tuntas &amp; Beneficial Ownership
                                    </Label>
                                    <textarea
                                        id="kyc_notes"
                                        name="kyc_notes"
                                        rows={2}
                                        defaultValue={
                                            client.kyc_notes ??
                                            'Klien terverifikasi resmi. Berkas KYC lengkap dan lolos uji tapis AML.'
                                        }
                                        placeholder="Catat temuan uji tuntas, Beneficial Ownership..."
                                        className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs leading-relaxed text-slate-900 transition-colors outline-hidden focus:border-blue-600 dark:border-white/10 dark:bg-[#14161b] dark:text-white"
                                    />
                                    <InputError message={errors.kyc_notes} />
                                </div>
                            </div>

                            {/* Actions */}
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

function Field({
    label,
    name,
    type = 'text',
    defaultValue,
    error,
    required = false,
    className = '',
}: {
    label: string;
    name: string;
    type?: string;
    defaultValue?: string;
    error?: string;
    required?: boolean;
    className?: string;
}) {
    return (
        <div className={`grid gap-1 ${className}`}>
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
                className="h-8 rounded-lg border-slate-200 bg-slate-50/70 text-xs text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
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
    options: [string | number, string][];
    optional?: boolean;
}) {
    return (
        <div className="grid gap-1">
            <Label
                htmlFor={name}
                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
            >
                {label}
            </Label>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    defaultValue={defaultValue ?? ''}
                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-2.5 text-xs font-medium text-slate-900 transition-colors outline-hidden hover:bg-slate-100 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200"
                >
                    {optional && <option value="">-- Tidak Ditugaskan --</option>}
                    {options.map(([val, text]) => (
                        <option key={val} value={val}>
                            {text}
                        </option>
                    ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-slate-400" />
            </div>
            <InputError message={error} />
        </div>
    );
}
