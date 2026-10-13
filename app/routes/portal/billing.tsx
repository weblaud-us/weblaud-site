import { useEffect } from "react";
import { Link, redirect, useFetcher } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/billing";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Contract, Invoice } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { EmptyState } from "~/components/admin/empty-state";
import { Receipt, Download, CreditCard, FileSignature, ExternalLink } from "lucide-react";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePortalUser(request);
  const [invoices, contracts] = await Promise.all([
    callPortalApi(request, (accessToken) => apiFetch<Invoice[]>("/portal/invoices", { accessToken })),
    callPortalApi(request, (accessToken) => apiFetch<Contract[]>("/portal/contracts", { accessToken })),
  ]);
  return { user, invoices, contracts };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = String(formData.get("id"));

  try {
    const { url } = await callPortalApi(request, (accessToken) =>
      apiFetch<{ url: string }>(`/portal/invoices/${id}/checkout`, { method: "POST", accessToken }),
    );
    // Stripe's URL is off-origin — redirect() just sets Location, which the
    // browser follows the same way for an external host as an internal path.
    throw redirect(url);
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

const INVOICE_STATUS_LABEL: Record<Invoice["status"], string> = {
  draft: "Draft",
  sent: "Awaiting payment",
  paid: "Paid",
  partially_paid: "Partially paid",
  overdue: "Overdue",
  void: "Void",
};

const INVOICE_STATUS_VARIANT: Record<Invoice["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  sent: "outline",
  paid: "default",
  partially_paid: "outline",
  overdue: "destructive",
  void: "destructive",
};

const CONTRACT_STATUS_LABEL: Record<Contract["status"], string> = {
  draft: "Draft",
  sent: "Awaiting your review",
  accepted: "Accepted",
  void: "Void",
};

const CONTRACT_STATUS_VARIANT: Record<Contract["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  sent: "outline",
  accepted: "default",
  void: "destructive",
};

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

function projectRef(ref: Invoice["project"] | Contract["project"]) {
  return ref && typeof ref === "object" ? ref : undefined;
}

/**
 * Σ per currency across everything still owed — sent/overdue invoices count
 * their full total (they have zero payments by construction: any payment
 * flips them to paid/partially_paid — see InvoiceService.settleFromLedger),
 * partially_paid counts only the remaining balance. Grouped by currency,
 * never summed across currencies — no FX conversion anywhere in this system.
 */
function outstandingByCurrency(invoices: Invoice[]): [string, number][] {
  const totals = new Map<string, number>();
  for (const inv of invoices) {
    let owed = 0;
    if (inv.status === "sent" || inv.status === "overdue") owed = inv.total;
    else if (inv.status === "partially_paid") owed = inv.total - (inv.amountPaid ?? 0);
    else continue;
    totals.set(inv.currency, (totals.get(inv.currency) ?? 0) + owed);
  }
  return [...totals.entries()];
}

function PayButton({ invoice }: { invoice: Invoice }) {
  const fetcher = useFetcher<typeof action>();
  const isBusy = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.error) toast.error(fetcher.data.error);
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="id" value={invoice._id} />
      <Button type="submit" size="sm" disabled={isBusy}>
        <CreditCard className="size-3.5" />
        {isBusy ? "Redirecting..." : "Pay now"}
      </Button>
    </fetcher.Form>
  );
}

export default function PortalBilling({ loaderData }: Route.ComponentProps) {
  const { user, invoices, contracts } = loaderData;
  const canPay = user.role === "admin" || user.orgRole === "client_admin";
  const outstanding = outstandingByCurrency(invoices);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Billing</h1>
        <p className="text-sm text-white/50 mt-1">Every invoice and contract across your projects, in one place.</p>
      </div>

      {outstanding.length > 0 && (
        <div className="mb-8 rounded-xl border border-[#0A84FF]/25 bg-[#0A84FF]/[0.06] p-5">
          <p className="text-sm font-medium text-white mb-2">Outstanding</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {outstanding.map(([currency, amount]) => (
              <p key={currency} className="text-2xl font-semibold text-white tabular-nums">
                {money(amount, currency)}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-sm font-medium text-white mb-4">Invoices</h2>
        {invoices.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.02]">
            <EmptyState icon={Receipt} title="No invoices yet" description="Invoices will show up here once raised." />
          </div>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => {
              const project = projectRef(invoice.project);
              return (
                <div key={invoice._id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{invoice.number}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {project && <>{project.name} &middot; </>}
                        Due {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={INVOICE_STATUS_VARIANT[invoice.status]}>
                      {INVOICE_STATUS_LABEL[invoice.status]}
                    </Badge>
                  </div>

                  <p className="text-lg font-semibold text-white mt-2">
                    {invoice.total.toFixed(2)} {invoice.currency}
                    {invoice.status === "partially_paid" && (
                      <span className="text-sm font-normal text-white/40">
                        {" "}
                        &middot; {(invoice.total - (invoice.amountPaid ?? 0)).toFixed(2)} {invoice.currency}{" "}
                        remaining
                      </span>
                    )}
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
                    <a href={`/portal/invoices/${invoice._id}/pdf`} target="_blank" rel="noreferrer">
                      <Button type="button" size="sm" variant="outline">
                        <Download className="size-3.5" />
                        PDF
                      </Button>
                    </a>
                    {(invoice.status === "sent" || invoice.status === "overdue") && canPay && (
                      <PayButton invoice={invoice} />
                    )}
                    {project && (
                      <Link
                        to={`/portal/projects/${project._id}/invoices`}
                        className="text-xs text-white/40 hover:text-white transition-colors ml-auto"
                      >
                        View in project
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium text-white mb-4">Contracts</h2>
        {contracts.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.02]">
            <EmptyState
              icon={FileSignature}
              title="No contracts yet"
              description="Contracts will show up here once sent."
            />
          </div>
        ) : (
          <div className="space-y-3">
            {contracts.map((contract) => {
              const project = projectRef(contract.project);
              return (
                <div
                  key={contract._id}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{contract.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {project?.name ?? "Organization-wide"} &middot; v{contract.version}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={CONTRACT_STATUS_VARIANT[contract.status]}>
                      {CONTRACT_STATUS_LABEL[contract.status]}
                    </Badge>
                    {project ? (
                      <Link
                        to={`/portal/projects/${project._id}/contract`}
                        className="inline-flex items-center gap-1 text-xs text-[#0A84FF] hover:underline"
                      >
                        <ExternalLink className="size-3" />
                        Open
                      </Link>
                    ) : (
                      contract.hasDocument && (
                        <a
                          href={`/portal/contracts/${contract._id}/document`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#0A84FF] hover:underline"
                        >
                          <ExternalLink className="size-3" />
                          View document
                        </a>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
