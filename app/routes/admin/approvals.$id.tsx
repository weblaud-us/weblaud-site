import { Link } from "react-router";
import type { Route } from "./+types/approvals.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Approval, ChangeRequestProjectRef, Organization, UpdateAuthorRef } from "~/lib/types";
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
  const approval = await callAdminApi(request, (accessToken) =>
    apiFetch<Approval>(`/approvals/${params.id}`, { accessToken }),
  );
  return { approval };
}

const STATUS_LABEL: Record<Approval["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_VARIANT: Record<Approval["status"], "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
};

const SUBJECT_LABEL: Record<Approval["subjectType"], string> = {
  deliverable: "Deliverable",
  milestone: "Milestone",
  change_request: "Change request",
  invoice: "Invoice",
};

function personName(ref: UpdateAuthorRef | string | undefined) {
  if (!ref) return "—";
  if (typeof ref === "string") return ref;
  return `${ref.firstName} ${ref.lastName}`.trim();
}

export default function ApprovalDetail({ loaderData }: Route.ComponentProps) {
  const { approval } = loaderData;
  const project =
    typeof approval.project === "object" ? (approval.project as ChangeRequestProjectRef) : undefined;
  const org = project?.organization;
  const orgName = typeof org === "object" ? (org as Organization)?.name : undefined;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={approval.title}
        description={project ? `${project.name}${orgName ? ` · ${orgName}` : ""}` : "—"}
        backTo="/cpadmin/approvals"
        actions={
          <Badge variant={STATUS_VARIANT[approval.status]}>
            {STATUS_LABEL[approval.status]}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request</CardTitle>
              <CardDescription>What the PM asked the client to sign off on.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-white/70 whitespace-pre-wrap">
                {approval.description || "No description provided."}
              </p>
              <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-sm">
                <span className="text-white/50">Subject type</span>
                <Badge variant="secondary">{SUBJECT_LABEL[approval.subjectType]}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Decision</CardTitle>
              <CardDescription>Only a client admin can make this call.</CardDescription>
            </CardHeader>
            <CardContent>
              {approval.status === "pending" ? (
                <p className="text-sm text-white/40">Still waiting on the client.</p>
              ) : (
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Outcome</dt>
                    <dd>
                      <Badge variant={STATUS_VARIANT[approval.status]}>
                        {STATUS_LABEL[approval.status]}
                      </Badge>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Decided by</dt>
                    <dd className="text-white/90">{personName(approval.decidedBy)}</dd>
                  </div>
                  {approval.decidedAt && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/50">Decided at</dt>
                      <dd className="text-white/90">
                        <LocalTime value={approval.decidedAt} withTime />
                      </dd>
                    </div>
                  )}
                  {approval.comment && (
                    <div className="pt-3 border-t border-white/10">
                      <dt className="text-white/50 mb-1">Comment</dt>
                      <dd className="text-white/70 whitespace-pre-wrap">{approval.comment}</dd>
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
                  <dd className="text-white/90">{personName(approval.requestedBy)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">On</dt>
                  <dd className="text-white/90"><LocalTime value={approval.createdAt} /></dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/approvals"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to approvals
        </Link>
      </p>
    </div>
  );
}