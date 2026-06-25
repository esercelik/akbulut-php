import PropertyCard from "@/components/site/PropertyCard";
import SearchBar from "@/components/site/SearchBar";
import SeoHead from "@/components/site/SeoHead";
import Button from "@/components/site/ui/Button";
import Container from "@/components/site/ui/Container";
import type { ListingFilterOptions, ListingFilters } from "@/components/site/SearchBar";
import type { Property } from "@/types/site/property";
import { SearchX, SlidersHorizontal } from "lucide-react";

type ListingsPageProps = {
  properties: Property[];
  filters: ListingFilters;
  filterOptions: ListingFilterOptions;
};

export default function ListingsPage({
  properties,
  filters,
  filterOptions,
}: ListingsPageProps) {
  const hasListings = properties.length > 0;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Akbulut Emlak Ilanlari",
    description: "Satilik ve kiralik guncel gayrimenkul portfoyleri.",
    url: "/listings",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: properties.length,
      itemListElement: properties.slice(0, 24).map((property, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `/ilan/${property.slug}`,
        name: property.title,
      })),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "/" },
      { "@type": "ListItem", position: 2, name: "Ilanlar", item: "/listings" },
    ],
  };

  return (
    <>
      <SeoHead
        title="Ilanlar | Akbulut Emlak"
        description="Akbulut Emlak satilik ve kiralik guncel portfoylerini sehir, ilce, mahalle, emlak tipi ve fiyat araligina gore filtreleyin."
        path="/listings"
        structuredData={[collectionSchema, breadcrumbSchema]}
      />

      <div className="bg-light-gray">
        <section className="relative overflow-hidden bg-navy px-5 py-24 text-white lg:px-8">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(135deg,rgba(198,161,91,0.20),rgba(255,255,255,0))]" />
          <Container className="relative px-0 lg:px-0">
            <p className="section-eyebrow">Guncel Portfoy</p>
            <h1 className="mt-3 max-w-[290px] break-words text-4xl font-semibold leading-tight sm:max-w-3xl sm:text-6xl">
              Premium Ilanlar
            </h1>
            <p className="mt-5 max-w-[290px] break-words leading-7 text-slate-200 sm:max-w-2xl">
              Satilik ve kiralik seckin gayrimenkuller arasindan ihtiyaciniza uygun portfoyleri inceleyin.
            </p>
          </Container>
        </section>

        <section className="mx-4 grid max-w-7xl gap-6 px-0 py-12 sm:mx-5 sm:gap-8 sm:py-16 lg:mx-auto lg:grid-cols-[minmax(280px,320px)_minmax(0,1fr)] lg:px-8">
          <aside className="h-fit overflow-hidden border border-stone-line bg-white p-6 premium-card-shadow lg:sticky lg:top-32">
            <div className="flex items-start justify-between gap-4 border-b border-stone-line pb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
                  Detayli arama
                </p>
                <h2 className="mt-2 flex items-center gap-2 text-xl font-semibold text-navy">
                  <SlidersHorizontal className="text-gold" size={20} />
                  Filtreler
                </h2>
              </div>
            </div>

            <SearchBar filters={filters} filterOptions={filterOptions} compact />
          </aside>

          <div>
            <div className="mb-6 flex flex-col justify-between gap-4 border border-stone-line bg-white p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-slate-500">{properties.length} ilan listeleniyor</p>
                <h2 className="mt-1 text-2xl font-semibold text-navy">Secili Portfoyler</h2>
              </div>
              <select className="h-[48px] w-full rounded-[2px] border border-stone-line bg-white px-3 text-sm outline-none focus:border-gold sm:w-auto sm:min-w-[220px]">
                <option>Varsayilan siralama</option>
                <option>Fiyata gore artan</option>
                <option>Fiyata gore azalan</option>
                <option>Metrekareye gore</option>
              </select>
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
                <h3 className="mt-5 text-2xl font-semibold text-navy">Uygun ilan bulunamadi</h3>
                <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
                  Filtreleri genisleterek daha fazla premium portfoyu goruntuleyebilirsiniz.
                </p>
                <Button href="/listings" className="mt-7">
                  Filtreleri Temizle
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
