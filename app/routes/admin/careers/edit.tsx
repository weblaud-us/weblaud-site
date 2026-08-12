import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/edit";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Career } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { AdminPageHeader } from "~/components/admin/page-header";
import { CareerFormFields, parseCareerForm } from "~/components/admin/career-form";

export async function loader({ request, params }: Route.LoaderArgs) {
  // GET /careers/:id is the admin read path too — unlike the slug lookup it
  // doesn't filter on isActive, so unpublished posts load here.
  const career = await callAdminApi(request, (accessToken) =>
    apiFetch<Career>(`/careers/${params.id}`, { accessToken }),
  );
  return { career };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const body = parseCareerForm(formData);

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/careers/${params.id}`, { method: "PATCH", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/careers");
}

export default function EditCareer({ loaderData }: Route.ComponentProps) {
  const { career } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Edit Job Post"
        description={career.title}
        backTo="/cpadmin/careers"
      />

      <Form method="post" className="space-y-6">
        <CareerFormFields career={career} />

        {actionData?.error && (
          <p className="text-red-400 text-sm">{actionData.error}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </Form>
    </div>
  );
}
