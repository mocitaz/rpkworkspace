import { Form, Head, usePage } from '@inertiajs/react';
import {
    Bold,
    CheckCircle2,
    Clock3,
    FileText,
    Inbox,
    Italic,
    List,
    Mail,
    Quote,
    Search,
    Send,
    XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EmailCorrespondenceHero } from '@/components/email-correspondence-hero';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import * as emailRoutes from '@/routes/email';
import type { Auth } from '@/types/auth';

type Status = 'draft' | 'queued' | 'sent' | 'failed';
type Message = {
    id: string;
    subject: string;
    to_addresses: string[];
    status: Status;
    created_at: string;
    sent_at?: string | null;
    matter?: { matter_number: string; title: string } | null;
};
type Matter = { id: string; matter_number: string; title: string };
type Client = { id: string; display_name: string };

const quickTemplates = [
    {
        label: 'Surat Pengantar Berkas',
        subject: 'Penyampaian Dokumen dan Berkas Resmi Perkara',
        body: `Yth. Rekan Sejawat / Klien,

Bersama surat resmi ini, kami menyampaikan dokumen sehubungan dengan penanganan perkara untuk dipelajari dan ditindaklanjuti:

1. [Nama Dokumen / Berkas Perkara 1]
2. [Salinan Akta / Perjanjian Terkait]

Mohon tanda terima dan konfirmasi setelah seluruh dokumen diterima dengan lengkap. Apabila memerlukan koordinasi lebih lanjut, tim kami siap berkomunikasi.

Demikian kami sampaikan, atas perhatian dan kerja samanya kami ucapkan terima kasih.`,
    },
    {
        label: 'Jadwal Persidangan',
        subject: 'Pemberitahuan Agenda dan Jadwal Sidang Perkara',
        body: `Yth. Bapak/Ibu Klien,

Sehubungan dengan perkembangan penanganan perkara di pengadilan, kami informasikan bahwa persidangan berikutnya telah dijadwalkan sebagai berikut:

Hari / Tanggal : [Hari, Tanggal]
Waktu          : [Waktu] WIB
Tempat         : Pengadilan [Negeri / Tata Usaha Negara / Agama / Niaga]
Agenda Sidang  : [Pemeriksaan Saksi / Duplik / Pembuktian / Putusan]

Mohon konfirmasi kehadiran serta koordinasi materi persidangan bersama tim kuasa hukum selambatnya satu hari sebelum jadwal di atas.

Demikian pemberitahuan resmi ini kami sampaikan.`,
    },
    {
        label: 'Permintaan Dokumen',
        subject: 'Permohonan Kelengkapan Dokumen dan Alat Bukti Perkara',
        body: `Yth. Klien,

Dalam rangka penyusunan berkas pembuktian serta dokumen pendukung perkara yang sedang berjalan, kami mohon bantuan untuk melengkapi berkas-berkas berikut:

1. [Nama Dokumen / Kontrak / Akta Notaris]
2. [Bukti Transaksi / Rekening Koran Terkait]
3. [Korespondensi / Berkas Pendukung Lainnya]

Mohon berkas asli atau salinan legalisir dapat diserahkan kepada kantor hukum kami paling lambat pada [Hari, Tanggal].

Terima kasih atas kerja sama dan perhatiannya.`,
    },
    {
        label: 'Peringatan Hukum (Somasi)',
        subject: 'Peringatan Hukum (Somasi I) Terkait Kewajiban Prestasi',
        body: `Kepada Yth.,
[Nama Pihak Tertuju]
di Tempat

Bertindak untuk dan atas nama Klien kami berdasarkan Surat Kuasa Khusus, dengan ini kami menyampaikan Peringatan Hukum (Somasi) pertama sehubungan dengan pemenuhan kewajiban:

1. Bahwa berdasarkan perjanjian / bukti hukum yang ada, Saudara memiliki kewajiban untuk [Rincian Kewajiban].
2. Bahwa hingga surat ini diterbitkan, kewajiban tersebut belum diselesaikan sebagaimana mestinya.

Kami memberikan tenggat waktu 7 (tujuh) hari kalender sejak surat ini diterima untuk memenuhi kewajiban tersebut atau menghubungi kantor hukum kami guna penyelesaian secara musyawarah.

Apabila dalam batas waktu yang ditentukan tidak ada itikad baik, kami akan menempuh jalur hukum sesuai peraturan perundang-undangan yang berlaku demi melindungi hak hukum Klien kami.`,
    },
    {
        label: 'Konfirmasi Pembayaran',
        subject: 'Konfirmasi Penerimaan Pembayaran dan Rekapitulasi Tagihan Perkara',
        body: `Yth. Bapak/Ibu Klien,

Kami mengonfirmasi bahwa pembayaran terkait biaya honorarium / operasional penanganan perkara telah kami terima dengan baik pada [Tanggal Pembayaran].

Kuitansi dan bukti pencatatan resmi telah diterbitkan dalam sistem keuangan firma. Kami akan terus menyampaikan perkembangan penanganan perkara secara berkala.

Terima kasih atas kepercayaan yang diberikan kepada kantor hukum kami.`,
    },
];

const generateSignatureText = (name: string, title: string, address: string) => {
    return `\n\n--\n${name}\n${title}\nRPK Law Office & Partners\nJl. Bukit Nirwana VII, Blok CC.04, Sariwangi, Bandung Barat\nTel: 0852 9560 1417 | Email: ${address} | Web: www.rpklawoffice.com\n\n[CONFIDENTIALITY NOTICE / ATTORNEY-CLIENT PRIVILEGE]\nKorespondensi elektronik ini beserta lampirannya bersifat rahasia dan dilindungi hak istimewa hukum kerahasiaan profesi advokat berdasarkan UU No. 18 Tahun 2003 tentang Advokat. Apabila Anda bukan penerima yang sah, dilarang menyalin, mendistribusikan, atau memanfaatkan isi pesan ini. Mohon segera beritahukan pengirim dan hapus pesan ini dari seluruh sistem Anda.`;
};

const meta: Record<
    Status,
    { label: string; color: string; icon: typeof Mail }
> = {
    sent: {
        label: 'Terkirim',
        color: 'text-emerald-600 dark:text-emerald-400',
        icon: CheckCircle2,
    },
    queued: {
        label: 'Dalam antrean',
        color: 'text-blue-600 dark:text-blue-400',
        icon: Clock3,
    },
    draft: {
        label: 'Draft',
        color: 'text-amber-600 dark:text-amber-400',
        icon: FileText,
    },
    failed: {
        label: 'Gagal',
        color: 'text-rose-600 dark:text-rose-400',
        icon: XCircle,
    },
};

const formatDate = (value: string) =>
    new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta',
    }).format(new Date(value));

export default function EmailIndex({
    messages,
    matters,
    clients,
    fromAddress,
    canSend,
}: {
    messages: Message[];
    matters: Matter[];
    clients: Client[];
    fromAddress: string;
    canSend: boolean;
}) {
    const page = usePage<{ auth?: Auth }>();
    const currentUser = page.props?.auth?.user;

    const [tab, setTab] = useState<'all' | Status>('all');
    const [search, setSearch] = useState('');
    const [composerOpen, setComposerOpen] = useState(false);

    // Form field states
    const [toText, setToText] = useState('');
    const [ccText, setCcText] = useState('');
    const [bccText, setBccText] = useState('');
    const [subjectText, setSubjectText] = useState('');
    const [bodyText, setBodyText] = useState('');
    const [matterId, setMatterId] = useState('');
    const [clientId, setClientId] = useState('');
    const [showCcBcc, setShowCcBcc] = useState(false);

    // Official email signature states
    const [includeSignature, setIncludeSignature] = useState(true);
    const [signerName, setSignerName] = useState(
        currentUser?.name || 'Tim Advokat & Konsultan Hukum',
    );
    const [signerTitle, setSignerTitle] = useState(
        currentUser?.position_title || 'Advokat & Konsultan Hukum',
    );
    const [isEditingSigner, setIsEditingSigner] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (currentUser?.name && signerName === 'Tim Advokat & Konsultan Hukum') {
            setSignerName(currentUser.name);
        }
        if (
            currentUser?.position_title &&
            signerTitle === 'Advokat & Konsultan Hukum'
        ) {
            setSignerTitle(currentUser.position_title);
        }
    }, [currentUser]);

    const resetComposer = () => {
        setToText('');
        setCcText('');
        setBccText('');
        setSubjectText('');
        setBodyText('');
        setMatterId('');
        setClientId('');
        setShowCcBcc(false);
        setIsEditingSigner(false);
    };

    const applyTemplate = (tpl: { subject: string; body: string }) => {
        setSubjectText(tpl.subject);
        setBodyText(tpl.body);
    };

    const insertFormatting = (prefix: string, suffix: string = '') => {
        const el = textareaRef.current;
        if (!el) {
            setBodyText((prev) => `${prev}${prefix}teks${suffix}`);
            return;
        }
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = bodyText.substring(start, end);
        const replacement = selected
            ? `${prefix}${selected}${suffix}`
            : `${prefix}teks${suffix}`;
        const newText =
            bodyText.substring(0, start) + replacement + bodyText.substring(end);
        setBodyText(newText);
        setTimeout(() => {
            el.focus();
            el.setSelectionRange(
                start + prefix.length,
                start + replacement.length - suffix.length,
            );
        }, 0);
    };

    const insertSnippet = (snippet: string) => {
        const el = textareaRef.current;
        if (!el) {
            setBodyText((prev) => prev + snippet);
            return;
        }
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newText =
            bodyText.substring(0, start) + snippet + bodyText.substring(end);
        setBodyText(newText);
        setTimeout(() => {
            el.focus();
            el.setSelectionRange(
                start + snippet.length,
                start + snippet.length,
            );
        }, 0);
    };

    const insertDynamicToken = (type: 'client' | 'matter' | 'date') => {
        if (type === 'client') {
            const foundClient = clients.find((c) => c.id === clientId);
            insertSnippet(foundClient ? foundClient.display_name : '[Nama Klien]');
        } else if (type === 'matter') {
            const foundMatter = matters.find((m) => m.id === matterId);
            insertSnippet(
                foundMatter
                    ? `${foundMatter.matter_number} (${foundMatter.title})`
                    : '[Nomor Perkara]',
            );
        } else if (type === 'date') {
            const todayStr = new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'long',
            }).format(new Date());
            insertSnippet(todayStr);
        }
    };

    const finalBody = useMemo(() => {
        if (!bodyText.trim()) {
            return '';
        }
        if (!includeSignature) {
            return bodyText;
        }
        return `${bodyText.trim()}\n\n--SIGNATURE--\nname: ${signerName}\ntitle: ${signerTitle}`;
    }, [bodyText, includeSignature, signerName, signerTitle]);

    const wordCount = useMemo(() => {
        const words = bodyText.trim().split(/\s+/).filter(Boolean);
        return words.length;
    }, [bodyText]);

    const counts = useMemo(
        () => ({
            all: messages.length,
            sent: messages.filter((m) => m.status === 'sent').length,
            queued: messages.filter((m) => m.status === 'queued').length,
            draft: messages.filter((m) => m.status === 'draft').length,
            failed: messages.filter((m) => m.status === 'failed').length,
        }),
        [messages],
    );

    const visible = useMemo(
        () =>
            messages.filter((message) => {
                const query = search.trim().toLowerCase();
                return (
                    (tab === 'all' || message.status === tab) &&
                    (query === '' ||
                        message.subject.toLowerCase().includes(query) ||
                        message.to_addresses
                            .join(' ')
                            .toLowerCase()
                            .includes(query) ||
                        message.matter?.matter_number
                            .toLowerCase()
                            .includes(query) ||
                        message.matter?.title.toLowerCase().includes(query))
                );
            }),
        [messages, search, tab],
    );

    const tabs = [
        ['all', 'Semua Email'],
        ['sent', 'Terkirim'],
        ['queued', 'Antrean'],
        ['draft', 'Draft'],
        ['failed', 'Gagal'],
    ] as const;

    return (
        <>
            <Head title="Email Workspace" />
            <div className="min-h-screen bg-[#fafafc] pb-24 md:pb-10 dark:bg-[#0c0d10]">
                <main className="w-full space-y-5 px-4 pt-2.5 pb-8 sm:px-6 sm:pt-3.5 lg:px-8">
                    <EmailCorrespondenceHero
                        totalEmails={counts.all}
                        sentEmails={counts.sent}
                        queuedEmails={counts.queued}
                        draftEmails={counts.draft}
                        canSend={canSend}
                        onCompose={() => setComposerOpen(true)}
                    />

                    <section className="min-h-[430px] overflow-hidden rounded-[18px] border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.035)] dark:border-white/[0.08] dark:bg-[#14161b]">
                        <div className="border-b border-slate-100 px-5 pt-4 sm:px-6 dark:border-white/[0.06]">
                            <div className="flex gap-5 overflow-x-auto">
                                {tabs.map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setTab(key)}
                                        className={`shrink-0 border-b-2 px-0.5 pb-3 text-[11px] font-semibold transition-colors ${tab === key ? 'border-slate-950 text-slate-950 dark:border-white dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400'}`}
                                    >
                                        {label} · {counts[key]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/[0.06]">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
                                    Register Email
                                </h2>
                                <p className="mt-0.5 text-[10px] text-slate-400">
                                    Riwayat komunikasi yang dibuat melalui workspace.
                                </p>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Cari subjek atau penerima"
                                    className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-8 pr-3 text-[11px] text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                                />
                            </div>
                        </div>
                        {visible.length === 0 ? (
                            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-14 text-center">
                                <div className="flex size-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400 dark:border-white/10 dark:bg-white/[0.04]">
                                    <Inbox className="size-5" />
                                </div>
                                <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-zinc-100">
                                    Belum ada email
                                </p>
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Email pada kategori ini akan tampil di sini.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                                {visible.map((message) => {
                                    const status = meta[message.status];
                                    const StatusIcon = status.icon;
                                    return (
                                        <article
                                            key={message.id}
                                            className="group grid gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/70 sm:grid-cols-[minmax(0,1fr)_180px_165px] sm:items-center sm:px-6 dark:hover:bg-white/[0.025]"
                                        >
                                            <div className="flex min-w-0 items-start gap-3.5">
                                                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/[0.04]">
                                                    <Mail className="size-3.5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-[12px] font-semibold text-slate-950 dark:text-white">
                                                        {message.subject}
                                                    </h3>
                                                    <p className="mt-1 truncate text-[10.5px] text-slate-500">
                                                        Kepada{' '}
                                                        {message.to_addresses.join(
                                                            ', ',
                                                        )}
                                                    </p>
                                                    {message.matter && (
                                                        <p className="mt-1 truncate text-[9.5px] text-slate-400">
                                                            {
                                                                message.matter
                                                                    .matter_number
                                                            }{' '}
                                                            ·{' '}
                                                            {
                                                                message.matter
                                                                    .title
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <StatusIcon
                                                    className={`size-3.5 ${status.color}`}
                                                />
                                                <span
                                                    className={`text-[10px] font-semibold ${status.color}`}
                                                >
                                                    {status.label}
                                                </span>
                                            </div>
                                            <time className="text-[10px] text-slate-400 sm:text-right">
                                                {formatDate(
                                                    message.sent_at ??
                                                        message.created_at,
                                                )}{' '}
                                                WIB
                                            </time>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* Clean Gmail-Style Compose Dialog with Governance/Finance standard header */}
            <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
                <DialogContent className="flex h-[88vh] max-h-[88vh] w-[95vw] sm:max-w-4xl flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                    {/* Header: Neutral & Matching Governance Dialog Header */}
                    <DialogHeader className="shrink-0 border-b border-slate-100 bg-slate-50/60 px-5 py-3 text-left sm:px-6 dark:border-white/[0.06] dark:bg-white/[0.025]">
                        <div className="grid min-h-9 grid-cols-[36px_minmax(0,1fr)] items-center gap-3 pr-6">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
                                <Mail className="size-4.5" strokeWidth={1.8} />
                            </div>
                            <div className="min-w-0 self-center">
                                <DialogTitle className="text-sm leading-5 font-semibold text-slate-950 sm:text-base dark:text-white">
                                    Tulis Pesan Baru
                                </DialogTitle>
                                <p className="truncate text-[11px] leading-4 text-slate-500 dark:text-zinc-400">
                                    Dari: {signerName ? `${signerName} (${fromAddress})` : fromAddress} &bull; Tercatat pada register korespondensi
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Form Component */}
                    <Form
                        {...emailRoutes.store.form()}
                        className="flex min-h-0 flex-1 flex-col overflow-hidden"
                        onSuccess={() => {
                            setComposerOpen(false);
                            resetComposer();
                        }}
                        resetOnSuccess
                    >
                        {({ errors, processing }) => {
                            const isCcBccVisible =
                                showCcBcc ||
                                Boolean(
                                    ccText ||
                                        bccText ||
                                        errors.cc ||
                                        errors.bcc,
                                );

                            return (
                                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                                    {/* Scrollable Middle Body */}
                                    <div className="min-h-0 flex-1 flex flex-col overflow-y-auto">
                                        {/* Error Alert */}
                                        {Object.keys(errors).length > 0 && (
                                            <div
                                                role="alert"
                                                className="mx-5 mt-3 rounded-lg border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800 sm:mx-6 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
                                            >
                                                <p className="font-semibold">
                                                    Periksa kembali data pengiriman:
                                                </p>
                                                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px]">
                                                    {Object.entries(errors).map(
                                                        ([key, message]) => (
                                                            <li key={key}>
                                                                {message}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {/* GMAIL-STYLE SEAMLESS ENVELOPE FIELDS */}
                                        {/* Row 1: Kepada */}
                                        <div className="flex items-center border-b border-slate-100 px-5 py-2 sm:px-6 dark:border-white/[0.06]">
                                            <span className="w-16 shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500">
                                                Kepada
                                            </span>
                                            <input
                                                name="to"
                                                value={toText}
                                                onChange={(e) =>
                                                    setToText(e.target.value)
                                                }
                                                placeholder="Penerima (pisahkan koma jika lebih dari satu)"
                                                className="h-8 w-full border-0 bg-transparent p-0 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-zinc-500"
                                                required
                                            />
                                            <div className="flex shrink-0 items-center gap-1 pl-2">
                                                {!isCcBccVisible && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowCcBcc(true)
                                                        }
                                                        className="cursor-pointer text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
                                                    >
                                                        Cc / Bcc
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="px-5 sm:px-6">
                                            <InputError message={errors.to} />
                                        </div>

                                        {/* Collapsible CC & BCC */}
                                        {isCcBccVisible && (
                                            <>
                                                <div className="flex items-center border-b border-slate-100 px-5 py-1.5 sm:px-6 dark:border-white/[0.06]">
                                                    <span className="w-16 shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500">
                                                        Cc
                                                    </span>
                                                    <input
                                                        name="cc"
                                                        value={ccText}
                                                        onChange={(e) =>
                                                            setCcText(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Salinan (Cc)"
                                                        className="h-7 w-full border-0 bg-transparent p-0 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-zinc-500"
                                                    />
                                                </div>
                                                <div className="flex items-center border-b border-slate-100 px-5 py-1.5 sm:px-6 dark:border-white/[0.06]">
                                                    <span className="w-16 shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500">
                                                        Bcc
                                                    </span>
                                                    <input
                                                        name="bcc"
                                                        value={bccText}
                                                        onChange={(e) =>
                                                            setBccText(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Salinan rahasia (Bcc)"
                                                        className="h-7 w-full border-0 bg-transparent p-0 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-zinc-500"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Context Link Row: Perkara & Klien */}
                                        <div className="grid grid-cols-1 border-b border-slate-100 px-5 py-2 sm:grid-cols-2 sm:gap-4 sm:px-6 dark:border-white/[0.06]">
                                            <div className="flex items-center">
                                                <span className="w-16 shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500">
                                                    Perkara
                                                </span>
                                                <select
                                                    name="matter_id"
                                                    value={matterId}
                                                    onChange={(e) =>
                                                        setMatterId(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-7 w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-xs text-slate-700 outline-none focus:ring-0 dark:text-zinc-200"
                                                >
                                                    <option value="">
                                                        -- Tidak dikaitkan perkara --
                                                    </option>
                                                    {matters.map((m) => (
                                                        <option
                                                            key={m.id}
                                                            value={m.id}
                                                        >
                                                            {m.matter_number} ·{' '}
                                                            {m.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center pt-1 sm:pt-0">
                                                <span className="w-16 shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500">
                                                    Klien
                                                </span>
                                                <select
                                                    name="client_id"
                                                    value={clientId}
                                                    onChange={(e) =>
                                                        setClientId(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-7 w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-xs text-slate-700 outline-none focus:ring-0 dark:text-zinc-200"
                                                >
                                                    <option value="">
                                                        -- Tidak dikaitkan klien --
                                                    </option>
                                                    {clients.map((c) => (
                                                        <option
                                                            key={c.id}
                                                            value={c.id}
                                                        >
                                                            {c.display_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Subjek Row */}
                                        <div className="flex items-center border-b border-slate-100 px-5 py-2.5 sm:px-6 dark:border-white/[0.06]">
                                            <span className="w-16 shrink-0 text-xs font-medium text-slate-400 dark:text-zinc-500">
                                                Subjek
                                            </span>
                                            <input
                                                name="subject"
                                                value={subjectText}
                                                onChange={(e) =>
                                                    setSubjectText(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Subjek email..."
                                                className="h-8 w-full border-0 bg-transparent p-0 text-xs font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-zinc-500"
                                                required
                                            />
                                        </div>
                                        <div className="px-5 sm:px-6">
                                            <InputError message={errors.subject} />
                                        </div>

                                        {/* GMAIL FORMATTING & TEMPLATE TOOLBAR */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-1.5 sm:px-6 dark:border-white/[0.04] dark:bg-white/[0.015]">
                                            <div className="flex flex-wrap items-center gap-1">
                                                <button
                                                    type="button"
                                                    title="Tebal (Bold)"
                                                    onClick={() =>
                                                        insertFormatting(
                                                            '**',
                                                            '**',
                                                        )
                                                    }
                                                    className="flex size-7 items-center justify-center rounded text-xs font-bold text-slate-600 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-white/10"
                                                >
                                                    <Bold className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Miring (Italic)"
                                                    onClick={() =>
                                                        insertFormatting(
                                                            '*',
                                                            '*',
                                                        )
                                                    }
                                                    className="flex size-7 items-center justify-center rounded text-xs italic text-slate-600 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-white/10"
                                                >
                                                    <Italic className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Poin Daftar"
                                                    onClick={() =>
                                                        insertSnippet('\n• ')
                                                    }
                                                    className="flex size-7 items-center justify-center rounded text-slate-600 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-white/10"
                                                >
                                                    <List className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Kutipan Hukum"
                                                    onClick={() =>
                                                        insertSnippet('\n> ')
                                                    }
                                                    className="flex size-7 items-center justify-center rounded text-slate-600 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-white/10"
                                                >
                                                    <Quote className="size-3.5" />
                                                </button>

                                                <span className="mx-1 h-3.5 w-px bg-slate-200 dark:bg-white/10" />

                                                {/* Template Dropdown */}
                                                <select
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target.value;
                                                        const tpl =
                                                            quickTemplates.find(
                                                                (t) =>
                                                                    t.label ===
                                                                    val,
                                                            );
                                                        if (tpl) {
                                                            applyTemplate(tpl);
                                                        }
                                                        e.target.value = '';
                                                    }}
                                                    defaultValue=""
                                                    className="h-6.5 cursor-pointer rounded border border-slate-200 bg-white px-2 text-[11px] text-slate-600 outline-none hover:border-slate-300 dark:border-white/10 dark:bg-[#16181f] dark:text-zinc-300"
                                                >
                                                    <option
                                                        value=""
                                                        disabled
                                                    >
                                                        Template surat...
                                                    </option>
                                                    {quickTemplates.map(
                                                        (tpl) => (
                                                            <option
                                                                key={tpl.label}
                                                                value={
                                                                    tpl.label
                                                                }
                                                            >
                                                                {tpl.label}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>

                                                {/* Quick Dynamic Tokens */}
                                                <div className="hidden items-center gap-1 sm:flex">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            insertDynamicToken(
                                                                'client',
                                                            )
                                                        }
                                                        className="h-6 rounded px-1.5 text-[10.5px] font-medium text-slate-500 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-white/10"
                                                    >
                                                        + Klien
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            insertDynamicToken(
                                                                'matter',
                                                            )
                                                        }
                                                        className="h-6 rounded px-1.5 text-[10.5px] font-medium text-slate-500 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-white/10"
                                                    >
                                                        + Perkara
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            insertDynamicToken(
                                                                'date',
                                                            )
                                                        }
                                                        className="h-6 rounded px-1.5 text-[10.5px] font-medium text-slate-500 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-white/10"
                                                    >
                                                        + Tanggal
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                {wordCount} kata &bull;{' '}
                                                {bodyText.length} karakter
                                            </div>
                                        </div>

                                        {/* CLEAN WRITING CANVAS */}
                                        <textarea
                                            ref={textareaRef}
                                            value={bodyText}
                                            onChange={(e) =>
                                                setBodyText(e.target.value)
                                            }
                                            placeholder="Tulis pesan resmi Anda di sini..."
                                            className="min-h-[220px] w-full flex-1 resize-none border-0 bg-transparent px-5 py-4 text-xs leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-zinc-200 dark:placeholder:text-zinc-500"
                                            required
                                        />
                                        <div className="px-5 sm:px-6">
                                            <InputError message={errors.body} />
                                        </div>

                                        {/* OFFICIAL LEGAL SIGNATURE & DISCLAIMER BLOCK */}
                                        <div className="border-t border-slate-100 bg-slate-50/30 px-5 py-3 sm:px-6 dark:border-white/[0.04] dark:bg-white/[0.01]">
                                            <div className="flex items-center justify-between">
                                                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600 select-none dark:text-zinc-400">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            includeSignature
                                                        }
                                                        onChange={(e) =>
                                                            setIncludeSignature(
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        className="size-3.5 rounded border-slate-300 text-slate-900 focus:ring-0 dark:border-white/20 dark:bg-[#16181f]"
                                                    />
                                                    <span>
                                                        Sertakan tanda tangan &amp; disclaimer resmi firma
                                                    </span>
                                                </label>

                                                {includeSignature && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setIsEditingSigner(
                                                                !isEditingSigner,
                                                            )
                                                        }
                                                        className="cursor-pointer text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white"
                                                    >
                                                        {isEditingSigner
                                                            ? 'Selesai'
                                                            : 'Ubah Penandatangan'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Expandable Signer Name & Title Editor */}
                                            {includeSignature &&
                                                isEditingSigner && (
                                                    <div className="mt-2.5 grid grid-cols-1 gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 sm:grid-cols-2 dark:border-white/10 dark:bg-[#16181f]">
                                                        <div>
                                                            <span className="text-[10px] font-medium text-slate-500">
                                                                Nama Penandatangan
                                                            </span>
                                                            <input
                                                                value={
                                                                    signerName
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    setSignerName(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Nama Advokat"
                                                                className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-900 dark:border-white/10 dark:bg-[#12141a] dark:text-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-medium text-slate-500">
                                                                Jabatan / Gelar
                                                            </span>
                                                            <input
                                                                value={
                                                                    signerTitle
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    setSignerTitle(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Advokat & Konsultan Hukum"
                                                                className="mt-0.5 h-7 w-full rounded border border-slate-200 bg-white px-2 text-xs text-slate-900 dark:border-white/10 dark:bg-[#12141a] dark:text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Understated Law Firm Signature Preview */}
                                            {includeSignature && (
                                                <div className="mt-2.5 border-l-2 border-slate-300 py-0.5 pl-3.5 text-xs text-slate-600 dark:border-zinc-700 dark:text-zinc-400">
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {signerName}
                                                    </p>
                                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                        {signerTitle} &bull; RPK Law Office &amp; Partners
                                                    </p>
                                                    <p className="mt-0.5 text-[10.5px] text-slate-400 dark:text-zinc-500">
                                                        Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi, Bandung Barat &bull; Tel: 0852 9560 1417 &bull; {fromAddress}
                                                    </p>
                                                    <p className="mt-1.5 text-[10px] leading-relaxed text-slate-400/90 dark:text-zinc-500">
                                                        <strong className="font-medium text-slate-500 dark:text-zinc-400">
                                                            CONFIDENTIALITY NOTICE:
                                                        </strong>{' '}
                                                        Transmisi email ini bersifat rahasia dan dilindungi hak istimewa hukum kerahasiaan profesi advokat (Attorney-Client Privilege - UU No. 18/2003). Jika Anda bukan penerima yang sah, mohon beritahukan pengirim dan hapus pesan ini.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Hidden input to pass complete generated body with legal footer */}
                                        <input
                                            type="hidden"
                                            name="body"
                                            value={finalBody}
                                        />
                                    </div>

                                    {/* Pinned Bottom Action Bar (Gmail Style) */}
                                    <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-white px-5 py-3 sm:px-6 dark:border-white/[0.06] dark:bg-[#14161b]">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-9 min-w-28 cursor-pointer gap-1.5 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                                            >
                                                <Send className="size-3.5" />
                                                {processing
                                                    ? 'Mengirim...'
                                                    : 'Kirim'}
                                            </Button>
                                            <Button
                                                type="submit"
                                                name="save_draft"
                                                value="1"
                                                variant="outline"
                                                disabled={processing}
                                                className="h-9 cursor-pointer rounded-lg border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/10"
                                            >
                                                Simpan Draft
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="hidden text-[11px] text-slate-400 sm:inline dark:text-zinc-500">
                                                Tercatat pada register perkara
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    setComposerOpen(false)
                                                }
                                                disabled={processing}
                                                className="h-8 cursor-pointer text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                                            >
                                                Batal
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}
