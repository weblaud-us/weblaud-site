import type { ReactNode } from "react";
import { Link, useOutletContext } from "react-router";
import type { Route } from "./+types/projects.$id._index";
import { ApiError, apiFetch } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Invoice, ProjectActivityItem, ProjectStaffRef, ProjectUpdateItem } from "~/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { LocalTime } from "~/components/ui/local-time";
import { ActionInbox } from "~/components/portal/action-inbox";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Flag,
  FolderOpen,
  History,
  Megaphone,
  ReceiptText,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { formatDate } from "~/lib/dates";
import { invoicedTotal, isMilestoneLate, nextMilestone } from "~/lib/portal-progress";
import { projectPath } from "~/lib/portal-paths";
import type { ProjectWorkspaceContext } from "./projects.$id";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const [activity, updates, invoices] = await Promise.all([
    // The activity feed is supplementary — never fail the Overview over it.
    callPortalApi(request, (accessToken) =>
      apiFetch<ProjectActivityItem[]>(`/portal/projects/${params.id}/activity`, { accessToken }),
    ).catch((err) => {
      if (err instanceof ApiError) return [];
      throw err;
    }),
    callPortalApi(request, (accessToken) =>
      apiFetch<ProjectUpdateItem[]>(`/portal/projects/${params.id}/updates`, { accessToken }),
    ),
    callPortalApi(request, (accessToken) =>
      apiFetch<Invoice[]>(`/portal/projects/${params.id}/invoices`, { accessToken }),
    ),
  ]);

  // Staff get drafts and pending reviews in the same list — only a
  // published update is "the latest update" a client would recognise.
  const latestUpdate =
    updates
      .filter((u) => u.status === "published")
      .sort((a, b) => (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt))[0] ?? null;

  return { activity, latestUpdate, invoiced: invoicedTotal(invoices) };
}

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-US")}`;
  }
}

const ACTIVITY_ICON: Record<ProjectActivityItem["type"], LucideIcon> = {
  update_published: Megaphone,
  file_shared: FolderOpen,
  approval_decided: ClipboardCheck,
  invoice_paid: ReceiptText,
};

function Card({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: LucideIcon;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="flex items-center gap-2 text-sm font-medium text-white">
          <Icon className="size-4 text-white/50" aria-hidden="true" />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
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

function BudgetRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-white/50">{label}</dt>
      <dd className={strong ? "font-semibold text-white" : "text-white/80"}>{value}</dd>
    </div>
  );
}

/**
 * One screen that answers: what's waiting on me, what's next, what
 * happened lately, and where the money stands.
 */
export default function PortalProjectOverview({ loaderData }: Route.ComponentProps) {
  const { activity, latestUpdate, invoiced } = loaderData;
  const { project, attention } = useOutletContext<ProjectWorkspaceContext>();
  const pm = project.projectManager as ProjectStaffRef;
  const team = project.team as ProjectStaffRef[];
  const { budget } = project;
  const next = nextMilestone(project.timeline.milestones);
  const allDone =
    project.timeline.milestones.length > 0 && project.timeline.milestones.every((m) => m.status === "done");

  return (
    <div>
      {project.description && <p className="text-sm text-white/60 mb-6 max-w-3xl">{project.description}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          {attention && <ActionInbox summary={attention.summary} compact />}

          <Card
            icon={Megaphone}
            title="Latest update"
            action={
              <Link
                to={projectPath(project._id, "updates")}
                className="inline-flex items-center gap-1 text-xs text-[#0A84FF] hover:underline"
              >
                All updates <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            }
          >
            {latestUpdate ? (
              <div>
                <p className="text-sm font-medium text-white">{latestUpdate.title}</p>
                <p className="text-xs text-white/40 mt-0.5">
                  <LocalTime value={latestUpdate.publishedAt ?? latestUpdate.createdAt} />
                  {latestUpdate.progressValue !== undefined && <> · PM estimate {latestUpdate.progressValue}%</>}
                </p>
                <p className="text-sm text-white/65 mt-2 whitespace-pre-wrap line-clamp-4">{latestUpdate.body}</p>
              </div>
            ) : (
              <p className="text-sm text-white/40">No updates have been posted yet.</p>
            )}
          </Card>

          <Card icon={History} title="Recent activity">
            {activity.length === 0 ? (
              <p className="text-sm text-white/40">Nothing has happened on this project yet.</p>
            ) : (
              <ul className="space-y-1">
                {activity.map((item) => {
                  const Icon = ACTIVITY_ICON[item.type] ?? History;
                  return (
                    <li key={`${item.type}-${item._id}`}>
                      <Link
                        to={item.link}
                        className="flex items-start gap-3 rounded-md px-2 py-1.5 -mx-2 hover:bg-white/5 transition-colors"
                      >
                        <Icon className="size-4 mt-0.5 shrink-0 text-white/40" aria-hidden="true" />
                        <span className="min-w-0 flex-1 text-sm text-white/80 truncate">{item.title}</span>
                        <span className="shrink-0 text-xs text-white/35">
                          <LocalTime value={item.at} />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6 min-w-0">
          <Card
            icon={Flag}
            title="Next milestone"
            action={
              <Link
                to={projectPath(project._id, "timeline")}
                className="inline-flex items-center gap-1 text-xs text-[#0A84FF] hover:underline"
              >
                Timeline <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            }
          >
            {next ? (
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-white">{next.title}</p>
                  {isMilestoneLate(next) && <Badge variant="destructive">Late</Badge>}
                </div>
                <p className="text-xs text-white/45 mt-1">
                  {next.dueDate ? `Due ${formatDate(next.dueDate)}` : "No date yet"}
                </p>
              </div>
            ) : allDone ? (
              <p className="flex items-center gap-2 text-sm text-white/60">
                <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />
                Every milestone is done.
              </p>
            ) : (
              <p className="text-sm text-white/40">No milestones have been added yet.</p>
            )}
          </Card>

          <Card icon={Wallet} title="Budget">
            {budget.amount > 0 && (
              <Progress
                value={Math.min(100, (budget.spent / budget.amount) * 100)}
                className="h-1.5 mb-3"
                aria-label="Share of the contract value paid so far"
              />
            )}
            {/* budget.spent is the sum of *paid* invoices (see the backend ProjectBudget schema). */}
            <dl className="space-y-1.5">
              <BudgetRow label="Contract value" value={money(budget.amount, budget.currency)} strong />
              <BudgetRow label="Invoiced" value={money(invoiced, budget.currency)} />
              <BudgetRow label="Paid" value={money(budget.spent, budget.currency)} />
              <BudgetRow
                label="Remaining"
                value={money(Math.max(0, budget.amount - budget.spent), budget.currency)}
              />
            </dl>
          </Card>

          <Card icon={Users} title="Team">
            <div className="space-y-2">
              {pm && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-white/30 mb-1.5">Project manager</p>
                  <StaffPill staff={pm} />
                </div>
              )}
              {team.length > 0 && (
                <div className="pt-2">
                  <p className="text-[11px] uppercase tracking-wide text-white/30 mb-1.5">Team</p>
                  <div className="space-y-2">
                    {team.map((member) => (
                      <StaffPill key={member._id} staff={member} />
                    ))}
                  </div>
                </div>
              )}
              {!pm && team.length === 0 && <p className="text-sm text-white/40">No one has been assigned yet.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
