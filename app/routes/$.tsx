import { data } from "react-router";
import type { Route } from "./+types/$";
import ErrorPage from "~/components/ui/error-page";

// Catch-all for any URL that matches no other route. Returning `data` with a
// 404 (rather than throwing) keeps the component and its meta in play, so the
// page renders with the site chrome while still answering with a real 404.
export function loader() {
  return data(null, { status: 404 });
}

export const meta: Route.MetaFunction = () => [
  { title: "Page Not Found (404) – Weblaud LLC" },
  {
    name: "description",
    content:
      "The page you are looking for could not be found. Explore Weblaud's services, projects, and insights instead.",
  },
  { name: "robots", content: "noindex, follow" },
];

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      badge="Page not found"
      title="This page took a wrong turn."
      description="The page you're looking for doesn't exist, or it may have been moved or renamed. Let's get you back on track."
    />
  );
}
