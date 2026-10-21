import { Link } from "react-router";
import type { Route } from "./+types/people.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { EmailPreferences, Organization, OrgRole, PlatformRole, PortalUser } from "~/lib/types";
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

export async function loader({ request, params }: Route.LoaderArgs) {
  const [person, organizations] = await Promise.all([
    callAdminApi(request, (accessToken) =>
      apiFetch<PortalUser>(`/users/${params.id}`, { accessToken }),
    ),
    // GET /users/:id may return the organization as a bare id — keep the
    // org list around to resolve a name for the link either way.
    callAdminApi(request, (accessToken) =>
      apiFetch<Organization[]>("/organizations", { accessToken }),
    ),
  ]);
  return { person, organizations };
}

const ROLE_LABEL: Record<PlatformRole, string> = {
  admin: "Admin",
  manager: "Staff (PM / team)",
  editor: "Editor",
  user: "Client",
};

const ORG_ROLE_LABEL: Record<OrgRole, string> = {
  client_admin: "Client admin",
  client_viewer: "Client viewer",
};

const EMAIL_PREF_LABEL: Record<keyof EmailPreferences, string> = {
  contracts: "Contracts",
  invoices: "Invoices",
  approvals: "Approvals",
  changeRequests: "Change requests",
  updates: "Project updates",
  mentions: "Mentions",
  digest: "Weekly digest",
};

export default function PersonDetail({ loaderData }: Route.ComponentProps) {
  const { person, organizations } = loaderData;
  const organization =
    typeof person.organization === "object"
      ? person.organization
      : organizations.find((o) => o._id === person.organization);
  const prefs = person.emailPreferences;

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={`${person.firstName} ${person.lastName}`}
        description={person.email}
        backTo="/cpadmin/people"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={person.isActive ? "default" : "secondary"}>
              {person.isActive ? "Active" : "Invited"}
            </Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Who this person is in the portal.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Email</dt>
                  <dd className="text-white/90">{person.email}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Role</dt>
                  <dd className="text-white/90">
                    {ROLE_LABEL[person.role]}
                    {person.role === "user" && person.orgRole && (
                      <span className="text-white/40"> · {ORG_ROLE_LABEL[person.orgRole]}</span>
                    )}
                  </dd>
                </div>
                {person.title && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Title</dt>
                    <dd className="text-white/90">{person.title}</dd>
                  </div>
                )}
                {person.phone && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/50">Phone</dt>
                    <dd className="text-white/90">{person.phone}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email preferences</CardTitle>
              <CardDescription>
                Transactional email opt-outs, managed from portal settings or the unsubscribe link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {prefs ? (
                (Object.keys(EMAIL_PREF_LABEL) as (keyof EmailPreferences)[]).map((key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-white/3 transition-colors"
                  >
                    <p className="text-sm text-white/90">{EMAIL_PREF_LABEL[key]}</p>
                    <Badge variant={prefs[key] ? "default" : "secondary"}>
                      {prefs[key] ? "On" : "Off"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/40">Defaulting to all emails on.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {organization ? (
                <>
                  <Link
                    to={`/cpadmin/organizations/${organization._id}`}
                    className="block text-white font-medium hover:text-primary-bright transition-colors"
                  >
                    {organization.name}
                  </Link>
                  <p className="text-white/50">{organization.billingEmail}</p>
                </>
              ) : (
                <p className="text-white/40">
                  {person.role === "user"
                    ? "No organization assigned."
                    : "Staff account — no client organization."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/people"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to people
        </Link>
      </p>
    </div>
  );
}