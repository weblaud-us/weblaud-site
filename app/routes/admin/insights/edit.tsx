import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/edit";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import { INSIGHT_CATEGORIES, type Insight } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";
import { Plus, X } from "lucide-react";

function parseContentSections(formData: FormData) {
  const headings = formData.getAll("content.heading");
  const texts = formData.getAll("content.text");
  const sections: { heading: string; text: string }[] = [];
  for (let i = 0; i < headings.length; i++) {
    const heading = String(headings[i] ?? "").trim();
    const text = String(texts[i] ?? "").trim();
    if (heading || text) sections.push({ heading, text });
  }
  return sections;
}

function linesToList(formData: FormData, key: string): string[] {
  return String(formData.get(key) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const insight = await callAdminApi(request, (accessToken) =>
    apiFetch<Insight>(`/insights/admin/${params.id}`, { accessToken }),
  );
  return { insight };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const body = {
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    category: String(formData.get("category") ?? ""),
    readTime: String(formData.get("readTime") ?? ""),
    publishedAt: String(formData.get("publishedAt") ?? ""),
    author: {
      name: String(formData.get("authorName") ?? ""),
      role: String(formData.get("authorRole") ?? ""),
      avatarUrl: String(formData.get("authorAvatarUrl") ?? "") || undefined,
    },
    directAnswer: String(formData.get("directAnswer") ?? ""),
    keyTakeaways: linesToList(formData, "keyTakeaways"),
    content: parseContentSections(formData),
    isActive: formData.get("isActive") === "on",
  };

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/insights/${params.id}`, { method: "PATCH", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/insights");
}

export default function EditInsight({ loaderData }: Route.ComponentProps) {
  const { insight } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [sections, setSections] = useState<number[]>(
    insight.content.length > 0
      ? insight.content.map((_, i) => i)
      : [0],
  );

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Edit Insight"
        description={insight.title}
        backTo="/cpadmin/insights"
      />

      <Form method="post" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={insight.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                name="summary"
                className="h-20"
                required
                defaultValue={insight.summary}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  name="category"
                  required
                  defaultValue={insight.category}
                >
                  {INSIGHT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="readTime">Read time</Label>
                <Input
                  id="readTime"
                  name="readTime"
                  required
                  defaultValue={insight.readTime}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published date</Label>
              <Input
                id="publishedAt"
                name="publishedAt"
                type="date"
                required
                defaultValue={insight.publishedAt.slice(0, 10)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Author</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authorName">Author name</Label>
                <Input
                  id="authorName"
                  name="authorName"
                  required
                  defaultValue={insight.author.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorRole">Author role</Label>
                <Input
                  id="authorRole"
                  name="authorRole"
                  required
                  defaultValue={insight.author.role}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorAvatarUrl">Avatar URL</Label>
                <Input
                  id="authorAvatarUrl"
                  name="authorAvatarUrl"
                  defaultValue={insight.author.avatarUrl}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AEO summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="directAnswer">Direct answer</Label>
              <Textarea
                id="directAnswer"
                name="directAnswer"
                className="h-24"
                required
                defaultValue={insight.directAnswer}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyTakeaways">Key takeaways (one per line)</Label>
              <Textarea
                id="keyTakeaways"
                name="keyTakeaways"
                className="h-24"
                defaultValue={insight.keyTakeaways.join("\n")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-base">Content sections</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSections((s) => [...s, (s.at(-1) ?? -1) + 1])}
            >
              <Plus className="size-4" />
              Add section
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {sections.map((key, i) => (
              <div
                key={key}
                className="space-y-2 border-t border-white/10 pt-3 first:border-0 first:pt-0"
              >
                <Input
                  name="content.heading"
                  placeholder="Heading"
                  defaultValue={insight.content[i]?.heading ?? ""}
                />
                <Textarea
                  name="content.text"
                  placeholder="Text"
                  className="h-20"
                  defaultValue={insight.content[i]?.text ?? ""}
                />
                {sections.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSections((s) => s.filter((_, idx) => idx !== i))
                    }
                  >
                    <X className="size-4" />
                    Remove section
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <label className="flex items-center gap-2 text-sm text-white/70">
          <Checkbox name="isActive" defaultChecked={insight.isActive} />
          Published (visible on the site)
        </label>

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
