import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="flex items-center">
            <ol className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <Fragment key={index}>
                            <li className="flex items-center">
                                {isLast ? (
                                    <span
                                        aria-current="page"
                                        className="max-w-[220px] truncate font-bold text-slate-900 sm:max-w-[300px] md:max-w-[380px] dark:text-white"
                                        title={item.title}
                                    >
                                        {item.title}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="max-w-[140px] truncate font-medium text-slate-500 transition-colors hover:text-slate-900 sm:max-w-[180px] dark:text-zinc-400 dark:hover:text-white"
                                        title={item.title}
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </li>
                            {!isLast && (
                                <li
                                    aria-hidden="true"
                                    className="flex items-center text-slate-300 dark:text-zinc-600"
                                >
                                    <ChevronRight className="size-3 shrink-0" />
                                </li>
                            )}
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
