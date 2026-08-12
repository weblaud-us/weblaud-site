import { useState } from "react";
import { Link, useSearchParams, useSubmit, useNavigation } from "react-router";
import type { Route } from "./+types/index";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Career, Paginated } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Briefcase, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";
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
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const result = await callAdminApi(request, (accessToken) =>
    apiFetch<Paginated<Career>>(`/careers/admin?page=${page}&limit=20`, {
      accessToken,
    }),
  );
  return { result, page: Number(page) };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = String(formData.get("id"));
  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/careers/${id}`, { method: "DELETE", accessToken }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
  return null;
}

export default function AdminCareersIndex({ loaderData }: Route.ComponentProps) {
  const { result, page } = loaderData;
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const navigation = useNavigation();
  const deletingId = navigation.formData?.get("id")
    ? String(navigation.formData.get("id"))
    : null;
  const [query, setQuery] = useState("");
  const filtered = result.items.filter((job) =>
    job.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <AdminPageHeader
        title="Careers"
        description="Job posts shown on /career."
        actions={
          <Link to="/cpadmin/careers/new">
            <Button>
              <Plus className="size-4" />
              New Job Post
            </Button>
          </Link>
        }
      />

      {result.items.length > 0 && (
        <ListSearch
          value={query}
          onChange={setQuery}
          placeholder="Search this page..."
          className="mb-4"
        />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {result.items.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No job posts yet"
            description="Publish your first opening to show it on /career."
            action={
              <Link to="/cpadmin/careers/new">
                <Button size="sm">
                  <Plus className="size-4" />
                  New Job Post
                </Button>
              </Link>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Title</TableHead>
                <TableHead className="text-white/60">Department</TableHead>
                <TableHead className="text-white/60">Location</TableHead>
                <TableHead className="text-white/60">Type</TableHead>
                <TableHead className="text-white/60">Openings</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell
                    colSpan={7}
                    className="text-white/40 py-8 text-center"
                  >
                    No job posts match "{query}".
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((job) => (
                <TableRow key={job._id} className="border-white/10">
                  <TableCell className="text-white font-medium">
                    {job.title}
                  </TableCell>
                  <TableCell className="text-white/50">
                    {job.department || "—"}
                  </TableCell>
                  <TableCell className="text-white/50">
                    {job.location || "—"}
                  </TableCell>
                  <TableCell className="text-white/50">
                    {job.jobType || "—"}
                  </TableCell>
                  <TableCell className="text-white/50">{job.position}</TableCell>
                  <TableCell>
                    <Badge variant={job.isActive ? "default" : "secondary"}>
                      {job.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link to={`/cpadmin/careers/${job._id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === job._id}
                        >
                          {deletingId === job._id ? "Deleting..." : "Delete"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete job post?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently deletes "{job.title}" and every
                            application submitted for it. This can't be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              submit({ id: job._id }, { method: "post" })
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

      {result.meta.totalPages > 1 && (
        <Pagination className="mt-6 justify-start">
          <PaginationContent>
            {Array.from({ length: result.meta.totalPages }, (_, i) => i + 1).map(
              (p) => {
                const params = new URLSearchParams(searchParams);
                params.set("page", String(p));
                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href={`?${params.toString()}`}
                      isActive={p === page}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              },
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
