import type { LoaderFunctionArgs } from "react-router";
import { projects } from "~/data/projects";
import { insights, articleISODate } from "~/data/insights";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Fallback lastmod for pages without their own date. Update when static
  // content changes significantly.
  const defaultLastmod = "2026-08-06";

  const staticPages = [
    { path: "", priority: "1.0", changefreq: "weekly" },
    { path: "/aboutus", priority: "0.8", changefreq: "monthly" },
    { path: "/services", priority: "0.9", changefreq: "weekly" },
    { path: "/projects", priority: "0.8", changefreq: "weekly" },
    { path: "/calculator", priority: "0.9", changefreq: "weekly" },
    { path: "/insights", priority: "0.9", changefreq: "weekly" },
    { path: "/vs/in-house-engineers", priority: "0.8", changefreq: "weekly" },
    { path: "/vs/traditional-agencies", priority: "0.8", changefreq: "weekly" },
    { path: "/contact", priority: "0.7", changefreq: "yearly" },
    { path: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
    { path: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
  ];

  const projectPages = projects.map((project) => ({
    path: `/projects/${project.slug}`,
    priority: "0.7",
    changefreq: "monthly",
  }));

  const insightPages = insights.map((article) => ({
    path: `/insights/${article.slug}`,
    priority: "0.8",
    changefreq: "weekly",
    lastmod: articleISODate(article.date) || defaultLastmod,
  }));

  const pages = [...staticPages, ...projectPages, ...insightPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(({ path, priority, changefreq, ...rest }) => {
      const pageLastmod = "lastmod" in rest ? (rest as { lastmod: string }).lastmod : defaultLastmod;
      return `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${pageLastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("")}
</urlset>
`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};


