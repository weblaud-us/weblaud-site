import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/change-requests";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ChangeRequest, ChangeRequestProjectRef, Organization, UpdateAuthorRef } from "~/lib/types";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Repeat } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export async function loader({ request }: Route.LoaderArgs) {
  const changeRequests = await callAdminApi(request, (accessToken) =>
    apiFetch<ChangeRequest[]>("/change-requests", { accessToken }),
  );
  return { changeRequests };
}

const STATUS_LABEL: Record<ChangeRequest["status"], string> = {
  requested: "New — needs pricing",
  quoted: "Awaiting client",
  client_approved: "Approved",
  rejected: "Rejected",
  invoiced: "Invoiced",
};

const STATUS_VARIANT: Record<ChangeRequest["status"], "default" | "secondary" | "outline" | "destructive"> = {
  requested: "outline",
  quoted: "outline",
  client_approved: "default",
  rejected: "destructive",
  invoiced: "secondary",
};

function projectRef(project: ChangeRequest["project"]) {
  return typeof project === "object" ? project : undefined;
}

function personName(ref: UpdateAuthorRef | string | undefined) {
  if (!ref) return "—";
  if (typeof ref === "string") return ref;
  return `${ref.firstName} ${ref.lastName}`.trim();
}

function money(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export default function AdminChangeRequests({ loaderData }: Route.ComponentProps) {
  const { changeRequests } = loaderData;
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();
  const filtered = changeRequests.filter((c) => {
    const project = projectRef(c.project);
    const org = project?.organization;
    const orgName = typeof org === "object" ? (org as Organization)?.name : "";
    return (
      c.title.toLowerCase().includes(q) ||
      (project?.name ?? "").toLowerCase().includes(q) ||
      (orgName ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <AdminPageHeader
        title="Change Requests"
        description="Priced scope additions a PM has quoted, across every project. Read-only — only a client admin can approve or reject. An approved one auto-generates a draft invoice, ready to review and send."
      />

      {changeRequests.length > 0 && (
        <ListSearch value={query} onChange={setQuery} placeholder="Search by title, project, or company..." className="mb-4" />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {changeRequests.length === 0 ? (
          <EmptyState
            icon={Repeat}
            title="No change requests yet"
            description="PMs raise these from a project's Manage tab in the portal."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Title</TableHead>
                <TableHead className="text-white/60">Project</TableHead>
                <TableHead className="text-white/60">Price</TableHead>
                <TableHead className="text-white/60">Requested by</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell colSpan={6} className="text-white/40 py-8 text-center">
                    No change requests match "{query}".
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((cr) => {
                const project = projectRef(cr.project);
                const org = project?.organization;
                const orgName = typeof org === "object" ? (org as Organization)?.name : undefined;
                return (
                  <TableRow key={cr._id} className="border-white/10">
                    <TableCell className="text-white font-medium">{cr.title}</TableCell>
                    <TableCell className="text-white/50">
                      {project ? (
                        <Link to={`/cpadmin/client-projects/${project._id}/edit`} className="hover:text-white transition-colors">
                          {project.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                      {orgName && <span className="text-white/30"> · {orgName}</span>}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {cr.status === "requested" ? (
                        <span className="text-white/30">Not priced yet</span>
                      ) : (
                        money(cr.priceAmount, cr.currency)
                      )}
                    </TableCell>
                    <TableCell className="text-white/50">{personName(cr.requestedBy)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[cr.status]}>{STATUS_LABEL[cr.status]}</Badge>
                    </TableCell>
                    <TableCell>
                      {cr.invoiceId ? (
                        <Link to={`/cpadmin/invoices/${cr.invoiceId}`} className="text-[#0A84FF] hover:underline">
                          View draft
                        </Link>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
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
