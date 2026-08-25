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

            {/* Logout Confirmation Dialog Modal */}
            <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
                <DialogContent className="max-w-[420px] rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#14161b] sm:max-w-[420px]">
                    <div className="flex items-start gap-3.5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-900/30 dark:bg-rose-950/40 dark:text-rose-400">
                            <LogOut className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                                Konfirmasi Keluar dari Workspace
                            </DialogTitle>
                            <DialogDescription className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                                Apakah Anda yakin ingin mengakhiri sesi kerja? Pastikan seluruh draf berkas dan catatan Anda telah tersimpan.
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Clean User Account Card (Fully Contained) */}
                    <div className="my-4 flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-white/[0.05] dark:bg-white/[0.02]">
                        <Avatar className="size-9 shrink-0 rounded-full border border-slate-200/80 dark:border-white/10">
                            <AvatarImage src={user.avatar_url || (user as { avatar_path?: string }).avatar_path || undefined} />
                            <AvatarFallback className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                                {user.name}
                            </p>
                            <p className="truncate font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Dialog Footer Actions */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowLogoutModal(false)}
                            disabled={isLoggingOut}
                            className="h-8.5 rounded-xl border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmLogout}
                            disabled={isLoggingOut}
                            className="h-8.5 rounded-xl bg-rose-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 active:scale-95 dark:bg-rose-600 dark:hover:bg-rose-700"
                        >
                            {isLoggingOut ? (
                                <>
                                    <Spinner className="mr-1.5 size-3" />
                                    Keluar...
                                </>
                            ) : (
                                <>
                                    <LogOut className="mr-1.5 size-3.5" />
                                    Ya, Keluar Akun
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
