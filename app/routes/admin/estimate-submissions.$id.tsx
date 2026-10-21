import { Link } from "react-router";
import type { Route } from "./+types/estimate-submissions.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { EstimateSubmission } from "~/lib/types";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";
import { LeadPipelineCard } from "~/components/admin/lead-pipeline-card";
import { LocalTime } from "~/components/ui/local-time";

export async function loader({ request, params }: Route.LoaderArgs) {
  const submission = await callAdminApi(request, (accessToken) =>
    apiFetch<EstimateSubmission>(`/estimates/admin/${params.id}`, { accessToken }),
  );
  return { submission };
}

function usd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminEstimateSubmissionDetail({
  loaderData,
}: Route.ComponentProps) {
  const { submission } = loaderData;
  const { selection, result } = submission;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={submission.name}
        description={submission.company || submission.email}
        backTo="/cpadmin/estimate-submissions"
        actions={
          <Badge variant={submission.status === "new" ? "default" : "secondary"}>
            {submission.status === "new" ? "New" : "Read"}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estimate</CardTitle>
              <CardDescription>What the calculator quoted them.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-white/50 text-xs mb-1">Estimated cost</p>
                  <p className="text-white text-lg font-medium">
                    {usd(result.costMin)} – {usd(result.costMax)}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-white/50 text-xs mb-1">Timeline</p>
                  <p className="text-white text-lg font-medium">
                    {result.totalWeeks} week{result.totalWeeks === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <dl className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Project type</dt>
                  <dd className="text-white/90">{selection.projectTypeTitle}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Delivery speed</dt>
                  <dd className="text-white/90">{selection.speedLabel}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Features picked</CardTitle>
              <CardDescription>
                {selection.featureTitles.length} selected.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selection.featureTitles.length === 0 ? (
                <p className="text-sm text-white/40">No features selected.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selection.featureTitles.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {submission.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes from the lead</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70 whitespace-pre-wrap">
                  {submission.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Email</dt>
                  <dd className="text-white/90 break-all text-right">
                    <a
                      href={`mailto:${submission.email}`}
                      className="text-[#0A84FF] hover:underline"
                    >
                      {submission.email}
                    </a>
                  </dd>
                </div>
                {submission.phone && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Phone</dt>
                    <dd className="text-white/90">{submission.phone}</dd>
                  </div>
                )}
                {submission.company && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Company</dt>
                    <dd className="text-white/90">{submission.company}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-white/50">Received</dt>
                  <dd className="text-white/90">
                    <LocalTime value={submission.createdAt} withTime />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <LeadPipelineCard lead={submission} />
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/estimate-submissions"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to estimate submissions
        </Link>
      </p>
    </div>
  );
}
