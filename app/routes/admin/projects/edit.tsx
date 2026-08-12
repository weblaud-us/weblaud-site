import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/edit";
import { apiFetch, ApiError, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { BackendProject } from "~/lib/adapters/project.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";

function linesToList(formData: FormData, key: string): string[] {
  return String(formData.get(key) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function loader({ params }: Route.LoaderArgs) {
  const project = await apiFetch<BackendProject>(`/projects/${params.id}`);
  return {
    project: {
      ...project,
      coverImage: resolveMediaUrl(project.coverImage),
    },
    // Detail images double as form values (`keepDetails`) sent back to the
    // backend, so they must stay as raw paths — resolve display URLs separately.
    detailImageUrls: (project.detailImages ?? []).map((url) => resolveMediaUrl(url)),
  };
}

export async function action({ request, params }: Route.ActionArgs) {
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

  const replaceCover = formData.get("replaceCover") === "on";
  const cover = formData.get("cover");
  if (replaceCover && cover instanceof File && cover.size > 0) {
    body.set("cover", cover);
  } else {
    body.set("keepCover", "true");
  }

  for (const url of formData.getAll("keepDetails")) {
    body.append("keepDetails", String(url));
  }
  const details = formData.getAll("details");
  for (const file of details) {
    if (file instanceof File && file.size > 0) {
      body.append("details", file);
    }
  }

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/projects/${params.id}`, {
        method: "PATCH",
        accessToken,
        body,
      }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/projects");
}

export default function EditProject({ loaderData }: Route.ComponentProps) {
  const { project, detailImageUrls } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [replaceCover, setReplaceCover] = useState(false);

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Edit Project"
        description={project.name}
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
              <Input
                id="name"
                name="name"
                required
                maxLength={200}
                defaultValue={project.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="h-24"
                defaultValue={project.description}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 rounded-lg border border-white/10 p-4">
              <Label>Cover image</Label>
              {project.coverImage && (
                <img
                  src={project.coverImage}
                  alt={project.coverImageAlt || project.name}
                  className="h-32 w-32 rounded-md object-cover"
                />
              )}
              <label className="flex items-center gap-2 text-sm text-white/70">
                <Checkbox
                  checked={replaceCover}
                  onCheckedChange={(v) => setReplaceCover(v === true)}
                  name="replaceCover"
                />
                Replace cover image
              </label>
              {replaceCover && (
                <Input name="cover" type="file" accept="image/*" />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImageAlt">Cover image alt text</Label>
              <Input
                id="coverImageAlt"
                name="coverImageAlt"
                defaultValue={project.coverImageAlt}
              />
            </div>

            <div className="space-y-3 rounded-lg border border-white/10 p-4">
              <Label>Detail images</Label>
              {(project.detailImages ?? []).length === 0 && (
                <p className="text-white/40 text-sm">No detail images yet.</p>
              )}
              <div className="grid grid-cols-4 gap-3">
                {(project.detailImages ?? []).map((url, i) => (
                  <label key={url} className="space-y-1 text-xs text-white/60">
                    <img
                      src={detailImageUrls[i]}
                      alt=""
                      className="h-20 w-full rounded-md object-cover"
                    />
                    <span className="flex items-center gap-1.5">
                      <Checkbox name="keepDetails" value={url} defaultChecked />
                      Keep
                    </span>
                  </label>
                ))}
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="details">Add detail images</Label>
                <Input
                  id="details"
                  name="details"
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>
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
              <Textarea
                id="featureList"
                name="featureList"
                className="h-24"
                defaultValue={(project.featureList ?? []).join("\n")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem">Problem</Label>
              <Textarea
                id="problem"
                name="problem"
                className="h-24"
                defaultValue={project.problem}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Solution</Label>
              <Textarea
                id="solution"
                name="solution"
                className="h-24"
                defaultValue={project.solution}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech stack (one per line)</Label>
              <Textarea
                id="techStack"
                name="techStack"
                className="h-24"
                defaultValue={(project.techStack ?? []).join("\n")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessImpact">Business impact</Label>
              <Textarea
                id="businessImpact"
                name="businessImpact"
                className="h-24"
                defaultValue={project.businessImpact}
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
