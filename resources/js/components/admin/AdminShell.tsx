import { usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';

import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: string | null;
    permissions: string[];
};

type AdminPageProps = {
    adminUser?: AdminUser;
};

export default function AdminShell({ children }: { children: ReactNode }) {
    const { props } = usePage<AdminPageProps>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = props.adminUser ?? null;

    return (
        <div className="min-h-screen overflow-x-hidden bg-light-gray">
            <AdminSidebar
                user={user}
                open={sidebarOpen}
                onToggle={() => setSidebarOpen((value) => !value)}
                onClose={() => setSidebarOpen(false)}
            />
            <div className="min-w-0 lg:pl-72">
                <AdminHeader user={user} />
                <main className="min-w-0 px-4 py-6 sm:px-5 lg:px-8 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
