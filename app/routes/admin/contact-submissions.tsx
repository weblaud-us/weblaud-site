import { useState } from "react";
import { Link, useSubmit, useNavigation } from "react-router";
import type { Route } from "./+types/contact-submissions";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import { handleLeadPipelineIntent } from "~/lib/lead-actions.server";
import { BUDGET_LABEL, TIMELINE_LABEL, isLeadStage } from "~/lib/leads";
import { readPageParams, redirectPastLastPage } from "~/lib/pagination";
import type { ContactSubmission, Paginated } from "~/lib/types";
import {
  LeadPipelineSummary,
  LeadRowMenu,
  LeadSource,
  StageFilter,
} from "~/components/admin/lead-pipeline";
import { Button } from "~/components/ui/button";
import { AdminPageHeader } from "~/components/admin/page-header";
import { AdminPagination } from "~/components/admin/pagination";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Eye, Inbox } from "lucide-react";
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
  const url = new URL(request.url);
  const { page, limit } = readPageParams(url);
  // The backend leaves spam out of the default list; the Spam tab asks for it.
  const showSpam = url.searchParams.get("view") === "spam";
  const stageParam = url.searchParams.get("stage");
  const stage = !showSpam && isLeadStage(stageParam) ? stageParam : null;
  const result = await callAdminApi(request, (accessToken) =>
    apiFetch<Paginated<ContactSubmission>>(
      `/contact/admin?page=${page}&limit=${limit}${showSpam ? "&status=spam" : ""}${
        stage ? `&stage=${stage}` : ""
      }`,
      { accessToken },
    ),
  );
  redirectPastLastPage(url, result.meta);
  return { result, showSpam, stage };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const pipelineResult = await handleLeadPipelineIntent(
    request,
    formData,
    "/contact/admin",
  );
  if (pipelineResult) return pipelineResult;

  const intent = String(formData.get("intent"));
  const id = String(formData.get("id"));

  try {
    if (intent === "read") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/contact/admin/${id}/read`, {
          method: "PATCH",
          accessToken,
        }),
      );
    } else if (intent === "not-spam") {
      // Moves it back to the inbox and sends the notification email that was
      // withheld when it was filed as spam.
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/contact/admin/${id}/not-spam`, {
          method: "PATCH",
          accessToken,
        }),
      );
    } else if (intent === "delete") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/contact/admin/${id}`, { method: "DELETE", accessToken }),
      );
    }
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
  return null;
}

const STATUS_DOT: Record<ContactSubmission["status"], string> = {
  new: "bg-[#0A84FF]",
  read: "bg-white/25",
  spam: "bg-red-400",
};

export default function AdminContactSubmissions({
  loaderData,
}: Route.ComponentProps) {
  const { result, showSpam, stage } = loaderData;
  const submit = useSubmit();
  const navigation = useNavigation();
  const busyId =
    navigation.state !== "idle" && navigation.formData?.get("id")
      ? String(navigation.formData.get("id"))
      : null;
  const [query, setQuery] = useState("");
  const filtered = result.items.filter(
    (l) =>
      `${l.firstName} ${l.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
      l.email.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <AdminPageHeader
        title="Contact Submissions"
        description="Leads from the contact form."
      />

      <div className="mb-4 inline-flex rounded-lg border border-white/10 p-1 gap-1">
        {[
          { label: "Inbox", to: "?", active: !showSpam },
          { label: "Spam", to: "?view=spam", active: showSpam },
        ].map((tab) => (
          <Link
            key={tab.label}
            to={tab.to}
            className={
              "px-3 py-1.5 rounded-md text-sm transition-colors " +
              (tab.active
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white")
            }
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {!showSpam && <StageFilter active={stage} />}

      {showSpam && result.items.length > 0 && (
        <p className="text-sm text-white/50 mb-4">
          Filed automatically by the spam filter and never emailed to you. Use
          "Not spam" to move a real lead back to the inbox — it will be emailed
          then.
        </p>
      )}

      {result.items.length > 0 && (
        <ListSearch
          value={query}
          onChange={setQuery}
          placeholder="Filter this page by name or email..."
          className="mb-4"
        />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {result.items.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={
              showSpam
                ? "No spam"
                : stage
                  ? "No leads in this stage"
                  : "No submissions yet"
            }
            description={
              showSpam
                ? "Messages the spam filter catches will show up here."
                : stage
                  ? "Pick another stage above, or All stages."
                  : "Leads from the contact form will show up here."
            }
          />
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">From</TableHead>
              <TableHead className="text-white/60">Message</TableHead>
              <TableHead className="text-white/60">Source</TableHead>
              <TableHead className="text-white/60">Received</TableHead>
              {!showSpam && (
                <TableHead className="text-white/60">Pipeline</TableHead>
              )}
              <TableHead className="text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={showSpam ? 5 : 6}
                  className="text-white/40 py-8 text-center"
                >
                  No submissions match "{query}".
                </TableCell>
              </TableRow>
            )}
            {filtered.map((lead) => {
              const name = `${lead.firstName} ${lead.lastName}`.trim();
              return (
                <TableRow
                  key={lead._id}
                  className={
                    "border-white/10 align-top " +
                    (lead.status === "new" ? "bg-[#0A84FF]/[0.04]" : "")
                  }
                >
                  <TableCell className="max-w-[220px]">
                    <Link
                      to={`/cpadmin/contact-submissions/${lead._id}`}
                      className="block truncate text-white font-medium hover:text-primary-bright transition-colors"
                      title={name}
                    >
                      {name}
                    </Link>
                    <div className="truncate text-xs text-white/50" title={lead.email}>
                      {lead.email}
                    </div>
                    {lead.phone && (
                      <div className="text-xs text-white/40">{lead.phone}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-white/60 max-w-md min-w-[260px] whitespace-normal">
                    <p className="line-clamp-2 text-sm" title={lead.message}>
                      {lead.message}
                    </p>
                    {(lead.budget || lead.timeline) && (
                      <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-white/40">
                        {lead.budget && <span>Budget: {BUDGET_LABEL[lead.budget]}</span>}
                        {lead.timeline && <span>{TIMELINE_LABEL[lead.timeline]}</span>}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <LeadSource lead={lead} />
                  </TableCell>
                  <TableCell className="text-white/50 text-sm">
                    <LocalTime value={lead.createdAt} />
                    <div className="mt-1 flex items-center gap-1.5 text-xs capitalize">
                      <span className={`size-1.5 rounded-full ${STATUS_DOT[lead.status]}`} />
                      {lead.status}
                    </div>
                    {lead.spamReason && (
                      <div
                        className="text-xs text-white/40 mt-1 max-w-[180px] truncate"
                        title={lead.spamReason}
                      >
                        {lead.spamReason}
                      </div>
                    )}
                  </TableCell>
                  {!showSpam && (
                    <TableCell>
                      <LeadPipelineSummary lead={lead} />
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/cpadmin/contact-submissions/${lead._id}`}>
                          <Eye className="size-3.5" />
                          View
                        </Link>
                      </Button>
                      <LeadRowMenu
                        lead={lead}
                        leadId={lead._id}
                        name={name}
                        email={lead.email}
                        status={lead.status}
                        disabled={busyId === lead._id}
                        onIntent={(intent) =>
                          submit({ intent, id: lead._id }, { method: "post" })
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        )}
      </div>

      <AdminPagination meta={result.meta} noun="submissions" />
    </div>
  );
}
