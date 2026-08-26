import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Briefcase,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    CheckSquare,
    ChevronDown,
    Clock,
    Command,
    Copy,
    CreditCard,
    ExternalLink,
    FileCheck,
    FileText,
    FileUp,
    HelpCircle,
    Inbox,
    KeyRound,
    Layers,
    ListTodo,
    Lock,
    Mail,
    PenLine,
    QrCode,
    Receipt,
    Scale,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Terminal,
    UserCheck,
    Users,
    Workflow,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GuideItem {
    id: string;
    code: string;
    category: string;
    title: string;
    description: string;
    image: string;
    route: string;
    actionLabel: string;
    badge: string;
    steps: {
        num: string;
        title: string;
        desc: string;
        role: string;
    }[];
}

const GUIDES: GuideItem[] = [
    {
        id: 'matters',
        code: 'SOP-OPS-01',
        category: 'Perkara',
        title: 'Manajemen Perkara & Uji Konflik Kepentingan',
        description: 'Alur penanganan perkara: conflict check otomatis, penunjukan kuasa hukum, brankas bukti surat (P-1 s.d. P-n), kronologi perkara, hingga putusan inkracht.',
        image: '/images/guide/matter.jpg',
        route: '/matters',
        actionLabel: 'Buka Modul Perkara',
        badge: 'Litigasi & Non-Litigasi',
        steps: [
            {
                num: '1',
                title: 'Conflict of Interest Check',
                desc: 'Klik "+ Registrasi Perkara Baru", input identitas lawan dan kuasa hukum lawan; sistem mencocokkan riwayat perkara aktif secara instan.',
                role: 'Lead Partner',
            },
            {
                num: '2',
                title: 'Penetapan Tim Kuasa Hukum',
                desc: 'Tentukan Lead Partner penanggung jawab, Partner pendamping, dan Paralegal; hak akses berkas perkara tersinkronisasi otomatis.',
                role: 'Managing Partner',
            },
            {
                num: '3',
                title: 'Kronologi & Brankas Bukti Surat',
                desc: 'Catat peristiwa hukum kronologis, unggah draf gugatan/replik/kesimpulan, dan tandai nomor alat bukti surat (P-1 s.d. P-n).',
                role: 'Associate / Paralegal',
            },
        ],
    },
    {
        id: 'signatures',
        code: 'SOP-DOC-02',
        category: 'Dokumen',
        title: 'Repositori Dokumen & Tanda Tangan Elektronik',
        description: 'Unggah berkas privat, audit jejak versi dokumen (SHA-256), persetujuan internal, sirkulasi tanda tangan elektronik, dan verifikasi segel QR Code.',
        image: '/images/guide/signature.jpg',
        route: '/documents',
        actionLabel: 'Buka Modul Dokumen',
        badge: 'UU ITE & QR Verification',
        steps: [
            {
                num: '1',
                title: 'Unggah Dokumen & Manajemen Versi',
                desc: 'Unggah berkas PDF/DOCX ke brankas dokumen; sistem mencatat nomor versi, hash SHA-256, dan ekstraksi teks otomatis.',
                role: 'Associate / Staf',
            },
            {
                num: '2',
                title: 'Persetujuan & Permintaan Tanda Tangan',
                desc: 'Ajukan Approval internal dan kirim permintaan tanda tangan; klien menerima tautan verifikasi email untuk menandatangani langsung di browser.',
                role: 'Lead Partner / Finance',
            },
            {
                num: '3',
                title: 'Verifikasi Segel QR & Sertifikat',
                desc: 'Unduh Signed PDF lengkap dengan QR Code keabsahan publik dan Certificate of Completion yang sah berkekuatan hukum.',
                role: 'Klien / Pihak Ketiga',
            },
        ],
    },
    {
        id: 'finance',
        code: 'SOP-FIN-03',
        category: 'Keuangan',
        title: 'Honorarium Hukum, Invoice, Biaya & PPh 23',
        description: 'Penerbitan penawaran (quotation), tagihan invoice perkara, pencatatan biaya operasional (expenses), potongan pajak PPh 23 (2%), dan kuitansi resmi.',
        image: '/images/guide/finance.jpg',
        route: '/finance',
        actionLabel: 'Buka Modul Keuangan',
        badge: 'PMK No. 168/2023',
        steps: [
            {
                num: '1',
                title: 'Penerbitan Quotation & Invoice Tagihan',
                desc: 'Susun rincian tagihan Retainer Fee, Success Fee, atau Court Fee; potongan pajak PPh 23 (2%) dihitung otomatis oleh sistem.',
                role: 'Finance / Partner',
            },
            {
                num: '2',
                title: 'Pencatatan Biaya Sidang (Expenses)',
                desc: 'Catat pengeluaran riil perkara (pendaftaran pengadilan, leges bukti, akomodasi) untuk keperluan klaim reimbursement.',
                role: 'Finance Specialist',
            },
            {
                num: '3',
                title: 'Verifikasi Bayar & Kuitansi PDF',
                desc: 'Unggah bukti transfer bank, ubah status menjadi Lunas (Paid), dan cetak Kuitansi Resmi ber-barcode untuk klien.',
                role: 'Finance / Managing Partner',
            },
        ],
    },
    {
        id: 'calendar',
        code: 'SOP-CAL-04',
        category: 'Kalender',
        title: 'Kalender Persidangan & Sinkronisasi Agenda',
        description: 'Pencatatan agenda sidang pengadilan, mediasi, tenggat upaya hukum 14 hari, notifikasi alarm H-7/H-1, serta sinkronisasi iCal feed ke ponsel.',
        image: '/images/guide/calendar.jpg',
        route: '/calendar',
        actionLabel: 'Buka Kalender Sidang',
        badge: 'PERMA No. 1/2019',
        steps: [
            {
                num: '1',
                title: 'Input Jadwal Sidang & Ruang',
                desc: 'Catat institusi pengadilan, nomor ruang sidang, agenda pembuktian, checklist persiapan, dan advokat yang ditugaskan.',
                role: 'Associate / Paralegal',
            },
            {
                num: '2',
                title: 'Alarm Notifikasi Sidang (H-7 & H-1)',
                desc: 'Sistem mengirimkan email pengingat otomatis sebelum agenda sidang dan memantau batas waktu memori banding/kasasi.',
                role: 'Sistem Otomatis',
            },
            {
                num: '3',
                title: 'Sinkronisasi iCal ke Smartphone',
                desc: 'Salin URL token iCal feed pribadi untuk menyinkronkan seluruh jadwal ke Google Calendar, Apple Calendar, atau Outlook.',
                role: 'Seluruh Advokat',
            },
        ],
    },
    {
        id: 'tasks',
        code: 'SOP-TSK-05',
        category: 'Tugas',
        title: 'Manajemen Tugas, Tenggat Waktu & Diskusi',
        description: 'Pendelegasian tugas drafting berkas hukum, riset yurisprudensi perkara, pemantauan prioritas (Critical/High), dan diskusi internal terpusat.',
        image: '/images/guide/task.jpg',
        route: '/tasks',
        actionLabel: 'Buka Modul Tugas',
        badge: 'Task Management & Diskusi',
        steps: [
            {
                num: '1',
                title: 'Pendelegasian Tugas & Prioritas',
                desc: 'Buat tugas baru, hubungkan dengan perkara terkait, tetapkan staf penanggung jawab, prioritas, dan tenggat waktu penyelesaian.',
                role: 'Lead Partner / Senior',
            },
            {
                num: '2',
                title: 'Pembaruan Progres & Status Tugas',
                desc: 'Perbarui status pengerjaan tugas dari Pending → In Progress → Review → Completed secara transparan.',
                role: 'Associate / Paralegal',
            },
            {
                num: '3',
                title: 'Ruang Diskusi & Lampiran Berkas',
                desc: 'Gunakan kotak komentar diskusi pada perkara untuk membahas strategi hukum tanpa tercecer di aplikasi pesan pribadi.',
                role: 'Seluruh Tim Perkara',
            },
        ],
    },
    {
        id: 'clients',
        code: 'SOP-KYC-06',
        category: 'Klien',
        title: 'Direktori Klien & Kepatuhan Legalitas (KYC/AML)',
        description: 'Basis data induk klien perorangan dan korporasi, pencatatan kontak penanggung jawab, serta pemantauan masa berlaku dokumen kepatuhan/NIB.',
        image: '/images/guide/kyc.jpg',
        route: '/clients',
        actionLabel: 'Buka Direktori Klien',
        badge: 'Prinsip PMPJ & PPATK',
        steps: [
            {
                num: '1',
                title: 'Registrasi Entitas Klien',
                desc: 'Input data identitas resmi pihak yang diwakili (Korporasi PT/CV/Yayasan atau Perorangan) beserta kontak penanggung jawab hukum.',
                role: 'Admin / Associate',
            },
            {
                num: '2',
                title: 'Unggah Berkas Kepatuhan (KYC)',
                desc: 'Unggah Akta Pendirian, SK Kemenkumham, NPWP Badan, dan NIB pada tab "Dokumen Kepatuhan" profil klien.',
                role: 'Compliance / Partner',
            },
            {
                num: '3',
                title: 'Monitoring Masa Berlaku Izin',
                desc: 'Catat tanggal kedaluwarsa izin berusaha agar sistem memberikan sinyal alarm pengingat perpanjangan legalitas tepat waktu.',
                role: 'Sistem Otomatis',
            },
        ],
    },
    {
        id: 'governance',
        code: 'SOP-GOV-07',
        category: 'Tata Kelola',
        title: 'Korespondensi Surat, Legal Hold & Ekspor Arsip',
        description: 'Pencatatan korespondensi surat masuk/keluar firma, proteksi pembekuan berkas perkara (Legal Hold), dan ekspor paket arsip digital perkara (ZIP).',
        image: '/images/guide/governance.jpg',
        route: '/governance',
        actionLabel: 'Buka Tata Kelola',
        badge: 'Legal Hold & Correspondence',
        steps: [
            {
                num: '1',
                title: 'Registrasi Surat Masuk & Keluar',
                desc: 'Catat surat resmi firma, nomor agenda surat, instansi pengirim/penerima, ringkasan perihal, dan unggah lampiran PDF.',
                role: 'Admin / Paralegal',
            },
            {
                num: '2',
                title: 'Aktivasi Status Legal Hold',
                desc: 'Terapkan status Legal Hold pada perkara aktif untuk mengunci berkas dan mencegah perubahan atau penghapusan data secara sepihak.',
                role: 'Managing Partner',
            },
            {
                num: '3',
                title: 'Arsip Perkara & Ekspor Paket ZIP',
                desc: 'Arsipkan perkara yang selesai dan unduh bundel arsip digital lengkap (berkas, bukti, kronologi) dalam format file ZIP.',
                role: 'Lead Partner / Admin',
            },
        ],
    },
    {
        id: 'passkeys',
        code: 'SOP-SEC-08',
        category: 'Keamanan',
        title: 'Autentikasi Passkey Biometrik, 2FA & Tanda Tangan',
        description: 'Pengaturan kredensial advokat (NIA & BAS), spesimen tanda tangan digital, aktivasi verifikasi dua langkah (2FA), dan login biometrik Passkey (FIDO2).',
        image: '/images/guide/passkey.jpg',
        route: '/settings/profile',
        actionLabel: 'Buka Pengaturan Keamanan',
        badge: 'FIDO2 & 2FA Security',
        steps: [
            {
                num: '1',
                title: 'Kredensial Advokat & Spesimen TTD',
                desc: 'Buka Profil Pengaturan, lengkapi Nomor Induk Advokat (NIA), tanggal BAS, dan goreskan tanda tangan pada canvas digital spesimen.',
                role: 'Seluruh Pengguna',
            },
            {
                num: '2',
                title: 'Aktivasi Autentikasi 2FA (TOTP)',
                desc: 'Pindai kode QR menggunakan Google Authenticator atau aplikasi OTP untuk perlindungan lapis ganda saat login.',
                role: 'Seluruh Pengguna',
            },
            {
                num: '3',
                title: 'Daftarkan Passkey Biometrik (FIDO2)',
                desc: 'Klik "Daftarkan Passkey Baru" dan sentuh sensor Touch ID, Face ID, atau PIN perangkat untuk login instan tanpa kata sandi.',
                role: 'Seluruh Pengguna',
            },
        ],
    },
    {
        id: 'rbac',
        code: 'SOP-ADM-09',
        category: 'Admin',
        title: 'Tata Kelola Staf, 26 Matriks RBAC & Audit Trail',
        description: 'Manajemen akun staf firma, penyesuaian 26 matriks izin modul peran, pemantauan log audit trail real-time, dan ekspor laporan keamanan.',
        image: '/images/guide/rbac.jpg',
        route: '/admin/users',
        actionLabel: 'Kelola Staf & Peran',
        badge: '26 RBAC Matrix & Audit',
        steps: [
            {
                num: '1',
                title: 'Manajemen Akun Staf & Role Jabatan',
                desc: 'Tambah akun baru dan tetapkan jabatan (Managing Partner, Senior Partner, Partner, Senior Associate, Associate, Trainee, Finance, Admin).',
                role: 'Managing Partner / Admin',
            },
            {
                num: '2',
                title: 'Penyesuaian 26 Matriks Izin RBAC',
                desc: 'Atur wewenang akses per peran (lihat keuangan, buat perkara, tanda tangani dokumen, hapus berkas) melalui tabel matriks izin.',
                role: 'Managing Partner / Admin',
            },
            {
                num: '3',
                title: 'Audit Trail & Ekspor Log Keamanan',
                desc: 'Akses modul Audit Trail untuk memantau alamat IP, perangkat, waktu presisi, riwayat modifikasi data, dan unduh laporan CSV.',
                role: 'IT Security / Admin',
            },
        ],
    },
];

interface FaqItem {
    category: string;
    q: string;
    a: string;
    route?: string;
    routeLabel?: string;
}

const FAQS: FaqItem[] = [
    {
        category: 'Spesimen Tanda Tangan',
        q: 'Bagaimana cara menambahkan tanda tangan saya ke draf dokumen resmi?',
        a: 'Buka menu Pengaturan Profil (klik avatar di pojok kanan atas → Pengaturan), lalu pada bagian "Spesimen Tanda Tangan", goreskan tanda tangan Anda pada canvas digital atau unggah berkas PNG berlatar transparan.',
        route: '/settings/profile',
        routeLabel: 'Buka Pengaturan Profil',
    },
    {
        category: 'Tanda Tangan Klien',
        q: 'Apakah klien wajib memiliki akun aplikasi untuk menandatangani dokumen?',
        a: 'Tidak wajib. Klien akan menerima tautan verifikasi aman melalui email yang memungkinkan mereka meninjau berkas dan menandatangani dokumen secara resmi langsung dari peramban ponsel atau komputer tanpa perlu membuat akun.',
        route: '/documents',
        routeLabel: 'Buka Repositori Dokumen',
    },
    {
        category: 'Kalender Persidangan',
        q: 'Bagaimana cara menghubungkan kalender persidangan ke smartphone saya?',
        a: 'Buka halaman Kalender, klik tombol "Sinkronkan iCal Feed" di sudut atas, lalu salin tautan feed privat ke aplikasi Google Calendar, Apple Calendar, atau Outlook di ponsel Anda.',
        route: '/calendar',
        routeLabel: 'Buka Kalender Sidang',
    },
    {
        category: 'Hak Akses & Wewenang',
        q: 'Mengapa muncul pesan "Akses Ditolak / 403" saat membuka modul tertentu?',
        a: 'Pesan Error 403 menandakan akun Anda belum diberikan wewenang pada modul tersebut oleh Administrator. Silakan hubungi Managing Partner atau Administrator firma untuk penyesuaian hak akses 26 matriks RBAC.',
        route: '/admin/users',
        routeLabel: 'Lihat Matriks Staf & Peran',
    },
    {
        category: 'Keamanan & Biometrik',
        q: 'Bagaimana cara mengaktifkan login biometrik (Touch ID / Face ID)?',
        a: 'Masuk ke menu Pengaturan → tab "Keamanan / Security". Klik "Daftarkan Passkey Baru" dan sentuh sensor biometrik perangkat Anda. Selanjutnya Anda dapat masuk secara instan tanpa mengetik kata sandi.',
        route: '/settings/profile',
        routeLabel: 'Daftarkan Passkey Sekarang',
    },
];

const CATEGORIES = [
    'Semua',
    'Perkara',
    'Dokumen',
    'Keuangan',
    'Kalender',
    'Tugas',
    'Klien',
    'Tata Kelola',
    'Keamanan',
    'Admin',
];

export default function GuideIndex() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const filteredGuides = useMemo(() => {
        return GUIDES.filter((g) => {
            const matchesCategory =
                selectedCategory === 'Semua' || g.category === selectedCategory;
            if (!matchesCategory) return false;

            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                g.title.toLowerCase().includes(q) ||
                g.description.toLowerCase().includes(q) ||
                g.code.toLowerCase().includes(q) ||
                g.category.toLowerCase().includes(q) ||
                g.steps.some(
                    (s) =>
                        s.title.toLowerCase().includes(q) ||
                        s.desc.toLowerCase().includes(q),
                )
            );
        });
    }, [selectedCategory, searchQuery]);

    return (
        <>
            <Head title="Cara Penggunaan & Panduan Sistem - RPK App" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Action Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/70 pb-5 md:flex-row md:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Panduan Cara Penggunaan RPK App
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Tata kelola operasional terpadu: manajemen perkara, repositori berkas, penagihan honorarium, jadwal sidang, dan tata kelola kantor hukum.
                            </p>
                        </div>

                        {/* Search Input Bar */}
                        <div className="w-full md:w-80">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari panduan alur, tugas, invoice..."
                                    className="h-9 w-full rounded-lg border-slate-200 bg-white pr-4 pl-9 text-xs shadow-2xs transition-all focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300 dark:border-white/10 dark:bg-[#14161b] dark:text-white"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute top-1/2 right-2.5 -translate-y-1/2 font-mono text-[9px] font-bold text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                                    >
                                        RESET
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    selectedCategory === cat
                                        ? 'bg-slate-900 text-white shadow-2xs dark:bg-white dark:text-slate-900'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-[#14161b] dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* 3. Main Operational Guides Grid (3 Columns x 3 Rows = 9 Cards) */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filteredGuides.map((item) => (
                            <div
                                key={item.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs transition-all duration-200 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b] dark:hover:border-white/15"
                            >
                                <div>
                                    {/* Visual Image Header */}
                                    <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-cover object-center opacity-90 transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                                        <div className="absolute right-3.5 bottom-3 left-3.5 flex items-center justify-between text-white">
                                            <span className="rounded bg-white/20 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase backdrop-blur-xs">
                                                {item.code}
                                            </span>
                                            <span className="font-mono text-[9px] text-white/80">
                                                {item.badge}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Guide Content Body */}
                                    <div className="space-y-3.5 p-4.5">
                                        <div className="space-y-1">
                                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {item.title}
                                            </h2>
                                            <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Step-by-Step Breakdown */}
                                        <div className="space-y-1.5 border-t border-slate-100 pt-3 dark:border-white/[0.04]">
                                            <span className="font-mono text-[9px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                                LANGKAH OPERASIONAL:
                                            </span>

                                            <div className="space-y-1.5">
                                                {item.steps.map((st) => (
                                                    <div
                                                        key={st.num}
                                                        className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 p-2 text-xs dark:border-white/[0.03] dark:bg-white/[0.02]"
                                                    >
                                                        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-slate-200 font-mono text-[9.5px] font-bold text-slate-800 dark:bg-white/10 dark:text-white">
                                                            {st.num}
                                                        </span>
                                                        <div className="min-w-0 flex-1 space-y-0.5">
                                                            <div className="flex items-center justify-between gap-1">
                                                                <span className="font-bold text-slate-900 truncate dark:text-white">
                                                                    {st.title}
                                                                </span>
                                                                <span className="font-mono text-[8.5px] text-slate-400 shrink-0 dark:text-zinc-500">
                                                                    {st.role}
                                                                </span>
                                                            </div>
                                                            <p className="line-clamp-2 text-[10.5px] leading-relaxed text-slate-500 dark:text-zinc-400">
                                                                {st.desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Direct Action Footer */}
                                <div className="border-t border-slate-100 bg-slate-50/50 p-3 dark:border-white/[0.04] dark:bg-[#12141a]">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="h-7.5 w-full justify-between rounded-lg border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                                    >
                                        <Link href={item.route}>
                                            <span>{item.actionLabel}</span>
                                            <ArrowRight className="size-3 text-slate-400" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredGuides.length === 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
                                Tidak ada panduan yang cocok dengan pencarian "{searchQuery}".
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('Semua');
                                }}
                                className="mt-3 text-xs"
                            >
                                Reset Filter
                            </Button>
                        </div>
                    )}

                    {/* 4. Enhanced Clean FAQ Section */}
                    <div className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                        <div className="flex flex-col justify-between gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-center dark:border-white/[0.04]">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="size-4 text-slate-700 dark:text-zinc-300" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Tanya Jawab Kendala &amp; Solusi (FAQ)
                                </h3>
                            </div>
                            <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                                {FAQS.length} Pertanyaan Umum
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {FAQS.map((faq, fIdx) => {
                                const isOpen = openFaqIndex === fIdx;
                                return (
                                    <div
                                        key={fIdx}
                                        className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                                            isOpen
                                                ? 'border-slate-300 bg-slate-50/70 shadow-2xs dark:border-white/15 dark:bg-white/[0.03]'
                                                : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/40 dark:border-white/[0.06] dark:bg-[#12141a] dark:hover:border-white/10 dark:hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                                            className="flex w-full items-center justify-between gap-4 p-4 text-left"
                                        >
                                            <div className="space-y-1">
                                                <span className="inline-block rounded-md border border-slate-200 bg-slate-100/70 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400">
                                                    {faq.category}
                                                </span>
                                                <h4 className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                                                    {faq.q}
                                                </h4>
                                            </div>
                                            <div className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 ${
                                                isOpen
                                                    ? 'rotate-180 border-slate-300 bg-slate-900 text-white dark:border-white/20 dark:bg-white dark:text-slate-900'
                                                    : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400'
                                            }`}>
                                                <ChevronDown className="size-3.5" />
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className="border-t border-slate-200/60 bg-white p-4 text-xs leading-relaxed text-slate-600 dark:border-white/[0.04] dark:bg-transparent dark:text-zinc-300">
                                                <p>{faq.a}</p>
                                                {faq.route && faq.routeLabel && (
                                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/[0.04]">
                                                        <Link
                                                            href={faq.route}
                                                            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            <span>{faq.routeLabel}</span>
                                                            <ArrowRight className="size-3" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
