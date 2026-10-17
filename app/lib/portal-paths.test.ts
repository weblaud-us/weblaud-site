import { describe, expect, it } from "vitest";
import { legacyProjectRedirect, projectPath, sectionIndexRedirect } from "./portal-paths";

const ID = "507f1f77bcf86cd799439011";

describe("projectPath", () => {
  it("builds the six-tab URLs", () => {
    expect(projectPath(ID)).toBe(`/portal/projects/${ID}`);
    expect(projectPath(ID, "tasks")).toBe(`/portal/projects/${ID}/work/tasks`);
    expect(projectPath(ID, "discussion")).toBe(`/portal/projects/${ID}/updates/discussion`);
    expect(projectPath(ID, "questions")).toBe(`/portal/projects/${ID}/decisions/questions`);
    expect(projectPath(ID, "contract")).toBe(`/portal/projects/${ID}/billing/contract`);
  });
});

describe("legacyProjectRedirect", () => {
  it.each([
    ["tasks", "work/tasks"],
    ["discussion", "updates/discussion"],
    ["approvals", "decisions/approvals"],
    ["change-requests", "decisions/changes"],
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
