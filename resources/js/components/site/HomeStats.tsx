import { useSiteSettings } from "@/hooks/use-site-settings";
import Container from "@/components/site/ui/Container";

export default function HomeStats() {
  const siteSettings = useSiteSettings();

  return (
    <section className="bg-white px-5 pt-8 lg:px-8">
      <Container className="px-0 lg:px-0">
        <div className="grid border border-stone-line bg-white premium-shadow sm:grid-cols-2 lg:grid-cols-4">
          {siteSettings.stats.map((stat) => (
            <div
              key={stat.label}
              className="border-b border-stone-line px-6 py-8 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0"
            >
              <p className="text-4xl font-semibold text-navy sm:text-5xl">{stat.value}</p>
              <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
