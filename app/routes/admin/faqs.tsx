import { useEffect, useState } from "react";
import { useFetcher, useSearchParams } from "react-router";
import type { Route } from "./+types/faqs";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { Paginated, Faq } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { AdminPageHeader } from "~/components/admin/page-header";
import { EmptyState } from "~/components/admin/empty-state";
import { ListSearch } from "~/components/admin/list-search";
import { HelpCircle, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "1";
  const result = await callAdminApi(request, (accessToken) =>
    apiFetch<Paginated<Faq>>(`/faqs/admin?page=${page}&limit=20`, {
      accessToken,
    }),
  );
  return { result, page: Number(page) };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "delete") {
      const id = String(formData.get("id"));
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/faqs/${id}`, { method: "DELETE", accessToken }),
      );
      return { ok: true };
    }

    const body = {
      question: String(formData.get("question") ?? ""),
      answer: String(formData.get("answer") ?? ""),
      order: Number(formData.get("order") ?? 0),
      isActive: formData.get("isActive") === "on",
    };

    if (intent === "create") {
      await callAdminApi(request, (accessToken) =>
        apiFetch("/faqs", { method: "POST", accessToken, body }),
      );
    } else {
      const id = String(formData.get("id"));
      await callAdminApi(request, (accessToken) =>
        apiFetch(`/faqs/${id}`, {
          method: "PATCH",
          accessToken,
          body,
        }),
      );
    }
    return { ok: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

export default function AdminFaqs({ loaderData }: Route.ComponentProps) {
  const { result, page } = loaderData;
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();
  const [editing, setEditing] = useState<Faq | "new" | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setEditing(null);
    }
  }, [fetcher.state, fetcher.data]);

  const isSaving = fetcher.state !== "idle";
  const editingItem = editing !== "new" ? editing : null;
  const [query, setQuery] = useState("");
  const filtered = result.items.filter((f) =>
    f.question.toLowerCase().includes(query.toLowerCase()) ||
    f.answer.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <AdminPageHeader
        title="FAQ"
        description="Questions and answers shown on the home page."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus className="size-4" />
            Add Question
          </Button>
        }
      />

      {result.items.length > 0 && (
        <ListSearch value={query} onChange={setQuery} placeholder="Search this page..." className="mb-4" />
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
        {result.items.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="No FAQ items yet"
            description="Add your first question to show it on the home page."
            action={
              <Button size="sm" onClick={() => setEditing("new")}>
                <Plus className="size-4" />
                Add Question
              </Button>
            }
          />
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">Question</TableHead>
              <TableHead className="text-white/60">Order</TableHead>
              <TableHead className="text-white/60">Status</TableHead>
              <TableHead className="text-white/60 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={4} className="text-white/40 py-8 text-center">
                  No FAQ items match "{query}".
                </TableCell>
              </TableRow>
            )}
            {filtered.map((faq) => (
              <TableRow key={faq._id} className="border-white/10">
                <TableCell className="text-white max-w-md truncate">
                  {faq.question}
                </TableCell>
                <TableCell className="text-white/50">{faq.order}</TableCell>
                <TableCell>
                  <Badge variant={faq.isActive ? "default" : "secondary"}>
                    {faq.isActive ? "Active" : "Hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(faq)}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete question?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes "{faq.question}" from the
                          FAQ section.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            fetcher.submit(
                              { intent: "delete", id: faq._id },
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

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>

          <fetcher.Form method="post" className="space-y-4">
            <input
              type="hidden"
              name="intent"
              value={editingItem ? "update" : "create"}
            />
            {editingItem && (
              <input type="hidden" name="id" value={editingItem._id} />
            )}

            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                name="question"
                required
                className="h-16"
                defaultValue={editingItem?.question}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                name="answer"
                required
                className="h-24"
                defaultValue={editingItem?.answer}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                defaultValue={editingItem?.order ?? 0}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-white/70">
              <Checkbox
                name="isActive"
                defaultChecked={editingItem?.isActive ?? true}
              />
              Visible on the site
            </label>

            {fetcher.data && "error" in fetcher.data && fetcher.data.error && (
              <p className="text-red-400 text-sm">{fetcher.data.error}</p>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
