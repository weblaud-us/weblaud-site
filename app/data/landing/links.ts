/**
 * Short labels for every landing page in the catalog, for navigation (footer,
 * "Keep exploring" blocks). Kept separate from the catalog itself on purpose:
 * the footer renders on every page, and importing vs.ts/solutions.ts/pages.ts
 * there would ship all of their copy in the root bundle. links.test.ts fails
 * if this list and the catalog drift apart.
 */
export type LandingLinkGroup = "solutions" | "vs" | "guide";

export interface LandingLink {
  path: string;
  label: string;
  group: LandingLinkGroup;
}

export const LANDING_LINKS: LandingLink[] = [
  { path: "/solutions/saas-mvp", label: "SaaS MVP development", group: "solutions" },
  { path: "/solutions/operations-software", label: "Operations software", group: "solutions" },
  { path: "/solutions/mobile-apps", label: "Mobile app development", group: "solutions" },
  { path: "/solutions/ai-integration", label: "AI & LLM integration", group: "solutions" },
  { path: "/solutions/realtime-infrastructure", label: "Real-time infrastructure", group: "solutions" },
  { path: "/vs/in-house-engineers", label: "vs In-House Engineers", group: "vs" },
  { path: "/vs/traditional-agencies", label: "vs Traditional Agencies", group: "vs" },
  { path: "/vs/offshore-developers", label: "vs Offshore Developers", group: "vs" },
  { path: "/vs/freelancers", label: "vs Freelancers", group: "vs" },
  { path: "/vs/no-code", label: "Custom Software vs No-Code", group: "vs" },
  { path: "/best-software-agency", label: "Choosing a software agency", group: "guide" },
  { path: "/software-development-cost", label: "Pricing & cost guide", group: "guide" },
  { path: "/for-startups", label: "For startups", group: "guide" },
];

export const landingLinksIn = (group: LandingLinkGroup) =>
  LANDING_LINKS.filter((link) => link.group === group);

/**
 * Up to `limit` other landing pages for a "Keep exploring" block: siblings in
 * the same group first, then the rest — so every page links to every group
 * and none of them is an orphan reachable only from the sitemap.
 */
export function relatedLandingLinks(path: string, limit = 6): LandingLink[] {
  const current = LANDING_LINKS.find((link) => link.path === path);
  const others = LANDING_LINKS.filter((link) => link.path !== path);
  const siblings = others.filter((link) => link.group === current?.group);
  const rest = others.filter((link) => link.group !== current?.group);
  // Interleave the other groups so a short list still spans all of them.
  const byGroup = (["solutions", "vs", "guide"] as const).map((g) =>
    rest.filter((link) => link.group === g),
  );
  const mixed: LandingLink[] = [];
  for (let i = 0; byGroup.some((list) => i < list.length); i++) {
    for (const list of byGroup) if (list[i]) mixed.push(list[i]);
  }
  return [...siblings.slice(0, Math.ceil(limit / 2)), ...mixed].slice(0, limit);
}
