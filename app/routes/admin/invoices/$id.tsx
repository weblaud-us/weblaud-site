import { useState } from "react";
import { Form, Link, useActionData, useFetcher, useNavigation } from "react-router";
import type { Route } from "./+types/$id";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ClientProject, Invoice, InvoiceType, Organization, Payment } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";
import { Plus, Trash2, Download, Send, CheckCircle2, Ban } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export async function loader({ request, params }: Route.LoaderArgs) {
  const [invoice, payments] = await Promise.all([
    callAdminApi(request, (accessToken) =>
      apiFetch<Invoice>(`/invoices/${params.id}`, { accessToken }),
    ),
    callAdminApi(request, (accessToken) =>
      apiFetch<Payment[]>(`/invoices/${params.id}/payments`, { accessToken }),
    ),
  ]);
  return { invoice, payments };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "save") {
      const descriptions = formData.getAll("lineItemDescription").map(String);
      const qtys = formData.getAll("lineItemQty").map(Number);
      const unitPrices = formData.getAll("lineItemUnitPrice").map(Number);
      const lineItems = descriptions
        .map((description, i) => ({ description, qty: qtys[i], unitPrice: unitPrices[i] }))
        .filter((item) => item.description.trim().length > 0);

      const body: Record<string, unknown> = {
        type: String(formData.get("type") ?? "one_off"),
        lineItems,
        tax: Number(formData.get("tax") ?? 0),
        currency: String(formData.get("currency") ?? "USD"),
        issueDate: String(formData.get("issueDate") ?? ""),
        dueDate: String(formData.get("dueDate") ?? ""),
        notes: String(formData.get("notes") ?? ""),
      };

      await callAdminApi(request, (accessToken) =>
        apiFetch(`/invoices/${params.id}`, { method: "PATCH", accessToken, body }),
      );
      return { ok: true };
    }

    if (intent === "record-payment") {
      const amount = Number(formData.get("amount") ?? 0);
      const note = String(formData.get("note") ?? "");
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/invoices/${params.id}/record-payment`, {
          method: "POST",
          accessToken,
          body: { amount, note: note || undefined },
        }),
      );
      return { ok: true };
    }

    if (intent === "send") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/invoices/${params.id}/send`, { method: "POST", accessToken }),
      );
      return { ok: true };
    }

    if (intent === "mark-paid") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/invoices/${params.id}/mark-paid`, { method: "POST", accessToken }),
      );
      return { ok: true };
    }

    if (intent === "void") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/invoices/${params.id}/void`, { method: "POST", accessToken }),
      );
      return { ok: true };
    }

    return { error: "Unknown action." };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

const STATUS_LABEL: Record<Invoice["status"], string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  partially_paid: "Partially paid",
  overdue: "Overdue",
  void: "Void",
};

const STATUS_VARIANT: Record<Invoice["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  sent: "outline",
  paid: "default",
  partially_paid: "outline",
  overdue: "destructive",
  void: "destructive",
};

const TYPE_OPTIONS: { value: InvoiceType; label: string }[] = [
  { value: "one_off", label: "One-off" },
  { value: "deposit", label: "Deposit" },
  { value: "milestone", label: "Milestone" },
  { value: "retainer", label: "Retainer" },
];

interface LineItemRow {
  key: number;
  description?: string;
  qty?: number;
  unitPrice?: number;
}

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function StatusActions({ invoice }: { invoice: Invoice }) {
  const fetcher = useFetcher();
  const isBusy = fetcher.state !== "idle";
  const canSettle = invoice.status === "sent" || invoice.status === "overdue" || invoice.status === "partially_paid";

  return (
    <div className="flex items-center gap-2">
      <a href={`/cpadmin/invoices/${invoice._id}/pdf`} target="_blank" rel="noreferrer">
        <Button type="button" variant="outline" size="sm">
          <Download className="size-3.5" />
          PDF
        </Button>
      </a>
      {invoice.status === "draft" && (
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="send" />
          <Button type="submit" size="sm" variant="outline" disabled={isBusy}>
            <Send className="size-3.5" />
            Send
          </Button>
        </fetcher.Form>
      )}
      {canSettle && (
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="mark-paid" />
          <Button type="submit" size="sm" variant="outline" disabled={isBusy}>
            <CheckCircle2 className="size-3.5" />
            Mark fully paid
          </Button>
        </fetcher.Form>
      )}
      {invoice.status !== "paid" && invoice.status !== "void" && (
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="void" />
          <Button type="submit" size="sm" variant="destructive" disabled={isBusy}>
            <Ban className="size-3.5" />
            Void
          </Button>
        </fetcher.Form>
      )}
    </div>
  );
}

function RecordPaymentForm({ invoice, paidToDate }: { invoice: Invoice; paidToDate: number }) {
  const fetcher = useFetcher<typeof action>();
  const isBusy = fetcher.state !== "idle";
  const remaining = Math.max(0, invoice.total - paidToDate);
  const canRecord = ["sent", "overdue", "partially_paid"].includes(invoice.status);

  if (!canRecord) return null;

  return (
    <fetcher.Form method="post" className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="intent" value="record-payment" />
      <div className="space-y-1.5">
        <Label htmlFor="amount" className="text-xs">Amount received</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min={0.01}
          step="0.01"
          max={remaining}
          defaultValue={remaining}
          className="w-32"
          required
        />
      </div>
      <div className="space-y-1.5 flex-1 min-w-[160px]">
        <Label htmlFor="note" className="text-xs">Note (optional)</Label>
        <Input id="note" name="note" placeholder="e.g. wire transfer ref #1234" />
      </div>
      <Button type="submit" size="sm" disabled={isBusy}>
        {isBusy ? "Recording..." : "Record payment"}
      </Button>
      {fetcher.data && "error" in fetcher.data && fetcher.data.error && (
        <p className="text-red-400 text-xs w-full">{fetcher.data.error}</p>
      )}
    </fetcher.Form>
  );
}

export default function AdminInvoiceDetail({ loaderData }: Route.ComponentProps) {
  const { invoice, payments } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" && navigation.formData?.get("intent") === "save";
  const isDraft = invoice.status === "draft";

  const org = invoice.organization as Organization;
  const project = invoice.project as ClientProject;

  const [rows, setRows] = useState<LineItemRow[]>(
    invoice.lineItems.length > 0
      ? invoice.lineItems.map((item, i) => ({ key: i, ...item }))
      : [{ key: 0 }],
  );
  const nextKey = useState({ current: rows.length })[0];

  const paidToDate = payments
    .filter((p) => p.status === "succeeded")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={invoice.number}
        description={`${org?.name ?? "—"} · ${project?.name ?? "—"}`}
        backTo="/cpadmin/invoices"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANT[invoice.status]}>{STATUS_LABEL[invoice.status]}</Badge>
          </div>
        }
      />

      <div className="mb-6">
        <StatusActions invoice={invoice} />
      </div>

      {(invoice.status === "sent" || invoice.status === "overdue" || invoice.status === "partially_paid") && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Record a payment</CardTitle>
          </CardHeader>
          <CardContent>
            <RecordPaymentForm invoice={invoice} paidToDate={paidToDate} />
          </CardContent>
        </Card>
      )}

      {payments.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Payment history</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/60">Date</TableHead>
                  <TableHead className="text-white/60">Amount</TableHead>
                  <TableHead className="text-white/60">Method</TableHead>
                  <TableHead className="text-white/60">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p._id} className="border-white/10">
                    <TableCell className="text-white/50">{new Date(p.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-white">{money(p.amount, p.currency)}</TableCell>
                    <TableCell className="text-white/50 capitalize">{p.provider}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === "succeeded" ? "default" : p.status === "failed" ? "destructive" : "secondary"}>
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="px-4 py-3 text-xs text-white/40 border-t border-white/10">
              {money(paidToDate, invoice.currency)} received of {money(invoice.total, invoice.currency)} total.
            </p>
          </CardContent>
        </Card>
      )}

      {!isDraft ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Line items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {invoice.lineItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                <span className="text-white/70">{item.description}</span>
                <span className="text-white/50">
                  {item.qty} × {money(item.unitPrice, invoice.currency)} = {money(item.qty * item.unitPrice, invoice.currency)}
                </span>
              </div>
            ))}
            <div className="pt-2 space-y-1 text-sm">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span>{money(invoice.subtotal, invoice.currency)}</span>
              </div>
              {invoice.tax > 0 && (
                <div className="flex justify-between text-white/50">
                  <span>Tax</span>
                  <span>{money(invoice.tax, invoice.currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-medium text-base pt-1">
                <span>Total</span>
                <span>{money(invoice.total, invoice.currency)}</span>
              </div>
            </div>
            {invoice.notes && <p className="text-xs text-white/40 pt-2 whitespace-pre-wrap">{invoice.notes}</p>}
            <p className="text-xs text-white/30 pt-2">
              Only a draft invoice can be edited — void this one and raise a new one instead.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Form method="post" className="space-y-6">
          <input type="hidden" name="intent" value="save" />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select id="type" name="type" defaultValue={invoice.type}>
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" name="currency" defaultValue={invoice.currency} />
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
                    <Input
                      name="lineItemDescription"
                      placeholder="Design phase"
                      defaultValue={row.description}
                      required
                    />
                  </div>
                  <div className="w-20 space-y-1.5">
                    {i === 0 && <Label className="text-xs">Qty</Label>}
                    <Input
                      name="lineItemQty"
                      type="number"
                      min={0}
                      step="1"
                      defaultValue={row.qty ?? 1}
                      required
                    />
                  </div>
                  <div className="w-28 space-y-1.5">
                    {i === 0 && <Label className="text-xs">Unit price</Label>}
                    <Input
                      name="lineItemUnitPrice"
                      type="number"
                      min={0}
                      step="0.01"
                      defaultValue={row.unitPrice}
                      required
                    />
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
                onClick={() => setRows([...rows, { key: nextKey.current++ }])}
              >
                <Plus className="size-3.5" />
                Add line
              </Button>

              <div className="pt-2 space-y-2 max-w-[160px]">
                <Label htmlFor="tax">Tax amount</Label>
                <Input id="tax" name="tax" type="number" min={0} step="0.01" defaultValue={invoice.tax} />
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
                  <Input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    defaultValue={invoice.issueDate.slice(0, 10)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    defaultValue={invoice.dueDate.slice(0, 10)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" name="notes" className="h-20" defaultValue={invoice.notes} />
              </div>
            </CardContent>
          </Card>

          {actionData && "error" in actionData && actionData.error && (
            <p className="text-red-400 text-sm">{actionData.error}</p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </Form>
      )}

      <p className="mt-6">
        <Link to="/cpadmin/invoices" className="text-xs text-white/40 hover:text-white/70 transition-colors">
          ← Back to invoices
        </Link>
      </p>
    </div>
  );
}
