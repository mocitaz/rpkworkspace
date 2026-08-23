export default function AppLogo() {
    return (
        <div className="flex w-full min-w-0 items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
            {/* Clean Notion Workspace Logo Squircle */}
            <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/[0.08] bg-white p-0.5 shadow-2xs group-data-[collapsible=icon]:size-8.5 dark:border-white/[0.1] dark:bg-[#1e1e20]">
                <img
                    src="/logo/logo.png"
                    alt="RPK Law Firm"
                    className="size-full object-contain"
                />
            </div>

            {/* Notion Workspace Brand & Subtitle */}
            <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
                <span className="truncate text-xs font-bold tracking-tight text-[#111111] dark:text-white">
                    RPK Law Firm
                </span>
                <span className="font-mono text-[9px] font-semibold tracking-wider text-[#787774] uppercase dark:text-zinc-400">
                    Workspace
                </span>
            </div>
        </div>
    );
}
