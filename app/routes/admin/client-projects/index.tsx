import { useState } from "react";
import { Link, useSubmit, useNavigation } from "react-router";
import type { Route } from "./+types/index";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ClientProject, Organization, ProjectStaffRef } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { FolderKanban, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export async function loader({ request }: Route.LoaderArgs) {
  const projects = await callAdminApi(request, (accessToken) =>
    apiFetch<ClientProject[]>("/client-projects", { accessToken }),
  );
  return { projects };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = String(formData.get("id"));
  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/client-projects/${id}`, { method: "DELETE", accessToken }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
  return null;
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

export default function AdminClientProjectsIndex({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  const submit = useSubmit();
  const navigation = useNavigation();
  const deletingId = navigation.formData?.get("id") ? String(navigation.formData.get("id")) : null;
  const [query, setQuery] = useState("");
  const filtered = projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AdminPageHeader
        title="Client Projects"
        description="Projects clients see and track in the portal."
        actions={
          <Link to="/cpadmin/client-projects/new">
            <Button>
              <Plus className="size-4" />
              New Project
            </Button>
          </Link>
        }
      />

      {projects.length > 0 && (
        <ListSearch value={query} onChange={setQuery} placeholder="Search projects..." className="mb-4" />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No client projects yet"
            description="Create a project once you've set up the client's organization."
            action={
              <Link to="/cpadmin/client-projects/new">
                <Button size="sm">
                  <Plus className="size-4" />
                  New Project
                </Button>
              </Link>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Project</TableHead>
                <TableHead className="text-white/60">Organization</TableHead>
                <TableHead className="text-white/60">PM</TableHead>
                <TableHead className="text-white/60">Progress</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell colSpan={6} className="text-white/40 py-8 text-center">
                    No projects match "{query}".
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((project) => {
                const org = project.organization as Organization;
                const pm = project.projectManager as ProjectStaffRef;
                return (
                  <TableRow key={project._id} className="border-white/10">
                    <TableCell className="text-white font-medium">{project.name}</TableCell>
                    <TableCell className="text-white/50">{org?.name ?? "—"}</TableCell>
                    <TableCell className="text-white/50">
                      {pm ? `${pm.firstName} ${pm.lastName}` : "—"}
                    </TableCell>
                    <TableCell className="w-32">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="w-16" />
                        <span className="text-xs text-white/40">{project.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[project.status]}>
                        {STATUS_LABEL[project.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link to={`/cpadmin/client-projects/${project._id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" disabled={deletingId === project._id}>
                            {deletingId === project._id ? "Deleting..." : "Delete"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete project?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This permanently deletes "{project.name}" and removes
                              it from the client's portal. This can't be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => submit({ id: project._id }, { method: "post" })}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
