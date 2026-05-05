import Button from "@/components/site/ui/Button";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { ArrowRight, Building2, ShieldCheck, TrendingUp } from "lucide-react";
import Image from "@/components/site/SiteImage";

const statIcons = [ShieldCheck, TrendingUp, Building2];

export default function HeroSection() {
  const siteSettings = useSiteSettings();
  const heroStats = siteSettings.stats.slice(0, 3);

  return (
    <section className="relative min-h-[790px] overflow-hidden bg-navy">
      <Image
        src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2400&q=85"
        alt="Luks konut ve sehir silueti"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,58,0.98),rgba(11,31,58,0.78),rgba(11,31,58,0.30))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(198,161,91,0.25),transparent_34%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(0deg,#ffffff,rgba(255,255,255,0))]" />

      <div className="relative mx-auto grid min-h-[790px] max-w-7xl items-center gap-12 px-5 pb-28 pt-24 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="min-w-0 max-w-[350px] sm:max-w-4xl">
          <div className="mb-8 inline-flex max-w-full items-start gap-2 border border-gold/45 bg-white/[0.08] px-4 py-2 text-[11px] font-semibold uppercase leading-5 tracking-[0.12em] text-gold backdrop-blur sm:items-center sm:text-xs sm:tracking-[0.18em]">
            <ShieldCheck size={17} className="mt-0.5 shrink-0 sm:mt-0" />
            <span>Premium emlak danismanligi</span>
          </div>
          <h1 className="max-w-5xl text-[42px] font-semibold leading-[1.04] text-white sm:text-6xl lg:text-[82px]">
            {siteSettings.heroTitle}
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">{siteSettings.heroSubtitle}</p>
          <div className="mt-11 flex flex-col gap-4 sm:flex-row">
            <Button href={siteSettings.heroButtonLink || "/listings"} className="w-full sm:w-auto">
              {siteSettings.heroButtonText || "Ilanlari Incele"}
              <ArrowRight size={18} />
            </Button>
            <Button href="/contact" variant="light" className="w-full sm:w-auto">
              Bizimle Iletisime Gec
            </Button>
          </div>
        </div>

        <div className="hidden border border-white/15 bg-white/[0.09] p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:block">
          <p className="section-eyebrow">Kurumsal guven</p>
          <div className="mt-6 space-y-5">
            {heroStats.map((item, index) => {
              const Icon = statIcons[index] ?? ShieldCheck;

              return (
                <div key={`${item.label}-${index}`} className="border-t border-white/15 pt-5">
                  <Icon className="text-gold" size={24} />
                  <p className="mt-3 text-3xl font-semibold">{item.value}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
