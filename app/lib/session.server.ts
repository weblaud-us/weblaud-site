import { createCookieSessionStorage, redirect } from "react-router";
import { apiFetch, ApiError } from "./api.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable must be set");
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
export async function callAdminApi<T>(
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

export async function requireAdminEmail(request: Request): Promise<string> {
  const session = await getSession(request);
  const accessToken = session.get("accessToken");
  const email = session.get("email");

  if (!accessToken || !email) {
    throw redirect("/cpadmin/login");
  }

  return email;
}
