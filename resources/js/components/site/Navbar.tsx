"use client";

import { LogIn, Mail, Menu, Phone, X } from "lucide-react";
import BrandLogo from "@/components/site/BrandLogo";
import { useSiteSettings } from "@/hooks/use-site-settings";
import Link from "@/components/site/SiteLink";
import { usePathname } from "@/components/site/usePathname";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/listings", label: "\u0130lanlar" },
  { href: "/consultants", label: "Dan\u0131\u015fmanlar" },
  { href: "/about", label: "Hakk\u0131m\u0131zda" },
  { href: "/contact", label: "\u0130leti\u015fim" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const siteSettings = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 glass-surface shadow-[0_12px_44px_rgba(11,31,58,0.08)]">
      <div className="hidden bg-navy text-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-2.5 text-[12px] font-medium tracking-wide text-slate-300">
          <span>{"Premium gayrimenkul dan\u0131\u015fmanl\u0131\u011f\u0131 ve se\u00e7kin portf\u00f6y y\u00f6netimi"}</span>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-2">
              <Phone size={14} className="text-gold" />
              {siteSettings.phone}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail size={14} className="text-gold" />
              {siteSettings.email}
            </span>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8 lg:py-5">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <BrandLogo
            priority
            className="h-16 w-28 rounded-[2px] shadow-[0_16px_34px_rgba(11,31,58,0.14)] sm:w-36"
            imageClassName="p-1.5"
          />
        </Link>

        <div className="hidden items-center gap-7 lg:flex xl:gap-9">
          {navItems.map((item) => {
            const isAnchor = item.href.includes("#");
            const baseHref = item.href.split("#")[0] || "/";
            const isActive = !isAnchor && (item.href === "/" ? pathname === "/" : pathname.startsWith(baseHref));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-[13px] font-semibold uppercase tracking-[0.12em] transition ${
                  isActive ? "text-navy" : "text-slate-600 hover:text-navy"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-1 mx-auto h-px bg-gold transition-all ${
                    isActive ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/admin/login"
            className="inline-flex h-[48px] items-center gap-2 rounded-[2px] border border-stone-line bg-white px-5 text-[13px] font-bold uppercase tracking-[0.1em] text-navy transition hover:border-gold hover:text-gold"
          >
            <LogIn size={17} />
            {"Giri\u015f Yap"}
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-[48px] items-center gap-2 rounded-[2px] border border-navy bg-navy px-5 text-[13px] font-bold uppercase tracking-[0.1em] text-white transition hover:border-gold hover:bg-navy-soft"
          >
            <Phone size={17} />
            {"Bize Ula\u015f\u0131n"}
          </Link>
        </div>

        <button
          type="button"
          aria-label={"Men\u00fcy\u00fc a\u00e7 veya kapat"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-stone-line text-navy lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-stone-line bg-white px-5 py-5 shadow-[0_20px_50px_rgba(11,31,58,0.08)] lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => {
              const isAnchor = item.href.includes("#");
              const baseHref = item.href.split("#")[0] || "/";
              const isActive = !isAnchor && (item.href === "/" ? pathname === "/" : pathname.startsWith(baseHref));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border-b border-stone-line/70 py-4 text-sm font-semibold uppercase tracking-[0.12em] ${
                    isActive ? "text-gold" : "text-slate-700"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-[2px] border border-stone-line px-5 py-3 text-sm font-semibold text-navy"
              onClick={() => setOpen(false)}
            >
              <LogIn size={17} />
              {"Giri\u015f Yap"}
            </Link>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-[2px] bg-navy px-5 py-3 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              <Phone size={17} />
              {"Bize Ula\u015f\u0131n"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
