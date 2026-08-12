import { useSearchParams, useSubmit, useNavigation } from "react-router";
import type { Route } from "./+types/applicants";
import { apiFetch, ApiError, resolveMediaUrl } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import {
  APPLICATION_STATUSES,
  type Career,
  type JobApplication,
  type Paginated,
} from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ClipboardList, Download, FileText } from "lucide-react";
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

/** The filters the backend's applicant listing understands. */
function filterQuery(searchParams: URLSearchParams) {
  const params = new URLSearchParams();
  const careerId = searchParams.get("careerId");
  const email = searchParams.get("email");
  if (careerId) params.set("careerId", careerId);
  if (email) params.set("email", email);
  return params;
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";

  const query = filterQuery(url.searchParams);
  query.set("page", page);
  query.set("limit", "20");

  const [result, jobs] = await Promise.all([
    callAdminApi(request, (accessToken) =>
      apiFetch<Paginated<JobApplication>>(
        `/careers/admin/applicants?${query.toString()}`,
        { accessToken },
      ),
    ),
    callAdminApi(request, (accessToken) =>
      apiFetch<Paginated<Career>>("/careers/admin?page=1&limit=100", {
        accessToken,
      }),
    ),
  ]);

  return {
    result: {
      ...result,
      // resumeUrl comes back as either an absolute S3 URL or a path relative to
      // the API origin — normalize it here, on the server, where the origin is
      // known.
      items: result.items.map((item) => ({
        ...item,
        resumeUrl: resolveMediaUrl(item.resumeUrl),
      })),
    },
    jobs: jobs.items,
    page: Number(page),
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

  try {
    await callAdminApi(request, (accessToken) =>
      apiFetch(`/careers/admin/applicants/${id}/status`, {
        method: "PATCH",
        accessToken,
        body: { status },
      }),
    );
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
  return null;
}

export default function AdminApplicants({ loaderData }: Route.ComponentProps) {
  const { result, jobs, page } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();
  const navigation = useNavigation();
  const busyId =
    navigation.state !== "idle" && navigation.formData?.get("id")
      ? String(navigation.formData.get("id"))
      : null;

  const careerId = searchParams.get("careerId") ?? "";
  const email = searchParams.get("email") ?? "";

  // Filtering happens on the backend, so changing one resets to page 1.
  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    setSearchParams(params);
  }

  const exportQuery = filterQuery(searchParams).toString();

  return (
    <div>
      <AdminPageHeader
        title="Applicants"
        description="Applications submitted from /career."
        actions={
          <a
            href={`/cpadmin/applicants/export${exportQuery ? `?${exportQuery}` : ""}`}
          >
            <Button variant="outline">
              <Download className="size-4" />
              Export CSV
            </Button>
          </a>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Select
          aria-label="Filter by job"
          className="py-2"
          value={careerId}
          onChange={(e) => setFilter("careerId", e.target.value)}
        >
          <option value="">All positions</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </Select>
        {/* Applies on Enter or blur rather than per keystroke — each change is
            a server round-trip, not a client-side filter. */}
        <input
          type="search"
          key={email}
          defaultValue={email}
          placeholder="Filter by email, then press Enter"
          onBlur={(e) => setFilter("email", e.target.value.trim())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setFilter("email", e.currentTarget.value.trim());
            }
          }}
          className="w-full max-w-xs rounded-lg border border-light-black bg-black/40 py-2 px-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none transition-colors"
        />
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {result.items.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No applications yet"
            description="Applications submitted from a job post will show up here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Applicant</TableHead>
                <TableHead className="text-white/60">Position</TableHead>
                <TableHead className="text-white/60">Applied</TableHead>
                <TableHead className="text-white/60">Resume</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.items.map((applicant) => (
                <TableRow
                  key={applicant._id}
                  className={
                    "border-white/10 " +
                    (applicant.status === "new" ? "bg-[#0A84FF]/[0.04]" : "")
                  }
                >
                  <TableCell>
                    <div className="text-white font-medium">
                      {applicant.name}
                    </div>
                    <div className="text-white/50">{applicant.email}</div>
                    <div className="text-white/50">{applicant.phone}</div>
                  </TableCell>
                  <TableCell className="text-white/50">
                    {applicant.careerId?.title ?? "—"}
                  </TableCell>
                  <TableCell className="text-white/50">
                    {new Date(applicant.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {applicant.resumeUrl ? (
                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#0A84FF] hover:underline"
                      >
                        <FileText className="size-4" />
                        Open
                      </a>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      aria-label={`Status for ${applicant.name}`}
                      className="py-1.5 capitalize"
                      value={applicant.status}
                      disabled={busyId === applicant._id}
                      onChange={(e) =>
                        submit(
                          { id: applicant._id, status: e.target.value },
                          { method: "post" },
                        )
                      }
                    >
                      {APPLICATION_STATUSES.map((status) => (
                        <option
                          key={status}
                          value={status}
                          className="capitalize"
                        >
                          {status}
                        </option>
                      ))}
                    </Select>
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
