import { useState } from "react";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/index";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ClientProject, Invoice, Organization } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Receipt, Plus, Send, CheckCircle2, Ban, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export async function loader({ request }: Route.LoaderArgs) {
  const invoices = await callAdminApi(request, (accessToken) =>
    apiFetch<Invoice[]>("/invoices", { accessToken }),
  );
  return { invoices };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const id = String(formData.get("id"));

  try {
    if (intent === "send") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/invoices/${id}/send`, { method: "POST", accessToken }),
      );
    } else if (intent === "mark-paid") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/invoices/${id}/mark-paid`, { method: "POST", accessToken }),
      );
    } else if (intent === "void") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/invoices/${id}/void`, { method: "POST", accessToken }),
      );
    }
    return { ok: true };
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

function RowActions({ invoice }: { invoice: Invoice }) {
  const fetcher = useFetcher();
  const isBusy = fetcher.state !== "idle";
  const canSettle = invoice.status === "sent" || invoice.status === "overdue";

  return (
    <div className="flex items-center justify-end gap-2">
      <a href={`/cpadmin/invoices/${invoice._id}/pdf`} target="_blank" rel="noreferrer">
        <Button type="button" size="sm" variant="ghost" title="View PDF">
          <Download className="size-3.5" />
        </Button>
      </a>
      {invoice.status === "draft" && (
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="send" />
          <input type="hidden" name="id" value={invoice._id} />
          <Button type="submit" size="sm" variant="outline" disabled={isBusy}>
            <Send className="size-3.5" />
            Send
          </Button>
        </fetcher.Form>
      )}
      {canSettle && (
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="mark-paid" />
          <input type="hidden" name="id" value={invoice._id} />
          <Button type="submit" size="sm" variant="outline" disabled={isBusy}>
            <CheckCircle2 className="size-3.5" />
            Mark paid
          </Button>
        </fetcher.Form>
      )}
      {invoice.status !== "paid" && invoice.status !== "void" && (
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="void" />
          <input type="hidden" name="id" value={invoice._id} />
          <Button type="submit" size="sm" variant="destructive" disabled={isBusy}>
            <Ban className="size-3.5" />
            Void
          </Button>
        </fetcher.Form>
      )}
    </div>
  );
}

export default function AdminInvoicesIndex({ loaderData }: Route.ComponentProps) {
  const { invoices } = loaderData;
  const [query, setQuery] = useState("");
  const filtered = invoices.filter(
    (inv) => inv.number.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <AdminPageHeader
        title="Invoices"
        description="Bill clients and track payment status."
        actions={
          <Link to="/cpadmin/invoices/new">
            <Button>
              <Plus className="size-4" />
              New Invoice
            </Button>
          </Link>
        }
      />

      {invoices.length > 0 && (
        <ListSearch value={query} onChange={setQuery} placeholder="Search invoice numbers..." className="mb-4" />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {invoices.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No invoices yet"
            description="Create an invoice once a project is underway."
            action={
              <Link to="/cpadmin/invoices/new">
                <Button size="sm">
                  <Plus className="size-4" />
                  New Invoice
                </Button>
              </Link>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Number</TableHead>
                <TableHead className="text-white/60">Organization</TableHead>
                <TableHead className="text-white/60">Project</TableHead>
                <TableHead className="text-white/60">Total</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell colSpan={6} className="text-white/40 py-8 text-center">
                    No invoices match "{query}".
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((invoice) => {
                const org = invoice.organization as Organization;
                const project = invoice.project as ClientProject;
                return (
                  <TableRow key={invoice._id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      <Link to={`/cpadmin/invoices/${invoice._id}`} className="hover:text-[#0A84FF] transition-colors">
                        {invoice.number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-white/50">{org?.name ?? "—"}</TableCell>
                    <TableCell className="text-white/50">{project?.name ?? "—"}</TableCell>
                    <TableCell className="text-white/70">
                      {invoice.total.toFixed(2)} {invoice.currency}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[invoice.status]}>
                        {STATUS_LABEL[invoice.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <RowActions invoice={invoice} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
