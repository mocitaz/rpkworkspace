import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    ChevronDown,
    ContactRound,
    FileText,
    Mail,
    MapPin,
    ShieldAlert,
    ShieldCheck,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import * as clientRoutes from '@/routes/clients';

type Client = {
    id: string;
    client_number: string;
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

type Partner = {
    id: number;
    name: string;
    position_title?: string;
    avatar_path?: string | null;
};

const KYC_DOCUMENT_ITEMS = [
    {
        key: 'director_id',
        label: 'Kartu Identitas Direksi & Penanggung Jawab (KTP / Paspor)',
    },
    {
        key: 'tax_id',
        label: 'Nomor Pokok Wajib Pajak (NPWP Korporasi / Perorangan)',
    },
    {
        key: 'business_license',
        label: 'Nomor Induk Berusaha (NIB) / Izin Usaha Sektoral',
    },
    {
        key: 'incorporation_deed',
        label: 'Akta Pendirian Perusahaan & SK Pengesahan Kemenkumham',
    },
    {
        key: 'articles_amendment',
        label: 'Akta Perubahan Anggaran Dasar (Beneficial Ownership)',
    },
    {
        key: 'aml_declaration',
        label: 'Formulir Deklarasi Kepatuhan AML (AML Statement)',
    },
];

export default function ClientEdit({
    client,
    partners,
}: {
    client: Client;
    partners: Partner[];
}) {
    return (
        <>
            <Head title={`Edit Klien - ${client.display_name}`} />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-4xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* Header with Navigation */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {client.client_number}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Edit Profil &amp; Penilaian KYC
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Perubahan data dan evaluasi kepatuhan dicatat ke
                                dalam log audit firma hukum.
                            </p>
                        </div>

                        <div className="flex shrink-0 items-center">
                            <Button
                                variant="outline"
                                className="h-8 rounded-lg border-slate-200/80 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-300"
                                asChild
                            >
                                <Link href={clientRoutes.show.url(client.id)}>
                                    <ArrowLeft className="mr-1 size-3.5 text-slate-400" />
                                    Kembali ke Detail Klien
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Form Section */}
                    <Form
                        {...clientRoutes.update.form(client.id)}
                        className="space-y-4"
                    >
                        {({ errors, processing }) => (
                            <>
                                <input
                                    type="hidden"
                                    name="country_code"
                                    value={client.country_code ?? 'ID'}
                                />

                                {Object.keys(errors).length > 0 && (
                                    <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                                        <div className="flex items-center gap-2 font-bold">
                                            <ShieldAlert className="size-4 shrink-0 text-rose-600" />
                                            <span>
                                                Gagal memperbarui profil klien:
                                            </span>
                                        </div>
                                        <ul className="mt-1 list-inside list-disc space-y-0.5 pl-1 text-[11px]">
                                            {Object.entries(errors).map(
                                                ([key, msg]) => (
                                                    <li key={key}>{msg}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* Tahap 1: Identitas & Klasifikasi Entitas */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                1. Identitas &amp; Klasifikasi
                                                Entitas
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                                        <SelectField
                                            label="Tipe Klien"
                                            name="type"
                                            defaultValue={client.type}
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

                                        <SelectField
                                            label="Status Klien"
                                            name="status"
                                            defaultValue={client.status}
                                            error={errors.status}
                                            options={[
                                                {
                                                    value: 'active',
                                                    label: 'Aktif',
                                                },
                                                {
                                                    value: 'inactive',
                                                    label: 'Tidak Aktif',
                                                },
                                                {
                                                    value: 'closed',
                                                    label: 'Ditutup',
                                                },
                                            ]}
                                        />

                                        <Field
                                            label="Nama Tampilan (Display Name)"
                                            name="display_name"
                                            defaultValue={client.display_name}
                                            error={errors.display_name}
                                            placeholder="Contoh: Meridian Infrastruktur"
                                            required
                                        />

                                        <Field
                                            label="Nama Legal Lengkap"
                                            name="legal_name"
                                            defaultValue={client.legal_name}
                                            error={errors.legal_name}
                                            placeholder="Contoh: PT Meridian Infrastruktur Nusantara"
                                            required
                                        />

                                        <Field
                                            label="Sektor / Bidang Industri"
                                            name="industry"
                                            defaultValue={client.industry}
                                            error={errors.industry}
                                            placeholder="Contoh: Infrastruktur, Teknologi"
                                            className="sm:col-span-2"
                                        />
                                    </div>
                                </section>

                                {/* Tahap 2: Penugasan Partner & Kontak Resmi */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2">
                                            <ContactRound className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                2. Penugasan Partner &amp;
                                                Komunikasi Resmi
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
                                        <div className="sm:col-span-3">
                                            <SelectField
                                                label="Partner Penanggung Jawab"
                                                name="relationship_partner_id"
                                                defaultValue={
                                                    client.relationship_partner_id?.toString() ??
                                                    ''
                                                }
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
                                            label="Email Kantor"
                                            name="email"
                                            type="email"
                                            defaultValue={client.email}
                                            error={errors.email}
                                            placeholder="legal@perusahaan.co.id"
                                        />

                                        <Field
                                            label="Nomor Telepon Kantor"
                                            name="phone"
                                            defaultValue={client.phone}
                                            error={errors.phone}
                                            placeholder="+62 21 555-0199"
                                        />

                                        <Field
                                            label="Website Perusahaan"
                                            name="website"
                                            type="url"
                                            defaultValue={client.website}
                                            error={errors.website}
                                            placeholder="https://perusahaan.co.id"
                                        />
                                    </div>
                                </section>

                                {/* Tahap 3: Domisili & Legalitas Klien */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="size-4 text-emerald-600 dark:text-emerald-400" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                3. Domisili &amp; Legalitas
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
                                        <Field
                                            label="Alamat Gedung / Jalan"
                                            name="address_line_1"
                                            defaultValue={client.address_line_1}
                                            error={errors.address_line_1}
                                            placeholder="Gedung &amp; Jalan"
                                            className="sm:col-span-3"
                                        />

                                        <Field
                                            label="Lantai / Unit (Opsional)"
                                            name="address_line_2"
                                            defaultValue={client.address_line_2}
                                            error={errors.address_line_2}
                                            placeholder="Lantai / Unit"
                                            className="sm:col-span-3"
                                        />

                                        <Field
                                            label="Kota / Kabupaten"
                                            name="city"
                                            defaultValue={client.city}
                                            error={errors.city}
                                            placeholder="Jakarta Selatan"
                                        />

                                        <Field
                                            label="Provinsi"
                                            name="province"
                                            defaultValue={client.province}
                                            error={errors.province}
                                            placeholder="DKI Jakarta"
                                        />

                                        <Field
                                            label="Kode Pos"
                                            name="postal_code"
                                            defaultValue={client.postal_code}
                                            error={errors.postal_code}
                                            placeholder="12190"
                                        />

                                        <Field
                                            label="NPWP"
                                            name="tax_identifier"
                                            defaultValue={client.tax_identifier}
                                            error={errors.tax_identifier}
                                            placeholder="00.000.000.0-000.000"
                                        />

                                        <Field
                                            label="Nomor Induk Berusaha (NIB) / No. Akta"
                                            name="registration_identifier"
                                            defaultValue={
                                                client.registration_identifier
                                            }
                                            error={
                                                errors.registration_identifier
                                            }
                                            placeholder="Nomor registrasi legalitas"
                                            className="sm:col-span-2"
                                        />

                                        <div className="grid gap-1 sm:col-span-3">
                                            <Label
                                                htmlFor="notes"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Catatan / Ringkasan Klien
                                            </Label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                rows={2.5}
                                                defaultValue={client.notes}
                                                placeholder="Tambahkan ikhtisar latar belakang klien..."
                                                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs leading-relaxed text-slate-900 outline-hidden transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:bg-white dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                            />
                                            <InputError
                                                message={errors.notes}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Tahap 4: Penilaian Manual Kepatuhan KYC & AML (PMPJ) */}
                                <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.05]">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="size-4 text-blue-600 dark:text-blue-400" />
                                            <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                                4. Penilaian Manual Kepatuhan
                                                KYC &amp; AML (PMPJ)
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
                                        <SelectField
                                            label="Status Verifikasi KYC"
                                            name="kyc_status"
                                            defaultValue={
                                                client.kyc_status ?? 'verified'
                                            }
                                            error={errors.kyc_status}
                                            options={[
                                                {
                                                    value: 'verified',
                                                    label: 'Terverifikasi Penuh (Verified)',
                                                },
                                                {
                                                    value: 'in_review',
                                                    label: 'Dalam Penelaahan Manual (In Review)',
                                                },
                                                {
                                                    value: 'pending_documents',
                                                    label: 'Menunggu Kelengkapan Dokumen (Pending)',
                                                },
                                                {
                                                    value: 'rejected',
                                                    label: 'Ditolak / Berisiko Sanksi (Rejected)',
                                                },
                                            ]}
                                        />

                                        <SelectField
                                            label="Tingkat Risiko AML"
                                            name="kyc_risk_level"
                                            defaultValue={
                                                client.kyc_risk_level ?? 'low'
                                            }
                                            error={errors.kyc_risk_level}
                                            options={[
                                                {
                                                    value: 'low',
                                                    label: 'Risiko Rendah (Standar)',
                                                },
                                                {
                                                    value: 'medium',
                                                    label: 'Risiko Menengah (Perlu Pemantauan)',
                                                },
                                                {
                                                    value: 'high',
                                                    label: 'Risiko Tinggi (Enhanced Due Diligence - EDD)',
                                                },
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
                                            options={partners.map(
                                                (partner) => ({
                                                    value: partner.id,
                                                    label: `${partner.name} ${partner.position_title ? `(${partner.position_title})` : ''}`,
                                                }),
                                            )}
                                        />

                                        <Field
                                            label="Tanggal Penilaian Terakhir"
                                            name="kyc_assessed_at"
                                            type="date"
                                            defaultValue={
                                                client.kyc_assessed_at?.slice(
                                                    0,
                                                    10,
                                                ) ??
                                                new Date()
                                                    .toISOString()
                                                    .slice(0, 10)
                                            }
                                            error={errors.kyc_assessed_at}
                                        />

                                        {/* Document Checklist */}
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                Checklist Verifikasi Dokumen
                                                Legalitas (Manual)
                                            </Label>
                                            <div className="space-y-1.5 rounded-lg border border-slate-200/70 bg-slate-50/50 p-2.5 dark:border-white/10 dark:bg-[#121418]">
                                                {KYC_DOCUMENT_ITEMS.map(
                                                    (item) => {
                                                        const isChecked =
                                                            client.kyc_checklist
                                                                ? Boolean(
                                                                      client
                                                                          .kyc_checklist[
                                                                          item
                                                                              .key
                                                                      ],
                                                                  )
                                                                : true;

                                                        return (
                                                            <label
                                                                key={item.key}
                                                                className="flex cursor-pointer items-start gap-2 rounded p-1 text-xs transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    name={`kyc_checklist[${item.key}]`}
                                                                    value="1"
                                                                    defaultChecked={
                                                                        isChecked
                                                                    }
                                                                    className="mt-0.5 size-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <span className="text-slate-700 dark:text-zinc-200">
                                                                    {item.label}
                                                                </span>
                                                            </label>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>

                                        {/* KYC Notes */}
                                        <div className="grid gap-1 sm:col-span-2">
                                            <Label
                                                htmlFor="kyc_notes"
                                                className="text-xs font-semibold text-slate-700 dark:text-zinc-300"
                                            >
                                                Catatan Uji Tuntas &amp;
                                                Beneficial Ownership (KYC Notes)
                                            </Label>
                                            <textarea
                                                id="kyc_notes"
                                                name="kyc_notes"
                                                rows={2.5}
                                                defaultValue={
                                                    client.kyc_notes ??
                                                    'Klien terverifikasi resmi RPK Law Firm. Berkas KYC lengkap, Beneficial Ownership tertelusuri, dan lolos uji tapis sanksi (AML/CFT screening).'
                                                }
                                                placeholder="Catat temuan uji tuntas, Beneficial Ownership, konfirmasi PEP..."
                                                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs leading-relaxed text-slate-900 outline-hidden transition-colors focus:border-blue-600 dark:border-white/10 dark:bg-[#121418] dark:text-white"
                                            />
                                            <InputError
                                                message={errors.kyc_notes}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Action Bar */}
                                <div className="flex flex-col justify-between gap-3 border-t border-slate-200/60 pt-4 sm:flex-row sm:items-center dark:border-white/[0.06]">
                                    <p className="text-[11px] text-slate-400">
                                        Perubahan profil klien akan segera
                                        diperbarui di seluruh perkara terkait.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                                            asChild
                                        >
                                            <Link
                                                href={clientRoutes.show.url(
                                                    client.id,
                                                )}
                                            >
                                                Batal
                                            </Link>
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
                                                'Simpan Perubahan Klien'
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
    className,
    type = 'text',
    placeholder,
    required = false,
}: {
    label: string;
    name: string;
    defaultValue?: string;
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
    optional = false,
}: {
    label: string;
    name: string;
    defaultValue?: string;
    error?: string;
    options: { value: string | number; label: string }[];
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

ClientEdit.layout = {
    breadcrumbs: [
        { title: 'Klien', href: clientRoutes.index.url() },
        { title: 'Edit Klien', href: '#' },
    ],
};
