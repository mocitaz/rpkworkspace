import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
}: {
    user: User;
    showEmail?: boolean;
}) {
    const getInitials = useInitials();

    return (
        <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative shrink-0">
                <Avatar
                    className={`size-7.5 shrink-0 overflow-hidden rounded-xl border ${
                        showEmail
                            ? 'border-slate-200 dark:border-white/15'
                            : 'border-slate-200/90 shadow-2xs dark:border-white/10'
                    }`}
                >
                    <AvatarImage
                        src={user.avatar_url || user.avatar || '/images/default-avatar.svg'}
                        alt={user.name}
                    />
                    <AvatarFallback
                        className={`rounded-xl text-[10px] font-extrabold ${
                            showEmail
                                ? 'bg-muted text-foreground'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                    >
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-xs font-bold text-slate-900 dark:text-white">
                    {user.name}
                </span>
                {showEmail ? (
                    <span className="truncate text-[10.5px] font-medium text-slate-400 dark:text-zinc-500">
                        {user.email}
                    </span>
                ) : (
                    <span className="truncate text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                        {user.position_title ?? 'RPK Workspace'}
                    </span>
                )}
            </div>
        </div>
    );
}
