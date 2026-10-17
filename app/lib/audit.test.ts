import { describe, expect, it } from "vitest";
import { failureMessage, looksLikeWebsite, scoreBand, vitalRows } from "./audit";

describe("scoreBand", () => {
  it("uses Lighthouse's 90 / 50 thresholds", () => {
    expect(scoreBand(100)).toBe("good");
    expect(scoreBand(90)).toBe("good");
    expect(scoreBand(89)).toBe("needs-work");
    expect(scoreBand(50)).toBe("needs-work");
    expect(scoreBand(49)).toBe("poor");
  });
});

describe("vitalRows", () => {
  it("formats each measured vital against Google's good threshold", () => {
    expect(vitalRows({ lcpMs: 2500, tbtMs: 812.6, cls: 0.046 })).toEqual([
      { label: "Largest Contentful Paint", value: "2.5 s", target: "≤ 2.5 s", good: true },
      { label: "Total Blocking Time", value: "813 ms", target: "≤ 200 ms", good: false },
      { label: "Cumulative Layout Shift", value: "0.05", target: "≤ 0.1", good: true },
    ]);
  });

  it("returns nothing when vitals are missing", () => {
    expect(vitalRows(undefined)).toEqual([]);
  });
});

describe("looksLikeWebsite", () => {
  it.each(["example.com", "https://shop.example.co.uk/path?q=1", "www.example.com"])(
    "accepts %s",
    (url) => expect(looksLikeWebsite(url)).toBe(true),
  );

  it.each(["", "localhost", "http://192.168.0.1", "ftp://example.com", "not a url"])(
    "rejects %j",
    (url) => expect(looksLikeWebsite(url)).toBe(false),
  );
});

describe("failureMessage", () => {
  it("explains each failure reason in plain words", () => {
    expect(failureMessage("unreachable")).toMatch(/couldn't load that page/);
    expect(failureMessage("quota")).toMatch(/very busy/);
    expect(failureMessage("timeout")).toMatch(/too long/);
    expect(failureMessage(undefined)).toMatch(/went wrong/);
  });
});
