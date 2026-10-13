import { useEffect, useState } from "react";
import { useFetcher, useOutletContext } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/projects.$id.contract";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Contract } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { EmptyState } from "~/components/admin/empty-state";
import { SignaturePad } from "~/components/portal/signature-pad";
import { FileSignature, ExternalLink, Award } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const contracts = await callPortalApi(request, (accessToken) =>
    apiFetch<Contract[]>(`/portal/projects/${params.id}/contracts`, { accessToken }),
  );
  return { contracts };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = String(formData.get("id"));

  try {
    await callPortalApi(request, (accessToken) =>
      apiFetch(`/portal/contracts/${id}/accept`, {
        method: "POST",
        accessToken,
        body: {
          name: String(formData.get("name") ?? ""),
          signatureImage: String(formData.get("signatureImage") ?? "") || undefined,
        },
      }),
    );
    return { ok: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

const STATUS_LABEL: Record<Contract["status"], string> = {
  draft: "Draft",
  sent: "Awaiting your review",
  accepted: "Accepted",
  void: "Void",
};

const STATUS_VARIANT: Record<Contract["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  sent: "outline",
  accepted: "default",
  void: "destructive",
};

function AcceptForm({ contract }: { contract: Contract }) {
  const fetcher = useFetcher<typeof action>();
  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) toast.success("Contract accepted.");
      else if (fetcher.data.error) toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post" className="mt-4 pt-4 border-t border-white/10 space-y-3">
      <input type="hidden" name="id" value={contract._id} />
      <p className="text-sm font-medium text-white">Accept this contract</p>
      <div className="space-y-2 max-w-sm">
        <Label htmlFor={`name-${contract._id}`}>Type your full legal name</Label>
        <Input id={`name-${contract._id}`} name="name" required placeholder="Alex Client" />
      </div>
      <SignaturePad name="signatureImage" />
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Accepting..." : "Accept & sign"}
      </Button>
    </fetcher.Form>
  );
}

export default function PortalProjectContract({ loaderData }: Route.ComponentProps) {
  const { contracts } = loaderData;
  const { user } = useOutletContext<ProjectWorkspaceContext>();
  const canAccept = user.role === "admin" || user.orgRole === "client_admin";

  if (contracts.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.02]">
        <EmptyState
          icon={FileSignature}
          title="No contract linked yet"
          description="Your agency admin hasn't linked a contract to this project."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <div key={contract._id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-white">{contract.title}</p>
              <p className="text-xs text-white/40 mt-0.5">Version {contract.version}</p>
            </div>
            <Badge variant={STATUS_VARIANT[contract.status]}>{STATUS_LABEL[contract.status]}</Badge>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            {contract.hasDocument && (
              <a
                href={`/portal/contracts/${contract._id}/document`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#0A84FF] hover:underline"
              >
                <ExternalLink className="size-3.5" />
                View document
              </a>
            )}
            {contract.status === "accepted" && (
              <a
                href={`/portal/contracts/${contract._id}/certificate`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#0A84FF] hover:underline"
              >
                <Award className="size-3.5" />
                Certificate of acceptance
              </a>
            )}
          </div>

          {contract.status === "accepted" && contract.acceptance && (
            <p className="text-xs text-white/40 mt-3">
              Accepted by {contract.acceptance.name} on{" "}
              {new Date(contract.acceptance.acceptedAt).toLocaleDateString()}
            </p>
          )}

          {contract.status === "sent" && canAccept && <AcceptForm contract={contract} />}
          {contract.status === "sent" && !canAccept && (
            <p className="text-xs text-white/40 mt-3">
              Waiting on your organization's admin to accept this contract.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
