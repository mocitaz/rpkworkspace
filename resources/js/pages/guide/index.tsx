import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
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
    FileText,
    HelpCircle,
    Info,
    KeyRound,
    Layers,
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
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface WorkflowStep {
    step: string;
    title: string;
    description: string;
    actionableItems: string[];
    actorRole: string;
    legalBasis?: string;
}

interface GuideWorkflow {
    id: string;
    category: string;
    categoryLabel: string;
    code: string;
    title: string;
    tagline: string;
    icon: any;
    imagePath?: string;
    targetRoute: string;
    targetRouteLabel: string;
    estimatedTime: string;
    complianceNote: string;
    accentColor: {
        badge: string;
        border: string;
        bg: string;
        text: string;
    };
    steps: WorkflowStep[];
    simulation: {
        headline: string;
        subheadline: string;
        metaPills: { label: string; value: string; variant?: 'default' | 'success' | 'warning' | 'info' }[];
        rows: { key: string; value: string; secondary?: string }[];
        footerInfo?: string;
    };
}

const WORKFLOWS: GuideWorkflow[] = [
    {
        id: 'matters',
        category: 'operations',
        categoryLabel: 'MANAJEMEN PERKARA',
        code: 'SOP-OPS-01',
        title: 'Manajemen Perkara & Uji Benturan Kepentingan',
        tagline: 'Alur komprehensif mulai dari conflict of interest check, penugasan tim kuasa hukum, persidangan, hingga arsip perkara inkracht.',
        icon: Briefcase,
        imagePath: '/images/guide/matter.jpg',
        targetRoute: '/matters',
        targetRouteLabel: 'Buka Modul Perkara',
        estimatedTime: '3 Menit Registrasi',
        complianceNote: 'Mematuhi Kode Etik Advokat Indonesia (KEAI) Pasal 4 & Standar Manajemen Perkara Firma',
        accentColor: {
            badge: 'border-blue-200/80 bg-blue-50/80 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300',
            border: 'border-blue-200/70 dark:border-blue-900/40',
            bg: 'bg-blue-50/40 dark:bg-blue-950/20',
            text: 'text-blue-700 dark:text-blue-400',
        },
        steps: [
            {
                step: '01',
                title: 'Uji Konflik Kepentingan (Conflict of Interest Check)',
                description: 'Verifikasi otomatis terhadap pihak lawan, afiliasi bisnis, dan saksi untuk mencegah benturan kepentingan sebelum menerima kuasa.',
                actionableItems: [
                    'Buka menu Perkara → Klik tombol "+ Buka Perkara Baru".',
                    'Masukkan nama pihak pemohon, pihak lawan, dan kuasa hukum lawan.',
                    'Sistem mencocokkan riwayat perkara aktif dan arsip klien firma secara instan.',
                ],
                actorRole: 'Managing Partner / Lead Partner',
                legalBasis: 'KEAI Pasal 4 Huruf j',
            },
            {
                step: '02',
                title: 'Pembentukan Tim Kuasa Hukum & Pembagian Hak Akses',
                description: 'Penetapan Lead Partner penanggung jawab, Partner pendamping, Senior Associate, dan Paralegal pelaksana.',
                actionableItems: [
                    'Tentukan Lead Partner yang menandatangani draf dan mewakili di muka persidangan.',
                    'Tambahkan anggota tim hukum pendamping perkara.',
                    'Hak akses terhadap dokumen sensitif perkara otomatis disinkronkan ke seluruh personel terpilih.',
                ],
                actorRole: 'Managing Partner',
            },
            {
                step: '03',
                title: 'Pencatatan Kronologi, Pihak Terkait & Matriks Alat Bukti',
                description: 'Dokumentasi peristiwa hukum dan penomoran alat bukti surat secara sistematis (P-1 s.d. P-n).',
                actionableItems: [
                    'Catat peristiwa kronologis dengan tanggal presisi dan kode referensi bukti surat.',
                    'Unggah salinan gugatan, eksepsi, replik, duplik, dan kesimpulan ke brankas digital perkara.',
                    'Catat catatan perkembangan setiap kali persidangan selesai dilaksanakan.',
                ],
                actorRole: 'Lead Partner / Associate',
                legalBasis: 'Pasal 164 HIR / 284 RBg',
            },
            {
                step: '04',
                title: 'Penyelesaian Amar Putusan & Pengarsipan Inkracht',
                description: 'Penutupan perkara pasca berkekuatan hukum tetap dan penerbitan laporan akhir ke klien.',
                actionableItems: [
                    'Ubah tahapan perkara menjadi "Selesai / Putusan Inkracht" dan catat amar putusan.',
                    'Unduh Executive Summary Case Report (PDF) untuk diserahkan ke klien.',
                    'Arsipkan berkas digital ke penyimpanan jangka panjang firma.',
                ],
                actorRole: 'Lead Partner',
            },
        ],
        simulation: {
            headline: 'Gugatan Perbuatan Melawan Hukum (PMH) &mdash; Sengketa Kontrak Kerjasama',
            subheadline: 'Perkara No. 142/Pdt.G/2026/PN.Jkt.Sel &bull; Klien: PT Graha Nusantara Sentosa',
            metaPills: [
                { label: 'STATUS', value: 'PEMERIKSAAN SAKSI', variant: 'info' },
                { label: 'KLASIFIKASI', value: 'LITIGASI PERDATA', variant: 'default' },
                { label: 'CONFLICT CHECK', value: 'TERVERIFIKASI BERSIH', variant: 'success' },
            ],
            rows: [
                { key: 'Lead Partner Penanggung Jawab', value: 'Adv. Roni Hidayat, S.H., M.H.', secondary: 'NIA: 08.19284 / PERADI' },
                { key: 'Jadwal Persidangan Terdekat', value: 'Kamis, 17 September 2026 &bull; 10:00 WIB', secondary: 'PN Jakarta Selatan (Ruang Oemar Seno Adji)' },
                { key: 'Matriks Alat Bukti Surat', value: '18 Dokumen Terdaftar (P-1 s.d. P-18)', secondary: '100% Terverifikasi Lengkap' },
                { key: 'Status Honorarium & Termin', value: 'Termin 1 & 2 Lunas (Paid)', secondary: 'Invoice Terverifikasi Bagian Keuangan' },
            ],
            footerInfo: 'Perkara terproteksi enkripsi hak istimewa advokat-klien (Attorney-Client Privilege).',
        },
    },
    {
        id: 'signatures',
        category: 'documents',
        code: 'SOP-DOC-02',
        categoryLabel: 'DOKUMEN & TANDA TANGAN',
        title: 'Generator Dokumen & Tanda Tangan Elektronik Resmi',
        tagline: 'Pembuatan draf surat kuasa instan dari template baku, sirkulasi penandatanganan elektronik, dan verifikasi QR Code keabsahan berkas.',
        icon: FileCheck,
        imagePath: '/images/guide/signature.jpg',
        targetRoute: '/documents',
        targetRouteLabel: 'Buka Modul Dokumen',
        estimatedTime: '2 Menit Penandatanganan',
        complianceNote: 'Memenuhi Ketentuan UU ITE No. 1/2024 Pasal 11 & PP No. 71/2019 tentang Tanda Tangan Elektronik',
        accentColor: {
            badge: 'border-cyan-200/80 bg-cyan-50/80 text-cyan-800 dark:border-cyan-900/50 dark:bg-cyan-950/40 dark:text-cyan-300',
            border: 'border-cyan-200/70 dark:border-cyan-900/40',
            bg: 'bg-cyan-50/40 dark:bg-cyan-950/20',
            text: 'text-cyan-700 dark:text-cyan-400',
        },
        steps: [
            {
                step: '01',
                title: 'Penerbitan Draf Otomatis dari Template Baku',
                description: 'Pilih template Surat Kuasa Khusus, Somasi, atau Perjanjian untuk pengisian variabel otomatis.',
                actionableItems: [
                    'Buka menu Dokumen → Pilih tab "Template Otomatis".',
                    'Pilih template yang diinginkan (misal: Surat Kuasa Khusus Litigasi Perdata).',
                    'Pilih Klien dan Perkara; nama advokat penerima kuasa, NIA, dan data lawan otomatis terisi presisi.',
                ],
                actorRole: 'Associate / Paralegal',
            },
            {
                step: '02',
                title: 'Pengiriman Permintaan Tanda Tangan Elektronik',
                description: 'Kirimkan draf dokumen PDF ke para pihak penandatangan secara aman.',
                actionableItems: [
                    'Pilih berkas PDF → Klik "Kirim Permintaan Tanda Tangan".',
                    'Tentukan urutan penandatanganan (Klien → Advokat → Managing Partner).',
                    'Penerima mendapatkan tautan verifikasi terenkripsi via email tanpa kewajiban memiliki akun.',
                ],
                actorRole: 'Lead Partner / Finance',
            },
            {
                step: '03',
                title: 'Pemeriksaan Integritas & Verifikasi Lembar QR Code',
                description: 'Setiap dokumen tereksekusi dilengkapi QR Code keabsahan dan sidik jari hash SHA-256.',
                actionableItems: [
                    'Pindai QR Code di sudut bawah dokumen dengan kamera smartphone.',
                    'Halaman verifikasi resmi RPK Law Firm menampilkan tanggal presisi, penandatangan, dan riwayat integritas.',
                    'Dokumen terbukti otentik dan kebal manipulasi pasca penandatanganan.',
                ],
                actorRole: 'Klien / Pihak Ketiga / Pengadilan',
                legalBasis: 'Pasal 11 UU ITE',
            },
        ],
        simulation: {
            headline: 'Surat Kuasa Khusus &mdash; Perkara Perdata No. 142/Pdt.G/2026',
            subheadline: 'Penandatangan: Direktur Utama PT Graha Nusantara & Adv. Roni Hidayat, S.H.',
            metaPills: [
                { label: 'STATUS DOKUMEN', value: 'SELESAI DITANDATANGANI', variant: 'success' },
                { label: 'ENKRIPSI', value: 'SHA-256 CRYPTOGRAPHIC SEAL', variant: 'default' },
                { label: 'LEGAL STANDING', value: 'SAH SECARA HUKUM', variant: 'info' },
            ],
            rows: [
                { key: 'Penandatangan 1 (Pemberi Kuasa)', value: 'Bambang Soediro (Direktur Utama)', secondary: 'Ditandatangani via Touchscreen HP &bull; 14:20 WIB' },
                { key: 'Penandatangan 2 (Penerima Kuasa)', value: 'Adv. Roni Hidayat, S.H., M.H.', secondary: 'Ditandatangani via Passkey Kredensial &bull; 14:25 WIB' },
                { key: 'Sidik Jari Digital SHA-256', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', secondary: 'Kunci Asimetris Firma Terverifikasi' },
                { key: 'Akses Verifikasi Publik', value: 'https://app.rpklawoffice.com/verify/signature/RPK-SIGN-0142', secondary: 'Scan QR Code Resmi untuk Lembar Keabsahan' },
            ],
            footerInfo: 'Sertifikat digital terdaftar pada server aman RPK Law Firm dan terbukti nir-penolakan (non-repudiation).',
        },
    },
    {
        id: 'finance',
        category: 'billing',
        code: 'SOP-FIN-03',
        categoryLabel: 'KEUANGAN & PENAGIHAN',
        title: 'Honorarium Hukum, Penagihan Invoice & Pajak PPh 23/21',
        tagline: 'Penerbitan tagihan profesional, pencatatan termin fee advokat, verifikasi pembayaran, dan kepatuhan pemotongan pajak.',
        icon: CreditCard,
        imagePath: '/images/guide/finance.jpg',
        targetRoute: '/finance',
        targetRouteLabel: 'Buka Modul Keuangan',
        estimatedTime: '2 Menit Terbit Invoice',
        complianceNote: 'Sesuai Standar Akuntansi Kantor Hukum & Ketentuan PMK No. 168/2023 (PPh 23/21)',
        accentColor: {
            badge: 'border-emerald-200/80 bg-emerald-50/80 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300',
            border: 'border-emerald-200/70 dark:border-emerald-900/40',
            bg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
            text: 'text-emerald-700 dark:text-emerald-400',
        },
        steps: [
            {
                step: '01',
                title: 'Penerbitan Quotation & Invoice Tagihan Klien',
                description: 'Susun rincian tagihan profesional berdasarkan Perjanjian Jasa Hukum (Engagement Letter).',
                actionableItems: [
                    'Buka menu Keuangan → Klik "+ Buat Tagihan / Invoice".',
                    'Pilih perkara dan klien; masukkan komponen Professional Legal Fee, Retainer, Success Fee, atau Court Fee.',
                    'Sistem secara otomatis menghitung kalkulasi pajak PPh 23 (2%) atau PPh 21 dan rincian rekening resmi firma.',
                ],
                actorRole: 'Finance / Partner',
            },
            {
                step: '02',
                title: 'Pencatatan Pembayaran & Konfirmasi Transfer Bank',
                description: 'Catat pembayaran termin yang masuk dari klien beserta bukti setor bank.',
                actionableItems: [
                    'Unggah berkas bukti transfer bank pada invoice terkait.',
                    'Bagian Finance / Managing Partner memverifikasi status pembayaran menjadi "Lunas / Paid".',
                    'Cetak Kuitansi Resmi (Official Receipt) berformat PDF bertanda tangan untuk diserahkan ke klien.',
                ],
                actorRole: 'Finance / Managing Partner',
            },
        ],
        simulation: {
            headline: 'Invoice Penagihan Jasa Hukum &mdash; INV/2026/09/0142',
            subheadline: 'Perkara: Gugatan PMH &bull; Klien: PT Graha Nusantara Sentosa',
            metaPills: [
                { label: 'STATUS TAGIHAN', value: 'LUNAS (PAID)', variant: 'success' },
                { label: 'METODE', value: 'TRANSFER BANK MANDIRI', variant: 'default' },
                { label: 'KUITANSI RESMI', value: 'TERBIT & TERCETAK', variant: 'info' },
            ],
            rows: [
                { key: 'Komponen Legal Retainer Fee (Tahap 1)', value: 'Rp 50.000.000', secondary: 'Honorarium Advokat Penanganan Perkara' },
                { key: 'Biaya Pendaftaran Perkara & Biaya Sidang (Court Fee)', value: 'Rp 5.000.000', secondary: 'Reimbursement Kasus Nyata (SKUM Pengadilan)' },
                { key: 'Potongan Pajak PPh Pasal 23 (2%)', value: '- Rp 1.000.000', secondary: 'Wajib Disetor Klien dengan Bukti Potong Pajak' },
                { key: 'Total Penerimaan Bersih Firma', value: 'Rp 54.000.000', secondary: 'Diterima di Rekening Resmi RPK Law Firm' },
            ],
            footerInfo: 'Seluruh transaksi keuangan tercatat dalam buku besar dan terintegrasi dengan laporan keuangan berkala firma.',
        },
    },
    {
        id: 'calendar',
        category: 'calendar',
        code: 'SOP-CAL-04',
        categoryLabel: 'KALENDER & SIDANG',
        title: 'Kalender Persidangan & Sinkronisasi Agenda Mobile',
        tagline: 'Manajemen terpadu seluruh agenda sidang pengadilan, mediasi, tenggat waktu banding/kasasi, dan sinkronisasi ke ponsel.',
        icon: Calendar,
        imagePath: '/images/guide/calendar.jpg',
        targetRoute: '/calendar',
        targetRouteLabel: 'Buka Kalender Sidang',
        estimatedTime: '1 Menit Sinkronisasi',
        complianceNote: 'Mengakomodasi PERMA No. 1/2019 tentang Administrasi Perkara dan Persidangan Elektronik (e-Court)',
        accentColor: {
            badge: 'border-amber-200/80 bg-amber-50/80 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300',
            border: 'border-amber-200/70 dark:border-amber-900/40',
            bg: 'bg-amber-50/40 dark:bg-amber-950/20',
            text: 'text-amber-700 dark:text-amber-400',
        },
        steps: [
            {
                step: '01',
                title: 'Pencatatan Jadwal Sidang & Ruang Pengadilan',
                description: 'Input agenda sidang baru dengan rincian instansi dan pengacara pendamping.',
                actionableItems: [
                    'Buka menu Kalender atau tab Jadwal di halaman perkara.',
                    'Pilih institusi pengadilan (misal: PN Jakarta Selatan), nomor ruang, dan agenda pembuktian.',
                    'Tugaskan advokat yang ditunjuk untuk hadir di muka persidangan.',
                ],
                actorRole: 'Associate / Paralegal',
            },
            {
                step: '02',
                title: 'Otomatisasi Notifikasi Pengingat (H-7 & H-1)',
                description: 'Sistem secara otomatis mengirimkan pengingat kepada seluruh anggota tim perkara.',
                actionableItems: [
                    'Pengingat otomatis terkirim melalui email dan notifikasi sistem 7 hari dan 24 jam sebelum sidang.',
                    'Tenggat waktu kritis (batas 14 hari pendaftaran memori banding/kasasi) terpantau di radar dashboard.',
                ],
                actorRole: 'Sistem Otomatis',
            },
            {
                step: '03',
                title: 'Sinkronisasi iCal Feed ke Ponsel Advokat',
                description: 'Hubungkan seluruh jadwal kerja firma ke Google Calendar, Apple Calendar, atau Outlook.',
                actionableItems: [
                    'Klik tombol "Sinkronkan iCal Feed" di bagian atas halaman Kalender.',
                    'Salin URL token privat dan tempelkan ke aplikasi kalender di perangkat Anda.',
                ],
                actorRole: 'Advokat / Associate',
            },
        ],
        simulation: {
            headline: 'Agenda Persidangan & Upaya Hukum Bulan Berjalan',
            subheadline: 'Terhubung secara live dengan feed kalender iCal smartphone seluruh tim advokat',
            metaPills: [
                { label: 'SYNC STATUS', value: 'ICAL ACTIVE & SYNCED', variant: 'success' },
                { label: 'PERSIDANGAN', value: '4 AGENDA MINGGU INI', variant: 'info' },
                { label: 'RADAR DEADLINE', value: 'AMAN & TERKONTROL', variant: 'default' },
            ],
            rows: [
                { key: 'Sidang Pembuktian Surat Lawan &bull; Kamis, 17 Sept 2026', value: 'PN Jakarta Selatan &mdash; Ruang 02', secondary: 'Perkara No. 142/Pdt.G/2026 &bull; Advokat: Adv. Roni Hidayat, S.H.' },
                { key: 'Rapat Mediasi Pra-Arbitrase &bull; Selasa, 22 Sept 2026', value: 'BANI Arbitration Center, Jakarta', secondary: 'Klien: PT Multi Karya &bull; Advokat: Adv. Hendra Kusumah, S.H.' },
                { key: 'Batas Pendaftaran Memori Kasasi &bull; Jumat, 25 Sept 2026', value: 'Mahkamah Agung RI via e-Court', secondary: 'Tenggat Waktu 14 Hari Kalender &bull; Pengawasan Lead Partner' },
            ],
            footerInfo: 'Perubahan jadwal sidang pada aplikasi otomatis terbarui di Google Calendar / Apple Calendar tanpa input ulang.',
        },
    },
    {
        id: 'clients',
        category: 'compliance',
        code: 'SOP-KYC-05',
        categoryLabel: 'KLIEN & KEPATUHAN KYC',
        title: 'Direktori Klien & Kepatuhan Legalitas (KYC/AML)',
        tagline: 'Pengelolaan data induk klien korporasi maupun perorangan yang terintegrasi dengan pemantauan masa berlaku izin dan akta legalitas.',
        icon: Users,
        imagePath: '/images/guide/kyc.jpg',
        targetRoute: '/clients',
        targetRouteLabel: 'Buka Direktori Klien',
        estimatedTime: '3 Menit Verifikasi',
        complianceNote: 'Sesuai Prinsip Mengenali Pengguna Jasa (PMPJ) & Kepatuhan PPATK bagi Profesi Advokat',
        accentColor: {
            badge: 'border-purple-200/80 bg-purple-50/80 text-purple-800 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300',
            border: 'border-purple-200/70 dark:border-purple-900/40',
            bg: 'bg-purple-50/40 dark:bg-purple-950/20',
            text: 'text-purple-700 dark:text-purple-400',
        },
        steps: [
            {
                step: '01',
                title: 'Registrasi Entitas Klien (Perorangan / Korporasi)',
                description: 'Daftarkan identitas resmi pihak yang diwakili kantor hukum.',
                actionableItems: [
                    'Buka menu Klien & Kontak → Klik "+ Tambah Klien".',
                    'Pilih tipe entitas: Korporasi (PT/CV/Yayasan) atau Perorangan (WNI/WNA).',
                    'Cantumkan penanggung jawab utama, alamat domisili hukum, serta kontak resmi.',
                ],
                actorRole: 'Associate / Admin',
            },
            {
                step: '02',
                title: 'Uji Kelayakan & Pemantauan Masa Berlaku Dokumen (KYC)',
                description: 'Unggah berkas kepatuhan hukum untuk menjamin kelengkapan legal standing klien.',
                actionableItems: [
                    'Unggah Akta Pendirian & Perubahan Terakhir, SK Kemenkumham, NPWP Badan, serta NIB.',
                    'Catat masa berlaku dokumen kepatuhan untuk mengaktifkan radar pengingat perpanjangan otomatis.',
                ],
                actorRole: 'Lead Partner / Compliance',
            },
        ],
        simulation: {
            headline: 'Profil Kepatuhan Entitas Klien &mdash; PT Graha Nusantara Sentosa',
            subheadline: 'Status Kepatuhan: Terverifikasi Lengkap (Full KYC Approved)',
            metaPills: [
                { label: 'KLASIFIKASI KLIEN', value: 'KORPORASI (BADAN HUKUM)', variant: 'default' },
                { label: 'VERIFIKASI KYC', value: '100% TERVERIFIKASI', variant: 'success' },
                { label: 'RISIKO AML', value: 'LOW RISK (BERSIH)', variant: 'info' },
            ],
            rows: [
                { key: 'Legal Standing / Akta Terakhir', value: 'Akta No. 42 Notaris Dr. Irawan, S.H. (2024)', secondary: 'SK Kemenkumham: AHU-0019284.AH.01.02' },
                { key: 'Nomor Induk Berusaha (NIB)', value: '0192837465019', secondary: 'Terverifikasi via OSS RBA Kemeninves' },
                { key: 'Penanggung Jawab / Direktur Utama', value: 'Bambang Soediro (KTP Terlampir)', secondary: 'Memiliki Kewenangan Bertindak Sesuai AD/ART' },
            ],
            footerInfo: 'Data identitas klien tersimpan terenkripsi dan terlindungi kerahasiaan profesi advokat.',
        },
    },
    {
        id: 'passkeys',
        category: 'security',
        code: 'SOP-SEC-06',
        categoryLabel: 'KEAMANAN & BIOMETRIK',
        title: 'Autentikasi Passkey Biometrik & Keamanan Akun',
        tagline: 'Aktivasi login instan Touch ID, Face ID, atau PIN perangkat berstandar FIDO2 WebAuthn tanpa perlu mengingat kata sandi.',
        icon: KeyRound,
        imagePath: '/images/guide/passkey.jpg',
        targetRoute: '/settings/profile',
        targetRouteLabel: 'Buka Pengaturan Keamanan',
        estimatedTime: '30 Detik Aktivasi',
        complianceNote: 'Standar Kriptografi Kunci Asimetris FIDO2 / WebAuthn & Kebal Terhadap Serangan Phising',
        accentColor: {
            badge: 'border-indigo-200/80 bg-indigo-50/80 text-indigo-800 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300',
            border: 'border-indigo-200/70 dark:border-indigo-900/40',
            bg: 'bg-indigo-50/40 dark:bg-indigo-950/20',
            text: 'text-indigo-700 dark:text-indigo-400',
        },
        steps: [
            {
                step: '01',
                title: 'Lengkapi Data Kredensial Advokat (NIA & BAS)',
                description: 'Buka menu profil untuk mengisi NIA dan tanggal Berita Acara Sumpah advokat.',
                actionableItems: [
                    'Klik foto avatar di sudut kanan atas → Pilih "Pengaturan / Settings".',
                    'Isi informasi legalitas pada bagian "Informasi Profesi Advokat".',
                ],
                actorRole: 'Advokat / Seluruh Pengguna',
            },
            {
                step: '02',
                title: 'Aktivasi Passkey Sensor Biometrik',
                description: 'Daftarkan Touch ID, Face ID, atau Windows Hello perangkat Anda.',
                actionableItems: [
                    'Masuk ke tab "Keamanan / Security" → Klik "Daftarkan Passkey Baru".',
                    'Sentuh sensor biometrik perangkat saat jendela prompt muncul.',
                    'Pada login berikutnya, klik tombol "Masuk Cepat dengan Passkey (Biometrik)".',
                ],
                actorRole: 'Seluruh Pengguna',
            },
        ],
        simulation: {
            headline: 'Autentikasi Kredensial Biometrik Perangkat (FIDO2 Hardware)',
            subheadline: 'Terkonfirmasi melalui Touch ID / Face ID &bull; Nol Kerentanan Kata Sandi',
            metaPills: [
                { label: 'STATUS KEAMANAN', value: 'PASSKEY AKTIF & TERDAFTAR', variant: 'success' },
                { label: 'STANDAR', value: 'WEBAUTHN ASYMMETRIC KEY', variant: 'default' },
                { label: 'ENKRIPSI', value: 'HARDWARE SECURITY ENCLAVE', variant: 'info' },
            ],
            rows: [
                { key: 'Perangkat Terdaftar 1', value: 'MacBook Pro Touch ID (Secure Enclave)', secondary: 'Terdaftar: 26 Agustus 2026 &bull; Status: Aktif Utama' },
                { key: 'Perangkat Terdaftar 2', value: 'iPhone Face ID (Biometric Key)', secondary: 'Terdaftar: 26 Agustus 2026 &bull; Status: Aktif Seluler' },
                { key: 'Kecepatan Waktu Autentikasi', value: '< 1.0 Detik Masuk ke Workspace', secondary: 'Otomatis Verifikasi Tanpa Input Manual' },
            ],
            footerInfo: 'Kunci privat tidak pernah meninggalkan perangkat Anda sehingga kebal dari intersepsi jaringan.',
        },
    },
    {
        id: 'rbac',
        category: 'admin',
        code: 'SOP-ADM-07',
        categoryLabel: 'ADMINISTRASI & RBAC',
        title: 'Tata Kelola Staf, 26 Matriks RBAC & Audit Trail',
        tagline: 'Pengaturan struktur wewenang jabatan, proteksi modul perkara, serta audit log rekaman aktivitas sistem secara real-time.',
        icon: Shield,
        imagePath: '/images/guide/rbac.jpg',
        targetRoute: '/admin/users',
        targetRouteLabel: 'Kelola Staf & Peran',
        estimatedTime: '2 Menit Konfigurasi',
        complianceNote: 'Prinsip Pembagian Wewenang & Standar Audit Integritas Digital Firma Hukum',
        accentColor: {
            badge: 'border-rose-200/80 bg-rose-50/80 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300',
            border: 'border-rose-200/70 dark:border-rose-900/40',
            bg: 'bg-rose-50/40 dark:bg-rose-950/20',
            text: 'text-rose-700 dark:text-rose-400',
        },
        steps: [
            {
                step: '01',
                title: 'Penetapan Jabatan Struktural & 26 Matriks Izin',
                description: 'Pengaturan wewenang berdasarkan tingkatan jabatan advokat dan staf pendukung.',
                actionableItems: [
                    'Buka menu "Manajemen Staf & Peran" pada panel Admin.',
                    'Pilih role: Managing Partner, Senior Partner, Partner, Senior Associate, Associate, Advokat Magang, Finance, atau Admin.',
                    'Sesuaikan 26 parameter izin independen untuk membatasi akses data perkara dan finansial.',
                ],
                actorRole: 'Managing Partner / Administrator',
            },
            {
                step: '02',
                title: 'Audit Trail & Rekaman Jejak Keamanan Sistem',
                description: 'Pantau seluruh riwayat perubahan data sensitif, akses berkas, dan unduhan secara real-time.',
                actionableItems: [
                    'Akses modul "Audit Trail" untuk memeriksa riwayat aktivitas staf.',
                    'Log memuat alamat IP, perangkat, waktu presisi, serta data sebelum dan sesudah pengubahan.',
                ],
                actorRole: 'Managing Partner / IT Security',
            },
        ],
        simulation: {
            headline: 'Matriks Kewenangan & Rekaman Audit Trail Sistem',
            subheadline: '26 Parameter Hak Akses Mandiri &bull; Jejak Digital Lengkap',
            metaPills: [
                { label: 'TOTAL ROLE', value: '8 TINGKATAN JABATAN', variant: 'default' },
                { label: 'MATRIKS IZIN', value: '26 HAK AKSES SISTEM', variant: 'info' },
                { label: 'LOGGING STATUS', value: 'ACTIVE AUDIT RECORDING', variant: 'success' },
            ],
            rows: [
                { key: 'Managing Partner / Senior Partner', value: 'Akses Penuh Seluruh Perkara, Finansial & Persetujuan', secondary: 'Otoritas Tertinggi Pengambilan Keputusan' },
                { key: 'Senior Associate / Associate', value: 'Akses Perkara yang Ditugaskan & Pembuatan Draf Dokumen', secondary: 'Dibatasi dari Laporan Keuangan Internal Firma' },
                { key: 'Finance & Billing Specialist', value: 'Akses Modul Keuangan, Invoice, Pajak & Kuitansi', secondary: 'Dibatasi dari Dokumen Rahasia Perkara Tertutup' },
            ],
            footerInfo: 'Setiap aksi create, update, delete, dan preview dokumen terekam permanen dalam database audit log.',
        },
    },
];

const FAQS = [
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

export default function GuideIndex() {
    const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('matters');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [copiedKey, setCopiedKey] = useState<boolean>(false);

    // Filtered workflows by search query
    const filteredWorkflows = useMemo(() => {
        if (!searchQuery.trim()) return WORKFLOWS;
        const q = searchQuery.toLowerCase();
        return WORKFLOWS.filter((wf) => {
            return (
                wf.title.toLowerCase().includes(q) ||
                wf.tagline.toLowerCase().includes(q) ||
                wf.categoryLabel.toLowerCase().includes(q) ||
                wf.steps.some(
                    (s) =>
                        s.title.toLowerCase().includes(q) ||
                        s.description.toLowerCase().includes(q) ||
                        s.actionableItems.some((item) => item.toLowerCase().includes(q)),
                )
            );
        });
    }, [searchQuery]);

    // Active workflow object
    const activeWorkflow = useMemo(() => {
        const found = WORKFLOWS.find((w) => w.id === selectedWorkflowId);
        return found || filteredWorkflows[0] || WORKFLOWS[0];
    }, [selectedWorkflowId, filteredWorkflows]);

    const handleCopyShortcut = () => {
        navigator.clipboard.writeText('Cmd + K');
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };

    return (
        <>
            <Head title="Cara Penggunaan & Panduan Sistem - RPK App" />

            <div className="min-h-screen bg-[#fafafc] pb-24 text-slate-900 dark:bg-[#0c0d10] dark:text-zinc-100">
                <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                    {/* 1. Executive Title & Search Navigation Header */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-end dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-slate-500 uppercase dark:text-zinc-400">
                                <BookOpen className="size-3.5 text-slate-700 dark:text-zinc-300" />
                                <span>PUSAT DOKUMENTASI &amp; STANDAR OPERASIONAL RPK APP</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl lg:text-3xl dark:text-white">
                                Panduan Cara Penggunaan RPK App
                            </h1>
                            <p className="text-xs text-slate-600 dark:text-zinc-400">
                                Tata kelola operasional terpadu: registrasi perkara, uji konflik, tanda tangan digital tersertifikasi, dan penagihan honorarium.
                            </p>
                        </div>

                        {/* Search Bar Capsule */}
                        <div className="w-full md:w-80">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari alur panduan, misal: perkara, invoice, passkey..."
                                    className="h-9 w-full rounded-xl border-slate-200 bg-white pr-4 pl-9 text-xs shadow-2xs transition-all focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300 dark:border-white/10 dark:bg-[#14161b] dark:text-white"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[9px] font-bold text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                                    >
                                        RESET
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Master-Detail Interactive Console (2-Column Architecture) */}
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                        {/* Left Column: Navigation Topic Matrix (4 Cols) */}
                        <div className="space-y-2 lg:col-span-4">
                            <div className="flex items-center justify-between px-1 pb-1">
                                <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500">
                                    DAFTAR ALUR PRAKTIK ({filteredWorkflows.length})
                                </span>
                                <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                                    PILIH TOPIK
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                {filteredWorkflows.map((wf) => {
                                    const IconComp = wf.icon;
                                    const isSelected = activeWorkflow.id === wf.id;
                                    return (
                                        <button
                                            key={wf.id}
                                            type="button"
                                            onClick={() => setSelectedWorkflowId(wf.id)}
                                            className={`group relative flex w-full flex-col gap-1.5 rounded-xl border p-3.5 text-left transition-all ${
                                                isSelected
                                                    ? 'border-slate-900 bg-white shadow-md ring-1 ring-slate-900/10 dark:border-white/20 dark:bg-[#14161b] dark:ring-white/10'
                                                    : 'border-slate-200/80 bg-white/70 hover:border-slate-300 hover:bg-white dark:border-white/[0.05] dark:bg-[#111317] dark:hover:border-white/10 dark:hover:bg-[#14161b]'
                                            }`}
                                        >
                                            {/* Active Left Pill Indicator */}
                                            {isSelected && (
                                                <div className="absolute top-3 bottom-3 left-0 w-1 rounded-r-full bg-slate-900 dark:bg-white" />
                                            )}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`flex size-6 items-center justify-center rounded-lg ${
                                                        isSelected
                                                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                                            : 'bg-slate-100 text-slate-600 group-hover:text-slate-900 dark:bg-white/[0.04] dark:text-zinc-400 dark:group-hover:text-white'
                                                    }`}>
                                                        <IconComp className="size-3.5" />
                                                    </div>
                                                    <span className="font-mono text-[9.5px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                                        {wf.code}
                                                    </span>
                                                </div>

                                                <span className="font-mono text-[9px] text-slate-400 dark:text-zinc-500">
                                                    {wf.steps.length} Langkah
                                                </span>
                                            </div>

                                            <h3 className={`text-xs font-bold transition-colors ${
                                                isSelected ? 'text-slate-950 dark:text-white' : 'text-slate-800 dark:text-zinc-300'
                                            }`}>
                                                {wf.title}
                                            </h3>

                                            <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                                                {wf.tagline}
                                            </p>
                                        </button>
                                    );
                                })}

                                {filteredWorkflows.length === 0 && (
                                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-2xs dark:border-white/[0.05] dark:bg-[#111317]">
                                        <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Tidak ada topik yang cocok.</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSearchQuery('')}
                                            className="mt-2 text-xs"
                                        >
                                            Reset Pencarian
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Quick Shortcut Helper Card */}
                            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-white/[0.05] dark:bg-[#111317]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Command className="size-3.5 text-slate-600 dark:text-zinc-400" />
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">Command Palette</span>
                                    </div>
                                    <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300">
                                        ⌘K / Ctrl+K
                                    </kbd>
                                </div>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-zinc-400">
                                    Akses instan seluruh berkas perkara, data klien, dan tombol aksi tanpa meninggalkan halaman.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Deep-Dive Blueprint Console (8 Cols) */}
                        <div className="space-y-6 lg:col-span-8">
                            {/* Main Document Console Header Card */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#12141a]">
                                {/* Header Strip */}
                                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:px-6 dark:border-white/[0.04] dark:bg-[#151820]">
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono text-[10px] font-black tracking-widest text-slate-700 dark:text-zinc-300">
                                                {activeWorkflow.code} &bull; {activeWorkflow.categoryLabel}
                                            </span>
                                            <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                                                {activeWorkflow.estimatedTime}
                                            </span>
                                        </div>
                                        <h2 className="text-base font-bold text-slate-950 sm:text-lg dark:text-white">
                                            {activeWorkflow.title}
                                        </h2>
                                        <p className="text-xs text-slate-600 dark:text-zinc-400">
                                            {activeWorkflow.tagline}
                                        </p>
                                    </div>

                                    <Link
                                        href={activeWorkflow.targetRoute}
                                        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-2xs transition-all hover:bg-slate-800 sm:self-center dark:border-white/10 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                    >
                                        <span>{activeWorkflow.targetRouteLabel}</span>
                                        <ArrowRight className="size-3.5" />
                                    </Link>
                                </div>

                                {/* Tasteful 3D Graphic Banner (if present) */}
                                {activeWorkflow.imagePath && (
                                    <div className="relative border-b border-slate-100 dark:border-white/[0.04]">
                                        <div className="relative h-44 w-full overflow-hidden bg-slate-900 sm:h-52">
                                            <img
                                                src={activeWorkflow.imagePath}
                                                alt={activeWorkflow.title}
                                                className="h-full w-full object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                                            <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between text-white">
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-emerald-400" />
                                                    <span className="font-mono text-[10px] font-bold tracking-wider uppercase drop-shadow-xs">
                                                        Visual Workflow Blueprint &bull; {activeWorkflow.code}
                                                    </span>
                                                </div>
                                                <span className="rounded-md border border-white/20 bg-black/40 px-2 py-0.5 font-mono text-[9px] font-bold text-white/90 backdrop-blur-md">
                                                    RPK Legal Practice Standard
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Interactive Visual Simulation Mockup Screen */}
                                <div className="border-b border-slate-100 p-5 sm:p-6 dark:border-white/[0.04]">
                                    <div className="flex items-center justify-between pb-3">
                                        <span className="font-mono text-[10px] font-extrabold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                            SIMULASI VISUAL ANTARMUKA (LIVE PREVIEW)
                                        </span>
                                        <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                            ● STATUS SISTEM AKTIF
                                        </span>
                                    </div>

                                    {/* Simulated Card Enclosure */}
                                    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4.5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                        <div className="space-y-1.5 border-b border-slate-200/60 pb-3 dark:border-white/[0.04]">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {activeWorkflow.simulation.metaPills.map((pill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`rounded-md px-2 py-0.5 font-mono text-[9.5px] font-bold ${
                                                            pill.variant === 'success'
                                                                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                : pill.variant === 'info'
                                                                ? 'border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300'
                                                                : 'border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300'
                                                        }`}
                                                    >
                                                        {pill.label}: {pill.value}
                                                    </span>
                                                ))}
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {activeWorkflow.simulation.headline}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                {activeWorkflow.simulation.subheadline}
                                            </p>
                                        </div>

                                        {/* Structured Details Matrix */}
                                        <div className="mt-3 divide-y divide-slate-100 text-xs dark:divide-white/[0.03]">
                                            {activeWorkflow.simulation.rows.map((row, rIdx) => (
                                                <div key={rIdx} className="flex flex-col justify-between py-2 sm:flex-row sm:items-center">
                                                    <span className="font-medium text-slate-500 dark:text-zinc-400">
                                                        {row.key}
                                                    </span>
                                                    <div className="text-left sm:text-right">
                                                        <span className="font-bold text-slate-900 dark:text-white">
                                                            {row.value}
                                                        </span>
                                                        {row.secondary && (
                                                            <span className="block font-mono text-[10.5px] text-slate-400 dark:text-zinc-500">
                                                                {row.secondary}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {activeWorkflow.simulation.footerInfo && (
                                            <div className="mt-2.5 rounded-lg border border-slate-200/60 bg-white p-2 text-[10.5px] text-slate-600 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-400">
                                                {activeWorkflow.simulation.footerInfo}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Step-by-Step SOP Breakdown */}
                                <div className="p-5 sm:p-6">
                                    <span className="font-mono text-[10px] font-extrabold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                        LANGKAH-LANGKAH OPERASIONAL (STANDARD OPERATING PROCEDURE)
                                    </span>

                                    <div className="mt-4 space-y-6">
                                        {activeWorkflow.steps.map((st, sIdx) => (
                                            <div key={st.step} className="relative flex gap-4">
                                                {/* Stepper Connector */}
                                                {sIdx < activeWorkflow.steps.length - 1 && (
                                                    <div className="absolute top-8 left-3.5 -bottom-6 w-px bg-slate-200 dark:bg-white/10" />
                                                )}

                                                {/* Step Number Circle */}
                                                <div className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-xs font-black text-slate-900 shadow-2xs dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                                    {st.step}
                                                </div>

                                                <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <h4 className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                                                            {st.title}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-600 dark:border-white/5 dark:bg-white/[0.04] dark:text-zinc-400">
                                                                Peran: {st.actorRole}
                                                            </span>
                                                            {st.legalBasis && (
                                                                <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/30 dark:text-blue-300">
                                                                    {st.legalBasis}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
                                                        {st.description}
                                                    </p>

                                                    {/* Checklist Bullets */}
                                                    <div className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-600 dark:border-white/[0.03] dark:bg-white/[0.02] dark:text-zinc-400">
                                                        {st.actionableItems.map((item, iIdx) => (
                                                            <div key={iIdx} className="flex items-start gap-2">
                                                                <Check className="mt-0.5 size-3.5 shrink-0 text-slate-700 dark:text-zinc-300" />
                                                                <span className="leading-relaxed">{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Compliance & Standard Footer Note */}
                                    <div className="mt-6 flex items-start gap-2 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-[11px] text-slate-700 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-zinc-400">
                                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-600 dark:text-zinc-400" />
                                        <div>
                                            <span className="font-bold">Standar Kepatuhan Hukum: </span>
                                            <span>{activeWorkflow.complianceNote}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Global Keyboard Shortcuts Console */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#12141a]">
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center dark:border-white/[0.04]">
                            <div className="flex items-center gap-2.5">
                                <Terminal className="size-4 text-slate-700 dark:text-zinc-300" />
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                                        Pusat Pintasan Keyboard Workspace (Quick Shortcuts)
                                    </h3>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                        Percepat efisiensi navigasi berkas dan perkara dengan kombinasi tombol sistem.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleCopyShortcut}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/[0.04]"
                            >
                                <Copy className="size-3" />
                                <span>{copiedKey ? 'Tersalin' : 'Salin Shortcut'}</span>
                            </button>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-white/[0.03] dark:bg-white/[0.02]">
                                <span className="text-xs text-slate-600 dark:text-zinc-400">Buka Command Palette</span>
                                <kbd className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800 dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                    ⌘K / Ctrl+K
                                </kbd>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-white/[0.03] dark:bg-white/[0.02]">
                                <span className="text-xs text-slate-600 dark:text-zinc-400">Tutup Dialog / Modal</span>
                                <kbd className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800 dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                    ESC
                                </kbd>
                            </div>
                            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 dark:border-white/[0.03] dark:bg-white/[0.02]">
                                <span className="text-xs text-slate-600 dark:text-zinc-400">Pindah Fokus Formulir</span>
                                <kbd className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800 dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                    Tab / Shift+Tab
                                </kbd>
                            </div>
                        </div>
                    </div>

                    {/* 4. Corporate FAQ Accordion */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#12141a]">
                        <div className="mb-4 flex items-center gap-2.5">
                            <HelpCircle className="size-4 text-slate-700 dark:text-zinc-300" />
                            <div>
                                <h3 className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                                    Pertanyaan yang Sering Diajukan (FAQ)
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                    Solusi cepat atas kendala operasional dan administrasi di RPK App.
                                </p>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                            {FAQS.map((faq, fIdx) => (
                                <div key={fIdx} className="py-3">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                                        className="flex w-full items-center justify-between gap-4 text-left text-xs font-bold text-slate-900 transition-colors hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown
                                            className={`size-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                                                openFaq === fIdx ? 'rotate-180 text-slate-900 dark:text-white' : ''
                                            }`}
                                        />
                                    </button>
                                    {openFaq === fIdx && (
                                        <div className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. Support & Helpdesk Footer Banner */}
                    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-slate-900 p-5 text-white shadow-xl sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#151820]">
                        <div className="space-y-1">
                            <span className="font-mono text-[9.5px] font-bold tracking-widest text-slate-400 uppercase">
                                PUSAT BANTUAN TEKNIS
                            </span>
                            <h4 className="text-sm font-bold sm:text-base">
                                Mengalami kendala teknis atau butuh konfigurasi hak akses?
                            </h4>
                            <p className="max-w-xl text-[11.5px] text-slate-400">
                                Administrator RPK App siap membantu konfigurasi akun advokat, template dokumen baku, atau penyesuaian wewenang perkara.
                            </p>
                        </div>
                        <a
                            href="mailto:admin@rpklawoffice.com?subject=Bantuan%20Operasional%20RPK%20App"
                            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-sm transition-transform hover:scale-[1.02] hover:bg-slate-100"
                        >
                            Hubungi Administrator
                        </a>
                    </div>
                </main>
            </div>
        </>
    );
}
