import { Link } from "react-router";
import type { Route } from "./+types/$id";
import { apiFetch, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Insight } from "~/lib/types";
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
  const insight = await callAdminApi(request, (accessToken) =>
    apiFetch<Insight>(`/insights/admin/${params.id}`, { accessToken }),
  );
  return {
    insight: {
      ...insight,
      author: {
        ...insight.author,
        avatarUrl: insight.author?.avatarUrl
          ? resolveMediaUrl(insight.author.avatarUrl)
          : undefined,
      },
    },
  };
}

export default function AdminInsightDetail({ loaderData }: Route.ComponentProps) {
  const { insight } = loaderData;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={insight.title}
        description={`/insights/${insight.slug}`}
        backTo="/cpadmin/insights"
        actions={
          <div className="flex items-center gap-3">
            <Badge variant={insight.isActive ? "default" : "secondary"}>
              {insight.isActive ? "Published" : "Draft"}
            </Badge>
            <Link to={`/cpadmin/insights/${insight._id}/edit`}>
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
              <CardTitle className="text-base">Summary</CardTitle>
              <CardDescription>The teaser shown in listings and search results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-white/70 whitespace-pre-wrap">{insight.summary || "—"}</p>
              {insight.directAnswer && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-white/50 mb-1">Direct answer</p>
                  <p className="text-white/70 whitespace-pre-wrap">{insight.directAnswer}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key takeaways</CardTitle>
            </CardHeader>
            <CardContent>
              {insight.keyTakeaways.length === 0 ? (
                <p className="text-sm text-white/40">No takeaways listed.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {insight.keyTakeaways.map((item) => (
                    <li key={item} className="flex gap-2 text-white/70">
                      <span className="text-white/30">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content</CardTitle>
              <CardDescription>
                {insight.content.length} section{insight.content.length === 1 ? "" : "s"}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              {insight.content.length === 0 && (
                <p className="text-white/40">No sections written yet.</p>
              )}
              {insight.content.map((section, i) => (
                <div
                  key={`${section.heading}-${i}`}
                  className={i > 0 ? "pt-5 border-t border-white/10" : undefined}
                >
                  <p className="text-white/90 font-medium mb-1.5">{section.heading}</p>
                  <p className="text-white/70 whitespace-pre-wrap">{section.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Author</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              {insight.author?.avatarUrl ? (
                <img
                  src={insight.author.avatarUrl}
                  alt={insight.author.name}
                  className="size-10 rounded-full border border-white/10 object-cover"
                />
              ) : (
                <div className="size-10 rounded-full border border-white/10 bg-white/5" />
              )}
              <div className="text-sm">
                <p className="text-white/90">{insight.author?.name ?? "—"}</p>
                <p className="text-white/40 text-xs">{insight.author?.role}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Record</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Category</dt>
                  <dd className="text-white/90">{insight.category}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Read time</dt>
                  <dd className="text-white/90">{insight.readTime}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Slug</dt>
                  <dd className="text-white/90">{insight.slug}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Published</dt>
                  <dd className="text-white/90">
                    <LocalTime value={insight.publishedAt} />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Created</dt>
                  <dd className="text-white/90">
                    <LocalTime value={insight.createdAt} />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Updated</dt>
                  <dd className="text-white/90">
                    <LocalTime value={insight.updatedAt} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/insights"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to insights
        </Link>
      </p>
    </div>
  );
}
