import { Link } from "react-router";
import type { Route } from "./+types/$id";
import { apiFetch, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Contract, Organization } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";
import { LocalTime } from "~/components/ui/local-time";
import { Award, Pencil } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  const contract = await callAdminApi(request, (accessToken) =>
    apiFetch<Contract>(`/contracts/${params.id}`, { accessToken }),
  );
  // Signature art is stored as a media ref — resolve it here in the loader
  // (server-side), never in the component, like every other media URL.
  const signatureImage = contract.acceptance?.signatureImage
    ? resolveMediaUrl(contract.acceptance.signatureImage)
    : undefined;
  return { contract, signatureImage };
}

const STATUS_LABEL: Record<Contract["status"], string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  void: "Void",
};

const STATUS_VARIANT: Record<Contract["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  sent: "outline",
  accepted: "default",
  void: "destructive",
};

export default function ContractDetail({ loaderData }: Route.ComponentProps) {
  const { contract, signatureImage } = loaderData;
  const org = contract.organization as Organization;
  const project = typeof contract.project === "object" ? contract.project : undefined;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={contract.title}
        description={org?.name ?? "—"}
        backTo="/cpadmin/contracts"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANT[contract.status]}>
              {STATUS_LABEL[contract.status]}
            </Badge>
            {contract.status === "accepted" && (
              <Link to={`/cpadmin/contracts/${contract._id}/certificate`}>
                <Button variant="outline" size="sm">
                  <Award className="size-3.5" />
                  Certificate
                </Button>
              </Link>
            )}
            {contract.status !== "accepted" && (
              <Link to={`/cpadmin/contracts/${contract._id}/edit`}>
                <Button variant="outline" size="sm">
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contract</CardTitle>
              <CardDescription>The agreement on file for this client.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Organization</dt>
                  <dd className="text-white/90">
                    {org ? (
                      <Link
                        to={`/cpadmin/organizations/${org._id}`}
                        className="text-[#0A84FF] hover:underline"
                      >
                        {org.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Project</dt>
                  <dd className="text-white/90">
                    {project ? (
                      <Link
                        to={`/cpadmin/client-projects/${project._id}`}
                        className="text-[#0A84FF] hover:underline"
                      >
                        {project.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Version</dt>
                  <dd className="text-white/90">v{contract.version}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Document</dt>
                  <dd className="text-white/90">
                    {contract.documentUrl || contract.hasDocument ? (
                      <Link
                        to={`/cpadmin/contracts/${contract._id}/document`}
                        className="text-[#0A84FF] hover:underline"
                      >
                        Download
                      </Link>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Acceptance</CardTitle>
              <CardDescription>How and when the client signed.</CardDescription>
            </CardHeader>
            <CardContent>
              {contract.acceptance ? (
                <div className="space-y-4">
                  {signatureImage && (
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4 max-w-xs">
                      <img
                        src={signatureImage}
                        alt={`${contract.acceptance.name}'s signature`}
                        className="max-h-24"
                      />
                    </div>
                  )}
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/50">Signed by</dt>
                      <dd className="text-white/90">{contract.acceptance.name}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/50">Signed at</dt>
                      <dd className="text-white/90">
                        <LocalTime value={contract.acceptance.acceptedAt} withTime />
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/50">IP address</dt>
                      <dd className="text-white/90 font-mono text-xs">{contract.acceptance.ip}</dd>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <dt className="text-white/50 mb-1">User agent</dt>
                      <dd className="text-white/40 text-xs break-all">{contract.acceptance.userAgent}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <p className="text-sm text-white/40">
                  {contract.status === "void" ? "Voided before it was signed." : "Not signed yet."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-white/50">Created</dt>
                  <dd className="text-white/90"><LocalTime value={contract.createdAt} /></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Updated</dt>
                  <dd className="text-white/90"><LocalTime value={contract.updatedAt} /></dd>
                </div>
                {contract.acceptance && (
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <dt className="text-white/50">Accepted</dt>
                    <dd className="text-white/90">
                      <LocalTime value={contract.acceptance.acceptedAt} />
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/contracts"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to contracts
        </Link>
      </p>
    </div>
  );
}