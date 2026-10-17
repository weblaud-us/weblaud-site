import { useEffect, useState } from "react";
import { Link, useFetcher, useOutletContext } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/projects.$id.change-requests";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import { projectPath } from "~/lib/portal-paths";
import type { ChangeRequest, UpdateAuthorRef } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
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
import { GitPullRequestArrow, Plus, Check, X, Tag } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const changeRequests = await callPortalApi(request, (accessToken) =>
    apiFetch<ChangeRequest[]>(`/portal/projects/${params.id}/change-requests`, { accessToken }),
  );
  return { changeRequests };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "create") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/change-requests`, {
          method: "POST",
          accessToken,
          body: {
            title: String(formData.get("title") ?? ""),
            description: String(formData.get("description") ?? ""),
            priceAmount: Number(formData.get("priceAmount") ?? 0),
            currency: String(formData.get("currency") ?? "USD"),
          },
        }),
      );
      return { ok: true };
    }
    if (intent === "request-scope") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/change-requests/request`, {
          method: "POST",
          accessToken,
          body: {
            title: String(formData.get("title") ?? ""),
            description: String(formData.get("description") ?? ""),
          },
        }),
      );
      return { ok: true };
    }
    if (intent === "quote") {
      const id = String(formData.get("id"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/change-requests/${id}/quote`, {
          method: "POST",
          accessToken,
          body: {
            priceAmount: Number(formData.get("priceAmount") ?? 0),
            currency: String(formData.get("currency") ?? ""),
          },
        }),
      );
      return { ok: true };
    }
    if (intent === "approve") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/change-requests/${String(formData.get("id"))}/approve`, {
          method: "POST",
          accessToken,
        }),
      );
      return { ok: true };
    }
    if (intent === "reject") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/change-requests/${String(formData.get("id"))}/reject`, {
          method: "POST",
          accessToken,
          body: { reason: String(formData.get("reason") ?? "") },
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

// "quoted"'s label depends on who's viewing (see the render below, same
// treatment as the Approvals tab) — every other status reads the same
// regardless of viewer, so only those live here.
const STATUS_LABEL: Record<Exclude<ChangeRequest["status"], "quoted">, string> = {
  requested: "Awaiting a price",
  client_approved: "Approved",
  rejected: "Rejected",
  invoiced: "Invoiced",
};

const STATUS_VARIANT: Record<ChangeRequest["status"], "default" | "secondary" | "outline" | "destructive"> = {
  requested: "outline",
  quoted: "outline",
  client_approved: "default",
  rejected: "destructive",
  invoiced: "secondary",
};

function authorName(ref: UpdateAuthorRef | string | undefined) {
  if (!ref || typeof ref === "string") return "Someone";
  return `${ref.firstName} ${ref.lastName}`;
}

function NewChangeRequestDialog({ defaultCurrency }: { defaultCurrency: string }) {
  const fetcher = useFetcher<typeof action>();
  const [open, setOpen] = useState(false);
  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) setOpen(false);
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-3.5" />
          New change request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New change request</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="create" />
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" className="h-20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="priceAmount">Price</Label>
              <Input id="priceAmount" name="priceAmount" type="number" min={0} step="0.01" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" defaultValue={defaultCurrency} />
            </div>
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

function RequestScopeDialog() {
  const fetcher = useFetcher<typeof action>();
  const [open, setOpen] = useState(false);
  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) setOpen(false);
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-3.5" />
          Request new scope
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request new scope</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="request-scope" />
          <div className="space-y-2">
            <Label htmlFor="request-title">Title</Label>
            <Input id="request-title" name="title" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="request-description">Description (optional)</Label>
            <Textarea
              id="request-description"
              name="description"
              className="h-20"
              placeholder="What do you need, and why?"
            />
          </div>
          <p className="text-xs text-white/40">
            Your project manager will review this and send back a price before any work starts on it.
          </p>
          {fetcher.data?.error && <p className="text-red-400 text-sm">{fetcher.data.error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Sending..." : "Send to project manager"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

function QuoteForm({ id, defaultCurrency }: { id: string; defaultCurrency: string }) {
  const fetcher = useFetcher<typeof action>();
  const isBusy = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.error) toast.error(fetcher.data.error);
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form
      method="post"
      className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-2 items-end"
    >
      <input type="hidden" name="intent" value="quote" />
      <input type="hidden" name="id" value={id} />
      <div className="space-y-1.5">
        <Label htmlFor={`price-${id}`} className="text-xs">
          Price
        </Label>
        <Input id={`price-${id}`} name="priceAmount" type="number" min={0} step="0.01" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`currency-${id}`} className="text-xs">
          Currency
        </Label>
        <Input id={`currency-${id}`} name="currency" defaultValue={defaultCurrency} />
      </div>
      <Button type="submit" size="sm" disabled={isBusy}>
        <Tag className="size-3.5" />
        {isBusy ? "Sending..." : "Send price"}
      </Button>
    </fetcher.Form>
  );
}

function DecisionButtons({ id }: { id: string }) {
  const fetcher = useFetcher<typeof action>();
  const isBusy = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.error) toast.error(fetcher.data.error);
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
      <fetcher.Form method="post">
        <input type="hidden" name="intent" value="approve" />
        <input type="hidden" name="id" value={id} />
        <Button type="submit" size="sm" disabled={isBusy}>
          <Check className="size-3.5" />
          Approve
        </Button>
      </fetcher.Form>
      <fetcher.Form method="post">
        <input type="hidden" name="intent" value="reject" />
        <input type="hidden" name="id" value={id} />
        <Button type="submit" size="sm" variant="outline" disabled={isBusy}>
          <X className="size-3.5" />
          Reject
        </Button>
      </fetcher.Form>
    </div>
  );
}

export default function PortalProjectChangeRequests({ loaderData }: Route.ComponentProps) {
  const { changeRequests } = loaderData;
  const { user, isPm, project } = useOutletContext<ProjectWorkspaceContext>();
  const canDecide = user.role === "admin" || user.orgRole === "client_admin";
  // Mirrors ChangeRequestService.requestFromClient's server-side gate
  // exactly — client_admin only, not admin (an admin raising scope on the
  // agency's own initiative uses the PM-priced form above instead).
  const canRequestScope = user.role === "user" && user.orgRole === "client_admin";
  const projectCurrency = project.budget.currency;

  return (
    <div>
      {(isPm || canRequestScope) && (
        <div className="mb-4 flex justify-end">
          {isPm ? <NewChangeRequestDialog defaultCurrency={projectCurrency} /> : <RequestScopeDialog />}
        </div>
      )}

      {changeRequests.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <EmptyState
            icon={GitPullRequestArrow}
            title="No change requests"
            description="Extra scope gets priced and approved here before any work starts on it."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {changeRequests.map((cr) => (
            <div key={cr._id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="font-medium text-white">{cr.title}</p>
                <Badge variant={STATUS_VARIANT[cr.status]}>
                  {cr.status === "quoted"
                    ? canDecide
                      ? "Awaiting your decision"
                      : "Awaiting client sign-off"
                    : STATUS_LABEL[cr.status]}
                </Badge>
              </div>
              <p className="text-xs text-white/40 mb-2">
                Raised by {authorName(cr.requestedBy)}
                {cr.status !== "requested" && (
                  <>
                    {" "}
                    &middot; {cr.priceAmount} {cr.currency}
                  </>
                )}
              </p>
              {cr.description && <p className="text-sm text-white/70">{cr.description}</p>}
              {cr.status === "rejected" && cr.rejectionReason && (
                <p className="text-xs text-red-400 mt-2">Reason: {cr.rejectionReason}</p>
              )}
              {cr.invoiceId && isPm && (
                <Link
                  to={projectPath(typeof cr.project === "object" ? cr.project._id : cr.project, "invoices")}
                  className="mt-2 inline-block text-xs text-[#0A84FF] hover:underline"
                >
                  View draft invoice
                </Link>
              )}
              {cr.status === "requested" && isPm && (
                <QuoteForm id={cr._id} defaultCurrency={projectCurrency} />
              )}
              {cr.status === "quoted" && canDecide && <DecisionButtons id={cr._id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
