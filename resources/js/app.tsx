import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import SiteShell from '@/components/site/SiteShell';
import AdminShell from '@/components/admin/AdminShell';

declare global {
    interface Window {
        __siteSettings?: {
            siteName?: string;
        };
    }
}

const appName = window.__siteSettings?.siteName || import.meta.env.VITE_APP_NAME || 'Akbulut Emlak';

createInertiaApp({
    title: (title) =>
        !title || title === appName || title.includes(appName)
            ? title || appName
            : `${title} - ${appName}`,
    layout: (name) => {
        switch (true) {
            case name === 'site/admin-login':
                return null;
            case name.startsWith('site/'):
                return SiteShell;
            case name.startsWith('admin/'):
                return AdminShell;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
