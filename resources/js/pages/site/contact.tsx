import ContactRequestForm from "@/components/site/ContactRequestForm";
import SeoHead from "@/components/site/SeoHead";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const siteSettings = useSiteSettings();

  return (
    <>
      <SeoHead
        title={`Iletisim | ${siteSettings.siteName}`}
        description={`${siteSettings.siteName} ile iletisime gecin. Telefon, e-posta, adres ve WhatsApp bilgileriyle gayrimenkul talebiniz icin bize ulasin.`}
        path="/contact"
      />

      <div className="bg-ivory">
        <section className="relative overflow-hidden bg-navy px-5 py-24 text-white lg:px-8">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(135deg,rgba(185,148,58,0.18),rgba(255,255,255,0))]" />
          <div className="relative mx-auto max-w-7xl">
            <p className="section-eyebrow">Iletisim</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
              Dogru gayrimenkul karari icin goruselim
            </h1>
            <p className="mt-5 max-w-2xl leading-7 text-slate-200">
              Portfoy talebiniz, satis veya kiralama sureciniz icin uzman ekibimiz sizinle iletisime gecmeye hazir.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-5 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:px-8">
          <div className="space-y-5">
            {[
              {
                icon: MapPin,
                title: "Adres",
                text: siteSettings.address,
              },
              { icon: Phone, title: "Telefon", text: siteSettings.phone },
              { icon: Mail, title: "E-posta", text: siteSettings.email },
            ].map((item) => (
              <article key={item.title} className="border border-stone-line bg-white p-7 premium-card-shadow">
                <item.icon className="text-gold" size={28} />
                <h2 className="mt-4 text-xl font-semibold text-navy">{item.title}</h2>
                <p className="mt-2 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="min-w-0 border border-stone-line bg-white p-5 premium-shadow sm:p-8">
            <ContactRequestForm />
          </div>
        </section>
      </div>
    </>
  );
}
