import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/approvals";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Approval, ChangeRequestProjectRef, Organization, UpdateAuthorRef } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { ClipboardCheck, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export async function loader({ request }: Route.LoaderArgs) {
  const approvals = await callAdminApi(request, (accessToken) =>
    apiFetch<Approval[]>("/approvals", { accessToken }),
  );
  return { approvals };
}

const STATUS_LABEL: Record<Approval["status"], string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_VARIANT: Record<Approval["status"], "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
};

const SUBJECT_LABEL: Record<Approval["subjectType"], string> = {
  deliverable: "Deliverable",
  milestone: "Milestone",
  change_request: "Change request",
  invoice: "Invoice",
};

function projectRef(project: Approval["project"]) {
  return typeof project === "object" ? (project as ChangeRequestProjectRef) : undefined;
}

function personName(ref: UpdateAuthorRef | string | undefined) {
  if (!ref) return "—";
  if (typeof ref === "string") return ref;
  return `${ref.firstName} ${ref.lastName}`.trim();
}

export default function AdminApprovals({ loaderData }: Route.ComponentProps) {
  const { approvals } = loaderData;
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();
  const filtered = approvals.filter((a) => {
    const project = projectRef(a.project);
    const org = project?.organization;
    const orgName = typeof org === "object" ? (org as Organization)?.name : "";
    return (
      a.title.toLowerCase().includes(q) ||
      (project?.name ?? "").toLowerCase().includes(q) ||
      (orgName ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <AdminPageHeader
        title="Approvals"
        description="Deliverable and milestone sign-offs a PM has asked a client to decide on, across every project. Read-only — only a client admin can approve or reject."
      />

      {approvals.length > 0 && (
        <ListSearch value={query} onChange={setQuery} placeholder="Search by title, project, or company..." className="mb-4" />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {approvals.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No approvals yet"
            description="PMs raise these from a project's Manage tab in the portal."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Title</TableHead>
                <TableHead className="text-white/60">Type</TableHead>
                <TableHead className="text-white/60">Project</TableHead>
                <TableHead className="text-white/60">Requested by</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell colSpan={6} className="text-white/40 py-8 text-center">
                    No approvals match "{query}".
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((approval) => {
                const project = projectRef(approval.project);
                const org = project?.organization;
                const orgName = typeof org === "object" ? (org as Organization)?.name : undefined;
                return (
                  <TableRow key={approval._id} className="border-white/10">
                    <TableCell>
                      <Link
                        to={`/cpadmin/approvals/${approval._id}`}
                        className="text-white font-medium hover:text-primary-bright transition-colors"
                      >
                        {approval.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-white/50">{SUBJECT_LABEL[approval.subjectType]}</TableCell>
                    <TableCell className="text-white/50">
                      {project ? (
                        <Link to={`/cpadmin/client-projects/${project._id}`} className="hover:text-white transition-colors">
                          {project.name}
                        </Link>
                      ) : (
                        "—"
                      )}
                      {orgName && <span className="text-white/30"> · {orgName}</span>}
                    </TableCell>
                    <TableCell className="text-white/50">{personName(approval.requestedBy)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[approval.status]}>{STATUS_LABEL[approval.status]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/cpadmin/approvals/${approval._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="size-3.5" />
                          View
                        </Button>
                      </Link>
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
