import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DocumentsVaultHero({
    metrics,
    canUpload,
    onUpload,
}: {
    metrics: {
        total: number;
        confidential: number;
        under_review: number;
        linked_matters: number;
    };
    canUpload: boolean;
    onUpload: () => void;
}) {
    const items = [
        [
            'Total vault dokumen',
            metrics.total,
            'berkas terenkripsi',
            'text-slate-950 dark:text-white',
        ],
        [
            'Kerahasiaan terbatas',
            metrics.confidential,
            'restricted access',
            'text-slate-950 dark:text-white',
        ],
        [
            'Dalam review',
            metrics.under_review,
            'approval pending',
            'text-slate-950 dark:text-white',
        ],
        [
            'Cakupan perkara',
            metrics.linked_matters,
            'tautan aktif',
            'text-slate-950 dark:text-white',
        ],
    ] as const;

    return (
        <section className="group relative min-h-[250px] overflow-hidden rounded-[20px] border border-slate-200/80 bg-gradient-to-br from-[#f7f9ff] via-white to-[#eaf2ff] px-6 py-6 shadow-[0_10px_28px_rgba(71,85,105,0.075)] sm:px-8 dark:border-white/[0.08] dark:from-[#17191f] dark:via-[#17191f] dark:to-[#18212c]">
            <div className="documents-hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_38%,rgba(96,165,250,0.28),transparent_30%),radial-gradient(circle_at_66%_112%,rgba(251,191,36,0.13),transparent_28%)]" />
            <div className="documents-hero-dots pointer-events-none absolute inset-y-0 right-0 hidden w-[43%] [background-image:radial-gradient(rgba(59,130,246,0.23)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,transparent,black_28%)] [background-size:18px_18px] opacity-30 md:block" />
            <svg
                viewBox="0 0 560 250"
                aria-hidden="true"
                className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[48%] text-white/90 drop-shadow-[0_0_8px_rgba(96,165,250,0.34)] md:block"
            >
                <path
                    d="M8 205 C98 126 184 219 276 136 S433 70 556 94"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="documents-hero-line"
                    pathLength="1"
                />
            </svg>
            <div className="relative z-10 max-w-[760px] md:max-w-[62%]">
                <h1 className="text-2xl leading-tight font-bold tracking-[-0.035em] text-slate-950 sm:text-[30px] dark:text-white">
                    Dokumen &amp; Repositori Legal
                </h1>
                <p className="mt-2 max-w-lg text-xs leading-relaxed text-slate-500 sm:text-[13px] dark:text-zinc-400">
                    Simpan berkas perkara, alat bukti, dan versi dokumen secara
                    privat.
                </p>
                {canUpload && (
                    <Button
                        type="button"
                        onClick={onUpload}
                        className="mt-4 h-8 rounded-lg bg-slate-900 px-3.5 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                    >
                        <FileUp className="mr-1.5 size-3.5" />
                        Unggah Dokumen Privat
                    </Button>
                )}
            </div>
            <div className="relative z-10 mt-5 grid max-w-[760px] grid-cols-2 border-t border-slate-200/70 pt-3 md:max-w-[62%] md:grid-cols-4 dark:border-white/[0.08]">
                {items.map(([label, value, detail, color]) => (
                    <div
                        key={label}
                        className="min-w-0 py-1 pr-3 odd:border-r odd:border-slate-200/70 even:pl-3 md:border-r md:border-slate-200/70 md:px-3 md:first:pl-0 md:last:border-r-0"
                    >
                        <p className="truncate text-[9px] font-bold tracking-[0.11em] text-slate-400 uppercase">
                            {label}
                        </p>
                        <div className="mt-0.5 flex items-baseline gap-1.5">
                            <strong
                                className={`font-mono text-xl font-bold ${color}`}
                            >
                                {value}
                            </strong>
                            <span className="truncate text-[9px] text-slate-500">
                                {detail}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="documents-hero-person pointer-events-none absolute right-[1%] bottom-0 hidden h-[242px] w-[430px] md:block lg:right-[2.5%]">
                <img
                    src="/images/documents-vault-hero.png"
                    alt=""
                    className="h-full w-full object-contain object-bottom"
                />
            </div>
        </section>
    );
}
