import { describe, expect, it } from "vitest";
import {
  PERSON_NAME_PATTERN,
  followUpInputValue,
  isFollowUpDue,
  parseBudget,
  parseHeardAbout,
  parseTimeline,
  pipelineBodyFromForm,
  splitName,
} from "./leads";
import { readAttribution } from "./attribution";

const form = (fields: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
};

describe("pipelineBodyFromForm", () => {
  it("sends blanks as null so the backend clears them", () => {
    expect(
      pipelineBodyFromForm(
        form({ stage: "contacted", internalNotes: "  ", nextFollowUpAt: "", lostReason: "" }),
      ),
    ).toEqual({
      stage: "contacted",
      internalNotes: null,
      nextFollowUpAt: null,
      lostReason: null,
    });
  });

  it("stores a picked date as midnight UTC and round-trips it to the input", () => {
    const body = pipelineBodyFromForm(form({ nextFollowUpAt: "2026-10-20" }));
    expect(body.nextFollowUpAt).toBe("2026-10-20T00:00:00.000Z");
    expect(followUpInputValue(body.nextFollowUpAt!)).toBe("2026-10-20");
  });

  it("drops an unknown stage instead of sending it", () => {
    expect(pipelineBodyFromForm(form({ stage: "maybe" }))).not.toHaveProperty("stage");
  });
});

describe("isFollowUpDue", () => {
  const now = new Date("2026-10-13T09:00:00Z");
  it("is due on and after the date, not before", () => {
    expect(isFollowUpDue("2026-10-13T00:00:00.000Z", now)).toBe(true);
    expect(isFollowUpDue("2026-10-14T00:00:00.000Z", now)).toBe(false);
    expect(isFollowUpDue(undefined, now)).toBe(false);
  });
});

describe("splitName", () => {
  it("keeps everything after the first word as the last name", () => {
    expect(splitName("  Ada King Lovelace ")).toEqual({
      firstName: "Ada",
      lastName: "King Lovelace",
    });
    expect(splitName("Cher")).toEqual({ firstName: "Cher", lastName: "" });
  });
});

describe("parseHeardAbout", () => {
  it("accepts known answers only", () => {
    expect(parseHeardAbout("ai_assistant")).toBe("ai_assistant");
    expect(parseHeardAbout("")).toBeUndefined();
    expect(parseHeardAbout("tiktok")).toBeUndefined();
    expect(parseHeardAbout(null)).toBeUndefined();
  });
});

describe("readAttribution", () => {
  const withCookie = (cookie: string) =>
    new Request("https://weblaud.com/contact", { headers: { Cookie: cookie } });
  const encode = (value: unknown) => encodeURIComponent(JSON.stringify(value));

  it("reads the first-touch cookie among others", () => {
    const touch = { utmSource: "linkedin", landingPath: "/vs/in-house-engineers" };
    expect(readAttribution(withCookie(`a=1; wl_ft=${encode(touch)}; b=2`))).toEqual(touch);
  });

  it("re-validates the visitor-controlled cookie", () => {
    const touch = { utmSource: "x".repeat(500), evil: "<script>", referrer: 42 };
    expect(readAttribution(withCookie(`wl_ft=${encode(touch)}`))).toEqual({
      utmSource: "x".repeat(100),
    });
  });

  it("returns undefined for a missing, empty or garbled cookie", () => {
    expect(readAttribution(new Request("https://weblaud.com/"))).toBeUndefined();
    expect(readAttribution(withCookie(`wl_ft=${encode({})}`))).toBeUndefined();
    expect(readAttribution(withCookie("wl_ft=%7Bnot-json"))).toBeUndefined();
  });
});

describe("PERSON_NAME_PATTERN", () => {
  it("accepts real names in any script", () => {
    for (const name of ["Ada", "O'Brien", "O’Brien", "José", "Jean-Luc", "Mary Ann", "Ng", "李", "Zoë", "J. R."]) {
      expect(PERSON_NAME_PATTERN.test(name), name).toBe(true);
    }
  });

  it("rejects markup, digits, and leading punctuation", () => {
    for (const name of ["<a>", "Bob123", "http://x.y", "-Bob", " Bob", "'"]) {
      expect(PERSON_NAME_PATTERN.test(name), name).toBe(false);
    }
  });
});

describe("contact qualifiers", () => {
  it("keeps known budget and timeline answers", () => {
    expect(parseBudget("10k_20k")).toBe("10k_20k");
    expect(parseTimeline("asap")).toBe("asap");
  });

  it("drops blank and unknown answers so the API never sees them", () => {
    expect(parseBudget("")).toBeUndefined();
    expect(parseBudget("$1m")).toBeUndefined();
    expect(parseTimeline(null)).toBeUndefined();
    expect(parseTimeline("yesterday")).toBeUndefined();
  });
});
