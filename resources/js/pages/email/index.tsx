import { Form, Head } from '@inertiajs/react';
import { CheckCircle2, FileText, Mail, Pencil, Send, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Message = { id: string; subject: string; to_addresses: string[]; status: string; created_at: string; sent_at?: string | null; error_message?: string | null; matter?: { matter_number: string; title: string } | null };
type Matter = { id: string; matter_number: string; title: string };
type Client = { id: string; display_name: string };

const statusLabel: Record<string, string> = { sent: 'Terkirim', queued: 'Dalam antrean', draft: 'Draft', failed: 'Gagal' };

export default function EmailIndex({ messages, matters, clients, fromAddress, canSend }: { messages: Message[]; matters: Matter[]; clients: Client[]; fromAddress: string; canSend: boolean }) {
    const [tab, setTab] = useState('all');
    const visible = tab === 'all' ? messages : messages.filter((message) => message.status === tab);
    return (
        <>
            <Head title="Email Workspace" />
            <div className="min-h-screen bg-slate-50/70 px-4 py-6 dark:bg-slate-950 sm:px-8 lg:px-10">
                <div className="mx-auto max-w-7xl space-y-6">
                    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                            <div className="flex items-start gap-4"><div className="flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-white"><Mail className="size-6" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Workspace Komunikasi</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Email</h1><p className="mt-1 text-sm text-slate-500">Kirim, lacak, dan simpan komunikasi resmi firma.</p></div></div>
                            {canSend && <a href="#composer" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"><Pencil className="size-4" /> Tulis Email</a>}
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-4 dark:border-white/10">
                            {([['Terkirim','sent',CheckCircle2],['Dalam antrean','queued',Send],['Draft','draft',FileText],['Gagal','failed',XCircle]] as const).map(([label, key, Icon]) => <button key={key} onClick={() => setTab(key)} className="rounded-xl p-2 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"><div className="flex items-center gap-2 text-xs text-slate-500"><Icon className="size-4" />{label}</div><p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{messages.filter((m) => m.status === key).length}</p></button>)}
                        </div>
                    </header>

                    {canSend && <section id="composer" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"><div className="mb-5"><h2 className="text-lg font-semibold text-slate-950 dark:text-white">Tulis Email</h2><p className="mt-1 text-sm text-slate-500">Email akan dikirim melalui antrean dan memakai template branded RPK.</p></div><Form action="/email" method="post" className="grid gap-5 lg:grid-cols-2"><div className="space-y-4"><div><Label>Dari</Label><Input value={fromAddress} readOnly className="mt-1.5 bg-slate-50 text-slate-500" /></div><div><Label htmlFor="to">Kepada <span className="text-rose-500">*</span></Label><Input id="to" name="to" placeholder="email@penerima.com, email@lain.com" className="mt-1.5" required /></div><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="cc">CC</Label><Input id="cc" name="cc" placeholder="Opsional" className="mt-1.5" /></div><div><Label htmlFor="bcc">BCC</Label><Input id="bcc" name="bcc" placeholder="Opsional" className="mt-1.5" /></div></div><div className="grid gap-4 sm:grid-cols-2"><div><Label htmlFor="matter_id">Perkara terkait</Label><select id="matter_id" name="matter_id" className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-white"><option value="">Tidak dikaitkan</option>{matters.map((matter) => <option key={matter.id} value={matter.id}>{matter.matter_number} · {matter.title}</option>)}</select></div><div><Label htmlFor="client_id">Klien terkait</Label><select id="client_id" name="client_id" className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-white"><option value="">Tidak dikaitkan</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.display_name}</option>)}</select></div></div></div><div className="space-y-4"><div><Label htmlFor="subject">Subjek <span className="text-rose-500">*</span></Label><Input id="subject" name="subject" placeholder="Subjek email" className="mt-1.5" required /></div><div><Label htmlFor="body">Isi email <span className="text-rose-500">*</span></Label><Textarea id="body" name="body" placeholder="Tulis isi email Anda..." className="mt-1.5 min-h-48 resize-y" required /></div><div className="flex flex-wrap justify-end gap-2 pt-1"><Button type="submit" name="save_draft" value="1" variant="outline" className="rounded-xl">Simpan Draft</Button><Button type="submit" className="rounded-xl bg-slate-950 text-white hover:bg-slate-800"><Send className="mr-2 size-4" />Kirim Email</Button></div></div></Form></section>}

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/10"><div><h2 className="font-semibold text-slate-950 dark:text-white">Riwayat Email</h2><p className="text-xs text-slate-500">Email yang Anda buat dan kirim dari workspace.</p></div><span className="text-xs text-slate-400">{visible.length} email</span></div><div className="divide-y divide-slate-100 dark:divide-white/10">{visible.length === 0 ? <div className="px-6 py-14 text-center text-sm text-slate-500">Belum ada email pada kategori ini.</div> : visible.map((message) => <div key={message.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate font-medium text-slate-900 dark:text-white">{message.subject}</p><p className="mt-1 truncate text-sm text-slate-500">Kepada: {message.to_addresses.join(', ')}</p>{message.matter && <p className="mt-1 text-xs text-slate-400">{message.matter.matter_number} · {message.matter.title}</p>}</div><div className="flex shrink-0 items-center gap-3"><span className={`text-xs font-semibold ${message.status === 'failed' ? 'text-rose-600' : message.status === 'sent' ? 'text-emerald-600' : 'text-slate-500'}`}>{statusLabel[message.status] ?? message.status}</span><span className="text-xs text-slate-400">{new Date(message.sent_at ?? message.created_at).toLocaleDateString('id-ID')}</span></div></div>)}</div></section>
                </div>
            </div>
        </>
    );
}
