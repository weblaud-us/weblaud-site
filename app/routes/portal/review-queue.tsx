import { useEffect } from "react";
import { Link, useFetcher } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/review-queue";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { ProjectUpdateItem, UpdateAuthorRef } from "~/lib/types";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Check, X, ClipboardCheck } from "lucide-react";
import { useState } from "react";

/** PM/admin's cross-project queue — every update waiting on their review. Backend already scopes this to projects the caller manages (see ProjectUpdateService.reviewQueue). */
export async function loader({ request }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const updates = await callPortalApi(request, (accessToken) =>
    apiFetch<ProjectUpdateItem[]>("/portal/updates/review-queue", { accessToken }),
  );
  return { updates };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const id = String(formData.get("id"));

  try {
    if (intent === "approve") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/updates/${id}/approve`, { method: "POST", accessToken }),
      );
      return { ok: true };
    }
    if (intent === "reject") {
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

function authorName(ref: UpdateAuthorRef | string | undefined) {
  if (!ref || typeof ref === "string") return "Someone";
  return `${ref.firstName} ${ref.lastName}`;
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
    <fetcher.Form method="post" className="flex items-center gap-2">
      <input type="hidden" name="intent" value="reject" />
      <input type="hidden" name="id" value={id} />
      <Input name="reviewNote" required placeholder="What needs to change?" className="h-8 text-xs w-48" autoFocus />
      <Button type="submit" size="sm" variant="destructive" disabled={fetcher.state !== "idle"}>
        Send
      </Button>
    </fetcher.Form>
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

export default function PortalReviewQueue({ loaderData }: Route.ComponentProps) {
  const { updates } = loaderData;

  return (
    <div>
      <AdminPageHeader
        title="Review queue"
        description="Developer updates waiting for your approval before the client sees them."
      />

      {updates.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <EmptyState icon={ClipboardCheck} title="Nothing to review" description="You're all caught up." />
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => {
            const project = typeof update.project === "object" ? update.project : undefined;
            const author = typeof update.author === "object" ? update.author : undefined;
            const initials = author ? `${author.firstName[0] ?? ""}${author.lastName[0] ?? ""}`.toUpperCase() : "";

            return (
              <div key={update._id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      {author?.avatar && <AvatarImage src={author.avatar} alt="" />}
                      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-white font-medium">{update.title}</p>
                      <p className="text-xs text-white/40">
                        {authorName(update.author)} ·{" "}
                        {project && (
                          <Link to={`/portal/projects/${project._id}`} className="hover:underline">
                            {project.name}
                          </Link>
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending review</Badge>
                </div>

                <p className="text-sm text-white/70 whitespace-pre-wrap">{update.body}</p>
                {update.progressValue !== undefined && (
                  <p className="text-xs text-white/40 mt-2">Would set progress to {update.progressValue}%</p>
                )}

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                  <ApproveButton id={update._id} />
                  <RejectForm id={update._id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
