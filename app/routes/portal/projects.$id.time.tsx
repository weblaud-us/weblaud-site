import { useEffect, useMemo, useState } from "react";
import { useFetcher, useOutletContext } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/projects.$id.time";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Task, TimeEntry } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { EmptyState } from "~/components/admin/empty-state";
import { Clock, Trash2, Receipt } from "lucide-react";
import { addUtcDays, formatShortDate, startOfUtcWeek } from "~/lib/dates";

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const [entries, tasks] = await Promise.all([
    callPortalApi(request, (accessToken) =>
      apiFetch<TimeEntry[]>(`/portal/projects/${params.id}/time-entries`, { accessToken }),
    ),
    callPortalApi(request, (accessToken) =>
      apiFetch<Task[]>(`/portal/projects/${params.id}/tasks`, { accessToken }),
    ),
  ]);
  return { entries, tasks };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  try {
    if (intent === "create") {
      const task = String(formData.get("task") ?? "");
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/time-entries`, {
          method: "POST",
          accessToken,
          body: {
            task: task || undefined,
            date: String(formData.get("date") ?? ""),
            minutes: Number(formData.get("minutes") ?? 0),
            note: String(formData.get("note") ?? ""),
            billable: formData.get("billable") === "on",
          },
        }),
      );
      return { ok: true };
    }
    if (intent === "delete") {
      const id = String(formData.get("id"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/time-entries/${id}`, { method: "DELETE", accessToken }),
      );
      return { ok: true };
    }
    if (intent === "generate-invoice") {
      const entryIds = JSON.parse(String(formData.get("entryIds") ?? "[]")) as string[];
      const dueDate = String(formData.get("dueDate") ?? "");
      await callPortalApi(request, (accessToken) =>
        apiFetch("/portal/time-entries/generate-invoice", {
          method: "POST",
          accessToken,
          body: { projectId: params.id, entryIds, dueDate },
        }),
      );
      return { ok: true };
    }
    return { error: "Unknown action." };
  } catch (err) {
    if (err instanceof Response) throw err;
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Something went wrong." };
  }
}

function taskTitle(ref: TimeEntry["task"]) {
  if (!ref) return undefined;
  return typeof ref === "string" ? undefined : ref.title;
}

function userName(ref: TimeEntry["user"]) {
  if (typeof ref === "string") return "Someone";
  return `${ref.firstName} ${ref.lastName}`;
}

function userId(ref: TimeEntry["user"]) {
  return typeof ref === "string" ? ref : ref._id;
}

function formatHours(minutes: number) {
  return (minutes / 60).toFixed(2);
}


function AddEntryForm({ tasks }: { tasks: Task[] }) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.error) toast.error(fetcher.data.error);
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post" className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-end">
      <input type="hidden" name="intent" value="create" />
      <div className="space-y-1.5 col-span-1">
        <Label htmlFor="date" className="text-xs">Date</Label>
        <Input id="date" name="date" type="date" defaultValue={today} required />
      </div>
      <div className="space-y-1.5 col-span-1">
        <Label htmlFor="minutes" className="text-xs">Minutes</Label>
        <Input id="minutes" name="minutes" type="number" min={1} step={1} required placeholder="60" />
      </div>
      <div className="space-y-1.5 col-span-2">
        <Label htmlFor="task" className="text-xs">Task (optional)</Label>
        <Select id="task" name="task" defaultValue="">
          <option value="">No specific task</option>
          {tasks.map((t) => (
            <option key={t._id} value={t._id}>{t.title}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5 col-span-2 sm:col-span-1">
        <Label htmlFor="note" className="text-xs">Note</Label>
        <Input id="note" name="note" placeholder="What did you work on?" />
      </div>
      <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
        <label className="flex items-center gap-1.5 text-xs text-white/60">
          <Checkbox name="billable" defaultChecked />
          Billable
        </label>
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? "Logging..." : "Log time"}
        </Button>
      </div>
    </fetcher.Form>
  );
}

function EntryRow({ entry, canManage }: { entry: TimeEntry; canManage: boolean }) {
  const fetcher = useFetcher();
  const isDeleting = fetcher.state !== "idle";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3.5 py-2.5">
      <Clock className="size-4 text-white/30 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-white">
          {formatShortDate(entry.date)} &middot;{" "}
          {formatHours(entry.minutes)}h
          {taskTitle(entry.task) && <span className="text-white/40"> &middot; {taskTitle(entry.task)}</span>}
        </p>
        {entry.note && <p className="text-xs text-white/40 truncate">{entry.note}</p>}
      </div>
      {!entry.billable && <span className="text-[10px] text-white/30 shrink-0">Non-billable</span>}
      {entry.invoiced ? (
        <span className="flex items-center gap-1 text-[10px] text-emerald-400 shrink-0">
          <Receipt className="size-3" />
          Invoiced
        </span>
      ) : (
        canManage && (
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="id" value={entry._id} />
            <Button type="submit" variant="outline" size="sm" disabled={isDeleting} aria-label="Delete entry">
              <Trash2 className="size-3.5" />
            </Button>
          </fetcher.Form>
        )
      )}
    </div>
  );
}

function GenerateInvoiceForm({ unbilledIds }: { unbilledIds: string[] }) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) toast.success("Draft invoice created from unbilled time.");
      else if (fetcher.data.error) toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  if (unbilledIds.length === 0) return null;

  return (
    <fetcher.Form method="post" className="flex items-center gap-2">
      <input type="hidden" name="intent" value="generate-invoice" />
      <input type="hidden" name="entryIds" value={JSON.stringify(unbilledIds)} />
      <input type="hidden" name="dueDate" value={inTwoWeeks} />
      <Button type="submit" size="sm" variant="outline" disabled={isSaving}>
        <Receipt className="size-3.5" />
        {isSaving ? "Generating..." : `Generate invoice from ${unbilledIds.length} billable entries`}
      </Button>
    </fetcher.Form>
  );
}

export default function PortalProjectTime({ loaderData }: Route.ComponentProps) {
  const { entries, tasks } = loaderData;
  const { user, isPm } = useOutletContext<ProjectWorkspaceContext>();
  // UTC weeks: entry days are stored as midnight UTC, and a local-time week
  // differed between the server render (UTC) and the browser.
  const [weekStart, setWeekStart] = useState(() => startOfUtcWeek(new Date()));

  const weekEnd = useMemo(() => addUtcDays(weekStart, 7), [weekStart]);

  const weekEntries = entries.filter((e) => {
    const d = new Date(e.date);
    return d >= weekStart && d < weekEnd;
  });

  const myEntries = weekEntries.filter((e) => userId(e.user) === user._id);
  const myTotalMinutes = myEntries.reduce((sum, e) => sum + e.minutes, 0);

  const byOther = new Map<string, { name: string; entries: TimeEntry[] }>();
  if (isPm) {
    for (const e of weekEntries) {
      const id = userId(e.user);
      if (id === user._id) continue;
      const existing = byOther.get(id);
      if (existing) existing.entries.push(e);
      else byOther.set(id, { name: userName(e.user), entries: [e] });
    }
  }

  const unbilledIds = entries.filter((e) => !e.invoiced && e.billable).map((e) => e._id);

  return (
    <div className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Log time</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setWeekStart((d) => addUtcDays(d, -7))
                }
              >
                Prev week
              </Button>
              <span className="text-xs text-white/50">
                {formatShortDate(weekStart)} &ndash; {formatShortDate(addUtcDays(weekEnd, -1))}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setWeekStart((d) => {
                    const n = new Date(d);
                    n.setDate(n.getDate() + 7);
                    return n;
                  })
                }
              >
                Next week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AddEntryForm tasks={tasks} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Your entries this week</CardTitle>
            <span className="text-sm text-white/60 tabular-nums">{formatHours(myTotalMinutes)}h total</span>
          </div>
        </CardHeader>
        <CardContent>
          {myEntries.length === 0 ? (
            <EmptyState icon={Clock} title="No time logged this week" description="Use the form above to log your hours." />
          ) : (
            <div className="space-y-2">
              {myEntries.map((entry) => (
                <EntryRow key={entry._id} entry={entry} canManage />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isPm && byOther.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Team, this week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...byOther.entries()].map(([id, { name, entries: rows }]) => (
              <div key={id}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm text-white/80">{name}</p>
                  <span className="text-xs text-white/40 tabular-nums">
                    {formatHours(rows.reduce((sum, e) => sum + e.minutes, 0))}h
                  </span>
                </div>
                <div className="space-y-2">
                  {rows.map((entry) => (
                    <EntryRow key={entry._id} entry={entry} canManage={false} />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {user.role === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <GenerateInvoiceForm unbilledIds={unbilledIds} />
            {unbilledIds.length === 0 && (
              <p className="text-sm text-white/40">Nothing unbilled, every logged entry is already on an invoice.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
