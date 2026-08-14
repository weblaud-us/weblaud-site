import type { Route } from "./+types/for-startups";
import IntentLandingPage from "~/components/landing/IntentLandingPage";
import { buildLandingMeta } from "~/lib/landing-schema";
import { forStartupsPage } from "~/data/landing";

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta(_: Route.MetaArgs) {
  return buildLandingMeta(forStartupsPage);
}

export default function ForStartupsPage() {
  return <IntentLandingPage config={forStartupsPage} />;
}
