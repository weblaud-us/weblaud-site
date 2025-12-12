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
    { title: "WebLaud - Your Digital Partner" },
    {
      name: "description",
      content: "WebLaud - Professional web development and digital solutions",
    },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WebLaud",
    url: "https://weblaud.com",
    logo: "https://weblaud.com/logo.png",
    sameAs: [
      "https://facebook.com/weblaud",
      "https://instagram.com/weblaud",
      "https://linkedin.com/company/weblaud",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+880-1577-466217",
      contactType: "customer service",
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
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [isLoaderComplete, setIsLoaderComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoaderComplete = () => {
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
