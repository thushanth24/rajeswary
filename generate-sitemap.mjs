import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const siteUrl = "https://raajeshwariygroups.com";
const lastmod = new Date().toISOString().slice(0, 10);

const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/halls", changefreq: "weekly", priority: "0.9" },
  { path: "/booking", changefreq: "weekly", priority: "0.9" },
  { path: "/menus", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "monthly", priority: "0.8" },
  { path: "/gallery", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/bungalows", changefreq: "monthly", priority: "0.6" },
  { path: "/charity", changefreq: "monthly", priority: "0.5" },
  { path: "/halls/chelva-mahal", changefreq: "weekly", priority: "0.8" },
  { path: "/halls/chelva-palace", changefreq: "weekly", priority: "0.8" },
  { path: "/halls/raajeshwariy-kondavil", changefreq: "weekly", priority: "0.8" },
  { path: "/halls/karpaka-raajeshwariy-urumpirai", changefreq: "weekly", priority: "0.8" },
  { path: "/halls/raajeshwariy-tellipalai", changefreq: "weekly", priority: "0.8" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const outputPath = resolve("public", "sitemap.xml");
writeFileSync(outputPath, xml, "utf8");
console.log(`Sitemap written to ${outputPath} with lastmod=${lastmod}`);
