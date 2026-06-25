import ContactCTA from "@/components/site/ContactCTA";
import Image from "@/components/site/SiteImage";
import SeoHead from "@/components/site/SeoHead";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Award, BriefcaseBusiness, Users } from "lucide-react";

export default function AboutPage() {
  const siteSettings = useSiteSettings();
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `Hakkimizda | ${siteSettings.siteName}`,
    url: "/about",
    description: siteSettings.aboutText,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "/" },
      { "@type": "ListItem", position: 2, name: "Hakkimizda", item: "/about" },
    ],
  };

  return (
    <>
      <SeoHead
        title={`Hakkimizda | ${siteSettings.siteName}`}
        description={`${siteSettings.aboutTitle}. ${siteSettings.aboutText}`.slice(0, 300)}
        path="/about"
        structuredData={[aboutSchema, breadcrumbSchema]}
      />

      <section className="bg-ivory px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="section-eyebrow">Hakkimizda</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-navy sm:text-6xl">{siteSettings.aboutTitle}</h1>
            <p className="mt-6 leading-8 text-slate-600">{siteSettings.aboutText}</p>
          </div>
          <div className="relative h-[460px] overflow-hidden rounded-[3px] premium-card-shadow">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=85"
              alt="Kurumsal emlak danismanligi"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {siteSettings.stats.slice(0, 3).map((stat) => (
            <div key={stat.label} className="border border-stone-line bg-white p-8 premium-card-shadow">
              <p className="text-5xl font-semibold text-gold">{stat.value}</p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy px-5 py-24 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            {
              icon: Award,
              title: "Deger odakli yaklasim",
              text: "Her portfoy icin piyasa, lokasyon ve talep dinamiklerini birlikte analiz ederiz.",
            },
            {
              icon: Users,
              title: "Uzman ekip",
              text: "Deneyimli danismanlarimiz islemin her asamasinda net ve hizli iletisim saglar.",
            },
            {
              icon: BriefcaseBusiness,
              title: "Kurumsal surec",
              text: "Sunum, randevu, teklif ve kapanis adimlari profesyonel standartlarla yurutulur.",
            },
          ].map((item) => (
            <article key={item.title} className="border border-white/10 bg-white/[0.03] p-7">
              <item.icon className="text-gold" size={34} />
              <h2 className="mt-6 text-xl font-semibold">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
