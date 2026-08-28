export default function AppLogo() {
    return (
        <div className="flex w-full min-w-0 items-center gap-2 group-data-[collapsible=icon]:justify-center">
            {/* Logo RPK App - Pure Floating Icon without Box/Container */}
            <img
                src="/images/rpkapp.png"
                alt="RPK App"
                className="size-8 shrink-0 object-contain drop-shadow-xs"
            />

            <div className="flex min-w-0 flex-1 items-center text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm leading-none font-black tracking-tight text-slate-900 dark:text-white">
                    RPK App
                </span>
            </div>
        </div>
    );
}
