import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    Briefcase,
    Calendar,
    CheckCircle2,
    ChevronDown,
    Clock,
    CreditCard,
    FileCheck,
    FileText,
    HelpCircle,
    Key,
    Layers,
    Lock,
    QrCode,
    Search,
    Shield,
    Sparkles,
    UserCheck,
    Users,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GuideStep {
    step: number;
    title: string;
    description: string;
    details?: string[];
    tip?: string;
    badge?: string;
}

interface GuideModule {
    id: string;
    category: 'start' | 'matters' | 'clients' | 'calendar' | 'documents' | 'finance' | 'admin';
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    badge: string;
    actionUrl?: string;
    actionLabel?: string;
    steps: GuideStep[];
}

const GUIDE_MODULES: GuideModule[] = [
    {
        id: 'getting-started',
        category: 'start',
        title: '1. Memulai & Konfigurasi Akun',
        subtitle: 'Langkah awal setup profil advokat, passkey biometrik, dan navigasi cepat workspace.',
        icon: Key,
        color: 'from-blue-600 to-indigo-600',
        badge: 'ONBOARDING',
        actionUrl: '/settings/profile',
        actionLabel: 'Buka Pengaturan Profil',
        steps: [
            {
                step: 1,
                title: 'Lengkapi Data Diri & Kredensial Advokat',
                description: 'Buka menu Profil untuk mengisi NIA (Nomor Induk Advokat), Tanggal BAS Pengadilan Tinggi, Bidang Praktik Hukum, dan Riwayat Pendidikan.',
                details: [
                    'Navigasi ke menu dropdown avatar di pojok kanan atas → Pilih "Pengaturan / Settings".',
                    'Isi informasi legalitas pada tab "Data Advokat & KTA".',
                    'Upload foto profil resmi dan periksa nomor kontak WhatsApp aktif.',
                ],
                tip: 'Data advokat akan otomatis ditarik saat membuat Surat Kuasa Khusus dan Berita Acara.',
                badge: 'Wajib',
            },
            {
                step: 2,
                title: 'Aktifkan Passkey Biometrik (Fingerprint / Face ID)',
                description: 'Gunakan login cepat tanpa perlu mengetik kata sandi setiap kali masuk ke RPK App.',
                details: [
                    'Buka tab "Keamanan / Security" di menu Pengaturan.',
                    'Pilih "Daftarkan Passkey Baru" dan sentuh sensor sidik jari atau Face ID perangkat Anda.',
                    'Pada login berikutnya, cukup klik tombol "Masuk Cepat dengan Passkey".',
                ],
                tip: 'Passkey tersimpan aman pada hardware keamanan perangkat Anda dan terlindungi enkripsi FIDO2.',
                badge: 'Rekomendasi',
            },
            {
                step: 3,
                title: 'Gunakan Command Palette (Cmd+K / Ctrl+K)',
                description: 'Akses seluruh modul, berkas perkara, data klien, dan aksi cepat hanya dalam hitungan detik.',
                details: [
                    'Tekan tombol kombinasi `Cmd + K` (Mac) atau `Ctrl + K` (Windows) dari halaman manapun.',
                    'Ketik nomor perkara, nama klien, atau perintah seperti "Buat Matter Baru" atau "Unggah Dokumen".',
                ],
                badge: 'Pintasan Cepat',
            },
        ],
    },
    {
        id: 'matters-management',
        category: 'matters',
        title: '2. Manajemen Perkara (Matters)',
        subtitle: 'Alur lengkap pendaftaran perkara baru, penugasan tim hukum, pemantauan sidang, hingga pengarsipan.',
        icon: Briefcase,
        color: 'from-emerald-600 to-teal-600',
        badge: 'INTI OPERASIONAL',
        actionUrl: '/matters',
        actionLabel: 'Buka Modul Perkara',
        steps: [
            {
                step: 1,
                title: 'Pendaftaran & Registrasi Perkara Baru',
                description: 'Daftarkan perkara dengan nomor registrasi internal firma atau nomor perkara pengadilan.',
                details: [
                    'Buka menu "Manajemen Perkara" → Klik tombol "+ Buka Perkara Baru".',
                    'Pilih Klien terkait, masukkan Judul Pokok Perkara, Kategori (Litigasi / Non-Litigasi / Korporasi / Arbitrase).',
                    'Tentukan Tingkat Kerahasiaan (Standar / Terbatas / Rahasia).',
                ],
                tip: 'Pastikan melakukan Conflict of Interest Check otomatis sebelum menerima perkara baru.',
                badge: 'Langkah 1',
            },
            {
                step: 2,
                title: 'Penugasan Tim Advokat & Pembagian Peran',
                description: 'Tentukan Lead Partner yang bertanggung jawab dan anggota Associate / Paralegal pelaksana.',
                details: [
                    'Buka tab "Tim Penasihat Hukum" pada halaman detail perkara.',
                    'Pilih Lead Partner pengawas serta Associate pendamping perkara.',
                    'Sistem akan otomatis mengirimkan notifikasi penugasan ke email anggota tim.',
                ],
                badge: 'Langkah 2',
            },
            {
                step: 3,
                title: 'Pencatatan Kronologi, Pihak Terkait & Dokumen Bukti',
                description: 'Kelola data Penggugat, Tergugat, Turut Tergugat, serta unggah bundel alat bukti surat.',
                details: [
                    'Tambahkan daftar pihak perkara beserta kuasa hukum lawan.',
                    'Catat kronologis kejadian dengan tanggal dan nomor referensi bukti.',
                    'Unggah dokumen surat kuasa, gugatan, jawaban, replik, dan duplik pada tab Dokumen.',
                ],
                badge: 'Langkah 3',
            },
            {
                step: 4,
                title: 'Penyelesaian & Pengarsipan Perkara Selesai',
                description: 'Tutup perkara yang telah berkekuatan hukum tetap (BHT) atau selesai proses mediasi/perdamaian.',
                details: [
                    'Ubah status tahapan perkara menjadi "Selesai / Putusan Inkracht".',
                    'Unduh Laporan Ringkasan Perkara (Executive Case Summary PDF).',
                    'Arsipkan berkas perkara agar tersimpan aman di gudang digital firma.',
                ],
                badge: 'Langkah 4',
            },
        ],
    },
    {
        id: 'clients-directory',
        category: 'clients',
        title: '3. Klien & Kepatuhan KYC/AML',
        subtitle: 'Pengelolaan direktori klien korporasi maupun perorangan beserta dokumen legalitas hukum.',
        icon: Users,
        color: 'from-purple-600 to-indigo-600',
        badge: 'KEPATUHAN',
        actionUrl: '/clients',
        actionLabel: 'Buka Direktori Klien',
        steps: [
            {
                step: 1,
                title: 'Pendaftaran Profil Klien Baru',
                description: 'Tambahkan data klien perorangan (KTP/Paspor) atau korporasi (NIB, Akta Pendirian, NPWP Badan).',
                details: [
                    'Buka menu "Klien & Kontak" → Klik "+ Tambah Klien".',
                    'Pilih tipe entitas: Perorangan (Individu) atau Perusahaan (Korporasi).',
                    'Isi data kontak penanggung jawab resmi, nomor telepon, dan email korespondensi.',
                ],
                badge: 'Registrasi',
            },
            {
                step: 2,
                title: 'Verifikasi Kepatuhan & Uji Kelayakan (KYC)',
                description: 'Lengkapi dokumen legalitas guna mematuhi standar kepatuhan anti-pencucian uang (AML/KYC).',
                details: [
                    'Unggah scan Akta Pendirian & Perubahan Terakhir, SK Kemenkumham, serta NIB Perusahaan.',
                    'Catat tanggal jatuh tempo dokumen kepatuhan untuk monitoring otomatis.',
                    'Sistem akan mengirimkan alert otomatis jika ada legalitas klien yang mendekati kadaluwarsa.',
                ],
                tip: 'Klien dengan dokumen KYC lengkap memudahkan penerbitan Surat Kuasa dan Legal Opinion resmi.',
                badge: 'Verifikasi',
            },
        ],
    },
    {
        id: 'calendar-hearings',
        category: 'calendar',
        title: '4. Kalender & Jadwal Sidang',
        subtitle: 'Manajemen agenda persidangan pengadilan, mediasi, rapat klien, dan tenggat waktu upaya hukum.',
        icon: Calendar,
        color: 'from-amber-600 to-orange-600',
        badge: 'JADWAL & AGENDA',
        actionUrl: '/calendar',
        actionLabel: 'Buka Kalender Agenda',
        steps: [
            {
                step: 1,
                title: 'Input Jadwal Sidang / Mediasi Baru',
                description: 'Catat agenda sidang perkara dengan mencantumkan nama pengadilan, majelis hakim, dan agenda pembuktian.',
                details: [
                    'Buka menu "Jadwal Sidang & Kalender" atau langsung dari halaman detail perkara terkait.',
                    'Tentukan waktu, ruang sidang pengadilan (misal: PN Jakarta Selatan, Ruang Kusumah Atmadja), dan agenda (misal: Pembacaan Gugatan, Saksi Ahli).',
                    'Tugaskan advokat pendamping yang hadir pada persidangan.',
                ],
                badge: 'Agenda',
            },
            {
                step: 2,
                title: 'Sinkronisasi Notifikasi & Pengingat Otomatis',
                description: 'Sistem otomatis mengingatkan tim advokat sebelum hari H persidangan.',
                details: [
                    'Notifikasi pengingat otomatis dikirimkan pada H-7 dan H-1 jelang jadwal sidang.',
                    'Gunakan fitur Kalender Feed iCal untuk menyinkronkan agenda ke Google Calendar / Apple Calendar di smartphone.',
                ],
                tip: 'Klik tombol "Sinkronkan iCal Feed" di pojok atas kalender untuk memasang ke HP Anda.',
                badge: 'Otomatisasi',
            },
        ],
    },
    {
        id: 'documents-signatures',
        category: 'documents',
        title: '5. Dokumen & Tanda Tangan Digital Resmi',
        subtitle: 'Pembuatan draf otomatis, pembubuhan tanda tangan elektronik tersertifikasi, dan verifikasi keabsahan QR Code.',
        icon: FileCheck,
        color: 'from-blue-600 to-cyan-600',
        badge: 'LEGAL DRAFTING & SIGN',
        actionUrl: '/documents',
        actionLabel: 'Buka Manajemen Dokumen',
        steps: [
            {
                step: 1,
                title: 'Generator Template Dokumen Otomatis',
                description: 'Buat draf Surat Kuasa Khusus, Surat Somasi, atau Perjanjian Kerja Sama secara instan.',
                details: [
                    'Buka menu "Dokumen" → Pilih tab "Template Otomatis".',
                    'Pilih template yang diinginkan (misal: Surat Kuasa Khusus Litigasi Pidana/Perdata).',
                    'Pilih Klien dan Perkara; variabel nama advokat, alamat, dan nomor perkara akan otomatis terisi rapi.',
                ],
                badge: 'Drafting',
            },
            {
                step: 2,
                title: 'Kirim Permintaan Tanda Tangan Elektronik',
                description: 'Kirimkan berkas ke Advokat, Managing Partner, atau Klien untuk ditandatangani secara elektronik.',
                details: [
                    'Pilih dokumen PDF yang siap ditandatangani → Klik "Kirim Permintaan Tanda Tangan".',
                    'Tentukan pihak penandatangan dan urutan persetujuan.',
                    'Penerima akan mendapatkan link penandatanganan aman via email tanpa perlu login.',
                ],
                badge: 'Signing Workflow',
            },
            {
                step: 3,
                title: 'Verifikasi Keabsahan Dokumen via QR Code',
                description: 'Setiap dokumen yang selesai ditandatangani dilengkapi lembar sertifikat verifikasi keabsahan resmi.',
                details: [
                    'Pindai QR Code yang tertera di sudut bawah dokumen menggunakan kamera HP.',
                    'Halaman verifikasi resmi RPK Law Firm akan menampilkan riwayat integritas SHA-256, stempel waktu, dan identitas penandatangan.',
                ],
                tip: 'Verifikasi membuktikan keaslian dokumen di hadapan pengadilan, bank, atau pihak ketiga.',
                badge: 'Keabsahan Hukum',
            },
        ],
    },
    {
        id: 'finance-billing',
        category: 'finance',
        title: '6. Keuangan, Honorarium & Invoice',
        subtitle: 'Penerbitan tagihan klien, pencatatan termin fee advokat, verifikasi pembayaran, dan kepatuhan pajak.',
        icon: CreditCard,
        color: 'from-emerald-600 to-green-600',
        badge: 'BILLING & FINANCE',
        actionUrl: '/finance',
        actionLabel: 'Buka Modul Keuangan',
        steps: [
            {
                step: 1,
                title: 'Pembuatan Penawaran (Quotation) & Invoice Tagihan',
                description: 'Terbitkan tagihan profesional dengan format standar kantor hukum.',
                details: [
                    'Buka menu "Keuangan" → Klik "+ Buat Tagihan / Invoice".',
                    'Pilih perkara dan klien, masukkan rincian komponen biaya (Legal Fee, Retainer, Success Fee, Biaya Operasional/Court Fee).',
                    'Sistem otomatis menghitung subtotal, PPN, dan potongan pajak PPh 23 / PPh 21 jika berlaku.',
                ],
                badge: 'Invoicing',
            },
            {
                step: 2,
                title: 'Pencatatan Pembayaran & Penerbitan Kuitansi Resmi',
                description: 'Catat pembayaran termin yang masuk dan cetak kuitansi resmi bertanda tangan.',
                details: [
                    'Saat klien melakukan transfer, unggah bukti bayar pada invoice terkait.',
                    'Bagian Finance / Partner memverifikasi pembayaran menjadi "Lunas / Paid".',
                    'Unduh Kuitansi Pembayaran Resmi (Official Receipt) berformat PDF.',
                ],
                badge: 'Verifikasi Bayar',
            },
        ],
    },
    {
        id: 'admin-governance',
        category: 'admin',
        title: '7. Administrasi Staf & Hak Akses (RBAC)',
        subtitle: 'Panduan khusus Administrator & Managing Partner dalam mengatur wewenang staf dan audit keamanan.',
        icon: Shield,
        color: 'from-rose-600 to-pink-600',
        badge: 'KHUSUS ADMIN / PARTNER',
        actionUrl: '/admin/users',
        actionLabel: 'Kelola Staf & Role',
        steps: [
            {
                step: 1,
                title: 'Manajemen Staf & Penentuan Role Jabatan',
                description: 'Tambah personel baru dan tetapkan peran sesuai struktur organisasi kantor.',
                details: [
                    'Buka menu "Pengaturan Staf & RBAC" pada panel Admin.',
                    'Pilih role: Managing Partner, Senior Partner, Partner, Senior Associate, Associate, Advokat Magang, Finance, atau Administrator.',
                    'Setiap role memiliki 26 matriks hak akses independen yang dapat disesuaikan.',
                ],
                badge: 'RBAC Security',
            },
            {
                step: 2,
                title: 'Pemantauan Jejak Audit (Audit Trail Log)',
                description: 'Pantau seluruh aktivitas pengubahan data sensitif, akses berkas, dan riwayat login sistem.',
                details: [
                    'Buka menu "Audit Trail" untuk melihat log aktivitas secara real-time.',
                    'Filter berdasarkan nama staf, modul perkara, alamat IP, atau rentang tanggal.',
                ],
                tip: 'Audit log tersimpan permanen guna menjamin standar kepatuhan kerahasiaan klien (Attorney-Client Privilege).',
                badge: 'Audit & Keamanan',
            },
        ],
    },
];

const FAQS = [
    {
        q: 'Bagaimana cara menambahkan tanda tangan saya ke dokumen resmi?',
        a: 'Buka menu Pengaturan Profil (klik avatar di pojok kanan atas → Pengaturan), pilih tab "Spesimen Tanda Tangan", lalu gambar tanda tangan Anda di canvas digital atau unggah foto tanda tangan berlatar putih bersih.',
    },
    {
        q: 'Apakah klien harus membuat akun untuk menandatangani dokumen elektronik?',
        a: 'Tidak perlu. Klien akan menerima tautan aman terenkripsi via email yang memungkinkan mereka meninjau dan membubuhkan tanda tangan langsung dari browser HP atau komputer tanpa perlu mendaftar akun.',
    },
    {
        q: 'Bagaimana cara mengaktifkan notifikasi sidang di HP saya?',
        a: 'Buka halaman Kalender, klik tombol "Sinkronkan iCal Feed", lalu salin URL feed kalender ke aplikasi Google Calendar, Apple Calendar, atau Microsoft Outlook di smartphone Anda.',
    },
    {
        q: 'Apa yang harus dilakukan jika akses ke salah satu modul ditolak (Error 403)?',
        a: 'Pesan Error 403 menandakan akun Anda belum diberikan izin hak akses untuk modul tersebut oleh Administrator. Silakan hubungi Managing Partner atau Administrator firma untuk menambahkan izin kewenangan pada akun Anda.',
    },
    {
        q: 'Bagaimana cara mengganti kata sandi atau mendaftarkan Face ID / Fingerprint?',
        a: 'Buka menu Pengaturan → tab "Keamanan / Security". Anda dapat memperbarui kata sandi baru atau mendaftarkan Passkey biometrik perangkat Anda.',
    },
];

export default function GuideIndex() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Filter modules based on search query and category
    const filteredModules = useMemo(() => {
        return GUIDE_MODULES.filter((module) => {
            const matchesCategory =
                activeCategory === 'all' || module.category === activeCategory;

            if (!searchQuery.trim()) return matchesCategory;

            const q = searchQuery.toLowerCase();
            const matchesTitle = module.title.toLowerCase().includes(q);
            const matchesSubtitle = module.subtitle.toLowerCase().includes(q);
            const matchesSteps = module.steps.some(
                (s) =>
                    s.title.toLowerCase().includes(q) ||
                    s.description.toLowerCase().includes(q) ||
                    s.details?.some((d) => d.toLowerCase().includes(q)),
            );

            return matchesCategory && (matchesTitle || matchesSubtitle || matchesSteps);
        });
    }, [searchQuery, activeCategory]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Cara Penggunaan', href: '/guide' },
            ]}
        >
            <Head title="Cara Penggunaan & Panduan Sistem - RPK App" />

            <div className="min-h-screen bg-[#fafafc] pb-24 dark:bg-[#0c0d10]">
                {/* 1. Executive Hero Header Banner */}
                <div className="relative overflow-hidden border-b border-slate-200/80 bg-linear-to-b from-white via-slate-50 to-slate-100/60 px-4 pt-8 pb-10 sm:px-6 lg:px-8 dark:border-white/[0.06] dark:from-[#14161d] dark:via-[#111217] dark:to-[#0c0d10]">
                    {/* Background Radial Glow */}
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/10" />

                    <div className="relative mx-auto max-w-5xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-3 py-1 font-mono text-[11px] font-bold text-blue-700 shadow-2xs dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
                            <Sparkles className="size-3.5" />
                            <span>PUSAT PANDUAN &amp; ONBOARDING RPK APP</span>
                        </div>

                        <h1 className="mt-3.5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
                            Panduan Cara Penggunaan RPK App
                        </h1>

                        <p className="mx-auto mt-2.5 max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-zinc-400">
                            Pelajari alur operasional komprehensif mulai dari registrasi perkara, penugasan advokat, tanda tangan elektronik tersertifikasi, hingga penagihan invoice firma hukum.
                        </p>

                        {/* Interactive Live Search Box */}
                        <div className="mx-auto mt-6 max-w-xl">
                            <div className="relative flex items-center">
                                <Search className="pointer-events-none absolute left-4 size-4 text-slate-400 dark:text-zinc-500" />
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ketik topik panduan, misal: surat kuasa, jadwal sidang, invoice, passkey..."
                                    className="h-11 rounded-2xl border-slate-200/90 bg-white pr-4 pl-11 text-xs shadow-md transition-all focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 sm:text-sm dark:border-white/10 dark:bg-[#16181f] dark:text-white"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3.5 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Key Metrics / Highlights Pill Strip */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-white/80 px-2.5 py-1 shadow-2xs dark:border-white/5 dark:bg-white/[0.03]">
                                <Layers className="size-3.5 text-blue-600 dark:text-blue-400" />
                                7 Modul Praktik Hukum
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-white/80 px-2.5 py-1 shadow-2xs dark:border-white/5 dark:bg-white/[0.03]">
                                <Shield className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                26 Hak Akses RBAC
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-white/80 px-2.5 py-1 shadow-2xs dark:border-white/5 dark:bg-white/[0.03]">
                                <QrCode className="size-3.5 text-purple-600 dark:text-purple-400" />
                                Verifikasi QR Terenkripsi
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-white/80 px-2.5 py-1 shadow-2xs dark:border-white/5 dark:bg-white/[0.03]">
                                <Zap className="size-3.5 text-amber-600 dark:text-amber-400" />
                                Command Palette ⌘K
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* 2. Category Filter Pills */}
                    <div className="mb-8 flex flex-wrap items-center gap-1.5 overflow-x-auto pb-2">
                        {[
                            { id: 'all', label: 'Semua Panduan' },
                            { id: 'start', label: '🚀 Memulai' },
                            { id: 'matters', label: '⚖️ Perkara' },
                            { id: 'clients', label: '👥 Klien & KYC' },
                            { id: 'calendar', label: '📅 Sidang & Jadwal' },
                            { id: 'documents', label: '✍️ Dokumen & Tanda Tangan' },
                            { id: 'finance', label: '💳 Keuangan' },
                            { id: 'admin', label: '🛡️ Admin & Role' },
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveCategory(cat.id)}
                                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                                    activeCategory === cat.id
                                        ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                                        : 'border border-slate-200/80 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-white/5 dark:bg-[#14161b] dark:text-zinc-400 dark:hover:border-white/10 dark:hover:text-white'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* 3. Guide Modules List */}
                    {filteredModules.length > 0 ? (
                        <div className="space-y-8">
                            {filteredModules.map((module) => {
                                const IconComponent = module.icon;
                                return (
                                    <div
                                        key={module.id}
                                        id={module.id}
                                        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs transition-all dark:border-white/[0.06] dark:bg-[#14161b]"
                                    >
                                        {/* Module Header Bar */}
                                        <div className="flex flex-col justify-between gap-3.5 border-b border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:px-6 dark:border-white/[0.04] dark:bg-[#111317]">
                                            <div className="flex items-start gap-3.5">
                                                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${module.color} text-white shadow-sm`}>
                                                    <IconComponent className="size-5.5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-[10px] font-extrabold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                                            {module.badge}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
                                                        {module.title}
                                                    </h2>
                                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                                        {module.subtitle}
                                                    </p>
                                                </div>
                                            </div>

                                            {module.actionUrl && (
                                                <Link
                                                    href={module.actionUrl}
                                                    className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600 sm:self-center dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08] dark:hover:text-white"
                                                >
                                                    <span>{module.actionLabel}</span>
                                                    <span>&rarr;</span>
                                                </Link>
                                            )}
                                        </div>

                                        {/* Module Steps (Visual Stepper) */}
                                        <div className="p-5 sm:p-6">
                                            <div className="space-y-6">
                                                {module.steps.map((step, idx) => (
                                                    <div
                                                        key={step.step}
                                                        className="relative flex gap-4"
                                                    >
                                                        {/* Step Connector Line */}
                                                        {idx < module.steps.length - 1 && (
                                                            <div className="absolute top-8 left-4 -bottom-6 w-0.5 bg-slate-100 dark:bg-white/[0.06]" />
                                                        )}

                                                        {/* Step Number Circle */}
                                                        <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 font-mono text-xs font-black text-slate-800 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200">
                                                            {step.step}
                                                        </div>

                                                        {/* Step Content Card */}
                                                        <div className="min-w-0 flex-1 space-y-2 pb-2">
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                                                    {step.title}
                                                                </h3>
                                                                {step.badge && (
                                                                    <span className="rounded-md border border-slate-200/70 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:border-white/5 dark:bg-white/[0.04] dark:text-zinc-400">
                                                                        {step.badge}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
                                                                {step.description}
                                                            </p>

                                                            {/* Step Bullet Sub-details */}
                                                            {step.details && step.details.length > 0 && (
                                                                <ul className="mt-2 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs text-slate-600 dark:border-white/[0.03] dark:bg-white/[0.02] dark:text-zinc-400">
                                                                    {step.details.map((detail, dIdx) => (
                                                                        <li key={dIdx} className="flex items-start gap-2">
                                                                            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                                                            <span className="leading-normal">{detail}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}

                                                            {/* Pro Tip Box */}
                                                            {step.tip && (
                                                                <div className="flex items-start gap-2 rounded-lg border border-amber-200/70 bg-amber-50/70 p-2.5 text-[11.5px] text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300">
                                                                    <span className="font-bold shrink-0">💡 Pro Tip:</span>
                                                                    <span className="leading-normal">{step.tip}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white px-4 py-12 text-center shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <HelpCircle className="size-10 text-slate-400 dark:text-zinc-500" />
                            <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-white">
                                Topik Tidak Ditemukan
                            </h3>
                            <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-zinc-400">
                                Tidak ada panduan yang cocok dengan kata kunci "{searchQuery}". Silakan coba kata kunci lain atau pilih kategori "Semua Panduan".
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveCategory('all');
                                }}
                                className="mt-4 text-xs font-semibold"
                            >
                                Reset Pencarian
                            </Button>
                        </div>
                    )}

                    {/* 4. Interactive FAQ Accordion Section */}
                    <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                        <div className="mb-5 flex items-center gap-2.5">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                                <HelpCircle className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Pertanyaan yang Sering Diajukan (FAQ)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-zinc-400">
                                    Jawaban cepat atas pertanyaan umum seputar operasional RPK App.
                                </p>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                            {FAQS.map((faq, fIdx) => (
                                <div key={fIdx} className="py-3.5">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                                        className="flex w-full items-center justify-between gap-4 text-left text-xs font-bold text-slate-800 transition-colors hover:text-blue-600 sm:text-sm dark:text-zinc-200 dark:hover:text-blue-400"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown
                                            className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                                                openFaq === fIdx ? 'rotate-180 text-blue-600' : ''
                                            }`}
                                        />
                                    </button>
                                    {openFaq === fIdx && (
                                        <div className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. Need Direct Assistance Banner */}
                    <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-linear-to-r from-slate-900 to-indigo-950 p-6 text-white shadow-xl sm:flex-row sm:items-center dark:border-white/10 dark:from-[#161922] dark:to-[#0f1117]">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-blue-300 uppercase">
                                <Sparkles className="size-3" />
                                <span>BANTUAN TEKNIS FIRMA</span>
                            </div>
                            <h4 className="text-base font-bold">
                                Butuh panduan khusus atau kendala teknis?
                            </h4>
                            <p className="max-w-xl text-xs text-slate-300">
                                Tim IT &amp; Administrator RPK App siap membantu konfigurasi akun, template dokumen khusus, atau pemulihan hak akses Anda.
                            </p>
                        </div>
                        <a
                            href="mailto:admin@rpklawoffice.com?subject=Bantuan%20Penggunaan%20RPK%20App"
                            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-md transition-transform hover:scale-102 hover:bg-slate-100"
                        >
                            Hubungi Admin IT
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
