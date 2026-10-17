import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

/**
 * Browser-side Sentry, errors only. The root route renders
 * <meta name="sentry-dsn"> only when SENTRY_DSN is set on the server, and
 * the SDK (lib/sentry.client.ts) is loaded lazily, so without a DSN not a
 * byte of it is in the page — the mobile performance budget stays as it
 * was. Errors raised before it finishes loading are forwarded once it has.
 */
const dsn = document.querySelector<HTMLMetaElement>('meta[name="sentry-dsn"]')?.content;
const environment =
  document.querySelector<HTMLMetaElement>('meta[name="sentry-environment"]')?.content || "production";

const sentry = dsn
  ? import("~/lib/sentry.client").then((m) => {
      m.startSentry(dsn, environment);
      return m;
    })
  : null;

const onError: React.ComponentProps<typeof HydratedRouter>["onError"] = (error, info) => {
  void sentry?.then((m) => m.sentryOnError(error, info));
};

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter onError={sentry ? onError : undefined} />
    </StrictMode>,
  );
});
