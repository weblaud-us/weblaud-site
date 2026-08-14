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
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Route } from "./+types/root";
import { TIMELINE, COMPANY } from "./lib/constants";
import Footer from "./components/ui/footer";
import "./app.css";
import NavBar from "./components/ui/navBar";
import { Toaster } from "./components/ui/sonner";
import IntroLoader from "./components/ui/introLoader";
import ErrorPage from "./components/ui/error-page";
import { fetchOptional } from "./lib/api.server";
import type { ContactInfo } from "./lib/types";

export async function loader() {
  const contactInfo = await fetchOptional<ContactInfo | null>("/contact-info", null);
  return { contactInfo };
}

const FONTS_URL =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900",
    "family=Barlow:wght@400;500;600;700",
    "display=swap",
  ].join("&");

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  { rel: "preconnect", href: "https://www.googletagmanager.com" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  // Preload the font CSS to eliminate render-blocking
  { rel: "preload", href: FONTS_URL, as: "style" },
  { rel: "stylesheet", href: FONTS_URL },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics (GA4) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-16QLSZ8K04"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-16QLSZ8K04');
            `,
          }}
        />
      </head>
      <body className="[overflow-x:clip] antialiased">
        {children}
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
  const isAdminRoute = location.pathname.startsWith("/cpadmin");

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setIsLoaderComplete(true);
  };

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && <IntroLoader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isLoaderComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <NavBar />
            <AnimatePresence mode="wait">
              <motion.main
                key={location.pathname}
                initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.main>
            </AnimatePresence>
            <Footer contactInfo={loaderData.contactInfo} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // A root-level boundary replaces the whole app tree, so the chrome has to be
  // rendered here by hand. The root loader may itself have failed, hence the
  // optional read of its data.
  const rootData = useRouteLoaderData<typeof loader>("root");
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/cpadmin");

  let code: string | undefined;
  let badge = "Something went wrong";
  let title = "Something went wrong on our end.";
  let description: string =
    "An unexpected error occurred while loading this page. Try again in a moment — if it keeps happening, get in touch and we'll sort it out.";
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
      description =
        "Something failed while we were putting this page together. Our team has been notified — please try again shortly.";
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
          : { label: "Back to Home", to: "/" }
      }
      suggestions={isAdminRoute ? [] : undefined}
      detail={stack}
    />
  );

  // The admin panel has its own chrome and never renders the marketing shell.
  if (isAdminRoute) {
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
