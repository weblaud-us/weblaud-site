import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/new";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ClientProject, Organization } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";

export async function loader({ request }: Route.LoaderArgs) {
  const [organizations, projects] = await Promise.all([
    callAdminApi(request, (accessToken) =>
      apiFetch<Organization[]>("/organizations", { accessToken }),
    ),
    callAdminApi(request, (accessToken) =>
      apiFetch<ClientProject[]>("/client-projects", { accessToken }),
    ),
  ]);
  return { organizations, projects };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const body = new FormData();
  body.set("organization", String(formData.get("organization") ?? ""));
  body.set("title", String(formData.get("title") ?? ""));
  const project = String(formData.get("project") ?? "");
  if (project) body.set("project", project);

  const document = formData.get("document");
  if (document instanceof File && document.size > 0) {
    body.set("document", document);
  }

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch("/contracts", { method: "POST", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/contracts");
}

export default function NewContract({ loaderData }: Route.ComponentProps) {
  const { organizations, projects } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-xl">
      <AdminPageHeader
        title="New Contract"
        description="Draft a contract or SOW for a client to review and sign."
        backTo="/cpadmin/contracts"
      />

      <Form method="post" encType="multipart/form-data" className="space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="Master Service Agreement" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Select id="organization" name="organization" required defaultValue="">
                <option value="" disabled>
                  Select a company...
                </option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Project (optional)</Label>
              <Select id="project" name="project" defaultValue="">
                <option value="">None — org-level agreement</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-white/40">
                Link a project so its team can see this contract in their portal workspace.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Contract document (PDF)</Label>
              <Input id="document" name="document" type="file" accept="application/pdf" />
              <p className="text-xs text-white/40">
                Required before the contract can be sent — you can also upload it later from the edit view.
              </p>
            </div>
          </CardContent>
        </Card>

        {actionData?.error && <p className="text-red-400 text-sm">{actionData.error}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Contract"}
        </Button>
      </Form>
    </div>
  );
}
