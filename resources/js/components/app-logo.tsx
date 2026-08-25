export default function AppLogo() {
    return (
        <div className="flex w-full min-w-0 items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
            {/* Clean Notion Workspace Logo Squircle */}
            <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xs transition-transform group-hover:scale-105 dark:border-white/15 dark:bg-[#181a20]">
                <img
                    src="/logo/raf-law-firm-transparent.png"
                    alt="RPK Law Firm"
                    className="size-full object-contain"
                />
            </div>

            {/* Workspace Brand & Subtitle */}
            <div className="flex min-w-0 flex-1 flex-col text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-xs font-black tracking-tight text-slate-900 dark:text-white">
                    RPK LawApp
                </span>
                <span className="truncate font-mono text-[8.5px] font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
                    INTEGRATED LEGAL WORKSPACE
                </span>
            </div>
        </div>
    );
}
