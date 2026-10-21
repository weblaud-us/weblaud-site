import { Link } from "react-router";
import type { Route } from "./+types/applicants.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ApplicationStatus, JobApplication } from "~/lib/types";
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
import { Download } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  const applicant = await callAdminApi(request, (accessToken) =>
    apiFetch<JobApplication>(`/careers/applications/${params.id}`, { accessToken }),
  );
  // The raw storage URL never reaches the browser: CVs are opened through
  // /cpadmin/applicants/:id/resume (admin-only, real filename and type).
  const { resumeUrl, ...rest } = applicant;
  return { applicant: { ...rest, hasResume: !!resumeUrl } };
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
    </div>
  );
}
