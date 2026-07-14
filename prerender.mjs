// Post-build prerender: writes a static index.html per public route into dist/
// with per-route <title>, description, canonical, hreflang, Open Graph and
// JSON-LD, so crawlers and social scrapers see correct metadata before any JS
// runs. Route→meta logic mirrors src/seo/seo.ts (both are driven by seoData.json).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

const DIST = resolve("dist");
const seo = JSON.parse(readFileSync(resolve("src/seo/seoData.json"), "utf8"));
const SITE = seo.site;
const OG_IMAGE = `${SITE.url}${SITE.defaultImage}`;
const template = readFileSync(join(DIST, "index.html"), "utf8");

// Trailing-slash canonical form — the host serves every non-root page at a
// trailing-slash URL, so canonical/hreflang/og:url must match it.
const canon = (p) => (p === "/" ? "/" : p.endsWith("/") ? p : `${p}/`);
const abs = (p) => `${SITE.url}${canon(p)}`;
const taPath = (base) => (base === "/" ? "/ta" : `/ta${base}`);
const enc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const mapUrl = (h) => `https://www.google.com/maps/search/?api=1&query=${h.lat},${h.lng}`;

// Resolve title/description/ogType and any per-page JSON-LD for a base path.
function resolveEntry(basePath, lang) {
  const pick = (en, ta) => (lang === "ta" && ta ? ta : en);

  const hallMatch = basePath.match(/^\/halls\/([^/]+)$/);
  if (hallMatch) {
    const h = seo.halls[hallMatch[1]];
    if (h) {
      const venueSchema = {
        "@context": "https://schema.org",
        "@type": "EventVenue",
        name: h.name,
        alternateName: h.alternateName,
        url: `${SITE.url}/halls/${hallMatch[1]}`,
        image: OG_IMAGE,
        telephone: h.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: h.street,
          addressLocality: "Jaffna",
          addressRegion: "Northern Province",
          postalCode: "40000",
          addressCountry: "LK",
        },
        geo: { "@type": "GeoCoordinates", latitude: h.lat, longitude: h.lng },
        hasMap: mapUrl(h),
        priceRange: "$$",
        openingHours: "Mo-Su 09:00-18:00",
      };
      return {
        title: pick(
          `${h.name} | Wedding Hall in ${h.area}, Jaffna`,
          `${h.nameTa} | ${h.areaTa} திருமண மண்டபம்`
        ),
        description: pick(
          `${h.name} in ${h.area}, Jaffna — venue details, facilities, photos and real-time availability. Address: ${h.street}. Call ${h.phone}.`,
          `${h.nameTa}, ${h.areaTa}, யாழ்ப்பாணம் — மண்டப விபரங்கள், வசதிகள், புகைப்படங்கள் மற்றும் காலி நாட்கள். தொடர்பு: ${h.phone}.`
        ),
        ogType: "article",
        jsonld: [venueSchema],
      };
    }
  }

  const areaMatch = basePath.match(/^\/wedding-halls\/([^/]+)$/);
  if (areaMatch) {
    const a = seo.areas[areaMatch[1]];
    if (a) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: a.faqs.map((f) => ({
          "@type": "Question",
          name: pick(f.q, f.qTa),
          acceptedAnswer: { "@type": "Answer", text: pick(f.a, f.aTa) },
        })),
      };
      return {
        title: pick(a.title, a.titleTa),
        description: pick(a.description, a.descriptionTa),
        ogType: "website",
        jsonld: [faqSchema],
      };
    }
  }

  const page = seo.pages[basePath];
  if (page) {
    return {
      title: pick(page.title, page.titleTa),
      description: pick(page.description, page.descriptionTa),
      ogType: "website",
      jsonld: [],
    };
  }
  return null;
}

// Inject resolved meta into the built template for one localized URL.
function render(basePath, lang) {
  const entry = resolveEntry(basePath, lang);
  if (!entry) return null;

  const canonical = abs(lang === "ta" ? taPath(basePath) : basePath);
  const altUrl = abs(lang === "ta" ? basePath : taPath(basePath));
  const enUrl = lang === "ta" ? altUrl : canonical;
  const taUrl = lang === "ta" ? canonical : altUrl;
  const title = enc(entry.title);
  const description = enc(entry.description);
  const htmlLang = lang === "ta" ? "ta-LK" : "en-LK";
  const ogLocale = lang === "ta" ? "ta_LK" : "en_LK";

  let html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${htmlLang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${description}" />`
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${canonical}" />`
    )
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${title}" />`
    )
    .replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${description}" />`
    )
    .replace(
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="${entry.ogType}" />`
    )
    .replace(
      /<meta property="og:locale" content="[^"]*" \/>/,
      `<meta property="og:locale" content="${ogLocale}" />`
    )
    .replace(
      /<meta name="twitter:url" content="[^"]*" \/>/,
      `<meta name="twitter:url" content="${canonical}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${title}" />`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${description}" />`
    );

  const head = [
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="alternate" hreflang="en" href="${enUrl}" />`,
    `<link rel="alternate" hreflang="ta" href="${taUrl}" />`,
    `<link rel="alternate" hreflang="x-default" href="${enUrl}" />`,
    ...entry.jsonld.map(
      (j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`
    ),
  ].join("\n    ");

  html = html.replace("</head>", `    ${head}\n  </head>`);
  return html;
}

// Enumerate every public base path (static pages + hall detail + area pages).
const basePaths = [
  ...Object.keys(seo.pages),
  ...Object.keys(seo.halls).map((s) => `/halls/${s}`),
  ...Object.keys(seo.areas).map((s) => `/wedding-halls/${s}`),
];

let count = 0;
for (const basePath of basePaths) {
  for (const lang of ["en", "ta"]) {
    const html = render(basePath, lang);
    if (!html) continue;
    const urlPath = lang === "ta" ? taPath(basePath) : basePath;
    const outDir = urlPath === "/" ? DIST : join(DIST, urlPath);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), html, "utf8");
    count++;
  }
}

console.log(`Prerendered ${count} route files into ${DIST}`);
