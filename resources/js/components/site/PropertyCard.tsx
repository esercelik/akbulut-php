import Badge from "@/components/site/ui/Badge";
import Button from "@/components/site/ui/Button";
import Image from "@/components/site/SiteImage";
import type { Property } from "@/types/site/property";
import { ArrowRight, Bath, BedDouble, MapPin, Ruler } from "lucide-react";

type PropertyCardProps = {
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

export default function PropertyCard({ property }: PropertyCardProps) {
  const advisorName = property.advisor?.name?.trim() || "Akbulut Emlak";

  return (
    <article
      data-testid="property-card"
      className="group overflow-hidden rounded-[3px] border border-stone-line bg-white premium-card-shadow transition duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_28px_80px_rgba(11,31,58,0.14)]"
    >
      <div className="relative h-80 overflow-hidden bg-navy">
        <Image
          src={property.image}
          alt={property.title}
          width={900}
          height={640}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,24,46,0.72),rgba(7,24,46,0.04)_58%)]" />
        <Badge className="absolute left-4 top-4 bg-navy/90 text-gold backdrop-blur">
          {property.status}
        </Badge>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
            {property.type}
          </p>
          <p className="mt-1 text-3xl font-semibold text-white">{formatPrice(property.price)}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="min-w-0">
          <h3 className="mt-2 text-xl font-semibold leading-7 text-navy sm:min-h-[56px]">
            {property.title}
          </h3>
        </div>
        <p className="mt-3 text-sm font-medium text-slate-700">
          Danisman: <span className="text-navy">{advisorName}</span>
        </p>
        <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={17} className="text-gold" />
          {property.city}, {property.district}
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2 border-y border-stone-line py-4 text-sm text-slate-600">
          <span className="flex flex-col gap-2">
            <Ruler size={18} className="text-gold" />
            <span>{property.area} m2</span>
          </span>
          <span className="flex flex-col gap-2">
            <BedDouble size={18} className="text-gold" />
            <span>{property.rooms}</span>
          </span>
          <span className="flex flex-col gap-2">
            <Bath size={18} className="text-gold" />
            <span>{property.baths} Banyo</span>
          </span>
        </div>
        <Button
          href={`/ilan/${property.slug}`}
          variant="outline"
          className="mt-6 w-full justify-between px-4"
        >
          Detaylari Gor
          <ArrowRight size={17} />
        </Button>
      </div>
    </article>
  );
}
