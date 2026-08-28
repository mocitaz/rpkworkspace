import { router } from '@inertiajs/react';
import {
    BookOpen,
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
    {
        label: 'Cara Penggunaan & Panduan Sistem',
        icon: BookOpen,
        action: () => router.visit('/guide'),
    },
];

export function CommandPalette({
    className,
    compact = false,
}: {
    className?: string;
    compact?: boolean;
} = {}) {
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
            {compact ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    title="Pencarian Spotlight (⌘K)"
                    aria-label="Pencarian Spotlight"
                    className={`flex size-8.5 cursor-pointer items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-2xs transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-white/10 dark:bg-[#16181d] dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white ${className ?? ''}`}
                >
                    <Search className="size-4" />
                </button>
            ) : (
                /* Corporate Search Capsule Trigger */
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={`group flex h-9 w-full cursor-pointer items-center justify-between gap-2.5 rounded-xl border border-transparent bg-slate-100/70 px-3 text-xs text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] dark:bg-white/[0.05] dark:text-zinc-400 dark:hover:bg-white/[0.09] dark:hover:text-white ${className ?? ''}`}
                >
                    <div className="flex min-w-0 items-center gap-2.5">
                        <Search className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600 dark:text-zinc-500 dark:group-hover:text-blue-400" />
                        <span className="truncate text-[13px] font-normal text-slate-400 transition-colors group-hover:text-slate-700 dark:text-zinc-500 dark:group-hover:text-zinc-300">
                            Search (Ctrl+/)
                        </span>
                    </div>
                    <kbd className="hidden shrink-0 items-center gap-0.5 rounded-md border border-slate-200/80 bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-400 shadow-2xs group-hover:text-slate-600 sm:inline-flex dark:border-white/10 dark:bg-zinc-800/80 dark:text-zinc-400 dark:group-hover:text-zinc-200">
                        <span className="text-[11px]">⌘</span>K
                    </kbd>
                </button>
            )}

            {/* Corporate Spotlight Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="top-[20%] translate-y-0 gap-0 overflow-hidden rounded-2xl border border-black/[0.08] bg-white/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-lg dark:border-white/10 dark:bg-[#16181d]/95">
                    <DialogTitle className="sr-only">
                        Pencarian Spotlight &amp; Perintah Cepat
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Cari berkas atau jalankan aksi cepat di RPK Practice OS.
                    </DialogDescription>

                    <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3.5 dark:border-white/[0.06]">
                        <Search className="size-4.5 shrink-0 text-slate-700 dark:text-zinc-300" />
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
                            className="h-8 border-0 bg-transparent p-0 text-xs font-medium text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0 dark:text-white"
                        />
                        <kbd className="rounded-md border border-black/10 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-500 dark:border-white/10 dark:bg-zinc-800">
                            ESC
                        </kbd>
                    </div>

                    <div className="max-h-72 space-y-1 overflow-y-auto p-2">
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
                                className="flex w-full items-center gap-2.5 rounded-xl p-2.5 text-left text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                            >
                                <Search className="size-4 shrink-0" />
                                <span>
                                    Cari “{query.trim()}” di seluruh sistem
                                </span>
                            </button>
                        )}

                        <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                            Tindakan Cepat
                        </div>

                        {filtered.map((command) => {
                            const Icon = command.icon;
                            return (
                                <button
                                    key={command.label}
                                    type="button"
                                    onClick={() => run(command.action)}
                                    className="group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left text-xs font-medium text-slate-800 transition-colors hover:bg-slate-100/80 dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-white dark:group-hover:text-slate-900">
                                            <Icon className="size-3.5" />
                                        </div>
                                        <span>{command.label}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                        Aksi
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
