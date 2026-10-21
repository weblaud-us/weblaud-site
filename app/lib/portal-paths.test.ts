import { describe, expect, it } from "vitest";
import routes from "../routes";
import {
  LEGACY_SECTIONS,
  SECTION_DEFAULTS,
  SECTION_PATHS,
  legacyProjectRedirect,
  projectPath,
  sectionIndexRedirect,
} from "./portal-paths";

const ID = "507f1f77bcf86cd799439011";

describe("projectPath", () => {
  it("builds the tab URLs", () => {
    expect(projectPath(ID)).toBe(`/portal/projects/${ID}`);
    expect(projectPath(ID, "tasks")).toBe(`/portal/projects/${ID}/work/tasks`);
    expect(projectPath(ID, "discussion")).toBe(`/portal/projects/${ID}/discussion`);
    expect(projectPath(ID, "activity")).toBe(`/portal/projects/${ID}/activity`);
    expect(projectPath(ID, "changes")).toBe(`/portal/projects/${ID}/decisions/change-requests`);
    expect(projectPath(ID, "questions")).toBe(`/portal/projects/${ID}/decisions/questions`);
    expect(projectPath(ID, "contract")).toBe(`/portal/projects/${ID}/billing/contract`);
  });
});

describe("legacyProjectRedirect", () => {
  it.each([
    ["tasks", "work/tasks"],
    ["approvals", "decisions/approvals"],
    ["change-requests", "decisions/change-requests"],
    ["requests", "decisions/questions"],
    ["invoices", "billing/invoices"],
    ["contract", "billing/contract"],
  ])("sends /%s to /%s", (old, now) => {
    expect(legacyProjectRedirect(`https://weblaud.com/portal/projects/${ID}/${old}`)).toBe(
      `/portal/projects/${ID}/${now}`,
    );
  });

  it("keeps the query string (Stripe's ?paid=1 return)", () => {
    expect(legacyProjectRedirect(`/portal/projects/${ID}/invoices?paid=1`)).toBe(
      `/portal/projects/${ID}/billing/invoices?paid=1`,
    );
  });

  it("tolerates a trailing slash", () => {
    expect(legacyProjectRedirect(`/portal/projects/${ID}/tasks/`)).toBe(`/portal/projects/${ID}/work/tasks`);
  });

  it("ignores current URLs and unknown segments", () => {
    expect(legacyProjectRedirect(`/portal/projects/${ID}/files`)).toBeNull();
    expect(legacyProjectRedirect(`/portal/projects/${ID}/discussion`)).toBeNull();
    expect(legacyProjectRedirect(`/portal/projects/${ID}/activity`)).toBeNull();
    expect(legacyProjectRedirect(`/portal/projects/${ID}/work/tasks`)).toBeNull();
    expect(legacyProjectRedirect(`/portal/projects/${ID}/toString`)).toBeNull();
    expect(legacyProjectRedirect(`/portal/billing`)).toBeNull();
  });
});

describe("sectionIndexRedirect", () => {
  it("lands a bare tab URL on its first sub-page", () => {
    expect(sectionIndexRedirect(`/portal/projects/${ID}/work`)).toBe(`/portal/projects/${ID}/work/tasks`);
    expect(sectionIndexRedirect(`/portal/projects/${ID}/decisions/`)).toBe(
      `/portal/projects/${ID}/decisions/approvals`,
    );
    expect(sectionIndexRedirect(`/portal/projects/${ID}/billing?paid=1`)).toBe(
      `/portal/projects/${ID}/billing/invoices?paid=1`,
    );
  });

  it("leaves everything else alone", () => {
    expect(sectionIndexRedirect(`/portal/projects/${ID}/files`)).toBeNull();
    expect(sectionIndexRedirect(`/portal/projects/${ID}/work/tasks`)).toBeNull();
  });
});

/**
 * The maps above only describe URLs; app/routes.ts decides which ones exist.
 * Nothing used to compare the two, which is how `changes` stayed registered
 * while both maps had already moved to `/decisions/change-requests` — every
 * change-request notification link 404'd and this suite stayed green.
 */
describe("routes.ts registers every URL the maps emit", () => {
  type Entry = { path?: string; file: string; children?: Entry[] };

  function collect(entries: Entry[], prefix = ""): string[] {
    return entries.flatMap((entry) => {
      // index() has no path and resolves to its parent's URL.
      const full =
        entry.path === undefined
          ? prefix
          : `${prefix}/${entry.path}`.replace(/\/{2,}/g, "/");
      return [full, ...(entry.children ? collect(entry.children, full) : [])];
    });
  }

  const registered = new Set(collect(routes as Entry[]));

  it.each(Object.entries(SECTION_PATHS))(
    "serves the %s tab",
    (_section, suffix) => {
      expect(registered).toContain(`/portal/projects/:id${suffix}`);
    },
  );

  it.each(Object.keys(LEGACY_SECTIONS))("still serves the old /%s URL", (old) => {
    expect(registered).toContain(`/portal/projects/:id/${old}`);
  });

  it("lands every bare tab URL on a real sub-page", () => {
    for (const section of Object.keys(SECTION_DEFAULTS)) {
      const target = sectionIndexRedirect(`/portal/projects/:id/${section}`);
      expect(registered).toContain(target);
    }
  });
});
