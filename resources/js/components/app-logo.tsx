export default function AppLogo() {
    return (
        <div className="flex w-full min-w-0 items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
            {/* Logo RPK App - Pure Floating Icon without Box/Container */}
            <img
                src="/images/rpkapp.png"
                alt="RPK App"
                className="size-8.5 shrink-0 object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
            />

            {/* Premium Editorial Typography & Brand Subtitle */}
            <div className="flex min-w-0 flex-1 flex-col justify-center text-left group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-1.5 leading-none">
                    <span className="truncate text-[13.5px] font-black tracking-tight text-slate-900 dark:text-white">
                        RPK App
                    </span>
                    <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 font-mono text-[8px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                        WORKSPACE
                    </span>
                </div>
                <span className="truncate font-mono text-[8px] font-bold tracking-[0.16em] text-slate-400 uppercase dark:text-zinc-500 mt-1 leading-none">
                    ADVOCATES &amp; LEGAL SYSTEM
                </span>
            </div>
        </div>
    );
}
