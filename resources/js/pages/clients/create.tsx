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
    UserCheck,
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

export default function ClientCreate({
    partners,
}: {
    partners: Partner[];
}) {
    return (
        <>
            <Head title="Buat Klien Baru" />

            <div className="min-h-screen w-full bg-[#fbfbfa] text-[#111111] antialiased dark:bg-[#121212] dark:text-[#fbfbfa]">
                <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* Notion Minimalist Page Header */}
                    <header className="space-y-2.5">
                        <Link
                            href={clientRoutes.index()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#787774] transition-colors hover:text-[#111111] dark:text-zinc-400 dark:hover:text-white"
                        >
                            <ArrowLeft className="size-3.5" />
                            Klien
                        </Link>

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                                    Buat Klien Baru
                                </h1>
                                <p className="text-xs text-[#787774] dark:text-zinc-400">
                                    Nomor klien unik (<span className="font-mono font-medium text-[#1f6c9f] dark:text-sky-300">RPK-C-YYYY-XXXX</span>) akan dibuat otomatis oleh sistem setelah data berhasil disimpan.
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Form Section */}
                    <Form {...clientRoutes.store.form()} className="space-y-5">
                        {({ errors, processing }) => (
                            <>
                                {/* 1. Identitas & Klasifikasi Entitas */}
                                <section className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <div className="flex items-center gap-2.5 border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                                            <Building2 className="size-3.5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                                                1. Identitas & Klasifikasi Entitas
                                            </h2>
                                            <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                Tentukan tipe badan hukum, nama merek, dan sektor industri klien.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                                        <SelectField
                                            label="Tipe Klien"
                                            name="type"
                                            defaultValue="organization"
                                            error={errors.type}
                                            options={[
                                                { value: 'organization', label: 'Badan Hukum / Korporasi' },
                                                { value: 'individual', label: 'Individu / Perorangan' },
                                            ]}
                                        />

                                        <Field
                                            label="Sektor / Bidang Industri"
                                            name="industry"
                                            error={errors.industry}
                                            placeholder="Contoh: Infrastruktur, Energi, Teknologi Finansial"
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
                                    </div>
                                </section>

                                {/* 2. Penugasan Partner & Komunikasi */}
                                <section className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <div className="flex items-center gap-2.5 border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                                            <UserCheck className="size-3.5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                                                2. Penugasan Partner & Kontak Resmi
                                            </h2>
                                            <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                Partner penanggung jawab dan saluran komunikasi kantor resmi.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
                                        <div className="sm:col-span-3">
                                            <SelectField
                                                label="Partner Penanggung Jawab"
                                                name="relationship_partner_id"
                                                error={errors.relationship_partner_id}
                                                optional
                                                options={partners.map((partner) => ({
                                                    value: partner.id,
                                                    label: `${partner.name} — ${partner.position_title ?? 'Partner'}`,
                                                }))}
                                            />
                                        </div>

                                        <Field
                                            label="Email Kantor"
                                            name="email"
                                            type="email"
                                            error={errors.email}
                                            placeholder="legal@perusahaan.co.id"
                                        />

                                        <Field
                                            label="Nomor Telepon Kantor"
                                            name="phone"
                                            error={errors.phone}
                                            placeholder="+62 21 555-0199"
                                        />

                                        <Field
                                            label="Website Perusahaan"
                                            name="website"
                                            type="url"
                                            error={errors.website}
                                            placeholder="https://perusahaan.co.id"
                                        />
                                    </div>
                                </section>

                                {/* 3. Domisili & Legalitas Klien */}
                                <section className="overflow-hidden rounded-xl border border-black/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] dark:border-white/[0.08] dark:bg-[#1a1a1c]">
                                    <div className="flex items-center gap-2.5 border-b border-black/[0.04] pb-3 dark:border-white/[0.06]">
                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#111111] dark:bg-white/[0.06] dark:text-white">
                                            <MapPin className="size-3.5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111] dark:text-white">
                                                3. Domisili & Legalitas
                                            </h2>
                                            <p className="text-[11px] text-[#787774] dark:text-zinc-400">
                                                Lokasi domisili kantor pusat, nomor registrasi, dan catatan profil.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
                                        <Field
                                            label="Alamat Gedung / Jalan"
                                            name="address_line_1"
                                            error={errors.address_line_1}
                                            placeholder="Sudirman Central Business District (SCBD), Tower 2 Lt. 18"
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
                                            placeholder="12190"
                                        />

                                        <Field
                                            label="Nomor Induk Berusaha (NIB) / No. Akta"
                                            name="registration_identifier"
                                            error={errors.registration_identifier}
                                            placeholder="Nomor registrasi legalitas"
                                            className="sm:col-span-3"
                                        />

                                        <div className="grid gap-1.5 sm:col-span-3">
                                            <Label htmlFor="notes" className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                                                Catatan / Ringkasan Klien
                                            </Label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                rows={3}
                                                placeholder="Tambahkan ikhtisar latar belakang klien, preferensi komunikasi, atau riwayat kerja sama..."
                                                className="w-full rounded-lg border border-black/[0.08] bg-[#fbfbfa] p-2.5 text-xs leading-relaxed text-[#111111] outline-none transition-colors placeholder:text-[#787774] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-white"
                                            />
                                            <InputError message={errors.notes} />
                                        </div>
                                    </div>
                                </section>

                                {/* Sticky Bottom Action Bar */}
                                <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-black/[0.08] bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-white/[0.08] dark:bg-[#1a1a1c]/95">
                                    <p className="hidden text-xs text-[#787774] sm:block dark:text-zinc-400">
                                        Pastikan data identitas dan penugasan partner telah sesuai sebelum menyimpan.
                                    </p>
                                    <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-8 rounded-lg border-black/10 bg-white px-3.5 text-xs font-medium text-[#111111] hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#1c1c1e] dark:text-zinc-200"
                                            asChild
                                        >
                                            <Link href={clientRoutes.index()}>
                                                Batal
                                            </Link>
                                        </Button>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-8 rounded-lg bg-[#111111] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-black active:scale-95 dark:bg-white dark:text-black"
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-1.5 size-3.5" />
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
        <div className={`grid gap-1.5 ${className ?? ''}`}>
            <Label htmlFor={name} className="text-xs font-medium text-[#2f3437] dark:text-zinc-200">
                {label} {required && <span className="text-rose-500">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                required={required}
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
                    className="h-8 w-full cursor-pointer appearance-none rounded-lg border border-black/[0.08] bg-[#fbfbfa] pl-3 pr-8 text-xs font-medium text-[#111111] outline-none transition-colors hover:bg-black/[0.02] focus:border-black/20 focus:bg-white dark:border-white/[0.1] dark:bg-[#121212] dark:text-zinc-200"
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

ClientCreate.layout = {
    breadcrumbs: [
        { title: 'Klien', href: clientRoutes.index() },
        { title: 'Buat Klien', href: clientRoutes.create() },
    ],
};
