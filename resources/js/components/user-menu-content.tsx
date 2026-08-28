import { Link, router } from '@inertiajs/react';
import { BookOpen, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
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
                <div className="px-2 py-2.5 text-left">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className="shrink-0">
                            <Avatar className="size-8.5 rounded-lg border border-slate-200/90 shadow-2xs dark:border-white/15">
                                <AvatarImage
                                    src={
                                        user.avatar_url ||
                                        user.avatar ||
                                        '/images/default-avatar.svg'
                                    }
                                    alt={user.name}
                                />
                                <AvatarFallback className="rounded-lg bg-blue-50 text-[10px] font-extrabold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold tracking-tight text-slate-950 dark:text-white">
                                {user.name}
                            </p>
                            <p className="truncate text-[10px] font-medium text-slate-500 dark:text-zinc-400">
                                {user.position_title ?? 'RPK Workspace'}
                            </p>
                            <p className="mt-0.5 truncate text-[9px] text-slate-400 dark:text-zinc-500">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 border-black/[0.04] dark:border-white/[0.06]" />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="flex h-9.5 w-full cursor-pointer items-center rounded-lg px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100/70 hover:text-slate-950 dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2.5 size-4 text-slate-400 dark:text-zinc-500" />
                        Pengaturan Akun
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        className="flex h-9.5 w-full cursor-pointer items-center rounded-lg px-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100/70 hover:text-slate-950 dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
                        href="/guide"
                        prefetch
                        onClick={cleanup}
                    >
                        <BookOpen className="mr-2.5 size-4 text-slate-400 dark:text-zinc-500" />
                        Panduan Penggunaan
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1 border-black/[0.04] dark:border-white/[0.06]" />
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    setShowLogoutModal(true);
                }}
                className="flex h-9.5 w-full cursor-pointer items-center rounded-lg px-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30"
                data-test="logout-button"
            >
                <LogOut className="mr-2.5 size-4" />
                Keluar dari Workspace
            </DropdownMenuItem>

            {/* Symmetrical & Clean Executive Logout Dialog */}
            <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                <DialogContent className="max-w-[380px] rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl sm:max-w-[380px] dark:border-white/10 dark:bg-[#14161b]">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-rose-200/80 bg-rose-50/80 text-rose-600 shadow-xs dark:border-rose-900/40 dark:bg-rose-950/50 dark:text-rose-400">
                            <LogOut className="size-5.5" />
                        </div>

                        <DialogTitle className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                            Keluar dari Workspace?
                        </DialogTitle>
                        <DialogDescription className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                            Sesi kerja Anda akan diakhiri. Pastikan seluruh draf
                            berkas dan catatan Anda telah tersimpan sebelum
                            keluar.
                        </DialogDescription>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2.5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowLogoutModal(false)}
                            disabled={isLoggingOut}
                            className="h-9.5 w-full cursor-pointer rounded-xl border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmLogout}
                            disabled={isLoggingOut}
                            className="h-9.5 w-full cursor-pointer rounded-xl bg-rose-600 text-xs font-bold text-white shadow-xs hover:bg-rose-700 active:scale-98 dark:bg-rose-600 dark:hover:bg-rose-700"
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
                </DialogContent>
            </Dialog>
        </>
    );
}
