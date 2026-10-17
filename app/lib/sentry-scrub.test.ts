import { describe, expect, it } from "vitest";
import { scrubSentryEvent, stripQuery } from "./sentry-scrub";

describe("scrubSentryEvent", () => {
  it("drops the invite token, bodies, cookies, secret headers and user details", () => {
    const event = scrubSentryEvent({
      request: {
        url: "https://weblaud.com/portal/accept-invite?uid=1&token=secret",
        data: { password: "hunter2" },
        cookies: { __weblaud_portal_session: "x" },
        query_string: "uid=1&token=secret",
        headers: { Cookie: "a=b", Authorization: "Bearer x", "User-Agent": "Mozilla/5.0" },
      },
      user: { id: "u1", email: "a@b.test", ip_address: "1.2.3.4" },
      breadcrumbs: [
        { data: { from: "/email-preferences/unsubscribe?uid=1&token=t", to: "/portal" } },
        { data: { url: "/api?x=1", method: "GET" } },
      ],
      transaction: "/portal/accept-invite?uid=1&token=secret",
    });

    expect(event.request).toEqual({
      url: "https://weblaud.com/portal/accept-invite",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    expect(event.user).toEqual({ id: "u1" });
    expect(event.breadcrumbs[0].data).toEqual({ from: "/email-preferences/unsubscribe", to: "/portal" });
    expect(event.breadcrumbs[1].data).toEqual({ url: "/api", method: "GET" });
    expect(event.transaction).toBe("/portal/accept-invite");
  });

  it("leaves an event with nothing sensitive alone", () => {
    expect(scrubSentryEvent({ message: "boom" })).toEqual({ message: "boom" });
  });
});

describe("stripQuery", () => {
  it("drops the query string and fragment", () => {
    expect(stripQuery("/a?x=1#y")).toBe("/a");
    expect(stripQuery("https://weblaud.com/b#y")).toBe("https://weblaud.com/b");
    expect(stripQuery("/c")).toBe("/c");
  });
});
