import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/edit";
import { apiFetch, ApiError, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { AdminService } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";

export async function loader({ params }: Route.LoaderArgs) {
  const service = await apiFetch<AdminService>(`/services/${params.id}`);
  return {
    service: {
      ...service,
      image: service.image ? resolveMediaUrl(service.image) : service.image,
    },
  };
}

export async function action({ request, params }: Route.ActionArgs) {
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

  const replaceImage = formData.get("replaceImage") === "on";
  const image = formData.get("image");
  if (replaceImage && image instanceof File && image.size > 0) {
    body.set("image", image);
  }

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/services/${params.id}`, { method: "PUT", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/services");
}

export default function EditService({ loaderData }: Route.ComponentProps) {
  const { service } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [replaceImage, setReplaceImage] = useState(false);

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Edit Service"
        description={service.title}
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
              <Input id="title" name="title" required defaultValue={service.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="h-24"
                required
                defaultValue={service.description}
              />
            </div>

            <div className="space-y-3 rounded-lg border border-white/10 p-4">
              <Label>Image</Label>
              {service.image && (
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-24 w-24 rounded-md object-cover"
                />
              )}
              <label className="flex items-center gap-2 text-sm text-white/70">
                <Checkbox
                  checked={replaceImage}
                  onCheckedChange={(v) => setReplaceImage(v === true)}
                  name="replaceImage"
                />
                Replace image
              </label>
              {replaceImage && <Input name="image" type="file" accept="image/*" />}
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                name="features"
                className="h-24"
                defaultValue={service.features.join("\n")}
              />
            </div>
          </CardContent>
        </Card>

        {actionData?.error && (
          <p className="text-red-400 text-sm">{actionData.error}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </Form>
    </div>
  );
}
