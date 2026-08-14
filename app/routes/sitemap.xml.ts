import type { LoaderFunctionArgs } from "react-router";
import { fetchOptional } from "~/lib/api.server";
import type { Career, Insight } from "~/lib/types";
import type { BackendProject } from "~/lib/adapters/project.server";
import { allLandingPages } from "~/data/landing";

function articleISODate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const [projects, insights, careers] = await Promise.all([
    fetchOptional<BackendProject[]>("/projects", []),
    fetchOptional<Insight[]>("/insights", []),
    fetchOptional<Career[]>("/careers", []),
  ]);

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
    { path: "/career", priority: "0.7", changefreq: "weekly" },
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
    lastmod: articleISODate(article.publishedAt) || defaultLastmod,
  }));

  const careerPages = careers.map((job) => ({
    path: `/career/${job.slug}`,
    priority: "0.7",
    changefreq: "weekly",
  }));

  // Intent landing pages (/vs/*, /solutions/*, hub, cost, segment) from the
  // catalog. The head-term hub gets top priority; the rest are high-value too.
  const landingPages = allLandingPages.map((page) => ({
    path: page.path,
    priority: page.path === "/best-software-agency" ? "0.9" : "0.8",
    changefreq: "weekly",
  }));

  const pages = [
    ...staticPages,
    ...landingPages,
    ...projectPages,
    ...insightPages,
    ...careerPages,
  ];

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


