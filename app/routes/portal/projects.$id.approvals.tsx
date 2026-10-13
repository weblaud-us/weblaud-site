import { useEffect, useState } from "react";
import { useFetcher, useOutletContext } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/projects.$id.approvals";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Approval, ApprovalSubjectType, ProjectFile, UpdateAuthorRef } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { EmptyState } from "~/components/admin/empty-state";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CheckCircle2, Plus, Check, X } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const [approvals, files] = await Promise.all([
    callPortalApi(request, (accessToken) =>
      apiFetch<Approval[]>(`/portal/projects/${params.id}/approvals`, { accessToken }),
    ),
    callPortalApi(request, (accessToken) =>
      apiFetch<ProjectFile[]>(`/portal/projects/${params.id}/files`, { accessToken }),
    ),
  ]);
  return { approvals, files };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "create") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/approvals`, {
          method: "POST",
          accessToken,
          body: {
            subjectType: String(formData.get("subjectType") ?? "deliverable"),
            subjectId: String(formData.get("subjectId") ?? "") || undefined,
            title: String(formData.get("title") ?? ""),
            description: String(formData.get("description") ?? ""),
          },
        }),
      );
      return { ok: true };
    }
    if (intent === "approve" || intent === "reject") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/approvals/${String(formData.get("id"))}/${intent}`, {
          method: "POST",
          accessToken,
          body: { comment: String(formData.get("comment") ?? "") },
        }),
      );
      return { ok: true };
    }
    return { error: "Unknown action." };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

const SUBJECT_LABEL: Record<ApprovalSubjectType, string> = {
  deliverable: "Deliverable",
  milestone: "Milestone",
  change_request: "Change request",
  invoice: "Invoice",
};

const STATUS_LABEL: Record<Exclude<Approval["status"], "pending">, string> = {
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_VARIANT: Record<Approval["status"], "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
};

function authorName(ref: UpdateAuthorRef | string | undefined) {
  if (!ref || typeof ref === "string") return "Someone";
  return `${ref.firstName} ${ref.lastName}`;
}

function NewApprovalDialog({ files }: { files: ProjectFile[] }) {
  const fetcher = useFetcher<typeof action>();
  const [open, setOpen] = useState(false);
  const [subjectType, setSubjectType] = useState<ApprovalSubjectType>("deliverable");
  const isSaving = fetcher.state !== "idle";
  // Only files already marked visible to the client make sense to attach —
  // the approval is the mechanism that shows a deliverable to the client at
  // all, so an internal-only file would ask them to sign off on something
  // they can't actually see.
  const clientVisibleFiles = files.filter((f) => f.visibility === "client");

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) setOpen(false);
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-3.5" />
          Request approval
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request client approval</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="create" />
          <div className="space-y-2">
            <Label htmlFor="subjectType">Type</Label>
            <Select
              id="subjectType"
              name="subjectType"
              defaultValue="deliverable"
              onChange={(e) => setSubjectType(e.target.value as ApprovalSubjectType)}
            >
              {Object.entries(SUBJECT_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          {subjectType === "deliverable" && (
            <div className="space-y-2">
              <Label htmlFor="subjectId">File (optional)</Label>
              <Select id="subjectId" name="subjectId" defaultValue="">
                <option value="">No file attached</option>
                {clientVisibleFiles.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name}
                  </option>
                ))}
              </Select>
              {clientVisibleFiles.length === 0 && (
                <p className="text-xs text-white/40">
                  No client-visible files yet — upload one from the Files tab first.
                </p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required placeholder="Homepage design v2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" name="description" className="h-20" />
          </div>
          {fetcher.data?.error && <p className="text-red-400 text-sm">{fetcher.data.error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Sending..." : "Send to client"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

function DecisionForm({ id }: { id: string }) {
  const fetcher = useFetcher<typeof action>();
  const isBusy = fetcher.state !== "idle";
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.error) toast.error(fetcher.data.error);
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment"
        className="h-16 text-sm"
      />
      <div className="flex gap-2">
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="approve" />
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="comment" value={comment} />
          <Button type="submit" size="sm" disabled={isBusy}>
            <Check className="size-3.5" />
            Approve
          </Button>
        </fetcher.Form>
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="reject" />
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="comment" value={comment} />
          <Button type="submit" size="sm" variant="outline" disabled={isBusy}>
            <X className="size-3.5" />
            Reject
          </Button>
        </fetcher.Form>
      </div>
    </div>
  );
}

export default function PortalProjectApprovals({ loaderData }: Route.ComponentProps) {
  const { approvals, files } = loaderData;
  const { user, isPm } = useOutletContext<ProjectWorkspaceContext>();
  const canDecide = user.role === "admin" || user.orgRole === "client_admin";
  const fileById = new Map(files.map((f) => [f._id, f]));

  return (
    <div>
      {isPm && (
        <div className="mb-4 flex justify-end">
          <NewApprovalDialog files={files} />
        </div>
      )}

      {approvals.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <EmptyState
            icon={CheckCircle2}
            title="No approvals requested"
            description="Formal sign-offs on deliverables and milestones show up here, timestamped once decided."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {approvals.map((a) => (
            <div key={a._id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="font-medium text-white">{a.title}</p>
                <Badge variant={STATUS_VARIANT[a.status]}>
                  {a.status === "pending"
                    ? canDecide
                      ? "Awaiting your decision"
                      : "Awaiting client sign-off"
                    : STATUS_LABEL[a.status]}
                </Badge>
              </div>
              <p className="text-xs text-white/40 mb-2">
                {SUBJECT_LABEL[a.subjectType]} · Requested by {authorName(a.requestedBy)}
              </p>
              {a.description && <p className="text-sm text-white/70">{a.description}</p>}
              {a.subjectType === "deliverable" && a.subjectId && fileById.has(a.subjectId) && (
                <a
                  href={`/portal/files/${a.subjectId}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs text-[#0A84FF] hover:underline mt-1"
                >
                  {fileById.get(a.subjectId)?.name}
                </a>
              )}
              {a.status !== "pending" && a.comment && (
                <p className="text-xs text-white/50 mt-2">
                  {authorName(a.decidedBy)}: "{a.comment}"
                </p>
              )}
              {a.status === "pending" && canDecide && <DecisionForm id={a._id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
