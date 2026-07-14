import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const seo = JSON.parse(readFileSync(resolve("src/seo/seoData.json"), "utf8"));
const siteUrl = seo.site.url;
const lastmod = new Date().toISOString().slice(0, 10);

// Base paths that exist in both English and Tamil, with crawl hints.
const priorityFor = (base) => {
  if (base === "/") return { changefreq: "weekly", priority: "1.0" };
  if (base === "/halls" || base === "/booking") return { changefreq: "weekly", priority: "0.9" };
  if (base.startsWith("/halls/") || base.startsWith("/wedding-halls/"))
    return { changefreq: "weekly", priority: "0.8" };
  if (["/services", "/menus", "/gallery", "/contact"].includes(base))
    return { changefreq: "monthly", priority: "0.7" };
  return { changefreq: "monthly", priority: "0.6" };
};

// Public, indexable base paths (exclude legal pages from the crawl-priority set
// but still list them at low priority).
const basePaths = [
  ...Object.keys(seo.pages),
  ...Object.keys(seo.halls).map((s) => `/halls/${s}`),
  ...Object.keys(seo.areas).map((s) => `/wedding-halls/${s}`),
];

const taPath = (base) => (base === "/" ? "/ta" : `/ta${base}`);
const abs = (p) => `${siteUrl}${p}`;

// Each base path emits an English and a Tamil URL entry, cross-linked with
// xhtml:link hreflang alternates so Google clusters the two languages.
const urls = [];
for (const base of basePaths) {
  const { changefreq, priority } = priorityFor(base);
  const enUrl = abs(base);
  const taUrl = abs(taPath(base));
  const alternates = `    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="ta" href="${taUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />`;
  for (const loc of [enUrl, taUrl]) {
    urls.push(`  <url>
    <loc>${loc}</loc>
${alternates}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

const outputPath = resolve("public", "sitemap.xml");
writeFileSync(outputPath, xml, "utf8");
console.log(`Sitemap written to ${outputPath} with ${urls.length} URLs (lastmod=${lastmod})`);
