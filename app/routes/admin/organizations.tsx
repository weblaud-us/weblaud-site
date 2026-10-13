import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/organizations";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Organization } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Building2, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
  const organizations = await callAdminApi(request, (accessToken) =>
    apiFetch<Organization[]>("/organizations", { accessToken }),
  );
  return { organizations };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "delete") {
      const id = String(formData.get("id"));
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/organizations/${id}`, { method: "DELETE", accessToken }),
      );
      return { ok: true };
    }

    const body = {
      name: String(formData.get("name") ?? ""),
      billingEmail: String(formData.get("billingEmail") ?? ""),
      address: String(formData.get("address") ?? ""),
      taxId: String(formData.get("taxId") ?? ""),
      defaultCurrency: String(formData.get("defaultCurrency") ?? "USD"),
      notes: String(formData.get("notes") ?? ""),
    };

    if (intent === "create") {
      await callAdminApi(request, (accessToken) =>
        apiFetch("/organizations", { method: "POST", accessToken, body }),
      );
    } else {
      const id = String(formData.get("id"));
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/organizations/${id}`, { method: "PATCH", accessToken, body }),
      );
    }
    return { ok: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

export default function AdminOrganizations({ loaderData }: Route.ComponentProps) {
  const { organizations } = loaderData;
  const fetcher = useFetcher<typeof action>();
  const [editing, setEditing] = useState<Organization | "new" | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setEditing(null);
    }
  }, [fetcher.state, fetcher.data]);

  const isSaving = fetcher.state !== "idle";
  const editingOrg = editing !== "new" ? editing : null;
  const [query, setQuery] = useState("");
  const filtered = organizations.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <AdminPageHeader
        title="Organizations"
        description="Client companies invited to the portal."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" />
            New Organization
          </Button>
        }
      />

      {organizations.length > 0 && (
        <ListSearch value={query} onChange={setQuery} placeholder="Search organizations..." className="mb-4" />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {organizations.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No organizations yet"
            description="Create the client's company before inviting their people."
            action={
              <Button size="sm" onClick={() => setEditing("new")}>
                <Plus className="size-4" />
                New Organization
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Name</TableHead>
                <TableHead className="text-white/60">Billing Email</TableHead>
                <TableHead className="text-white/60">Currency</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell colSpan={5} className="text-white/40 py-8 text-center">
                    No organizations match "{query}".
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((org) => (
                <TableRow key={org._id} className="border-white/10">
                  <TableCell className="text-white font-medium">{org.name}</TableCell>
                  <TableCell className="text-white/50">{org.billingEmail}</TableCell>
                  <TableCell className="text-white/50">{org.defaultCurrency}</TableCell>
                  <TableCell>
                    <Badge variant={org.isActive ? "default" : "secondary"}>
                      {org.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(org)}>
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete organization?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently removes "{org.name}". Any client
                            projects or invited users referencing it will be
                            orphaned — remove those first.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              fetcher.submit(
                                { intent: "delete", id: org._id },
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

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingOrg ? "Edit Organization" : "New Organization"}</DialogTitle>
          </DialogHeader>

          <fetcher.Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value={editingOrg ? "update" : "create"} />
            {editingOrg && <input type="hidden" name="id" value={editingOrg._id} />}

            <div className="space-y-2">
              <Label htmlFor="name">Company name</Label>
              <Input id="name" name="name" required defaultValue={editingOrg?.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingEmail">Billing email</Label>
              <Input
                id="billingEmail"
                name="billingEmail"
                type="email"
                required
                defaultValue={editingOrg?.billingEmail}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Currency</Label>
                <Input
                  id="defaultCurrency"
                  name="defaultCurrency"
                  defaultValue={editingOrg?.defaultCurrency ?? "USD"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input id="taxId" name="taxId" defaultValue={editingOrg?.taxId} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={editingOrg?.address} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" name="notes" defaultValue={editingOrg?.notes} />
            </div>

            {fetcher.data && "error" in fetcher.data && fetcher.data.error && (
              <p className="text-red-400 text-sm">{fetcher.data.error}</p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
