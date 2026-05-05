import Container from "@/components/site/ui/Container";
import SectionTitle from "@/components/site/ui/SectionTitle";
import { ClipboardCheck, FileCheck2, Gem, Handshake } from "lucide-react";

const steps = [
  {
    title: "İhtiyaç Analizi",
    description: "Bütçe, lokasyon, yatırım hedefi ve yaşam beklentilerini netleştiririz.",
    icon: ClipboardCheck,
  },
  {
    title: "Portföy Sunumu",
    description: "Sadece uygun ve doğrulanmış portföyleri profesyonel sunumla paylaşırız.",
    icon: Gem,
  },
  {
    title: "Profesyonel Değerlendirme",
    description: "Piyasa karşılaştırması, değer analizi ve pazarlık stratejisini hazırlarız.",
    icon: FileCheck2,
  },
  {
    title: "Satış / Kiralama Süreci",
    description: "Teklif, sözleşme ve teslim aşamalarını şeffaf biçimde yönetiriz.",
    icon: Handshake,
  },
];

export default function ProcessSection() {
  return (
    <section className="section-spacing bg-navy text-white">
      <Container>
        <SectionTitle
          eyebrow="Hizmet Sürecimiz"
          title="Her adımı ölçülü, şeffaf ve profesyonel yönetiriz"
          description="Kurumsal çalışma modelimiz; doğru beklenti, doğru portföy ve güvenli kapanış üzerine kurulur."
          inverse
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="border border-white/12 bg-white/[0.04] p-7">
              <div className="flex items-center justify-between">
                <step.icon className="text-gold" size={30} />
                <span className="text-sm font-semibold text-white/35">0{index + 1}</span>
              </div>
              <h3 className="mt-7 text-xl font-semibold">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{step.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
