import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/new";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Organization, PortalUser, ProjectStaffRef } from "~/lib/types";
import { AdminPageHeader } from "~/components/admin/page-header";
import { ClientProjectForm, parseClientProjectForm } from "./project-form";

interface UsersListResponse {
  data: PortalUser[];
  total: number;
  page: number;
  limit: number;
}

/** Staff eligible to be a PM/team member: admins and managers, not clients or content editors. */
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

export async function loader({ request }: Route.LoaderArgs) {
  const [organizations, users] = await Promise.all([
    callAdminApi(request, (accessToken) =>
      apiFetch<Organization[]>("/organizations", { accessToken }),
    ),
    callAdminApi(request, (accessToken) =>
      apiFetch<UsersListResponse>("/users?page=1&limit=200", { accessToken }),
    ),
  ]);
  return { organizations, staff: toStaffList(users.data) };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const body = parseClientProjectForm(formData);

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch("/client-projects", { method: "POST", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/client-projects");
}

export default function NewClientProject({ loaderData }: Route.ComponentProps) {
  const { organizations, staff } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="New Client Project"
        description="Set up a project the client will see in their portal."
        backTo="/cpadmin/client-projects"
      />

      <Form method="post">
        <ClientProjectForm
          organizations={organizations}
          staff={staff}
          submitLabel="Create Project"
          isSubmitting={isSubmitting}
          error={actionData?.error}
        />
      </Form>
    </div>
  );
}
