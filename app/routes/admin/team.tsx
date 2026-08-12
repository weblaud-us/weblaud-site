import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { Route } from "./+types/team";
import { apiFetch, ApiError, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { TeamMember } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Users, Plus, UserRound } from "lucide-react";
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
  const members = await callAdminApi(request, (accessToken) =>
    apiFetch<TeamMember[]>("/team/admin", { accessToken }),
  );
  return {
    members: members.map((member) => ({
      ...member,
      avatar: member.avatar ? resolveMediaUrl(member.avatar) : member.avatar,
    })),
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "delete") {
      const id = String(formData.get("id"));
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/team/${id}`, { method: "DELETE", accessToken }),
      );
      return { ok: true };
    }

    const body = new FormData();
    body.set("name", String(formData.get("name") ?? ""));
    body.set("title", String(formData.get("title") ?? ""));
    body.set("isActive", formData.get("isActive") === "on" ? "true" : "false");
    body.set(
      "social",
      JSON.stringify({
        linkedin: String(formData.get("linkedin") ?? ""),
        facebook: String(formData.get("facebook") ?? ""),
        twitter: String(formData.get("twitter") ?? ""),
      }),
    );
    const avatar = formData.get("avatar");
    if (avatar instanceof File && avatar.size > 0) {
      body.set("avatar", avatar);
    }

    if (intent === "create") {
      await callAdminApi(request, (accessToken) =>
        apiFetch("/team", { method: "POST", accessToken, body }),
      );
    } else {
      const id = String(formData.get("id"));
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/team/${id}`, { method: "PATCH", accessToken, body }),
      );
    }
    return { ok: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

export default function AdminTeam({ loaderData }: Route.ComponentProps) {
  const { members } = loaderData;
  const fetcher = useFetcher<typeof action>();
  const [editing, setEditing] = useState<TeamMember | "new" | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setEditing(null);
    }
  }, [fetcher.state, fetcher.data]);

  const isSaving = fetcher.state !== "idle";
  const editingMember = editing !== "new" ? editing : null;
  const [query, setQuery] = useState("");
  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <AdminPageHeader
        title="Team"
        description="Team grid shown on /aboutus."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" />
            Add Member
          </Button>
        }
      />

      {members.length > 0 && (
        <ListSearch value={query} onChange={setQuery} placeholder="Search team..." className="mb-4" />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No team members yet"
            description="Add your first team member to show them on the site."
            action={
              <Button size="sm" onClick={() => setEditing("new")}>
                <Plus className="size-4" />
                Add Member
              </Button>
            }
          />
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">Avatar</TableHead>
              <TableHead className="text-white/60">Name</TableHead>
              <TableHead className="text-white/60">Title</TableHead>
              <TableHead className="text-white/60">Status</TableHead>
              <TableHead className="text-white/60 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={5} className="text-white/40 py-8 text-center">
                  No team members match "{query}".
                </TableCell>
              </TableRow>
            )}
            {filtered.map((member) => (
              <TableRow key={member._id} className="border-white/10">
                <TableCell>
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-white/5 flex items-center justify-center">
                      <UserRound className="size-4 text-white/30" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-white font-medium">
                  {member.name}
                </TableCell>
                <TableCell className="text-white/50">{member.title}</TableCell>
                <TableCell>
                  <Badge variant={member.isActive ? "default" : "secondary"}>
                    {member.isActive ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(member)}
                  >
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
                        <AlertDialogTitle>Delete team member?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes "{member.name}" from the
                          team grid.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            fetcher.submit(
                              { intent: "delete", id: member._id },
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
            <DialogTitle>
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </DialogTitle>
          </DialogHeader>

          <fetcher.Form method="post" encType="multipart/form-data" className="space-y-4">
            <input
              type="hidden"
              name="intent"
              value={editingMember ? "update" : "create"}
            />
            {editingMember && (
              <input type="hidden" name="id" value={editingMember._id} />
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={editingMember?.name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={editingMember?.title}
              />
            </div>

            <div className="space-y-2">
              {editingMember?.avatar && (
                <img
                  src={editingMember.avatar}
                  alt={editingMember.name}
                  className="size-16 rounded-full object-cover"
                />
              )}
              <Label htmlFor="avatar">
                {editingMember ? "Replace avatar" : "Avatar"}
              </Label>
              <Input id="avatar" name="avatar" type="file" accept="image/*" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  defaultValue={editingMember?.social?.linkedin}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  defaultValue={editingMember?.social?.facebook}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  defaultValue={editingMember?.social?.twitter}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-white/70">
              <Checkbox
                name="isActive"
                defaultChecked={editingMember?.isActive ?? true}
              />
              Visible on the team grid
            </label>

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
