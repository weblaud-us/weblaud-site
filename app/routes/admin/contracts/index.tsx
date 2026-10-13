import { useState } from "react";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/index";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Contract, Organization } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { FileSignature, Plus, Send, Ban, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export async function loader({ request }: Route.LoaderArgs) {
  const contracts = await callAdminApi(request, (accessToken) =>
    apiFetch<Contract[]>("/contracts", { accessToken }),
  );
  return { contracts };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const id = String(formData.get("id"));

  try {
    if (intent === "send") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/contracts/${id}/send`, { method: "POST", accessToken }),
      );
    } else if (intent === "void") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/contracts/${id}/void`, { method: "POST", accessToken }),
      );
    } else if (intent === "delete") {
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/contracts/${id}`, { method: "DELETE", accessToken }),
      );
    }
    return { ok: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

const STATUS_LABEL: Record<Contract["status"], string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  void: "Void",
};

const STATUS_VARIANT: Record<Contract["status"], "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  sent: "outline",
  accepted: "default",
  void: "destructive",
};

function RowActions({ contract }: { contract: Contract }) {
  const fetcher = useFetcher();
  const isBusy = fetcher.state !== "idle";

  return (
    <div className="flex items-center justify-end gap-2">
      {contract.status !== "accepted" && (
        <Link to={`/cpadmin/contracts/${contract._id}/edit`}>
          <Button type="button" size="sm" variant="ghost">
            <Pencil className="size-3.5" />
            Edit
          </Button>
        </Link>
      )}
      {contract.status === "draft" && (
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="send" />
          <input type="hidden" name="id" value={contract._id} />
          <Button type="submit" size="sm" variant="outline" disabled={isBusy}>
            <Send className="size-3.5" />
            Send
          </Button>
        </fetcher.Form>
      )}
      {contract.status !== "accepted" && contract.status !== "void" && (
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="void" />
          <input type="hidden" name="id" value={contract._id} />
          <Button type="submit" size="sm" variant="destructive" disabled={isBusy}>
            <Ban className="size-3.5" />
            Void
          </Button>
        </fetcher.Form>
      )}
    </div>
  );
}

export default function AdminContractsIndex({ loaderData }: Route.ComponentProps) {
  const { contracts } = loaderData;
  const [query, setQuery] = useState("");
  const filtered = contracts.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AdminPageHeader
        title="Contracts"
        description="SOWs and agreements clients sign before or during a project."
        actions={
          <Link to="/cpadmin/contracts/new">
            <Button>
              <Plus className="size-4" />
              New Contract
            </Button>
          </Link>
        }
      />

      {contracts.length > 0 && (
        <ListSearch value={query} onChange={setQuery} placeholder="Search contracts..." className="mb-4" />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {contracts.length === 0 ? (
          <EmptyState
            icon={FileSignature}
            title="No contracts yet"
            description="Draft a contract once you've set up the client's organization."
            action={
              <Link to="/cpadmin/contracts/new">
                <Button size="sm">
                  <Plus className="size-4" />
                  New Contract
                </Button>
              </Link>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/60">Title</TableHead>
                <TableHead className="text-white/60">Organization</TableHead>
                <TableHead className="text-white/60">Status</TableHead>
                <TableHead className="text-white/60 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow className="border-white/10">
                  <TableCell colSpan={4} className="text-white/40 py-8 text-center">
                    No contracts match "{query}".
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((contract) => {
                const org = contract.organization as Organization;
                return (
                  <TableRow key={contract._id} className="border-white/10">
                    <TableCell className="text-white font-medium">{contract.title}</TableCell>
                    <TableCell className="text-white/50">{org?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[contract.status]}>
                        {STATUS_LABEL[contract.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <RowActions contract={contract} />
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
