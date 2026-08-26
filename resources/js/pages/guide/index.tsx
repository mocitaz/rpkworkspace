import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Briefcase,
    Calendar,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock,
    Command,
    Copy,
    CreditCard,
    ExternalLink,
    FileCheck,
    FileText,
    HelpCircle,
    KeyRound,
    Lock,
    QrCode,
    Receipt,
    Scale,
    Search,
    Shield,
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
        legalRef?: string;
    }[];
}

const GUIDES: GuideItem[] = [
    {
        id: 'matters',
        code: 'SOP-OPS-01',
        category: 'Perkara',
        title: 'Manajemen Perkara & Uji Konflik Kepentingan',
        description: 'Alur registrasi perkara terpadu mulai dari conflict check otomatis, pembagian wewenang kuasa hukum, matriks alat bukti, jadwal sidang, hingga inkracht.',
        image: '/images/guide/matter.jpg',
        route: '/matters',
        actionLabel: 'Buka Modul Perkara',
        badge: 'Litigasi & Non-Litigasi',
        steps: [
            {
                num: '1',
                title: 'Uji Benturan Kepentingan (Conflict Check)',
                desc: 'Buka menu Perkara → "+ Registrasi Perkara Baru". Masukkan identitas lawan; sistem memverifikasi data silang untuk memastikan tidak ada konflik kepentingan.',
                role: 'Lead Partner',
                legalRef: 'KEAI Pasal 4',
            },
            {
                num: '2',
                title: 'Penugasan Tim Advokat & Kuasa Hukum',
                desc: 'Tunjuk Lead Partner penanggung jawab, Partner pendamping, dan Paralegal penelaah berkas. Hak akses data perkara otomatis disinkronkan.',
                role: 'Managing Partner',
            },
            {
                num: '3',
                title: 'Pencatatan Kronologi & Brankas Bukti Surat (P-1 s.d. P-n)',
                desc: 'Unggah salinan draf gugatan, jawaban, replik, duplik, dan tandai nomor alat bukti surat di brankas digital.',
                role: 'Associate',
                legalRef: 'HIR / RBg',
            },
            {
                num: '4',
                title: 'Penyelesaian Putusan & Arsip Inkracht',
                desc: 'Perbarui status menjadi inkracht, unduh Executive Summary Report untuk klien, dan simpan berkas ke arsip permanen.',
                role: 'Lead Partner',
            },
        ],
    },
    {
        id: 'signatures',
        code: 'SOP-DOC-02',
        category: 'Dokumen',
        title: 'Generator Dokumen & Tanda Tangan Digital',
        description: 'Pembuatan otomatis draf surat kuasa khusus dari template resmi firma, sirkulasi penandatanganan elektronik, dan verifikasi QR Code keabsahan berkas.',
        image: '/images/guide/signature.jpg',
        route: '/documents',
        actionLabel: 'Buka Modul Dokumen',
        badge: 'UU ITE No. 1/2024',
        steps: [
            {
                num: '1',
                title: 'Generate Draf dari Template Baku',
                desc: 'Pilih template Surat Kuasa Khusus atau Somasi. Pilih Klien & Perkara; nama penerima kuasa, NIA, dan data lawan terisi otomatis.',
                role: 'Associate / Admin',
            },
            {
                num: '2',
                title: 'Sirkulasi Tanda Tangan Elektronik',
                desc: 'Kirimkan draf ke penandatangan (Klien & Advokat). Klien menerima tautan verifikasi aman via email untuk menandatangani langsung dari browser.',
                role: 'Lead Partner',
            },
            {
                num: '3',
                title: 'Pemeriksaan Integritas via Segel QR Code',
                desc: 'Setiap berkas selesai dilengkapi QR Code dan hash SHA-256 untuk membuktikan keaslian dan legalitas dokumen di hadapan pengadilan.',
                role: 'Klien / Pihak Ketiga',
                legalRef: 'Pasal 11 UU ITE',
            },
        ],
    },
    {
        id: 'finance',
        code: 'SOP-FIN-03',
        category: 'Keuangan',
        title: 'Honorarium Hukum, Invoice & Pajak PPh 23',
        description: 'Penerbitan tagihan profesional, penagihan termin retainer fee, kalkulasi otomatis potongan pajak PPh 23 (2%), dan pencetakan kuitansi resmi.',
        image: '/images/guide/finance.jpg',
        route: '/finance',
        actionLabel: 'Buka Modul Keuangan',
        badge: 'PMK No. 168/2023',
        steps: [
            {
                num: '1',
                title: 'Penerbitan Invoice Tagihan Klien',
                desc: 'Buka menu Keuangan → "+ Buat Tagihan / Invoice". Masukkan komponen Legal Retainer Fee, Success Fee, atau Court Fee; pajak terhitung otomatis.',
                role: 'Finance / Partner',
            },
            {
                num: '2',
                title: 'Konfirmasi Pembayaran & Kuitansi Resmi',
                desc: 'Unggah bukti setor bank, verifikasi status pembayaran menjadi Lunas (Paid), dan cetak Kuitansi Resmi ber-barcode untuk diserahkan ke klien.',
                role: 'Finance Specialist',
            },
        ],
    },
    {
        id: 'calendar',
        code: 'SOP-CAL-04',
        category: 'Kalender',
        title: 'Kalender Persidangan & Sinkronisasi Agenda',
        description: 'Pencatatan terpadu sidang pengadilan, mediasi, tenggat waktu banding/kasasi 14 hari, serta sinkronisasi feed kalender iCal ke smartphone.',
        image: '/images/guide/calendar.jpg',
        route: '/calendar',
        actionLabel: 'Buka Kalender Sidang',
        badge: 'PERMA No. 1/2019',
        steps: [
            {
                num: '1',
                title: 'Input Jadwal Sidang & Instansi Pengadilan',
                desc: 'Tambahkan agenda persidangan baru dengan rincian instansi pengadilan, nomor ruang sidang, serta advokat yang ditunjuk hadir.',
                role: 'Associate / Paralegal',
            },
            {
                num: '2',
                title: 'Notifikasi Alarm Sidang (H-7 & H-1)',
                desc: 'Sistem mengirimkan email pengingat dan notifikasi sistem 7 hari dan 24 jam sebelum sidang dilaksanakan.',
                role: 'Sistem Otomatis',
            },
            {
                num: '3',
                title: 'Sinkronisasi iCal Feed ke Ponsel',
                desc: 'Klik tombol "Sinkronkan iCal Feed" di halaman Kalender untuk menghubungkan seluruh agenda kerja ke Google / Apple Calendar di ponsel Anda.',
                role: 'Seluruh Advokat',
            },
        ],
    },
    {
        id: 'clients',
        code: 'SOP-KYC-05',
        category: 'Klien',
        title: 'Direktori Klien & Kepatuhan Legalitas (KYC/AML)',
        description: 'Basis data induk klien perorangan dan korporasi, pemantauan masa berlaku izin legalitas/NIB, serta kepatuhan anti-pencucian uang.',
        image: '/images/guide/kyc.jpg',
        route: '/clients',
        actionLabel: 'Buka Direktori Klien',
        badge: 'Standar PMPJ & PPATK',
        steps: [
            {
                num: '1',
                title: 'Registrasi Entitas Klien',
                desc: 'Daftarkan identitas resmi pihak yang diwakili (PT, CV, Yayasan, atau Perorangan) beserta kontak pejabat penanggung jawab.',
                role: 'Admin / Associate',
            },
            {
                num: '2',
                title: 'Uji Kelayakan KYC & Monitoring Akta Legalitas',
                desc: 'Unggah Akta Pendirian, SK Kemenkumham, NPWP, dan NIB. Catat masa berlaku dokumen untuk mengaktifkan pengingat perpanjangan izin.',
                role: 'Compliance / Partner',
            },
        ],
    },
    {
        id: 'passkeys',
        code: 'SOP-SEC-06',
        category: 'Keamanan',
        title: 'Autentikasi Passkey Biometrik & Keamanan Akun',
        description: 'Login instan aman menggunakan Touch ID, Face ID, atau PIN perangkat berstandar FIDO2 WebAuthn tanpa perlu mengetik kata sandi.',
        image: '/images/guide/passkey.jpg',
        route: '/settings/profile',
        actionLabel: 'Buka Pengaturan Keamanan',
        badge: 'FIDO2 Hardware Auth',
        steps: [
            {
                num: '1',
                title: 'Lengkapi Kredensial Advokat (NIA & BAS)',
                desc: 'Buka Pengaturan Profil (klik avatar kanan atas → Pengaturan), lalu lengkapi Nomor Induk Advokat dan tanggal Sumpah Advokat.',
                role: 'Seluruh Pengguna',
            },
            {
                num: '2',
                title: 'Aktivasi Sensor Biometrik (Passkey)',
                desc: 'Masuk tab "Keamanan", klik "Daftarkan Passkey Baru", dan sentuh sensor sidik jari perangkat. Selanjutnya Anda bisa login tanpa password.',
                role: 'Seluruh Pengguna',
            },
        ],
    },
    {
        id: 'rbac',
        code: 'SOP-ADM-07',
        category: 'Admin',
        title: 'Tata Kelola Staf, 26 Matriks RBAC & Audit Trail',
        description: 'Pengaturan struktur 8 tingkatan jabatan advokat, pembatasan hak akses berkas sensitif perkara, serta audit log rekaman aktivitas sistem.',
        image: '/images/guide/rbac.jpg',
        route: '/admin/users',
        actionLabel: 'Kelola Staf & Peran',
        badge: 'Segregation of Duties',
        steps: [
            {
                num: '1',
                title: 'Penetapan Role Jabatan & Matriks Izin',
                desc: 'Buka menu Admin → Manajemen Staf. Tentukan tingkatan wewenang dan sesuaikan 26 parameter izin modul sesuai tanggung jawab staf.',
                role: 'Managing Partner / Admin',
            },
            {
                num: '2',
                title: 'Audit Trail & Monitoring Jejak Digital',
                desc: 'Periksa log aktivitas pada modul Audit Trail untuk memantau alamat IP, waktu presisi, dan rekaman perubahan data sensitif firma.',
                role: 'IT Security / Admin',
            },
        ],
    },
];

const FAQS = [
    {
        q: 'Bagaimana cara menambahkan tanda tangan saya ke draf dokumen resmi?',
        a: 'Buka menu Pengaturan Profil (klik avatar di pojok kanan atas → Pengaturan), pilih tab "Spesimen Tanda Tangan", lalu goreskan tanda tangan Anda pada canvas digital atau unggah berkas PNG berlatar transparan.',
    },
    {
        q: 'Apakah klien wajib memiliki akun aplikasi untuk menandatangani dokumen?',
        a: 'Tidak wajib. Klien akan menerima tautan verifikasi aman melalui email yang memungkinkan mereka meninjau draf dan menandatangani dokumen secara resmi langsung dari peramban ponsel atau komputer tanpa perlu membuat akun.',
    },
    {
        q: 'Bagaimana cara menghubungkan kalender persidangan ke smartphone saya?',
        a: 'Buka halaman Kalender, klik tombol "Sinkronkan iCal Feed" di sudut atas, lalu salin tautan feed privat ke aplikasi Google Calendar, Apple Calendar, atau Outlook di ponsel Anda.',
    },
    {
        q: 'Mengapa muncul pesan "Akses Ditolak / 403" saat membuka modul tertentu?',
        a: 'Pesan Error 403 menandakan akun Anda belum diberikan wewenang pada modul tersebut oleh Administrator. Silakan hubungi Managing Partner atau Administrator firma untuk penyesuaian hak akses 26 matriks RBAC.',
    },
    {
        q: 'Bagaimana cara mengaktifkan login biometrik (Touch ID / Face ID)?',
        a: 'Masuk ke menu Pengaturan → tab "Keamanan / Security". Klik "Daftarkan Passkey Baru" dan sentuh sensor biometrik perangkat Anda. Selanjutnya Anda dapat masuk secara instan tanpa mengetik kata sandi.',
    },
];

const CATEGORIES = [
    'Semua',
    'Perkara',
    'Dokumen',
    'Keuangan',
    'Kalender',
    'Klien',
    'Keamanan',
    'Admin',
];

export default function GuideIndex() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);

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

    const handleCopyShortcut = () => {
        navigator.clipboard.writeText('Cmd + K');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

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
                                Tata kelola operasional terpadu: manajemen perkara, uji konflik etis, surat kuasa digital, dan penagihan honorarium.
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
                                    placeholder="Cari panduan alur, berkas, invoice..."
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

                    {/* 3. Main Operational Guides Grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {filteredGuides.map((item) => (
                            <div
                                key={item.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs transition-all duration-200 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#14161b] dark:hover:border-white/15"
                            >
                                <div>
                                    {/* Visual Image Header */}
                                    <div className="relative h-44 w-full overflow-hidden bg-slate-900 sm:h-48">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-cover object-center opacity-90 transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                                        <div className="absolute right-4 bottom-3.5 left-4 flex items-center justify-between text-white">
                                            <div className="flex items-center gap-2">
                                                <span className="rounded bg-white/20 px-2 py-0.5 font-mono text-[9.5px] font-bold tracking-wider uppercase backdrop-blur-xs">
                                                    {item.code}
                                                </span>
                                                <span className="font-mono text-[9px] text-white/80">
                                                    {item.badge}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guide Content Body */}
                                    <div className="space-y-4 p-5">
                                        <div className="space-y-1">
                                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                                {item.title}
                                            </h2>
                                            <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Step-by-Step Breakdown */}
                                        <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-white/[0.04]">
                                            <span className="font-mono text-[9.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                                LANGKAH EKSEKUSI OPERASIONAL:
                                            </span>

                                            <div className="space-y-2">
                                                {item.steps.map((st) => (
                                                    <div
                                                        key={st.num}
                                                        className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 text-xs dark:border-white/[0.03] dark:bg-white/[0.02]"
                                                    >
                                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-200 font-mono text-[10px] font-bold text-slate-800 dark:bg-white/10 dark:text-white">
                                                            {st.num}
                                                        </span>
                                                        <div className="min-w-0 flex-1 space-y-0.5">
                                                            <div className="flex flex-wrap items-center justify-between gap-1">
                                                                <span className="font-bold text-slate-900 dark:text-white">
                                                                    {st.title}
                                                                </span>
                                                                <span className="font-mono text-[9px] text-slate-500 dark:text-zinc-400">
                                                                    {st.role}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400">
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
                                <div className="border-t border-slate-100 bg-slate-50/50 p-3.5 dark:border-white/[0.04] dark:bg-[#12141a]">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-full justify-between rounded-lg border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#14161b] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
                                    >
                                        <Link href={item.route}>
                                            <span>{item.actionLabel}</span>
                                            <ArrowRight className="size-3.5 text-slate-400" />
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

                    {/* 4. Keyboard Shortcuts & Support Row */}
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                        {/* Keyboard Shortcuts */}
                        <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.08] dark:bg-[#14161b]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <Terminal className="size-3.5 text-slate-700 dark:text-zinc-300" />
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        Pintasan Keyboard
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyShortcut}
                                    className="font-mono text-[9px] font-bold text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-300"
                                >
                                    {isCopied ? 'TERSALIN' : 'SALIN'}
                                </button>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-zinc-400">Command Palette</span>
                                    <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                        ⌘K / Ctrl+K
                                    </kbd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-zinc-400">Tutup Modal Dialog</span>
                                    <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                        ESC
                                    </kbd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-600 dark:text-zinc-400">Pindah Form Berikutnya</span>
                                    <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                        Tab
                                    </kbd>
                                </div>
                            </div>
                        </div>

                        {/* Quick FAQ Container */}
                        <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs lg:col-span-2 dark:border-white/[0.08] dark:bg-[#14161b]">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 dark:border-white/[0.04]">
                                <HelpCircle className="size-3.5 text-slate-700 dark:text-zinc-300" />
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    Tanya Jawab Kendala &amp; Solusi (FAQ)
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                {FAQS.map((faq, fIdx) => (
                                    <div key={fIdx} className="py-2.5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenFaqIndex(
                                                    openFaqIndex === fIdx
                                                        ? null
                                                        : fIdx,
                                                )
                                            }
                                            className="flex w-full items-center justify-between gap-4 text-left text-xs font-bold text-slate-800 hover:text-slate-950 dark:text-zinc-200 dark:hover:text-white"
                                        >
                                            <span>{faq.q}</span>
                                            <ChevronDown
                                                className={`size-3.5 shrink-0 text-slate-400 transition-transform ${
                                                    openFaqIndex === fIdx
                                                        ? 'rotate-180 text-slate-900 dark:text-white'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                        {openFaqIndex === fIdx && (
                                            <div className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
