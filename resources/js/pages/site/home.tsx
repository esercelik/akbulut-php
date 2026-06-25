import ContactCTA from "@/components/site/ContactCTA";
import ConsultantsSection from "@/components/site/ConsultantsSection";
import FeaturedListings from "@/components/site/FeaturedListings";
import HeroSection from "@/components/site/HeroSection";
import HomeStats from "@/components/site/HomeStats";
import ProcessSection from "@/components/site/ProcessSection";
import RegionalExpertise from "@/components/site/RegionalExpertise";
import SearchBar from "@/components/site/SearchBar";
import SeoHead from "@/components/site/SeoHead";
import ServicesSection from "@/components/site/ServicesSection";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import type { ListingFilterOptions } from "@/components/site/SearchBar";
import { useSiteSettings } from "@/hooks/use-site-settings";
import type { Consultant } from "@/types/site/consultant";
import type { Property } from "@/types/site/property";

type HomeProps = {
  filterOptions: ListingFilterOptions;
  featuredProperties: Property[];
  consultants: Consultant[];
};

export default function Home({ filterOptions, featuredProperties, consultants }: HomeProps) {
  const siteSettings = useSiteSettings();
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteSettings.siteName,
    url: "/",
    potentialAction: {
      "@type": "SearchAction",
      target: "/listings?city={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <SeoHead
        title={siteSettings.seoTitle}
        description={siteSettings.seoDescription}
        path="/"
        structuredData={[websiteSchema]}
      />
      <HeroSection />
      <SearchBar filterOptions={filterOptions} />
      <HomeStats />
      <FeaturedListings featuredProperties={featuredProperties} />
      <ConsultantsSection consultants={consultants} />
      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <RegionalExpertise />
      <WhyChooseUs />
      <ContactCTA />
    </>
  );
}
