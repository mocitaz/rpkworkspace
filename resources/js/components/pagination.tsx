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
            className="flex flex-wrap justify-end gap-1 pt-4"
        >
            {links.map((link, index) => (
                <Button
                    key={`${link.label}-${index}`}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
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
