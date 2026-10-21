import { Link } from "react-router";
import type { Route } from "./+types/audit-submissions.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { AuditSubmission } from "~/lib/types";
import { SCORE_BAND_LABEL, scoreBand, vitalRows } from "~/lib/audit";
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
import { ExternalLink } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  const submission = await callAdminApi(request, (accessToken) =>
    apiFetch<AuditSubmission>(`/audits/admin/${params.id}`, { accessToken }),
  );
  return { submission };
}

const BAND_TEXT = {
  good: "text-emerald-400",
  "needs-work": "text-amber-400",
  poor: "text-red-400",
} as const;

function savings(savingsMs?: number) {
  if (savingsMs === undefined) return "";
  return savingsMs >= 1000
    ? `${(savingsMs / 1000).toFixed(1)} s saved`
    : `${Math.round(savingsMs)} ms saved`;
}

export default function AdminAuditSubmissionDetail({
  loaderData,
}: Route.ComponentProps) {
  const { submission } = loaderData;
  const { scores } = submission;

  const scoreRows = scores
    ? [
        { label: "Performance", value: scores.performance },
        { label: "SEO", value: scores.seo },
        { label: "Accessibility", value: scores.accessibility },
        { label: "Best practices", value: scores.bestPractices },
      ]
    : [];
  const vitals = vitalRows(submission.vitals);

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={submission.host}
        description={submission.name}
        backTo="/cpadmin/audit-submissions"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant="outline">{submission.strategy}</Badge>
            <Badge variant={submission.status === "new" ? "default" : "secondary"}>
              {submission.status === "new" ? "New" : "Read"}
            </Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scores</CardTitle>
              <CardDescription>
                Lighthouse run against {submission.url} on {submission.strategy}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scoreRows.length === 0 ? (
                <p className="text-sm text-white/40">
                  No scores recorded — the run may not have finished.
                </p>
              ) : (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                  {scoreRows.map((row) => {
                    const band = scoreBand(row.value);
                    return (
                      <div
                        key={row.label}
                        className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center"
                      >
                        <p
                          className={`text-2xl font-medium tabular-nums ${BAND_TEXT[band]}`}
                        >
                          {row.value}
                        </p>
                        <p className="text-white/50 text-xs mt-1">{row.label}</p>
                        <p className="text-white/30 text-[11px]">
                          {SCORE_BAND_LABEL[band]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {vitals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Core web vitals</CardTitle>
                <CardDescription>Lab measurements against Google's targets.</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  {vitals.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4">
                      <dt className="text-white/50">{row.label}</dt>
                      <dd className="text-right">
                        <span
                          className={`tabular-nums ${row.good ? "text-emerald-400" : "text-amber-400"}`}
                        >
                          {row.value}
                        </span>
                        <span className="text-white/30 text-xs"> / {row.target}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Issues found</CardTitle>
              <CardDescription>
                {submission.issues.length} opportunit
                {submission.issues.length === 1 ? "y" : "ies"} flagged.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submission.issues.length === 0 ? (
                <p className="text-sm text-white/40">No issues recorded.</p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {submission.issues.map((issue) => (
                    <li
                      key={issue.id}
                      className="flex items-start justify-between gap-4 pb-3 border-b border-white/10 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-white/90">{issue.title}</p>
                        <p className="text-white/40 text-xs mt-0.5">{issue.category}</p>
                      </div>
                      <span className="text-white/50 text-xs whitespace-nowrap">
                        {issue.displayValue ?? savings(issue.savingsMs)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Site & contact</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">URL</dt>
                  <dd className="text-white/90 break-all text-right">
                    <a
                      href={submission.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0A84FF] hover:underline inline-flex items-center gap-1"
                    >
                      {submission.host}
                      <ExternalLink className="size-3" />
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Name</dt>
                  <dd className="text-white/90">{submission.name}</dd>
                </div>
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
                {submission.claimedAt && (
                  <div className="flex justify-between">
                    <dt className="text-white/50">Claimed</dt>
                    <dd className="text-white/90">
                      <LocalTime value={submission.claimedAt} withTime />
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <LeadPipelineCard lead={submission} />
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/audit-submissions"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to audit submissions
        </Link>
      </p>
    </div>
  );
}
