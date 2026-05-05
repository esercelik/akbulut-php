import { logout } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { Bell, LogOut, Search } from 'lucide-react';

import type { AdminUser } from './AdminShell';

const pageTitles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/admin/listings': 'Ilan Yonetimi',
    '/admin/listings/create': 'Yeni Ilan Ekle',
    '/admin/consultants': 'Kullanicilar',
    '/admin/messages': 'Mesajlar',
    '/admin/settings': 'Site Ayarlari',
};

export default function AdminHeader({ user }: { user: AdminUser | null }) {
    const { url } = usePage();
    const currentPath = url.split('?')[0] ?? url;
    const title =
        pageTitles[currentPath] ??
        (currentPath.includes('/edit') ? 'Ilan Duzenle' : 'Admin');

    return (
        <header className="sticky top-0 z-20 border-b border-stone-line bg-white/90 px-4 py-4 backdrop-blur sm:px-5 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4 pl-12 lg:pl-0">
                <div className="min-w-0">
                    <p className="text-xs font-bold tracking-[0.18em] text-gold uppercase">
                        Admin Panel
                    </p>
                    <h1 className="mt-1 break-words text-xl font-semibold text-navy sm:text-2xl">
                        {title}
                    </h1>
                    {user ? (
                        <p className="mt-1 break-words text-xs font-medium text-slate-500">
                            {user.name} / {user.role}
                        </p>
                    ) : null}
                </div>
                <div className="hidden min-w-[280px] flex-1 items-center gap-3 rounded-[2px] border border-stone-line bg-light-gray px-4 py-3 xl:flex">
                    <Search size={18} className="text-slate-400" />
                    <span className="text-sm text-slate-500">
                        Panel icinde ara...
                    </span>
                </div>
                <div className="ml-auto flex items-center gap-2 self-start">
                    <button
                        className="hidden h-11 w-11 items-center justify-center rounded-[2px] border border-stone-line text-navy sm:flex"
                        type="button"
                        aria-label="Bildirimler"
                    >
                        <Bell size={19} />
                    </button>
                    <Link
                        href={logout.url()}
                        method="post"
                        as="button"
                        className="inline-flex h-11 items-center gap-2 rounded-[2px] border border-stone-line px-3 text-xs font-bold tracking-[0.1em] text-navy uppercase transition hover:border-gold hover:text-gold sm:px-4"
                    >
                        <LogOut size={17} />
                        <span className="hidden sm:inline">Cikis Yap</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
