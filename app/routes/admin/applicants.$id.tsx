import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/applicants.$id";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ApplicationStatus, JobApplication } from "~/lib/types";
import { ApplicantEmailDialog } from "~/components/admin/applicant-email-dialog";
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
import { CalendarClock, Download, ExternalLink, Mail } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  const applicant = await callAdminApi(request, (accessToken) =>
    apiFetch<JobApplication>(`/careers/applications/${params.id}`, { accessToken }),
  );
  // The raw storage URL never reaches the browser: CVs are opened through
  // /cpadmin/applicants/:id/resume (admin-only, real filename and type).
  const { resumeUrl, ...rest } = applicant;
  return { applicant: { ...rest, hasResume: !!resumeUrl } };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  if (formData.get("intent") !== "email") return null;

  const optional = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value || undefined;
  };

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/careers/admin/applicants/${params.id}/email`, {
        method: "POST",
        accessToken,
        body: {
          subject: String(formData.get("subject") ?? ""),
          message: String(formData.get("message") ?? ""),
          taskUrl: optional("taskUrl"),
          dueAt: optional("dueAt"),
          timeZone: optional("timeZone"),
          setStatus: optional("setStatus"),
        },
      }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
  return { ok: true as const, message: "Email sent." };
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: "New",
  review: "In review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired",
};

const STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  new: "default",
  review: "outline",
  shortlisted: "outline",
  rejected: "destructive",
  hired: "default",
};

export default function AdminApplicantDetail({ loaderData }: Route.ComponentProps) {
  const { applicant } = loaderData;
  const [emailing, setEmailing] = useState(false);
  const emails = [...(applicant.emails ?? [])].reverse();

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={applicant.name}
        description={applicant.careerId?.title ?? "Job no longer listed"}
        backTo="/cpadmin/applicants"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={STATUS_VARIANT[applicant.status]}>
              {STATUS_LABEL[applicant.status]}
            </Badge>
            <Button size="sm" onClick={() => setEmailing(true)}>
              <Mail className="size-3.5" />
              Email applicant
            </Button>
            {applicant.hasResume && (
              <a href={`/cpadmin/applicants/${applicant._id}/resume?download=1`}>
                <Button variant="outline" size="sm">
                  <Download className="size-3.5" />
                  Resume
                </Button>
              </a>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cover letter</CardTitle>
              <CardDescription>What they wrote with their application.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 whitespace-pre-wrap">
                {applicant.coverLetter || "No cover letter submitted."}
              </p>
            </CardContent>
          </Card>

          {applicant.interestReason && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Why they're interested</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/70 whitespace-pre-wrap">
                  {applicant.interestReason}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Emails sent</CardTitle>
              <CardDescription>
                Tasks, invites and replies sent from here, newest first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emails.length === 0 ? (
                <p className="text-sm text-white/40">
                  Nothing sent yet. Use "Email applicant" to send a task or an
                  interview invite.
                </p>
              ) : (
                <ul className="divide-y divide-white/10">
                  {emails.map((email) => (
                    <li key={email._id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-medium text-white/90">{email.subject}</p>
                        <span className="text-xs text-white/40">
                          <LocalTime value={email.sentAt} withTime />
                        </span>
                      </div>
                      <p
                        className="mt-1 text-sm text-white/50 line-clamp-2 whitespace-pre-wrap"
                        title={email.message}
                      >
                        {email.message}
                      </p>
                      {(email.taskUrl || email.dueAt) && (
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                          {email.taskUrl && (
                            <a
                              href={email.taskUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[#0A84FF] hover:underline"
                            >
                              <ExternalLink className="size-3" />
                              Task link
                            </a>
                          )}
                          {email.dueAt && (
                            <span className="inline-flex items-center gap-1 text-white/50">
                              <CalendarClock className="size-3" />
                              Due <LocalTime value={email.dueAt} withTime />
                            </span>
                          )}
                        </div>
                      )}
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
              <CardTitle className="text-base">Applicant</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Email</dt>
                  <dd className="text-white/90 break-all text-right">
                    <a
                      href={`mailto:${applicant.email}`}
                      className="text-[#0A84FF] hover:underline"
                    >
                      {applicant.email}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Phone</dt>
                  <dd className="text-white/90">{applicant.phone || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Applied</dt>
                  <dd className="text-white/90">
                    <LocalTime value={applicant.createdAt} withTime />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Position</CardTitle>
            </CardHeader>
            <CardContent>
              {applicant.careerId ? (
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Role</dt>
                    <dd className="text-white/90 text-right">
                      <Link
                        to={`/cpadmin/careers/${applicant.careerId._id}`}
                        className="text-[#0A84FF] hover:underline"
                      >
                        {applicant.careerId.title}
                      </Link>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Openings</dt>
                    <dd className="text-white/90">{applicant.careerId.position}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-white/40">
                  The job this application referenced has been deleted.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resume</CardTitle>
            </CardHeader>
            <CardContent>
              {applicant.hasResume ? (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/cpadmin/applicants/${applicant._id}/resume`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      Open
                    </Button>
                  </a>
                  <a href={`/cpadmin/applicants/${applicant._id}/resume?download=1`}>
                    <Button variant="ghost" size="sm">
                      <Download className="size-3.5" />
                      Download
                    </Button>
                  </a>
                </div>
              ) : (
                <p className="text-sm text-white/40">No resume attached.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/applicants"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to applicants
        </Link>
      </p>

      <ApplicantEmailDialog
        open={emailing}
        onOpenChange={setEmailing}
        applicantName={applicant.name}
        applicantEmail={applicant.email}
        role={applicant.careerId?.title ?? "open"}
      />
    </div>
  );
}
