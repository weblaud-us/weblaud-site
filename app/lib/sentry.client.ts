/**
 * The browser half of error monitoring, loaded lazily by entry.client.tsx
 * only when the page carries a DSN. Named imports (rather than importing the
 * whole package dynamically) let the bundler drop the parts we don't use —
 * replay, feedback, tracing.
 */
import { init, sentryOnError } from "@sentry/react-router";
import { SENTRY_DATA_COLLECTION, scrubSentryEvent } from "~/lib/sentry-scrub";

export function startSentry(dsn: string, environment: string) {
  init({
    dsn,
    environment,
    tracesSampleRate: 0,
    dataCollection: SENTRY_DATA_COLLECTION,
    beforeSend: (event) => scrubSentryEvent(event),
    beforeBreadcrumb: (crumb) => scrubSentryEvent({ breadcrumbs: [crumb] }).breadcrumbs[0],
  });
}

export { sentryOnError };
