import seoData from "./seoData.json";

export type Lang = "en" | "ta";

export const SITE = seoData.site;
export const HALLS = seoData.halls as Record<string, HallSeo>;
export const AREAS = seoData.areas as Record<string, AreaSeo>;
export const PAGES = seoData.pages as Record<string, PageMeta>;

export interface PageMeta {
  title: string;
  description: string;
  titleTa?: string;
  descriptionTa?: string;
}

export interface HallSeo {
  name: string;
  nameTa: string;
  alternateName: string;
  area: string;
  areaTa: string;
  street: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface AreaFaq {
  q: string;
  a: string;
  qTa: string;
  aTa: string;
}

export interface AreaSeo {
  name: string;
  nameTa: string;
  hallSlugs: string[];
  title: string;
  description: string;
  titleTa: string;
  descriptionTa: string;
  intro: string;
  introTa: string;
  faqs: AreaFaq[];
}

export interface ResolvedMeta {
  title: string;
  description: string;
  robots: string;
  ogType: "website" | "article";
  canonical: string;
  /** Absolute URL of the alternate-language version, or null if none. */
  altUrl: string | null;
  lang: Lang;
}

const abs = (path: string) => `${SITE.url}${path === "/" ? "/" : path}`;

/** Strip a leading /ta prefix and report whether the path was Tamil. */
export function parseLangPath(pathname: string): { lang: Lang; basePath: string } {
  if (pathname === "/ta" || pathname === "/ta/") {
    return { lang: "ta", basePath: "/" };
  }
  if (pathname.startsWith("/ta/")) {
    return { lang: "ta", basePath: pathname.slice(3) };
  }
  return { lang: "en", basePath: pathname };
}

const localizedPath = (lang: Lang, basePath: string) =>
  lang === "ta" ? (basePath === "/" ? "/ta" : `/ta${basePath}`) : basePath;

/**
 * Given the current pathname, return the equivalent path in `target` language.
 * Used by the language switcher so toggling keeps the user on the same page
 * while moving between the /ta and English URL trees.
 */
export function switchLangPath(target: Lang, pathname: string): string {
  const { basePath } = parseLangPath(pathname || "/");
  return localizedPath(target, basePath);
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Resolve SEO metadata for any pathname (English or /ta Tamil, including
 * hall-detail and area landing pages). Shared by the runtime <RouteSeo> and
 * the static prerender script so both emit identical tags.
 */
export function resolveMeta(pathname: string): ResolvedMeta {
  const { lang, basePath } = parseLangPath(pathname || "/");
  const canonical = abs(localizedPath(lang, basePath));
  const altLang: Lang = lang === "en" ? "ta" : "en";

  const pick = (en: string, ta?: string) => (lang === "ta" && ta ? ta : en);
  const base = (title: string, description: string, extra: Partial<ResolvedMeta> = {}): ResolvedMeta => ({
    title,
    description,
    robots: "index, follow",
    ogType: "website",
    canonical,
    altUrl: abs(localizedPath(altLang, basePath)),
    lang,
    ...extra,
  });

  // Non-indexable / no-alt routes.
  if (basePath.startsWith("/admin") || basePath === "/auth" || basePath === "/reset-password") {
    return {
      title: `Admin | ${SITE.name}`,
      description: "Admin area.",
      robots: "noindex, nofollow",
      ogType: "website",
      canonical,
      altUrl: null,
      lang,
    };
  }

  // Hall detail pages.
  const hallMatch = basePath.match(/^\/halls\/([^/]+)\/?$/);
  if (hallMatch) {
    const slug = hallMatch[1];
    const hall = HALLS[slug];
    if (hall) {
      const name = pick(hall.name, hall.nameTa);
      const area = pick(hall.area, hall.areaTa);
      return base(
        pick(
          `${hall.name} | Wedding Hall in ${hall.area}, Jaffna`,
          `${hall.nameTa} | ${hall.areaTa} திருமண மண்டபம்`
        ),
        pick(
          `${hall.name} in ${hall.area}, Jaffna — venue details, facilities, photos and real-time availability. Address: ${hall.street}. Call ${hall.phone}.`,
          `${hall.nameTa}, ${hall.areaTa}, யாழ்ப்பாணம் — மண்டப விபரங்கள், வசதிகள், புகைப்படங்கள் மற்றும் காலி நாட்கள். தொடர்பு: ${hall.phone}.`
        ),
        { ogType: "article" }
      );
    }
    const name = titleFromSlug(slug);
    return base(
      `${name} | Wedding Hall in Jaffna | ${SITE.name}`,
      `${name} wedding hall in Jaffna — venue details, facilities and availability.`,
      { ogType: "article" }
    );
  }

  // Area landing pages.
  const areaMatch = basePath.match(/^\/wedding-halls\/([^/]+)\/?$/);
  if (areaMatch) {
    const area = AREAS[areaMatch[1]];
    if (area) {
      return base(pick(area.title, area.titleTa), pick(area.description, area.descriptionTa));
    }
  }

  // Static page map.
  const page = PAGES[basePath];
  if (page) {
    return base(pick(page.title, page.titleTa), pick(page.description, page.descriptionTa));
  }

  // 404.
  return {
    title: `Page Not Found | ${SITE.name}`,
    description: "The page you are looking for does not exist.",
    robots: "noindex, follow",
    ogType: "website",
    canonical,
    altUrl: null,
    lang,
  };
}

/** Organization schema — emitted site-wide once. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    alternateName: ["Rajeswary Groups", "Raajeswary Groups", "Raajeshwary Groups", "Rajeshwari Groups"],
    url: SITE.url,
    logo: `${SITE.url}${SITE.logo}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaffna",
      addressRegion: "Northern Province",
      addressCountry: "LK",
    },
    areaServed: { "@type": "Place", name: "Jaffna District" },
    sameAs: [],
  };
}

/** Google Maps directions URL for a venue (usable as schema hasMap). */
export function mapUrl(hall: HallSeo): string {
  return `https://www.google.com/maps/search/?api=1&query=${hall.lat},${hall.lng}`;
}
