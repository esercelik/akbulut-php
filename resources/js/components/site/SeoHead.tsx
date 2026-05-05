import { Head, usePage } from "@inertiajs/react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { usePathname } from "@/components/site/usePathname";

type StructuredData = Record<string, unknown>;

type SeoHeadProps = {
  title?: string;
  description?: string;
  image?: string | null;
  path?: string;
  type?: "website" | "article";
  keywords?: string;
  noIndex?: boolean;
  structuredData?: StructuredData[];
};

type SeoPageProps = {
  appUrl: string;
};

function toAbsoluteUrl(url: string, appUrl: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return new URL(url.startsWith("/") ? url : `/${url}`, `${appUrl}/`).toString();
}

export default function SeoHead({
  title,
  description,
  image,
  path,
  type = "website",
  keywords,
  noIndex = false,
  structuredData = [],
}: SeoHeadProps) {
  const pathname = usePathname();
  const siteSettings = useSiteSettings();
  const { props } = usePage<SeoPageProps>();
  const fallbackOrigin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
  const appUrl = (props.appUrl || fallbackOrigin).replace(/\/$/, "");
  const canonicalPath = path ?? pathname ?? "/";
  const canonicalUrl = toAbsoluteUrl(canonicalPath, appUrl);
  const metaTitle = title?.trim() ? title : siteSettings.seoTitle;
  const metaDescription = description?.trim() ? description : siteSettings.seoDescription;
  const metaKeywords = keywords?.trim() ? keywords : siteSettings.seoKeywords;
  const metaImage = toAbsoluteUrl(image?.trim() ? image : siteSettings.ogImageUrl, appUrl);
  const socialLinks = [
    siteSettings.instagramUrl,
    siteSettings.facebookUrl,
    siteSettings.youtubeUrl,
    siteSettings.linkedinUrl,
  ].filter(Boolean);

  const organizationSchema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteSettings.siteName,
    url: appUrl,
    logo: toAbsoluteUrl(siteSettings.logoUrl, appUrl),
    image: metaImage,
    telephone: siteSettings.phone,
    email: siteSettings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSettings.address,
      addressCountry: "TR",
    },
    sameAs: socialLinks,
  };

  const schemaPayload = [organizationSchema, ...structuredData];

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta head-key="meta-description" name="description" content={metaDescription} />
      <meta head-key="meta-keywords" name="keywords" content={metaKeywords} />
      <meta head-key="meta-robots" name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <link head-key="canonical" rel="canonical" href={canonicalUrl} />

      <meta head-key="og-type" property="og:type" content={type} />
      <meta head-key="og-title" property="og:title" content={metaTitle} />
      <meta head-key="og-description" property="og:description" content={metaDescription} />
      <meta head-key="og-image" property="og:image" content={metaImage} />
      <meta head-key="og-url" property="og:url" content={canonicalUrl} />
      <meta head-key="og-site-name" property="og:site_name" content={siteSettings.siteName} />

      <meta head-key="twitter-card" name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta head-key="twitter-title" name="twitter:title" content={metaTitle} />
      <meta head-key="twitter-description" name="twitter:description" content={metaDescription} />
      <meta head-key="twitter-image" name="twitter:image" content={metaImage} />

      {schemaPayload.map((item, index) => (
        <script
          key={`schema-${index}`}
          head-key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  );
}
