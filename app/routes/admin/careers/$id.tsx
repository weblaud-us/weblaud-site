import { Link } from "react-router";
import type { Route } from "./+types/$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Career } from "~/lib/types";
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
import { Pencil } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  const job = await callAdminApi(request, (accessToken) =>
    apiFetch<Career>(`/careers/${params.id}`, { accessToken }),
  );
  return { job };
}

function BulletCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-white/40">Nothing listed.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item} className="flex gap-2 text-white/70">
                <span className="text-white/30">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminCareerDetail({ loaderData }: Route.ComponentProps) {
  const { job } = loaderData;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={job.title}
        description={`${job.department} · ${job.location}`}
        backTo="/cpadmin/careers"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={job.isActive ? "default" : "secondary"}>
              {job.isActive ? "Open" : "Closed"}
            </Badge>
            <Link to={`/cpadmin/careers/${job._id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil className="size-3.5" />
                Edit
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About the role</CardTitle>
              <CardDescription>Summary and long-form copy on the job page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-white/70 whitespace-pre-wrap">{job.summary || "—"}</p>
              {job.jobDetails && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-white/70 whitespace-pre-wrap">{job.jobDetails}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <BulletCard title="Responsibilities" items={job.responsibilities} />
          <BulletCard title="Requirements" items={job.requirements} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Openings</dt>
                  <dd className="text-white/90">{job.position}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Job type</dt>
                  <dd className="text-white/90">{job.jobType}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Experience</dt>
                  <dd className="text-white/90">{job.experience}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Salary</dt>
                  <dd className="text-white/90">{job.salaryRange}</dd>
                </div>
                {job.deadline && (
                  <div className="flex justify-between">
                    <dt className="text-white/50">Deadline</dt>
                    <dd className="text-white/90">
                      <LocalTime value={job.deadline} />
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Record</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Slug</dt>
                  <dd className="text-white/90">{job.slug}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Created</dt>
                  <dd className="text-white/90">
                    <LocalTime value={job.createdAt} />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Updated</dt>
                  <dd className="text-white/90">
                    <LocalTime value={job.updatedAt} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/careers"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to careers
        </Link>
      </p>
    </div>
  );
}
