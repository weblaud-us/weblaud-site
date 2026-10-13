import { useOutletContext } from "react-router";
import type { Route } from "./+types/projects.$id._index";
import { apiFetch } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Feature, ProjectStaffRef } from "~/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { CalendarClock, Wallet, ListChecks, Users } from "lucide-react";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";

/** Features moved to their own collection (see feature.module.ts) — no longer embedded on the project the parent layout already fetched, so this tab fetches its own. */
export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const features = await callPortalApi(request, (accessToken) =>
    apiFetch<Feature[]>(`/portal/projects/${params.id}/features`, { accessToken }),
  );
  return { features };
}

const FEATURE_STATUS_LABEL = {
  planned: "Planned",
  in_progress: "In progress",
  done: "Done",
} as const;

const FEATURE_STATUS_VARIANT = {
  planned: "outline",
  in_progress: "secondary",
  done: "default",
} as const;

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function MilestoneIcon({ status }: { status: string }) {
  if (status === "done") return <CheckCircle2 className="size-4 text-emerald-400" />;
  if (status === "in_progress") return <CircleDot className="size-4 text-[#0A84FF]" />;
  return <Circle className="size-4 text-white/25" />;
}

function StaffPill({ staff }: { staff: ProjectStaffRef }) {
  const initials = `${staff.firstName[0] ?? ""}${staff.lastName[0] ?? ""}`.toUpperCase();
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
      <Avatar size="sm">
        {staff.avatar && <AvatarImage src={staff.avatar} alt="" />}
        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-sm text-white truncate">
          {staff.firstName} {staff.lastName}
        </p>
        {staff.title && <p className="text-xs text-white/40 truncate">{staff.title}</p>}
      </div>
    </div>
  );
}

export default function PortalProjectOverview({ loaderData }: Route.ComponentProps) {
  const { features } = loaderData;
  const { project } = useOutletContext<ProjectWorkspaceContext>();
  const pm = project.projectManager as ProjectStaffRef;
  const team = project.team as ProjectStaffRef[];

  return (
    <div>
      {project.description && (
        <p className="text-sm text-white/60 mb-6 max-w-3xl">{project.description}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Features */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="size-4 text-white/50" />
              <p className="text-sm font-medium text-white">Features</p>
            </div>
            {features.length === 0 ? (
              <p className="text-sm text-white/40">No features have been scoped yet.</p>
            ) : (
              <div className="space-y-2">
                {features.map((feature) => (
                  <div
                    key={feature._id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white">{feature.title}</p>
                      {feature.description && (
                        <p className="text-xs text-white/40 mt-0.5">{feature.description}</p>
                      )}
                    </div>
                    <Badge variant={FEATURE_STATUS_VARIANT[feature.status]} className="shrink-0">
                      {FEATURE_STATUS_LABEL[feature.status]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="size-4 text-white/50" />
              <p className="text-sm font-medium text-white">Timeline</p>
            </div>
            {(project.timeline.startDate || project.timeline.endDate) && (
              <p className="text-xs text-white/50 mb-4">
                {project.timeline.startDate
                  ? new Date(project.timeline.startDate).toLocaleDateString()
                  : "TBD"}
                {" → "}
                {project.timeline.endDate
                  ? new Date(project.timeline.endDate).toLocaleDateString()
                  : "TBD"}
              </p>
            )}
            {project.timeline.milestones.length === 0 ? (
              <p className="text-sm text-white/40">No milestones have been added yet.</p>
            ) : (
              <div className="space-y-3">
                {project.timeline.milestones.map((milestone) => (
                  <div key={milestone._id} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <MilestoneIcon status={milestone.status} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white">{milestone.title}</p>
                      {milestone.dueDate && (
                        <p className="text-xs text-white/40 mt-0.5">
                          Due {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Budget */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="size-4 text-white/50" />
              <p className="text-sm font-medium text-white">Budget</p>
            </div>
            <p className="text-2xl font-semibold text-white">
              {money(project.budget.amount, project.budget.currency)}
            </p>
            <p className="text-xs text-white/40 mt-1">
              {money(project.budget.spent, project.budget.currency)} invoiced so far
            </p>
          </div>

          {/* Team */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="size-4 text-white/50" />
              <p className="text-sm font-medium text-white">Team</p>
            </div>
            <div className="space-y-2">
              {pm && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-white/30 mb-1.5">
                    Project manager
                  </p>
                  <StaffPill staff={pm} />
                </div>
              )}
              {team.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] uppercase tracking-wide text-white/30 mb-1.5">
                    Team
                  </p>
                  <div className="space-y-2">
                    {team.map((member) => (
                      <StaffPill key={member._id} staff={member} />
                    ))}
                  </div>
                </div>
              )}
              {!pm && team.length === 0 && (
                <p className="text-sm text-white/40">No one has been assigned yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
