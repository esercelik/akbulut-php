import Container from "@/components/site/ui/Container";
import SectionTitle from "@/components/site/ui/SectionTitle";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ayşe Demir",
    role: "Konut yatırımcısı",
    text: "Portföy seçimi ve fiyat değerlendirmesi çok netti. Süreç boyunca güven veren, sakin ve profesyonel bir ekip vardı.",
  },
  {
    name: "Kerem Arslan",
    role: "Şirket sahibi",
    text: "Ticari ofis arayışımızda lokasyon analizleri karar vermemizi kolaylaştırdı. Kurumsal beklentimizi fazlasıyla karşıladılar.",
  },
  {
    name: "Elif Sönmez",
    role: "Ev sahibi",
    text: "Kiralama süreci hızlı, kontrollü ve şeffaf ilerledi. Aday değerlendirmesinde gösterdikleri titizlik çok değerliydi.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-spacing bg-white">
      <Container>
        <SectionTitle
          eyebrow="Müşteri Yorumları"
          title="Güven duygusunu süreç boyunca görünür kılarız"
          description="Müşterilerimiz için sadece ilan değil, doğru karar almayı kolaylaştıran profesyonel bir danışmanlık deneyimi sunarız."
          align="center"
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="border border-stone-line bg-light-gray p-7">
              <Quote className="text-gold" size={30} />
              <p className="mt-6 leading-8 text-slate-700">{testimonial.text}</p>
              <div className="mt-7 border-t border-stone-line pt-5">
                <h3 className="font-semibold text-navy">{testimonial.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
