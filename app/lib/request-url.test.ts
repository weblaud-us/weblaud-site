import { describe, expect, it } from "vitest";
import { requestPageUrl } from "./request-url";

const at = (url: string) => requestPageUrl(new Request(`https://weblaud.com${url}`));

describe("requestPageUrl", () => {
  it("strips the data-request suffix", () => {
    expect(at("/portal/projects/1/work/tasks.data").pathname).toBe("/portal/projects/1/work/tasks");
    expect(at("/portal/billing.data").pathname).toBe("/portal/billing");
  });

  it("keeps a page's trailing slash when the suffix carries one", () => {
    expect(at("/portal/projects/1/work/_.data").pathname).toBe("/portal/projects/1/work/");
  });

  it("resolves both forms of the root request", () => {
    expect(at("/_.data").pathname).toBe("/");
    expect(at("/_root.data").pathname).toBe("/");
  });

  it("leaves a document request alone", () => {
    expect(at("/portal/billing?paid=1").href).toBe("https://weblaud.com/portal/billing?paid=1");
  });

  it("drops react-router's internal params and keeps the page's own", () => {
    expect(at("/portal/billing.data?_routes=routes%2Fportal%2Fbilling&paid=1").search).toBe("?paid=1");
    expect(at("/portal/billing.data?index&page=2").search).toBe("?page=2");
  });

  it("keeps an `index` param that has a value of its own", () => {
    expect(at("/portal/billing.data?index=3").search).toBe("?index=3");
  });

  it("does not mistake a page whose name ends in data", () => {
    expect(at("/insights/our-data").pathname).toBe("/insights/our-data");
  });
});
