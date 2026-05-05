import ContactCTA from "@/components/site/ContactCTA";
import ContactRequestForm from "@/components/site/ContactRequestForm";
import PropertyCard from "@/components/site/PropertyCard";
import SeoHead from "@/components/site/SeoHead";
import Badge from "@/components/site/ui/Badge";
import Button from "@/components/site/ui/Button";
import Container from "@/components/site/ui/Container";
import SectionTitle from "@/components/site/ui/SectionTitle";
import { getProperties } from "@/data/site/properties";
import {
  Bath,
  BedDouble,
  CheckCircle2,
  Home,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Tag,
  UserRound,
} from "lucide-react";
import Image from "@/components/site/SiteImage";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Property } from "@/types/site/property";

type ListingDetailPageProps = {
  property: Property;
};

const currencyFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const formatPrice = (price: Property["price"]) => {
  if (price === null || price === undefined || price === "") {
    return "Fiyat Sorunuz";
  }

  const numericPrice =
    typeof price === "number"
      ? price
      : Number.parseFloat(String(price).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));

  return Number.isFinite(numericPrice) && numericPrice > 0
    ? currencyFormatter.format(numericPrice)
    : "Fiyat Sorunuz";
};

export default function ListingDetailPage({ property }: ListingDetailPageProps) {
  const siteSettings = useSiteSettings();

  if (!property) {
    return (
      <>
        <SeoHead title="Ilan bulunamadi | Akbulut Emlak" description="Aradiginiz ilan yayinda olmayabilir." noIndex />
        <section className="bg-light-gray px-5 py-24 text-center">
          <h1 className="text-4xl font-semibold text-navy">Ilan bulunamadi</h1>
          <p className="mt-4 text-slate-600">Aradiginiz portfoy yayinda olmayabilir.</p>
          <Button href="/listings" className="mt-8">
            Ilanlara Don
          </Button>
        </section>
      </>
    );
  }

  const allProperties = getProperties();
  const gallery = property.gallery?.length ? property.gallery.slice(0, 5) : [property.image];
  const secondaryGallery = gallery.slice(1, 5);
  const advisorPhone = property.advisor.phone ?? "";
  const advisorEmail = property.advisor.email ?? "";
  const advisorUrl = property.advisor.url ?? (property.advisor.slug ? `/danisman/${property.advisor.slug}` : undefined);
  const whatsappPhone = advisorPhone.replace(/\D/g, "") || "902120000000";
  const specifications = property.specifications ?? [];

  const similarListings = allProperties
    .filter((item) => item.slug !== property.slug && item.city === property.city)
    .concat(allProperties.filter((item) => item.slug !== property.slug && item.city !== property.city))
    .slice(0, 3);

  const infoCards = [
    { label: "Metrekare", value: `${property.area} m²`, icon: Ruler },
    { label: "Oda Sayisi", value: property.rooms, icon: BedDouble },
    { label: "Banyo", value: `${property.baths} banyo`, icon: Bath },
    { label: "Ilan Tipi", value: property.status, icon: Tag },
    { label: "Emlak Tipi", value: property.type, icon: Home },
    { label: "Lokasyon", value: `${property.city} / ${property.district}`, icon: MapPin },
  ];

  const details = [
    ["Sehir", property.city],
    ["Ilce", property.district],
    ["Mahalle", property.neighborhood || "-"],
    ["Ilan Tipi", property.status],
    ["Emlak Tipi", property.type],
    ["Metrekare", `${property.area} m²`],
    ["Oda Sayisi", property.rooms],
    ["Banyo", property.baths.toString()],
  ];

  const seoDescription = [
    property.city,
    property.district,
    property.type,
    property.rooms,
    `${property.area} m2`,
    formatPrice(property.price),
  ]
    .filter(Boolean)
    .join(", ");

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.title,
    description: property.description,
    image: property.gallery?.length ? property.gallery : [property.image],
    category: property.type,
    url: `/ilan/${property.slug}`,
    brand: {
      "@type": "Organization",
      name: siteSettings.siteName,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: typeof property.price === "number" ? property.price : undefined,
      availability: "https://schema.org/InStock",
      url: `/ilan/${property.slug}`,
      seller: {
        "@type": "Organization",
        name: siteSettings.siteName,
      },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Sehir", value: property.city },
      { "@type": "PropertyValue", name: "Ilce", value: property.district },
      { "@type": "PropertyValue", name: "Mahalle", value: property.neighborhood || "Belirtilmemis" },
      { "@type": "PropertyValue", name: "Oda Sayisi", value: property.rooms },
      { "@type": "PropertyValue", name: "Metrekare", value: `${property.area} m2` },
    ],
  };

  return (
    <>
      <SeoHead
        title={`${property.title} | Akbulut Emlak`}
        description={seoDescription}
        path={`/ilan/${property.slug}`}
        image={property.image}
        type="article"
        structuredData={[listingSchema]}
      />
      <section className="relative overflow-hidden bg-navy px-5 pb-20 pt-16 text-white lg:px-8 lg:pb-28 lg:pt-20">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(198,161,91,0.20),rgba(255,255,255,0)_42%),radial-gradient(circle_at_78%_20%,rgba(198,161,91,0.22),transparent_30%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,#F7F8FA,rgba(247,248,250,0))]" />
        <Container className="relative px-0 lg:px-0">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="border border-gold/30 bg-white/10 text-gold backdrop-blur">{property.status}</Badge>
                <Badge className="border border-white/15 bg-white/5 text-white backdrop-blur">{property.type}</Badge>
              </div>
              <h1 className="mt-6 max-w-[330px] break-words text-[34px] font-semibold leading-tight sm:max-w-4xl sm:text-5xl lg:text-6xl">
                {property.title}
              </h1>
              <p className="mt-5 flex max-w-[330px] items-start gap-3 break-words text-base leading-7 text-slate-200 sm:max-w-none">
                <MapPin size={20} className="mt-0.5 shrink-0 text-gold" />
                {property.city}, {property.district}
                {property.neighborhood ? `, ${property.neighborhood}` : ""}
              </p>
            </div>

            <div className="border border-white/15 bg-white/[0.08] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.20)] backdrop-blur-xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Portfoy degeri</p>
              <p className="mt-3 text-4xl font-semibold text-white">{formatPrice(property.price)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Secili portfoy icin detayli sunum ve randevu planlamasi yapilabilir.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-light-gray pb-16">
        <Container className="-mt-10 sm:-mt-12">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-navy shadow-[0_30px_90px_rgba(11,31,58,0.18)]">
              <Image
                src={gallery[0]}
                alt={property.title}
                fill
                priority
                sizes="(min-width: 1024px) 68vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(11,31,58,0.55),rgba(11,31,58,0.02)_54%)]" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Akbulut Emlak</p>
                  <p className="mt-1 max-w-xl text-xl font-semibold text-white sm:text-2xl">{property.title}</p>
                </div>
                <div className="w-fit max-w-full rounded-[3px] border border-gold/35 bg-white px-4 py-3 text-xl font-semibold text-navy shadow-[0_18px_45px_rgba(11,31,58,0.22)] sm:px-5 sm:text-2xl">
                  {formatPrice(property.price)}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {(secondaryGallery.length ? secondaryGallery : [gallery[0]]).map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-navy shadow-[0_18px_45px_rgba(11,31,58,0.12)] lg:aspect-auto lg:min-h-[132px]"
                >
                  <Image
                    src={image}
                    alt={`${property.title} galeri ${index + 2}`}
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover opacity-95 transition duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,390px)]">
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {infoCards.map((item) => (
                  <div key={item.label} className="border border-stone-line bg-white p-5 shadow-[0_16px_42px_rgba(11,31,58,0.06)]">
                    <item.icon className="text-gold" size={24} />
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-xl font-semibold text-navy">{item.value}</p>
                  </div>
                ))}
              </div>

              <section className="border border-stone-line bg-white p-7 shadow-[0_18px_50px_rgba(11,31,58,0.06)]">
                <p className="section-eyebrow">Aciklama</p>
                <h2 className="mt-2 text-3xl font-semibold text-navy">Ilan Aciklamasi</h2>
                <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600">{property.description}</p>
              </section>

              <section className="border border-stone-line bg-white p-7 shadow-[0_18px_50px_rgba(11,31,58,0.06)]">
                <p className="section-eyebrow">Portfoy Detaylari</p>
                <h2 className="mt-2 text-3xl font-semibold text-navy">One Cikan Ozellikler</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {property.features?.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 border border-stone-line bg-light-gray px-4 py-4 text-sm font-semibold text-slate-700"
                    >
                      <CheckCircle2 className="shrink-0 text-gold" size={19} />
                      {feature}
                    </div>
                  ))}
                </div>
              </section>

              <section className="border border-stone-line bg-white p-7 shadow-[0_18px_50px_rgba(11,31,58,0.06)]">
                <p className="section-eyebrow">Teknik Bilgiler</p>
                <h2 className="mt-2 text-3xl font-semibold text-navy">Detay Tablosu</h2>
                <div className="mt-6 grid overflow-hidden border border-stone-line sm:grid-cols-2">
                  {details.map(([label, value]) => (
                    <div key={label} className="border-b border-stone-line p-4 last:border-b-0 sm:border-r sm:odd:border-r">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                      <p className="mt-2 font-semibold text-navy">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border border-stone-line bg-white p-7 shadow-[0_18px_50px_rgba(11,31,58,0.06)]">
                <p className="section-eyebrow">Ilan Ozellikleri</p>
                <h2 className="mt-2 text-3xl font-semibold text-navy">Detayli Ozellik Listesi</h2>
                <div className="mt-6 overflow-hidden border border-stone-line">
                  {specifications.map((item, index) => (
                    <div
                      key={item.label}
                      className={`grid gap-3 px-4 py-4 md:grid-cols-[200px_minmax(0,1fr)] ${
                        index === specifications.length - 1 ? "" : "border-b border-stone-line"
                      }`}
                    >
                      <p className="break-words text-sm font-semibold text-slate-600">{item.label}</p>
                      <p className="break-words text-sm font-semibold text-navy">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="overflow-hidden border border-stone-line bg-white shadow-[0_18px_50px_rgba(11,31,58,0.06)]">
                <div className="p-7">
                  <p className="section-eyebrow">Konum</p>
                  <h2 className="mt-2 text-3xl font-semibold text-navy">Bolgesel Konum</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Harita entegrasyonu backend ve harita servisi baglantisi asamasinda aktif edilecektir.
                  </p>
                </div>
                <div className="flex h-72 items-center justify-center border-t border-stone-line bg-[linear-gradient(135deg,#f7f8fa,#ffffff)]">
                  <div className="text-center">
                    <Map className="mx-auto text-gold" size={44} />
                    <p className="mt-4 font-semibold text-navy">
                      {property.city}, {property.district}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">Harita alani placeholder</p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="h-fit border border-stone-line bg-white p-5 shadow-[0_24px_70px_rgba(11,31,58,0.10)] sm:p-7 lg:sticky lg:top-28">
              <div className="flex items-center gap-4 border-b border-stone-line pb-6">
                <a
                  href={advisorUrl}
                  className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-navy text-gold transition hover:border-gold"
                >
                  {property.advisor.avatar ? (
                    <img
                      src={property.advisor.avatar}
                      alt={property.advisor.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound size={28} />
                  )}
                </a>
                <div className="min-w-0">
                  <p className="section-eyebrow">Danisman</p>
                  <a
                    href={advisorUrl}
                    className="mt-1 block break-words text-xl font-semibold text-navy transition hover:text-gold sm:text-2xl"
                  >
                    {property.advisor.name}
                  </a>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                {advisorPhone ? (
                  <p className="flex items-center gap-3">
                    <Phone className="text-gold" size={18} />
                    {advisorPhone}
                  </p>
                ) : null}
                {advisorEmail ? (
                  <p className="flex items-center gap-3">
                    <Mail className="text-gold" size={18} />
                    {advisorEmail}
                  </p>
                ) : null}
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Bu ilanla ilgili ozel sunum, fiyat degerlendirmesi ve randevu planlamasi icin danismanimizla iletisime gecin.
              </p>

              <div className="mt-7 space-y-3">
                <Button
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `${property.title} ilani hakkinda bilgi almak istiyorum.`
                  )}`}
                  className="w-full justify-start"
                >
                  <MessageCircle size={18} />
                  WhatsApp ile Iletisim
                </Button>
                {advisorPhone ? (
                  <Button href={`tel:${advisorPhone}`} variant="outline" className="w-full justify-start">
                    <Phone size={18} />
                    Telefonla Ara
                  </Button>
                ) : null}
                {advisorEmail ? (
                  <a
                    href={`mailto:${advisorEmail}?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(
                      "Bu ilan hakkinda bilgi almak istiyorum."
                    )}`}
                    className="flex min-h-[52px] items-center gap-3 rounded-[2px] border border-stone-line px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-navy transition hover:border-gold hover:bg-light-gray"
                  >
                    <Mail size={18} className="text-gold" />
                    Bilgi Almak Istiyorum
                  </a>
                ) : null}
              </div>

              <div className="mt-7 border-t border-stone-line pt-7">
                <p className="mb-4 text-sm font-semibold text-navy">Ilan icin hizli bilgi talebi</p>
                <ContactRequestForm
                  propertyId={property.id}
                  compact
                  defaultMessage={`${property.title} ilani hakkinda bilgi almak istiyorum.`}
                />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="section-spacing bg-white">
        <Container>
          <SectionTitle
            eyebrow="Benzer Ilanlar"
            title="Bu portfoye yakin secili alternatifler"
            description="Lokasyon, segment ve portfoy kalitesi acisindan benzer gayrimenkulleri inceleyin."
          />
          <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {similarListings.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
