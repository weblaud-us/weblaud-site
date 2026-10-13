import { useState } from "react";
import { Link, useSearchParams, useSubmit, useNavigation } from "react-router";
import type { Route } from "./+types/contact-submissions";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { ContactSubmission, Paginated } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Inbox } from "lucide-react";
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

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  // The backend leaves spam out of the default list; the Spam tab asks for it.
  const showSpam = url.searchParams.get("view") === "spam";
  const result = await callAdminApi(request, (accessToken) =>
    apiFetch<Paginated<ContactSubmission>>(
      `/contact/admin?page=${page}&limit=20${showSpam ? "&status=spam" : ""}`,
      { accessToken },
    ),
  );
  return { result, page: Number(page), showSpam };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
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

export default function AdminContactSubmissions({
  loaderData,
}: Route.ComponentProps) {
  const { result, page, showSpam } = loaderData;
  const [searchParams] = useSearchParams();
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
          placeholder="Search this page..."
          className="mb-4"
        />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {result.items.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={showSpam ? "No spam" : "No submissions yet"}
            description={
              showSpam
                ? "Messages the spam filter catches will show up here."
                : "Leads from the contact form will show up here."
            }
          />
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">From</TableHead>
              <TableHead className="text-white/60">Contact</TableHead>
              <TableHead className="text-white/60">Message</TableHead>
              <TableHead className="text-white/60">Received</TableHead>
              <TableHead className="text-white/60">Status</TableHead>
              <TableHead className="text-white/60 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="text-white/40 py-8 text-center">
                  No submissions match "{query}".
                </TableCell>
              </TableRow>
            )}
            {filtered.map((lead) => (
              <TableRow
                key={lead._id}
                className={
                  "border-white/10 " +
                  (lead.status === "new" ? "bg-[#0A84FF]/[0.04]" : "")
                }
              >
                <TableCell className="text-white font-medium">
                  {lead.firstName} {lead.lastName}
                </TableCell>
                <TableCell className="text-white/50">
                  <div>{lead.email}</div>
                  {lead.phone && <div>{lead.phone}</div>}
                </TableCell>
                <TableCell className="text-white/50 max-w-sm whitespace-normal">
                  {lead.message}
                </TableCell>
                <TableCell className="text-white/50">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={lead.status === "new" ? "default" : "secondary"}>
                    {lead.status}
                  </Badge>
                  {lead.spamReason && (
                    <div className="text-xs text-white/40 mt-1">
                      {lead.spamReason}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {lead.status === "spam" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busyId === lead._id}
                      onClick={() =>
                        submit(
                          { intent: "not-spam", id: lead._id },
                          { method: "post" },
                        )
                      }
                    >
                      Not spam
                    </Button>
                  )}
                  {lead.status === "new" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busyId === lead._id}
                      onClick={() =>
                        submit(
                          { intent: "read", id: lead._id },
                          { method: "post" },
                        )
                      }
                    >
                      Mark read
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={busyId === lead._id}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete submission?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the message from{" "}
                          {lead.firstName} {lead.lastName}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            submit(
                              { intent: "delete", id: lead._id },
                              { method: "post" },
                            )
                          }
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
            {Array.from(
              { length: result.meta.totalPages },
              (_, i) => i + 1,
            ).map((p) => {
              const params = new URLSearchParams(searchParams);
              params.set("page", String(p));
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={`?${params.toString()}`}
                    isActive={p === page}
                  >
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
