import {
  isRouteErrorResponse,
  Link,
  useNavigate,
  useRouteError,
} from "react-router";
import type { ReactNode } from "react";
import { Button } from "./button";
import pattern from "~/assets/geometric-pattern.svg";

interface ErrorAction {
  label: string;
  to: string;
}

interface ErrorPageProps {
  /** Large status code shown behind the heading, e.g. "404". Omit to hide it. */
  code?: string;
  /** Short badge above the heading, e.g. "Page not found". */
  badge?: string;
  title: string;
  description: ReactNode;
  /** Filled button. Defaults to sending the visitor home. */
  primaryAction?: ErrorAction;
  /** Renders a "Go back" button next to the primary action. */
  showBackButton?: boolean;
  /** Quick links rendered under the actions. Omit to hide the block. */
  suggestions?: ErrorAction[];
  /** Stack trace / technical detail — only ever passed in development. */
  detail?: string;
}

const DEFAULT_SUGGESTIONS: ErrorAction[] = [
  { label: "Our Services", to: "/services" },
  { label: "Our Projects", to: "/projects" },
  { label: "Project Estimator", to: "/calculator" },
  { label: "Engineering Insights", to: "/insights" },
  { label: "Contact Us", to: "/contact" },
];

const ErrorPage = ({
  code,
  badge,
  title,
  description,
  primaryAction = { label: "Back to Home", to: "/" },
  showBackButton = true,
  suggestions = DEFAULT_SUGGESTIONS,
  detail,
}: ErrorPageProps) => {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center px-4 sm:px-6 py-24 md:py-32">
      {/* Background treatment — matches the case study / insight detail pages. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern grid-fade-mask opacity-40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <img
          src={pattern}
          alt=""
          aria-hidden="true"
          className="w-56 md:w-80 absolute bottom-0 left-0 opacity-[0.07]"
        />
        <img
          src={pattern}
          alt=""
          aria-hidden="true"
          className="w-56 md:w-80 absolute top-0 right-0 opacity-[0.07] rotate-180"
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {code && (
          <p
            className="font-barlow font-bold leading-none select-none text-[6rem] sm:text-[9rem] md:text-[11rem] bg-linear-to-b from-white/25 to-white/0 bg-clip-text text-transparent"
            aria-hidden="true"
          >
            {code}
          </p>
        )}

        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/7 border border-white/20 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-white">
              {badge}
            </span>
          </div>
        )}

        <h1
          className={`font-barlow font-bold text-white text-3xl sm:text-4xl md:text-5xl leading-tight ${
            code && !badge ? "mt-2" : ""
          }`}
        >
          {title}
        </h1>

        <div className="mt-4 sm:mt-5 max-w-xl mx-auto text-sm sm:text-base text-dark-gray font-barlow leading-relaxed">
          {typeof description === "string" ? <p>{description}</p> : description}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          <Link to={primaryAction.to}>
            <Button className="text-xs font-bold px-9 py-4.5">
              {primaryAction.label}
            </Button>
          </Link>

          {showBackButton && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group inline-flex items-center justify-center px-7 py-3 rounded-lg text-xs font-barlow font-semibold text-white bg-white/3 backdrop-blur-md border border-white/15 hover:border-primary/50 transition-all duration-500"
            >
              Go Back
            </button>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="mt-12 pt-8 border-t border-light-black">
            <p className="text-xs uppercase tracking-[0.2em] text-dark-gray font-barlow mb-5">
              Or try one of these
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2.5">
              {suggestions.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-barlow text-gray bg-card-bg border border-light-black hover:border-primary/50 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {detail && (
          <pre className="mt-10 w-full max-w-full overflow-x-auto text-left text-xs text-dark-gray bg-card-bg border border-light-black rounded-xl p-4">
            <code>{detail}</code>
          </pre>
        )}
      </div>
    </main>
  );
};

export default ErrorPage;

interface RouteErrorBoundaryProps {
  /** Copy used only when the record genuinely doesn't exist (a 404). */
  notFound: Omit<ErrorPageProps, "code" | "detail">;
}

/**
 * Boundary for detail routes that look a record up by slug. A route boundary
 * catches *every* throw, so a failing API call would otherwise be reported to
 * the visitor as "this doesn't exist" — only a real 404 gets the not-found copy.
 */
export function RouteErrorBoundary({ notFound }: RouteErrorBoundaryProps) {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <ErrorPage code="404" {...notFound} />;
  }

  return (
    <ErrorPage
      code={isRouteErrorResponse(error) ? String(error.status) : undefined}
      badge="Something went wrong"
      title="We couldn't load this page."
      description="Something failed while we were fetching this content. Please try again in a moment — if it keeps happening, get in touch and we'll sort it out."
      primaryAction={notFound.primaryAction}
      suggestions={notFound.suggestions}
      detail={
        import.meta.env.DEV && error instanceof Error ? error.stack : undefined
      }
    />
  );
}
