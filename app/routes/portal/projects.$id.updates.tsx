import { useEffect, useState } from "react";
import { useFetcher, useOutletContext } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/projects.$id.updates";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { ProjectUpdateItem, UpdateAuthorRef } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { EmptyState } from "~/components/admin/empty-state";
import { MessageSquarePlus, Check, X, RotateCcw, MessagesSquare } from "lucide-react";
import { LocalTime } from "~/components/ui/local-time";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const updates = await callPortalApi(request, (accessToken) =>
    apiFetch<ProjectUpdateItem[]>(`/portal/projects/${params.id}/updates`, { accessToken }),
  );
  return { updates };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "create") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/updates`, {
          method: "POST",
          accessToken,
          body: {
            title: String(formData.get("title") ?? ""),
            body: String(formData.get("body") ?? ""),
            type: String(formData.get("type") ?? "progress"),
            ...(formData.get("progressValue")
              ? { progressValue: Number(formData.get("progressValue")) }
              : {}),
          },
        }),
      );
      return { ok: true };
    }

    if (intent === "resubmit") {
      const id = String(formData.get("id"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/updates/${id}`, {
          method: "PATCH",
          accessToken,
          body: {
            title: String(formData.get("title") ?? ""),
            body: String(formData.get("body") ?? ""),
          },
        }),
      );
      return { ok: true };
    }

    if (intent === "approve") {
      const id = String(formData.get("id"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/updates/${id}/approve`, { method: "POST", accessToken }),
      );
      return { ok: true };
    }

    if (intent === "reject") {
      const id = String(formData.get("id"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/updates/${id}/reject`, {
          method: "POST",
          accessToken,
          body: { reviewNote: String(formData.get("reviewNote") ?? "") },
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

const TYPE_LABEL: Record<string, string> = {
  progress: "Progress",
  milestone: "Milestone",
  general: "General",
};

function authorName(ref: UpdateAuthorRef | string | undefined) {
  if (!ref || typeof ref === "string") return "Someone";
  return `${ref.firstName} ${ref.lastName}`;
}

function AuthorAvatar({ author }: { author: UpdateAuthorRef | string | undefined }) {
  if (!author || typeof author === "string") return null;
  const initials = `${author.firstName[0] ?? ""}${author.lastName[0] ?? ""}`.toUpperCase();
  return (
    <Avatar size="sm">
      {author.avatar && <AvatarImage src={author.avatar} alt="" />}
      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
    </Avatar>
  );
}

function ComposeUpdateForm({ onDone }: { onDone: () => void }) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        toast.success("Update posted.");
        onDone();
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post" className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3 mb-6">
      <input type="hidden" name="intent" value="create" />
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required placeholder="e.g. Homepage design finished" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <Select id="type" name="type" defaultValue="progress">
            <option value="progress">Progress</option>
            <option value="milestone">Milestone</option>
            <option value="general">General</option>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="body">Details</Label>
        <Textarea id="body" name="body" required className="h-24" placeholder="What happened, what's next..." />
      </div>
      <div className="space-y-1.5 max-w-[180px]">
        <Label htmlFor="progressValue">New progress % (optional)</Label>
        <Input id="progressValue" name="progressValue" type="number" min={0} max={100} />
      </div>
      <Button type="submit" size="sm" disabled={isSaving}>
        {isSaving ? "Posting..." : "Post update"}
      </Button>
    </fetcher.Form>
  );
}

function RejectForm({ id }: { id: string }) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) setOpen(false);
  }, [fetcher.state, fetcher.data]);

  if (!open) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <X className="size-3.5" />
        Reject
      </Button>
    );
  }

  return (
    <fetcher.Form method="post" className="flex items-center gap-2 flex-1">
      <input type="hidden" name="intent" value="reject" />
      <input type="hidden" name="id" value={id} />
      <Input
        name="reviewNote"
        required
        placeholder="What needs to change?"
        className="h-8 text-xs"
        autoFocus
      />
      <Button type="submit" size="sm" variant="destructive" disabled={fetcher.state !== "idle"}>
        Send
      </Button>
    </fetcher.Form>
  );
}

function ResubmitForm({ update, onDone }: { update: ProjectUpdateItem; onDone: () => void }) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        toast.success("Resubmitted for review.");
        onDone();
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post" className="space-y-2 mt-3">
      <input type="hidden" name="intent" value="resubmit" />
      <input type="hidden" name="id" value={update._id} />
      <Input name="title" required defaultValue={update.title} className="h-8 text-sm" />
      <Textarea name="body" required defaultValue={update.body} className="h-20 text-sm" />
      <Button type="submit" size="sm" disabled={isSaving}>
        <RotateCcw className="size-3.5" />
        {isSaving ? "Resubmitting..." : "Resubmit"}
      </Button>
    </fetcher.Form>
  );
}

function UpdateCard({
  update,
  isPm,
  currentUserId,
}: {
  update: ProjectUpdateItem;
  isPm: boolean;
  currentUserId: string;
}) {
  const [isResubmitting, setIsResubmitting] = useState(false);
  const isOwnAuthor =
    typeof update.author !== "string" && update.author._id === currentUserId;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <AuthorAvatar author={update.author} />
          <div>
            <p className="text-sm text-white font-medium">{update.title}</p>
            <p className="text-xs text-white/40">
              {authorName(update.author)} · {update.authorRole === "pm" ? "PM" : "Developer"} ·{" "}
              <LocalTime value={update.createdAt} />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="outline">{TYPE_LABEL[update.type]}</Badge>
          {update.status === "pending_review" && <Badge variant="secondary">Pending review</Badge>}
          {update.status === "rejected" && <Badge variant="destructive">Needs changes</Badge>}
        </div>
      </div>

      <p className="text-sm text-white/70 whitespace-pre-wrap">{update.body}</p>

      {update.progressValue !== undefined && (
        <p className="text-xs text-white/40 mt-2">Progress set to {update.progressValue}%</p>
      )}

      {update.status === "rejected" && update.reviewNote && (
        <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
          <p className="text-xs text-red-300">
            <span className="font-medium">Feedback:</span> {update.reviewNote}
          </p>
        </div>
      )}

      {update.status === "rejected" && isOwnAuthor && !isResubmitting && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-3"
          onClick={() => setIsResubmitting(true)}
        >
          <RotateCcw className="size-3.5" />
          Edit &amp; resubmit
        </Button>
      )}
      {update.status === "rejected" && isOwnAuthor && isResubmitting && (
        <ResubmitForm update={update} onDone={() => setIsResubmitting(false)} />
      )}

      {update.status === "pending_review" && isPm && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
          <ApproveButton id={update._id} />
          <RejectForm id={update._id} />
        </div>
      )}
    </div>
  );
}

function ApproveButton({ id }: { id: string }) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.error) toast.error(fetcher.data.error);
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="approve" />
      <input type="hidden" name="id" value={id} />
      <Button type="submit" size="sm" disabled={fetcher.state !== "idle"}>
        <Check className="size-3.5" />
        Approve
      </Button>
    </fetcher.Form>
  );
}

export default function PortalProjectUpdates({ loaderData }: Route.ComponentProps) {
  const { updates } = loaderData;
  const { user, isPm, isStaffOnProject } = useOutletContext<ProjectWorkspaceContext>();
  const [isComposing, setIsComposing] = useState(false);

  return (
    <div>
      {isStaffOnProject && !isComposing && (
        <Button size="sm" className="mb-6" onClick={() => setIsComposing(true)}>
          <MessageSquarePlus className="size-4" />
          Post update
        </Button>
      )}
      {isStaffOnProject && isComposing && (
        <ComposeUpdateForm onDone={() => setIsComposing(false)} />
      )}

      {updates.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <EmptyState
            icon={MessagesSquare}
            title="No updates yet"
            description={
              isStaffOnProject
                ? "Post the first progress update for this project."
                : "Your team will post updates here as work progresses."
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <UpdateCard key={update._id} update={update} isPm={isPm} currentUserId={user._id} />
          ))}
        </div>
      )}
    </div>
  );
}
