import PropertyCard from "@/components/site/PropertyCard";
import Container from "@/components/site/ui/Container";
import SectionTitle from "@/components/site/ui/SectionTitle";
import type { Property } from "@/types/site/property";

type FeaturedListingsProps = {
  featuredProperties: Property[];
};

export default function FeaturedListings({ featuredProperties }: FeaturedListingsProps) {
  return (
    <section className="section-spacing bg-white">
      <Container>
        <div className="flex flex-col justify-between gap-6 border-b border-stone-line pb-8 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow="Premium Portföyler"
            title="Değeri yüksek, seçilmiş gayrimenkul portföyü"
            className="max-w-2xl"
          />
          <p className="max-w-xl leading-7 text-slate-600">
            Konut, villa, rezidans ve ticari portföylerde güncel piyasa verileriyle hazırlanmış
            nitelikli seçenekler.
          </p>
        </div>
        <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </Container>
    </section>
  );
}
