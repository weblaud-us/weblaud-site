const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:4000/api/v1";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

// Uploaded media comes back as either an absolute S3 URL or a local
// filesystem-relative path served off the API origin — normalize both to
// something an <img> tag can use directly.
export function resolveMediaUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${API_ORIGIN}/${pathOrUrl.replace(/^\/+/, "")}`;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  accessToken?: string;
}

const RETRY_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 150;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A loader that fans out (home fetches testimonials + FAQs + about at once,
 * and the root loader adds contact-info on top) opens several TLS connections
 * to the API in the same tick, and a few of that first burst come back
 * ECONNRESET before any response is read. Warm connections are then reused and
 * stay clean, so the failures cluster on the first render after an idle period
 * — which is exactly the request a real visitor makes. Left unhandled the
 * rejection reaches `fetchOptional`, which quietly swaps in placeholder
 * content, so the page renders "successfully" with sections missing.
 *
 * Only a transport-level throw counts as retryable here: an HTTP response —
 * even a 500 — means the request was received and answered, and is left to the
 * caller.
 */
function isRetryableTransportError(err: unknown): boolean {
  return err instanceof TypeError;
}

/**
 * Same URL/auth handling as `apiFetch` but hands back the raw `Response`.
 * For the handful of endpoints that answer outside the JSON envelope — the
 * applicant CSV export writes straight to the response stream, so `apiFetch`
 * (which requires `json.success`) can't read it.
 */
export async function apiFetchRaw(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { accessToken, body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;

  const init: RequestInit = {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  };

  // Reads only. A reset surfaces identically whether it happened before or
  // after the server processed the request, so replaying a write could submit
  // a second contact lead or job application — worse than the error.
  const method = (init.method ?? "GET").toUpperCase();
  const attempts =
    method === "GET" || method === "HEAD" ? RETRY_ATTEMPTS : 1;

  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fetch(`${API_BASE_URL}${path}`, init);
    } catch (err) {
      if (!isRetryableTransportError(err)) throw err;
      lastError = err;
      if (attempt < attempts - 1) {
        await sleep(RETRY_BASE_DELAY_MS * 2 ** attempt);
      }
    }
  }

  throw lastError;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const res = await apiFetchRaw(path, options);

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new ApiError(
      res.status,
      json?.message ?? res.statusText ?? "Request failed",
      json?.errors,
    );
  }

  return json.data as T;
}

/**
 * For content that must never break a page (testimonials, FAQs, services,
 * team, …): falls back to placeholder data on failure like a bare
 * `.catch()` would, but logs first. A silent `.catch(() => [])` turns a
 * backend outage into an empty section with zero trace anywhere; this at
 * least puts the failing endpoint in server/process logs so an extended
 * outage is discoverable instead of only noticed by whoever loads the page
 * while it's down. Pair with an uptime check against GET /api/v1/health for
 * real alerting — it reports database connectivity, and bare /health at the
 * origin is a 404.
 */
export async function fetchOptional<T>(
  path: string,
  fallback: T,
  options: ApiFetchOptions = {},
): Promise<T> {
  try {
    return await apiFetch<T>(path, options);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[api] ${path} unavailable, showing fallback content — ${message}`);
    return fallback;
  }
}
