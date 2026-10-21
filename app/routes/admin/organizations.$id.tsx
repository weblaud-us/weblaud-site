import { Link } from "react-router";
import type { Route } from "./+types/organizations.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ClientProject, Organization, PortalUser } from "~/lib/types";
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

interface UsersListResponse {
  items: PortalUser[];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const [organization, users, projects] = await Promise.all([
    callAdminApi(request, (accessToken) =>
      apiFetch<Organization>(`/organizations/${params.id}`, { accessToken }),
    ),
    // The list endpoints have no per-org filter param yet, and an agency's
    // org/people counts are small — pull a generous page and filter here.
    callAdminApi(request, (accessToken) =>
      apiFetch<UsersListResponse>("/users?page=1&limit=200", { accessToken }),
    ),
    callAdminApi(request, (accessToken) =>
      apiFetch<ClientProject[]>("/client-projects", { accessToken }),
    ),
  ]);

  const orgId = (value: PortalUser["organization"]) =>
    typeof value === "object" ? value?._id : value;
  const people = users.items.filter((u) => orgId(u.organization) === organization._id);
  const orgProjects = projects.filter(
    (p) => orgId(p.organization as Organization | string | undefined) === organization._id,
  );

  return { organization, people, projects: orgProjects };
}

const PROJECT_STATUS_LABEL: Record<ClientProject["status"], string> = {
  planning: "Planning",
  active: "Active",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function OrganizationDetail({ loaderData }: Route.ComponentProps) {
  const { organization, people, projects } = loaderData;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={organization.name}
        description={organization.billingEmail}
        backTo="/cpadmin/organizations"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={organization.isActive ? "default" : "secondary"}>
              {organization.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company details</CardTitle>
              <CardDescription>Billing and invoicing information.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Billing email</dt>
                  <dd className="text-white/90">{organization.billingEmail}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Currency</dt>
                  <dd className="text-white/90">{organization.defaultCurrency}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Tax ID</dt>
                  <dd className="text-white/90">{organization.taxId || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Address</dt>
                  <dd className="text-white/90 text-right">{organization.address || "—"}</dd>
                </div>
                {organization.notes && (
                  <div className="pt-3 border-t border-white/10">
                    <dt className="text-white/50 mb-1">Notes</dt>
                    <dd className="text-white/70 whitespace-pre-wrap">{organization.notes}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projects</CardTitle>
              <CardDescription>Client projects under this organization.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {projects.length === 0 && (
                <p className="text-sm text-white/40">No projects yet.</p>
              )}
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-white/3 transition-colors"
                >
                  <Link
                    to={`/cpadmin/client-projects/${project._id}`}
                    className="text-sm text-white/90 hover:text-primary-bright transition-colors truncate"
                  >
                    {project.name}
                  </Link>
                  <Badge variant="secondary" className="shrink-0">
                    {PROJECT_STATUS_LABEL[project.status]}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">People</CardTitle>
              <CardDescription>Portal accounts at this company.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {people.length === 0 && (
                <p className="text-sm text-white/40">No one invited yet.</p>
              )}
              {people.map((person) => (
                <Link
                  key={person._id}
                  to={`/cpadmin/people/${person._id}`}
                  className="block rounded-lg px-3 py-2 hover:bg-white/3 transition-colors"
                >
                  <p className="text-sm text-white/90">
                    {person.firstName} {person.lastName}
                  </p>
                  <p className="text-xs text-white/40 truncate">{person.email}</p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Record</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-white/50">Created</dt>
                  <dd className="text-white/90">
                    <LocalTime value={organization.createdAt} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/organizations"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to organizations
        </Link>
      </p>
    </div>
  );
}