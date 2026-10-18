import { useEffect } from "react";
import { useFetcher, redirect } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/projects.$id.manage";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { ClientProject, Feature, ProjectMilestone, ProjectStaffRef } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FeaturesEditor } from "~/components/portal/features-editor";
import { MilestonesEditor } from "~/components/portal/milestones-editor";

const STATUS_OPTIONS: { value: ClientProject["status"]; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requirePortalUser(request);
  const project = await callPortalApi(request, (accessToken) =>
    apiFetch<ClientProject>(`/portal/projects/${params.id}`, { accessToken }),
  );

  const pmId = typeof project.projectManager === "object" ? project.projectManager._id : project.projectManager;
  const isPm = user.role === "admin" || pmId === user._id;
  // Checked before the staff-only /users/staff call below (admin/manager
  // only — see users.controller.ts#findStaff), not just as a UI nicety: a
  // non-PM client hitting that endpoint 403s, which would otherwise blow up
  // this loader before this redirect ever ran. The backend enforces the PM
  // requirement too (assertProjectManager on PATCH /portal/projects/:id) —
  // redirecting here just avoids showing a non-PM a form that would 403 on
  // submit.
  if (!isPm) throw redirect(`/portal/projects/${params.id}`);

  const [staffList, features] = await Promise.all([
    callPortalApi(request, (accessToken) =>
      apiFetch<ProjectStaffRef[]>("/users/staff", { accessToken }),
    ),
    callPortalApi(request, (accessToken) =>
      apiFetch<Feature[]>(`/portal/projects/${params.id}/features`, { accessToken }),
    ),
  ]);

  return { project, staff: staffList, features };
}

function parseJsonField<T>(formData: FormData, name: string): T[] {
  try {
    return JSON.parse(String(formData.get(name) ?? "[]")) as T[];
  } catch {
    return [];
  }
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "details");

  try {
    if (intent === "features") {
      const features = parseJsonField<unknown>(formData, "featuresJson");
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/features`, {
          method: "PUT",
          accessToken,
          body: { features },
        }),
      );
      return { ok: true };
    }

    // intent === "details": status/team/timeline. Milestones is always sent,
    // even empty — unlike startDate/endDate (where an empty input means
    // "leave it alone", since @IsDateString() rejects an empty string), an
    // empty milestones array is an unambiguous, real state: the user removed
    // every row and that removal has to actually save.
    const milestones = parseJsonField<ProjectMilestone>(formData, "milestonesJson");
    const team = formData.getAll("team").map(String).filter(Boolean);
    const startDate = String(formData.get("startDate") ?? "");
    const endDate = String(formData.get("endDate") ?? "");

    await callPortalApi(request, (accessToken) =>
      apiFetch(`/portal/projects/${params.id}`, {
        method: "PATCH",
        accessToken,
        body: {
          status: String(formData.get("status") ?? "planning"),
          team,
          timeline: {
            ...(startDate ? { startDate } : {}),
            ...(endDate ? { endDate } : {}),
            milestones,
          },
        },
      }),
    );
    return { ok: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

export default function PortalProjectManage({ loaderData }: Route.ComponentProps) {
  const { project, staff, features } = loaderData;
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) toast.success("Project updated.");
      else if (fetcher.data.error) toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  const teamIds = (project.team as ProjectStaffRef[]).map((t) => (typeof t === "object" ? t._id : t));
  const pmId = typeof project.projectManager === "object" ? project.projectManager._id : project.projectManager;
  // Staff picker excludes the PM — they're already on the project by
  // definition, and PM reassignment stays admin-only in /cpadmin.
  const assignableStaff = staff.filter((s) => s._id !== pmId);

  return (
    <div className="space-y-6 max-w-2xl">
      <fetcher.Form method="post" className="space-y-6">
        <input type="hidden" name="intent" value="details" />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status & progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" defaultValue={project.status}>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Progress</Label>
                <p className="text-sm text-white/70 h-10 flex items-center px-3 rounded-lg border border-white/10 bg-black/20">
                  {project.progress}% — from the task board
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-white/10 p-3 space-y-1.5 max-h-56 overflow-y-auto">
              {assignableStaff.length === 0 && (
                <p className="text-xs text-white/40">No other staff to assign yet.</p>
              )}
              {assignableStaff.map((member) => (
                <label key={member._id} className="flex items-center gap-2 text-sm text-white/70">
                  <Checkbox name="team" value={member._id} defaultChecked={teamIds.includes(member._id)} />
                  {member.firstName} {member.lastName}
                  <span className="text-white/30 text-xs">{member.email}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start date</Label>
                <Input id="startDate" name="startDate" type="date" defaultValue={project.timeline?.startDate?.slice(0, 10)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End date</Label>
                <Input id="endDate" name="endDate" type="date" defaultValue={project.timeline?.endDate?.slice(0, 10)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Milestones</Label>
              <MilestonesEditor name="milestonesJson" defaultValue={project.timeline?.milestones ?? []} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </fetcher.Form>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <FeaturesEditor projectId={project._id} defaultValue={features} />
        </CardContent>
      </Card>
    </div>
  );
}
