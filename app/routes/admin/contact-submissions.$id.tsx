import { Link } from "react-router";
import type { Route } from "./+types/contact-submissions.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ContactSubmission } from "~/lib/types";
import { BUDGET_LABEL, TIMELINE_LABEL } from "~/lib/leads";
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
    apiFetch<ContactSubmission>(`/contact/admin/${params.id}`, { accessToken }),
  );
  return { submission };
}

const STATUS_LABEL: Record<ContactSubmission["status"], string> = {
  new: "New",
  read: "Read",
  spam: "Spam",
};

const STATUS_VARIANT: Record<
  ContactSubmission["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  new: "default",
  read: "secondary",
  spam: "destructive",
};

export default function AdminContactSubmissionDetail({
  loaderData,
}: Route.ComponentProps) {
  const { submission } = loaderData;
  const name = `${submission.firstName} ${submission.lastName}`.trim();

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={name || submission.email}
        description={submission.email}
        backTo="/cpadmin/contact-submissions"
        actions={
          <Badge variant={STATUS_VARIANT[submission.status]}>
            {STATUS_LABEL[submission.status]}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Message</CardTitle>
              <CardDescription>What they sent through the contact form.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 whitespace-pre-wrap">
                {submission.message}
              </p>
            </CardContent>
          </Card>

          {submission.spamReason && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Why this was filed as spam</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70">{submission.spamReason}</p>
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
                {submission.budget && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Budget</dt>
                    <dd className="text-white/90">{BUDGET_LABEL[submission.budget]}</dd>
                  </div>
                )}
                {submission.timeline && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Timeline</dt>
                    <dd className="text-white/90">
                      {TIMELINE_LABEL[submission.timeline]}
                    </dd>
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
          to="/cpadmin/contact-submissions"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to contact submissions
        </Link>
      </p>
    </div>
  );
}
