import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { resolveMeta, organizationSchema, SITE } from "@/seo/seo";

const OG_IMAGE = `${SITE.url}${SITE.defaultImage}`;

export const RouteSeo = () => {
  const location = useLocation();
  const pathname = location.pathname || "/";
  const meta = resolveMeta(pathname);
  const htmlLang = meta.lang === "ta" ? "ta-LK" : "en-LK";

  return (
    <Helmet prioritizeSeoTags>
      <html lang={htmlLang} />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={meta.robots} />
      <link rel="canonical" href={meta.canonical} />

      {/* Bilingual hreflang cluster (only on indexable pages with a translation) */}
      {meta.altUrl && meta.lang === "en" && (
        <link rel="alternate" hrefLang="en" href={meta.canonical} />
      )}
      {meta.altUrl && meta.lang === "en" && (
        <link rel="alternate" hrefLang="ta" href={meta.altUrl} />
      )}
      {meta.altUrl && meta.lang === "ta" && (
        <link rel="alternate" hrefLang="ta" href={meta.canonical} />
      )}
      {meta.altUrl && meta.lang === "ta" && (
        <link rel="alternate" hrefLang="en" href={meta.altUrl} />
      )}
      {meta.altUrl && meta.lang === "en" && (
        <link rel="alternate" hrefLang="x-default" href={meta.canonical} />
      )}

      <meta property="og:type" content={meta.ogType} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={meta.lang === "ta" ? "ta_LK" : "en_LK"} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={meta.canonical} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      <script type="application/ld+json">{JSON.stringify(organizationSchema())}</script>
    </Helmet>
  );
};
