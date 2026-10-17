import { useEffect, useState } from "react";
import { redirect, useFetcher } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/team";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { OrgRole, TeamMember } from "~/lib/types";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Users, UserPlus } from "lucide-react";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePortalUser(request);
  // Staff manage people from /cpadmin; this page is a client org's own team.
  if (user.role !== "user") throw redirect("/portal");
  const members = await callPortalApi(request, (accessToken) =>
    apiFetch<TeamMember[]>("/portal/team", { accessToken }),
  );
  return { user, members, canManage: user.orgRole === "client_admin" };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const id = String(formData.get("id") ?? "");

  try {
    if (intent === "invite") {
      const email = String(formData.get("email") ?? "").trim();
      await callPortalApi(request, (accessToken) =>
        apiFetch("/portal/team/invite", {
          method: "POST",
          accessToken,
          body: {
            firstName: String(formData.get("firstName") ?? "").trim(),
            lastName: String(formData.get("lastName") ?? "").trim(),
            email,
            orgRole: String(formData.get("orgRole") ?? "client_viewer"),
          },
        }),
      );
      return { ok: true as const, message: `Invite sent to ${email}.` };
    }
    if (intent === "resend") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/team/${id}/resend-invite`, { method: "POST", accessToken }),
      );
      return { ok: true as const, message: "Invite sent again." };
    }
    if (intent === "role") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/team/${id}`, {
          method: "PATCH",
          accessToken,
          body: { orgRole: String(formData.get("orgRole")) },
        }),
      );
      return { ok: true as const, message: "Role updated." };
    }
    if (intent === "deactivate" || intent === "reactivate") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/team/${id}`, {
          method: "PATCH",
          accessToken,
          body: { active: intent === "reactivate" },
        }),
      );
      return { ok: true as const, message: intent === "reactivate" ? "Access restored." : "Access removed." };
    }
    return { error: "Unknown action." };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

const ROLE_LABEL: Record<OrgRole, string> = {
  client_admin: "Admin",
  client_viewer: "Viewer",
};

const ROLE_HELP = "Admins can sign contracts, approve work, pay invoices and manage the team. Viewers can see everything but can't act on it.";

const STATUS: Record<TeamMember["status"], { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "Active", variant: "default" },
  invited: { label: "Invited", variant: "secondary" },
  invite_expired: { label: "Invite expired", variant: "outline" },
  deactivated: { label: "No access", variant: "destructive" },
};

/** Surfaces every fetcher's result as a toast, the same way the project tabs do. */
function useResultToast(fetcher: ReturnType<typeof useFetcher<typeof action>>) {
  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if ("error" in fetcher.data && fetcher.data.error) toast.error(fetcher.data.error);
    else if ("message" in fetcher.data && fetcher.data.message) toast.success(fetcher.data.message);
  }, [fetcher.state, fetcher.data]);
}

function InviteDialog() {
  const fetcher = useFetcher<typeof action>();
  const [open, setOpen] = useState(false);
  const isSaving = fetcher.state !== "idle";
  useResultToast(fetcher);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && "ok" in fetcher.data) setOpen(false);
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-3.5" />
          Invite someone
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a colleague</DialogTitle>
          <DialogDescription>They'll get an email with a link to set a password and sign in.</DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="invite" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="invite-first">First name</Label>
              <Input id="invite-first" name="firstName" required maxLength={80} autoComplete="off" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-last">Last name</Label>
              <Input id="invite-last" name="lastName" required maxLength={80} autoComplete="off" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-email">Work email</Label>
            <Input id="invite-email" name="email" type="email" required autoComplete="off" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select id="invite-role" name="orgRole" defaultValue="client_viewer" className="w-full" aria-describedby="invite-role-help">
              <option value="client_viewer">Viewer</option>
              <option value="client_admin">Admin</option>
            </Select>
            <p id="invite-role-help" className="text-xs text-white/40">
              {ROLE_HELP}
            </p>
          </div>
          {fetcher.data && "error" in fetcher.data && fetcher.data.error && (
            <p className="text-red-400 text-sm">{fetcher.data.error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Sending..." : "Send invite"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

function MemberRow({ member, isSelf, canManage }: { member: TeamMember; isSelf: boolean; canManage: boolean }) {
  const fetcher = useFetcher<typeof action>();
  useResultToast(fetcher);
  const busy = fetcher.state !== "idle";
  const status = STATUS[member.status];
  const name = `${member.firstName} ${member.lastName}`;
  const pending = member.status === "invited" || member.status === "invite_expired";

  return (
    <li className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-white">
            {name}
            {isSelf && <span className="ml-1.5 text-white/40 font-normal">(you)</span>}
          </p>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <p className="text-xs text-white/45 mt-0.5 truncate">{member.email}</p>
      </div>

      {canManage ? (
        <div className="flex flex-wrap items-center gap-2">
          <Label htmlFor={`role-${member._id}`} className="sr-only">
            Role for {name}
          </Label>
          <Select
            id={`role-${member._id}`}
            value={member.orgRole ?? "client_viewer"}
            disabled={busy || member.status === "deactivated"}
            className="py-1.5"
            onChange={(e) =>
              fetcher.submit({ intent: "role", id: member._id, orgRole: e.target.value }, { method: "post" })
            }
          >
            <option value="client_viewer">Viewer</option>
            <option value="client_admin">Admin</option>
          </Select>

          {pending && (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => fetcher.submit({ intent: "resend", id: member._id }, { method: "post" })}
            >
              Resend invite
            </Button>
          )}

          {member.status === "deactivated" ? (
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => fetcher.submit({ intent: "reactivate", id: member._id }, { method: "post" })}
            >
              Restore access
            </Button>
          ) : (
            !isSelf && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="ghost" disabled={busy} className="text-red-400 hover:text-red-300">
                    {pending ? "Cancel invite" : "Remove access"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {pending ? `Cancel ${member.firstName}'s invite?` : `Remove ${name}'s access?`}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {pending
                        ? "The link in their email will stop working. You can invite them again later."
                        : "They'll be signed out and won't be able to sign in to the portal. You can restore their access later."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => fetcher.submit({ intent: "deactivate", id: member._id }, { method: "post" })}
                    >
                      {pending ? "Cancel invite" : "Remove access"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )
          )}
        </div>
      ) : (
        <p className="text-xs text-white/50">{ROLE_LABEL[member.orgRole ?? "client_viewer"]}</p>
      )}
    </li>
  );
}

export default function PortalTeam({ loaderData }: Route.ComponentProps) {
  const { user, members, canManage } = loaderData;
  const org = typeof user.organization === "object" ? user.organization?.name : undefined;

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Team"
        description={`People${org ? ` at ${org}` : ""} who can sign in to the portal.`}
        actions={canManage ? <InviteDialog /> : undefined}
      />

      {canManage && <p className="text-xs text-white/40 mb-4 max-w-2xl">{ROLE_HELP}</p>}

      {members.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <EmptyState icon={Users} title="No one here yet" description="Invite a colleague to get started." />
        </div>
      ) : (
        <ul className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.02]">
          {members.map((member) => (
            <MemberRow key={member._id} member={member} isSelf={member._id === user._id} canManage={canManage} />
          ))}
        </ul>
      )}
    </div>
  );
}
