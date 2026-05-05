import Container from "@/components/site/ui/Container";
import SectionTitle from "@/components/site/ui/SectionTitle";
import { MapPinned } from "lucide-react";

const regions = [
  { city: "İstanbul", focus: "Boğaz hattı, rezidans ve ticari portföy" },
  { city: "Kocaeli", focus: "Sanayi aksı, aile konutları ve yatırım arsaları" },
  { city: "Sakarya", focus: "Yeni gelişim bölgeleri ve villa portföyleri" },
  { city: "Yalova", focus: "Sahil yaşamı, termal bölge ve yazlık konutlar" },
];

export default function RegionalExpertise() {
  return (
    <section className="section-spacing bg-ivory">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionTitle
            eyebrow="Bölgesel Uzmanlık"
            title="Mikro lokasyon bilgisiyle daha doğru kararlar"
            description="Her bölgenin talep ritmi, fiyat dengesi ve yatırım potansiyeli farklıdır. Portföyleri bu gerçeklikle değerlendiririz."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {regions.map((region) => (
              <article key={region.city} className="border border-stone-line bg-white p-6 premium-card-shadow">
                <MapPinned className="text-gold" size={28} />
                <h3 className="mt-5 text-2xl font-semibold text-navy">{region.city}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{region.focus}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
