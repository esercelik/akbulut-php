import { BarChart3, Handshake, ShieldCheck, Workflow } from "lucide-react";

const reasons = [
  {
    title: "Güvenilir portföy",
    description: "Tüm ilanlar ön değerlendirmeden geçirilir ve gerçek ihtiyaçlara göre sunulur.",
    icon: ShieldCheck,
  },
  {
    title: "Profesyonel danışmanlık",
    description: "Satıcı, alıcı, kiracı ve yatırımcı hedeflerini aynı disiplinle yönetiriz.",
    icon: Handshake,
  },
  {
    title: "Şeffaf süreç yönetimi",
    description: "Fiyatlama, teklif, görüşme ve kapanış aşamalarında net iletişim kurarız.",
    icon: Workflow,
  },
  {
    title: "Bölgesel piyasa uzmanlığı",
    description: "Mikro lokasyon verileriyle doğru değer, doğru zaman ve doğru strateji.",
    icon: BarChart3,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="px-5 py-28 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="section-eyebrow">Neden Bizi Seçmelisiniz</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy sm:text-5xl">
            Güven veren kurumsal yaklaşım, ölçülebilir sonuçlar
          </h2>
          <p className="mt-5 leading-7 text-slate-600">
            Portföy kalitesi, piyasa okuması ve müzakere gücünü aynı masaya getirerek karar
            süreçlerinizi sadeleştiriyoruz.
          </p>
          <div className="mt-8 h-px w-full gold-divider" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              className="border border-stone-line bg-white p-7 premium-card-shadow"
            >
              <reason.icon className="text-gold" size={32} />
              <h3 className="mt-5 text-lg font-semibold text-navy">{reason.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{reason.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
