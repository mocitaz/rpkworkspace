import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    FileText,
    FolderKanban,
    Search,
    UserRound,
    UsersRound,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { search } from '@/routes';

type Result = {
    type: 'matter' | 'client' | 'contact' | 'document';
    id: string;
    title: string;
    subtitle?: string;
    url: string;
};

const iconConfig = {
    matter: {
        icon: FolderKanban,
        label: 'Perkara (Matter)',
        badgeClass:
            'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
        iconClass:
            'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    },
    client: {
        icon: UsersRound,
        label: 'Entitas Klien',
        badgeClass:
            'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        iconClass:
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    contact: {
        icon: UserRound,
        label: 'Buku Kontak',
        badgeClass:
            'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
        iconClass:
            'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
    },
    document: {
        icon: FileText,
        label: 'Dokumen Vault',
        badgeClass:
            'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
        iconClass:
            'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    },
};

export default function SearchIndex({
    query,
    results,
}: {
    query: string;
    results: Result[];
}) {
    const [selectedType, setSelectedType] = useState<string>('all');

    const filteredResults =
        selectedType === 'all'
            ? results
            : results.filter((r) => r.type === selectedType);

    return (
        <>
            <Head title="Pencarian Global - RPK Workspace" />

            <div className="min-h-screen bg-[#fafafc] pb-20 dark:bg-[#0c0d10]">
                <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
                    {/* 1. Header Navigation & Action Bar */}
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-200/60 pb-5 sm:flex-row sm:items-center dark:border-white/[0.06]">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                Pencarian Global
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Temukan berkas perkara, direktori klien, kontak
                                stakeholder, dan repositori dokumen hukum firma
                                secara instan.
                            </p>
                        </div>
                    </div>

                    {/* 2. Search Bar Card */}
                    <Form
                        {...search.form()}
                        className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]"
                    >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    autoFocus
                                    name="q"
                                    defaultValue={query}
                                    className="h-8 rounded-lg border-slate-200 bg-white pl-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                                    placeholder="Ketik nomor perkara, nama klien, kontak person, atau judul dokumen..."
                                />
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                className="h-8 shrink-0 rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900"
                            >
                                <Search className="mr-1.5 size-3" />
                                Cari Data
                            </Button>
                        </div>

                        {/* Filter Type Pills */}
                        {results.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3 dark:border-white/[0.04]">
                                <button
                                    type="button"
                                    onClick={() => setSelectedType('all')}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                        selectedType === 'all'
                                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                            : 'border border-slate-200/80 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300'
                                    }`}
                                >
                                    Semua Kategori ({results.length})
                                </button>
                                {(
                                    [
                                        'matter',
                                        'client',
                                        'contact',
                                        'document',
                                    ] as const
                                ).map((type) => {
                                    const count = results.filter(
                                        (r) => r.type === type,
                                    ).length;
                                    if (count === 0) return null;
                                    const config = iconConfig[type];

                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() =>
                                                setSelectedType(type)
                                            }
                                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                                selectedType === type
                                                    ? 'bg-blue-600 text-white shadow-2xs'
                                                    : 'border border-slate-200/80 bg-slate-50/70 text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300'
                                            }`}
                                        >
                                            {config.label} ({count})
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </Form>

                    {/* 3. Results Container */}
                    {query.length < 2 ? (
                        <div className="rounded-xl border border-slate-200/70 bg-white p-12 text-center shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <EmptyState
                                title="Mulai Pencarian Dokumen & Perkara"
                                description="Masukkan sedikitnya 2 karakter kata kunci untuk mencari data di seluruh workspace RPK Law Firm."
                            />
                        </div>
                    ) : filteredResults.length === 0 ? (
                        <div className="rounded-xl border border-slate-200/70 bg-white p-12 text-center shadow-2xs dark:border-white/[0.06] dark:bg-[#14161b]">
                            <EmptyState
                                title={`Tidak ada hasil untuk "${query}"`}
                                description="Pastikan ejaan kata kunci benar atau coba gunakan istilah pencarian lain."
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                                <span>
                                    Menampilkan {filteredResults.length} hasil
                                    ditemukan
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-2xs dark:divide-white/[0.04] dark:border-white/[0.06] dark:bg-[#14161b]">
                                {filteredResults.map((result) => {
                                    const config = iconConfig[result.type];
                                    const Icon = config.icon;

                                    return (
                                        <Link
                                            key={`${result.type}-${result.id}`}
                                            href={result.url}
                                            className="group flex items-center justify-between gap-4 p-3.5 transition-colors hover:bg-slate-50/70 sm:px-4 dark:hover:bg-white/[0.02]"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div
                                                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${config.iconClass}`}
                                                >
                                                    <Icon className="size-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`py-0.2 rounded px-1.5 font-mono text-[9.5px] font-semibold ${config.badgeClass}`}
                                                        >
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    <p className="mt-0.5 truncate text-xs font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                        {result.title}
                                                    </p>
                                                    {result.subtitle && (
                                                        <p className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                                            {result.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                                <span className="hidden sm:inline">
                                                    Buka
                                                </span>
                                                <ArrowRight className="size-3.5" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

SearchIndex.layout = {
    breadcrumbs: [{ title: 'Pencarian Global', href: search() }],
};
