import { Link } from "react-router";
import type { Route } from "./+types/audit-log.$id";
import { apiFetch } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { AuditLogActorRef, AuditLogEntry, PlatformRole } from "~/lib/types";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AdminPageHeader } from "~/components/admin/page-header";
import { LocalTime } from "~/components/ui/local-time";

export async function loader({ request, params }: Route.LoaderArgs) {
  const entry = await callAdminApi(request, (accessToken) =>
    apiFetch<AuditLogEntry>(`/audit-log/${params.id}`, { accessToken }),
  );
  return { entry };
}

const ROLE_LABEL: Record<PlatformRole, string> = {
  admin: "Admin",
  manager: "Staff",
  editor: "Editor",
  user: "Client",
};

function actorRef(actor: AuditLogEntry["actor"]) {
  return typeof actor === "object" ? (actor as AuditLogActorRef) : undefined;
}

function actorName(actor: AuditLogEntry["actor"]) {
  const ref = actorRef(actor);
  if (!ref) return String(actor);
  return `${ref.firstName} ${ref.lastName}`.trim() || ref.email;
}

/** Same display transform as the list page — entity.verb is the system's only action grammar. */
function actionLabel(action: string) {
  const [entity, ...verbParts] = action.split(".");
  const verb = verbParts.join(" ").replace(/_/g, " ");
  return `${entity.charAt(0).toUpperCase()}${entity.slice(1)} ${verb}`.trim();
}

export default function AuditLogDetail({ loaderData }: Route.ComponentProps) {
  const { entry } = loaderData;
  const actor = actorRef(entry.actor);

  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title={actionLabel(entry.action)}
        description={`${entry.entityType} · ${entry.entityId}`}
        backTo="/cpadmin/audit-log"
      />

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
              <CardDescription>The full meta payload recorded with this entry.</CardDescription>
            </CardHeader>
            <CardContent>
              {entry.meta && Object.keys(entry.meta).length > 0 ? (
                <pre className="rounded-lg border border-white/10 bg-white/2 p-4 text-xs font-mono text-white/70 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(entry.meta, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-white/40">No details recorded.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-white font-medium">{actorName(entry.actor)}</p>
              {actor && (
                <>
                  <p className="text-white/50">{actor.email}</p>
                  <Badge variant="secondary">{ROLE_LABEL[actor.role] ?? actor.role}</Badge>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Event</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Action</dt>
                  <dd className="text-white/90 font-mono text-xs">{entry.action}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Entity type</dt>
                  <dd className="text-white/90">{entry.entityType}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">Entity ID</dt>
                  <dd className="text-white/90 font-mono text-xs break-all">{entry.entityId}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/50">IP address</dt>
                  <dd className="text-white/90 font-mono text-xs">{entry.ip ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-4 pt-2 border-t border-white/10">
                  <dt className="text-white/50">When</dt>
                  <dd className="text-white/90"><LocalTime value={entry.at} withTime /></dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-6">
        <Link
          to="/cpadmin/audit-log"
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to audit log
        </Link>
      </p>
    </div>
  );
}