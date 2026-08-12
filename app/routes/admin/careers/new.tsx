import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/new";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import { Button } from "~/components/ui/button";
import { AdminPageHeader } from "~/components/admin/page-header";
import { CareerFormFields, parseCareerForm } from "~/components/admin/career-form";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const body = parseCareerForm(formData);

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch("/careers", { method: "POST", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/careers");
}

export default function NewCareer() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="New Job Post"
        description="Publish an opening to /career."
        backTo="/cpadmin/careers"
      />

      <Form method="post" className="space-y-6">
        <CareerFormFields />

        {actionData?.error && (
          <p className="text-red-400 text-sm">{actionData.error}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Job Post"}
        </Button>
      </Form>
    </div>
  );
}
