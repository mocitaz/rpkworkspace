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
                <span className="truncate text-sm font-black tracking-tight text-slate-900 dark:text-white leading-none">
                    RPK App
                </span>
                <span className="truncate font-mono text-[8.5px] font-bold tracking-[0.16em] text-slate-400 uppercase dark:text-zinc-500 mt-1 leading-none">
                    ADVOCATES &amp; LEGAL SYSTEM
                </span>
            </div>
        </div>
    );
}
