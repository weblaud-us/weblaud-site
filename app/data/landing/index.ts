import type { LandingPageConfig } from "~/lib/types";
import { vsPages } from "./vs";
import { solutionPages } from "./solutions";
import {
  bestSoftwareAgencyPage,
  softwareDevelopmentCostPage,
  forStartupsPage,
} from "./pages";

export { vsPages } from "./vs";
export { solutionPages } from "./solutions";
export {
  bestSoftwareAgencyPage,
  softwareDevelopmentCostPage,
  forStartupsPage,
} from "./pages";

/** Look up a /vs/:slug entry, or undefined if the slug isn't in the catalog. */
export function getVsPage(slug?: string): LandingPageConfig | undefined {
  return vsPages.find((p) => p.slug === slug);
}

/** Look up a /solutions/:slug entry, or undefined if the slug isn't in the catalog. */
export function getSolutionPage(slug?: string): LandingPageConfig | undefined {
  return solutionPages.find((p) => p.slug === slug);
}

/** Every landing page in the catalog — used to feed the sitemap. */
export const allLandingPages: LandingPageConfig[] = [
  ...vsPages,
  ...solutionPages,
  bestSoftwareAgencyPage,
  softwareDevelopmentCostPage,
  forStartupsPage,
];
