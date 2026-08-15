import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("aboutus", "routes/aboutus.tsx"),
  route("services", "routes/services.tsx"),
  route("projects", "routes/projects.tsx"),
  route("projects/:slug", "routes/projects.$slug.tsx"),
  route("calculator", "routes/calculator.tsx"),
  route("insights", "routes/insights.tsx"),
  route("insights/:slug", "routes/insights.$slug.tsx"),
  route("career", "routes/career.tsx"),
  route("career/:slug", "routes/career.$slug.tsx"),
  route("career/:slug/apply", "routes/career.$slug.apply.tsx"),
  // Intent landing pages (GEO content system). The /vs/* and /solutions/* groups
  // are data-driven: one dynamic route each, backed by the app/data/landing
  // catalog. Standalone hub/guide/segment pages get their own route files.
  route("vs/:slug", "routes/vs.$slug.tsx"),
  route("solutions/:slug", "routes/solutions.$slug.tsx"),
  route("best-software-agency", "routes/best-software-agency.tsx"),
  route("software-development-cost", "routes/software-development-cost.tsx"),
  route("for-startups", "routes/for-startups.tsx"),
  route("contact", "routes/contactUs.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("terms-of-service", "routes/terms-of-service.tsx"),
  route("robots.txt", "routes/robots.txt.ts"),
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("llms.txt", "routes/llms.txt.ts"),
  route("llms-full.txt", "routes/llms-full.txt.ts"),

  // URL prefix is deliberately "cpadmin", not "admin": keeps the panel off the
  // path every scanner probes first. The route *files* stay under routes/admin/.
  route("cpadmin/login", "routes/admin/login.tsx"),
  route("cpadmin", "routes/admin/layout.tsx", [
    index("routes/admin/dashboard.tsx"),
    route("projects", "routes/admin/projects/index.tsx"),
    route("projects/new", "routes/admin/projects/new.tsx"),
    route("projects/:id/edit", "routes/admin/projects/edit.tsx"),
    route("insights", "routes/admin/insights/index.tsx"),
    route("insights/new", "routes/admin/insights/new.tsx"),
    route("insights/:id/edit", "routes/admin/insights/edit.tsx"),
    route("services", "routes/admin/services/index.tsx"),
    route("services/new", "routes/admin/services/new.tsx"),
    route("services/:id/edit", "routes/admin/services/edit.tsx"),
    route("careers", "routes/admin/careers/index.tsx"),
    route("careers/new", "routes/admin/careers/new.tsx"),
    route("careers/:id/edit", "routes/admin/careers/edit.tsx"),
    route("team", "routes/admin/team.tsx"),
    route("testimonials", "routes/admin/testimonials.tsx"),
    route("faqs", "routes/admin/faqs.tsx"),
    route("about", "routes/admin/about.tsx"),
    route("calculator-config", "routes/admin/calculator-config.tsx"),
    route("contact-info", "routes/admin/contact-info.tsx"),
    route("contact-submissions", "routes/admin/contact-submissions.tsx"),
    route("estimate-submissions", "routes/admin/estimate-submissions.tsx"),
    route("applicants", "routes/admin/applicants.tsx"),
  ]),
  // Outside the admin layout: a resource route with no component, so it must
  // not be matched as a leaf that the layout tries to render.
  route("cpadmin/applicants/export", "routes/admin/applicants.export.ts"),

  // Must stay last: catch-all 404 for anything none of the above matched.
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
