import { Form, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/contact-info";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ContactInfo } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";

const EMPTY: ContactInfo = { email: "", phone: "", address: "" };

export async function loader({ request }: Route.LoaderArgs) {
  const info = await callAdminApi(request, (accessToken) =>
    apiFetch<ContactInfo | null>("/contact-info", { accessToken }),
  );
  return { info: info ?? EMPTY };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const body: ContactInfo = {
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
  };

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch("/contact-info", { method: "PATCH", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }

  return { ok: true };
}

export default function AdminContactInfo({
  loaderData,
}: Route.ComponentProps) {
  const { info } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-md">
      <AdminPageHeader
        title="Contact Info"
        description="Address, email, and phone shown across the site."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={info.email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required defaultValue={info.phone} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                required
                defaultValue={info.address}
              />
            </div>

            {actionData?.error && (
              <p className="text-red-400 text-sm">{actionData.error}</p>
            )}
            {actionData?.ok && <p className="text-green-400 text-sm">Saved.</p>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
