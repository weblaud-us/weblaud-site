/**
 * Project workspace URLs. Mirrors the backend's portal-links.util.ts, which
 * builds the links stored on notifications and sent in emails — keep the
 * two maps in step.
 *
 * Six top-level tabs (Overview, Work, Updates, Files, Decisions, Billing),
 * plus Time and Manage for staff. The pre-2026-10 flat tabs live on as
 * permanent redirects (LEGACY_SECTIONS), because notification links in the
 * database and in sent emails still point at them.
 */
export type ProjectSection =
  | "overview"
  | "tasks"
  | "timeline"
  | "updates"
  | "discussion"
  | "files"
  | "approvals"
  | "changes"
  | "questions"
  | "invoices"
  | "contract"
  | "time"
  | "manage";

const SECTION_PATHS: Record<ProjectSection, string> = {
  overview: "",
  tasks: "/work/tasks",
  timeline: "/work/timeline",
  updates: "/updates",
  discussion: "/updates/discussion",
  files: "/files",
  approvals: "/decisions/approvals",
  changes: "/decisions/changes",
  questions: "/decisions/questions",
  invoices: "/billing/invoices",
  contract: "/billing/contract",
  time: "/time",
  manage: "/manage",
};

export function projectPath(projectId: string, section: ProjectSection = "overview"): string {
  return `/portal/projects/${projectId}${SECTION_PATHS[section]}`;
}

/** Old flat tab segment → its section in the new structure. */
export const LEGACY_SECTIONS = {
  tasks: "tasks",
  discussion: "discussion",
  approvals: "approvals",
  "change-requests": "changes",
  requests: "questions",
  invoices: "invoices",
  contract: "contract",
} as const satisfies Record<string, ProjectSection>;

export type LegacySegment = keyof typeof LEGACY_SECTIONS;

/**
 * Where an old `/portal/projects/:id/<tab>` URL lives now, keeping its query
 * string (Stripe returns to `…/invoices?paid=1`). Null for anything that
 * isn't one of the old tabs.
 */
export function legacyProjectRedirect(url: string | URL): string | null {
  const { pathname, search } = typeof url === "string" ? new URL(url, "http://x") : url;
  const match = pathname.match(/^\/portal\/projects\/([^/]+)\/([^/]+)\/?$/);
  if (!match) return null;
  const [, projectId, segment] = match;
  if (!Object.hasOwn(LEGACY_SECTIONS, segment)) return null;
  return projectPath(projectId, LEGACY_SECTIONS[segment as LegacySegment]) + search;
}

/** First sub-page of each tab that has sub-pages — where the bare tab URL lands. */
export const SECTION_DEFAULTS = {
  work: "tasks",
  decisions: "approvals",
  billing: "invoices",
} as const;

export type SectionWithDefault = keyof typeof SECTION_DEFAULTS;

/** `/portal/projects/:id/work` → `/portal/projects/:id/work/tasks` (keeps the query string). */
export function sectionIndexRedirect(url: string | URL): string | null {
  const { pathname, search } = typeof url === "string" ? new URL(url, "http://x") : url;
  const match = pathname.match(/^(\/portal\/projects\/[^/]+\/([^/]+))\/?$/);
  if (!match) return null;
  const [, base, section] = match;
  if (!Object.hasOwn(SECTION_DEFAULTS, section)) return null;
  return `${base}/${SECTION_DEFAULTS[section as SectionWithDefault]}${search}`;
}
