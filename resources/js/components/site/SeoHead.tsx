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

const MAX_TITLE_LENGTH = 70;
const MAX_DESCRIPTION_LENGTH = 180;

function toAbsoluteUrl(url: string, appUrl: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return new URL(url.startsWith("/") ? url : `/${url}`, `${appUrl}/`).toString();
}

function compactText(value: string, maxLength: number): string {
  const text = value.replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function normalizeStructuredData(value: unknown, appUrl: string, parentKey = ""): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeStructuredData(item, appUrl, parentKey));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined && item !== null && item !== "")
        .map(([key, item]) => [key, normalizeStructuredData(item, appUrl, key)]),
    );
  }

  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    ["url", "logo", "image", "item", "target"].includes(parentKey)
  ) {
    return toAbsoluteUrl(value, appUrl);
  }

  return value;
}

function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
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
  const rawTitle = title?.trim() ? title : siteSettings.seoTitle;
  const metaTitle = compactText(rawTitle, MAX_TITLE_LENGTH);
  const metaDescription = compactText(description?.trim() ? description : siteSettings.seoDescription, MAX_DESCRIPTION_LENGTH);
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

  const schemaPayload = [organizationSchema, ...structuredData].map((item) => normalizeStructuredData(item, appUrl));

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta head-key="meta-description" name="description" content={metaDescription} />
      <meta head-key="meta-keywords" name="keywords" content={metaKeywords} />
      <meta
        head-key="meta-robots"
        name="robots"
        content={noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"}
      />
      <link head-key="canonical" rel="canonical" href={canonicalUrl} />

      <meta head-key="og-type" property="og:type" content={type} />
      <meta head-key="og-title" property="og:title" content={metaTitle} />
      <meta head-key="og-description" property="og:description" content={metaDescription} />
      <meta head-key="og-image" property="og:image" content={metaImage} />
      <meta head-key="og-url" property="og:url" content={canonicalUrl} />
      <meta head-key="og-site-name" property="og:site_name" content={siteSettings.siteName} />
      <meta head-key="og-locale" property="og:locale" content="tr_TR" />

      <meta head-key="twitter-card" name="twitter:card" content="summary_large_image" />
      <meta head-key="twitter-title" name="twitter:title" content={metaTitle} />
      <meta head-key="twitter-description" name="twitter:description" content={metaDescription} />
      <meta head-key="twitter-image" name="twitter:image" content={metaImage} />

      {schemaPayload.map((item, index) => (
        <script
          key={`schema-${index}`}
          head-key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(item) }}
        />
      ))}
    </Head>
  );
}
