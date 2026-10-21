import { Link } from "react-router";
import type { Route } from "./+types/$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ClientProject, Feature, MilestoneStatus, Organization, ProjectStaffRef } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";
import { LocalTime } from "~/components/ui/local-time";
import { Pencil } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  const [project, features] = await Promise.all([
    callAdminApi(request, (accessToken) =>
      apiFetch<ClientProject>(`/client-projects/${params.id}`, { accessToken }),
    ),
    // Same portal-scoped endpoint the client-side app uses — admin's role
    // passes every project-access check unconditionally (see
    // assertProjectAccess), so there's no admin-only feature-read endpoint
    // to duplicate.
    callAdminApi(request, (accessToken) =>
      apiFetch<Feature[]>(`/portal/projects/${params.id}/features`, { accessToken }),
    ),
  ]);
  return { project, features };
}

const STATUS_LABEL: Record<ClientProject["status"], string> = {
  planning: "Planning",
  active: "Active",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_VARIANT: Record<
  ClientProject["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  planning: "secondary",
  active: "default",
  on_hold: "outline",
  completed: "secondary",
  cancelled: "destructive",
};

const MILESTONE_STATUS_LABEL: Record<MilestoneStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  done: "Done",
};

const MILESTONE_STATUS_VARIANT: Record<MilestoneStatus, "default" | "secondary" | "outline"> = {
  pending: "secondary",
  in_progress: "outline",
  done: "default",
};

const FEATURE_STATUS_LABEL: Record<Feature["status"], string> = {
  planned: "Planned",
  in_progress: "In progress",
  done: "Done",
};

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-US")}`;
  }
}

function initials(member: ProjectStaffRef) {
  return `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase();
}

function PersonRow({ member }: { member: ProjectStaffRef }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        {member.avatar && <AvatarImage src={member.avatar} alt="" />}
        <AvatarFallback>{initials(member)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-sm text-white/90 truncate">
          {member.firstName} {member.lastName}
        </p>
        <p className="text-xs text-white/40 truncate">{member.email}</p>
      </div>
    </div>
  );
}

export default function ClientProjectDetail({ loaderData }: Route.ComponentProps) {
  const { project, features } = loaderData;
  const org = project.organization as Organization;
  const pm = project.projectManager as ProjectStaffRef;
  const team = project.team as ProjectStaffRef[];
  const milestones = project.timeline?.milestones ?? [];

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={project.name}
        description={org?.name ?? "—"}
        backTo="/cpadmin/client-projects"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANT[project.status]}>
              {STATUS_LABEL[project.status]}
            </Badge>
            <Link to={`/cpadmin/client-projects/${project._id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="size-3.5" />
                Edit
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
              <CardDescription>What the client sees on the project overview.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-white/70 whitespace-pre-wrap">
                {project.description || "No description yet."}
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <Progress value={project.progress} className="flex-1 max-w-48" />
                <span className="text-xs text-white/50">{project.progress}% complete</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Milestones</CardTitle>
              <CardDescription>Key checkpoints on the project timeline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {milestones.length === 0 && (
                <p className="text-sm text-white/40">No milestones defined.</p>
              )}
              {milestones.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-white/3 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white/90 truncate">{m.title}</p>
                    {m.dueDate && (
                      <p className="text-xs text-white/40">
                        Due <LocalTime value={m.dueDate} />
                      </p>
                    )}
                  </div>
                  <Badge variant={MILESTONE_STATUS_VARIANT[m.status]} className="shrink-0">
                    {MILESTONE_STATUS_LABEL[m.status]}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Features</CardTitle>
              <CardDescription>
                The scope the project is delivering, in display order.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {features.length === 0 && (
                <p className="text-sm text-white/40">No features added yet.</p>
              )}
              {features.map((feature) => (
                <div
                  key={feature._id}
                  className="flex items-start justify-between gap-3 rounded-lg px-3 py-2 hover:bg-white/3 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white/90">{feature.title}</p>
                    {feature.description && (
                      <p className="text-xs text-white/40 mt-0.5 line-clamp-2">
                        {feature.description}
                      </p>
                    )}
                  </div>
                  <Badge variant={feature.status === "done" ? "default" : "secondary"} className="shrink-0">
                    {FEATURE_STATUS_LABEL[feature.status]}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Client & team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-white/40">Organization</p>
                <p className="text-sm text-white/90">{org?.name ?? "—"}</p>
                {org?.billingEmail && (
                  <p className="text-xs text-white/40">{org.billingEmail}</p>
                )}
              </div>
              <div className="space-y-1.5 pt-3 border-t border-white/10">
                <p className="text-xs text-white/40">Project manager</p>
                {pm ? <PersonRow member={pm} /> : <p className="text-sm text-white/40">—</p>}
              </div>
              <div className="space-y-2 pt-3 border-t border-white/10">
                <p className="text-xs text-white/40">Team members ({team.length})</p>
                {team.length === 0 && <p className="text-sm text-white/40">No one assigned yet.</p>}
                {team.map((member) => (
                  <PersonRow key={member._id} member={member} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-white/50">Budget</dt>
                  <dd className="text-white">
                    {money(project.budget?.amount ?? 0, project.budget?.currency ?? "USD")}
                  </dd>
                </div>
                {(project.budget?.spent ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-white/50">Spent</dt>
                    <dd className="text-white">
                      {money(project.budget.spent, project.budget.currency)}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-white/50">Start</dt>
                  <dd className="text-white/90">
                    {project.timeline?.startDate ? <LocalTime value={project.timeline.startDate} /> : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">End</dt>
                  <dd className="text-white/90">
                    {project.timeline?.endDate ? <LocalTime value={project.timeline.endDate} /> : "—"}
                  </dd>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <dt className="text-white/50">Created</dt>
                  <dd className="text-white/90"><LocalTime value={project.createdAt} /></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Updated</dt>
                  <dd className="text-white/90"><LocalTime value={project.updatedAt} /></dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/client-projects"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to client projects
        </Link>
      </p>
    </div>
  );
}