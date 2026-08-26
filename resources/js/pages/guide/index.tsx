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
    ChevronRight,
    Clock,
    Command,
    Copy,
    Cpu,
    CreditCard,
    ExternalLink,
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
    ShieldAlert,
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

interface StepDetail {
    stepNum: string;
    title: string;
    description: string;
    tasks: string[];
    role: string;
    lawRef?: string;
}

interface WorkflowStudio {
    id: string;
    code: string;
    category: string;
    title: string;
    tagline: string;
    icon: any;
    image: string;
    route: string;
    actionLabel: string;
    estTime: string;
    legalStandard: string;
    accent: {
        pill: string;
        glow: string;
        border: string;
        text: string;
        bar: string;
    };
    steps: StepDetail[];
    preview: {
        title: string;
        subtitle: string;
        badges: { text: string; type: 'success' | 'info' | 'neutral' }[];
        metrics: { label: string; value: string; hint?: string }[];
        note?: string;
    };
}

const STUDIOS: WorkflowStudio[] = [
    {
        id: 'matters',
        code: 'SOP-OPS-01',
        category: 'MANAJEMEN PERKARA & LITIGASI',
        title: 'Manajemen Perkara & Uji Benturan Kepentingan',
        tagline: 'Standar operasional penanganan perkara: conflict check otomatis, pembagian wewenang kuasa hukum, brankas bukti, hingga inkracht.',
        icon: Briefcase,
        image: '/images/guide/matter.jpg',
        route: '/matters',
        actionLabel: 'Buka Modul Perkara',
        estTime: '3 Menit',
        legalStandard: 'Kode Etik Advokat Indonesia (KEAI) Pasal 4 Huruf j & Pasal 164 HIR / 284 RBg',
        accent: {
            pill: 'border-blue-200 bg-blue-50/80 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300',
            glow: 'from-blue-500/10 via-transparent to-transparent',
            border: 'border-blue-500/30',
            text: 'text-blue-600 dark:text-blue-400',
            bar: 'bg-blue-600 dark:bg-blue-400',
        },
        steps: [
            {
                stepNum: '01',
                title: 'Uji Benturan Kepentingan (Conflict of Interest Check)',
                description: 'Verifikasi instan silang terhadap pihak lawan, afiliasi holding, dan saksi kunci guna mencegah benturan kepentingan etis.',
                tasks: [
                    'Buka menu Perkara → Klik "+ Buka Perkara Baru".',
                    'Ketik nama pihak lawan dan kuasa hukum lawan; sistem mencocokkan riwayat perkara aktif secara real-time.',
                    'Dapatkan konfirmasi status "Bersih & Bebas Konflik" sebelum menandatangani surat kuasa.',
                ],
                role: 'Managing Partner / Lead Partner',
                lawRef: 'KEAI Pasal 4',
            },
            {
                stepNum: '02',
                title: 'Penetapan Tim Kuasa Hukum & Hak Akses Berkas',
                description: 'Penunjukan Lead Partner penanggung jawab, Partner pendamping, Senior Associate, dan Paralegal penelaah berkas.',
                tasks: [
                    'Pilih Lead Partner yang bertindak di muka persidangan dan menandatangani dokumen.',
                    'Tambahkan nama rekan advokat pendamping perkara.',
                    'Sistem secara otomatis memberikan hak akses terisolasi hanya kepada tim perkara terpilih.',
                ],
                role: 'Managing Partner',
            },
            {
                stepNum: '03',
                title: 'Digitalisasi Kronologi & Matriks Alat Bukti Surat',
                description: 'Pencatatan fakta hukum kronologis dan penomoran alat bukti surat secara sistematis (P-1 s.d. P-n / T-1 s.d. T-n).',
                tasks: [
                    'Unggah draf gugatan, jawaban, replik, duplik, dan kesimpulan ke brankas perkara.',
                    'Beri label nomor bukti surat dan deskripsi pembuktian.',
                    'Catat resume persidangan setiap kali agenda sidang di pengadilan selesai.',
                ],
                role: 'Lead Partner / Associate',
                lawRef: 'HIR / RBg',
            },
            {
                stepNum: '04',
                title: 'Penyelesaian Amar Putusan & Pengarsipan Inkracht',
                description: 'Penutupan perkara pasca putusan berkekuatan hukum tetap dan penerbitan laporan akhir eksekutif ke klien.',
                tasks: [
                    'Perbarui status tahapan perkara menjadi "Putusan Inkracht / Selesai".',
                    'Unduh Executive Case Summary Report (PDF) bertanda tangan digital firma.',
                    'Pindahkan berkas ke penyimpanan arsip jangka panjang terenkripsi.',
                ],
                role: 'Lead Partner',
            },
        ],
        preview: {
            title: 'Gugatan Perbuatan Melawan Hukum (PMH) &bull; Wanprestasi Kontrak',
            subtitle: 'No. Perkara: 142/Pdt.G/2026/PN.Jkt.Sel &bull; Penggugat: PT Graha Nusantara Sentosa',
            badges: [
                { text: 'STATUS: PEMERIKSAAN SAKSI', type: 'info' },
                { text: 'CONFLICT CHECK: CLEAR', type: 'success' },
                { text: 'LITIGASI PERDATA', type: 'neutral' },
            ],
            metrics: [
                { label: 'Lead Partner Kuasa Hukum', value: 'Adv. Roni Hidayat, S.H., M.H.', hint: 'NIA: 08.19284 / PERADI' },
                { label: 'Jadwal Sidang Terdekat', value: 'Kamis, 17 Sept 2026 &bull; 10:00 WIB', hint: 'PN Jakarta Selatan (Ruang 02)' },
                { label: 'Matriks Alat Bukti Terunggah', value: '18 Dokumen (P-1 s.d. P-18)', hint: 'Status: 100% Lengkap & Sah' },
                { label: 'Status Honorarium & Termin', value: 'Termin 1 & 2 Lunas (Paid)', hint: 'Kuitansi Resmi Terverifikasi' },
            ],
            note: 'Dilindungi kerahasiaan hubungan advokat dan klien (Attorney-Client Privilege) berstandar ISO/IEC 27001.',
        },
    },
    {
        id: 'signatures',
        code: 'SOP-DOC-02',
        category: 'DOKUMEN & TANDA TANGAN ELEKTRONIK',
        title: 'Generator Dokumen Baku & Tanda Tangan Digital',
        tagline: 'Penerbitan otomatis draf surat kuasa, sirkulasi penandatanganan elektronik multipihak, dan lembar verifikasi keabsahan QR Code.',
        icon: FileCheck,
        image: '/images/guide/signature.jpg',
        route: '/documents',
        actionLabel: 'Buka Modul Dokumen',
        estTime: '2 Menit',
        legalStandard: 'UU ITE No. 1/2024 Pasal 11 & PP No. 71/2019 tentang Tanda Tangan Elektronik',
        accent: {
            pill: 'border-cyan-200 bg-cyan-50/80 text-cyan-700 dark:border-cyan-900/50 dark:bg-cyan-950/40 dark:text-cyan-300',
            glow: 'from-cyan-500/10 via-transparent to-transparent',
            border: 'border-cyan-500/30',
            text: 'text-cyan-600 dark:text-cyan-400',
            bar: 'bg-cyan-600 dark:bg-cyan-400',
        },
        steps: [
            {
                stepNum: '01',
                title: 'Penerbitan Draf Instan dari Template Baku Firma',
                description: 'Pilih template Surat Kuasa Khusus, Surat Somasi, atau NDA; variabel pihak terisi otomatis.',
                tasks: [
                    'Masuk ke menu Dokumen → Pilih tab "Template Dokumen".',
                    'Pilih template yang diinginkan (misal: Surat Kuasa Khusus Litigasi).',
                    'Pilih Klien dan Perkara; nama penerima kuasa, NIA, dan alamat tergugat otomatis terisi presisi.',
                ],
                role: 'Associate / Paralegal',
            },
            {
                stepNum: '02',
                title: 'Pengiriman Permintaan Tanda Tangan Elektronik',
                description: 'Kirimkan berkas draf PDF kepada para pihak penandatangan secara berurutan.',
                tasks: [
                    'Tentukan urutan penandatangan (Klien → Advokat → Managing Partner).',
                    'Klien menerima tautan penandatanganan aman via email tanpa kewajiban memiliki akun.',
                    'Pemberi kuasa menandatangani pada canvas digital atau via passkey.',
                ],
                role: 'Lead Partner / Finance',
            },
            {
                stepNum: '03',
                title: 'Verifikasi Keabsahan & Segel QR Code Kriptografis',
                description: 'Setiap dokumen tervalidasi dilengkapi segel QR Code dan sidik jari hash SHA-256.',
                tasks: [
                    'Pindai QR Code di pojok dokumen menggunakan kamera smartphone apa pun.',
                    'Halaman verifikasi resmi RPK Law Firm menampilkan tanggal presisi, penandatangan, dan riwayat integritas.',
                    'Dokumen berkekuatan hukum otentik dan kebal manipulasi pasca tereksekusi.',
                ],
                role: 'Pihak Ketiga / Pengadilan',
                lawRef: 'UU ITE Pasal 11',
            },
        ],
        preview: {
            title: 'Surat Kuasa Khusus Litigasi Perdata &mdash; DOC/2026/SKK/0142',
            subtitle: 'Pemberi Kuasa: Direktur Utama PT Graha Nusantara &bull; Penerima: Adv. Roni Hidayat, S.H.',
            badges: [
                { text: 'STATUS: TANDATANGAN LENGKAP', type: 'success' },
                { text: 'SHA-256 ENCRYPTED SEAL', type: 'info' },
                { text: 'SAH SECARA HUKUM', type: 'neutral' },
            ],
            metrics: [
                { label: 'Pemberi Kuasa (Klien)', value: 'Bambang Soediro (Direktur Utama)', hint: 'Ditandatangani via Layar HP &bull; 14:20 WIB' },
                { label: 'Penerima Kuasa (Advokat)', value: 'Adv. Roni Hidayat, S.H., M.H.', hint: 'Ditandatangani via Touch ID Passkey &bull; 14:25 WIB' },
                { label: 'Sidik Jari Kriptografis Hash', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41...', hint: 'Kunci Asimetris Firma Terverifikasi Sah' },
                { label: 'Tautan Verifikasi Keabsahan', value: 'https://app.rpklawoffice.com/verify/RPK-SIGN-0142', hint: 'Scan QR Code untuk Lembar Sertifikat' },
            ],
            note: 'Telah terverifikasi dengan kunci kriptografi server aman RPK Law Firm (Non-Repudiation Guarantee).',
        },
    },
    {
        id: 'finance',
        code: 'SOP-FIN-03',
        category: 'KEUANGAN & PENAGIHAN HONORARIUM',
        title: 'Honorarium Hukum, Penagihan Invoice & Pajak PPh',
        tagline: 'Penerbitan tagihan profesional, pencatatan termin fee advokat, kalkulasi otomatis PPh 23 (2%), dan kuitansi resmi.',
        icon: CreditCard,
        image: '/images/guide/finance.jpg',
        route: '/finance',
        actionLabel: 'Buka Modul Keuangan',
        estTime: '2 Menit',
        legalStandard: 'Peraturan Menteri Keuangan (PMK) No. 168/2023 tentang Pemotongan Pajak PPh 23/21',
        accent: {
            pill: 'border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300',
            glow: 'from-emerald-500/10 via-transparent to-transparent',
            border: 'border-emerald-500/30',
            text: 'text-emerald-600 dark:text-emerald-400',
            bar: 'bg-emerald-600 dark:bg-emerald-400',
        },
        steps: [
            {
                stepNum: '01',
                title: 'Penerbitan Invoice Tagihan Berdasarkan Engagement Letter',
                description: 'Penyusunan rincian tagihan profesional sesuai kesepakatan Perjanjian Jasa Hukum.',
                tasks: [
                    'Buka menu Keuangan → Klik "+ Buat Tagihan / Invoice".',
                    'Pilih perkara dan klien; masukkan komponen Retainer Fee, Success Fee, atau Reimbursement Biaya Pengadilan.',
                    'Sistem menghitung otomatis potongan pajak PPh 23 (2%) dan rincian rekening resmi kantor hukum.',
                ],
                role: 'Finance Specialist / Partner',
            },
            {
                stepNum: '02',
                title: 'Verifikasi Pembayaran Masuk & Penerbitan Kuitansi Resmi',
                description: 'Konfirmasi bukti transfer bank dan penerbitan tanda terima resmi (Official Receipt) berformat PDF.',
                tasks: [
                    'Unggah salinan bukti transfer bank klien pada invoice terkait.',
                    'Ubah status pembayaran menjadi "Lunas / Paid".',
                    'Cetak Kuitansi Resmi ber-barcode dan kirimkan ke klien.',
                ],
                role: 'Finance / Managing Partner',
            },
        ],
        preview: {
            title: 'Invoice Tagihan Jasa Hukum &mdash; INV/2026/09/0142',
            subtitle: 'Perkara: Gugatan PMH No. 142 &bull; Klien: PT Graha Nusantara Sentosa',
            badges: [
                { text: 'STATUS: LUNAS (PAID)', type: 'success' },
                { text: 'TRANSFER BANK MANDIRI', type: 'neutral' },
                { text: 'KUITANSI RESMI TERBIT', type: 'info' },
            ],
            metrics: [
                { label: 'Komponen Retainer Fee Tahap 1', value: 'Rp 50.000.000', hint: 'Honorarium Advokat Penanganan Perkara' },
                { label: 'Biaya Sidang & SKUM Pengadilan', value: 'Rp 5.000.000', hint: 'Reimbursement Kasus Riil (Court Fee)' },
                { label: 'Potongan Pajak PPh Pasal 23 (2%)', value: '- Rp 1.000.000', hint: 'Disetor Klien dengan Bukti Potong Pajak' },
                { label: 'Total Penerimaan Bersih Firma', value: 'Rp 54.000.000', hint: 'Tercatat di Rekening Resmi RPK Law Firm' },
            ],
            note: 'Seluruh pencatatan keuangan terintegrasi dengan jurnal buku besar dan laporan performa mitra hukum.',
        },
    },
    {
        id: 'calendar',
        code: 'SOP-CAL-04',
        category: 'KALENDER & AGENDA PERSIDANGAN',
        title: 'Kalender Persidangan & Sinkronisasi Agenda Mobile',
        tagline: 'Manajemen terpadu sidang pengadilan, mediasi, tenggat upaya hukum 14 hari, dan feed iCal sinkron ke ponsel.',
        icon: Calendar,
        image: '/images/guide/calendar.jpg',
        route: '/calendar',
        actionLabel: 'Buka Kalender Sidang',
        estTime: '1 Menit',
        legalStandard: 'PERMA No. 1/2019 tentang Administrasi Perkara & Sidang Elektronik (e-Court)',
        accent: {
            pill: 'border-amber-200 bg-amber-50/80 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300',
            glow: 'from-amber-500/10 via-transparent to-transparent',
            border: 'border-amber-500/30',
            text: 'text-amber-600 dark:text-amber-400',
            bar: 'bg-amber-600 dark:bg-amber-400',
        },
        steps: [
            {
                stepNum: '01',
                title: 'Pencatatan Jadwal Sidang & Instansi Pengadilan',
                description: 'Input agenda sidang baru lengkap dengan institusi pengadilan, ruang, dan pengacara yang bertugas.',
                tasks: [
                    'Buka menu Kalender atau tab Jadwal di halaman perkara.',
                    'Pilih Pengadilan Negeri / Agama / TUN / Niaga dan tentukan agenda sidang.',
                    'Tugaskan advokat pendamping yang wajib hadir di pengadilan.',
                ],
                role: 'Associate / Paralegal',
            },
            {
                stepNum: '02',
                title: 'Otomatisasi Notifikasi Pengingat (H-7 & H-1)',
                description: 'Sistem mengirimkan alarm peringatan dini sebelum jadwal sidang terlaksana.',
                tasks: [
                    'Pengingat otomatis terkirim via email dan dashboard sistem 7 hari dan 24 jam sebelum sidang.',
                    'Radar deadline mengawal batas 14 hari kalender pendaftaran memori banding atau kasasi.',
                ],
                role: 'Sistem Otomatis',
            },
            {
                stepNum: '03',
                title: 'Sinkronisasi iCal Feed ke Ponsel Advokat',
                description: 'Hubungkan seluruh jadwal sidang ke Google Calendar, Apple Calendar, atau Microsoft Outlook.',
                tasks: [
                    'Klik tombol "Sinkronkan iCal Feed" di bagian atas halaman Kalender.',
                    'Salin URL token privat dan tempelkan ke aplikasi kalender di ponsel pintar Anda.',
                ],
                role: 'Advokat / Associate',
            },
        ],
        preview: {
            title: 'Agenda Persidangan & Upaya Hukum Bulan Berjalan',
            subtitle: 'Tersinkronisasi secara langsung dengan perangkat ponsel seluruh tim kuasa hukum',
            badges: [
                { text: 'ICAL FEED: AKTIF & TERSINKRON', type: 'success' },
                { text: '4 SIDANG MINGGU INI', type: 'info' },
                { text: 'DEADLINE RADAR: AMAN', type: 'neutral' },
            ],
            metrics: [
                { label: 'Sidang Pembuktian Lawan &bull; Kamis, 17 Sept 2026', value: 'PN Jakarta Selatan &mdash; Ruang 02', hint: 'Perkara No. 142/Pdt.G/2026 &bull; Adv. Roni Hidayat, S.H.' },
                { label: 'Mediasi Pra-Arbitrase &bull; Selasa, 22 Sept 2026', value: 'BANI Arbitration Center, Jakarta', hint: 'Klien: PT Multi Karya &bull; Adv. Hendra Kusumah, S.H.' },
                { label: 'Batas Memori Kasasi &bull; Jumat, 25 Sept 2026', value: 'Mahkamah Agung RI via e-Court', hint: 'Tenggat Waktu 14 Hari &bull; Pengawasan Lead Partner' },
            ],
            note: 'Setiap pergeseran tanggal sidang di sistem langsung terbarui di Google/Apple Calendar tanpa sinkronisasi manual.',
        },
    },
    {
        id: 'clients',
        code: 'SOP-KYC-05',
        category: 'DIREKTORI KLIEN & KEPATUHAN KYC',
        title: 'Direktori Klien & Kepatuhan Legalitas (KYC/AML)',
        tagline: 'Database induk klien korporasi dan perorangan, pemantauan masa berlaku akta/NIB, serta kepatuhan anti pencucian uang.',
        icon: Users,
        image: '/images/guide/kyc.jpg',
        route: '/clients',
        actionLabel: 'Buka Direktori Klien',
        estTime: '3 Menit',
        legalStandard: 'Prinsip Mengenali Pengguna Jasa (PMPJ) & Regulasi PPATK untuk Profesi Advokat',
        accent: {
            pill: 'border-purple-200 bg-purple-50/80 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300',
            glow: 'from-purple-500/10 via-transparent to-transparent',
            border: 'border-purple-500/30',
            text: 'text-purple-600 dark:text-purple-400',
            bar: 'bg-purple-600 dark:bg-purple-400',
        },
        steps: [
            {
                stepNum: '01',
                title: 'Registrasi Entitas Klien (Perorangan / Korporasi)',
                description: 'Pencatatan data identitas legal pihak yang diwakili oleh kantor hukum.',
                tasks: [
                    'Buka menu Klien & Kontak → Klik "+ Tambah Klien".',
                    'Pilih tipe entitas: Korporasi (PT/CV/Yayasan) atau Perorangan (WNI/WNA).',
                    'Isi alamat domisili hukum, nomor kontak, serta penanggung jawab utama.',
                ],
                role: 'Associate / Admin',
            },
            {
                stepNum: '02',
                title: 'Uji Kelayakan Kepatuhan & Masa Berlaku Dokumen Legalitas',
                description: 'Unggah berkas akta dan izin berusaha untuk menjamin kelayakan legal standing klien.',
                tasks: [
                    'Unggah Akta Pendirian & Perubahan Terakhir, SK Kemenkumham, NPWP Badan, serta NIB.',
                    'Catat masa berlaku izin untuk menyalakan alarm pengingat perpanjangan otomatis.',
                ],
                role: 'Lead Partner / Compliance Specialist',
            },
        ],
        preview: {
            title: 'Profil Kepatuhan Entitas Klien &mdash; PT Graha Nusantara Sentosa',
            subtitle: 'Status Kepatuhan: Terverifikasi Lengkap (Full KYC Approved)',
            badges: [
                { text: 'BADAN HUKUM (PT)', type: 'neutral' },
                { text: 'KYC 100% TERVERIFIKASI', type: 'success' },
                { text: 'AML: LOW RISK', type: 'info' },
            ],
            metrics: [
                { label: 'Legal Standing / Akta Terakhir', value: 'Akta No. 42 Notaris Dr. Irawan, S.H. (2024)', hint: 'SK Kemenkumham: AHU-0019284.AH.01.02' },
                { label: 'Nomor Induk Berusaha (NIB)', value: '0192837465019', hint: 'Terverifikasi via OSS RBA Kemeninves' },
                { label: 'Penanggung Jawab / Direktur Utama', value: 'Bambang Soediro (KTP Terlampir)', hint: 'Memiliki Kewenangan Bertindak Sesuai AD/ART' },
            ],
            note: 'Data kepatuhan klien tersimpan secara terenkripsi dan terlindungi kerahasiaan profesi advokat.',
        },
    },
    {
        id: 'passkeys',
        code: 'SOP-SEC-06',
        category: 'KEAMANAN & AUTENTIKASI BIOMETRIK',
        title: 'Autentikasi Passkey Biometrik & Keamanan Akun',
        tagline: 'Login instan bebas password dengan Touch ID, Face ID, atau Windows Hello berstandar FIDO2 WebAuthn tanpa risiko phising.',
        icon: KeyRound,
        image: '/images/guide/passkey.jpg',
        route: '/settings/profile',
        actionLabel: 'Buka Pengaturan Keamanan',
        estTime: '30 Detik',
        legalStandard: 'FIDO2 / WebAuthn Hardware Cryptographic Standard & ISO/IEC 27001 Access Control',
        accent: {
            pill: 'border-indigo-200 bg-indigo-50/80 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300',
            glow: 'from-indigo-500/10 via-transparent to-transparent',
            border: 'border-indigo-500/30',
            text: 'text-indigo-600 dark:text-indigo-400',
            bar: 'bg-indigo-600 dark:bg-indigo-400',
        },
        steps: [
            {
                stepNum: '01',
                title: 'Kelengkapan Kredensial Advokat (NIA & BAS)',
                description: 'Buka pengaturan profil untuk mengisi Nomor Induk Advokat dan tanggal Berita Acara Sumpah.',
                tasks: [
                    'Klik foto profil avatar di pojok kanan atas → Pilih "Pengaturan / Settings".',
                    'Isi informasi pada bagian "Informasi Profesi Advokat".',
                ],
                role: 'Advokat / Seluruh Pengguna',
            },
            {
                stepNum: '02',
                title: 'Aktivasi Sensor Biometrik Perangkat (Passkey)',
                description: 'Daftarkan Touch ID, Face ID, atau PIN perangkat Anda untuk login cepat tanpa kata sandi.',
                tasks: [
                    'Buka tab "Keamanan / Security" → Klik "Daftarkan Passkey Baru".',
                    'Sentuh sensor biometrik perangkat saat prompt browser muncul.',
                    'Pada login selanjutnya, klik "Masuk Cepat dengan Passkey (Biometrik)".',
                ],
                role: 'Seluruh Pengguna',
            },
        ],
        preview: {
            title: 'Autentikasi Biometrik Perangkat Keras (FIDO2 Hardware Secure Enclave)',
            subtitle: 'Tervalidasi via Touch ID / Face ID &bull; Nol Kerentanan Terhadap Serangan Phising',
            badges: [
                { text: 'PASSKEY AKTIF & TERDAFTAR', type: 'success' },
                { text: 'FIDO2 WEBAUTHN', type: 'info' },
                { text: 'HARDWARE ENCLAVE', type: 'neutral' },
            ],
            metrics: [
                { label: 'Perangkat Terdaftar 1', value: 'MacBook Pro Touch ID (Secure Enclave)', hint: 'Status: Aktif Utama &bull; Terdaftar 26 Agustus 2026' },
                { label: 'Perangkat Terdaftar 2', value: 'iPhone Face ID (Biometric Key)', hint: 'Status: Aktif Seluler &bull; Terdaftar 26 Agustus 2026' },
                { label: 'Kecepatan Autentikasi', value: '< 1.0 Detik Masuk ke Workspace', hint: 'Otomatis Verifikasi Tanpa Input Manual' },
            ],
            note: 'Kunci privat tidak pernah keluar dari perangkat Anda sehingga kebal dari intersepsi jaringan manapun.',
        },
    },
    {
        id: 'rbac',
        code: 'SOP-ADM-07',
        category: 'TATA KELOLA ADMINISTRASI & RBAC',
        title: 'Tata Kelola Staf, 26 Matriks RBAC & Audit Trail',
        tagline: 'Pengaturan struktur 8 tingkatan jabatan wewenang advokat, proteksi isolasi berkas perkara, dan audit log real-time.',
        icon: Shield,
        image: '/images/guide/rbac.jpg',
        route: '/admin/users',
        actionLabel: 'Kelola Staf & Peran',
        estTime: '2 Menit',
        legalStandard: 'Prinsip Segregation of Duties & Standar Audit Integritas Digital Firma Hukum',
        accent: {
            pill: 'border-rose-200 bg-rose-50/80 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300',
            glow: 'from-rose-500/10 via-transparent to-transparent',
            border: 'border-rose-500/30',
            text: 'text-rose-600 dark:text-rose-400',
            bar: 'bg-rose-600 dark:bg-rose-400',
        },
        steps: [
            {
                stepNum: '01',
                title: 'Penetapan Jabatan Struktural & 26 Matriks Izin Mandiri',
                description: 'Pengaturan hak akses berdasarkan tingkatan jabatan advokat dan staf operasional.',
                tasks: [
                    'Buka menu "Manajemen Staf & Peran" pada panel Admin.',
                    'Pilih role: Managing Partner, Senior Partner, Partner, Senior Associate, Associate, Advokat Magang, Finance, atau Admin.',
                    'Sesuaikan 26 parameter izin independen untuk mengunci akses perkara sensitif atau finansial.',
                ],
                role: 'Managing Partner / Administrator',
            },
            {
                stepNum: '02',
                title: 'Audit Trail & Rekaman Jejak Keamanan Sistem',
                description: 'Pantau riwayat aktivitas staf, akses dokumen rahasia, dan unduhan berkas secara real-time.',
                tasks: [
                    'Buka modul "Audit Trail" untuk meninjau log aktivitas.',
                    'Log mencatat alamat IP, nama perangkat, cap waktu presisi, serta data sebelum dan sesudah perubahan.',
                ],
                role: 'Managing Partner / IT Security',
            },
        ],
        preview: {
            title: 'Matriks Kewenangan Staf & Rekaman Audit Trail Digital',
            subtitle: '8 Tingkatan Jabatan Struktural &bull; 26 Hak Akses Independen',
            badges: [
                { text: '8 STRUKTUR JABATAN', type: 'neutral' },
                { text: '26 MATRIKS IZIN RBAC', type: 'info' },
                { text: 'AUDIT TRAIL AKTIF', type: 'success' },
            ],
            metrics: [
                { label: 'Managing Partner / Senior Partner', value: 'Akses Penuh Seluruh Perkara & Finansial', hint: 'Otoritas Tertinggi Pengambilan Keputusan' },
                { label: 'Senior Associate / Associate', value: 'Akses Perkara yang Ditugaskan Saja', hint: 'Dibatasi dari Laporan Finansial Internal Firma' },
                { label: 'Finance & Billing Specialist', value: 'Akses Modul Keuangan, Invoice & Pajak', hint: 'Dibatasi dari Dokumen Rahasia Perkara Tertutup' },
            ],
            note: 'Setiap tindakan create, update, delete, dan download berkas terekam permanen dalam database audit log.',
        },
    },
];

const FAQS = [
    {
        q: 'Bagaimana cara mendaftarkan tanda tangan saya untuk dokumen resmi?',
        a: 'Buka menu Pengaturan Profil (klik avatar di pojok kanan atas → Pengaturan), pilih tab "Spesimen Tanda Tangan", lalu goreskan tanda tangan Anda pada canvas digital atau unggah berkas PNG berlatar transparan.',
    },
    {
        q: 'Apakah klien wajib memiliki akun aplikasi untuk menandatangani dokumen?',
        a: 'Tidak wajib. Klien akan menerima tautan verifikasi aman melalui email yang memungkinkan mereka meninjau draf dan menandatangani dokumen secara resmi langsung dari peramban ponsel atau komputer tanpa perlu mendaftar.',
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

export default function GuideIndex() {
    const [activeId, setActiveId] = useState<string>('matters');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    // Search filter
    const filteredStudios = useMemo(() => {
        if (!searchQuery.trim()) return STUDIOS;
        const q = searchQuery.toLowerCase();
        return STUDIOS.filter((s) => {
            return (
                s.title.toLowerCase().includes(q) ||
                s.category.toLowerCase().includes(q) ||
                s.tagline.toLowerCase().includes(q) ||
                s.code.toLowerCase().includes(q) ||
                s.steps.some((step) =>
                    step.title.toLowerCase().includes(q) ||
                    step.description.toLowerCase().includes(q) ||
                    step.tasks.some((t) => t.toLowerCase().includes(q))
                )
            );
        });
    }, [searchQuery]);

    // Active studio object
    const activeStudio = useMemo(() => {
        const found = STUDIOS.find((s) => s.id === activeId);
        return found || filteredStudios[0] || STUDIOS[0];
    }, [activeId, filteredStudios]);

    const activeStep = activeStudio.steps[activeStepIndex] || activeStudio.steps[0];

    const toggleTask = (taskKey: string) => {
        setCompletedTasks((prev) => ({
            ...prev,
            [taskKey]: !prev[taskKey],
        }));
    };

    const handleCopyShortcut = () => {
        navigator.clipboard.writeText('Cmd + K');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <>
            <Head title="Panduan Penggunaan & Standar Operasional - RPK App" />

            <div className="min-h-screen bg-[#fafafc] pb-24 text-slate-900 transition-colors duration-300 dark:bg-[#090a0d] dark:text-zinc-100">
                <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                    {/* 1. Header Banner & Executive Search Matrix */}
                    <div className="flex flex-col justify-between gap-6 border-b border-slate-200/80 pb-6 md:flex-row md:items-end dark:border-white/[0.06]">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-slate-600 uppercase shadow-2xs dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                                <Sparkles className="size-3 text-blue-600 dark:text-blue-400" />
                                <span>RPK APP OPERATIONAL STUDIO &amp; BLUEPRINT</span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl lg:text-4xl dark:text-white">
                                Panduan Interaktif &amp; Standar Praktik
                            </h1>
                            <p className="max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-zinc-400">
                                Eksplorasi alur operasional firma hukum, simulasi antarmuka berkas perkara, generator surat kuasa digital, dan kepatuhan penagihan honorarium.
                            </p>
                        </div>

                        {/* Search Input Bar */}
                        <div className="w-full md:w-88">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari alur, berkas, invoice, passkey..."
                                    className="h-10 w-full rounded-2xl border-slate-200/80 bg-white pr-4 pl-10 text-xs shadow-2xs transition-all focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-300 dark:border-white/10 dark:bg-[#12141a] dark:text-white"
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

                    {/* 2. Top Segmented Workflow Navigation Carousel */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="font-mono text-[10px] font-extrabold tracking-widest text-slate-400 uppercase dark:text-zinc-500">
                                PILIH ALUR PRAKTIK OPERASIONAL ({filteredStudios.length} ALUR TERSEDIA)
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                                KLIK TAB UNTUK SIMULASI
                            </span>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {filteredStudios.map((s) => {
                                const IconCmp = s.icon;
                                const isCurrent = activeStudio.id === s.id;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => {
                                            setActiveId(s.id);
                                            setActiveStepIndex(0);
                                        }}
                                        className={`group relative flex shrink-0 items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 text-left transition-all duration-300 ${
                                            isCurrent
                                                ? 'border-slate-900 bg-slate-900 text-white shadow-md ring-2 ring-slate-900/10 dark:border-white dark:bg-white dark:text-slate-900 dark:ring-white/20'
                                                : 'border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#12141a] dark:text-zinc-300 dark:hover:border-white/10 dark:hover:bg-[#161822]'
                                        }`}
                                    >
                                        <div className={`flex size-7 items-center justify-center rounded-xl transition-colors ${
                                            isCurrent
                                                ? 'bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-900'
                                                : 'bg-slate-100 text-slate-600 group-hover:text-slate-900 dark:bg-white/[0.04] dark:text-zinc-400 dark:group-hover:text-white'
                                        }`}>
                                            <IconCmp className="size-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`font-mono text-[9px] font-black tracking-wider uppercase ${
                                                    isCurrent ? 'text-white/75 dark:text-slate-900/75' : 'text-slate-400 dark:text-zinc-500'
                                                }`}>
                                                    {s.code}
                                                </span>
                                            </div>
                                            <div className="text-xs font-bold whitespace-nowrap">
                                                {s.title.split('&')[0]}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. The Double-Bezel Interactive Studio Canvas (Agency Standard) */}
                    <div className="relative rounded-[2rem] bg-slate-200/70 p-2 shadow-xl ring-1 ring-slate-300/80 dark:bg-white/[0.03] dark:ring-white/[0.08]">
                        <div className="overflow-hidden rounded-[calc(2rem-0.5rem)] border border-slate-200/90 bg-white shadow-inner transition-colors duration-300 dark:border-white/[0.06] dark:bg-[#0e1015]">
                            {/* Studio Window Header Strip */}
                            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-6 py-4 sm:flex-row sm:items-center dark:border-white/[0.04] dark:bg-[#13161e]">
                                <div className="flex items-center gap-3">
                                    {/* Mac Window Dots */}
                                    <div className="hidden items-center gap-1.5 sm:flex">
                                        <span className="size-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
                                        <span className="size-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
                                        <span className="size-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
                                    </div>
                                    <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-lg border px-2.5 py-0.5 font-mono text-[10px] font-black tracking-wider uppercase ${activeStudio.accent.pill}`}>
                                            {activeStudio.code} &bull; {activeStudio.category}
                                        </span>
                                        <span className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                                            Est: {activeStudio.estTime}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                        <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                                        <span>LIVE SIMULATOR</span>
                                    </div>
                                    <Link
                                        href={activeStudio.route}
                                        className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                    >
                                        <span>{activeStudio.actionLabel}</span>
                                        <div className="flex size-4 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5 dark:bg-slate-900/10">
                                            <ArrowRight className="size-2.5" />
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Studio Content Grid (2 Columns: Showcase Preview on Left, Interactive Step Studio on Right) */}
                            <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-12 lg:p-8">
                                {/* Left Column: Visual 3D Banner & Live Interface Mockup (7 Cols) */}
                                <div className="space-y-6 lg:col-span-7">
                                    {/* 3D Visual Blueprint Banner */}
                                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-md dark:border-white/10">
                                        <div className="relative h-56 w-full overflow-hidden sm:h-64">
                                            <img
                                                src={activeStudio.image}
                                                alt={activeStudio.title}
                                                className="h-full w-full object-cover object-center opacity-90 transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                                            <div className="absolute right-5 bottom-5 left-5 flex flex-col justify-between gap-2 text-white sm:flex-row sm:items-end">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="size-2 rounded-full bg-emerald-400" />
                                                        <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
                                                            PANDUAN PRAKTIK RESMI &bull; {activeStudio.code}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-bold sm:text-lg">
                                                        {activeStudio.title}
                                                    </h3>
                                                </div>
                                                <span className="shrink-0 rounded-lg border border-white/20 bg-black/40 px-2.5 py-1 font-mono text-[9px] font-bold text-white/90 backdrop-blur-md">
                                                    RPK Practice Standard
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Live Simulated Output Container */}
                                    <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 dark:border-white/[0.05] dark:bg-white/[0.02]">
                                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 dark:border-white/[0.04]">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {activeStudio.preview.badges.map((b, bIdx) => (
                                                        <span
                                                            key={bIdx}
                                                            className={`rounded-md px-2 py-0.5 font-mono text-[9.5px] font-black tracking-wide ${
                                                                b.type === 'success'
                                                                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300'
                                                                    : b.type === 'info'
                                                                    ? 'border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300'
                                                                    : 'border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300'
                                                            }`}
                                                        >
                                                            {b.text}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {activeStudio.preview.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                    {activeStudio.preview.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Structured Key-Value Rows */}
                                        <div className="divide-y divide-slate-200/40 text-xs dark:divide-white/[0.03]">
                                            {activeStudio.preview.metrics.map((m, mIdx) => (
                                                <div key={mIdx} className="flex flex-col justify-between py-2.5 sm:flex-row sm:items-center">
                                                    <span className="font-medium text-slate-500 dark:text-zinc-400">
                                                        {m.label}
                                                    </span>
                                                    <div className="text-left sm:text-right">
                                                        <span className="font-bold text-slate-900 dark:text-white">
                                                            {m.value}
                                                        </span>
                                                        {m.hint && (
                                                            <span className="block font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                                                                {m.hint}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {activeStudio.preview.note && (
                                            <div className="flex items-start gap-2 rounded-xl border border-slate-200/60 bg-white p-3 text-[11px] text-slate-600 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-400">
                                                <Info className="mt-0.5 size-3.5 shrink-0 text-slate-500 dark:text-zinc-400" />
                                                <span>{activeStudio.preview.note}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Interactive Step Progression Studio (5 Cols) */}
                                <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
                                    <div className="space-y-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono text-[10px] font-extrabold tracking-widest text-slate-400 uppercase dark:text-zinc-500">
                                                    TAHAPAN OPERASIONAL (SOP)
                                                </span>
                                                <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-zinc-300">
                                                    Langkah {activeStepIndex + 1} dari {activeStudio.steps.length}
                                                </span>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                                                <div
                                                    className={`h-full transition-all duration-300 ${activeStudio.accent.bar}`}
                                                    style={{ width: `${((activeStepIndex + 1) / activeStudio.steps.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Step Buttons Selector */}
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                            {activeStudio.steps.map((st, idx) => {
                                                const isStepActive = idx === activeStepIndex;
                                                return (
                                                    <button
                                                        key={st.stepNum}
                                                        type="button"
                                                        onClick={() => setActiveStepIndex(idx)}
                                                        className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                                                            isStepActive
                                                                ? 'border-slate-900 bg-slate-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-900'
                                                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.06] dark:bg-[#12141a] dark:text-zinc-400 dark:hover:bg-[#171a23]'
                                                        }`}
                                                    >
                                                        <span className="font-mono text-[9px] font-black uppercase">
                                                            STEP
                                                        </span>
                                                        <span className="font-mono text-base font-black">
                                                            {st.stepNum}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Active Step Deep-Dive Card */}
                                        <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-white/[0.06] dark:bg-[#12141a]">
                                            <div className="space-y-1.5 border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <span className="font-mono text-[9.5px] font-bold text-slate-500 dark:text-zinc-400">
                                                        PENANGGUNG JAWAB: <strong className="text-slate-800 dark:text-white">{activeStep.role}</strong>
                                                    </span>
                                                    {activeStep.lawRef && (
                                                        <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[9px] font-bold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
                                                            {activeStep.lawRef}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-950 sm:text-base dark:text-white">
                                                    {activeStep.title}
                                                </h4>
                                                <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
                                                    {activeStep.description}
                                                </p>
                                            </div>

                                            {/* Actionable Tasks Checklist */}
                                            <div className="space-y-2">
                                                <span className="font-mono text-[9.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                                                    CHECKLIST EKSEKUSI (KLIK UNTUK TANDAI):
                                                </span>
                                                <div className="space-y-2">
                                                    {activeStep.tasks.map((task, tIdx) => {
                                                        const taskKey = `${activeStudio.id}-${activeStep.stepNum}-${tIdx}`;
                                                        const isDone = !!completedTasks[taskKey];
                                                        return (
                                                            <button
                                                                key={tIdx}
                                                                type="button"
                                                                onClick={() => toggleTask(taskKey)}
                                                                className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                                                                    isDone
                                                                        ? 'border-emerald-200 bg-emerald-50/50 text-slate-500 line-through dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-zinc-500'
                                                                        : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:border-slate-200 hover:bg-slate-50 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-300 dark:hover:border-white/10'
                                                                }`}
                                                            >
                                                                <div className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-md border transition-colors ${
                                                                    isDone
                                                                        ? 'border-emerald-600 bg-emerald-600 text-white'
                                                                        : 'border-slate-300 bg-white dark:border-white/20 dark:bg-transparent'
                                                                }`}>
                                                                    {isDone && <Check className="size-3" />}
                                                                </div>
                                                                <span className="text-xs leading-relaxed">{task}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Legal Compliance Footer Indicator */}
                                    <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-[11px] text-slate-700 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-zinc-400">
                                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-700 dark:text-zinc-300" />
                                        <div>
                                            <span className="font-bold text-slate-900 dark:text-white">Standar Kepatuhan Hukum: </span>
                                            <span>{activeStudio.legalStandard}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Asymmetrical Bento Matrix (Command Palette + Support + FAQ) */}
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                        {/* Box 1: Keyboard Command Hub (Col 4) */}
                        <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs lg:col-span-4 dark:border-white/[0.06] dark:bg-[#12141a]">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                <div className="flex items-center gap-2">
                                    <Terminal className="size-4 text-slate-700 dark:text-zinc-300" />
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Pusat Pintasan Keyboard
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyShortcut}
                                    className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                >
                                    <Copy className="size-3" />
                                    <span>{isCopied ? 'TERCIK' : 'SALIN'}</span>
                                </button>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-zinc-400">
                                Navigasi cepat tanpa menyentuh mouse untuk efisiensi penanganan perkara.
                            </p>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-white/[0.03] dark:bg-white/[0.02]">
                                    <span className="text-xs text-slate-600 dark:text-zinc-400">Command Palette</span>
                                    <kbd className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800 dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                        ⌘K / Ctrl+K
                                    </kbd>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-white/[0.03] dark:bg-white/[0.02]">
                                    <span className="text-xs text-slate-600 dark:text-zinc-400">Tutup Modal Dialog</span>
                                    <kbd className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800 dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                        ESC
                                    </kbd>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-white/[0.03] dark:bg-white/[0.02]">
                                    <span className="text-xs text-slate-600 dark:text-zinc-400">Fokus Form Berikutnya</span>
                                    <kbd className="rounded-md border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800 dark:border-white/10 dark:bg-zinc-800 dark:text-white">
                                        Tab
                                    </kbd>
                                </div>
                            </div>
                        </div>

                        {/* Box 2: FAQ Corporate Accordion (Col 8) */}
                        <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs lg:col-span-8 dark:border-white/[0.06] dark:bg-[#12141a]">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-white/[0.04]">
                                <HelpCircle className="size-4 text-slate-700 dark:text-zinc-300" />
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Tanya Jawab Kendala &amp; Solusi (FAQ)
                                </h3>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                {FAQS.map((faq, fIdx) => (
                                    <div key={fIdx} className="py-3">
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                                            className="flex w-full items-center justify-between gap-4 text-left text-xs font-bold text-slate-900 transition-colors hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400"
                                        >
                                            <span>{faq.q}</span>
                                            <ChevronDown
                                                className={`size-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                                                    openFaqIndex === fIdx ? 'rotate-180 text-slate-900 dark:text-white' : ''
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

                    {/* 5. Support & Helpdesk Footer Card */}
                    <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/90 bg-slate-900 p-6 text-white shadow-xl sm:flex-row sm:items-center dark:border-white/10 dark:bg-[#14161f]">
                        <div className="space-y-1">
                            <span className="font-mono text-[9.5px] font-bold tracking-widest text-slate-400 uppercase">
                                PUSAT DUKUNGAN ADMINISTRATOR
                            </span>
                            <h4 className="text-sm font-bold sm:text-base">
                                Butuh konfigurasi wewenang atau template dokumen baru?
                            </h4>
                            <p className="max-w-xl text-xs text-slate-400">
                                Tim IT dan Administrator RPK App siap membantu pengelolaan hak akses 26 RBAC matriks dan integrasi persidangan e-Court.
                            </p>
                        </div>
                        <a
                            href="mailto:admin@rpklawoffice.com?subject=Bantuan%20Operasional%20RPK%20App"
                            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-900 shadow-sm transition-transform hover:scale-[1.02] hover:bg-slate-100"
                        >
                            Hubungi Administrator
                        </a>
                    </div>
                </main>
            </div>
        </>
    );
}
