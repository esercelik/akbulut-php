import type { AnchorHTMLAttributes, ReactNode } from 'react';

type SiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: ReactNode;
};

export default function SiteLink({
    href,
    children,
    target,
    ...props
}: SiteLinkProps) {
    return (
        <a href={href} target={target} {...props}>
            {children}
        </a>
    );
}
