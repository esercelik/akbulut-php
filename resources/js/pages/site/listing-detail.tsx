import ContactRequestForm from "@/components/site/ContactRequestForm";
import PropertyCard from "@/components/site/PropertyCard";
import SeoHead from "@/components/site/SeoHead";
import Image from "@/components/site/SiteImage";
import Badge from "@/components/site/ui/Badge";
import Button from "@/components/site/ui/Button";
import Container from "@/components/site/ui/Container";
import {
  BedDouble,
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileBadge,
  Flame,
  Heart,
  Home,
  ImageIcon,
  Landmark,
  Mail,
  MapPin,
  Maximize2,
  MessageCircle,
  Navigation,
  Phone,
  RefreshCw,
  Repeat2,
  Ruler,
  Share2,
  Tag,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Property } from "@/types/site/property";

type ListingDetailPageProps = {
  property: Property | null;
  relatedProperties?: Property[];
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

const numericPrice = (price: Property["price"]): number | null => {
  if (price === null || price === undefined || price === "") {
    return null;
  }

  const value =
    typeof price === "number"
      ? price
      : Number.parseFloat(String(price).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));

  return Number.isFinite(value) ? value : null;
};

const normalizeWhatsAppPhone = (phone?: string | null) => {
  const digits = (phone ?? "").replace(/\D/g, "");

  if (!digits) {
    return "902120000000";
  }

  if (digits.startsWith("90")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `90${digits.slice(1)}`;
  }

  return digits;
};

const specificationValue = (
  specifications: NonNullable<Property["specifications"]>,
  labels: string[],
  fallback = "Belirtilmemis",
) => {
  const match = specifications.find((item) => labels.includes(item.label));

  return match?.value?.trim() ? match.value : fallback;
};

export default function ListingDetailPage({ property, relatedProperties = [] }: ListingDetailPageProps) {
  const siteSettings = useSiteSettings();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [currentUrl, setCurrentUrl] = useState("");
  const lightboxRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const gallery = useMemo(() => {
    if (!property) {
      return ["/placeholder-property.jpg"];
    }

    const images = property.gallery?.filter(Boolean) ?? [];

    return images.length ? images : [property.image || "/placeholder-property.jpg"];
  }, [property]);
  const activeImage = gallery[activeImageIndex] ?? gallery[0];

  const showPreviousImage = () => {
    setActiveImageIndex((index) => (index === 0 ? gallery.length - 1 : index - 1));
  };

  const showNextImage = () => {
    setActiveImageIndex((index) => (index + 1) % gallery.length);
  };

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }

      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [gallery.length, isLightboxOpen]);

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

  const advisorPhone = property.advisor.phone ?? siteSettings.phone ?? "";
  const advisorEmail = property.advisor.email ?? siteSettings.email ?? "";
  const advisorUrl = property.advisor.url ?? (property.advisor.slug ? `/danisman/${property.advisor.slug}` : undefined);
  const whatsappPhone = normalizeWhatsAppPhone(advisorPhone);
  const specifications = property.specifications ?? [];
  const currentPrice = numericPrice(property.price);
  const isLandListing = property.type.toLocaleLowerCase("tr-TR").includes("arsa");
  const descriptionLimit = 720;
  const isLongDescription = property.description.length > descriptionLimit;
  const visibleDescription =
    isLongDescription && !isDescriptionExpanded
      ? `${property.description.slice(0, descriptionLimit).trim()}...`
      : property.description;
  const locationText = [property.neighborhood, property.district, property.city].filter(Boolean).join(", ");
  const mapQuery = [property.address, property.neighborhood, property.district, property.city].filter(Boolean).join(", ");
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const shareUrl = currentUrl || `/ilan/${property.slug}`;
  const whatsappMessage = encodeURIComponent(`${property.title} ilani hakkinda bilgi almak istiyorum. ${shareUrl}`);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=${encodeURIComponent(shareUrl)}`;

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) {
      return;
    }

    const delta = touchStartX.current - clientX;
    touchStartX.current = null;

    if (Math.abs(delta) < 42) {
      return;
    }

    if (delta > 0) {
      showNextImage();
      return;
    }

    showPreviousImage();
  };

  const handleShare = async () => {
    const browserNavigator = typeof window !== "undefined" ? window.navigator : undefined;

    if (browserNavigator?.share) {
      await browserNavigator.share({
        title: property.title,
        text: `${property.title} - ${formatPrice(property.price)}`,
        url: shareUrl,
      });

      return;
    }

    if (browserNavigator?.clipboard) {
      await browserNavigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  };

  const copyDescription = async () => {
    const clipboard = typeof window !== "undefined" ? window.navigator.clipboard : undefined;

    if (!clipboard) {
      return;
    }

    await clipboard.writeText(property.description);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1800);
  };

  const requestFullscreen = async () => {
    if (lightboxRef.current?.requestFullscreen) {
      await lightboxRef.current.requestFullscreen();
    }
  };

  const infoCards = [
    { label: "Metrekare", value: `${property.area} m2`, icon: Ruler },
    { label: isLandListing ? "Nitelik" : "Oda Sayisi", value: isLandListing ? property.type : property.rooms, icon: BedDouble },
    { label: "Bina Yasi", value: specificationValue(specifications, ["Bina Yasi"]), icon: Building2, hidden: isLandListing },
    { label: "Kat Bilgisi", value: specificationValue(specifications, ["Bulundugu Kat", "Kat Sayisi"]), icon: Home, hidden: isLandListing },
    { label: "Isinma Tipi", value: specificationValue(specifications, ["Isitma"]), icon: Flame, hidden: isLandListing },
    { label: "Tapu Durumu", value: specificationValue(specifications, ["Tapu Durumu"]), icon: FileBadge },
    { label: "Krediye Uygunluk", value: specificationValue(specifications, ["Krediye Uygun"]), icon: Landmark },
    { label: "Takas Durumu", value: specificationValue(specifications, ["Takas"]), icon: Repeat2 },
    { label: "Imar Durumu", value: specificationValue(specifications, ["Tapu Durumu", "Emlak Tipi"]), icon: Tag, hidden: !isLandListing },
  ].filter((item) => !item.hidden);

  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    image: gallery,
    url: shareUrl,
    datePosted: property.listingDate,
    dateModified: property.updatedDate ?? property.listingDate,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.district,
      addressRegion: property.city,
      streetAddress: property.address ?? locationText,
      addressCountry: "TR",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: currentPrice ?? undefined,
      availability: "https://schema.org/InStock",
      url: shareUrl,
      seller: {
        "@type": "RealEstateAgent",
        name: siteSettings.siteName,
        telephone: siteSettings.phone,
      },
    },
    additionalProperty: infoCards.map((item) => ({
      "@type": "PropertyValue",
      name: item.label,
      value: item.value,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "/" },
      { "@type": "ListItem", position: 2, name: "Ilanlar", item: "/listings" },
      { "@type": "ListItem", position: 3, name: property.title, item: `/ilan/${property.slug}` },
    ],
  };

  return (
    <>
      <SeoHead
        title={`${property.title} | ${siteSettings.siteName}`}
        description={`${locationText} konumunda ${property.type} ${property.status}. ${formatPrice(property.price)} fiyatli portfoy detaylari, foto galeri ve danisman bilgileri.`}
        path={`/ilan/${property.slug}`}
        image={activeImage}
        type="article"
        structuredData={[listingSchema, breadcrumbSchema]}
      />

      <section className="bg-light-gray pb-24">
        <Container className="py-5 sm:py-7">
          <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            <a href="/" className="transition hover:text-gold">Ana Sayfa</a>
            <span>/</span>
            <a href="/listings" className="transition hover:text-gold">Ilanlar</a>
            <span>/</span>
            <span className="max-w-[260px] truncate text-navy sm:max-w-xl">{property.title}</span>
          </nav>
        </Container>

        <Container>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
            <main className="min-w-0 space-y-8">
              <section className="overflow-hidden border border-stone-line bg-white shadow-[0_24px_80px_rgba(11,31,58,0.10)]">
                <div
                  className="relative aspect-[4/3] bg-navy sm:aspect-[16/10] lg:aspect-[16/9]"
                  onTouchStart={(event) => handleTouchStart(event.touches[0]?.clientX ?? 0)}
                  onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
                >
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute inset-0 z-10 cursor-zoom-in"
                    aria-label="Fotografi buyut"
                  />
                  <Image
                    src={activeImage}
                    alt={`${property.title} fotograf ${activeImageIndex + 1}`}
                    fill
                    priority
                    sizes="(min-width: 1280px) 70vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,24,46,0.54),rgba(7,24,46,0.02)_58%)]" />
                  <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
                    <Badge className="bg-navy/90 text-gold backdrop-blur">
                      <Camera size={15} />
                      {gallery.length} Fotograf
                    </Badge>
                    <Badge className="bg-white/90 text-navy backdrop-blur">{property.status}</Badge>
                  </div>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-navy/70 text-white backdrop-blur transition hover:bg-gold hover:text-navy"
                    aria-label="Onceki fotograf"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-navy/70 text-white backdrop-blur transition hover:bg-gold hover:text-navy"
                    aria-label="Sonraki fotograf"
                  >
                    <ChevronRight size={22} />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Akbulut Emlak Portfoyu</p>
                      <p className="mt-1 max-w-3xl break-words text-2xl font-semibold leading-tight text-white sm:text-4xl">
                        {property.title}
                      </p>
                    </div>
                    <Button type="button" onClick={() => setIsLightboxOpen(true)} className="relative z-30 w-fit px-4">
                      <ImageIcon size={18} />
                      Tum Fotograflar
                    </Button>
                  </div>
                </div>

                <div className="border-t border-stone-line bg-white p-3">
                  <div className="flex snap-x gap-3 overflow-x-auto pb-1">
                    {gallery.map((image, index) => (
                      <button
                        type="button"
                        key={`${image}-${index}`}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative h-20 w-28 shrink-0 snap-start overflow-hidden border transition sm:h-24 sm:w-36 ${
                          index === activeImageIndex ? "border-gold ring-2 ring-gold/25" : "border-stone-line opacity-80 hover:opacity-100"
                        }`}
                        aria-label={`${index + 1}. fotografi ac`}
                      >
                        <Image
                          src={image}
                          alt={`${property.title} thumbnail ${index + 1}`}
                          fill
                          loading="lazy"
                          sizes="144px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="border border-stone-line bg-white p-5 shadow-[0_18px_55px_rgba(11,31,58,0.06)] sm:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gold text-navy">{property.status}</Badge>
                      <Badge className="border border-stone-line bg-light-gray text-navy">{property.type}</Badge>
                    </div>
                    <h1 className="mt-4 break-words text-3xl font-semibold leading-tight text-navy sm:text-5xl">
                      {property.title}
                    </h1>
                    <p className="mt-4 flex items-start gap-2 text-base font-medium leading-7 text-slate-600">
                      <MapPin size={20} className="mt-0.5 shrink-0 text-gold" />
                      {locationText}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFavorite((value) => !value)}
                      className={`grid size-12 place-items-center border transition ${
                        isFavorite ? "border-gold bg-gold text-navy" : "border-stone-line bg-white text-navy hover:border-gold"
                      }`}
                      aria-label="Favorilere ekle"
                    >
                      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="grid size-12 place-items-center border border-stone-line bg-white text-navy transition hover:border-gold hover:text-gold"
                      aria-label="Ilani paylas"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                <dl className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Ilan No", value: property.listingNo ?? property.id, icon: FileBadge },
                    { label: "Ilan Tarihi", value: property.listingDate ?? "Belirtilmemis", icon: CalendarDays },
                    { label: "Guncelleme", value: property.updatedDate ?? "Belirtilmemis", icon: RefreshCw },
                    { label: "Foto Galeri", value: `${gallery.length} fotograf`, icon: Camera },
                  ].map((item) => (
                    <div key={item.label} className="border border-stone-line bg-light-gray p-4">
                      <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                        <item.icon size={16} className="text-gold" />
                        {item.label}
                      </dt>
                      <dd className="mt-2 break-words text-base font-semibold text-navy">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {infoCards.map((item) => (
                  <div key={item.label} className="border border-stone-line bg-white p-5 shadow-[0_16px_45px_rgba(11,31,58,0.06)]">
                    <item.icon className="text-gold" size={24} />
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                    <p className="mt-2 break-words text-xl font-semibold text-navy">{item.value}</p>
                  </div>
                ))}
              </section>

              <section className="border border-stone-line bg-white p-5 shadow-[0_18px_55px_rgba(11,31,58,0.06)] sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="section-eyebrow">Aciklama</p>
                    <h2 className="mt-2 text-3xl font-semibold text-navy">Ilan Aciklamasi</h2>
                  </div>
                  <button
                    type="button"
                    onClick={copyDescription}
                    className="inline-flex h-11 w-fit items-center justify-center gap-2 border border-stone-line px-4 text-sm font-bold uppercase tracking-[0.12em] text-navy transition hover:border-gold hover:text-gold"
                  >
                    <Copy size={16} />
                    {copyState === "copied" ? "Kopyalandi" : "Kopyala"}
                  </button>
                </div>
                <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">{visibleDescription}</div>
                {isLongDescription ? (
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded((value) => !value)}
                    className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-gold transition hover:text-navy"
                  >
                    {isDescriptionExpanded ? "Daha Az Goster" : "Devamini Oku"}
                  </button>
                ) : null}
              </section>

              {property.features?.length ? (
                <section className="border border-stone-line bg-white p-5 shadow-[0_18px_55px_rgba(11,31,58,0.06)] sm:p-7">
                  <p className="section-eyebrow">Portfoy Detaylari</p>
                  <h2 className="mt-2 text-3xl font-semibold text-navy">One Cikan Ozellikler</h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {property.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex min-h-14 items-center gap-3 border border-stone-line bg-light-gray px-4 py-3 text-sm font-semibold text-slate-700"
                      >
                        <CheckCircle2 className="shrink-0 text-gold" size={19} />
                        <span className="break-words">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {specifications.length ? (
                <section className="border border-stone-line bg-white p-5 shadow-[0_18px_55px_rgba(11,31,58,0.06)] sm:p-7">
                  <p className="section-eyebrow">Teknik Bilgiler</p>
                  <h2 className="mt-2 text-3xl font-semibold text-navy">Detay Tablosu</h2>
                  <div className="mt-6 overflow-hidden border border-stone-line">
                    {specifications.map((item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className={`grid gap-2 px-4 py-4 sm:grid-cols-[220px_minmax(0,1fr)] ${
                          index === specifications.length - 1 ? "" : "border-b border-stone-line"
                        }`}
                      >
                        <p className="break-words text-sm font-semibold text-slate-600">{item.label}</p>
                        <p className="break-words text-sm font-semibold text-navy">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="overflow-hidden border border-stone-line bg-white shadow-[0_18px_55px_rgba(11,31,58,0.06)]">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                  <div>
                    <p className="section-eyebrow">Konum</p>
                    <h2 className="mt-2 text-3xl font-semibold text-navy">Yaklasik Konum</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{locationText}</p>
                  </div>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 w-fit items-center justify-center gap-2 border border-navy px-4 text-sm font-bold uppercase tracking-[0.12em] text-navy transition hover:border-gold hover:bg-gold"
                  >
                    <Navigation size={17} />
                    Yol Tarifi
                  </a>
                </div>
                <iframe
                  title={`${property.title} harita`}
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[360px] w-full border-0"
                />
              </section>
            </main>

            <aside className="space-y-5 xl:sticky xl:top-24 xl:h-fit">
              <section className="border border-stone-line bg-white p-5 shadow-[0_24px_80px_rgba(11,31,58,0.12)] sm:p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">Portfoy Fiyati</p>
                <p className="mt-3 break-words text-4xl font-semibold leading-tight text-navy">{formatPrice(property.price)}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Bu portfoy icin randevu, kredi degerlendirmesi ve detayli sunum talep edebilirsiniz.
                </p>

                <div className="mt-6 grid gap-3">
                  <a
                    href="#kredi-hesaplama"
                    className="inline-flex h-[52px] items-center justify-center gap-2 border border-stone-line px-4 text-sm font-bold uppercase tracking-[0.12em] text-navy transition hover:border-gold hover:bg-light-gray"
                  >
                    <Landmark size={18} className="text-gold" />
                    Kredi Hesapla
                  </a>
                  <Button href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`} className="w-full justify-start">
                    <MessageCircle size={18} />
                    WhatsApp
                  </Button>
                  {advisorPhone ? (
                    <Button href={`tel:${advisorPhone}`} variant="outline" className="w-full justify-start">
                      <Phone size={18} />
                      Telefonla Ara
                    </Button>
                  ) : null}
                  <a
                    href="#danisman-mesaj"
                    className="inline-flex h-[52px] items-center justify-center gap-2 border border-navy bg-navy px-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-gold hover:bg-gold hover:text-navy"
                  >
                    <Mail size={18} />
                    Mesaj Gonder
                  </a>
                </div>
              </section>

              <section className="border border-stone-line bg-white p-5 shadow-[0_18px_55px_rgba(11,31,58,0.08)] sm:p-7">
                <img src={siteSettings.logoUrl} alt={`${siteSettings.siteName} logo`} className="h-12 w-auto object-contain" loading="lazy" />
                <div className="mt-6 flex items-center gap-4 border-t border-stone-line pt-6">
                  <a
                    href={advisorUrl}
                    className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-gold/40 bg-navy text-gold transition hover:border-gold"
                  >
                    {property.advisor.avatar ? (
                      <img src={property.advisor.avatar} alt={property.advisor.name} className="size-full object-cover" loading="lazy" />
                    ) : (
                      <UserRound size={32} />
                    )}
                  </a>
                  <div className="min-w-0">
                    <p className="section-eyebrow">Danisman</p>
                    <a href={advisorUrl} className="mt-1 block break-words text-2xl font-semibold text-navy transition hover:text-gold">
                      {property.advisor.name}
                    </a>
                    {property.advisor.title ? <p className="mt-1 text-sm text-slate-500">{property.advisor.title}</p> : null}
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  {advisorPhone ? (
                    <a href={`tel:${advisorPhone}`} className="flex items-center gap-3 font-semibold text-navy transition hover:text-gold">
                      <Phone className="text-gold" size={18} />
                      {advisorPhone}
                    </a>
                  ) : null}
                  {advisorEmail ? (
                    <a href={`mailto:${advisorEmail}`} className="flex items-center gap-3 break-all transition hover:text-gold">
                      <Mail className="text-gold" size={18} />
                      {advisorEmail}
                    </a>
                  ) : null}
                </div>

                <div className="mt-6 grid grid-cols-[112px_minmax(0,1fr)] gap-4 border border-stone-line bg-light-gray p-4">
                  <img src={qrCodeUrl} alt="Ilan QR kodu" width={112} height={112} loading="lazy" className="bg-white p-2" />
                  <div className="min-w-0 self-center">
                    <p className="text-sm font-semibold text-navy">QR ile ilani ac</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">Mobil cihazdan galeriyi ve iletisim bilgilerini hizlica goruntuleyin.</p>
                  </div>
                </div>
              </section>

              <section id="kredi-hesaplama" className="border border-stone-line bg-white p-5 shadow-[0_18px_55px_rgba(11,31,58,0.08)] sm:p-7">
                <p className="section-eyebrow">Kredi On Bilgi</p>
                <h2 className="mt-2 text-2xl font-semibold text-navy">Hizli Degerlendirme</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Danismanimiz, banka kosullarina gore bu portfoy icin uygun kredi senaryolarini paylasabilir.
                </p>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(`${property.title} icin kredi hesaplama destegi almak istiyorum.`)}`}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 border border-gold bg-gold px-4 text-sm font-bold uppercase tracking-[0.12em] text-navy transition hover:bg-gold-soft"
                >
                  <MessageCircle size={18} />
                  Kredi Icin Yaz
                </a>
              </section>

              <section id="danisman-mesaj" className="border border-stone-line bg-white p-5 shadow-[0_18px_55px_rgba(11,31,58,0.08)] sm:p-7">
                <p className="mb-4 text-sm font-semibold text-navy">Danismana mesaj gonder</p>
                <ContactRequestForm
                  propertyId={property.id}
                  compact
                  defaultMessage={`${property.title} ilani hakkinda bilgi almak istiyorum.`}
                />
              </section>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Benzer Ilanlar</p>
              <h2 className="mt-2 text-3xl font-semibold text-navy sm:text-4xl">Ayni bolgedeki alternatifler</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Bolge, fiyat ve portfoy tipine gore yakin ilanlari karsilastirin.
            </p>
          </div>

          {relatedProperties.length ? (
            <div className="mt-10 flex snap-x gap-6 overflow-x-auto pb-4">
              {relatedProperties.map((item) => {
                const relatedPrice = numericPrice(item.price);
                const priceDifference =
                  currentPrice !== null && relatedPrice !== null ? relatedPrice - currentPrice : null;

                return (
                  <div key={item.id} className="w-[320px] shrink-0 snap-start md:w-[360px]">
                    <PropertyCard property={item} />
                    {priceDifference !== null ? (
                      <p className="mt-3 border border-stone-line bg-light-gray px-4 py-3 text-sm font-semibold text-slate-600">
                        Bu ilana gore{" "}
                        <span className={priceDifference > 0 ? "text-red-600" : "text-emerald-700"}>
                          {priceDifference === 0
                            ? "ayni fiyat"
                            : `${formatPrice(Math.abs(priceDifference))} ${priceDifference > 0 ? "daha yuksek" : "daha uygun"}`}
                        </span>
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 border border-stone-line bg-light-gray p-8 text-center text-slate-600">
              Bu bolge icin benzer aktif ilan bulunamadi.
            </div>
          )}
        </Container>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-line bg-white/95 p-3 shadow-[0_-16px_50px_rgba(11,31,58,0.16)] backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`}
            className="inline-flex h-12 items-center justify-center gap-1 bg-gold px-2 text-xs font-bold uppercase tracking-[0.08em] text-navy"
          >
            <MessageCircle size={17} />
            WhatsApp
          </a>
          <a
            href={`tel:${advisorPhone}`}
            className="inline-flex h-12 items-center justify-center gap-1 border border-navy px-2 text-xs font-bold uppercase tracking-[0.08em] text-navy"
          >
            <Phone size={17} />
            Ara
          </a>
          <a
            href="#danisman-mesaj"
            className="inline-flex h-12 items-center justify-center gap-1 bg-navy px-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
          >
            <Mail size={17} />
            Mesaj
          </a>
        </div>
      </div>

      {isLightboxOpen ? (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 flex flex-col bg-black text-white"
          onTouchStart={(event) => handleTouchStart(event.touches[0]?.clientX ?? 0)}
          onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
        >
          <div className="flex min-h-16 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{property.title}</p>
              <p className="text-xs text-white/60">
                {activeImageIndex + 1} / {gallery.length}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={requestFullscreen}
                className="grid size-10 place-items-center border border-white/20 text-white transition hover:border-gold hover:text-gold"
                aria-label="Tam ekran"
              >
                <Maximize2 size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="grid size-10 place-items-center border border-white/20 text-white transition hover:border-gold hover:text-gold"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              src={activeImage}
              alt={`${property.title} buyuk galeri`}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-gold hover:text-gold"
              aria-label="Onceki fotograf"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:border-gold hover:text-gold"
              aria-label="Sonraki fotograf"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-white/10 p-3">
            {gallery.map((image, index) => (
              <button
                type="button"
                key={`lightbox-${image}-${index}`}
                onClick={() => setActiveImageIndex(index)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden border ${
                  index === activeImageIndex ? "border-gold" : "border-white/20 opacity-60"
                }`}
                aria-label={`${index + 1}. fotograf`}
              >
                <Image src={image} alt={`${property.title} lightbox thumbnail ${index + 1}`} fill loading="lazy" sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
