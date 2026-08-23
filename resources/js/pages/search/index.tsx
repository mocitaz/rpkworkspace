import { Form, Head, Link } from '@inertiajs/react';
import {
    FileText,
    FolderKanban,
    Search,
    UserRound,
    UsersRound,
} from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
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
const icons = {
    matter: FolderKanban,
    client: UsersRound,
    contact: UserRound,
    document: FileText,
};
export default function SearchIndex({
    query,
    results,
}: {
    query: string;
    results: Result[];
}) {
    return (
        <>
            <Head title="Pencarian" />
            <main className="app-page max-w-4xl">
                <PageHeader
                    title="Pencarian Global"
                    description="Hasil hanya mencakup record yang diizinkan untuk akun Anda."
                />
                <Form
                    {...search.form()}
                    className="data-surface flex gap-2 p-3"
                >
                    <div className="relative flex-1">
                        <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                        <Input
                            autoFocus
                            name="q"
                            defaultValue={query}
                            className="pl-9"
                            placeholder="Cari matter, klien, kontak, atau dokumen…"
                        />
                    </div>
                    <Button>Cari</Button>
                </Form>
                {query.length < 2 ? (
                    <EmptyState title="Masukkan sedikitnya 2 karakter." />
                ) : results.length === 0 ? (
                    <EmptyState title={`Tidak ada hasil untuk “${query}”.`} />
                ) : (
                    <div className="data-surface divide-y">
                        {results.map((result) => {
                            const Icon = icons[result.type];

                            return (
                                <Link
                                    key={`${result.type}-${result.id}`}
                                    href={result.url}
                                    className="flex items-center gap-4 px-3 py-4 hover:bg-muted/30"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-md border bg-muted/30">
                                        <Icon className="size-4 text-[var(--gold-dark)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {result.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {result.subtitle ?? result.type}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </>
    );
}
SearchIndex.layout = { breadcrumbs: [{ title: 'Pencarian', href: search() }] };
