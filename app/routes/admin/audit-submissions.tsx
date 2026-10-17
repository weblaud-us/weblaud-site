import { useState } from "react";
import { useSearchParams, useSubmit, useNavigation } from "react-router";
import type { Route } from "./+types/audit-submissions";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import { handleLeadPipelineIntent } from "~/lib/lead-actions.server";
import { isLeadStage } from "~/lib/leads";
import { SCORE_BAND_LABEL, scoreBand } from "~/lib/audit";
import type { AuditScores, AuditSubmission, Paginated } from "~/lib/types";
import {
  LeadPipelineActions,
  LeadPipelineSummary,
  LeadSource,
  StageFilter,
} from "~/components/admin/lead-pipeline";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Gauge } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { LocalTime } from "~/components/ui/local-time";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const stageParam = url.searchParams.get("stage");
  const stage = isLeadStage(stageParam) ? stageParam : null;
  const result = await callAdminApi(request, (accessToken) =>
    apiFetch<Paginated<AuditSubmission>>(
      `/audits/admin?page=${page}&limit=20${stage ? `&stage=${stage}` : ""}`,
      { accessToken },
    ),
  );
  return { result, page: Number(page), stage };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const pipelineResult = await handleLeadPipelineIntent(
    request,
    formData,
    "/audits/admin",
  );
  if (pipelineResult) return pipelineResult;

  const intent = String(formData.get("intent"));
  const id = String(formData.get("id"));

  try {
    if (intent === "read") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/audits/admin/${id}/read`, { method: "PATCH", accessToken }),
      );
    } else if (intent === "delete") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/audits/admin/${id}`, { method: "DELETE", accessToken }),
      );
    }
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
  return null;
}

const SCORE_CELLS: { key: keyof AuditScores; short: string; label: string }[] = [
  { key: "performance", short: "Perf", label: "Performance" },
  { key: "seo", short: "SEO", label: "SEO" },
  { key: "accessibility", short: "A11y", label: "Accessibility" },
  { key: "bestPractices", short: "BP", label: "Best practices" },
];

const BAND_TEXT = {
  good: "text-emerald-400",
  "needs-work": "text-amber-400",
  poor: "text-red-400",
} as const;

/** Four compact scores; colour matches the band, and the tooltip names it. */
function ScoreStrip({ scores }: { scores?: AuditScores }) {
  if (!scores) return <span className="text-white/25">—</span>;
  return (
    <div className="flex gap-2.5 text-xs tabular-nums">
      {SCORE_CELLS.map(({ key, short, label }) => {
        const band = scoreBand(scores[key]);
        return (
          <span
            key={key}
            title={`${label}: ${scores[key]} — ${SCORE_BAND_LABEL[band]}`}
            className="text-white/40"
          >
            {short} <span className={`font-semibold ${BAND_TEXT[band]}`}>{scores[key]}</span>
          </span>
        );
      })}
    </div>
  );
}

export default function AdminAuditSubmissions({ loaderData }: Route.ComponentProps) {
  const { result, page, stage } = loaderData;
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const navigation = useNavigation();
  const busyId =
    navigation.state !== "idle" && navigation.formData?.get("id")
      ? String(navigation.formData.get("id"))
      : null;
  const [query, setQuery] = useState("");
  const filtered = result.items.filter((a) => {
    const q = query.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.company ?? "").toLowerCase().includes(q) ||
      a.host.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <AdminPageHeader
        title="Website Audits"
        description="Leads from the free audit tool on /audit — people who ran an audit and asked for the full report."
      />

      <StageFilter active={stage} />

      {result.items.length > 0 && (
        <ListSearch
          value={query}
          onChange={setQuery}
          placeholder="Search this page..."
          className="mb-4"
        />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {result.items.length === 0 ? (
          <EmptyState
            icon={Gauge}
            title={stage ? "No leads in this stage" : "No audit leads yet"}
            description={
              stage
                ? "Pick another stage above, or All stages."
                : "When someone runs an audit on /audit and requests the full report, they'll show up here."
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">From</TableHead>
                <TableHead className="text-white/60">Contact</TableHead>
                <TableHead className="text-white/60">Site</TableHead>
                <TableHead className="text-white/60">Source</TableHead>
                <TableHead className="text-white/60">Received</TableHead>
                <TableHead className="text-white/60">Pipeline</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell colSpan={7} className="text-white/40 py-8 text-center">
                    No audits match "{query}".
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((lead) => (
                <TableRow
                  key={lead._id}
                  className={"border-white/10 " + (lead.status === "new" ? "bg-[#0A84FF]/[0.04]" : "")}
                >
                  <TableCell className="text-white font-medium">
                    <div>{lead.name}</div>
                    {lead.company && <div className="text-white/40 text-xs">{lead.company}</div>}
                  </TableCell>
                  <TableCell className="text-white/50">{lead.email}</TableCell>
                  <TableCell className="text-white/50 max-w-xs whitespace-normal">
                    <a
                      href={lead.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-white/80 hover:text-white underline-offset-2 hover:underline break-all"
                    >
                      {lead.host}
                    </a>
                    <div className="text-xs mb-1">
                      {lead.strategy} · {lead.issues.length} issue{lead.issues.length === 1 ? "" : "s"}
                    </div>
                    <ScoreStrip scores={lead.scores} />
                    {lead.issues.length > 0 && (
                      <div className="text-xs text-white/35 mt-1 line-clamp-2" title={lead.issues.map((i) => i.title).join("\n")}>
                        Top: {lead.issues.slice(0, 2).map((i) => i.title).join("; ")}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <LeadSource lead={lead} />
                  </TableCell>
                  <TableCell className="text-white/50">
                    <div><LocalTime value={lead.claimedAt ?? lead.createdAt} /></div>
                    <Badge className="mt-1" variant={lead.status === "new" ? "default" : "secondary"}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <LeadPipelineSummary lead={lead} />
                  </TableCell>
                  <TableCell className="text-right space-x-2 space-y-2">
                    <LeadPipelineActions
                      lead={lead}
                      leadId={lead._id}
                      name={lead.name}
                      email={lead.email}
                      company={lead.company}
                    />
                    {lead.status === "new" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busyId === lead._id}
                        onClick={() => submit({ intent: "read", id: lead._id }, { method: "post" })}
                      >
                        Mark read
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={busyId === lead._id}>
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete audit lead?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently removes {lead.name}'s audit of {lead.host}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => submit({ intent: "delete", id: lead._id }, { method: "post" })}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {result.meta.totalPages > 1 && (
        <Pagination className="mt-6 justify-start">
          <PaginationContent>
            {Array.from({ length: result.meta.totalPages }, (_, i) => i + 1).map((p) => {
              const params = new URLSearchParams(searchParams);
              params.set("page", String(p));
              return (
                <PaginationItem key={p}>
                  <PaginationLink href={`?${params.toString()}`} isActive={p === page}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
