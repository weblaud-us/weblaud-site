import { useState } from "react";
import { useSearchParams, useSubmit, useNavigation } from "react-router";
import type { Route } from "./+types/estimate-submissions";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import { formatCurrency } from "~/lib/utils";
import type { EstimateSubmission, Paginated } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { Calculator } from "lucide-react";
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
  const result = await callAdminApi(request, (accessToken) =>
    apiFetch<Paginated<EstimateSubmission>>(
      `/estimates/admin?page=${page}&limit=20`,
      { accessToken },
    ),
  );
  return { result, page: Number(page) };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const id = String(formData.get("id"));

  try {
    if (intent === "read") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/estimates/admin/${id}/read`, {
          method: "PATCH",
          accessToken,
        }),
      );
    } else if (intent === "delete") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/estimates/admin/${id}`, { method: "DELETE", accessToken }),
      );
    }
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
  return null;
}

export default function AdminEstimateSubmissions({
  loaderData,
}: Route.ComponentProps) {
  const { result, page } = loaderData;
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const navigation = useNavigation();
  const busyId =
    navigation.state !== "idle" && navigation.formData?.get("id")
      ? String(navigation.formData.get("id"))
      : null;
  const [query, setQuery] = useState("");
  const filtered = result.items.filter((e) => {
    const q = query.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.company ?? "").toLowerCase().includes(q) ||
      e.selection.projectTypeTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <AdminPageHeader
        title="Estimate Submissions"
        description="Leads from the cost estimator on /calculator, with the scope they selected."
      />

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
            icon={Calculator}
            title="No estimates yet"
            description="Leads from the cost estimator will show up here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">From</TableHead>
                <TableHead className="text-white/60">Contact</TableHead>
                <TableHead className="text-white/60">Scope</TableHead>
                <TableHead className="text-white/60">Estimate</TableHead>
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
                  <TableCell
                    colSpan={7}
                    className="text-white/40 py-8 text-center"
                  >
                    No estimates match "{query}".
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
                    <div>{lead.name}</div>
                    {lead.company && (
                      <div className="text-white/40 text-xs">{lead.company}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-white/50">
                    <div>{lead.email}</div>
                    {lead.phone && <div>{lead.phone}</div>}
                  </TableCell>
                  <TableCell className="text-white/50 max-w-xs whitespace-normal">
                    <div className="text-white/70">
                      {lead.selection.projectTypeTitle}
                    </div>
                    <div className="text-xs">
                      {lead.selection.speedLabel}
                      {lead.selection.featureTitles.length > 0 &&
                        ` · ${lead.selection.featureTitles.length} capabilit${
                          lead.selection.featureTitles.length === 1 ? "y" : "ies"
                        }`}
                    </div>
                    {lead.selection.featureTitles.length > 0 && (
                      <div className="text-xs text-white/35 mt-1">
                        {lead.selection.featureTitles.join(", ")}
                      </div>
                    )}
                    {lead.notes && (
                      <div className="text-xs text-white/35 mt-1 italic">
                        “{lead.notes}”
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-white/50 whitespace-nowrap">
                    <div className="text-white/70">
                      {formatCurrency(lead.result.costMin)} –{" "}
                      {formatCurrency(lead.result.costMax)}
                    </div>
                    <div className="text-xs">
                      {lead.result.totalWeeks} sprint weeks
                    </div>
                  </TableCell>
                  <TableCell className="text-white/50">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={lead.status === "new" ? "default" : "secondary"}
                    >
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
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
                          <AlertDialogTitle>Delete estimate?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently removes the estimate from{" "}
                            {lead.name}.
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
            {Array.from({ length: result.meta.totalPages }, (_, i) => i + 1).map(
              (p) => {
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
              },
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
