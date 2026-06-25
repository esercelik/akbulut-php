import PropertyCard from "@/components/site/PropertyCard";
import SeoHead from "@/components/site/SeoHead";
import Container from "@/components/site/ui/Container";
import type { Property } from "@/types/site/property";
import {
  BriefcaseBusiness,
  Home,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  SearchX,
  UserRound,
} from "lucide-react";

type Consultant = {
  id: number;
  slug: string | null;
  name: string;
  title: string | null;
  phone: string | null;
  email: string | null;
  region: string | null;
  bio: string | null;
  avatar: string | null;
  activePortfolioCount: number;
  salePortfolioCount: number;
  rentPortfolioCount: number;
};

type ConsultantPortfolioPageProps = {
  consultant: Consultant;
  properties: Property[];
};

export default function ConsultantPortfolioPage({
  consultant,
  properties,
}: ConsultantPortfolioPageProps) {
  const hasListings = properties.length > 0;
  const consultantUrl = consultant.slug ? `/danisman/${consultant.slug}` : "/consultants";
  const consultantSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: consultant.name,
    url: consultantUrl,
    image: consultant.avatar,
    telephone: consultant.phone,
    email: consultant.email,
    areaServed: consultant.region,
    description: consultant.bio,
    makesOffer: properties.slice(0, 24).map((property) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Residence",
        name: property.title,
        url: `/ilan/${property.slug}`,
        address: [property.neighborhood, property.district, property.city].filter(Boolean).join(", "),
      },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "/" },
      { "@type": "ListItem", position: 2, name: "Danismanlar", item: "/consultants" },
      { "@type": "ListItem", position: 3, name: consultant.name, item: consultantUrl },
    ],
  };

  return (
    <>
      <SeoHead
        title={`${consultant.name} Portfoyleri | Akbulut Emlak`}
        description={`${consultant.name} ${consultant.region ?? ""} bolgesindeki aktif satilik ve kiralik portfoyleriyle hizmet vermektedir.`.trim()}
        path={consultantUrl}
        image={consultant.avatar}
        structuredData={[consultantSchema, breadcrumbSchema]}
      />

      <div className="bg-light-gray">
        <section className="relative overflow-hidden bg-navy px-5 py-20 text-white lg:px-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(198,161,91,0.20),rgba(255,255,255,0)_46%)]" />
          <Container className="relative px-0 lg:px-0">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] lg:items-end">
              <div className="min-w-0">
                <p className="section-eyebrow">{"Dan\u0131\u015fman Portf\u00f6y\u00fc"}</p>
                <h1 className="mt-4 max-w-[330px] break-words text-[36px] font-semibold leading-tight sm:max-w-3xl sm:text-6xl">
                  {consultant.name}
                </h1>
                {consultant.title ? (
                  <p className="mt-4 text-xl text-gold">{consultant.title}</p>
                ) : null}
                {consultant.bio ? (
                  <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200">
                    {consultant.bio}
                  </p>
                ) : (
                  <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200">
                    {"Akbulut Emlak dan\u0131\u015fman\u0131m\u0131z\u0131n g\u00fcncel aktif portf\u00f6ylerini inceleyebilirsiniz."}
                  </p>
                )}
              </div>

              <div className="border border-white/15 bg-white/[0.08] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.20)] backdrop-blur-xl sm:p-6">
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                  <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/45 bg-[linear-gradient(135deg,#0B1F3A,#16365F)] text-gold shadow-[0_18px_44px_rgba(11,31,58,0.20)]">
                    {consultant.avatar ? (
                      <img
                        src={consultant.avatar}
                        alt={consultant.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <UserRound size={42} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
                      {"\u0130leti\u015fim"}
                    </p>
                    {consultant.region ? (
                      <p className="mt-3 flex items-center gap-2 text-sm text-slate-200">
                        <MapPin size={17} className="text-gold" />
                        {consultant.region}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-200">
                  {consultant.phone ? (
                    <a
                      href={`tel:${consultant.phone}`}
                      className="flex items-center gap-3 transition hover:text-gold"
                    >
                      <Phone size={18} className="text-gold" />
                      {consultant.phone}
                    </a>
                  ) : null}
                  {consultant.email ? (
                    <a
                      href={`mailto:${consultant.email}`}
                      className="flex items-center gap-3 transition hover:text-gold"
                    >
                      <Mail size={18} className="text-gold" />
                      {consultant.email}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="px-5 py-16 lg:px-8">
          <Container className="px-0 lg:px-0">
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              <div className="border border-stone-line bg-white p-5 premium-card-shadow">
                <BriefcaseBusiness className="text-gold" size={24} />
                <p className="mt-4 text-3xl font-semibold text-navy">
                  {consultant.activePortfolioCount}
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {"Aktif portf\u00f6y"}
                </p>
              </div>
              <div className="border border-stone-line bg-white p-5 premium-card-shadow">
                <Home className="text-gold" size={24} />
                <p className="mt-4 text-3xl font-semibold text-navy">
                  {consultant.salePortfolioCount}
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {"Sat\u0131l\u0131k"}
                </p>
              </div>
              <div className="border border-stone-line bg-white p-5 premium-card-shadow">
                <KeyRound className="text-gold" size={24} />
                <p className="mt-4 text-3xl font-semibold text-navy">
                  {consultant.rentPortfolioCount}
                </p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {"Kiral\u0131k"}
                </p>
              </div>
            </div>

            <div className="mb-6 flex flex-col justify-between gap-4 border border-stone-line bg-white p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-slate-500">
                  {properties.length} ilan listeleniyor
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-navy">
                  {consultant.name} {"Portf\u00f6yleri"}
                </h2>
              </div>
            </div>

            {hasListings ? (
              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="border border-stone-line bg-white p-10 text-center">
                <SearchX className="mx-auto text-gold" size={42} />
                <h3 className="mt-5 text-2xl font-semibold text-navy">
                  {"Bu dan\u0131\u015fmana ait aktif ilan bulunmuyor."}
                </h3>
              </div>
            )}
          </Container>
        </section>
      </div>
    </>
  );
}
