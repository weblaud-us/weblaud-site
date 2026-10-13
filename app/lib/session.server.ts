import { createCookieSessionStorage, redirect } from "react-router";
import { apiFetch, ApiError, withClientContext } from "./api.server";
import type { PortalUser } from "./types";

// Falls back to SESSION_SECRET if ADMIN_SESSION_SECRET isn't set, so an
// existing deployment doesn't break on upgrade — but that fallback also
// means the admin and portal cookies are signed with the same secret unless
// this is set. Set ADMIN_SESSION_SECRET (distinct from portal.server.ts's
// PORTAL_SESSION_SECRET) so a leak of one signing key can't be replayed to
// forge a session on the other surface.
const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("ADMIN_SESSION_SECRET (or SESSION_SECRET) environment variable must be set");
}

interface AdminSessionData {
  accessToken: string;
  refreshToken: string;
  email: string;
}

export const sessionStorage = createCookieSessionStorage<AdminSessionData>({
  cookie: {
    name: "__weblaud_admin_session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    secrets: [sessionSecret],
    maxAge: 60 * 60 * 24 * 7, // 7 days — matches the backend's refresh-token lifetime
  },
});

export function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function createAdminSession(tokens: AuthTokens, email: string) {
  const session = await sessionStorage.getSession();
  session.set("accessToken", tokens.accessToken);
  session.set("refreshToken", tokens.refreshToken);
  session.set("email", email);
  return sessionStorage.commitSession(session);
}

export async function destroyAdminSession(request: Request) {
  const session = await getSession(request);
  return sessionStorage.destroySession(session);
}

/**
 * Runs an authenticated backend call. On a 401 (expired access token) it
 * refreshes tokens once and re-issues the request as a redirect back to the
 * same URL carrying the refreshed session cookie, since a cookie can only be
 * set on a Response, not retroactively on the one already in flight.
 */
export function callAdminApi<T>(
  request: Request,
  fn: (accessToken: string) => Promise<T>,
): Promise<T> {
  // Every backend call made here (including the token refresh) carries the
  // visitor's IP/user agent — see withClientContext.
  return withClientContext(request, () => runAdminApi(request, fn));
}

async function runAdminApi<T>(
  request: Request,
  fn: (accessToken: string) => Promise<T>,
): Promise<T> {
  const session = await getSession(request);
  const accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");

  if (!accessToken || !refreshToken) {
    throw redirect("/cpadmin/login");
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
        headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
      });
    } catch (refreshErr) {
      if (refreshErr instanceof Response) throw refreshErr;
      throw redirect("/cpadmin/login", {
        headers: {
          "Set-Cookie": await sessionStorage.destroySession(session),
        },
      });
    }
  }
}

/**
 * Loads the logged-in user from the backend and requires role === "admin".
 * Previously this only checked that a token existed (requireAdminEmail),
 * so any staff account (a PM, a developer — role "manager") could log into
 * /cpadmin/login and browse the panel, then hit a 403 the moment a page
 * called an admin-only endpoint (/users, /organizations, …) — the "error
 * when I click People / add a project" bug. Non-admins now get redirected
 * to their actual workspace instead of hitting that wall.
 */
export async function requireAdminUser(request: Request): Promise<PortalUser> {
  const session = await getSession(request);
  if (!session.get("accessToken")) {
    throw redirect("/cpadmin/login");
  }

  const user = await callAdminApi(request, (accessToken) =>
    apiFetch<PortalUser>("/users/me", { accessToken }),
  );

  if (user.role !== "admin") {
    // Destroy the admin cookie on the way out — otherwise a manager who
    // lands here keeps a live __weblaud_admin_session indefinitely, valid
    // for every /cpadmin loader that doesn't itself re-check role (and
    // usable to re-attempt this exact redirect loop forever).
    throw redirect("/portal", {
      headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
    });
  }

  return user;
}
