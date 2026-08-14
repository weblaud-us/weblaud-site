import type { Route } from "./+types/vs.$slug";
import IntentLandingPage from "~/components/landing/IntentLandingPage";
import { buildLandingMeta } from "~/lib/landing-schema";
import { getVsPage } from "~/data/landing";

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export async function loader({ params }: Route.LoaderArgs) {
  const config = getVsPage(params.slug);
  if (!config) {
    throw new Response("Not Found", { status: 404 });
  }
  return { config };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.config) return [{ title: "Not Found" }];
  return buildLandingMeta(data.config);
}

export default function VsSlugPage({ loaderData }: Route.ComponentProps) {
  return <IntentLandingPage config={loaderData.config} />;
}
