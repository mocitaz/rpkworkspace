import { Link, router } from '@inertiajs/react';
import { AlertCircle, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { UserInfo } from '@/components/user-info';
import { useInitials } from '@/hooks/use-initials';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const getInitials = useInitials();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleConfirmLogout = () => {
        setIsLoggingOut(true);
        cleanup();
        router.post(
            logout(),
            {},
            {
                onFinish: () => {
                    setIsLoggingOut(false);
                    setShowLogoutModal(false);
                    router.flushAll();
                },
            },
        );
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50/70 p-2 text-left text-sm dark:bg-white/[0.04]">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 border-black/[0.04] dark:border-white/[0.06]" />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="flex w-full cursor-pointer items-center rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2 size-3.5 text-slate-400 dark:text-zinc-400" />
                        Pengaturan / Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1 border-black/[0.04] dark:border-white/[0.06]" />
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    setShowLogoutModal(true);
                }}
                className="flex w-full cursor-pointer items-center rounded-xl px-2.5 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30"
                data-test="logout-button"
            >
                <LogOut className="mr-2 size-3.5" />
                Keluar / Log out
            </DropdownMenuItem>

            {/* Logout Confirmation Dialog Modal (Ultra Compact & Symmetrical) */}
            <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                <DialogContent className="max-w-[360px] rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#14161b] sm:max-w-[360px]">
                    <div className="flex flex-col items-center text-center">
                        {/* Centered Soft Rose Icon */}
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 shadow-2xs dark:border-rose-900/30 dark:bg-rose-950/40 dark:text-rose-400">
                            <LogOut className="size-5" />
                        </div>

                        {/* Title & Description */}
                        <DialogTitle className="mt-3.5 text-base font-bold tracking-tight text-slate-900 dark:text-white">
                            Keluar dari Workspace?
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                            Pastikan seluruh draf dokumen dan catatan agenda Anda telah tersimpan sebelum mengakhiri sesi.
                        </DialogDescription>

                        {/* Compact User Identity Pill */}
                        <div className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 dark:border-white/[0.04] dark:bg-white/[0.03]">
                            <Avatar className="size-6 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                                <AvatarImage src={user.avatar_url || (user as { avatar_path?: string }).avatar_path || undefined} />
                                <AvatarFallback className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-200">
                                {user.name}
                            </span>
                            <span className="text-slate-300 dark:text-zinc-700">·</span>
                            <span className="truncate font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                                {user.email}
                            </span>
                        </div>

                        {/* Balanced 2-Column Action Buttons */}
                        <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowLogoutModal(false)}
                                disabled={isLoggingOut}
                                className="h-9 w-full rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                onClick={handleConfirmLogout}
                                disabled={isLoggingOut}
                                className="h-9 w-full rounded-xl bg-rose-600 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 active:scale-95 dark:bg-rose-600 dark:hover:bg-rose-700"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <Spinner className="mr-1.5 size-3.5" />
                                        Keluar...
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="mr-1.5 size-3.5" />
                                        Ya, Keluar
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
