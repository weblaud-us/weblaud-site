import { useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/about";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { AboutInfo } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";

const EMPTY_ABOUT: AboutInfo = {
  isActive: false,
  story: "",
  mission: "",
  stats: {
    clients: 0,
    projects: 0,
    successRate: 0,
    followers: 0,
    experienceYears: 0,
  },
  trackRecord: [],
};

export async function loader({ request }: Route.LoaderArgs) {
  const about = await callAdminApi(request, (accessToken) =>
    apiFetch<AboutInfo | null>("/about/admin", { accessToken }),
  );
  return { about: about ?? EMPTY_ABOUT };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "story") {
      await callAdminApi(request, (accessToken) =>
        apiFetch("/about/story", {
          method: "PATCH",
          accessToken,
          body: {
            story: String(formData.get("story") ?? ""),
            mission: String(formData.get("mission") ?? ""),
          },
        }),
      );
    } else if (intent === "stats") {
      await callAdminApi(request, (accessToken) =>
        apiFetch("/about/stats", {
          method: "PATCH",
          accessToken,
          body: {
            clients: Number(formData.get("clients") ?? 0),
            projects: Number(formData.get("projects") ?? 0),
            successRate: Number(formData.get("successRate") ?? 0),
            followers: Number(formData.get("followers") ?? 0),
            experienceYears: Number(formData.get("experienceYears") ?? 0),
          },
        }),
      );
    } else if (intent === "trackRecord") {
      const titles = formData.getAll("trackRecord.title");
      const subtitles = formData.getAll("trackRecord.subtitle");
      const trackRecord = titles
        .map((title, i) => ({
          title: String(title ?? "").trim(),
          subtitle: String(subtitles[i] ?? "").trim(),
        }))
        .filter((item) => item.title || item.subtitle);

      await callAdminApi(request, (accessToken) =>
        apiFetch("/about/track-record", {
          method: "PATCH",
          accessToken,
          body: { trackRecord },
        }),
      );
    }
    return { ok: true, intent };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message, intent };
    return { error: "Something went wrong.", intent };
  }
}

export default function AdminAbout({ loaderData }: Route.ComponentProps) {
  const { about } = loaderData;
  const storyFetcher = useFetcher<typeof action>();
  const statsFetcher = useFetcher<typeof action>();
  const trackFetcher = useFetcher<typeof action>();
  const [rows, setRows] = useState<number[]>(
    about.trackRecord.length > 0 ? about.trackRecord.map((_, i) => i) : [0],
  );

  return (
    <div className="max-w-2xl space-y-8">
      <AdminPageHeader
        title="About / Stats"
        description="Story, mission, stats, and track record shown on /aboutus."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Story & Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <storyFetcher.Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="story" />
            <div className="space-y-2">
              <Label htmlFor="story">Story</Label>
              <Textarea
                id="story"
                name="story"
                className="h-32"
                defaultValue={about.story}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mission">Mission</Label>
              <Textarea
                id="mission"
                name="mission"
                className="h-32"
                defaultValue={about.mission}
              />
            </div>
            {storyFetcher.data?.intent === "story" &&
              storyFetcher.data.error && (
                <p className="text-red-400 text-sm">
                  {storyFetcher.data.error}
                </p>
              )}
            <Button type="submit" disabled={storyFetcher.state !== "idle"}>
              {storyFetcher.state !== "idle" ? "Saving..." : "Save Story"}
            </Button>
          </storyFetcher.Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <statsFetcher.Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="stats" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clients">Clients</Label>
                <Input
                  id="clients"
                  name="clients"
                  type="number"
                  defaultValue={about.stats.clients}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projects">Projects</Label>
                <Input
                  id="projects"
                  name="projects"
                  type="number"
                  defaultValue={about.stats.projects}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="successRate">Success rate (%)</Label>
                <Input
                  id="successRate"
                  name="successRate"
                  type="number"
                  defaultValue={about.stats.successRate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followers">Followers</Label>
                <Input
                  id="followers"
                  name="followers"
                  type="number"
                  defaultValue={about.stats.followers}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Experience (years)</Label>
                <Input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  defaultValue={about.stats.experienceYears}
                />
              </div>
            </div>
            {statsFetcher.data?.intent === "stats" &&
              statsFetcher.data.error && (
                <p className="text-red-400 text-sm">
                  {statsFetcher.data.error}
                </p>
              )}
            <Button type="submit" disabled={statsFetcher.state !== "idle"}>
              {statsFetcher.state !== "idle" ? "Saving..." : "Save Stats"}
            </Button>
          </statsFetcher.Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Track Record</CardTitle>
        </CardHeader>
        <CardContent>
          <trackFetcher.Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="trackRecord" />
            {rows.map((key, i) => (
              <div
                key={key}
                className="grid grid-cols-2 gap-3 border-t border-white/10 pt-3 first:border-0 first:pt-0"
              >
                <Input
                  name="trackRecord.title"
                  placeholder="Title"
                  defaultValue={about.trackRecord[i]?.title ?? ""}
                />
                <div className="flex gap-2">
                  <Input
                    name="trackRecord.subtitle"
                    placeholder="Subtitle"
                    defaultValue={about.trackRecord[i]?.subtitle ?? ""}
                  />
                  {rows.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        setRows((r) => r.filter((_, idx) => idx !== i))
                      }
                    >
                      &times;
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRows((r) => [...r, (r.at(-1) ?? -1) + 1])}
            >
              Add row
            </Button>
            {trackFetcher.data?.intent === "trackRecord" &&
              trackFetcher.data.error && (
                <p className="text-red-400 text-sm">
                  {trackFetcher.data.error}
                </p>
              )}
            <div>
              <Button type="submit" disabled={trackFetcher.state !== "idle"}>
                {trackFetcher.state !== "idle"
                  ? "Saving..."
                  : "Save Track Record"}
              </Button>
            </div>
          </trackFetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
