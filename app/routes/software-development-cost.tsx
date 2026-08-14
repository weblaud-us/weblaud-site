import type { Route } from "./+types/software-development-cost";
import IntentLandingPage from "~/components/landing/IntentLandingPage";
import { buildLandingMeta } from "~/lib/landing-schema";
import { softwareDevelopmentCostPage } from "~/data/landing";

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta(_: Route.MetaArgs) {
  return buildLandingMeta(softwareDevelopmentCostPage);
}

export default function SoftwareDevelopmentCostPage() {
  return <IntentLandingPage config={softwareDevelopmentCostPage} />;
}
