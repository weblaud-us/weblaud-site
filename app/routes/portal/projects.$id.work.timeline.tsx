import { useOutletContext } from "react-router";
import type { Route } from "./+types/projects.$id.work.timeline";
import { apiFetch } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Feature } from "~/lib/types";
import { Badge } from "~/components/ui/badge";
import { CalendarClock, CheckCircle2, Circle, CircleDot, ListChecks } from "lucide-react";
import { formatDate } from "~/lib/dates";
import { isMilestoneLate } from "~/lib/portal-progress";
import { cn } from "~/lib/utils";
import type { ProjectWorkspaceContext } from "./projects.$id";

/** Features live in their own collection (see feature.module.ts), so this page fetches them; milestones come with the project. */
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

function MilestoneIcon({ status }: { status: string }) {
  if (status === "done") return <CheckCircle2 className="size-4 text-emerald-400" />;
  if (status === "in_progress") return <CircleDot className="size-4 text-[#0A84FF]" />;
  return <Circle className="size-4 text-white/25" />;
}

export default function ProjectTimeline({ loaderData }: Route.ComponentProps) {
  const { features } = loaderData;
  const { project } = useOutletContext<ProjectWorkspaceContext>();
  const { startDate, endDate, milestones } = project.timeline;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarClock className="size-4 text-white/50" />
          <h2 className="text-sm font-medium text-white">Milestones</h2>
        </div>
        {(startDate || endDate) && (
          <p className="text-xs text-white/50 mb-4">
            {startDate ? formatDate(startDate) : "TBD"} → {endDate ? formatDate(endDate) : "TBD"}
          </p>
        )}
        {milestones.length === 0 ? (
          <p className="text-sm text-white/40">No milestones have been added yet.</p>
        ) : (
          <ol className="relative space-y-4 border-l border-white/10 pl-5">
            {milestones.map((milestone) => {
              const late = isMilestoneLate(milestone);
              return (
                <li key={milestone._id} className="relative">
                  <span className="absolute -left-[29px] top-0.5 rounded-full bg-black p-0.5">
                    <MilestoneIcon status={milestone.status} />
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={cn("text-sm", milestone.status === "done" ? "text-white/60" : "text-white")}>
                      {milestone.title}
                    </p>
                    {late && <Badge variant="destructive">Late</Badge>}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">
                    {milestone.status === "done" && milestone.completedAt
                      ? `Completed ${formatDate(milestone.completedAt)}`
                      : milestone.dueDate
                        ? `Due ${formatDate(milestone.dueDate)}`
                        : "No date yet"}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks className="size-4 text-white/50" />
          <h2 className="text-sm font-medium text-white">Scope</h2>
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
                  {feature.description && <p className="text-xs text-white/40 mt-0.5">{feature.description}</p>}
                </div>
                <Badge variant={FEATURE_STATUS_VARIANT[feature.status]} className="shrink-0">
                  {FEATURE_STATUS_LABEL[feature.status]}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
