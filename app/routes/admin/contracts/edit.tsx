import { Form, Link, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/edit";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ClientProject, Contract, Organization } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";
import { FileText } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  const [contract, organizations, projects] = await Promise.all([
    callAdminApi(request, (accessToken) =>
      apiFetch<Contract>(`/contracts/${params.id}`, { accessToken }),
    ),
    callAdminApi(request, (accessToken) =>
      apiFetch<Organization[]>("/organizations", { accessToken }),
    ),
    callAdminApi(request, (accessToken) =>
      apiFetch<ClientProject[]>("/client-projects", { accessToken }),
    ),
  ]);
  return { contract, organizations, projects };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const body = new FormData();
  body.set("title", String(formData.get("title") ?? ""));
  const project = String(formData.get("project") ?? "");
  if (project) body.set("project", project);

  const document = formData.get("document");
  if (document instanceof File && document.size > 0) {
    body.set("document", document);
  }

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/contracts/${params.id}`, { method: "PATCH", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/contracts");
}

const STATUS_LABEL: Record<Contract["status"], string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  void: "Void",
};

const STATUS_VARIANT: Record<Contract["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  sent: "outline",
  accepted: "default",
  void: "destructive",
};

export default function EditContract({ loaderData }: Route.ComponentProps) {
  const { contract, organizations, projects } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const org = contract.organization as Organization;
  const isLocked = contract.status === "accepted";

  return (
    <div className="max-w-xl">
      <AdminPageHeader
        title="Edit Contract"
        description={org?.name ?? contract.title}
        backTo="/cpadmin/contracts"
        actions={<Badge variant={STATUS_VARIANT[contract.status]}>{STATUS_LABEL[contract.status]}</Badge>}
      />

      {isLocked ? (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <p className="text-sm text-white/70">
              This contract has been accepted and can no longer be edited — the acceptance record is
              permanent. Void it and draft a new version instead.
            </p>
            {contract.hasDocument && (
              <a
                href={`/cpadmin/contracts/${contract._id}/certificate`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#0A84FF] hover:underline"
              >
                <FileText className="size-3.5" />
                View certificate of acceptance
              </a>
            )}
          </CardContent>
        </Card>
      ) : (
        <Form method="post" encType="multipart/form-data" className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required defaultValue={contract.title} />
              </div>

              <div className="space-y-2">
                <Label>Organization</Label>
                <p className="text-sm text-white/50 px-1">{org?.name ?? "—"} (fixed once created)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project (optional)</Label>
                <Select
                  id="project"
                  name="project"
                  defaultValue={typeof contract.project === "object" ? contract.project._id : contract.project ?? ""}
                >
                  <option value="">None — org-level agreement</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">Contract document (PDF)</Label>
                <Input id="document" name="document" type="file" accept="application/pdf" />
                <p className="text-xs text-white/40">
                  {contract.hasDocument
                    ? "Uploading a new file replaces the current one and bumps the version."
                    : "No document uploaded yet — required before this can be sent."}
                </p>
              </div>
            </CardContent>
          </Card>

          {actionData?.error && <p className="text-red-400 text-sm">{actionData.error}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </Form>
      )}

      <p className="mt-6">
        <Link to="/cpadmin/contracts" className="text-xs text-white/40 hover:text-white/70 transition-colors">
          ← Back to contracts
        </Link>
      </p>
    </div>
  );
}
