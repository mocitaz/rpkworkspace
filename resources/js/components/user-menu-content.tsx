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

            {/* Logout Confirmation Dialog Modal (Compact & Executive Look) */}
            <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                <DialogContent className="max-w-[390px] rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#121418]/95 sm:max-w-[390px]">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 shadow-2xs dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-400">
                            <LogOut className="size-4.5" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                            <DialogTitle className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                                Konfirmasi Keluar dari Workspace
                            </DialogTitle>
                            <DialogDescription className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                                Apakah Anda yakin ingin mengakhiri sesi kerja saat ini?
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Active User Account Badge */}
                    <div className="my-3 flex items-center justify-between gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/80 p-2.5 dark:border-white/[0.06] dark:bg-white/[0.03]">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <Avatar className="size-8.5 shrink-0 rounded-full border border-slate-200/80 ring-1 ring-slate-200/50 dark:border-white/10 dark:ring-white/5">
                                <AvatarImage src={user.avatar_url || (user as { avatar_path?: string }).avatar_path || undefined} />
                                <AvatarFallback className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1 truncate">
                                <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                    {user.name}
                                </p>
                                <p className="truncate text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <span className="shrink-0 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400">
                            Sesi Aktif
                        </span>
                    </div>

                    {/* Reminder Callout */}
                    <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.07] px-2.5 py-1.5 text-[11px] text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300">
                        <AlertCircle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span className="leading-tight">Pastikan draf berkas dan catatan telah tersimpan.</span>
                    </div>

                    <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowLogoutModal(false)}
                            disabled={isLoggingOut}
                            className="h-8 rounded-lg border-slate-200/80 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleConfirmLogout}
                            disabled={isLoggingOut}
                            className="h-8 rounded-lg bg-rose-600 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 active:scale-95 dark:bg-rose-600 dark:hover:bg-rose-700"
                        >
                            {isLoggingOut ? (
                                <>
                                    <Spinner className="mr-1.5 size-3" />
                                    Mengakhiri Sesi...
                                </>
                            ) : (
                                <>
                                    <LogOut className="mr-1.5 size-3.5" />
                                    Ya, Keluar Akun
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
