import { Link } from "react-router";
import { FiArrowRight } from "react-icons/fi";
import type { Route } from "./+types/best-software-agency";
import IntentLandingPage from "~/components/landing/IntentLandingPage";
import { buildLandingMeta } from "~/lib/landing-schema";
import {
  bestSoftwareAgencyPage,
  vsPages,
  solutionPages,
  softwareDevelopmentCostPage,
} from "~/data/landing";

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta(_: Route.MetaArgs) {
  return buildLandingMeta(bestSoftwareAgencyPage);
}

/** Directory of related pages — makes this the internal-linking hub for the
 *  whole intent-landing system, which both readers and crawlers follow. */
function DirectorySection() {
  const links = [
    ...solutionPages.map((p) => ({ to: p.path, label: p.h1 })),
    ...vsPages.map((p) => ({ to: p.path, label: p.h1 })),
    { to: softwareDevelopmentCostPage.path, label: softwareDevelopmentCostPage.h1 },
  ];

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold font-barlow text-white mb-6">
        Find the Right Fit for Your Project
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="group flex items-center justify-between bg-card-bg/60 border border-light-black rounded-2xl p-5 hover:border-primary/40 hover:bg-white/5 transition-colors"
          >
            <span className="font-barlow font-semibold text-white text-sm sm:text-base pr-3">
              {link.label}
            </span>
            <FiArrowRight className="w-5 h-5 shrink-0 text-primary group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function BestSoftwareAgencyPage() {
  return (
    <IntentLandingPage config={bestSoftwareAgencyPage}>
      <DirectorySection />
    </IntentLandingPage>
  );
}
