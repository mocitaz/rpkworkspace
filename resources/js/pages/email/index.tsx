import { Form, Head, usePage } from '@inertiajs/react';
import {
    Bold,
    ChevronRight,
    Inbox,
    Italic,
    List,
    Mail,
    Quote,
    Search,
    Send,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EmailCorrespondenceHero } from '@/components/email-correspondence-hero';
import { ConfirmDialog } from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useInitials } from '@/hooks/use-initials';
import * as emailRoutes from '@/routes/email';
import type { Auth } from '@/types/auth';

type Status = 'draft' | 'queued' | 'sent' | 'failed';
type Message = {
    id: string;
    subject: string;
    from_address: string;
    to_addresses: string[];
    cc_addresses?: string[] | null;
    bcc_addresses?: string[] | null;
    body: string;
    status: Status;
    created_at: string;
    sent_at?: string | null;
    failed_at?: string | null;
    error_message?: string | null;
    sender?: {
        id: string;
        name: string;
        email: string;
        position_title?: string | null;
        avatar_url?: string | null;
    } | null;
    matter?: { id?: string; matter_number: string; title: string } | null;
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
    {
        label: string;
        colorClass: string;
        borderClass: string;
    }
> = {
    sent: {
        label: 'Terkirim',
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        borderClass: 'border-l-emerald-500',
    },
    queued: {
        label: 'Dalam antrean',
        colorClass: 'text-blue-600 dark:text-blue-400',
        borderClass: 'border-l-blue-500',
    },
    draft: {
        label: 'Draft',
        colorClass: 'text-slate-600 dark:text-zinc-400',
        borderClass: 'border-l-slate-400 dark:border-l-zinc-500',
    },
    failed: {
        label: 'Gagal',
        colorClass: 'text-rose-600 dark:text-rose-400',
        borderClass: 'border-l-rose-500',
    },
};

const parseMessageBody = (rawBody: string) => {
    const parts = rawBody.split(/--SIGNATURE--/i);
    const mainBody = parts[0]?.trim() ?? rawBody;
    let sigName = '';
    let sigTitle = '';
    if (parts[1]) {
        const nameMatch = parts[1].match(/name:\s*(.+)/i);
        const titleMatch = parts[1].match(/title:\s*(.+)/i);
        if (nameMatch) sigName = nameMatch[1].trim();
        if (titleMatch) sigTitle = titleMatch[1].trim();
    }
    return { mainBody, sigName, sigTitle, hasSignature: Boolean(parts[1]) };
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
    const getInitials = useInitials();

    const [tab, setTab] = useState<'all' | Status>('all');
    const [search, setSearch] = useState('');
    const [composerOpen, setComposerOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

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

    // Confirmation dialog state
    const [confirmSendOpen, setConfirmSendOpen] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);

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
        setConfirmSendOpen(false);
    };

    const handleInitiateSend = (e: React.MouseEvent) => {
        e.preventDefault();

        const form = submitButtonRef.current?.form;
        if (form && !form.reportValidity()) {
            return;
        }

        if (!toText.trim() || !subjectText.trim() || !bodyText.trim()) {
            return;
        }

        setConfirmSendOpen(true);
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

                    {/* Email workspace tabs outside container (matching Tata Kelola) */}
                    <div className="flex [scrollbar-width:none] items-center gap-8 overflow-x-auto border-b border-slate-200/60 [-ms-overflow-style:none] dark:border-white/[0.06] [&::-webkit-scrollbar]:hidden">
                        {tabs.map(([key, label]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setTab(key)}
                                className={`relative shrink-0 border-b-2 px-1 pt-1 pb-2 text-[11px] font-semibold transition-colors ${
                                    tab === key
                                        ? 'border-slate-950 text-slate-950 dark:border-white dark:text-white'
                                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                                }`}
                            >
                                {label} · {counts[key]}
                            </button>
                        ))}
                    </div>

                    <section className="min-h-[430px] overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/[0.06]">
                            <div>
                                <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Register Korespondensi Email
                                </h2>
                                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                                    Riwayat komunikasi resmi, status antrean pengiriman, dan perkara terkait.
                                </p>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Cari subjek, penerima, atau perkara..."
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
                            <>
                                {/* Mobile Cards (sm:hidden) */}
                                <div className="divide-y divide-slate-100 sm:hidden dark:divide-white/[0.04]">
                                    {visible.map((message) => {
                                        const status = meta[message.status];
                                        return (
                                            <div
                                                key={message.id}
                                                onClick={() => setSelectedMessage(message)}
                                                className="block cursor-pointer p-3.5 transition-colors hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-white/[0.02]"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                            <span>
                                                                {message.matter?.matter_number ?? 'EMAIL'}
                                                            </span>
                                                            <span>·</span>
                                                            <span className="truncate">
                                                                {message.matter?.title ?? 'Korespondensi Umum'}
                                                            </span>
                                                        </div>
                                                        <p className="mt-0.5 line-clamp-2 text-xs font-bold text-slate-900 dark:text-white">
                                                            {message.subject}
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <Avatar className="size-5 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                <AvatarImage
                                                                    src={message.sender?.avatar_url ?? undefined}
                                                                    alt={message.sender?.name ?? 'Pengirim'}
                                                                />
                                                                <AvatarFallback className="text-[7px] font-bold">
                                                                    {getInitials(message.sender?.name ?? 'RPK')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="truncate text-[11px] font-medium text-slate-700 dark:text-zinc-200">
                                                                {message.sender?.name ?? 'Tim Advokat'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">&bull;</span>
                                                            <span className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                                                Kepada: {message.to_addresses.join(', ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="mt-1 size-4 shrink-0 text-slate-400" />
                                                </div>
                                                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5 border-t border-slate-100 pt-2 text-[11px] dark:border-white/[0.04]">
                                                    <span className={`font-semibold ${status.colorClass}`}>
                                                        {status.label}
                                                    </span>
                                                    <span className="font-mono text-[10.5px] text-slate-500 dark:text-zinc-400">
                                                        {formatDate(message.sent_at ?? message.created_at)} WIB
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop Data Table (hidden sm:block) */}
                                <div className="hidden overflow-x-auto sm:block">
                                    <table className="w-full table-fixed text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-semibold text-slate-500 uppercase dark:border-white/[0.04] dark:bg-[#121418]">
                                                <th className="w-[34%] py-2.5 pr-3 pl-4 font-semibold">
                                                    Subjek &amp; Perkara
                                                </th>
                                                <th className="w-[20%] px-3 py-2.5 font-semibold">
                                                    Penerima
                                                </th>
                                                <th className="w-[20%] px-3 py-2.5 font-semibold">
                                                    Pengirim
                                                </th>
                                                <th className="w-[11%] px-3 py-2.5 text-center font-semibold">
                                                    Status
                                                </th>
                                                <th className="w-[12%] px-3 py-2.5 text-center font-semibold">
                                                    Waktu
                                                </th>
                                                <th className="w-[3%] py-2.5 pr-4 pl-1 text-right font-semibold"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                                            {visible.map((message) => {
                                                const status = meta[message.status];
                                                return (
                                                    <tr
                                                        key={message.id}
                                                        onClick={() => setSelectedMessage(message)}
                                                        className="group cursor-pointer transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                                                    >
                                                        {/* 1. Subjek & Perkara */}
                                                        <td className="py-2.5 pr-3 pl-4">
                                                            <div className="min-w-0 space-y-0.5">
                                                                <p
                                                                    title={message.subject}
                                                                    className="truncate text-xs font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400"
                                                                >
                                                                    {message.subject}
                                                                </p>
                                                                <span className="block truncate font-mono text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                                                                    {message.matter ? `${message.matter.matter_number} · ${message.matter.title}` : 'Korespondensi Umum'}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        {/* 2. Penerima */}
                                                        <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                                                            <span
                                                                className="block max-w-[190px] truncate text-xs text-slate-700 dark:text-zinc-300"
                                                                title={message.to_addresses.join(', ')}
                                                            >
                                                                {message.to_addresses.join(', ')}
                                                            </span>
                                                        </td>

                                                        {/* 3. Pengirim with Profile Picture / Avatar */}
                                                        <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <Avatar className="size-6 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                                    <AvatarImage
                                                                        src={message.sender?.avatar_url ?? undefined}
                                                                        alt={message.sender?.name ?? 'Pengirim'}
                                                                    />
                                                                    <AvatarFallback className="text-[8px] font-bold">
                                                                        {getInitials(message.sender?.name ?? 'RPK')}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="min-w-0 flex-1 truncate">
                                                                    <p
                                                                        className="truncate text-xs font-semibold text-slate-900 dark:text-white"
                                                                        title={message.sender?.name ?? 'Tim Advokat'}
                                                                    >
                                                                        {message.sender?.name ?? 'Tim Advokat'}
                                                                    </p>
                                                                    <p className="truncate text-[10px] text-slate-400 dark:text-zinc-500">
                                                                        {message.sender?.position_title ?? message.from_address}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* 4. Status (text only, solid color) */}
                                                        <td className="px-3 py-2.5 text-center whitespace-nowrap">
                                                            <span className={`text-xs font-semibold ${status.colorClass}`}>
                                                                {status.label}
                                                            </span>
                                                        </td>

                                                        {/* 5. Waktu */}
                                                        <td className="px-3 py-2.5 text-center font-mono text-[11px] whitespace-nowrap text-slate-500 dark:text-zinc-400">
                                                            {formatDate(message.sent_at ?? message.created_at)}
                                                        </td>

                                                        {/* 6. Action Arrow */}
                                                        <td className="py-2.5 pr-4 pl-1 text-right whitespace-nowrap">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedMessage(message);
                                                                }}
                                                                className="inline-flex size-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/[0.06] dark:hover:text-white"
                                                            >
                                                                <ChevronRight className="size-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
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
                                                <div className="mt-3 border-t border-slate-200/80 pt-3 dark:border-white/10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-20 shrink-0 items-center justify-center rounded border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-zinc-900">
                                                            <img
                                                                src="/logo/raf-law-firm-transparent.png"
                                                                alt="RPK Law Firm"
                                                                className="max-h-full max-w-full object-contain"
                                                            />
                                                        </div>
                                                        <div className="min-w-0 border-l border-slate-200 pl-3 dark:border-white/10">
                                                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                                {signerName}
                                                            </p>
                                                            <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                                                {signerTitle}
                                                            </p>
                                                            <p className="text-[10px] font-semibold text-slate-700 dark:text-zinc-300">
                                                                RONI, PUTRA &amp; KUSUMAH LAW FIRM
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-[10.5px] leading-relaxed text-slate-500 dark:text-zinc-400">
                                                        <span className="font-medium text-slate-700 dark:text-zinc-300">Tel/WA:</span> 0852 9560 1417 &bull;{' '}
                                                        <span className="font-medium text-slate-700 dark:text-zinc-300">Email:</span> {fromAddress} &bull;{' '}
                                                        <span className="font-medium text-slate-700 dark:text-zinc-300">Web:</span> rpklawoffice.com
                                                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                            Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi, Bandung Barat
                                                        </p>
                                                    </div>
                                                    <p className="mt-2 border-t border-dashed border-slate-200 pt-1.5 text-[9.5px] leading-normal text-slate-400 dark:border-white/5 dark:text-zinc-500">
                                                        <strong className="font-medium text-slate-500 dark:text-zinc-400">
                                                            KERAHASIAAN PROFESI ADVOKAT (ATTORNEY-CLIENT PRIVILEGE):
                                                        </strong>{' '}
                                                        Surat elektronik ini bersifat rahasia dan dilindungi hak istimewa hukum kerahasiaan profesi advokat (Pasal 19 UU No. 18/2003).
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
                                            {/* Hidden native submit button for programmatic submission */}
                                            <button
                                                ref={submitButtonRef}
                                                type="submit"
                                                className="hidden"
                                                tabIndex={-1}
                                                aria-hidden="true"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleInitiateSend}
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

            {/* Modal Konfirmasi Sebelum Pengiriman Email */}
            <ConfirmDialog
                open={confirmSendOpen}
                onOpenChange={setConfirmSendOpen}
                title="Kirim Korespondensi Resmi?"
                description="Pastikan tujuan dan rincian pesan resmi di bawah ini telah sesuai sebelum dikirimkan ke server antrean kantor hukum."
                confirmLabel="Ya, Kirim Sekarang"
                cancelLabel="Periksa Kembali"
                variant="info"
                onConfirm={() => {
                    setConfirmSendOpen(false);
                    setTimeout(() => {
                        submitButtonRef.current?.click();
                    }, 50);
                }}
            >
                <div className="space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs dark:border-white/10 dark:bg-white/[0.02]">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-2 dark:border-white/5">
                        <span className="shrink-0 text-slate-500 dark:text-zinc-400">
                            Pengirim
                        </span>
                        <span className="text-right font-medium text-slate-900 dark:text-white">
                            {signerName
                                ? `${signerName} (${fromAddress})`
                                : fromAddress}
                        </span>
                    </div>
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-2 dark:border-white/5">
                        <span className="shrink-0 text-slate-500 dark:text-zinc-400">
                            Penerima (To)
                        </span>
                        <span
                            className="max-w-[220px] truncate text-right font-medium text-slate-900 dark:text-white"
                            title={toText}
                        >
                            {toText}
                        </span>
                    </div>
                    {(ccText || bccText) && (
                        <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-2 dark:border-white/5">
                            <span className="shrink-0 text-slate-500 dark:text-zinc-400">
                                Cc / Bcc
                            </span>
                            <span className="max-w-[220px] truncate text-right text-slate-700 dark:text-zinc-300">
                                {[
                                    ccText && `Cc: ${ccText}`,
                                    bccText && `Bcc: ${bccText}`,
                                ]
                                    .filter(Boolean)
                                    .join(' | ')}
                            </span>
                        </div>
                    )}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-2 dark:border-white/5">
                        <span className="shrink-0 text-slate-500 dark:text-zinc-400">
                            Subjek
                        </span>
                        <span
                            className="max-w-[220px] truncate text-right font-semibold text-slate-900 dark:text-white"
                            title={subjectText}
                        >
                            {subjectText}
                        </span>
                    </div>
                    {matterId && (
                        <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-2 dark:border-white/5">
                            <span className="shrink-0 text-slate-500 dark:text-zinc-400">
                                Perkara
                            </span>
                            <span className="max-w-[220px] truncate text-right text-slate-700 dark:text-zinc-300">
                                {matters.find((m) => m.id === matterId)
                                    ?.matter_number}{' '}
                                &bull;{' '}
                                {matters.find((m) => m.id === matterId)?.title}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between gap-2 pt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                        <span>Tanda Tangan &amp; Disclaimer:</span>
                        <span
                            className={`font-semibold ${includeSignature ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`}
                        >
                            {includeSignature
                                ? 'Disertakan Resmi'
                                : 'Tidak Disertakan'}
                        </span>
                    </div>
                </div>
            </ConfirmDialog>

            {/* Modal Detail Isi Email */}
            <Dialog
                open={!!selectedMessage}
                onOpenChange={(open) => !open && setSelectedMessage(null)}
            >
                <DialogContent className="flex max-h-[90vh] w-[95vw] sm:max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                    {selectedMessage && (() => {
                        const status = meta[selectedMessage.status];
                        const { mainBody, sigName, sigTitle, hasSignature } = parseMessageBody(selectedMessage.body);

                        return (
                            <>
                                {/* Header */}
                                <DialogHeader className="shrink-0 border-b border-slate-100 bg-slate-50/70 px-5 py-4 text-left sm:px-6 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                    <div className="flex items-start justify-between gap-3 pr-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-semibold ${status.colorClass}`}>
                                                    {status.label}
                                                </span>
                                                {selectedMessage.matter && (
                                                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                                                        {selectedMessage.matter.matter_number}
                                                    </span>
                                                )}
                                            </div>
                                            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                                {selectedMessage.subject}
                                            </DialogTitle>
                                            <DialogDescription className="text-xs text-slate-500 dark:text-zinc-400">
                                                ID: <span className="font-mono text-[11px]">{selectedMessage.id}</span> &bull; Tercatat pada register korespondensi
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                {/* Scrollable Content */}
                                <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                                    {/* Meta summary card */}
                                    <div className="grid grid-cols-1 gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 text-xs sm:grid-cols-2 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                        <div className="flex items-center gap-2.5">
                                            <Avatar className="size-8 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                                <AvatarImage
                                                    src={selectedMessage.sender?.avatar_url ?? undefined}
                                                    alt={selectedMessage.sender?.name ?? 'Pengirim'}
                                                />
                                                <AvatarFallback className="text-xs font-bold">
                                                    {getInitials(selectedMessage.sender?.name ?? 'RPK')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <span className="block text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                                                    Pengirim
                                                </span>
                                                <p className="truncate font-semibold text-slate-900 dark:text-white">
                                                    {selectedMessage.sender?.name ?? 'Tim Advokat'}
                                                </p>
                                                <p className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                                    {selectedMessage.from_address}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                                                Penerima (To)
                                            </span>
                                            <p className="font-semibold text-slate-900 dark:text-white break-words">
                                                {selectedMessage.to_addresses.join(', ')}
                                            </p>
                                            {selectedMessage.cc_addresses && selectedMessage.cc_addresses.length > 0 && (
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                    <span className="font-medium">Cc:</span> {selectedMessage.cc_addresses.join(', ')}
                                                </p>
                                            )}
                                            {selectedMessage.bcc_addresses && selectedMessage.bcc_addresses.length > 0 && (
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                    <span className="font-medium">Bcc:</span> {selectedMessage.bcc_addresses.join(', ')}
                                                </p>
                                            )}
                                        </div>

                                        {selectedMessage.matter && (
                                            <div className="sm:col-span-2 border-t border-slate-200/60 pt-2 dark:border-white/5">
                                                <span className="text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                                                    Perkara Terkait
                                                </span>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {selectedMessage.matter.matter_number} &bull; {selectedMessage.matter.title}
                                                </p>
                                            </div>
                                        )}

                                        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 pt-2 text-[11px] text-slate-500 dark:border-white/5 dark:text-zinc-400">
                                            <span>
                                                Dibuat: <strong className="text-slate-700 dark:text-zinc-300">{formatDate(selectedMessage.created_at)} WIB</strong>
                                            </span>
                                            {selectedMessage.sent_at && (
                                                <span>
                                                    Terkirim: <strong className="text-emerald-700 dark:text-emerald-400">{formatDate(selectedMessage.sent_at)} WIB</strong>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {selectedMessage.error_message && (
                                        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                                            <p className="font-bold">Pemberitahuan Kendala Pengiriman:</p>
                                            <p className="mt-0.5 text-[11px] leading-relaxed font-mono">{selectedMessage.error_message}</p>
                                        </div>
                                    )}

                                    {/* Email Body Card */}
                                    <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 shadow-2xs dark:border-white/10 dark:bg-[#12141a]">
                                        <div className="border-b border-slate-100 pb-2 mb-3 text-[10.5px] font-bold tracking-wider text-slate-400 uppercase dark:border-white/5 dark:text-zinc-500">
                                            Isi Pesan Resmi
                                        </div>
                                        <div className="whitespace-pre-wrap text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
                                            {mainBody}
                                        </div>

                                        {/* Letterhead Signature if included */}
                                        {hasSignature && (
                                            <div className="mt-5 border-t border-slate-200/80 pt-4 dark:border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-20 shrink-0 items-center justify-center rounded border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-zinc-900">
                                                        <img
                                                            src="/logo/raf-law-firm-transparent.png"
                                                            alt="RPK Law Firm"
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="min-w-0 border-l border-slate-200 pl-3 dark:border-white/10">
                                                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                            {sigName || selectedMessage.sender?.name || 'Tim Advokat & Konsultan Hukum'}
                                                        </p>
                                                        <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                                            {sigTitle || selectedMessage.sender?.position_title || 'Advokat & Konsultan Hukum'}
                                                        </p>
                                                        <p className="text-[10px] font-semibold text-slate-700 dark:text-zinc-300">
                                                            RONI, PUTRA &amp; KUSUMAH LAW FIRM
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-[10.5px] leading-relaxed text-slate-500 dark:text-zinc-400">
                                                    <span className="font-medium text-slate-700 dark:text-zinc-300">Tel/WA:</span> 0852 9560 1417 &bull;{' '}
                                                    <span className="font-medium text-slate-700 dark:text-zinc-300">Email:</span> {selectedMessage.from_address} &bull;{' '}
                                                    <span className="font-medium text-slate-700 dark:text-zinc-300">Web:</span> rpklawoffice.com
                                                    <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                                                        Jl. Bukit Nirwana VII, Blok CC.04, Sariwangi, Bandung Barat
                                                    </p>
                                                </div>
                                                <p className="mt-2.5 border-t border-dashed border-slate-200 pt-2 text-[9.5px] leading-normal text-slate-400 dark:border-white/5 dark:text-zinc-500">
                                                    <strong className="font-medium text-slate-500 dark:text-zinc-400">
                                                        KERAHASIAAN PROFESI ADVOKAT (ATTORNEY-CLIENT PRIVILEGE):
                                                    </strong>{' '}
                                                    Surat elektronik ini bersifat rahasia dan dilindungi hak istimewa hukum kerahasiaan profesi advokat (Pasal 19 UU No. 18/2003).
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex shrink-0 items-center justify-end border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6 dark:border-white/[0.06] dark:bg-white/[0.02]">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setSelectedMessage(null)}
                                        className="h-8.5 rounded-lg border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/10"
                                    >
                                        Tutup
                                    </Button>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </>
    );
}
