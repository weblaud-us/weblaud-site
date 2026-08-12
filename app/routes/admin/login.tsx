import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/login";
import { apiFetch, ApiError } from "~/lib/api.server";
import { createAdminSession, getSession } from "~/lib/session.server";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);
  if (session.get("accessToken")) {
    throw redirect("/cpadmin");
  }
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  try {
    const result = await apiFetch<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    const cookie = await createAdminSession(result, email);
    throw redirect("/cpadmin", { headers: { "Set-Cookie": cookie } });
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) {
      return { error: err.message };
    }
    return { error: "Something went wrong. Please try again." };
  }
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#0A84FF] text-lg font-bold text-white">
            W
          </div>
        </div>
        <h1 className="text-white text-2xl font-semibold mb-1 text-center">
          Admin Login
        </h1>
        <p className="text-white/50 text-sm mb-8 text-center">
          Sign in to manage weblaud.com content.
        </p>

        <Form method="post" className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="you@weblaud.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          {actionData?.error && (
            <p className="text-red-400 text-sm">{actionData.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
