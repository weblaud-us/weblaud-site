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
  route("vs/in-house-engineers", "routes/vs.in-house-engineers.tsx"),
  route("vs/traditional-agencies", "routes/vs.traditional-agencies.tsx"),
  route("contact", "routes/contactUs.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("terms-of-service", "routes/terms-of-service.tsx"),
  route("robots.txt", "routes/robots.txt.ts"),
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("llms.txt", "routes/llms.txt.ts"),
  route("llms-full.txt", "routes/llms-full.txt.ts"),
] satisfies RouteConfig;
