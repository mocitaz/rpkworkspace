import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

type LinkItem = { url: string | null; label: string; active: boolean };

function linkLabel(label: string): string {
    return label
        .replace('&laquo; Previous', 'Sebelumnya')
        .replace('Next &raquo;', 'Berikutnya');
}

export function Pagination({ links }: { links: LinkItem[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            aria-label="Paginasi"
            className="flex flex-wrap items-center justify-end gap-1.5 pt-4"
        >
            {links.map((link, index) => (
                <Button
                    key={`${link.label}-${index}`}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    className={`h-8 rounded-xl px-3 text-xs font-semibold ${
                        link.active
                            ? 'bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-900'
                            : 'border-black/[0.08] bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.1] dark:bg-[#16181d] dark:text-zinc-300'
                    }`}
                    asChild={Boolean(link.url)}
                    disabled={!link.url}
                >
                    {link.url ? (
                        <Link href={link.url} preserveScroll>
                            {linkLabel(link.label)}
                        </Link>
                    ) : (
                        <span>{linkLabel(link.label)}</span>
                    )}
                </Button>
            ))}
        </nav>
    );
}
