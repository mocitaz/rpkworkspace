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
        <>
            <Avatar className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-border/80">
                <AvatarImage src={user.avatar_url ?? user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-muted text-[11px] font-semibold text-foreground">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium text-foreground">{user.name}</span>
                {showEmail && (
                    <span className="truncate text-[11px] text-muted-foreground">
                        {user.email}
                    </span>
                )}
            </div>
        </>
    );
}
