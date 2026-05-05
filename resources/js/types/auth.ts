export type User = {
    id: number;
    username?: string | null;
    slug?: string | null;
    name: string;
    surname?: string | null;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    role?: string;
    title?: string;
    phone?: string | null;
    region?: string | null;
    bio?: string | null;
    image_url?: string | null;
    profile_photo?: string | null;
    active?: boolean;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
