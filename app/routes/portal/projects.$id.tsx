import { Link, NavLink, Outlet } from "react-router";
import type { Route } from "./+types/projects.$id";
import { apiFetch, resolveMediaUrl } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { ClientProject, Organization, PortalUser, ProjectStaffRef } from "~/lib/types";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { cn } from "~/lib/utils";

/**
 * Passed to every tab via <Outlet context={...}> — see useOutletContext() in
 * projects.$id._index.tsx / .updates.tsx / .requests.tsx / .manage.tsx.
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
}

/** Resolves projectManager/team avatar paths server-side, mirroring admin/team.tsx's loader. */
function withResolvedAvatars(staff: ProjectStaffRef): ProjectStaffRef {
  return staff.avatar ? { ...staff, avatar: resolveMediaUrl(staff.avatar) } : staff;
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await requirePortalUser(request);
  const project = await callPortalApi(request, (accessToken) =>
    apiFetch<ClientProject>(`/portal/projects/${params.id}`, { accessToken }),
  );

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

export default function PortalProjectLayout({ loaderData, params }: Route.ComponentProps) {
  const { project, isPm, isStaffOnProject } = loaderData;
  const org = project.organization as Organization;

  const tabs = [
    { to: `/portal/projects/${params.id}`, label: "Overview", end: true },
    { to: `/portal/projects/${params.id}/updates`, label: "Updates" },
    { to: `/portal/projects/${params.id}/tasks`, label: "Tasks" },
    { to: `/portal/projects/${params.id}/files`, label: "Files" },
    { to: `/portal/projects/${params.id}/discussion`, label: "Discussion" },
    ...(isStaffOnProject ? [{ to: `/portal/projects/${params.id}/time`, label: "Time" }] : []),
    { to: `/portal/projects/${params.id}/requests`, label: "Requests" },
    { to: `/portal/projects/${params.id}/contract`, label: "Contract" },
    { to: `/portal/projects/${params.id}/change-requests`, label: "Change requests" },
    { to: `/portal/projects/${params.id}/approvals`, label: "Approvals" },
    { to: `/portal/projects/${params.id}/invoices`, label: "Invoices" },
    ...(isPm ? [{ to: `/portal/projects/${params.id}/manage`, label: "Manage" }] : []),
  ];

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
        <div>
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
        <Progress value={project.progress} className="h-2" />
      </div>

      <div className="border-b border-white/10 mb-6 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors",
                isActive
                  ? "border-[#0A84FF] text-white"
                  : "border-transparent text-white/50 hover:text-white/80",
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet context={loaderData} />
    </div>
  );
}
