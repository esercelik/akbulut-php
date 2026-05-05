import { ArrowRight } from "lucide-react";
import Link from "@/components/site/SiteLink";

export default function ContactCTA() {
  return (
    <section className="px-5 py-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden bg-navy px-6 py-16 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 border-l border-gold/20 bg-[linear-gradient(135deg,rgba(185,148,58,0.2),rgba(255,255,255,0))] lg:block" />
        <div>
          <p className="section-eyebrow">Stratejik danışmanlık</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">
            Doğru gayrimenkul kararını birlikte verelim.
          </h2>
        </div>
        <Link
          href="/contact"
          className="relative mt-8 inline-flex items-center justify-center gap-2 rounded-[2px] bg-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-navy transition hover:bg-gold-soft lg:mt-0"
        >
          Bizimle İletişime Geç
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
