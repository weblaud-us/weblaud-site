import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { apiFetch } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { ClientProject, Organization, PortalAttentionSummary, ProjectStaffRef } from "~/lib/types";
import { EmptyState } from "~/components/admin/empty-state";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { FolderKanban, ArrowRight, FileSignature, ClipboardCheck, ReceiptText } from "lucide-react";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePortalUser(request);
  const [projects, attention] = await Promise.all([
    callPortalApi(request, (accessToken) =>
      apiFetch<ClientProject[]>("/portal/projects", { accessToken }),
    ),
    callPortalApi(request, (accessToken) =>
      apiFetch<PortalAttentionSummary>("/portal/dashboard/attention", { accessToken }),
    ),
  ]);
  return { user, projects, attention };
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

const ATTENTION_GROUPS: {
  key: keyof PortalAttentionSummary;
  label: string;
  icon: typeof FileSignature;
}[] = [
  { key: "contractsAwaitingSignature", label: "Contracts to sign", icon: FileSignature },
  { key: "pendingApprovals", label: "Approvals pending", icon: ClipboardCheck },
  { key: "overdueInvoices", label: "Invoices overdue", icon: ReceiptText },
];

function AttentionCard({ attention }: { attention: PortalAttentionSummary }) {
  const totalCount = ATTENTION_GROUPS.reduce((sum, g) => sum + attention[g.key].count, 0);
  if (totalCount === 0) return null;

  return (
    <div className="mb-8 rounded-xl border border-[#0A84FF]/25 bg-[#0A84FF]/[0.06] p-5">
      <h2 className="text-sm font-medium text-white mb-4">Needs your attention</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ATTENTION_GROUPS.map(({ key, label, icon: Icon }) => {
          const group = attention[key];
          if (group.count === 0) return null;
          return (
            <div key={key} className="rounded-lg border border-white/10 bg-black/20 p-3.5">
              <div className="flex items-center gap-2 mb-2.5">
                <Icon className="size-4 text-[#0A84FF]" />
                <p className="text-sm font-medium text-white">
                  {group.count} {label.toLowerCase()}
                </p>
              </div>
              <div className="space-y-1.5">
                {group.items.map((item) =>
                  item.link ? (
                    <Link
                      key={item._id}
                      to={item.link}
                      className="block text-xs text-white/60 hover:text-white transition-colors truncate"
                    >
                      {item.title} <span className="text-white/30">· {item.meta}</span>
                    </Link>
                  ) : (
                    <p key={item._id} className="text-xs text-white/40 truncate">
                      {item.title} <span className="text-white/30">· {item.meta}</span>
                    </p>
                  ),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PortalDashboard({ loaderData }: Route.ComponentProps) {
  const { user, projects, attention } = loaderData;
  const isStaff = user.role === "admin" || user.role === "manager";

  return (
    <div>
      <AttentionCard attention={attention} />

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          {isStaff ? "Your assigned projects" : "Your projects"}
        </h1>
        <p className="text-sm text-white/50 mt-1">
          {isStaff
            ? "Projects where you're the project manager or on the team."
            : "Everything WebLaud is building for you, in one place."}
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description={
              isStaff
                ? "You haven't been assigned to a project yet."
                : "Your project manager will set this up shortly — check back soon."
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const org = project.organization as Organization;
            const pm = project.projectManager as ProjectStaffRef;
            return (
              <Link
                key={project._id}
                to={`/portal/projects/${project._id}`}
                className="group flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/20 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{project.name}</p>
                    {isStaff && org?.name && (
                      <p className="text-xs text-white/40 mt-0.5 truncate">{org.name}</p>
                    )}
                    {!isStaff && pm && (
                      <p className="text-xs text-white/40 mt-0.5 truncate">
                        PM: {pm.firstName} {pm.lastName}
                      </p>
                    )}
                  </div>
                  <Badge variant={STATUS_VARIANT[project.status]} className="shrink-0">
                    {STATUS_LABEL[project.status]}
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                <div className="flex items-center justify-between text-xs text-white/40 pt-1">
                  <span>
                    {project.team.length} team member{project.team.length === 1 ? "" : "s"}
                  </span>
                  <ArrowRight className="size-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
