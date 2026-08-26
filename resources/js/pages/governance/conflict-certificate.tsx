import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    FileCheck,
    Gavel,
    Printer,
    QrCode,
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
        tax_id?: string;
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
        <div className="min-h-screen bg-slate-100/70 py-8 text-slate-900 print:bg-white print:p-0 dark:bg-[#0f1115] dark:text-slate-100">
            <Head
                title={`Sertifikat Bebas Konflik #${conflictCheck.id.slice(0, 10)} - RPK Law Office`}
            />

            {/* Non-printable Action Header */}
            <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between px-4 print:hidden sm:px-6">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
                    asChild
                >
                    <Link href={governanceRoutes.index.url()}>
                        <ArrowLeft className="mr-1.5 size-3.5" />
                        Kembali ke Tata Kelola
                    </Link>
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={handlePrint}
                        className="h-8 rounded-lg bg-slate-900 px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        <Printer className="mr-1.5 size-3.5" />
                        Cetak Sertifikat (PDF)
                    </Button>
                </div>
            </div>

            {/* Official Printable Certificate Board */}
            <div className="mx-auto max-w-4xl rounded-2xl border border-slate-300/80 bg-white p-8 shadow-xl print:m-0 print:max-w-none print:rounded-none print:border-none print:p-8 print:shadow-none sm:p-12 dark:border-white/10 dark:bg-[#14161b]">
                {/* 1. Letterhead / Kop Surat Firma */}
                <div className="border-b-2 border-slate-900 pb-5 dark:border-white">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3.5">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                <Scale className="size-6" />
                            </div>
                            <div>
                                <h1 className="font-serif text-lg font-black tracking-tight text-slate-900 uppercase sm:text-xl dark:text-white">
                                    RONI, PUTRA &amp; KUSUMA
                                </h1>
                                <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-zinc-400">
                                    ADVOCATES &amp; LEGAL CONSULTANTS
                                </p>
                            </div>
                        </div>
                        <div className="text-left text-[10.5px] leading-relaxed text-slate-500 sm:text-right dark:text-zinc-400">
                            <p className="font-semibold text-slate-700 dark:text-zinc-300">
                                Divisi Kepatuhan Etika Profesi &amp; Manajemen
                                Risiko
                            </p>
                            <p>
                                Gedung Equity Tower Lt. 28, SCBD Kav. 52-53,
                                Jakarta Selatan
                            </p>
                            <p className="font-mono">
                                No. Verifikasi: CC-RPK-{conflictCheck.id}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Certificate Title & Status Badge */}
                <div className="my-8 text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-mono text-[10px] font-bold text-slate-700 uppercase dark:bg-white/10 dark:text-zinc-300">
                        <FileCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                        FORMULIR KEPATUHAN ETIKA NOMOR: CC/
                        {new Date(conflictCheck.created_at).getFullYear()}/
                        {conflictCheck.id.slice(0, 8).toUpperCase()}
                    </span>

                    <h2 className="mt-3 font-serif text-xl font-bold tracking-tight text-slate-900 uppercase sm:text-2xl dark:text-white">
                        SURAT KETERANGAN PEMERIKSAAN BENTURAN KEPENTINGAN
                    </h2>
                    <p className="mt-1 font-sans text-xs tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                        CERTIFICATE OF CONFLICT OF INTEREST CLEARANCE
                    </p>

                    {/* Result Status Banner */}
                    <div className="mt-5 inline-flex flex-col items-center justify-center">
                        <div
                            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2 font-mono text-sm font-bold uppercase shadow-2xs ${
                                isClear
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                                    : isWaived
                                      ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                                      : 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                            }`}
                        >
                            {isClear ? (
                                <CheckCircle2 className="size-4 text-emerald-600" />
                            ) : isWaived ? (
                                <ShieldCheck className="size-4 text-amber-600" />
                            ) : (
                                <ShieldAlert className="size-4 text-rose-600" />
                            )}
                            <span>
                                {isClear
                                    ? 'STATUS: BEBAS BENTURAN KEPENTINGAN (CLEAR)'
                                    : isWaived
                                      ? 'STATUS: WAIVER DISETUJUI PARTNER (WAIVED)'
                                      : 'STATUS: DITOLAK KARENA BENTURAN (BLOCKED)'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Certificate Preamble & Summary Box */}
                <div className="space-y-6 text-xs text-slate-700 leading-relaxed dark:text-zinc-300">
                    <p>
                        Berdasarkan ketentuan Kode Etik Advokat Indonesia (KEAI)
                        serta Standar Kepatuhan Independensi Firma Hukum Roni,
                        Putra &amp; Kusuma (RPK Law Office), telah dilakukan
                        penelusuran menyeluruh (*Comprehensive Conflict of
                        Interest Scan*) terhadap basis data klien aktif, klien
                        terdahulu, pihak lawan (*adverse parties*), kuasa hukum
                        lawan, saksi, dan afiliasi korporasi dengan rincian
                        sebagai berikut:
                    </p>

                    {/* Metadata Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 dark:border-white/10 dark:bg-[#121418]">
                        <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-white/10">
                            {/* Column 1 */}
                            <div className="space-y-2.5 p-4">
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-500">
                                        SUBJEK / NAMA UTAMA DIPERIKSA
                                    </span>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {conflictCheck.subject_name}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-500">
                                        SELURUH PIHAK YANG DITELUSURI
                                    </span>
                                    <span className="font-mono text-slate-800 dark:text-zinc-200">
                                        {conflictCheck.searched_names.join(
                                            ', ',
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-500">
                                        PERKARA HUKUM TERKAIT
                                    </span>
                                    <span className="text-slate-800 dark:text-zinc-200">
                                        {conflictCheck.matter ? (
                                            <>
                                                <strong className="font-mono">
                                                    {
                                                        conflictCheck.matter
                                                            .matter_number
                                                    }
                                                </strong>{' '}
                                                — {conflictCheck.matter.title}
                                            </>
                                        ) : (
                                            'Pemeriksaan Pra-Perkara / Calon Klien Baru'
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-2.5 p-4">
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-500">
                                        TANGGAL &amp; WAKTU PEMERIKSAAN
                                    </span>
                                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                                        {formatDate(
                                            conflictCheck.created_at,
                                            true,
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-500">
                                        MASA BERLAKU SERTIFIKAT
                                    </span>
                                    <span className="font-mono text-slate-800 dark:text-zinc-200">
                                        {conflictCheck.expires_at
                                            ? formatDate(
                                                  conflictCheck.expires_at,
                                              )
                                            : '30 Hari sejak penerbitan'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-500">
                                        PEMOHON PEMERIKSAAN (REQUESTER)
                                    </span>
                                    <span className="text-slate-800 dark:text-zinc-200">
                                        {conflictCheck.requester?.name ??
                                            'Advokat RPK'}{' '}
                                        {conflictCheck.requester?.position_title
                                            ? `(${conflictCheck.requester.position_title})`
                                            : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Match Breakdown Table (if matches found) */}
                    {conflictCheck.matches &&
                    conflictCheck.matches.length > 0 ? (
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-slate-900 uppercase dark:text-white">
                                Hasil Temuan Penelusuran Database (
                                {conflictCheck.matches.length} Temuan):
                            </h3>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
                                <table className="w-full text-left text-[11px]">
                                    <thead className="border-b border-slate-200 bg-slate-100/80 font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300">
                                        <tr>
                                            <th className="p-2.5">
                                                Nama Entitas / Pihak
                                            </th>
                                            <th className="p-2.5">
                                                Peran &amp; Kategori Hubungan
                                            </th>
                                            <th className="p-2.5">
                                                Tingkat Kemiripan
                                            </th>
                                            <th className="p-2.5">
                                                Tingkat Risiko
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                        {conflictCheck.matches.map(
                                            (match, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                >
                                                    <td className="p-2.5 font-semibold text-slate-900 dark:text-white">
                                                        {match.name}
                                                        {match.details && (
                                                            <p className="mt-0.5 text-[10px] font-normal text-slate-500 dark:text-zinc-400">
                                                                {match.details}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td className="p-2.5">
                                                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-white/10 dark:text-zinc-300">
                                                            {match.role_label ??
                                                                match.type}
                                                        </span>
                                                    </td>
                                                    <td className="p-2.5 font-mono font-bold">
                                                        {match.similarity}%
                                                    </td>
                                                    <td className="p-2.5">
                                                        <span
                                                            className={`rounded px-1.5 py-0.5 font-mono text-[9.5px] font-bold uppercase ${
                                                                match.risk ===
                                                                'blocked'
                                                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                                            }`}
                                                        >
                                                            {match.risk ===
                                                            'blocked'
                                                                ? 'Benturan Langsung'
                                                                : 'Potensi Benturan'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200">
                            <div className="flex items-center gap-2 font-bold">
                                <CheckCircle2 className="size-4 text-emerald-600" />
                                <span>
                                    Nihil Benturan Kepentingan (Zero Matches
                                    Found)
                                </span>
                            </div>
                            <p className="mt-1 text-[11px] opacity-90">
                                Tidak ditemukan adanya irisan atau kesamaan nama
                                pihak dengan klien aktif, mantan klien, maupun
                                pihak lawan pada seluruh perkara yang sedang atau
                                pernah ditangani oleh RPK Law Office.
                            </p>
                        </div>
                    )}

                    {/* 5. Partner Decision & Ethical Justification Note */}
                    {conflictCheck.decision_note && (
                        <div className="rounded-xl border border-amber-200/90 bg-amber-50/60 p-4 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                            <h4 className="font-bold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-400">
                                CATATAN &amp; JUSTIFIKASI ETIK MANAGING PARTNER:
                            </h4>
                            <p className="mt-1 whitespace-pre-line text-xs leading-relaxed">
                                "{conflictCheck.decision_note}"
                            </p>
                            {conflictCheck.reviewer && (
                                <p className="mt-2 text-[10.5px] font-semibold text-amber-900/80 dark:text-amber-300/80">
                                    Disetujui oleh:{' '}
                                    {conflictCheck.reviewer.name} (
                                    {conflictCheck.reviewer.position_title ??
                                        'Partner'}
                                    ) pada{' '}
                                    {conflictCheck.reviewed_at
                                        ? formatDate(
                                              conflictCheck.reviewed_at,
                                              true,
                                          )
                                        : '-'}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* 6. Official Signatures & Verification Badge */}
                <div className="mt-12 border-t border-slate-200 pt-6 dark:border-white/10">
                    <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
                        {/* Digital Verification Info */}
                        <div className="space-y-1 text-[10.5px] text-slate-500 dark:text-zinc-400">
                            <div className="flex items-center gap-2">
                                <QrCode className="size-8 text-slate-800 dark:text-zinc-200" />
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white">
                                        Dokumen Sah Terverifikasi Elektronik
                                    </p>
                                    <p className="font-mono text-[9.5px]">
                                        SHA-256 ID: {conflictCheck.id}
                                    </p>
                                </div>
                            </div>
                            <p className="pt-2 text-[10px] text-slate-400">
                                Diterbitkan secara resmi oleh RPK Law Office
                                Management System.
                            </p>
                        </div>

                        {/* Partner Sign-off Box */}
                        <div className="min-w-[220px] text-center sm:text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase dark:text-zinc-500">
                                Jakarta,{' '}
                                {formatDate(
                                    conflictCheck.reviewed_at ??
                                        conflictCheck.created_at,
                                )}
                            </p>
                            <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white">
                                RPK LAW OFFICE
                            </p>
                            <div className="my-3 flex justify-center sm:justify-end">
                                <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1 font-mono text-[10px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                    <UserCheck className="size-3.5" />
                                    ETHICALLY APPROVED
                                </div>
                            </div>
                            <p className="font-bold text-slate-900 underline dark:text-white">
                                {conflictCheck.reviewer?.name ??
                                    'Managing Partner'}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                                {conflictCheck.reviewer?.position_title ??
                                    'Managing Partner & Legal Ethics Officer'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
