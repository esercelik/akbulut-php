import { useSiteSettings } from "@/hooks/use-site-settings";
import Image from "@/components/site/SiteImage";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export default function BrandLogo({
  className = "",
  imageClassName = "",
  priority = false,
}: BrandLogoProps) {
  const siteSettings = useSiteSettings();

  return (
    <div className={`relative overflow-hidden  ${className}`}>
      <Image
        src={siteSettings.logoUrl}
        alt={`${siteSettings.siteName} logo`}
        fill
        
        priority={priority}
        sizes="(max-width: 768px) 150px, 190px"
        className={`object-contain ${imageClassName} shadow-[0_12px_44px_rgba(11,31,58,0.08)]`}
      />
    </div>
  );
}
