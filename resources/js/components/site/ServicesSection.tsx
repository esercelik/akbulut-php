import { Building, ClipboardCheck, Home, KeyRound } from "lucide-react";

const services = [
  {
    title: "Konut satış danışmanlığı",
    description: "Doğru fiyatlama, güçlü sunum ve nitelikli alıcı eşleşmesiyle satış süreci.",
    icon: Home,
  },
  {
    title: "Kiralama hizmetleri",
    description: "Portföyünüz için güvenilir kiracı analizi ve düzenli süreç takibi.",
    icon: KeyRound,
  },
  {
    title: "Ticari gayrimenkul",
    description: "Ofis, mağaza ve yatırım mülklerinde lokasyon odaklı profesyonel danışmanlık.",
    icon: Building,
  },
  {
    title: "Ekspertiz ve portföy yönetimi",
    description: "Piyasa analizi, değerleme yaklaşımı ve sürdürülebilir portföy stratejisi.",
    icon: ClipboardCheck,
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-ivory px-5 py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="section-eyebrow">Kurumsal Hizmetler</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy sm:text-5xl">
              Gayrimenkul kararlarınıza bütüncül yaklaşım
            </h2>
          </div>
          <p className="max-w-2xl leading-7 text-slate-600 lg:justify-self-end">
            Her portföyü finansal hedef, yaşam beklentisi ve bölgesel potansiyel ekseninde ele
            alıyor; süreci baştan sona profesyonel standartlarda yönetiyoruz.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="group border border-stone-line bg-white p-7 transition hover:border-gold/50 hover:shadow-[0_22px_60px_rgba(7,24,46,0.08)]"
            >
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[2px] border border-gold/30 bg-gold-soft/35">
                <service.icon className="text-gold" size={28} />
              </div>
              <h3 className="mt-7 text-xl font-semibold text-navy">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
