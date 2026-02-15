import { Helmet } from "react-helmet-async";
import { matchPath, useLocation } from "react-router-dom";

const SITE_NAME = "Raajeshwariy Groups";
const SITE_URL = "https://raajeshwariygroups.com";
const DEFAULT_IMAGE_URL = `${SITE_URL}/logo.png`;

type SeoMeta = {
  title: string;
  description: string;
  robots?: string;
  ogType?: "website" | "article";
};

const titleFromSlug = (slug: string): string =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getSeoMeta = (pathname: string): SeoMeta => {
  const hallMatch = matchPath("/halls/:slug", pathname);
  if (hallMatch?.params.slug) {
    const hallName = titleFromSlug(hallMatch.params.slug);
    return {
      title: `${hallName} | Wedding Hall in Jaffna | ${SITE_NAME}`,
      description: `Explore ${hallName} wedding hall in Jaffna with venue details, facilities, gallery photos, and availability.`,
      ogType: "article",
    };
  }

  if (pathname.startsWith("/admin")) {
    return {
      title: `Admin | ${SITE_NAME}`,
      description: "Admin dashboard",
      robots: "noindex, nofollow",
    };
  }

  const pageMetaByPath: Record<string, SeoMeta> = {
    "/": {
      title: `${SITE_NAME} | Best Wedding Halls in Jaffna | Premium Event Venues`,
      description:
        "Raajeshwariy Groups offers premium wedding halls and event venues in Jaffna across Chunnakam, Nallur, Tellipalai, Kopay, and Kondavil.",
    },
    "/halls": {
      title: `Wedding Halls in Jaffna | ${SITE_NAME}`,
      description:
        "Browse our premium wedding halls in Jaffna and choose the right venue for your wedding, reception, or family event.",
    },
    "/services": {
      title: `Wedding Venue Services in Jaffna | ${SITE_NAME}`,
      description:
        "Discover full wedding venue services including decorations, dining support, and event arrangements in Jaffna.",
    },
    "/menus": {
      title: `Wedding Catering Menus in Jaffna | ${SITE_NAME}`,
      description:
        "Explore catering and food menu options for weddings and receptions hosted at Raajeshwariy Groups venues.",
    },
    "/about": {
      title: `About Us | ${SITE_NAME}`,
      description:
        "Learn about Raajeshwariy Groups, our wedding hall legacy, values, and service commitment in Jaffna.",
    },
    "/contact": {
      title: `Contact | ${SITE_NAME}`,
      description:
        "Contact Raajeshwariy Groups for wedding hall bookings, venue inquiries, and service details in Jaffna.",
    },
    "/booking": {
      title: `Book A Wedding Hall | ${SITE_NAME}`,
      description:
        "Check availability and book your preferred Raajeshwariy Groups wedding hall in Jaffna.",
    },
    "/bungalows": {
      title: `Bungalows | ${SITE_NAME}`,
      description:
        "View bungalow options and amenities available through Raajeshwariy Groups in Jaffna.",
    },
    "/gallery": {
      title: `Photo Gallery | ${SITE_NAME}`,
      description:
        "See photos of wedding ceremonies, decorations, dining setups, and venues from Raajeshwariy Groups.",
    },
    "/auth": {
      title: `Sign In | ${SITE_NAME}`,
      description: "Login page",
      robots: "noindex, nofollow",
    },
    "/reset-password": {
      title: `Reset Password | ${SITE_NAME}`,
      description: "Password reset page",
      robots: "noindex, nofollow",
    },
  };

  return (
    pageMetaByPath[pathname] ?? {
      title: `Page Not Found | ${SITE_NAME}`,
      description: "The page you are looking for does not exist.",
      robots: "noindex, follow",
    }
  );
};

export const RouteSeo = () => {
  const location = useLocation();
  const pathname = location.pathname || "/";
  const meta = getSeoMeta(pathname);
  const canonicalUrl = pathname === "/" ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;
  const robots = meta.robots ?? "index, follow";
  const ogType = meta.ogType ?? "website";

  return (
    <Helmet prioritizeSeoTags>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={DEFAULT_IMAGE_URL} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE_URL} />
    </Helmet>
  );
};
