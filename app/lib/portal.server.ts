import { createCookieSessionStorage, redirect } from "react-router";
import { apiFetch, ApiError, withClientContext } from "./api.server";
import type { PortalUser } from "./types";

/**
 * Separate cookie from the admin panel's __weblaud_admin_session — the two
 * apps have different audiences (agency staff vs. clients+staff) and a
 * client token must never be usable against /cpadmin loaders or vice versa.
 * Mirrors app/lib/session.server.ts exactly; see that file for the reasoning
 * behind each piece (401-triggered refresh-and-redirect, etc.).
 *
 * Signed with its own secret (falling back to SESSION_SECRET if
 * PORTAL_SESSION_SECRET isn't set) rather than sharing one with the admin
 * cookie — a leaked signing key then only forges a session on the surface
 * it belongs to, not both.
 */
const sessionSecret = process.env.PORTAL_SESSION_SECRET ?? process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("PORTAL_SESSION_SECRET (or SESSION_SECRET) environment variable must be set");
}

interface PortalSessionData {
  accessToken: string;
  refreshToken: string;
  email: string;
}

export const portalSessionStorage = createCookieSessionStorage<PortalSessionData>({
  cookie: {
    name: "__weblaud_portal_session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    secrets: [sessionSecret],
    maxAge: 60 * 60 * 24 * 7, // 7 days — matches the backend's refresh-token lifetime
  },
});

export function getPortalSession(request: Request) {
  return portalSessionStorage.getSession(request.headers.get("Cookie"));
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function createPortalSession(tokens: AuthTokens, email: string) {
  const session = await portalSessionStorage.getSession();
  session.set("accessToken", tokens.accessToken);
  session.set("refreshToken", tokens.refreshToken);
  session.set("email", email);
  return portalSessionStorage.commitSession(session);
}

export async function destroyPortalSession(request: Request) {
  const session = await getPortalSession(request);
  return portalSessionStorage.destroySession(session);
}

/**
 * Runs an authenticated backend call. On a 401 (expired access token) it
 * refreshes tokens once and re-issues the request as a redirect back to the
 * same URL carrying the refreshed session cookie, since a cookie can only be
 * set on a Response, not retroactively on the one already in flight.
 */
export function callPortalApi<T>(
  request: Request,
  fn: (accessToken: string) => Promise<T>,
): Promise<T> {
  // Every backend call made here (including the token refresh) carries the
  // visitor's IP/user agent — see withClientContext. This is what puts the
  // signer's real IP on a contract acceptance.
  return withClientContext(request, () => runPortalApi(request, fn));
}

async function runPortalApi<T>(
  request: Request,
  fn: (accessToken: string) => Promise<T>,
): Promise<T> {
  const session = await getPortalSession(request);
  const accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");

  if (!accessToken || !refreshToken) {
    throw redirect("/portal/login");
  }

  try {
    return await fn(accessToken);
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 401) {
      throw err;
    }

    try {
      const tokens = await apiFetch<AuthTokens>("/auth/refresh", {
        method: "POST",
        body: { refreshToken },
      });
      session.set("accessToken", tokens.accessToken);
      session.set("refreshToken", tokens.refreshToken);
      throw redirect(request.url, {
        headers: { "Set-Cookie": await portalSessionStorage.commitSession(session) },
      });
    } catch (refreshErr) {
      if (refreshErr instanceof Response) throw refreshErr;
      throw redirect("/portal/login", {
        headers: {
          "Set-Cookie": await portalSessionStorage.destroySession(session),
        },
      });
    }
  }
}

/**
 * Loads the logged-in user (client or staff) from the backend rather than
 * trusting anything client-controlled, and redirects out if the session is
 * missing or the account isn't portal-eligible. EDITOR accounts exist only
 * for the marketing CMS and have no membership on any client project, so
 * they're turned away here rather than left to hit a 403 on every request.
 */
export async function requirePortalUser(request: Request): Promise<PortalUser> {
  const session = await getPortalSession(request);
  if (!session.get("accessToken")) {
    throw redirect("/portal/login");
  }

  const user = await callPortalApi(request, (accessToken) =>
    apiFetch<PortalUser>("/users/me", { accessToken }),
  );

  if (user.role === "editor") {
    throw redirect("/portal/login");
  }

  return user;
}
