import { useEffect, useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import type { Route } from "./+types/people";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Organization, OrgRole, PlatformRole, PortalUser } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { UserPlus, Mail, Users2, Pencil, Ban, RotateCcw, Trash2 } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";

interface UsersListResponse {
  data: PortalUser[];
  total: number;
  page: number;
  limit: number;
}

const PAGE_SIZE = 20;

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");

  const [users, organizations] = await Promise.all([
    callAdminApi(request, (accessToken) =>
      apiFetch<UsersListResponse>(`/users?page=${page}&limit=${PAGE_SIZE}`, { accessToken }),
    ),
    callAdminApi(request, (accessToken) =>
      apiFetch<Organization[]>("/organizations", { accessToken }),
    ),
  ]);

  return {
    people: users.data,
    organizations,
    page,
    totalPages: Math.max(1, Math.ceil(users.total / PAGE_SIZE)),
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "resend-invite") {
      const id = String(formData.get("id"));
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/users/${id}/resend-invite`, { method: "POST", accessToken }),
      );
      return { ok: true };
    }

    if (intent === "set-active") {
      const id = String(formData.get("id"));
      const isActive = formData.get("isActive") === "true";
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/users/${id}`, { method: "PATCH", accessToken, body: { isActive } }),
      );
      return { ok: true };
    }

    if (intent === "remove") {
      const id = String(formData.get("id"));
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/users/${id}`, { method: "DELETE", accessToken }),
      );
      return { ok: true };
    }

    if (intent === "edit") {
      const id = String(formData.get("id"));
      const role = String(formData.get("role")) as PlatformRole;
      const body: Record<string, unknown> = { role };
      if (role === "user") {
        body.organization = String(formData.get("organization") ?? "");
        body.orgRole = String(formData.get("orgRole") ?? "client_viewer");
      }
      if (role === "manager" || role === "admin") {
        // Only include a rate if the field was actually filled in. These
        // inputs can never be prefilled (the backend never returns them —
        // see PortalUser/User.costRate's select:false), so most edits to a
        // staff member's role or org will leave them blank. Number(formData
        // .get(...)) on an empty string is 0, not undefined — coercing that
        // into the PATCH body would silently zero out a real, previously
        // configured rate on every unrelated edit.
        const costRate = formData.get("costRate");
        const billRate = formData.get("billRate");
        if (costRate !== null && String(costRate).trim() !== "") {
          body.costRate = Number(costRate);
        }
        if (billRate !== null && String(billRate).trim() !== "") {
          body.billRate = Number(billRate);
        }
      }
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/users/${id}`, { method: "PATCH", accessToken, body }),
      );
      return { ok: true };
    }

    // intent === "invite"
    const role = String(formData.get("role")) as PlatformRole;
    const body: Record<string, unknown> = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      role,
    };

    if (role === "user") {
      body.organization = String(formData.get("organization") ?? "");
      body.orgRole = String(formData.get("orgRole") ?? "client_viewer");
    }

    await callAdminApi(request, (accessToken) =>
      apiFetch("/users/invite", { method: "POST", accessToken, body }),
    );
    return { ok: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

const ROLE_LABEL: Record<PlatformRole, string> = {
  admin: "Admin",
  manager: "Staff (PM / team)",
  editor: "Editor",
  user: "Client",
};

const ORG_ROLE_LABEL: Record<OrgRole, string> = {
  client_admin: "Client admin",
  client_viewer: "Client viewer",
};

function orgName(user: PortalUser, organizations: Organization[]) {
  if (typeof user.organization === "object") return user.organization?.name;
  return organizations.find((o) => o._id === user.organization)?.name;
}

function orgId(user: PortalUser) {
  return typeof user.organization === "object" ? user.organization?._id : user.organization;
}

export default function AdminPeople({ loaderData }: Route.ComponentProps) {
  const { people, organizations, page, totalPages } = loaderData;
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();
  const [isInviting, setIsInviting] = useState(false);
  const [inviteRole, setInviteRole] = useState<PlatformRole>("user");
  const [editing, setEditing] = useState<PortalUser | null>(null);
  const [editRole, setEditRole] = useState<PlatformRole>("user");

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && "ok" in fetcher.data && fetcher.data.ok) {
      setIsInviting(false);
      setEditing(null);
    }
  }, [fetcher.state, fetcher.data]);

  const isSaving = fetcher.state !== "idle";
  const [query, setQuery] = useState("");
  const filtered = people.filter((p) =>
    `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(query.toLowerCase()),
  );

  function openEdit(person: PortalUser) {
    setEditing(person);
    setEditRole(person.role);
  }

  return (
    <div>
      <AdminPageHeader
        title="People"
        description="Everyone invited to the client portal — clients and staff."
        actions={
          <Button onClick={() => setIsInviting(true)}>
            <UserPlus className="size-4" />
            Invite Person
          </Button>
        }
      />

      {people.length > 0 && (
        <ListSearch value={query} onChange={setQuery} placeholder="Search this page..." className="mb-4" />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {people.length === 0 ? (
          <EmptyState
            icon={Users2}
            title="No one invited yet"
            description="Invite a client or a staff member to get them into the portal."
            action={
              <Button size="sm" onClick={() => setIsInviting(true)}>
                <UserPlus className="size-4" />
                Invite Person
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Name</TableHead>
                <TableHead className="text-white/60">Email</TableHead>
                <TableHead className="text-white/60">Role</TableHead>
                <TableHead className="text-white/60">Organization</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell colSpan={6} className="text-white/40 py-8 text-center">
                    No one matches "{query}".
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((person) => (
                <TableRow key={person._id} className="border-white/10">
                  <TableCell className="text-white font-medium">
                    {person.firstName} {person.lastName}
                  </TableCell>
                  <TableCell className="text-white/50">{person.email}</TableCell>
                  <TableCell className="text-white/50">
                    {ROLE_LABEL[person.role]}
                    {person.role === "user" && person.orgRole && (
                      <span className="text-white/30"> · {ORG_ROLE_LABEL[person.orgRole]}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-white/50">
                    {orgName(person, organizations) ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={person.isActive ? "default" : "secondary"}>
                      {person.isActive ? "Active" : "Invited"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!person.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isSaving}
                          onClick={() =>
                            fetcher.submit(
                              { intent: "resend-invite", id: person._id },
                              { method: "post" },
                            )
                          }
                        >
                          <Mail className="size-3.5" />
                          Resend invite
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => openEdit(person)} disabled={isSaving}>
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                      {person.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isSaving}
                          onClick={() =>
                            fetcher.submit(
                              { intent: "set-active", id: person._id, isActive: "false" },
                              { method: "post" },
                            )
                          }
                        >
                          <Ban className="size-3.5" />
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isSaving}
                          onClick={() =>
                            fetcher.submit(
                              { intent: "set-active", id: person._id, isActive: "true" },
                              { method: "post" },
                            )
                          }
                        >
                          <RotateCcw className="size-3.5" />
                          Reactivate
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isSaving}>
                            <Trash2 className="size-3.5 text-red-400" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove {person.firstName} {person.lastName}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This permanently deletes their account. Consider Deactivate instead if you
                              might need their history later — deactivating blocks login without deleting
                              the record.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                fetcher.submit(
                                  { intent: "remove", id: person._id },
                                  { method: "post" },
                                )
                              }
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6 justify-start">
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const params = new URLSearchParams(searchParams);
              params.set("page", String(p));
              return (
                <PaginationItem key={p}>
                  <PaginationLink href={`?${params.toString()}`} isActive={p === page}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={isInviting} onOpenChange={setIsInviting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Person</DialogTitle>
          </DialogHeader>

          <fetcher.Form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="invite" />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" name="lastName" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                name="role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as PlatformRole)}
              >
                <option value="user">Client</option>
                <option value="manager">Staff (PM / team)</option>
                <option value="admin">Admin</option>
              </Select>
            </div>

            {inviteRole === "user" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Select id="organization" name="organization" required defaultValue="">
                    <option value="" disabled>
                      Select a company...
                    </option>
                    {organizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.name}
                      </option>
                    ))}
                  </Select>
                  {organizations.length === 0 && (
                    <p className="text-xs text-white/40">
                      Create an organization first, on the Organizations page.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgRole">Access level</Label>
                  <Select id="orgRole" name="orgRole" defaultValue="client_viewer">
                    <option value="client_admin">Client admin — can pay, sign, approve</option>
                    <option value="client_viewer">Client viewer — read-only</option>
                  </Select>
                </div>
              </>
            )}

            {fetcher.data && "error" in fetcher.data && fetcher.data.error && (
              <p className="text-red-400 text-sm">{fetcher.data.error}</p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Sending invite..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit {editing?.firstName} {editing?.lastName}
            </DialogTitle>
          </DialogHeader>

          {editing && (
            <fetcher.Form method="post" className="space-y-4">
              <input type="hidden" name="intent" value="edit" />
              <input type="hidden" name="id" value={editing._id} />

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  id="edit-role"
                  name="role"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as PlatformRole)}
                >
                  <option value="user">Client</option>
                  <option value="manager">Staff (PM / team)</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor (marketing CMS only)</option>
                </Select>
              </div>

              {editRole === "user" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="edit-organization">Organization</Label>
                    <Select
                      id="edit-organization"
                      name="organization"
                      required
                      defaultValue={orgId(editing) ?? ""}
                    >
                      <option value="" disabled>
                        Select a company...
                      </option>
                      {organizations.map((org) => (
                        <option key={org._id} value={org._id}>
                          {org.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-orgRole">Access level</Label>
                    <Select id="edit-orgRole" name="orgRole" defaultValue={editing.orgRole ?? "client_viewer"}>
                      <option value="client_admin">Client admin — can pay, sign, approve</option>
                      <option value="client_viewer">Client viewer — read-only</option>
                    </Select>
                  </div>
                </>
              )}

              {(editRole === "manager" || editRole === "admin") && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-costRate">Cost rate</Label>
                    <Input
                      id="edit-costRate"
                      name="costRate"
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="Leave blank to keep unchanged"
                    />
                    <p className="text-xs text-white/40">Internal — never shown to a client.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-billRate">Bill rate</Label>
                    <Input
                      id="edit-billRate"
                      name="billRate"
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="Leave blank to keep unchanged"
                    />
                    <p className="text-xs text-white/40">Used when generating invoices from logged time.</p>
                  </div>
                </div>
              )}

              {fetcher.data && "error" in fetcher.data && fetcher.data.error && (
                <p className="text-red-400 text-sm">{fetcher.data.error}</p>
              )}

              <DialogFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </fetcher.Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
