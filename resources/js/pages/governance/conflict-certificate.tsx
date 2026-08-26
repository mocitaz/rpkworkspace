import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Download,
    FileCheck,
    Gavel,
    Printer,
    Scale,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import * as governanceRoutes from '@/routes/governance';

type ConflictCheck = {
    id: string;
    subject_name: string;
    searched_names: string[];
    matches?: {
        type: string;
        id: string;
        name: string;
        risk: string;
        similarity: number;
        role_label?: string;
        details?: string;
        matter_number?: string;
        matter_title?: string;
    }[];
    status: string;
    decision: string;
    decision_note?: string;
    created_at: string;
    reviewed_at?: string;
    expires_at?: string;
    matter?: {
        id: string;
        matter_number: string;
        title: string;
    };
    client?: {
        id: string;
        client_number: string;
        display_name: string;
        tax_identifier?: string;
    };
    requester?: {
        id: number;
        name: string;
        email: string;
        position_title?: string;
    };
    reviewer?: {
        id: number;
        name: string;
        email: string;
        position_title?: string;
    };
};

export default function ConflictCertificate({
    conflictCheck,
}: {
    conflictCheck: ConflictCheck;
}) {
    const isClear =
        conflictCheck.status === 'clear' ||
        conflictCheck.decision === 'cleared' ||
        conflictCheck.decision === 'approved';
    const isWaived = conflictCheck.decision === 'waived';
    const isBlocked =
        conflictCheck.status === 'blocked' &&
        conflictCheck.decision !== 'waived';

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-100/70 py-6 text-slate-900 print:bg-white print:p-0 dark:bg-[#0c0d10] dark:text-slate-100">
            <Head
                title={`Sertifikat Pemeriksaan Benturan Kepentingan CC-${conflictCheck.id.slice(0, 10)} - RPK Law Firm`}
            />

            {/* Top Cockpit Action Bar (Hidden when printing) */}
            <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between px-4 print:hidden sm:px-6">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                    asChild
                >
                    <Link href={governanceRoutes.index.url()}>
                        <ArrowLeft className="mr-1.5 size-3.5 text-slate-400" />
                        Kembali ke Tata Kelola
                    </Link>
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="h-8 rounded-lg border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-200"
                    >
                        <Printer className="mr-1.5 size-3.5 text-slate-500" />
                        Cetak Dokumen
                    </Button>

                    <Button
                        size="sm"
                        className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                        asChild
                    >
                        <a
                            href={`/governance/conflict-checks/${conflictCheck.id}/pdf`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Download className="mr-1.5 size-3.5" />
                            Download PDF Resmi
                        </a>
                    </Button>
                </div>
            </div>

            {/* Official Legal Certificate Board */}
            <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/60 print:m-0 print:max-w-none print:rounded-none print:border-none print:p-8 print:shadow-none sm:p-10 dark:border-white/10 dark:bg-[#14161b] dark:shadow-none">
                
                {/* 1. Official Letterhead / Kop Surat Firma */}
                <div className="border-b-2 border-slate-900 pb-5 dark:border-white">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3.5">
                            <img
                                src="/logo/logo.png"
                                alt="RPK Law Firm"
                                className="h-10 w-auto max-w-[170px] object-contain"
                                onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                }}
                            />
                            <div className="border-l border-slate-200 pl-3.5 dark:border-white/10">
                                <h1 className="font-serif text-lg font-black tracking-tight text-slate-900 uppercase sm:text-xl dark:text-white">
                                    RONI, PUTRA &amp; KUSUMAH
                                </h1>
                                <p className="text-[10.5px] font-bold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                                    ADVOCATES &amp; LEGAL CONSULTANTS
                                </p>
                            </div>
                        </div>
                        <div className="text-left text-[11px] leading-relaxed text-slate-500 sm:text-right dark:text-zinc-400">
                            <p className="font-semibold text-slate-800 dark:text-zinc-200">
                                Divisi Kepatuhan Etika Profesi &amp; Manajemen Risiko
                            </p>
                            <p>
                                Menara Hukum RPK, Lantai 5, Jl. LLRE Martadinata No. 88, Bandung
                            </p>
                            <p className="font-mono text-[10px] text-slate-600 dark:text-zinc-400">
                                No. Registrasi: CC-RPK-{conflictCheck.id.slice(0, 14)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Certificate Title Header & Verdict Card */}
                <div className="my-7 text-center space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-1 font-mono text-[10px] font-bold text-white uppercase tracking-wider dark:bg-white dark:text-slate-900">
                        <FileCheck className="size-3 text-amber-400 dark:text-amber-600" />
                        NO. REGISTRASI KEPATUHAN: CC/{new Date(conflictCheck.created_at).getFullYear()}/{conflictCheck.id.slice(0, 8).toUpperCase()}
                    </div>

                    <h2 className="font-serif text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase dark:text-white">
                        SURAT KETERANGAN PEMERIKSAAN BENTURAN KEPENTINGAN
                    </h2>
                    <p className="font-sans text-xs tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                        CERTIFICATE OF CONFLICT OF INTEREST CLEARANCE &amp; ETHICAL REVIEW
                    </p>

                    {/* Executive Legal Verdict Card */}
                    <div className="mx-auto mt-4 max-w-2xl">
                        <div className="rounded-xl border border-slate-300/80 bg-slate-50/80 p-4 sm:p-5 text-center shadow-xs dark:border-white/10 dark:bg-[#121418]">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                                KESIMPULAN UJI INDEPENDENSI PROFESI
                            </span>
                            <div className="mt-1 flex items-center justify-center gap-2">
                                <span className="font-serif text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase dark:text-white">
                                    {isClear
                                        ? 'MEMENUHI SYARAT INDEPENDENSI • LAYAK DITANGANI'
                                        : isWaived
                                          ? 'DISETUJUI DENGAN KETENTUAN KHUSUS (ETHICAL WALL WAIVER)'
                                          : 'TIDAK DAPAT DITANGANI • BENTURAN LANGSUNG DITEMUKAN'}
                                </span>
                            </div>
                            <p className="mt-1 text-[11.5px] text-slate-600 dark:text-zinc-400 font-medium">
                                {isClear
                                    ? 'Berdasarkan penelusuran basis data perkara dan para pihak, tidak ditemukan benturan kepentingan dan perkara dinyatakan sah untuk diproses.'
                                    : isWaived
                                      ? 'Terdapat potensi benturan yang telah ditinjau dan disetujui Managing Partner dengan pembatasan akses data (Ethical Barrier).'
                                      : 'Ditemukan benturan kepentingan langsung dengan pihak lawan atau portofolio perkara aktif firma hukum.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Certificate Preamble & Summary Box */}
                <div className="space-y-6 text-xs text-slate-700 leading-relaxed dark:text-zinc-300">
                    <p className="text-justify leading-relaxed">
                        Berdasarkan ketentuan Kode Etik Advokat Indonesia (KEAI) serta Standar Kepatuhan Independensi Profesi Firma Hukum Roni, Putra &amp; Kusumah (RPK Law Firm), telah dilaksanakan penelusuran menyeluruh (<em>Comprehensive Conflict of Interest Scan</em>) terhadap basis data klien aktif, mantan klien, pihak lawan (<em>adverse parties</em>), kuasa hukum lawan, saksi, dan afiliasi perkara dengan rincian sebagai berikut:
                    </p>

                    {/* Metadata Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50/50 dark:border-white/10 dark:bg-[#121418]">
                        <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-white/10">
                            {/* Column 1 */}
                            <div className="space-y-3 p-4">
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                                        SUBJEK / NAMA UTAMA DIPERIKSA
                                    </span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        {conflictCheck.subject_name}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                                        SELURUH PIHAK YANG DITELUSURI
                                    </span>
                                    <span className="font-mono text-xs font-medium text-slate-800 dark:text-zinc-200">
                                        {conflictCheck.searched_names.join(', ')}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                                        PERKARA HUKUM / KLIEN TERKAIT
                                    </span>
                                    <span className="text-xs text-slate-800 dark:text-zinc-200">
                                        {conflictCheck.matter ? (
                                            <>
                                                <strong className="font-mono text-blue-600 dark:text-blue-400">
                                                    {conflictCheck.matter.matter_number}
                                                </strong>{' '}
                                                — {conflictCheck.matter.title}
                                            </>
                                        ) : conflictCheck.client ? (
                                            <>
                                                <strong>{conflictCheck.client.display_name}</strong> (No. Klien: {conflictCheck.client.client_number})
                                            </>
                                        ) : (
                                            'Pemeriksaan Pra-Perkara / Calon Klien Baru'
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-3 p-4">
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                                        TANGGAL &amp; WAKTU PEMERIKSAAN
                                    </span>
                                    <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
                                        {formatDate(conflictCheck.created_at, true)}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                                        MASA BERLAKU SERTIFIKAT
                                    </span>
                                    <span className="font-mono text-xs text-slate-800 dark:text-zinc-200">
                                        {conflictCheck.expires_at
                                            ? formatDate(conflictCheck.expires_at)
                                            : '30 Hari sejak penerbitan'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-500">
                                        PEMOHON PEMERIKSAAN (REQUESTER)
                                    </span>
                                    <span className="text-xs font-medium text-slate-800 dark:text-zinc-200">
                                        {conflictCheck.requester?.name ?? 'Advokat RPK'}{' '}
                                        {conflictCheck.requester?.position_title
                                            ? `(${conflictCheck.requester.position_title})`
                                            : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Match Breakdown Table (if matches found) */}
                    {conflictCheck.matches && conflictCheck.matches.length > 0 ? (
                        <div className="space-y-2.5">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide dark:text-white">
                                Hasil Temuan Penelusuran Database ({conflictCheck.matches.length} Temuan):
                            </h3>
                            <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-white/10">
                                <table className="w-full text-left text-xs">
                                    <thead className="border-b border-slate-200 bg-slate-900 text-white font-bold text-[10.5px] uppercase tracking-wider dark:bg-white dark:text-slate-900">
                                        <tr>
                                            <th className="p-3">Nama Entitas / Pihak</th>
                                            <th className="p-3">Peran &amp; Hubungan</th>
                                            <th className="p-3 text-center">Kemiripan</th>
                                            <th className="p-3 text-center">Tingkat Risiko</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white dark:divide-white/[0.04] dark:bg-transparent">
                                        {conflictCheck.matches.map((match, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                                                <td className="p-3 font-semibold text-slate-900 dark:text-white">
                                                    {match.name}
                                                    {match.details && (
                                                        <p className="mt-0.5 text-[10.5px] font-normal text-slate-500 dark:text-zinc-400">
                                                            {match.details}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10.5px] font-semibold text-slate-700 dark:bg-white/10 dark:text-zinc-300">
                                                        {match.role_label ?? match.type}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center font-mono font-bold">
                                                    {match.similarity}%
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span
                                                        className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                                                            match.risk === 'blocked'
                                                                ? 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300'
                                                                : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300'
                                                        }`}
                                                    >
                                                        {match.risk === 'blocked'
                                                            ? 'Benturan Langsung'
                                                            : 'Potensi Benturan'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 text-slate-800 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                <Scale className="size-4 text-slate-700 dark:text-zinc-300" />
                                <span>Hasil Penelusuran: Nihil Benturan Kepentingan (Zero Conflicts)</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                                Tidak ditemukan adanya irisan atau kesamaan nama pihak dengan klien aktif, mantan klien, maupun pihak lawan pada seluruh portofolio perkara yang sedang atau pernah ditangani oleh RPK Law Firm.
                            </p>
                        </div>
                    )}

                    {/* 5. Partner Decision & Ethical Justification Note */}
                    {conflictCheck.decision_note && (
                        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 text-slate-800 dark:border-white/10 dark:bg-[#121418] dark:text-zinc-200">
                            <h4 className="font-bold uppercase tracking-wider text-[10.5px] text-slate-900 dark:text-white">
                                Catatan &amp; Justifikasi Etik Managing Partner:
                            </h4>
                            <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed italic text-slate-700 dark:text-zinc-300">
                                "{conflictCheck.decision_note}"
                            </p>
                            {conflictCheck.reviewer && (
                                <p className="mt-2 text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                                    Disetujui oleh: <strong>{conflictCheck.reviewer.name}</strong> (
                                    {conflictCheck.reviewer.position_title ?? 'Managing Partner'}) pada{' '}
                                    {conflictCheck.reviewed_at
                                        ? formatDate(conflictCheck.reviewed_at, true)
                                        : '-'}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* 6. Official Signatures & Verification Badge */}
                <div className="mt-10 border-t border-slate-200/90 pt-6 dark:border-white/10">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                        {/* Digital Verification Info */}
                        <div className="space-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
                            <div className="flex items-center gap-3">
                                <img
                                    src={`/verify/correspondence/${conflictCheck.id}/qr.svg`}
                                    alt="QR Code Verifikasi"
                                    className="size-14 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs dark:border-white/10 dark:bg-[#121418]"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                                <div className="space-y-0.5">
                                    <p className="font-bold text-slate-900 dark:text-white">
                                        Dokumen Sah Terverifikasi Elektronik
                                    </p>
                                    <p className="font-mono text-[10px]">
                                        ID: CC-RPK-{conflictCheck.id.slice(0, 14)}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        Diterbitkan resmi oleh Sistem Tata Kelola RPK Law Firm.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Partner Sign-off Box */}
                        <div className="min-w-[220px] text-center sm:text-right space-y-1">
                            <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                Bandung,{' '}
                                {formatDate(
                                    conflictCheck.reviewed_at ?? conflictCheck.created_at,
                                )}
                            </p>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                RONI, PUTRA &amp; KUSUMAH LAW FIRM
                            </p>
                            <div className="my-4 hidden border-b border-slate-200 sm:block dark:border-white/10" />
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">
                                {conflictCheck.reviewer?.name ?? 'Managing Partner'}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                {conflictCheck.reviewer?.position_title ?? 'Managing Partner & Ethics Officer'}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
