import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Route } from "./+types/root";
import Footer from "./components/ui/footer";
import "./app.css";
import NavBar from "./components/ui/navBar";
import { Toaster } from "./components/ui/sonner";
import IntroLoader from "./components/ui/introLoader";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?" +
      [
        "family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900",
        "family=Barlow:wght@400;500;600;700",
        "family=Poppins:wght@400;500;600;700",
        "family=Lexend:wght@400;500;600;700",
        "display=swap",
      ].join("&"),
  },
];

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Weblaud LLC – Software Development Company" },
    {
      name: "description",
      content:
        "Weblaud LLC — a software company and innovation lab building the future of digital products and providing premium engineering services for global businesses.",
    },
    { property: "og:site_name", content: "Weblaud LLC" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Weblaud LLC – Software Development Company",
    legalName: "Weblaud LLC",
    url: "https://weblaud.com",
    logo: "https://weblaud.com/favicon.png",
    image: "https://weblaud.com/og-image.jpg",
    sameAs: [
      "https://www.facebook.com/weblaud",
      "https://www.instagram.com/weblaud",
      "https://www.linkedin.com/company/weblaud",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-307-220-9766",
        contactType: "customer service",
        email: "info@weblaud.com",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "1621 Central Ave",
      addressLocality: "Cheyenne",
      addressRegion: "WY",
      postalCode: "82001",
      addressCountry: "US",
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
      </head>
      <body className="overflow-x-hidden antialiased">
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  // TEMPORARILY DISABLED (Change back to 'true', 'false' to re-enable loader in 5 months)
  const [showLoader, setShowLoader] = useState(false);
  const [isLoaderComplete, setIsLoaderComplete] = useState(true);

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

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setIsLoaderComplete(true);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && <IntroLoader onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {isLoaderComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <NavBar />
            <Outlet />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
