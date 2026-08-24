import { Link, router } from '@inertiajs/react';
import { LogOut, Settings, ShieldAlert } from 'lucide-react';
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
                <DialogContent className="sm:max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#14161b]">
                    <DialogHeader className="space-y-2">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-2xs dark:bg-rose-950/40 dark:text-rose-400">
                            <LogOut className="size-5" />
                        </div>
                        <DialogTitle className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                            Konfirmasi Keluar dari Workspace
                        </DialogTitle>
                        <DialogDescription className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
                            Apakah Anda yakin ingin mengakhiri sesi kerja saat ini? Pastikan seluruh berkas perkara, draf dokumen, dan catatan agenda telah tersimpan.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Active User Card Preview */}
                    <div className="my-2 flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
                        <Avatar className="size-9 rounded-full border border-slate-200/80 dark:border-white/10">
                            <AvatarImage src={user.avatar_url || (user as { avatar_path?: string }).avatar_path || undefined} />
                            <AvatarFallback className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                {user.name}
                            </p>
                            <p className="truncate text-[11px] text-slate-500 dark:text-zinc-400">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="mt-4 flex flex-row items-center justify-end gap-2 sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowLogoutModal(false)}
                            disabled={isLoggingOut}
                            className="h-8.5 rounded-lg border-slate-200/80 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-transparent dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleConfirmLogout}
                            disabled={isLoggingOut}
                            className="h-8.5 rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 active:scale-95"
                        >
                            {isLoggingOut ? (
                                <>
                                    <Spinner className="mr-1.5 size-3.5" />
                                    Mengakhiri Sesi...
                                </>
                            ) : (
                                'Ya, Keluar Akun'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
