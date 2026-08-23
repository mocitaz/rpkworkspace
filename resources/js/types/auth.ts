export type User = {
    id: number;
    name: string;
    email: string;
    position_title?: string | null;
    is_active?: boolean;
    avatar?: string;
    avatar_url?: string | null;
    avatar_path?: string | null;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    permissions: string[];
    notifications: {
        id: string;
        type: string;
        data: { title?: string; message?: string; url?: string };
        read_at: string | null;
        created_at: string;
    }[];
    unread_notifications_count: number;
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
