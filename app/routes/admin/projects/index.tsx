import { useState } from "react";
import { Link, useNavigation, useSubmit } from "react-router";
import type { Route } from "./+types/index";
import { apiFetch, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { BackendProject } from "~/lib/adapters/project.server";
import { Button } from "~/components/ui/button";
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

export async function loader() {
  const projects = await apiFetch<BackendProject[]>("/projects");
  return {
    projects: projects.map((project) => ({
      ...project,
      coverImage: resolveMediaUrl(project.coverImage),
    })),
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = String(formData.get("id"));
  await callAdminApi(request, (accessToken) =>
    apiFetch(`/projects/${id}`, { method: "DELETE", accessToken }),
  );
  return null;
}

export default function AdminProjectsIndex({
  loaderData,
}: Route.ComponentProps) {
  const { projects } = loaderData;
  const submit = useSubmit();
  const navigation = useNavigation();
  const deletingId = navigation.formData?.get("id")
    ? String(navigation.formData.get("id"))
    : null;
  const [query, setQuery] = useState("");
  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Case studies shown on /projects."
        actions={
          <Link to="/cpadmin/projects/new">
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
            title="No projects yet"
            description="Create your first case study to show it on the site."
            action={
              <Link to="/cpadmin/projects/new">
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
              <TableHead className="text-white/60">Cover</TableHead>
              <TableHead className="text-white/60">Name</TableHead>
              <TableHead className="text-white/60">Slug</TableHead>
              <TableHead className="text-white/60 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={4} className="text-white/40 py-8 text-center">
                  No projects match "{query}".
                </TableCell>
              </TableRow>
            )}
            {filtered.map((project) => (
              <TableRow key={project._id} className="border-white/10">
                <TableCell>
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.coverImageAlt || project.name}
                      className="size-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="size-12 rounded-md bg-white/5" />
                  )}
                </TableCell>
                <TableCell className="text-white font-medium">
                  {project.name}
                </TableCell>
                <TableCell className="text-white/50">{project.slug}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Link to={`/cpadmin/projects/${project._id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === project._id}
                      >
                        {deletingId === project._id ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete project?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently deletes "{project.name}" and its
                          images. This can't be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            submit(
                              { id: project._id },
                              { method: "post" },
                            )
                          }
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </div>
    </div>
  );
}
