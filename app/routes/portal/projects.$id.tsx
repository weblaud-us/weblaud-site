import { Link, NavLink, Outlet } from "react-router";
import type { Route } from "./+types/projects.$id";
import { ApiError, apiFetch, resolveMediaUrl } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type {
  ClientProject,
  Organization,
  PortalUser,
  ProjectAttention,
  ProjectAttentionCounts,
  ProjectStaffRef,
} from "~/lib/types";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  FolderOpen,
  LayoutGrid,
  ListTodo,
  MessagesSquare,
  Scale,
  Settings2,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { projectPath } from "~/lib/portal-paths";
import { cn } from "~/lib/utils";

/**
 * Passed to every tab via <Outlet context={...}> — see useOutletContext() in
 * projects.$id._index.tsx / .updates.tsx / .requests.tsx / .manage.tsx. The
 * section layouts (work, updates, decisions, billing) forward it unchanged.
 * Explicit interface because a typed Route.ComponentProps["loaderData"]
 * import doesn't cross the Outlet-context boundary automatically.
 */
export interface ProjectWorkspaceContext {
  user: PortalUser;
  project: ClientProject;
  /** This user is the project's PM, or an admin (admins act as PM everywhere — see project-access.util.ts#isProjectManager on the backend). */
  isPm: boolean;
  /** PM, admin, or a team member — anyone who can author updates for this project. */
  isStaffOnProject: boolean;
  /** What's waiting on this user in this project: tab badges and the Overview inbox. Null when it couldn't be loaded. */
  attention: ProjectAttention | null;
}

/** Resolves projectManager/team avatar paths server-side, mirroring admin/team.tsx's loader. */
function withResolvedAvatars(staff: ProjectStaffRef): ProjectStaffRef {
  return staff.avatar ? { ...staff, avatar: resolveMediaUrl(staff.avatar) } : staff;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requirePortalUser(request);
  const [project, attention] = await Promise.all([
    callPortalApi(request, (accessToken) =>
      apiFetch<ClientProject>(`/portal/projects/${params.id}`, { accessToken }),
    ),
    // Badges are a nicety — a failure here must never take the project down.
    callPortalApi(request, (accessToken) =>
      apiFetch<ProjectAttention>(`/portal/projects/${params.id}/attention`, { accessToken }),
    ).catch((err) => {
      if (err instanceof ApiError) return null;
      throw err;
    }),
  ]);

  const pmId = typeof project.projectManager === "object" ? project.projectManager._id : project.projectManager;
  const teamIds = (project.team as ProjectStaffRef[]).map((m) => (typeof m === "object" ? m._id : m));

  // Computed server-side once here rather than re-derived in every tab: who
  // can manage this project (PM or admin) and who can author updates for it
  // (PM, admin, or a team member) — the API enforces the real rule, this is
  // only for which controls the UI shows.
  const isPm = user.role === "admin" || pmId === user._id;
  const isTeamMember = teamIds.includes(user._id);
  const isStaffOnProject = isPm || isTeamMember;

  return {
    user,
    isPm,
    isStaffOnProject,
    attention,
    project: {
      ...project,
      projectManager:
        typeof project.projectManager === "object"
          ? withResolvedAvatars(project.projectManager)
          : project.projectManager,
      team: (project.team as ProjectStaffRef[]).map((member) =>
        typeof member === "object" ? withResolvedAvatars(member) : member,
      ),
    },
  };
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

interface ProjectTab {
  /** Top-level path — a tab with sub-pages stays active on all of them. */
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  count: number;
}

const TAB_DEFS: {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: Exclude<keyof ProjectAttentionCounts, "total">;
  show?: "staff" | "pm";
}[] = [
  { path: "", label: "Overview", icon: LayoutGrid },
  { path: "/work", label: "Work", icon: ListTodo, badge: "work" },
  { path: "/updates", label: "Updates", icon: MessagesSquare, badge: "updates" },
  { path: "/files", label: "Files", icon: FolderOpen, badge: "files" },
  { path: "/decisions", label: "Decisions", icon: Scale, badge: "decisions" },
  { path: "/billing", label: "Billing", icon: Wallet, badge: "billing" },
  { path: "/time", label: "Time", icon: Clock, show: "staff" },
  { path: "/manage", label: "Manage", icon: Settings2, show: "pm" },
];

function projectTabs(
  projectId: string,
  { isPm, isStaffOnProject }: { isPm: boolean; isStaffOnProject: boolean },
  counts: ProjectAttentionCounts | undefined,
): ProjectTab[] {
  const base = projectPath(projectId);
  return TAB_DEFS.filter((t) => (t.show === "pm" ? isPm : t.show === "staff" ? isStaffOnProject : true)).map(
    (t) => ({
      to: base + t.path,
      label: t.label,
      icon: t.icon,
      end: t.path === "",
      count: t.badge ? (counts?.[t.badge] ?? 0) : 0,
    }),
  );
}

/**
 * Six tabs for clients, up to eight for staff. Below the sm breakpoint they
 * wrap into a 3- or 4-column grid (two rows), so nothing scrolls sideways at
 * 360 px; from sm up they're a single underlined row.
 */
function ProjectTabs({ tabs }: { tabs: ProjectTab[] }) {
  return (
    <nav
      aria-label="Project sections"
      className={cn(
        "mb-6 grid gap-1 sm:flex sm:gap-1 sm:border-b sm:border-white/10",
        tabs.length > 6 ? "grid-cols-4" : "grid-cols-3",
      )}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            cn(
              "flex min-w-0 items-center justify-center gap-1.5 rounded-md px-1.5 py-2 text-xs font-medium transition-colors",
              "sm:justify-start sm:rounded-none sm:border-b-2 sm:-mb-px sm:px-3.5 sm:py-2.5 sm:text-sm sm:whitespace-nowrap",
              isActive
                ? "bg-[#0A84FF]/15 text-white sm:bg-transparent sm:border-[#0A84FF]"
                : "bg-white/[0.03] text-white/55 hover:text-white/80 sm:bg-transparent sm:border-transparent",
            )
          }
        >
          <tab.icon className="hidden sm:block size-4 shrink-0 opacity-70" aria-hidden="true" />
          <span className="truncate">{tab.label}</span>
          {tab.count > 0 && (
            <span className="shrink-0 rounded-full bg-[#0A84FF] px-1.5 text-[10px] font-semibold leading-4 text-white">
              <span aria-hidden="true">{tab.count > 9 ? "9+" : tab.count}</span>
              <span className="sr-only"> ({tab.count} waiting on you)</span>
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default function PortalProjectLayout({ loaderData, params }: Route.ComponentProps) {
  const { project, isPm, isStaffOnProject, attention } = loaderData;
  const org = project.organization as Organization;
  const tabs = projectTabs(params.id, { isPm, isStaffOnProject }, attention?.counts);

  return (
    <div>
      <Link
        to="/portal"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-2"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </Link>

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white tracking-tight">{project.name}</h1>
          {org?.name && <p className="text-sm text-white/50 mt-1">{org.name}</p>}
        </div>
        <Badge variant={STATUS_VARIANT[project.status]}>{STATUS_LABEL[project.status]}</Badge>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
          <span>Overall progress</span>
          <span>{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2" aria-label="Overall progress" />
      </div>

      <ProjectTabs tabs={tabs} />

      <Outlet context={loaderData satisfies ProjectWorkspaceContext} />
    </div>
  );
}
