import { useState } from "react";
import { Link, useSubmit, useNavigation } from "react-router";
import type { Route } from "./+types/index";
import { apiFetch, ApiError, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { AdminService } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Wrench, Plus } from "lucide-react";
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
  const services = await apiFetch<AdminService[]>("/services");
  return {
    services: services.map((service) => ({
      ...service,
      image: service.image ? resolveMediaUrl(service.image) : service.image,
    })),
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = String(formData.get("id"));
  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/services/${id}`, { method: "DELETE", accessToken }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
  return null;
}

export default function AdminServicesIndex({
  loaderData,
}: Route.ComponentProps) {
  const { services } = loaderData;
  const submit = useSubmit();
  const navigation = useNavigation();
  const deletingId = navigation.formData?.get("id")
    ? String(navigation.formData.get("id"))
    : null;
  const [query, setQuery] = useState("");
  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Service cards shown on /services."
        actions={
          <Link to="/cpadmin/services/new">
            <Button>
              <Plus className="size-4" />
              New Service
            </Button>
          </Link>
        }
      />

      {services.length > 0 && (
        <ListSearch value={query} onChange={setQuery} placeholder="Search services..." className="mb-4" />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {services.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No services yet"
            description="Add your first service to show it on the site."
            action={
              <Link to="/cpadmin/services/new">
                <Button size="sm">
                  <Plus className="size-4" />
                  New Service
                </Button>
              </Link>
            }
          />
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">Image</TableHead>
              <TableHead className="text-white/60">Title</TableHead>
              <TableHead className="text-white/60">Features</TableHead>
              <TableHead className="text-white/60 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={4} className="text-white/40 py-8 text-center">
                  No services match "{query}".
                </TableCell>
              </TableRow>
            )}
            {filtered.map((service) => (
              <TableRow key={service._id} className="border-white/10">
                <TableCell>
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="size-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="size-12 rounded-md bg-white/5" />
                  )}
                </TableCell>
                <TableCell className="text-white font-medium">
                  {service.title}
                </TableCell>
                <TableCell className="text-white/50">
                  {service.features.length}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link to={`/cpadmin/services/${service._id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === service._id}
                      >
                        {deletingId === service._id ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete service?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently deletes "{service.title}". This
                          can't be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            submit({ id: service._id }, { method: "post" })
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
