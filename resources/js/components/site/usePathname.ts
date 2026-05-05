import { usePage } from '@inertiajs/react';

export function usePathname() {
    return usePage().url.split('?')[0] || '/';
}
