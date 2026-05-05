import type { Auth } from '@/types/auth';
import type { FlashToast } from '@/types/ui';
import type { SiteSettings } from '@/types/site-settings';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            flash: {
                success?: string;
                toast?: FlashToast;
            };
            siteSettings: SiteSettings;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
