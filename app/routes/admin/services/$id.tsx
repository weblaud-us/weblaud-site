import { Link } from "react-router";
import type { Route } from "./+types/$id";
import { apiFetch, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { AdminService } from "~/lib/types";
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
  const service = await callAdminApi(request, (accessToken) =>
    apiFetch<AdminService>(`/services/${params.id}`, { accessToken }),
  );
  return {
    service: {
      ...service,
      image: service.image ? resolveMediaUrl(service.image) : service.image,
    },
  };
}

export default function AdminServiceDetail({ loaderData }: Route.ComponentProps) {
  const { service } = loaderData;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={service.title}
        description="Service offering shown on the marketing site."
        backTo="/cpadmin/services"
        actions={
          <Link to={`/cpadmin/services/${service._id}/edit`}>
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
              <CardTitle className="text-base">Description</CardTitle>
              <CardDescription>Copy shown on the services section.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 whitespace-pre-wrap">
                {service.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Features</CardTitle>
            </CardHeader>
            <CardContent>
              {service.features.length === 0 ? (
                <p className="text-sm text-white/40">No features listed.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-white/70">
                      <span className="text-white/30">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {service.image && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full rounded-lg border border-white/10 object-cover"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Record</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-white/50">Created</dt>
                  <dd className="text-white/90">
                    <LocalTime value={service.createdAt} />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-white/50">Updated</dt>
                  <dd className="text-white/90">
                    <LocalTime value={service.updatedAt} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/services"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to services
        </Link>
      </p>
    </div>
  );
}
