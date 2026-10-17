import * as Sentry from "@sentry/react-router";
import { SENTRY_DATA_COLLECTION, scrubSentryEvent } from "~/lib/sentry-scrub";

/**
 * Server-side Sentry, errors only. Initialised when entry.server loads,
 * which is enough for error capture (handleError in entry.server.tsx and
 * unhandled rejections) — performance tracing would need a --import preload,
 * and tracing is off. Does nothing unless SENTRY_DSN is set; PM2 delivers it
 * from .env (ecosystem.config.cjs).
 */
export const sentryDsn = process.env.SENTRY_DSN?.trim() || undefined;

if (sentryDsn && !Sentry.getClient()) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development",
    tracesSampleRate: 0,
    dataCollection: SENTRY_DATA_COLLECTION,
    beforeSend: (event) => scrubSentryEvent(event),
  });
}

export const sentryEnabled = !!sentryDsn;
