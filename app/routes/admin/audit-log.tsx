import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/audit-log";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { AuditLogActorRef, AuditLogEntry } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Eye, History } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { LocalTime } from "~/components/ui/local-time";

export async function loader({ request }: Route.LoaderArgs) {
  const entries = await callAdminApi(request, (accessToken) =>
    apiFetch<AuditLogEntry[]>("/audit-log?limit=200", { accessToken }),
  );
  return { entries };
}

function actorName(actor: AuditLogEntry["actor"]) {
  if (typeof actor === "string") return actor;
  const ref = actor as AuditLogActorRef;
  return `${ref.firstName} ${ref.lastName}`.trim() || ref.email;
}

/** "invoice.paid" -> "Invoice paid" — every action verb in this system already follows entity.verb (see AuditLogService's doc comment), so this is a pure display transform, not a lookup table to keep in sync. */
function actionLabel(action: string) {
  const [entity, ...verbParts] = action.split(".");
  const verb = verbParts.join(" ").replace(/_/g, " ");
  return `${entity.charAt(0).toUpperCase()}${entity.slice(1)} ${verb}`.trim();
}

function metaSummary(meta?: Record<string, unknown>) {
  if (!meta || Object.keys(meta).length === 0) return null;
  return Object.entries(meta)
    .map(([key, value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`)
    .join(" · ");
}

export default function AdminAuditLog({ loaderData }: Route.ComponentProps) {
  const { entries } = loaderData;
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();
  const filtered = entries.filter(
    (e) =>
      actorName(e.actor).toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q) ||
      e.entityType.toLowerCase().includes(q) ||
      e.entityId.toLowerCase().includes(q),
  );

  return (
    <div>
      <AdminPageHeader
        title="Audit Log"
        description="Every approval, payment, scope change and invite — who did what, and when."
      />

      {entries.length > 0 && (
        <ListSearch
          value={query}
          onChange={setQuery}
          placeholder="Search by actor, action, or entity..."
          className="mb-4"
        />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {entries.length === 0 ? (
          <EmptyState
            icon={History}
            title="Nothing recorded yet"
            description="Contract, invoice, approval and people-management actions will show up here as they happen."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/60">When</TableHead>
                  <TableHead className="text-white/60">Actor</TableHead>
                  <TableHead className="text-white/60">Action</TableHead>
                  <TableHead className="text-white/60">Entity</TableHead>
                  <TableHead className="text-white/60">Details</TableHead>
                  <TableHead className="text-white/60 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow className="border-white/10">
                    <TableCell colSpan={6} className="text-white/40 py-8 text-center">
                      No entries match "{query}".
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((entry) => (
                  <TableRow key={entry._id} className="border-white/10">
                    <TableCell className="text-white/50 whitespace-nowrap">
                      <LocalTime value={entry.at} withTime />
                    </TableCell>
                    <TableCell className="text-white whitespace-nowrap">{actorName(entry.actor)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Link
                        to={`/cpadmin/audit-log/${entry._id}`}
                        className="text-white/80 hover:text-primary-bright transition-colors"
                      >
                        {actionLabel(entry.action)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-white/50 whitespace-nowrap">
                      {entry.entityType} · <span className="text-white/30">{entry.entityId.slice(-8)}</span>
                    </TableCell>
                    <TableCell className="text-white/40 text-xs max-w-md">
                      {metaSummary(entry.meta) ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/cpadmin/audit-log/${entry._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="size-3.5" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
