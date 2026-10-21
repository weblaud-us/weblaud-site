import { Link } from "react-router";
import type { Route } from "./+types/change-requests.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ChangeRequest, ChangeRequestProjectRef, Organization, UpdateAuthorRef } from "~/lib/types";
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

export async function loader({ request, params }: Route.LoaderArgs) {
  const changeRequest = await callAdminApi(request, (accessToken) =>
    apiFetch<ChangeRequest>(`/change-requests/${params.id}`, { accessToken }),
  );
  return { changeRequest };
}

const STATUS_LABEL: Record<ChangeRequest["status"], string> = {
  requested: "New — needs pricing",
  quoted: "Awaiting client",
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

function personName(ref: UpdateAuthorRef | string | undefined) {
  if (!ref) return "—";
  if (typeof ref === "string") return ref;
  return `${ref.firstName} ${ref.lastName}`.trim();
}

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-US")}`;
  }
}

export default function ChangeRequestDetail({ loaderData }: Route.ComponentProps) {
  const { changeRequest } = loaderData;
  const project =
    typeof changeRequest.project === "object"
      ? (changeRequest.project as ChangeRequestProjectRef)
      : undefined;
  const org = project?.organization;
  const orgName = typeof org === "object" ? (org as Organization)?.name : undefined;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={changeRequest.title}
        description={project ? `${project.name}${orgName ? ` · ${orgName}` : ""}` : "—"}
        backTo="/cpadmin/change-requests"
        actions={
          <Badge variant={STATUS_VARIANT[changeRequest.status]}>
            {STATUS_LABEL[changeRequest.status]}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scope change</CardTitle>
              <CardDescription>What the client is being asked to pay for.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 whitespace-pre-wrap">
                {changeRequest.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Decision</CardTitle>
              <CardDescription>Only a client admin can approve or reject.</CardDescription>
            </CardHeader>
            <CardContent>
              {changeRequest.status === "requested" || changeRequest.status === "quoted" ? (
                <p className="text-sm text-white/40">
                  {changeRequest.status === "requested"
                    ? "Not priced yet — a PM still needs to quote it."
                    : "Quoted — waiting on the client."}
                </p>
              ) : changeRequest.status === "rejected" ? (
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-white/50 mb-1">Rejection reason</dt>
                    <dd className="text-white/70 whitespace-pre-wrap">
                      {changeRequest.rejectionReason || "—"}
                    </dd>
                  </div>
                </dl>
              ) : (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Approved by</dt>
                    <dd className="text-white/90">{personName(changeRequest.approvedBy)}</dd>
                  </div>
                  {changeRequest.approvedAt && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/50">Approved at</dt>
                      <dd className="text-white/90">
                        <LocalTime value={changeRequest.approvedAt} withTime />
                      </dd>
                    </div>
                  )}
                </dl>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Price</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-white/50">Amount</dt>
                  <dd className="text-white">
                    {changeRequest.status === "requested" ? (
                      <span className="text-white/30">Not priced yet</span>
                    ) : (
                      money(changeRequest.priceAmount, changeRequest.currency)
                    )}
                  </dd>
                </div>
                {changeRequest.invoiceId && (
                  <div className="flex justify-between">
                    <dt className="text-white/50">Invoice</dt>
                    <dd>
                      <Link
                        to={`/cpadmin/invoices/${changeRequest.invoiceId}`}
                        className="text-[#0A84FF] hover:underline"
                      >
                        View draft
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {project ? (
                <>
                  <Link
                    to={`/cpadmin/client-projects/${project._id}`}
                    className="block text-white font-medium hover:text-primary-bright transition-colors"
                  >
                    {project.name}
                  </Link>
                  {orgName && <p className="text-white/50">{orgName}</p>}
                </>
              ) : (
                <p className="text-white/40">—</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requested</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-white/50">By</dt>
                  <dd className="text-white/90">{personName(changeRequest.requestedBy)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">On</dt>
                  <dd className="text-white/90"><LocalTime value={changeRequest.createdAt} /></dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/change-requests"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to change requests
        </Link>
      </p>
    </div>
  );
}