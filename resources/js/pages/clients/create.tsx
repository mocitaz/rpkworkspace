import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    ChevronDown,
    FileText,
    Globe,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    ContactRound,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import * as clientRoutes from '@/routes/clients';

type Partner = {
    id: number;
    name: string;
    position_title?: string;
    avatar_path?: string | null;
};

export default function ClientCreate({ partners }: { partners: Partner[] }) {
    return (
        <>
            <Head title="Registrasi Klien Baru" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* Header with Navigation */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Registrasi Klien Baru
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Nomor klien unik (contoh:{' '}
                                <strong className="font-mono text-slate-700 dark:text-zinc-300">
                                    RPK-C-2026-XXXX
                                </strong>
                                ) akan dibuat otomatis oleh sistem.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center">
                            <Button
                                variant="outline"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                asChild
                            >
                                <Link href={clientRoutes.index()}>
                                    <ArrowLeft className="mr-1 size-3.5 text-slate-400" />
                                    Kembali ke Direktori Klien
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Form Section */}
                    <Form {...clientRoutes.store.form()} className="space-y-4">
                        {({ errors, processing }) => (
                            <>
                                {/* Tahap 1: Identitas & Klasifikasi Entitas */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Tahap 1: Identitas &amp;
                                                Klasifikasi Entitas
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                                        <SelectField
                                            label="Tipe Klien"
                                            name="type"
                                            defaultValue="organization"
                                            error={errors.type}
                                            options={[
                                                {
                                                    value: 'organization',
                                                    label: 'Badan Hukum / Korporasi',
                                                },
                                                {
                                                    value: 'individual',
                                                    label: 'Individu / Perorangan',
                                                },
                                            ]}
                                        />

                                        <Field
                                            label="Sektor / Bidang Industri"
                                            name="industry"
                                            error={errors.industry}
                                            placeholder="Contoh: Infrastruktur, Energi, Finansial"
                                        />

                                        <Field
                                            label="Nama Tampilan (Display Name)"
                                            name="display_name"
                                            error={errors.display_name}
                                            placeholder="Contoh: Meridian Infrastruktur"
                                            required
                                        />

                                        <Field
                                            label="Nama Legal Lengkap"
                                            name="legal_name"
                                            error={errors.legal_name}
                                            placeholder="Contoh: PT Meridian Infrastruktur Nusantara"
                                            required
                                        />

                                        <Field
                                            label="NPWP"
                                            name="tax_identifier"
                                            error={errors.tax_identifier}
                                            placeholder="Contoh: 01.100.210.7-001.000"
                                        />

                                        <Field
                                            label="Nomor Induk Berusaha (NIB) / No. Akta"
                                            name="registration_identifier"
                                            error={
                                                errors.registration_identifier
                                            }
                                            placeholder="Contoh: AHU-001400.AH.01.01.2026"
                                        />
                                    </div>
                                </section>

                                {/* Tahap 2: Penugasan Partner & Kontak Resmi */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2">
                                            <ContactRound className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Tahap 2: Penugasan Partner &amp;
                                                Komunikasi Resmi
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
                                        <div className="sm:col-span-3">
                                            <SelectField
                                                label="Relationship Partner (Penanggung Jawab)"
                                                name="relationship_partner_id"
                                                error={
                                                    errors.relationship_partner_id
                                                }
                                                optional
                                                options={partners.map(
                                                    (partner) => ({
                                                        value: partner.id,
                                                        label: `${partner.name} ${partner.position_title ? `(${partner.position_title})` : ''}`,
                                                    }),
                                                )}
                                            />
                                        </div>

                                        <Field
                                            label="Email Resmi Kantor"
                                            name="email"
                                            type="email"
                                            error={errors.email}
                                            placeholder="legal@meridian.co.id"
                                        />

                                        <Field
                                            label="Nomor Telepon Kantor"
                                            name="phone"
                                            error={errors.phone}
                                            placeholder="021-5098-1100"
                                        />

                                        <Field
                                            label="Website Perusahaan"
                                            name="website"
                                            type="url"
                                            error={errors.website}
                                            placeholder="https://meridian.co.id"
                                        />
                                    </div>
                                </section>

                                {/* Tahap 3: Domisili & Legalitas */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-4 text-emerald-600 dark:text-emerald-400" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                Tahap 3: Domisili &amp; Ikhtisar
                                                Profil
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
                                        <Field
                                            label="Alamat Gedung / Jalan"
                                            name="address_line_1"
                                            error={errors.address_line_1}
                                            placeholder="Menara Meridian, Jl. Jenderal Sudirman Kav. 45"
                                            className="sm:col-span-3"
                                        />

                                        <Field
                                            label="Lantai / Unit (Opsional)"
                                            name="address_line_2"
                                            error={errors.address_line_2}
                                            placeholder="Lantai 18"
                                            className="sm:col-span-3"
                                        />

                                        <Field
                                            label="Kota / Kabupaten"
                                            name="city"
                                            error={errors.city}
                                            placeholder="Jakarta Selatan"
                                        />

                                        <Field
                                            label="Provinsi"
                                            name="province"
                                            error={errors.province}
                                            placeholder="DKI Jakarta"
                                        />

                                        <Field
                                            label="Kode Pos"
                                            name="postal_code"
                                            error={errors.postal_code}
                                            placeholder="12930"
                                        />

                                        <div className="grid gap-1 sm:col-span-3">
                                            <Label
                                                htmlFor="notes"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Catatan / Ringkasan Klien (KYC
                                                &amp; Latar Belakang)
                                            </Label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                rows={2.5}
                                                placeholder="Tambahkan ikhtisar latar belakang klien, profil beneficial ownership, preferensi komunikasi..."
                                                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-900 outline-hidden transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                            />
                                            <InputError
                                                message={errors.notes}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Action Buttons */}
                                <div className="flex flex-col justify-between gap-3 border-t border-slate-200/60 pt-4 sm:flex-row sm:items-center dark:border-white/[0.06]">
                                    <p className="text-[11px] text-slate-400">
                                        Pastikan data identitas entitas dan
                                        penugasan partner telah sesuai.
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                            asChild
                                        >
                                            <Link href={clientRoutes.index()}>
                                                Batal
                                            </Link>
                                        </Button>

                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={processing}
                                            className="h-8 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-1.5 size-3" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                'Simpan & Buat Klien'
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
    error,
    className,
    type = 'text',
    placeholder,
    required = false,
}: {
    label: string;
    name: string;
    error?: string;
    className?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
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

ClientCreate.layout = {
    breadcrumbs: [
        { title: 'Klien', href: clientRoutes.index() },
        { title: 'Buat Klien Baru', href: clientRoutes.create() },
    ],
};
