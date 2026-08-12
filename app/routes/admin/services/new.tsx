import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/new";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const body = new FormData();
  body.set("title", String(formData.get("title") ?? ""));
  body.set("description", String(formData.get("description") ?? ""));

  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  for (const feature of features) {
    body.append("features", feature);
  }

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    body.set("image", image);
  }

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch("/services", { method: "POST", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/services");
}

export default function NewService() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="New Service"
        description="Add a service card to show on /services."
        backTo="/cpadmin/services"
      />

      <Form method="post" encType="multipart/form-data" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" className="h-24" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea id="features" name="features" className="h-24" />
            </div>
          </CardContent>
        </Card>

        {actionData?.error && (
          <p className="text-red-400 text-sm">{actionData.error}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Service"}
        </Button>
      </Form>
    </div>
  );
}
