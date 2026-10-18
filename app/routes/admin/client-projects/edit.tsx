import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/edit";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ClientProject, Feature, Organization, PortalUser, ProjectStaffRef } from "~/lib/types";
import { AdminPageHeader } from "~/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FeaturesEditor } from "~/components/portal/features-editor";
import { ClientProjectForm, parseClientProjectForm } from "./project-form";

interface UsersListResponse {
  items: PortalUser[];
  total: number;
  page: number;
  limit: number;
}

function toStaffList(users: PortalUser[]): ProjectStaffRef[] {
  return users
    .filter((u) => u.role === "admin" || u.role === "manager")
    .map((u) => ({
      _id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      avatar: u.avatar,
      title: u.title,
      role: u.role,
    }));
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const [project, organizations, users, features] = await Promise.all([
    callAdminApi(request, (accessToken) =>
      apiFetch<ClientProject>(`/client-projects/${params.id}`, { accessToken }),
    ),
    callAdminApi(request, (accessToken) =>
      apiFetch<Organization[]>("/organizations", { accessToken }),
    ),
    callAdminApi(request, (accessToken) =>
      apiFetch<UsersListResponse>("/users?page=1&limit=200", { accessToken }),
    ),
    // Same portal-scoped endpoint the client-side app uses — admin's role
    // passes every project-access check unconditionally (see
    // assertProjectAccess), so there's no admin-only feature-read endpoint
    // to duplicate.
    callAdminApi(request, (accessToken) =>
      apiFetch<Feature[]>(`/portal/projects/${params.id}/features`, { accessToken }),
    ),
  ]);
  return { project, organizations, staff: toStaffList(users.items), features };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "details");

  try {
    if (intent === "features") {
      const features = JSON.parse(String(formData.get("featuresJson") ?? "[]"));
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/features`, {
          method: "PUT",
          accessToken,
          body: { features },
        }),
      );
      return { ok: true };
    }

    const body = parseClientProjectForm(formData);
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/client-projects/${params.id}`, { method: "PATCH", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/client-projects");
}

export default function EditClientProject({ loaderData }: Route.ComponentProps) {
  const { project, organizations, staff, features } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Edit Client Project"
        description={project.name}
        backTo="/cpadmin/client-projects"
      />

      <Form method="post" className="space-y-6">
        <input type="hidden" name="intent" value="details" />
        <ClientProjectForm
          organizations={organizations}
          staff={staff}
          project={project}
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
          error={actionData?.error}
        />
      </Form>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <FeaturesEditor projectId={project._id} defaultValue={features} />
        </CardContent>
      </Card>
    </div>
  );
}
