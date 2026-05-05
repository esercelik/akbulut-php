import type { ImgHTMLAttributes } from 'react';

type SiteImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
};

export default function SiteImage({
    fill = false,
    priority = false,
    className = '',
    sizes,
    ...props
}: SiteImageProps) {
    return (
        <img
            {...props}
            className={`${fill ? 'absolute inset-0 h-full w-full' : ''} ${className}`}
            loading={priority ? 'eager' : props.loading}
            sizes={sizes}
        />
    );
}
