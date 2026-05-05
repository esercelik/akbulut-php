import BrandLogo from "@/components/site/BrandLogo";
import Link from "@/components/site/SiteLink";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/listings", label: "Ilanlar" },
  { href: "/consultants", label: "Danismanlar" },
  { href: "/about", label: "Hakkimizda" },
  { href: "/contact", label: "Iletisim" },
];

export default function Footer() {
  const siteSettings = useSiteSettings();
  const socialLinks = [
    { href: siteSettings.instagramUrl, label: "Instagram", icon: Instagram },
    { href: siteSettings.facebookUrl, label: "Facebook", icon: Facebook },
    { href: siteSettings.youtubeUrl, label: "YouTube", icon: Youtube },
    { href: siteSettings.linkedinUrl, label: "LinkedIn", icon: Linkedin },
  ].filter((item) => item.href);

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1fr_0.8fr] lg:px-8">
        <div>
          <BrandLogo className="h-24 w-40 rounded-[2px] border border-white/10" imageClassName="p-2" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">{siteSettings.footerText}</p>
        </div>

        <div>
          <h3 className="section-eyebrow">Menu</h3>
          <div className="mt-5 flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-slate-300 hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="section-eyebrow">Iletisim</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 shrink-0 text-gold" size={18} />
              {siteSettings.address}
            </p>
            <p className="flex gap-3">
              <Phone className="mt-0.5 shrink-0 text-gold" size={18} />
              {siteSettings.phone}
            </p>
            <p className="flex gap-3">
              <Mail className="mt-0.5 shrink-0 text-gold" size={18} />
              {siteSettings.email}
            </p>
          </div>
        </div>

        <div>
          <h3 className="section-eyebrow">Sosyal</h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.length > 0 ? (
              socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-white/15 text-slate-200 transition hover:border-gold hover:text-gold"
                >
                  <item.icon size={18} />
                </a>
              ))
            ) : (
              <p className="text-sm text-slate-400">Sosyal medya baglantilari eklenmedi.</p>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} {siteSettings.siteName}. Tum haklari saklidir.
      </div>
    </footer>
  );
}
