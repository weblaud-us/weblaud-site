import { useEffect, useState } from "react";
import { useFetcher, useOutletContext } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/projects.$id.requests";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { UpdateAuthorRef, UpdateRequestItem } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { EmptyState } from "~/components/admin/empty-state";
import { HelpCircle, Send, CheckCheck } from "lucide-react";
import { LocalTime } from "~/components/ui/local-time";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const requests = await callPortalApi(request, (accessToken) =>
    apiFetch<UpdateRequestItem[]>(`/portal/projects/${params.id}/update-requests`, { accessToken }),
  );
  return { requests };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "create") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/update-requests`, {
          method: "POST",
          accessToken,
          body: { message: String(formData.get("message") ?? "") },
        }),
      );
      return { ok: true };
    }

    if (intent === "close") {
      const id = String(formData.get("id"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/update-requests/${id}/close`, {
          method: "POST",
          accessToken,
          body: { response: String(formData.get("response") ?? "") },
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

const STATUS_LABEL: Record<string, string> = { open: "Open", answered: "Answered", closed: "Closed" };
const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  open: "secondary",
  answered: "default",
  closed: "outline",
};

function authorName(ref: UpdateAuthorRef | string | undefined) {
  if (!ref || typeof ref === "string") return "Someone";
  return `${ref.firstName} ${ref.lastName}`;
}

function RequestUpdateForm() {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) {
        toast.success("Sent to your project manager.");
        (document.getElementById("update-request-form") as HTMLFormElement | null)?.reset();
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form
      id="update-request-form"
      method="post"
      className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3 mb-6"
    >
      <input type="hidden" name="intent" value="create" />
      <p className="text-sm font-medium text-white">Ask for an update</p>
      <Textarea name="message" required className="h-20" placeholder="e.g. Any news on the calculator feature?" />
      <Button type="submit" size="sm" disabled={isSaving}>
        <Send className="size-3.5" />
        {isSaving ? "Sending..." : "Send to project manager"}
      </Button>
    </fetcher.Form>
  );
}

function ReplyForm({ id }: { id: string }) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const [response, setResponse] = useState("");
  const isBusy = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.error) toast.error(fetcher.data.error);
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post" className="space-y-2">
      <input type="hidden" name="intent" value="close" />
      <input type="hidden" name="id" value={id} />
      <Textarea
        name="response"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        required
        className="h-16 text-sm"
        placeholder="Reply to this question..."
      />
      <Button type="submit" size="sm" variant="outline" disabled={isBusy || !response.trim()}>
        <CheckCheck className="size-3.5" />
        {isBusy ? "Sending..." : "Send reply & mark answered"}
      </Button>
    </fetcher.Form>
  );
}

export default function PortalProjectRequests({ loaderData }: Route.ComponentProps) {
  const { requests } = loaderData;
  const { user, isPm } = useOutletContext<ProjectWorkspaceContext>();
  const isClient = user.role === "user";

  return (
    <div>
      {isClient && <RequestUpdateForm />}

      {requests.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <EmptyState
            icon={HelpCircle}
            title="No update requests"
            description={
              isClient
                ? "Ask your project manager for a status update any time."
                : "The client hasn't asked for anything yet."
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req._id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-xs text-white/40">
                  {authorName(req.requestedBy)} · <LocalTime value={req.createdAt} />
                </p>
                <Badge variant={STATUS_VARIANT[req.status]}>{STATUS_LABEL[req.status]}</Badge>
              </div>
              <p className="text-sm text-white/80">{req.message}</p>
              {req.response && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-1">{authorName(req.answeredBy)} replied</p>
                  <p className="text-sm text-white/70">{req.response}</p>
                </div>
              )}
              {req.status === "open" && isPm && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <ReplyForm id={req._id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
