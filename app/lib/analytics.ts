/**
 * GA4 conversion events. gtag is only loaded on public pages (see root.tsx),
 * and the private-path opt-out flag there also silences it after client-side
 * navigation into /portal or /cpadmin — so calling this anywhere is safe; it
 * simply does nothing when analytics isn't running.
 *
 * Event names follow GA4's recommended set where one fits (generate_lead) so
 * they light up GA's built-in lead reports. Mark generate_lead as a key event
 * in GA4 Admin → Events for it to count as a conversion.
 */
type AnalyticsEvent =
  | {
      name: "generate_lead";
      params: { form: "contact" | "estimate" | "audit"; heard_about?: string };
    }
  | { name: "audit_run"; params: { strategy: "mobile" | "desktop" } }
  | { name: "book_call_click"; params: { location: string } }
  | { name: "calculator_step"; params: { step: number } };

export function track<E extends AnalyticsEvent>(name: E["name"], params: E["params"]) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  try {
    gtag("event", name, params);
  } catch {
    /* analytics must never break the page */
  }
}
