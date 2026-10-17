import { describe, expect, it } from "vitest";
import { allLandingPages } from "./index";
import { LANDING_LINKS, relatedLandingLinks } from "./links";

describe("LANDING_LINKS", () => {
  it("lists exactly the pages in the landing catalog", () => {
    expect(LANDING_LINKS.map((l) => l.path).sort()).toEqual(
      allLandingPages.map((p) => p.path).sort(),
    );
  });
});

describe("relatedLandingLinks", () => {
  it("never links a page to itself and respects the limit", () => {
    for (const { path } of LANDING_LINKS) {
      const related = relatedLandingLinks(path, 6);
      expect(related).toHaveLength(6);
      expect(related.map((l) => l.path)).not.toContain(path);
      expect(new Set(related.map((l) => l.path)).size).toBe(related.length);
    }
  });

  it("leads with siblings and still reaches the other groups", () => {
    const related = relatedLandingLinks("/solutions/saas-mvp", 6);
    expect(related[0].group).toBe("solutions");
    expect(related.some((l) => l.group === "vs")).toBe(true);
    expect(related.some((l) => l.group === "guide")).toBe(true);
  });
});
