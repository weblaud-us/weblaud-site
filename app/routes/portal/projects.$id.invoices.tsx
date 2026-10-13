import { useEffect } from "react";
import { redirect, useFetcher, useOutletContext } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/projects.$id.invoices";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Invoice } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { EmptyState } from "~/components/admin/empty-state";
import { Receipt, Download, CreditCard } from "lucide-react";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const invoices = await callPortalApi(request, (accessToken) =>
    apiFetch<Invoice[]>(`/portal/projects/${params.id}/invoices`, { accessToken }),
  );
  return { invoices };
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

const STATUS_LABEL: Record<Invoice["status"], string> = {
  draft: "Draft",
  sent: "Awaiting payment",
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

export default function PortalProjectInvoices({ loaderData }: Route.ComponentProps) {
  const { invoices } = loaderData;
  const { user } = useOutletContext<ProjectWorkspaceContext>();
  const canPay = user.role === "admin" || user.orgRole === "client_admin";

  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.02]">
        <EmptyState
          icon={Receipt}
          title="No invoices yet"
          description="Invoices for this project will show up here once raised."
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <div key={invoice._id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-white">{invoice.number}</p>
              <p className="text-xs text-white/40 mt-0.5">
                Due {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={STATUS_VARIANT[invoice.status]}>{STATUS_LABEL[invoice.status]}</Badge>
          </div>

          <p className="text-lg font-semibold text-white mt-2">
            {invoice.total.toFixed(2)} {invoice.currency}
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
          </div>
        </div>
      ))}
    </div>
  );
}
