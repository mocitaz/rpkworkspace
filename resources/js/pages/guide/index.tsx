import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    Award,
    BadgeCheck,
    Bookmark,
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
    FileCheck,
    FileCode,
    FileSpreadsheet,
    FileText,
    FolderKanban,
    HelpCircle,
    Info,
    KeyRound,
    Layers,
    Lock,
    Monitor,
    QrCode,
    Receipt,
    Search,
    Send,
    Shield,
    ShieldCheck,
    Sliders,
    Sparkles,
    Terminal,
    UserCheck,
    Users,
    Workflow,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StepItem {
    num: string;
    title: string;
    desc: string;
    details: string[];
    note?: string;
}

interface SectionItem {
    id: string;
    tabId: string;
    label: string;
    title: string;
    summary: string;
    icon: any;
    actionUrl: string;
    actionText: string;
    badgeText: string;
    steps: StepItem[];
}

export default function GuideIndex() {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [copiedShortcut, setCopiedShortcut] = useState(false);

    // Interactive Preview Tabs
    const [previewTab, setPreviewTab] = useState<'matter' | 'sign' | 'invoice' | 'calendar' | 'passkey'>('matter');

    const sections: SectionItem[] = [
        {
            id: 'auth-setup',
            tabId: 'start',
            label: 'Konfigurasi Akun',
            title: '1. Registrasi Akun, Data Advokat & Biometrik',
            summary: 'Langkah awal melengkapi kredensial formal advokat, spesimen tanda tangan, serta aktivasi login biometrik perangkat.',
            icon: KeyRound,
            actionUrl: '/settings/profile',
            actionText: 'Buka Pengaturan Profil',
            badgeText: 'PANDUAN AWAL',
            steps: [
                {
                    num: '01',
                    title: 'Lengkapi Data Kredensial Advokat (NIA & BAS)',
                    desc: 'Akses menu profil untuk mencantumkan Nomor Induk Advokat (NIA), Tanggal Berita Acara Sumpah (BAS) Pengadilan Tinggi, serta bidang keahlian hukum.',
                    details: [
                        'Klik foto avatar di sudut kanan atas → Pilih "Pengaturan / Settings".',
                        'Isi formulir legalitas pada bagian "Informasi Profesi Advokat".',
                        'Data kredensial ini akan menjadi parameter baku saat menerbitkan Surat Kuasa Khusus.',
                    ],
                    note: 'Kredensial yang lengkap menjamin validitas hukum pada lembar kuasa dan berkas pengadilan.',
                },
                {
                    num: '02',
                    title: 'Rekam Spesimen Tanda Tangan Elektronik',
                    desc: 'Bubuhkan spesimen tanda tangan resmi Anda pada canvas digital atau unggah berkas PNG berlatar transparan.',
                    details: [
                        'Buka tab "Spesimen Tanda Tangan" di halaman profil.',
                        'Goreskan tanda tangan menggunakan stylus / touchpad atau pilih unggah berkas bertanda tangan.',
                        'Simpan spesimen; tanda tangan Anda siap digunakan dalam modul penandatanganan dokumen.',
                    ],
                },
                {
                    num: '03',
                    title: 'Aktivasi Autentikasi Biometrik (Passkey FIDO2)',
                    desc: 'Daftarkan sensor Touch ID, Face ID, atau Windows Hello untuk akses masuk instan tanpa perlu mengetik kata sandi.',
                    details: [
                        'Masuk ke tab "Keamanan / Security" → Klik "Daftarkan Passkey Baru".',
                        'Sentuh sensor biometrik pada perangkat saat prompt sistem operasi muncul.',
                        'Pada sesi berikutnya, gunakan tombol "Masuk Cepat dengan Passkey (Biometrik)" di halaman login.',
                    ],
                    note: 'Passkey dilindungi oleh standar enkripsi asimetris perangkat dan kebal terhadap serangan phising.',
                },
            ],
        },
        {
            id: 'matters-lifecycle',
            tabId: 'matters',
            label: 'Manajemen Perkara',
            title: '2. Siklus Manajemen Perkara (Matters)',
            summary: 'Tata kelola perkara mulai dari pendaftaran nomor registrasi, penugasan tim kuasa hukum, hingga persidangan dan pengarsipan berkas.',
            icon: Briefcase,
            actionUrl: '/matters',
            actionText: 'Buka Modul Perkara',
            badgeText: 'OPERASIONAL UTAMA',
            steps: [
                {
                    num: '01',
                    title: 'Pendaftaran & Uji Konflik Kepentingan (Conflict Check)',
                    desc: 'Registrasi perkara baru diawali dengan verifikasi otomatis terhadap potensi benturan kepentingan dengan pihak lawan.',
                    details: [
                        'Buka menu "Manajemen Perkara" → Klik tombol "+ Buka Perkara Baru".',
                        'Pilih Klien pemohon, tentukan Kategori (Litigasi Perdata/Pidana/TUN, Non-Litigasi, atau Korporasi).',
                        'Masukkan nama pihak lawan dan afiliasi untuk menjalankan uji konflik otomatis terhadap database firma.',
                    ],
                },
                {
                    num: '02',
                    title: 'Penetapan Tim Kuasa Hukum & Lead Partner',
                    desc: 'Struktur tim advokat dibentuk dengan menentukan penanggung jawab utama dan associate pelaksana.',
                    details: [
                        'Tentukan Lead Partner yang bertanggung jawab atas strategi litigasi dan persetujuan berkas.',
                        'Tambahkan Associate dan Paralegal sebagai pendamping operasional perkara.',
                        'Hak akses terhadap dokumen sensitif perkara akan otomatis disinkronkan ke tim yang ditugaskan.',
                    ],
                },
                {
                    num: '03',
                    title: 'Pencatatan Kronologi, Pihak Terkait & Bukti Dokumen',
                    desc: 'Kelola seluruh instrumen hukum, matriks alat bukti surat, saksi ahli, dan risalah persidangan secara terpusat.',
                    details: [
                        'Catat peristiwa hukum secara kronologis beserta nomor kode referensi bukti surat (P-1, P-2, atau T-1, T-2).',
                        'Unggah salinan gugatan, eksepsi, replik, duplik, dan kesimpulan ke folder dokumen digital perkara.',
                        'Catat catatan perkembangan setiap kali persidangan selesai dilaksanakan.',
                    ],
                },
                {
                    num: '04',
                    title: 'Putusan Inkracht & Pengarsipan Digital',
                    desc: 'Setelah putusan berkekuatan hukum tetap, perkara diselesaikan secara administratif dan diarsipkan.',
                    details: [
                        'Ubah status perkara menjadi "Selesai / Putusan Inkracht" dan catat amar putusan.',
                        'Unduh "Executive Case Summary" dalam format PDF sebagai laporan akhir ke klien.',
                        'Arsipkan berkas digital ke penyimpanan jangka panjang firma.',
                    ],
                },
            ],
        },
        {
            id: 'clients-kyc',
            tabId: 'clients',
            label: 'Klien & KYC',
            title: '3. Direktori Klien & Kepatuhan Legalitas (KYC/AML)',
            summary: 'Pengelolaan data induk klien korporasi maupun perorangan yang terintegrasi dengan pemantauan masa berlaku dokumen legalitas.',
            icon: Users,
            actionUrl: '/clients',
            actionText: 'Buka Direktori Klien',
            badgeText: 'KEPATUHAN REGULASI',
            steps: [
                {
                    num: '01',
                    title: 'Registrasi Entitas Klien (Perorangan / Badan Usaha)',
                    desc: 'Daftarkan identitas resmi pihak yang diwakili kantor hukum.',
                    details: [
                        'Buka modul "Klien & Kontak" → Klik tombol "+ Tambah Klien".',
                        'Pilih tipe entitas: Korporasi (PT/CV/Yayasan) atau Perorangan (WNI/WNA).',
                        'Cantumkan penanggung jawab utama, alamat kantor/domisili, serta email resmi korespondensi.',
                    ],
                },
                {
                    num: '02',
                    title: 'Verifikasi Dokumen Legalitas & Jatuh Tempo',
                    desc: 'Unggah berkas kepatuhan hukum untuk menjamin kelengkapan legal standing klien.',
                    details: [
                        'Unggah Akta Pendirian, Akta Perubahan Terakhir, SK Kemenkumham, NPWP Badan, serta NIB.',
                        'Catat masa berlaku dokumen kepatuhan untuk mengaktifkan radar pengingat perpanjangan.',
                        'Sistem mengirimkan peringatan dini jika terdapat izin operasional atau akta klien yang mendekati kadaluwarsa.',
                    ],
                    note: 'Pemeriksaan kepatuhan yang ketat melindungi integritas firma dari risiko sengketa wewenang direksi.',
                },
            ],
        },
        {
            id: 'calendar-agenda',
            tabId: 'calendar',
            label: 'Kalender & Sidang',
            title: '4. Kalender Persidangan & Pengingat Upaya Hukum',
            summary: 'Manajemen terpadu seluruh agenda sidang pengadilan, mediasi, tenggat waktu banding/kasasi, dan sinkronisasi ke kalender ponsel.',
            icon: Calendar,
            actionUrl: '/calendar',
            actionText: 'Buka Kalender Sidang',
            badgeText: 'AGENDA & DEADLINE',
            steps: [
                {
                    num: '01',
                    title: 'Pencatatan Jadwal Sidang & Ruang Pengadilan',
                    desc: 'Input agenda sidang baru dengan rincian instansi dan pengacara pendamping.',
                    details: [
                        'Buka menu "Kalender" atau langsung dari tab Jadwal di halaman perkara.',
                        'Pilih institusi pengadilan (misal: Pengadilan Negeri Jakarta Pusat), nomor ruang, dan agenda pembuktian.',
                        'Tugaskan advokat yang ditunjuk untuk hadir di muka persidangan.',
                    ],
                },
                {
                    num: '02',
                    title: 'Otomatisasi Notifikasi Pengingat (H-7 & H-1)',
                    desc: 'Sistem secara otomatis memproses antrean notifikasi kepada seluruh anggota tim perkara.',
                    details: [
                        'Pengingat dikirimkan melalui email dan notifikasi dalam aplikasi 7 hari dan 24 jam sebelum sidang.',
                        'Tenggat waktu kritis (seperti batas 14 hari pendaftaran memori banding) terpantau di radar dashboard.',
                    ],
                },
                {
                    num: '03',
                    title: 'Sinkronisasi iCal Feed ke Ponsel',
                    desc: 'Hubungkan seluruh jadwal kerja firma ke Google Calendar, Apple Calendar, atau Microsoft Outlook.',
                    details: [
                        'Klik tombol "Sinkronkan iCal Feed" di bagian atas halaman Kalender.',
                        'Salin URL token privat dan tempelkan ke aplikasi kalender di perangkat Anda.',
                    ],
                },
            ],
        },
        {
            id: 'documents-signing',
            tabId: 'documents',
            label: 'Dokumen & Tanda Tangan',
            title: '5. Generator Dokumen & Tanda Tangan Elektronik Resmi',
            summary: 'Pembuatan draf surat kuasa instan dari template baku, sirkulasi penandatanganan elektronik, dan verifikasi QR Code keabsahan berkas.',
            icon: FileCheck,
            actionUrl: '/documents',
            actionText: 'Buka Modul Dokumen',
            badgeText: 'LEGAL DRAFTING',
            steps: [
                {
                    num: '01',
                    title: 'Penerbitan Berkas dari Template Baku Firma',
                    desc: 'Otomatisasi drafting Surat Kuasa Khusus, Surat Somasi, dan Perjanjian Kerjasama.',
                    details: [
                        'Buka menu "Dokumen" → Pilih tab "Template Otomatis".',
                        'Pilih template yang sesuai; pilih Perkara dan Klien target.',
                        'Variabel nama advokat, nomor perkara, data lawan, dan klausul kuasa akan terisi secara otomatis dan presisi.',
                    ],
                },
                {
                    num: '02',
                    title: 'Sirkulasi Permintaan Tanda Tangan Elektronik',
                    desc: 'Kirim dokumen PDF ke Managing Partner, Tim Advokat, atau Klien untuk ditandatangani secara digital.',
                    details: [
                        'Pilih berkas PDF → Klik "Kirim Permintaan Tanda Tangan".',
                        'Tentukan daftar penandatangan serta urutan persetujuan jika diperlukan.',
                        'Pihak luar menerima tautan verifikasi terenkripsi via email tanpa kewajiban membuat akun.',
                    ],
                },
                {
                    num: '03',
                    title: 'Pemeriksaan Integritas & Verifikasi Lembar QR Code',
                    desc: 'Setiap berkas yang telah ditandatangani memuat lembar verifikasi resmi dengan stempel kriptografi SHA-256.',
                    details: [
                        'Pindai QR Code di lembar dokumen menggunakan kamera ponsel.',
                        'Halaman verifikasi resmi RPK Law Firm akan mengonfirmasi keaslian dokumen, waktu penandatanganan, dan identitas para penandatangan.',
                    ],
                    note: 'Dokumen terproteksi dari perubahan isi pasca penandatanganan (tamper-evident).',
                },
            ],
        },
        {
            id: 'finance-invoicing',
            tabId: 'finance',
            label: 'Keuangan & Invoice',
            title: '6. Penagihan, Termin Honorarium & Kuitansi Resmi',
            summary: 'Manajemen fee hukum, rincian biaya operasional perkara, penerbitan invoice profesional, serta pemotongan pajak PPh 23/21.',
            icon: CreditCard,
            actionUrl: '/finance',
            actionText: 'Buka Modul Keuangan',
            badgeText: 'BILLING & FINANCE',
            steps: [
                {
                    num: '01',
                    title: 'Penerbitan Quotation & Invoice Tagihan Klien',
                    desc: 'Susun rincian tagihan profesional sesuai kesepakatan surat penawaran (Engagement Letter).',
                    details: [
                        'Buka menu "Keuangan" → Klik "+ Buat Tagihan / Invoice".',
                        'Pilih perkara dan klien; masukkan komponen Professional Legal Fee, Success Fee, atau Reimbursement.',
                        'Sistem secara otomatis mengalkulasi kalkulasi pajak PPh 23 (2%) atau PPh 21 dan rincian rekening transfer resmi firma.',
                    ],
                },
                {
                    num: '02',
                    title: 'Pencatatan Pembayaran & Penerbitan Kuitansi Resmi',
                    desc: 'Konfirmasi bukti transfer dari klien dan terbitkan kuitansi pelunasan.',
                    details: [
                        'Unggah bukti transfer rekening pada baris invoice yang bersangkutan.',
                        'Bagian Finance / Managing Partner memverifikasi status pembayaran menjadi "Lunas / Paid".',
                        'Cetak atau kirimkan Official Receipt (Kuitansi Resmi) bertanda tangan kepada klien.',
                    ],
                },
            ],
        },
        {
            id: 'rbac-governance',
            tabId: 'admin',
            label: 'Administrasi & RBAC',
            title: '7. Tata Kelola Staf, Matriks Hak Akses & Audit Log',
            summary: 'Pengaturan struktur organisasi, 26 matriks hak akses peran jabatan, serta audit jejak aktivitas sistem secara komprehensif.',
            icon: Shield,
            actionUrl: '/admin/users',
            actionText: 'Kelola Staf & Peran',
            badgeText: 'ADMINISTRATOR',
            steps: [
                {
                    num: '01',
                    title: 'Konfigurasi Jabatan Staf & Hak Akses (RBAC)',
                    desc: 'Penetapan wewenang berdasarkan tingkatan struktural kantor hukum.',
                    details: [
                        'Buka menu "Manajemen Staf & Peran" pada panel Admin.',
                        'Tetapkan jabatan: Managing Partner, Senior Partner, Partner, Senior Associate, Associate, Advokat Magang, Finance, atau Admin.',
                        'Sesuaikan 26 parameter izin independen untuk mengontrol akses modul data perkara dan keuangan.',
                    ],
                },
                {
                    num: '02',
                    title: 'Audit Trail & Rekaman Jejak Keamanan',
                    desc: 'Pantau seluruh aktivitas pengubahan data dan pengunduhan berkas sensitif secara real-time.',
                    details: [
                        'Akses modul "Audit Trail" untuk memeriksa riwayat aktivitas staf.',
                        'Laporan memuat alamat IP, perangkat, waktu presisi, serta data sebelum dan sesudah perubahan.',
                    ],
                    note: 'Audit log tersimpan secara permanen untuk mendukung standar kerahasiaan hubungan advokat dan klien.',
                },
            ],
        },
    ];

    const faqs = [
        {
            q: 'Bagaimana cara menambahkan tanda tangan saya ke dokumen resmi?',
            a: 'Buka menu Pengaturan Profil (klik avatar di pojok kanan atas → Pengaturan), pilih tab "Spesimen Tanda Tangan", lalu goreskan tanda tangan Anda pada canvas digital atau unggah berkas PNG berlatar transparan.',
        },
        {
            q: 'Apakah klien wajib memiliki akun untuk menandatangani dokumen elektronik?',
            a: 'Tidak wajib. Klien akan menerima tautan verifikasi aman melalui email yang memungkinkan mereka meninjau dan menandatangani dokumen langsung dari browser tanpa perlu mendaftar.',
        },
        {
            q: 'Bagaimana cara menghubungkan jadwal persidangan ke kalender smartphone?',
            a: 'Buka halaman Kalender, klik tombol "Sinkronkan iCal Feed", lalu salin URL feed privat ke aplikasi Google Calendar, Apple Calendar, atau Outlook di perangkat Anda.',
        },
        {
            q: 'Mengapa muncul pesan "Akses Ditolak / 403" saat membuka modul tertentu?',
            a: 'Pesan Error 403 menandakan akun Anda belum diberikan izin wewenang untuk modul tersebut oleh Administrator. Silakan hubungi Managing Partner atau Administrator firma untuk penyesuaian hak akses.',
        },
        {
            q: 'Bagaimana cara mengaktifkan login biometrik (Face ID / Sidik Jari)?',
            a: 'Masuk ke menu Pengaturan → tab "Keamanan / Security". Klik "Daftarkan Passkey Baru" dan sentuh sensor biometrik perangkat Anda. Selanjutnya Anda dapat masuk tanpa kata sandi.',
        },
    ];

    const filteredSections = useMemo(() => {
        return sections.filter((s) => {
            const matchesTab = activeTab === 'all' || s.tabId === activeTab;
            if (!searchQuery.trim()) return matchesTab;

            const q = searchQuery.toLowerCase();
            const matchesTitle = s.title.toLowerCase().includes(q);
            const matchesSummary = s.summary.toLowerCase().includes(q);
            const matchesSteps = s.steps.some(
                (step) =>
                    step.title.toLowerCase().includes(q) ||
                    step.desc.toLowerCase().includes(q) ||
                    step.details.some((d) => d.toLowerCase().includes(q)),
            );

            return matchesTab && (matchesTitle || matchesSummary || matchesSteps);
        });
    }, [activeTab, searchQuery]);

    const copyCommand = () => {
        navigator.clipboard.writeText('Cmd + K');
        setCopiedShortcut(true);
        setTimeout(() => setCopiedShortcut(false), 2000);
    };

    return (
        <>
            <Head title="Cara Penggunaan & Panduan Sistem - RPK App" />

            <div className="min-h-screen bg-[#fcfcfd] pb-24 text-slate-900 dark:bg-[#0b0c0f] dark:text-zinc-100">
                {/* 1. Ultra-Clean Hero Header */}
                <div className="relative border-b border-slate-200/80 bg-white px-4 pt-10 pb-12 sm:px-6 lg:px-8 dark:border-white/[0.06] dark:bg-[#101217]">
                    <div className="mx-auto max-w-5xl">
                        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-slate-700 uppercase dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                                    <BookOpen className="size-3" />
                                    <span>PUSAT PANDUAN PRAKTIK &amp; OPERASIONAL</span>
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl dark:text-white">
                                    Panduan Cara Penggunaan RPK App
                                </h1>
                                <p className="max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-zinc-400">
                                    Dokumentasi terstruktur alur operasional firma hukum mulai dari registrasi perkara, penugasan advokat, tanda tangan elektronik tersertifikasi, hingga penagihan invoice.
                                </p>
                            </div>

                            {/* Quick Search Input */}
                            <div className="w-full md:w-80">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                    <Input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari topik atau modul..."
                                        className="h-9.5 rounded-xl border-slate-200 bg-slate-50/80 pr-4 pl-9 text-xs shadow-2xs transition-all focus-visible:border-slate-400 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:focus-visible:border-white/20"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[10px] font-bold text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                                        >
                                            RESET
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* High-Level Feature Metrics Bar */}
                        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-100 pt-6 sm:grid-cols-4 dark:border-white/[0.04]">
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <Workflow className="size-4 text-slate-700 dark:text-zinc-300" />
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">7 Modul Praktik</span>
                                </div>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-500">Alur hukum terintegrasi penuh</p>
                            </div>
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="size-4 text-emerald-700 dark:text-emerald-400" />
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">26 Matriks RBAC</span>
                                </div>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-500">Aman dan terproteksi peran</p>
                            </div>
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <QrCode className="size-4 text-blue-700 dark:text-blue-400" />
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">Verifikasi SHA-256</span>
                                </div>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-500">QR Code keabsahan resmi</p>
                            </div>
                            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                <div className="flex items-center gap-2">
                                    <Command className="size-4 text-purple-700 dark:text-purple-400" />
                                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">Command Hub ⌘K</span>
                                </div>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-500">Navigasi instan antarmuka</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Interactive Interactive Simulator Showcase */}
                <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <span className="font-mono text-[10px] font-extrabold tracking-widest text-slate-400 uppercase dark:text-zinc-500">
                                PRATINJAU ANTARMUKA INTERAKTIF
                            </span>
                            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                                Simulasi Visual Modul RPK App
                            </h2>
                        </div>
                        <div className="hidden sm:block font-mono text-[11px] text-slate-500 dark:text-zinc-500">
                            Klik tab untuk melihat simulasi visual
                        </div>
                    </div>

                    {/* Simulator Container (Double-Bezel Hardware Architecture) */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md dark:border-white/10 dark:bg-[#12141a]">
                        {/* Simulation Tab Switcher Bar */}
                        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/90 px-4 py-2 dark:border-white/[0.06] dark:bg-[#151820]">
                            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                                {[
                                    { id: 'matter', label: 'Kartu Perkara & Sidang', icon: Briefcase },
                                    { id: 'sign', label: 'Verifikasi Tanda Tangan QR', icon: QrCode },
                                    { id: 'invoice', label: 'Struktur Tagihan & Pajak', icon: Receipt },
                                    { id: 'calendar', label: 'Kalender & Sidang', icon: Calendar },
                                    { id: 'passkey', label: 'Autentikasi Passkey', icon: KeyRound },
                                ].map((tab) => {
                                    const IconComp = tab.icon;
                                    const isSelected = previewTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setPreviewTab(tab.id as any)}
                                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                                isSelected
                                                    ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                                                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white'
                                            }`}
                                        >
                                            <IconComp className="size-3.5" />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="hidden sm:flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-emerald-500" />
                                <span className="font-mono text-[10px] font-medium text-slate-500 dark:text-zinc-400">Live Simulator</span>
                            </div>
                        </div>

                        {/* Interactive Visual Canvas */}
                        <div className="p-6 sm:p-8">
                            {previewTab === 'matter' && (
                                <div className="space-y-4">
                                    <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/60 p-5 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-white/[0.02]">
                                        <div className="space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                                                    NO. REG: RPK/2026/LIT-084
                                                </span>
                                                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                    ● LITIGASI PERDATA
                                                </span>
                                                <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400">
                                                    TAHAP: PEMBUKTIAN
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                Gugatan Perbuatan Melawan Hukum (PMH) &mdash; PT Graha Nusantara
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-zinc-400">
                                                Klien: PT Graha Nusantara Sentosa &bull; Lawan: PT Prima Investama Abadi
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 flex-col items-start gap-1 text-left sm:items-end sm:text-right">
                                            <span className="font-mono text-[10px] text-slate-400 uppercase">JADWAL SIDANG BERIKUTNYA</span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">Kamis, 17 Sept 2026 &bull; 10:00 WIB</span>
                                            <span className="text-[11px] text-slate-500 dark:text-zinc-400">PN Jakarta Selatan (Ruang 02)</span>
                                        </div>
                                    </div>

                                    {/* 3-Column Mini Status Tracker */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.04] dark:bg-white/[0.01]">
                                            <span className="font-mono text-[10px] text-slate-400 uppercase">TIM PENASIHAT HUKUM</span>
                                            <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">Adv. Roni Hidayat, S.H., M.H.</p>
                                            <p className="text-[11px] text-slate-500 dark:text-zinc-500">Lead Partner Penanggung Jawab</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.04] dark:bg-white/[0.01]">
                                            <span className="font-mono text-[10px] text-slate-400 uppercase">ALAT BUKTI SURAT</span>
                                            <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">18 Dokumen Terdaftar</p>
                                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Kode P-1 s.d. P-18 Lengkap</p>
                                        </div>
                                        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-white/[0.04] dark:bg-white/[0.01]">
                                            <span className="font-mono text-[10px] text-slate-400 uppercase">STATUS PENAGIHAN</span>
                                            <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">Termin 1 &amp; 2 Lunas</p>
                                            <p className="text-[11px] text-slate-500 dark:text-zinc-500">Invoice Terverifikasi Finance</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {previewTab === 'sign' && (
                                <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-slate-200/80 bg-slate-50/50 p-6 md:flex-row dark:border-white/[0.06] dark:bg-white/[0.02]">
                                    <div className="space-y-2">
                                        <div className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
                                            <BadgeCheck className="size-3" />
                                            <span>LEMBAR VERIFIKASI RESMI TERENKRIPSI</span>
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                            Sertifikat Keabsahan Dokumen Elektronik
                                        </h3>
                                        <p className="max-w-md text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                            Dokumen ini ditandatangani menggunakan kunci privat asimetris RPK Law Firm yang diverifikasi secara publik melalui kode QR dan sidik jari kriptografi SHA-256.
                                        </p>
                                        <div className="pt-2 font-mono text-[11px] text-slate-500 dark:text-zinc-500">
                                            Hash: <span className="font-bold text-slate-800 dark:text-zinc-300">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
                                        </div>
                                    </div>

                                    {/* Simulated QR Verification Seal */}
                                    <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs dark:border-white/10 dark:bg-[#16181f]">
                                        <div className="flex size-24 items-center justify-center rounded-xl bg-slate-900 p-2 text-white dark:bg-white dark:text-slate-900">
                                            <QrCode className="size-20" />
                                        </div>
                                        <span className="mt-2.5 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            SCAN VERIFIKASI
                                        </span>
                                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                            ● SAH &amp; TERVERIFIKASI
                                        </span>
                                    </div>
                                </div>
                            )}

                            {previewTab === 'invoice' && (
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-white/[0.04] dark:bg-white/[0.01]">
                                        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                            <div>
                                                <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">INVOICE NO: INV/2026/09/0142</span>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-500">Perkara: Gugatan PMH &bull; Klien: PT Graha Nusantara</p>
                                            </div>
                                            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-xs font-bold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                STATUS: LUNAS (PAID)
                                            </span>
                                        </div>

                                        <div className="mt-4 space-y-2 text-xs">
                                            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-white/[0.02]">
                                                <span className="text-slate-600 dark:text-zinc-400">Professional Legal Retainer Fee (Tahap 1)</span>
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">Rp 50.000.000</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-white/[0.02]">
                                                <span className="text-slate-600 dark:text-zinc-400">Biaya Pendaftaran Perkara &amp; Biaya Operasional (Court Fee)</span>
                                                <span className="font-mono font-bold text-slate-900 dark:text-white">Rp 5.000.000</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-white/[0.02] text-slate-500">
                                                <span>Potongan PPh Pasal 23 (2%)</span>
                                                <span className="font-mono text-rose-600 dark:text-rose-400">- Rp 1.000.000</span>
                                            </div>
                                            <div className="flex justify-between pt-2 text-sm font-bold">
                                                <span className="text-slate-900 dark:text-white">Total Tagihan Bersih</span>
                                                <span className="font-mono text-blue-700 dark:text-blue-400">Rp 54.000.000</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {previewTab === 'calendar' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-white/[0.04]">
                                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">AGENDA PERSIDANGAN BULAN INI</span>
                                        <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">iCal Synchronized</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white font-mono text-center shadow-2xs dark:border-white/10 dark:bg-[#16181f]">
                                                    <span className="text-[9px] font-bold text-rose-600 uppercase">SEP</span>
                                                    <span className="text-xs font-black text-slate-900 dark:text-white">17</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sidang Pembuktian Surat Lawan &mdash; PN Jakarta Selatan</h4>
                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-500">Perkara: No. 142/Pdt.G/2026 &bull; Tim: Adv. Roni Hidayat, S.H.</p>
                                                </div>
                                            </div>
                                            <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
                                                H-1 REMINDER
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-white/[0.04] dark:bg-white/[0.02]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white font-mono text-center shadow-2xs dark:border-white/10 dark:bg-[#16181f]">
                                                    <span className="text-[9px] font-bold text-rose-600 uppercase">SEP</span>
                                                    <span className="text-xs font-black text-slate-900 dark:text-white">22</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Rapat Mediasi Pra-Arbitrase &mdash; BANI Arbitration Center</h4>
                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-500">Klien: PT Multi Karya &bull; Tim: Adv. Hendra Kusumah, S.H.</p>
                                                </div>
                                            </div>
                                            <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-400">
                                                H-7 REMINDER
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {previewTab === 'passkey' && (
                                <div className="flex flex-col items-center justify-center space-y-3 py-4 text-center">
                                    <div className="flex size-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 shadow-2xs dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
                                        <KeyRound className="size-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                            Masuk Cepat dengan Passkey Biometrik
                                        </h3>
                                        <p className="max-w-sm text-xs text-slate-500 dark:text-zinc-400">
                                            Sentuh sensor Touch ID, Face ID, atau PIN perangkat Anda untuk mengonfirmasi identitas dalam 1 detik.
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                                        <ShieldCheck className="size-3.5 text-emerald-600" />
                                        <span>FIDO2 / WebAuthn Certified Protection</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Category Filter Tabs */}
                <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-white/[0.08]">
                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                { id: 'all', label: 'Semua Modul' },
                                { id: 'start', label: '1. Memulai' },
                                { id: 'matters', label: '2. Perkara' },
                                { id: 'clients', label: '3. Klien & KYC' },
                                { id: 'calendar', label: '4. Sidang & Kalender' },
                                { id: 'documents', label: '5. Dokumen & Tanda Tangan' },
                                { id: 'finance', label: '6. Keuangan' },
                                { id: 'admin', label: '7. Admin & RBAC' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-slate-950 text-white shadow-xs dark:bg-white dark:text-slate-950'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <span className="hidden sm:block font-mono text-[11px] text-slate-400">
                            {filteredSections.length} Modul Ditampilkan
                        </span>
                    </div>

                    {/* 4. Filtered Guide Sections */}
                    <div className="mt-8 space-y-10">
                        {filteredSections.map((sec) => {
                            const IconComponent = sec.icon;
                            return (
                                <div
                                    key={sec.id}
                                    id={sec.id}
                                    className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#12141a]"
                                >
                                    {/* Section Header Bar */}
                                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:px-6 dark:border-white/[0.04] dark:bg-[#151820]">
                                        <div className="flex items-start gap-3.5">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xs dark:border-white/10 dark:bg-white/[0.04] dark:text-white">
                                                <IconComponent className="size-5" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                                    {sec.badgeText}
                                                </span>
                                                <h3 className="text-base font-bold text-slate-950 sm:text-lg dark:text-white">
                                                    {sec.title}
                                                </h3>
                                                <p className="text-xs text-slate-600 dark:text-zinc-400">
                                                    {sec.summary}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={sec.actionUrl}
                                            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 shadow-2xs transition-all hover:bg-slate-50 hover:text-blue-600 sm:self-center dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
                                        >
                                            <span>{sec.actionText}</span>
                                            <ArrowUpRight className="size-3.5" />
                                        </Link>
                                    </div>

                                    {/* Stepper Content */}
                                    <div className="p-6 sm:p-7">
                                        <div className="space-y-7">
                                            {sec.steps.map((step, sIdx) => (
                                                <div key={step.num} className="relative flex gap-4 sm:gap-5">
                                                    {/* Vertical Connector */}
                                                    {sIdx < sec.steps.length - 1 && (
                                                        <div className="absolute top-8 left-4 -bottom-7 w-px bg-slate-200 dark:bg-white/10" />
                                                    )}

                                                    {/* Number Badge */}
                                                    <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-xs font-black text-slate-900 shadow-2xs dark:border-white/10 dark:bg-[#16181f] dark:text-white">
                                                        {step.num}
                                                    </div>

                                                    <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                            {step.title}
                                                        </h4>
                                                        <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
                                                            {step.desc}
                                                        </p>

                                                        {/* Details Checklist */}
                                                        <div className="mt-2.5 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-600 dark:border-white/[0.03] dark:bg-white/[0.02] dark:text-zinc-400">
                                                            {step.details.map((d, dIdx) => (
                                                                <div key={dIdx} className="flex items-start gap-2">
                                                                    <Check className="mt-0.5 size-3.5 shrink-0 text-slate-700 dark:text-zinc-300" />
                                                                    <span className="leading-relaxed">{d}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Note Callout */}
                                                        {step.note && (
                                                            <div className="flex items-start gap-2 rounded-lg border border-slate-200/70 bg-white p-2.5 text-[11px] text-slate-700 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-zinc-300">
                                                                <Info className="mt-0.5 size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                                                                <span>{step.note}</span>
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

                    {/* 5. Command Hub & Keyboard Shortcuts */}
                    <div className="mt-12 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-white/[0.06] dark:bg-[#12141a]">
                        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center dark:border-white/[0.04]">
                            <div className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-white/[0.04] dark:text-white">
                                    <Terminal className="size-4.5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Pusat Pintasan Keyboard (Command Hub)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                                        Gunakan kombinasi tombol untuk efisiensi navigasi cepat di seluruh aplikasi.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={copyCommand}
                                className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600 hover:bg-slate-50 sm:self-center dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/[0.04]"
                            >
                                <Copy className="size-3" />
                                <span>{copiedShortcut ? 'Tersalin' : 'Salin Shortcut'}</span>
                            </button>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-white/[0.03] dark:bg-white/[0.02]">
                                <span className="text-xs text-slate-600 dark:text-zinc-400">Buka Command Palette</span>
                                <kbd className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                    ⌘K / Ctrl+K
                                </kbd>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-white/[0.03] dark:bg-white/[0.02]">
                                <span className="text-xs text-slate-600 dark:text-zinc-400">Tutup Dialog / Modal</span>
                                <kbd className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                    ESC
                                </kbd>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-white/[0.03] dark:bg-white/[0.02]">
                                <span className="text-xs text-slate-600 dark:text-zinc-400">Fokus Form Input</span>
                                <kbd className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                    Tab
                                </kbd>
                            </div>
                        </div>
                    </div>

                    {/* 6. Corporate FAQ Section */}
                    <div className="mt-12 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-white/[0.06] dark:bg-[#12141a]">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800 dark:bg-white/[0.04] dark:text-white">
                                <HelpCircle className="size-4.5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Pertanyaan Umum Operasional (FAQ)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-zinc-400">
                                    Panduan penyelesaian kendala teknis dan administrasi yang sering dihadapi.
                                </p>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                            {faqs.map((faq, fIdx) => (
                                <div key={fIdx} className="py-4">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                                        className="flex w-full items-center justify-between gap-4 text-left text-xs font-bold text-slate-900 transition-colors hover:text-blue-600 sm:text-sm dark:text-zinc-200 dark:hover:text-blue-400"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown
                                            className={`size-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                                                openFaq === fIdx ? 'rotate-180 text-slate-900 dark:text-white' : ''
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

                    {/* 7. Need Helpdesk Support Banner */}
                    <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-slate-900 p-6 text-white shadow-xl sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#151820]">
                        <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                DUKUNGAN TEKNIS &amp; ADMINISTRATOR
                            </span>
                            <h4 className="text-base font-bold">
                                Mengalami kendala atau membutuhkan penyesuaian hak akses?
                            </h4>
                            <p className="max-w-xl text-xs text-slate-400">
                                Tim Administrator RPK App siap membantu konfigurasi akun advokat, integrasi template dokumen baru, atau pemulihan hak akses perkara.
                            </p>
                        </div>
                        <a
                            href="mailto:admin@rpklawoffice.com?subject=Bantuan%20Operasional%20RPK%20App"
                            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-sm transition-transform hover:scale-[1.02] hover:bg-slate-100"
                        >
                            Hubungi Administrator
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
