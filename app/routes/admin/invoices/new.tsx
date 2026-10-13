import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/new";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ClientProject, InvoiceType, Organization } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";
import { Plus, Trash2 } from "lucide-react";

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

  const descriptions = formData.getAll("lineItemDescription").map(String);
  const qtys = formData.getAll("lineItemQty").map(Number);
  const unitPrices = formData.getAll("lineItemUnitPrice").map(Number);
  const lineItems = descriptions
    .map((description, i) => ({ description, qty: qtys[i], unitPrice: unitPrices[i] }))
    .filter((item) => item.description.trim().length > 0);

  const recurring = formData.get("recurring") === "on";

  const body: Record<string, unknown> = {
    organization: String(formData.get("organization") ?? ""),
    project: String(formData.get("project") ?? ""),
    type: String(formData.get("type") ?? "one_off"),
    lineItems,
    tax: Number(formData.get("tax") ?? 0),
    currency: String(formData.get("currency") ?? "USD"),
    issueDate: String(formData.get("issueDate") ?? ""),
    dueDate: String(formData.get("dueDate") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    recurring,
  };
  if (recurring) {
    body.recurrenceIntervalDays = Number(formData.get("recurrenceIntervalDays") ?? 30);
  }

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch("/invoices", { method: "POST", accessToken, body }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }

  throw redirect("/cpadmin/invoices");
}

const TYPE_OPTIONS: { value: InvoiceType; label: string }[] = [
  { value: "one_off", label: "One-off" },
  { value: "deposit", label: "Deposit" },
  { value: "milestone", label: "Milestone" },
  { value: "retainer", label: "Retainer" },
];

interface LineItemRow {
  key: number;
}

export default function NewInvoice({ loaderData }: Route.ComponentProps) {
  const { organizations, projects } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [rows, setRows] = useState<LineItemRow[]>([{ key: 0 }]);
  const [isRecurring, setIsRecurring] = useState(false);
  const nextKey = useState({ current: 1 })[0];

  const today = new Date().toISOString().slice(0, 10);
  const in15 = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="New Invoice"
        description="Bill a client for work on a project."
        backTo="/cpadmin/invoices"
      />

      <Form method="post" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Select id="organization" name="organization" required defaultValue="">
                  <option value="" disabled>
                    Select...
                  </option>
                  {organizations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select id="project" name="project" required defaultValue="">
                  <option value="" disabled>
                    Select...
                  </option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select id="type" name="type" defaultValue="one_off">
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" defaultValue="USD" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Line items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.map((row, i) => (
              <div key={row.key} className="flex items-end gap-2">
                <div className="flex-1 space-y-1.5">
                  {i === 0 && <Label className="text-xs">Description</Label>}
                  <Input name="lineItemDescription" placeholder="Design phase" required />
                </div>
                <div className="w-20 space-y-1.5">
                  {i === 0 && <Label className="text-xs">Qty</Label>}
                  <Input name="lineItemQty" type="number" min={0} step="1" defaultValue={1} required />
                </div>
                <div className="w-28 space-y-1.5">
                  {i === 0 && <Label className="text-xs">Unit price</Label>}
                  <Input name="lineItemUnitPrice" type="number" min={0} step="0.01" required />
                </div>
                {rows.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setRows(rows.filter((r) => r.key !== row.key))}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setRows([...rows, { key: nextKey.current++ }]);
              }}
            >
              <Plus className="size-3.5" />
              Add line
            </Button>

            <div className="pt-2 space-y-2 max-w-[160px]">
              <Label htmlFor="tax">Tax amount</Label>
              <Input id="tax" name="tax" type="number" min={0} step="0.01" defaultValue={0} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dates & notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue date</Label>
                <Input id="issueDate" name="issueDate" type="date" defaultValue={today} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due date</Label>
                <Input id="dueDate" name="dueDate" type="date" defaultValue={in15} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" name="notes" className="h-20" />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <Checkbox
                name="recurring"
                checked={isRecurring}
                onCheckedChange={(v) => setIsRecurring(v === true)}
              />
              Recurring retainer
            </label>
            {isRecurring && (
              <div className="space-y-2 max-w-[220px]">
                <Label htmlFor="recurrenceIntervalDays">Repeats every (days)</Label>
                <Input
                  id="recurrenceIntervalDays"
                  name="recurrenceIntervalDays"
                  type="number"
                  min={1}
                  defaultValue={30}
                />
                <p className="text-xs text-white/40">
                  A new invoice is generated and sent automatically on this cadence.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {actionData?.error && <p className="text-red-400 text-sm">{actionData.error}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Invoice"}
        </Button>
      </Form>
    </div>
  );
}
