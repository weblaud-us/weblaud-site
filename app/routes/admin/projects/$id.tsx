import { Link } from "react-router";
import type { Route } from "./+types/$id";
import { apiFetch, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { BackendProject } from "~/lib/adapters/project.server";
import { Button } from "~/components/ui/button";
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
  const project = await callAdminApi(request, (accessToken) =>
    apiFetch<BackendProject>(`/projects/${params.id}`, { accessToken }),
  );
  return {
    project: {
      ...project,
      coverImage: resolveMediaUrl(project.coverImage),
      detailImages: (project.detailImages ?? []).map(resolveMediaUrl),
    },
  };
}

export default function AdminProjectDetail({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={project.name}
        description={`/projects/${project.slug}`}
        backTo="/cpadmin/projects"
        actions={
          <Link to={`/cpadmin/projects/${project._id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="size-3.5" />
              Edit
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overview</CardTitle>
              <CardDescription>Case study copy shown on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-white/70 whitespace-pre-wrap">
                {project.description || "No description provided."}
              </p>
              <div className="pt-3 border-t border-white/10">
                <p className="text-white/50 mb-1">Problem</p>
                <p className="text-white/70 whitespace-pre-wrap">
                  {project.problem || "—"}
                </p>
              </div>
              <div className="pt-3 border-t border-white/10">
                <p className="text-white/50 mb-1">Solution</p>
                <p className="text-white/70 whitespace-pre-wrap">
                  {project.solution || "—"}
                </p>
              </div>
              {project.businessImpact && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-white/50 mb-1">Business impact</p>
                  <p className="text-white/70 whitespace-pre-wrap">
                    {project.businessImpact}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tech stack</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {project.techStack.length === 0 && (
                <p className="text-sm text-white/40">No technologies listed.</p>
              )}
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80"
                >
                  {tech}
                </span>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Features</CardTitle>
            </CardHeader>
            <CardContent>
              {project.featureList.length === 0 ? (
                <p className="text-sm text-white/40">No features listed.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {project.featureList.map((feature) => (
                    <li key={feature} className="flex gap-2 text-white/70">
                      <span className="text-white/30">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {project.detailImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Images</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {project.detailImages.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={project.coverImageAlt || project.name}
                    className="rounded-lg border border-white/10 object-cover"
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Record</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Slug</dt>
                  <dd className="text-white/90">{project.slug}</dd>
                </div>
                {project.createdAt && (
                  <div className="flex justify-between">
                    <dt className="text-white/50">Created</dt>
                    <dd className="text-white/90">
                      <LocalTime value={project.createdAt} />
                    </dd>
                  </div>
                )}
                {project.updatedAt && (
                  <div className="flex justify-between">
                    <dt className="text-white/50">Updated</dt>
                    <dd className="text-white/90">
                      <LocalTime value={project.updatedAt} />
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
          to="/cpadmin/projects"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to projects
        </Link>
      </p>
    </div>
  );
}