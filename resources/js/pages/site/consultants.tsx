import ContactCTA from "@/components/site/ContactCTA";
import ConsultantsSection from "@/components/site/ConsultantsSection";
import SeoHead from "@/components/site/SeoHead";
import Container from "@/components/site/ui/Container";
import type { Consultant } from "@/types/site/consultant";

type ConsultantsPageProps = {
  consultants: Consultant[];
};

export default function ConsultantsPage({ consultants }: ConsultantsPageProps) {
  const description =
    "Akbulut Emlak uzman gayrimenkul danismanlari ile Kocaeli ve cevresindeki aktif satilik ve kiralik portfoyleri inceleyin.";

  return (
    <>
      <SeoHead
        title="Danismanlar | Akbulut Emlak"
        description={description}
        path="/consultants"
        keywords="emlak danismanlari, gayrimenkul danismanlari, akbulut emlak danismanlar"
      />

      <section className="relative overflow-hidden bg-navy px-5 py-24 text-white lg:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(135deg,rgba(198,161,91,0.20),rgba(255,255,255,0))]" />
        <Container className="relative px-0 lg:px-0">
          <p className="section-eyebrow">Danismanlar</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
            Uzman gayrimenkul danisman kadromuz
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-slate-200">{description}</p>
        </Container>
      </section>

      <ConsultantsSection consultants={consultants} />
      <ContactCTA />
    </>
  );
}
