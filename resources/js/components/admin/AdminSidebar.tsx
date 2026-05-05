import BrandLogo from '@/components/site/BrandLogo';
import { home } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as consultantsIndex } from '@/routes/admin/consultants';
import {
    create as listingCreate,
    index as listingsIndex,
} from '@/routes/admin/listings';
import { index as messagesIndex } from '@/routes/admin/messages';
import { index as settingsIndex } from '@/routes/admin/settings';
import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Home,
    LayoutDashboard,
    Mail,
    Menu,
    PlusCircle,
    Settings,
    UsersRound,
    X,
} from 'lucide-react';

import type { AdminUser } from './AdminShell';

const menuItems = [
    {
        href: adminDashboard.url(),
        label: 'Dashboard',
        icon: LayoutDashboard,
        permission: 'DASHBOARD_VIEW',
    },
    {
        href: listingsIndex.url(),
        label: 'Ilan Yonetimi',
        icon: Building2,
        permission: 'LISTINGS_VIEW',
    },
    {
        href: listingCreate.url(),
        label: 'Yeni Ilan Ekle',
        icon: PlusCircle,
        permission: 'LISTINGS_CREATE',
    },
    {
        href: consultantsIndex.url(),
        label: 'Kullanicilar',
        icon: UsersRound,
        permission: 'CONSULTANTS_VIEW',
    },
    {
        href: messagesIndex.url(),
        label: 'Mesajlar',
        icon: Mail,
        permission: 'MESSAGES_VIEW',
    },
    {
        href: settingsIndex.url(),
        label: 'Site Ayarlari',
        icon: Settings,
        permission: 'SETTINGS_VIEW',
    },
    { href: home.url(), label: 'Siteye Don', icon: Home },
];

type AdminSidebarProps = {
    user: AdminUser | null;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
};

export default function AdminSidebar({
    user,
    open,
    onToggle,
    onClose,
}: AdminSidebarProps) {
    const { url } = usePage();
    const currentPath = url.split('?')[0] ?? url;
    const canSee = (permission?: string) =>
        !permission ||
        user?.role === 'SUPER_ADMIN' ||
        Boolean(user?.permissions.includes(permission));

    return (
        <>
            <button
                type="button"
                aria-label="Admin menuyu ac"
                className="fixed top-4 left-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-[2px] bg-navy text-white shadow-lg lg:hidden"
                onClick={onToggle}
            >
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {open ? (
                <button
                    type="button"
                    aria-label="Menuyu kapat"
                    className="fixed inset-0 z-30 bg-navy/40 lg:hidden"
                    onClick={onClose}
                />
            ) : null}

            <aside
                className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-white/10 bg-navy text-white transition-transform duration-300 lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">
                    <div className="border-b border-white/10 px-6 py-7">
                        <BrandLogo
                            className="h-24 w-40 rounded-[2px] border border-white/10"
                            imageClassName="p-2"
                        />
                        <p className="mt-3 text-[11px] font-semibold tracking-[0.26em] text-slate-400 uppercase">
                            Admin Panel
                        </p>
                    </div>

                    <nav className="flex-1 space-y-1 px-4 py-6">
                        {menuItems
                            .filter((item) => canSee(item.permission))
                            .map((item) => {
                                const isActive =
                                    item.href === adminDashboard.url()
                                        ? currentPath === item.href ||
                                          currentPath === '/dashboard'
                                        : currentPath.startsWith(item.href);
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 rounded-[2px] px-4 py-3 text-sm font-semibold transition ${
                                            isActive
                                                ? 'bg-gold text-navy'
                                                : 'text-slate-300 hover:bg-white/8 hover:text-white'
                                        }`}
                                    >
                                        <Icon size={18} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                    </nav>
                </div>
            </aside>
        </>
    );
}
