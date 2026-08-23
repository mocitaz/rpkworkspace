import { router } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    FileUp,
    ListPlus,
    Search,
    UserPlus,
    UsersRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { search } from '@/routes';
import * as clients from '@/routes/clients';
import * as contacts from '@/routes/contacts';
import * as documents from '@/routes/documents';
import * as matters from '@/routes/matters';
import * as tasks from '@/routes/tasks';

const commands = [
    {
        label: 'Buat Matter Baru',
        icon: BriefcaseBusiness,
        action: () => router.visit(matters.create()),
    },
    {
        label: 'Tambah Klien Baru',
        icon: UsersRound,
        action: () => router.visit(clients.create()),
    },
    {
        label: 'Tambah Kontak',
        icon: UserPlus,
        action: () => router.visit(contacts.index({ query: { create: 1 } })),
    },
    {
        label: 'Buat Tugas Baru',
        icon: ListPlus,
        action: () => router.visit(tasks.index({ query: { create: 1 } })),
    },
    {
        label: 'Unggah Dokumen',
        icon: FileUp,
        action: () => router.visit(documents.index({ query: { upload: 1 } })),
    },
];

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const filtered = useMemo(
        () =>
            commands.filter((command) =>
                command.label.toLowerCase().includes(query.toLowerCase()),
            ),
        [query],
    );

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setOpen((value) => !value);
            }
        };
        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const run = (action: () => void) => {
        setOpen(false);
        setQuery('');
        action();
    };

    return (
        <>
            {/* Notion Search Capsule Trigger */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-7.5 items-center gap-2 rounded-lg border border-black/[0.08] bg-black/[0.03] px-2.5 text-xs text-[#787774] transition-colors hover:border-black/20 hover:bg-white hover:text-[#111111] dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
            >
                <Search className="size-3.5 text-[#787774] dark:text-zinc-400" />
                <span className="hidden sm:inline font-medium">Cari di workspace...</span>
                <kbd className="rounded border border-black/[0.08] bg-white px-1 py-0.2 font-mono text-[9px] font-medium text-[#787774] shadow-2xs dark:border-white/[0.1] dark:bg-zinc-800 dark:text-zinc-300">
                    ⌘K
                </kbd>
            </button>

            {/* Apple Spotlight Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="top-[20%] translate-y-0 gap-0 overflow-hidden rounded-3xl border border-black/10 bg-white/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-lg dark:border-white/10 dark:bg-[#1c1c1e]/95">
                    <DialogTitle className="sr-only">
                        Pencarian Spotlight &amp; Perintah Cepat
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Cari berkas atau jalankan aksi cepat di RPK Practice OS.
                    </DialogDescription>

                    <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3.5 dark:border-white/[0.06]">
                        <Search className="size-4.5 shrink-0 text-[#0071e3] dark:text-[#2997ff]" />
                        <Input
                            autoFocus
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter' &&
                                    query.trim().length >= 2
                                ) {
                                    run(() =>
                                        router.visit(
                                            search({
                                                query: { q: query.trim() },
                                            }),
                                        ),
                                    );
                                }
                            }}
                            placeholder="Ketik untuk mencari perkara, klien, dokumen, atau perintah…"
                            className="h-8 border-0 bg-transparent p-0 text-xs font-medium text-[#1d1d1f] shadow-none placeholder:text-[#86868b] focus-visible:ring-0 dark:text-white"
                        />
                        <kbd className="rounded-md border border-black/10 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#86868b] dark:border-white/10 dark:bg-zinc-800">
                            ESC
                        </kbd>
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                        {query.trim().length >= 2 && (
                            <button
                                type="button"
                                onClick={() =>
                                    run(() =>
                                        router.visit(
                                            search({
                                                query: { q: query.trim() },
                                            }),
                                        ),
                                    )
                                }
                                className="flex w-full items-center gap-2.5 rounded-2xl p-2.5 text-left text-xs font-semibold text-[#0071e3] hover:bg-blue-50 transition-colors dark:text-[#2997ff] dark:hover:bg-blue-950/40"
                            >
                                <Search className="size-4 shrink-0" />
                                <span>Cari “{query.trim()}” di seluruh sistem</span>
                            </button>
                        )}

                        <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-[#86868b] uppercase dark:text-zinc-500">
                            Tindakan Cepat
                        </div>

                        {filtered.map((command) => {
                            const Icon = command.icon;
                            return (
                                <button
                                    key={command.label}
                                    type="button"
                                    onClick={() => run(command.action)}
                                    className="group flex w-full items-center justify-between gap-3 rounded-2xl p-2.5 text-left text-xs font-medium text-[#1d1d1f] hover:bg-zinc-100 transition-colors dark:text-white dark:hover:bg-zinc-800"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-7 items-center justify-center rounded-xl bg-zinc-100 text-[#86868b] group-hover:bg-[#0071e3] group-hover:text-white transition-colors dark:bg-zinc-800 dark:group-hover:bg-[#2997ff] dark:group-hover:text-black">
                                            <Icon className="size-3.5" />
                                        </div>
                                        <span>{command.label}</span>
                                    </div>
                                    <span className="text-[10px] text-[#86868b]">Aksi</span>
                                </button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
