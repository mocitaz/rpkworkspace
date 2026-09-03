import { Form, Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock3,
    FileText,
    Inbox,
    Mail,
    Pencil,
    Search,
    Send,
    ShieldCheck,
    XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import * as emailRoutes from '@/routes/email';

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
    const [tab, setTab] = useState<'all' | Status>('all');
    const [search, setSearch] = useState('');
    const [composerOpen, setComposerOpen] = useState(false);
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
                    <section className="relative flex min-h-[250px] flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f8faff] via-white to-[#eaf2ff] px-6 py-6 shadow-[0_10px_28px_rgba(71,85,105,0.075)] sm:h-[250px] sm:px-8 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#172130]">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_36%,rgba(59,130,246,0.23),transparent_29%),radial-gradient(circle_at_70%_115%,rgba(251,191,36,0.11),transparent_28%)]" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[44%] bg-[radial-gradient(rgba(59,130,246,0.23)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_30%)] [background-size:18px_18px] opacity-30 md:block" />
                        <div className="relative z-10 max-w-[760px] md:max-w-[62%]">
                            <p className="text-[9px] font-bold tracking-[0.18em] text-blue-600 uppercase dark:text-blue-400">
                                Komunikasi Firma
                            </p>
                            <h1 className="mt-1 text-2xl font-bold tracking-[-0.035em] text-slate-950 sm:text-[30px] dark:text-white">
                                Email Workspace
                            </h1>
                            <p className="mt-2 max-w-lg text-xs leading-5 text-slate-500 sm:text-[13px] dark:text-zinc-400">
                                Kirim dan dokumentasikan korespondensi resmi
                                dalam satu alur yang aman dan terlacak.
                            </p>
                            {canSend && (
                                <Button
                                    type="button"
                                    onClick={() => setComposerOpen(true)}
                                    className="mt-4 h-8 rounded-lg bg-slate-900 px-3.5 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-900"
                                >
                                    <Pencil className="mr-1.5 size-3.5" />
                                    Tulis Email Baru
                                </Button>
                            )}
                        </div>
                        <div className="relative z-10 mt-5 grid max-w-[760px] grid-cols-2 border-t border-slate-200/70 pt-3 md:max-w-[62%] md:grid-cols-4 dark:border-white/[0.08]">
                            {[
                                ['Total email', counts.all, 'rekaman'],
                                ['Terkirim', counts.sent, 'berhasil'],
                                ['Dalam antrean', counts.queued, 'menunggu'],
                                ['Draft', counts.draft, 'tersimpan'],
                            ].map(([label, value, detail]) => (
                                <div
                                    key={label}
                                    className="min-w-0 py-1 pr-3 odd:border-r odd:border-slate-200/70 even:pl-3 md:border-r md:px-3 md:first:pl-0 md:last:border-r-0 dark:border-white/[0.08]"
                                >
                                    <p className="truncate text-[9px] font-bold tracking-[0.11em] text-slate-400 uppercase">
                                        {label}
                                    </p>
                                    <div className="mt-0.5 flex items-baseline gap-1.5">
                                        <strong className="font-mono text-xl font-bold text-slate-950 dark:text-white">
                                            {value}
                                        </strong>
                                        <span className="truncate text-[9px] text-slate-500">
                                            {detail}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pointer-events-none absolute right-[4%] bottom-0 hidden h-[230px] w-[330px] items-center justify-center md:flex">
                            <div className="absolute size-40 rounded-full border border-blue-200/70 bg-white/75 shadow-[0_25px_70px_rgba(59,130,246,0.18)] backdrop-blur dark:border-white/10 dark:bg-white/[0.06]" />
                            <Mail
                                className="relative size-20 text-blue-600 dark:text-blue-400"
                                strokeWidth={1.2}
                            />
                            <div className="absolute top-10 right-8 flex size-10 items-center justify-center rounded-2xl border border-white bg-white text-emerald-600 shadow-lg dark:border-white/10 dark:bg-slate-800">
                                <ShieldCheck className="size-5" />
                            </div>
                            <div className="absolute bottom-10 left-7 flex size-9 items-center justify-center rounded-2xl border border-white bg-white text-amber-500 shadow-lg dark:border-white/10 dark:bg-slate-800">
                                <Send className="size-4" />
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-white/[0.08] dark:bg-[#14161b]">
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
                                    Riwayat komunikasi yang dibuat melalui
                                    workspace.
                                </p>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Cari subjek atau penerima"
                                    className="h-8 rounded-lg border-slate-200 bg-slate-50/70 pl-8 text-[11px] shadow-none dark:border-white/10 dark:bg-white/[0.04]"
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
                                            className="group grid gap-3 px-5 py-4 transition-colors hover:bg-slate-50/70 sm:grid-cols-[minmax(0,1fr)_180px_150px] sm:items-center sm:px-6 dark:hover:bg-white/[0.025]"
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

            <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
                <DialogContent className="max-h-[92dvh] max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 text-left dark:border-white/[0.06] dark:bg-white/[0.025]">
                        <div className="flex items-center gap-3 pr-7">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/[0.06]">
                                <Mail className="size-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-semibold text-slate-950 dark:text-white">
                                    Tulis Email Baru
                                </DialogTitle>
                                <p className="text-[11px] text-slate-500">
                                    Komunikasi resmi melalui {fromAddress}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>
                    <Form
                        {...emailRoutes.store.form()}
                        onSuccess={() => setComposerOpen(false)}
                        resetOnSuccess
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-6 px-6 py-5 lg:grid-cols-[0.9fr_1.1fr]">
                                    <div className="space-y-4">
                                        <Field label="Dari">
                                            <Input
                                                value={fromAddress}
                                                readOnly
                                                className="h-9 rounded-lg bg-slate-50 text-xs text-slate-500"
                                            />
                                        </Field>
                                        <Field label="Kepada *">
                                            <Input
                                                name="to"
                                                placeholder="email@penerima.com"
                                                className="h-9 rounded-lg text-xs"
                                                required
                                            />
                                            <InputError message={errors.to} />
                                        </Field>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="CC">
                                                <Input
                                                    name="cc"
                                                    placeholder="Opsional"
                                                    className="h-9 rounded-lg text-xs"
                                                />
                                            </Field>
                                            <Field label="BCC">
                                                <Input
                                                    name="bcc"
                                                    placeholder="Opsional"
                                                    className="h-9 rounded-lg text-xs"
                                                />
                                            </Field>
                                        </div>
                                        <Field label="Perkara terkait">
                                            <Select name="matter_id">
                                                <option value="">
                                                    Tidak dikaitkan
                                                </option>
                                                {matters.map((matter) => (
                                                    <option
                                                        key={matter.id}
                                                        value={matter.id}
                                                    >
                                                        {matter.matter_number} ·{' '}
                                                        {matter.title}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Field>
                                        <Field label="Klien terkait">
                                            <Select name="client_id">
                                                <option value="">
                                                    Tidak dikaitkan
                                                </option>
                                                {clients.map((client) => (
                                                    <option
                                                        key={client.id}
                                                        value={client.id}
                                                    >
                                                        {client.display_name}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Field>
                                    </div>
                                    <div className="space-y-4">
                                        <Field label="Subjek *">
                                            <Input
                                                name="subject"
                                                placeholder="Subjek email"
                                                className="h-9 rounded-lg text-xs"
                                                required
                                            />
                                            <InputError
                                                message={errors.subject}
                                            />
                                        </Field>
                                        <Field label="Isi email *">
                                            <Textarea
                                                name="body"
                                                placeholder="Tulis pesan yang jelas dan profesional..."
                                                className="min-h-[257px] resize-y rounded-xl p-3 text-xs leading-5 shadow-none"
                                                required
                                            />
                                            <InputError message={errors.body} />
                                        </Field>
                                    </div>
                                </div>
                                <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.06]">
                                    <p className="text-[9.5px] text-slate-400">
                                        Pengiriman dicatat pada register dan
                                        jejak audit perkara.
                                    </p>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setComposerOpen(false)
                                            }
                                            className="h-9 rounded-lg px-4 text-xs"
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            type="submit"
                                            name="save_draft"
                                            value="1"
                                            variant="outline"
                                            disabled={processing}
                                            className="h-9 rounded-lg px-4 text-xs"
                                        >
                                            Simpan Draft
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-9 rounded-lg bg-slate-950 px-4 text-xs text-white dark:bg-white dark:text-slate-950"
                                        >
                                            <Send className="mr-1.5 size-3.5" />
                                            {processing
                                                ? 'Memproses...'
                                                : 'Kirim Email'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <Label className="mb-1.5 block text-[11px]">{label}</Label>
            {children}
        </div>
    );
}
function Select({
    name,
    children,
}: {
    name: string;
    children: React.ReactNode;
}) {
    return (
        <select
            name={name}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-slate-400 dark:border-white/10 dark:bg-slate-950 dark:text-white"
        >
            {children}
        </select>
    );
}
