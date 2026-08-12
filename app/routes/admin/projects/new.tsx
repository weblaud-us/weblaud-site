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

function linesToList(formData: FormData, key: string): string[] {
  return String(formData.get(key) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const body = new FormData();
  body.set("name", String(formData.get("name") ?? ""));
  body.set("description", String(formData.get("description") ?? ""));
  body.set("coverImageAlt", String(formData.get("coverImageAlt") ?? ""));
  body.set("problem", String(formData.get("problem") ?? ""));
  body.set("solution", String(formData.get("solution") ?? ""));
  body.set("businessImpact", String(formData.get("businessImpact") ?? ""));

  for (const feature of linesToList(formData, "featureList")) {
    body.append("featureList", feature);
  }
  for (const tech of linesToList(formData, "techStack")) {
    body.append("techStack", tech);
  }

  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0) {
    body.set("cover", cover);
  }
  const details = formData.getAll("details");
  for (const file of details) {
    if (file instanceof File && file.size > 0) {
      body.append("details", file);
    }
  }

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch("/projects", { method: "POST", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/projects");
}

export default function NewProject() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="New Project"
        description="Add a case study to show on /projects."
        backTo="/cpadmin/projects"
      />

      <Form method="post" encType="multipart/form-data" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" className="h-24" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cover">Cover image</Label>
                <Input id="cover" name="cover" type="file" accept="image/*" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverImageAlt">Cover image alt text</Label>
                <Input id="coverImageAlt" name="coverImageAlt" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="details">Detail images (up to 10)</Label>
              <Input id="details" name="details" type="file" accept="image/*" multiple />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Case study details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="featureList">Key features (one per line)</Label>
              <Textarea id="featureList" name="featureList" className="h-24" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem">Problem</Label>
              <Textarea id="problem" name="problem" className="h-24" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Solution</Label>
              <Textarea id="solution" name="solution" className="h-24" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech stack (one per line)</Label>
              <Textarea id="techStack" name="techStack" className="h-24" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessImpact">Business impact</Label>
              <Textarea id="businessImpact" name="businessImpact" className="h-24" />
            </div>
          </CardContent>
        </Card>

        {actionData?.error && (
          <p className="text-red-400 text-sm">{actionData.error}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </Form>
    </div>
  );
}
