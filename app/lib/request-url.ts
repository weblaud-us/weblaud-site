/**
 * The page URL a request stands for, with React Router's data-request
 * decoration taken back off.
 *
 * On a client-side navigation the browser doesn't fetch the page URL — it
 * fetches `/portal/projects/1/work/tasks.data?_routes=…`. React Router used to
 * rewrite that back to the page URL before a loader saw it; under
 * `future.v8_passThroughRequests` (react-router.config.ts) the loader gets the
 * request as it came off the wire, so any loader that reads a *page* path or
 * query string out of `request.url` — a redirect back to the current URL, a
 * path rewrite, a query string forwarded onwards — has to undo it itself.
 * Loaders that only read their own params (`?page=2`, `?paid=1`) need nothing.
 *
 * Mirrors React Router's own normalisation: the `.data` suffix in both the
 * `/page.data` form and the `/page/_.data` one that
 * `future.v8_trailingSlashAwareDataRequests` turns on, the internal `_routes`,
 * and the valueless `index` that marks an index route's own request (an
 * `index` param with a value is the page's own and stays).
 */
export function requestPageUrl(request: Request): URL {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname.endsWith("/_.data")) {
    // `/work/_.data` → `/work/`, and the root's `/_.data` → `/`.
    url.pathname = pathname.slice(0, -"_.data".length);
  } else if (pathname === "/_root.data") {
    url.pathname = "/";
  } else if (pathname.endsWith(".data")) {
    url.pathname = pathname.slice(0, -".data".length);
  }

  url.searchParams.delete("_routes");
  const indexValues = url.searchParams.getAll("index").filter(Boolean);
  url.searchParams.delete("index");
  for (const value of indexValues) url.searchParams.append("index", value);

  return url;
}
