import Button from "@/components/site/ui/Button";
import Container from "@/components/site/ui/Container";
import SectionTitle from "@/components/site/ui/SectionTitle";
import type { Consultant } from "@/types/site/consultant";
import { ArrowRight, BriefcaseBusiness, Home, KeyRound, MapPin, UserRound } from "lucide-react";

type ConsultantsSectionProps = {
  consultants: Consultant[];
};

export default function ConsultantsSection({ consultants }: ConsultantsSectionProps) {
  return (
    <section id="consultants" className="section-spacing scroll-mt-32 bg-light-gray">
      <Container>
        <div className="flex flex-col justify-between gap-6 border-b border-stone-line pb-8 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow={"Dan\u0131\u015fmanlar"}
            title={"Uzman Gayrimenkul Dan\u0131\u015fmanlar\u0131m\u0131z"}
            description={
              "B\u00f6lgesel piyasa bilgisi, g\u00fc\u00e7l\u00fc portf\u00f6y y\u00f6netimi ve profesyonel dan\u0131\u015fmanl\u0131k anlay\u0131\u015f\u0131yla size en do\u011fru gayrimenkul karar\u0131nda e\u015flik ediyoruz."
            }
          />
          <p className="max-w-sm text-sm leading-7 text-slate-500">
            {"Kocaeli ve \u00e7evresindeki mikro lokasyonlarda uzmanla\u015fm\u0131\u015f dan\u0131\u015fman kadromuzla portf\u00f6y"}
            <br />
            {"s\u00fcre\u00e7lerini g\u00fcvenle y\u00f6netiyoruz."}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {consultants.map((consultant) => (
            <article
              key={consultant.id}
              data-testid="consultant-card"
              className="group border border-stone-line bg-white p-6 premium-card-shadow transition duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_28px_80px_rgba(11,31,58,0.12)]"
            >
              <div className="flex items-center gap-4">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/45 bg-[linear-gradient(135deg,#0B1F3A,#16365F)] text-gold shadow-[0_18px_44px_rgba(11,31,58,0.20)]">
                  {consultant.avatar ? (
                    <img
                      src={consultant.avatar}
                      alt={consultant.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound size={34} />
                  )}
                  <span className="absolute inset-2 rounded-full border border-white/10" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold leading-7 text-navy">{consultant.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{consultant.title}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 border-y border-stone-line py-4 text-sm text-slate-600">
                <MapPin className="shrink-0 text-gold" size={18} />
                <span>{consultant.region ?? "-"}</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="border border-stone-line bg-light-gray px-2 py-3">
                  <BriefcaseBusiness className="mx-auto text-gold" size={18} />
                  <p className="mt-2 text-xl font-semibold text-navy">
                    {consultant.activePortfolioCount}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    {"Aktif"}
                  </p>
                </div>
                <div className="border border-stone-line bg-light-gray px-2 py-3">
                  <Home className="mx-auto text-gold" size={18} />
                  <p className="mt-2 text-xl font-semibold text-navy">
                    {consultant.salePortfolioCount}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    {"Sat\u0131l\u0131k"}
                  </p>
                </div>
                <div className="border border-stone-line bg-light-gray px-2 py-3">
                  <KeyRound className="mx-auto text-gold" size={18} />
                  <p className="mt-2 text-xl font-semibold text-navy">
                    {consultant.rentPortfolioCount}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    {"Kiral\u0131k"}
                  </p>
                </div>
              </div>

              <Button
                href={`/danisman/${consultant.slug}`}
                variant="outline"
                className="mt-6 w-full justify-between px-4"
              >
                {"Portf\u00f6ylerini G\u00f6r"}
                <ArrowRight size={17} />
              </Button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
