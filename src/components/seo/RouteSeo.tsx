import { Helmet } from "react-helmet-async";
import { matchPath, useLocation } from "react-router-dom";

const SITE_NAME = "Raajeshwariy Groups";
const SITE_URL = "https://raajeshwariygroups.com";
const DEFAULT_IMAGE_URL = `${SITE_URL}/logo.png`;

type SeoMeta = {
  title: string;
  description: string;
  keywords?: string;
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
      keywords: `${hallName}, raajeshwariy, rajeswary, raajeswary, raajeshwary, rajeshwari, wedding hall Jaffna, mandapam Jaffna`,
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
      title: `${SITE_NAME} | Best Wedding Halls & Mandapams in Jaffna, Sri Lanka`,
      description:
        "Raajeshwariy Groups (Rajeswary / Raajeswary / Raajeshwary / Rajeshwari) — premium wedding halls & mandapams in Jaffna. Venues in Kondavil, Tellipalai, Kokuvil, Urumpirai. Book your dream wedding today! திருமண மண்டபம் யாழ்ப்பாணம்",
      keywords:
        "raajeshwariy, rajeswary, raajeswary, raajeshwary, rajeshwari, rajeshwariy, raajeshwari, rajeshwary, raajeshwariy groups, wedding halls Jaffna, marriage halls Jaffna, mandapam Jaffna, best wedding hall Jaffna, Chelva Mahal, Chelva Palace, Karpaka Raajeshwariy, Kondavil, Tellipalai, Kokuvil, Urumpirai, திருமண மண்டபம் யாழ்ப்பாணம், கல்யாண மண்டபம், ராஜேஸ்வரி",
    },
    "/halls": {
      title: `Wedding Halls in Jaffna | ${SITE_NAME} Mandapams | Book Now`,
      description:
        "Browse all Raajeshwariy (Rajeswary/Raajeswary/Raajeshwary) wedding halls in Jaffna. 5 premium mandapams in Kondavil, Tellipalai, Kokuvil, Urumpirai. AC halls, parking, catering. திருமண மண்டபம்",
      keywords:
        "raajeshwariy wedding halls, rajeswary halls Jaffna, wedding mandapam Jaffna, marriage hall Jaffna, Chelva Mahal, Chelva Palace, Karpaka Raajeshwariy, raajeshwary, rajeshwari, raajeswary",
    },
    "/services": {
      title: `Wedding Services in Jaffna | Decoration, Catering, Photography | ${SITE_NAME}`,
      description:
        "Complete wedding services by Raajeshwariy (Rajeswary) Groups: decoration, catering, photography, DJ, makeup, vehicles & more. One-stop wedding solution in Jaffna.",
      keywords:
        "wedding services Jaffna, wedding decoration Jaffna, wedding catering Jaffna, wedding photography Jaffna, raajeshwariy services, rajeswary, raajeswary",
    },
    "/menus": {
      title: `Wedding Menus & Catering | ${SITE_NAME} Jaffna | Veg & Non-Veg`,
      description:
        "Explore wedding catering menus by Raajeshwariy (Rajeswary) Groups. Traditional Tamil veg & non-veg options for weddings, receptions, puberty ceremonies. Affordable packages in Jaffna.",
      keywords:
        "wedding catering Jaffna, wedding menu Jaffna, Tamil wedding food, raajeshwariy catering, rajeswary menu, marriage food Jaffna",
    },
    "/about": {
      title: `About ${SITE_NAME} | 15+ Years of Wedding Excellence in Jaffna`,
      description:
        "Learn about Raajeshwariy (Rajeswary / Rajeshwari) Groups — Jaffna's leading wedding hall company with 15+ years of experience, 5 premium venues, and 500+ successful celebrations.",
      keywords:
        "about raajeshwariy, rajeswary groups history, wedding company Jaffna, raajeswary, raajeshwary, rajeshwari",
    },
    "/contact": {
      title: `Contact ${SITE_NAME} | Wedding Hall Enquiry Jaffna | Phone & Location`,
      description:
        "Contact Raajeshwariy (Rajeswary) Groups for wedding hall bookings in Jaffna. Phone numbers, addresses, and locations for all 5 venues. Get in touch today!",
      keywords:
        "contact raajeshwariy, rajeswary phone number, wedding hall booking Jaffna, raajeswary contact, raajeshwary address",
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
      title: `Wedding Photo Gallery | ${SITE_NAME} Jaffna | Event Photos`,
      description:
        "Browse wedding photos and event gallery from Raajeshwariy (Rajeswary) Groups venues in Jaffna. See past celebrations at Chelva Mahal, Chelva Palace, and more.",
      keywords:
        "wedding gallery Jaffna, wedding photos Jaffna, raajeshwariy photos, rajeswary gallery, event photos Jaffna",
    },
    "/charity": {
      title: `Charity Works | ${SITE_NAME} | Community Service Jaffna`,
      description:
        "Discover the charitable initiatives and community service works of Raajeshwariy (Rajeswary) Groups – giving back to society through food, education, and community support in Jaffna.",
      keywords:
        "raajeshwariy charity, rajeswary community service, charity Jaffna, social work Jaffna, raajeswary, raajeshwary",
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
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
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
