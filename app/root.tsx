import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Lenis from "lenis";

// Self-hosted fonts (were Google Fonts: two extra origins and a
// render-blocking stylesheet on every page). Each weight's CSS lists
// per-script files behind unicode-range, so browsers fetch only the subsets a
// page actually uses — normally just latin.
import "@fontsource-variable/inter/index.css";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow/700.css";
import barlowBoldLatin from "@fontsource/barlow/files/barlow-latin-700-normal.woff2?url";

import type { Route } from "./+types/root";
import { TIMELINE, COMPANY } from "./lib/constants";
import Footer from "./components/ui/footer";
import "./app.css";
import NavBar from "./components/ui/navBar";
import { Toaster } from "./components/ui/sonner";
import ErrorPage from "./components/ui/error-page";
import { fetchOptional } from "./lib/api.server";
import { captureFirstTouch } from "./lib/attribution";
import { analyticsAllowed, gaBootstrapScript, needsConsentFor, readConsent } from "./lib/consent";
import { ConsentBanner } from "./components/ui/consent-banner";
import type { ContactInfo } from "./lib/types";

// Disabled for now (see App) but kept: lazy so its ~700 lines of animation
// code aren't in every page's root bundle while it isn't shown.
const IntroLoader = lazy(() => import("./components/ui/introLoader"));

const GA_MEASUREMENT_ID = "G-16QLSZ8K04";

/**
 * Pages Google Analytics must never see. Their URLs carry credentials
 * (/portal/accept-invite?uid=&token= — a token that claims the account;
 * unsubscribe links) or private client data (project ids, invoice pages), and
 * GA records the full page URL including the query string.
 */
const PRIVATE_PATH_PREFIXES = ["/portal", "/cpadmin", "/email-preferences"];

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const contactInfo = await fetchOptional<ContactInfo | null>("/contact-info", null);
  // Public by design (it is embedded in every Turnstile widget). Read at
  // runtime so a key change needs a restart, not a rebuild. See turnstile.tsx.
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY ?? "";
  // Error monitoring (see entry.client.tsx / lib/sentry.server.ts). A DSN is
  // public by design — it only allows sending events. Unset = no SDK at all.
  const sentryDsn = process.env.SENTRY_DSN?.trim() ?? "";
  const sentryEnvironment = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || "production";
  // EEA/UK/CH visitors get Consent Mode defaults and the banner (lib/consent.ts).
  // Locally there's no Cloudflare, so DEV_COUNTRY=DE (dev server only, never
  // in production) stands in for the header to show the banner.
  const country =
    request.headers.get("CF-IPCountry") ??
    (process.env.NODE_ENV === "production" ? null : (process.env.DEV_COUNTRY ?? null));
  const needsConsent = needsConsentFor(country);
  const consent = needsConsent ? readConsent(request.headers.get("Cookie")) : null;
  return { contactInfo, turnstileSiteKey, sentryDsn, sentryEnvironment, needsConsent, consent };
}

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  // Only the face every page's <h1> renders in. Preloading more fonts would
  // compete with the CSS and hero image for a phone's first round trips.
  {
    rel: "preload",
    href: barlowBoldLatin,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Weblaud LLC – Software Development Company" },
    {
      name: "description",
      content:
        "Weblaud LLC is a software company and innovation lab building the future of digital products and providing premium engineering services for global businesses.",
    },
    { property: "og:site_name", content: COMPANY.name },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: COMPANY.ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: COMPANY.twitterHandle },
    { name: "twitter:image", content: COMPANY.ogImage },
    { name: "theme-color", content: "#000000" },
    { name: "geo.region", content: "US-WY" },
    { name: "geo.placename", content: "Cheyenne" },
    { name: "geo.position", content: "41.1400;-104.8202" },
    { name: "ICBM", content: "41.1400, -104.8202" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  // Undefined while an error boundary renders after the root loader failed.
  const rootData = useRouteLoaderData<typeof loader>("root");
  const privatePage = isPrivatePath(pathname);

  // GA isn't loaded on a private page's first load (see the <head> below), but
  // a visitor who arrives on the marketing site and navigates client-side into
  // /portal or /cpadmin already has gtag running — and GA4 tracks history
  // changes on its own. Its documented opt-out flag stops that, and is cleared
  // again on the way back to a public page.
  useEffect(() => {
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = privatePage;
  }, [privatePage]);

  const needsConsent = rootData?.needsConsent ?? false;
  const consent = rootData?.consent ?? null;

  // Where this visitor first came from, for lead attribution. A no-op once
  // stored, never recorded from a portal/admin page, and — where consent is
  // required — only after the visitor accepts (the banner records it then).
  useEffect(() => {
    if (!privatePage && analyticsAllowed(needsConsent, consent)) captureFirstTouch();
  }, [privatePage, needsConsent, consent]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: COMPANY.url,
    logo: COMPANY.logo,
    image: COMPANY.ogImage,
    description:
      "Weblaud LLC is a software company and innovation lab building digital products, operations platforms, AI tools, and mobile apps for global businesses.",
    priceRange: "$$",
    knowsAbout: [
      "Software Engineering",
      "Web Development",
      "Mobile Application Development",
      "AI Integration & Machine Learning",
      "Cloud Infrastructure & DevOps",
      "Enterprise Operations Platforms",
    ],
    sameAs: COMPANY.sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: COMPANY.phone,
        contactType: "customer service",
        email: COMPANY.email,
        availableLanguage: ["English"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address.streetAddress,
      addressLocality: COMPANY.address.addressLocality,
      addressRegion: COMPANY.address.addressRegion,
      postalCode: COMPANY.address.postalCode,
      addressCountry: COMPANY.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: COMPANY.geo.latitude,
      longitude: COMPANY.geo.longitude,
    },
    areaServed: COMPANY.areaServed,
    employee: [
      { "@type": "Person", name: "Sakib Al Jaber", jobTitle: "Lead Software Engineer" },
      { "@type": "Person", name: "Manirul Islam", jobTitle: "Business Development" },
      { "@type": "Person", name: "Kazi Arif Ishtique", jobTitle: "Senior Software Engineer" },
      { "@type": "Person", name: "Shoaib Al Jayed", jobTitle: "Software Engineer" },
      { "@type": "Person", name: "Ruhul Amin", jobTitle: "Full Stack Engineer" },
      { "@type": "Person", name: "Jubayed Islam", jobTitle: "Software Engineer" },
      { "@type": "Person", name: "Shuvo Chandra", jobTitle: "Software Engineer" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software Engineering Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Operations Platforms Development",
            description: `Custom admin portals, internal tools, and operational workflows built in ${TIMELINE.rangeShort}.`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web & Mobile App Development",
            description: "High-performance cross-platform mobile apps and modern web applications.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI & Machine Learning Integration",
            description: "Custom AI models, RAG pipelines, predictive analytics, and automated decision engines.",
          },
        },
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {rootData?.sentryDsn && (
          <>
            <meta name="sentry-dsn" content={rootData.sentryDsn} />
            <meta name="sentry-environment" content={rootData.sentryEnvironment} />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics (GA4) — public marketing pages only.
            The page view is queued in dataLayer immediately, but gtag.js
            (~195 KB, with long tasks) is only fetched once the page has
            loaded and the main thread is idle, so it never competes with
            first paint on a phone. gtag.js replays the queue when it runs. */}
        {!privatePage && (
          <script
            dangerouslySetInnerHTML={{
              __html: gaBootstrapScript(GA_MEASUREMENT_ID, { needsConsent, consent }),
            }}
          />
        )}
      </head>
      <body className="[overflow-x:clip] antialiased">
        {children}
        {needsConsent && !privatePage && <ConsentBanner initialChoice={consent} />}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  // TEMPORARILY DISABLED (Change back to 'true', 'false' to re-enable loader in 5 months)
  const [showLoader, setShowLoader] = useState(false);
  const [isLoaderComplete, setIsLoaderComplete] = useState(true);
  const location = useLocation();
  // Both /cpadmin and /portal have their own header/sidebar chrome (see
  // routes/admin/layout.tsx and routes/portal/layout.tsx) and must never get
  // the marketing NavBar/Footer stacked on top of it.
  const hasOwnChrome =
    location.pathname.startsWith("/cpadmin") || location.pathname.startsWith("/portal");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
      if (hasSeenIntro) {
        setShowLoader(false);
        setIsLoaderComplete(true);
      } else {
        sessionStorage.setItem("hasSeenIntro", "true");
      }
    }
  }, []);

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Smooth scrolling only applies to mouse/trackpad wheels — Lenis leaves
    // touch scrolling native — yet its animation-frame loop below would run
    // every frame on phones for nothing. Skip it there, and for anyone who
    // asked their OS for reduced motion.
    const wantsSmoothScroll =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!wantsSmoothScroll) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
      (window as any).lenis = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [location.pathname]);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setIsLoaderComplete(true);
  };

  if (hasOwnChrome) {
    return <Outlet />;
  }

  return (
    // reducedMotion="user": framer-motion skips transform/layout animations
    // for visitors whose OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {showLoader && (
          <Suspense fallback={null}>
            <IntroLoader onComplete={handleLoaderComplete} />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isLoaderComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <NavBar />
            {/* initial={false}: the server-rendered page must be visible at
                first paint. Without it the SSR HTML shipped <main> at
                opacity 0 + blur, and nothing appeared until the JS had
                downloaded and hydrated (~4–5 s on a mid-range phone).
                Client-side route changes still fade. No filter: blur() —
                blurring the whole page is expensive on mobile GPUs. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.main
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.main>
            </AnimatePresence>
            <Footer contactInfo={loaderData.contactInfo} />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // A root-level boundary replaces the whole app tree, so the chrome has to be
  // rendered here by hand. The root loader may itself have failed, hence the
  // optional read of its data.
  const rootData = useRouteLoaderData<typeof loader>("root");
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/cpadmin");
  const isPortalRoute = location.pathname.startsWith("/portal");
  const hasOwnChrome = isAdminRoute || isPortalRoute;

  let code: string | undefined;
  let badge = "Something went wrong";
  let title = "Something went wrong on our end.";
  // Only claim someone was told when error monitoring is actually on.
  const notified = !!rootData?.sentryDsn;
  let description: string = notified
    ? "An unexpected error occurred while loading this page. Our team has been notified. Try again in a moment."
    : "An unexpected error occurred while loading this page. Try again in a moment — if it keeps happening, get in touch and we'll sort it out.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    code = String(error.status);

    if (error.status === 404) {
      badge = "Page not found";
      title = "This page took a wrong turn.";
      description =
        "The page you're looking for doesn't exist, or it may have been moved or renamed. Let's get you back on track.";
    } else if (error.status === 401 || error.status === 403) {
      badge = "Access denied";
      title = "You don't have access to this page.";
      description =
        "This area is restricted. If you believe you should have access, please sign in with an authorised account.";
    } else if (error.status >= 500) {
      badge = "Server error";
      title = "Our server hit a snag.";
      description = notified
        ? `Something failed while we were putting this page together. Our team has been notified — please try again shortly, or email ${COMPANY.email} if it's urgent.`
        : `Something failed while we were putting this page together. Please try again shortly — if it keeps happening, email ${COMPANY.email}.`;
    } else {
      title = error.statusText || title;
    }
  } else if (import.meta.env.DEV && error instanceof Error) {
    description = error.message;
    stack = error.stack;
  }

  const errorPage = (
    <ErrorPage
      code={code}
      badge={badge}
      title={title}
      description={description}
      primaryAction={
        isAdminRoute
          ? { label: "Back to Dashboard", to: "/cpadmin" }
          : isPortalRoute
            ? { label: "Back to Portal", to: "/portal" }
            : { label: "Back to Home", to: "/" }
      }
      suggestions={hasOwnChrome ? [] : undefined}
      detail={stack}
    />
  );

  // The admin panel and client portal each have their own chrome and never
  // render the marketing shell.
  if (hasOwnChrome) {
    return errorPage;
  }

  return (
    <>
      <NavBar />
      {errorPage}
      <Footer contactInfo={rootData?.contactInfo ?? null} />
    </>
  );
}
