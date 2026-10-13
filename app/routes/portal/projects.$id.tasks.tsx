import { useEffect, useState } from "react";
import { useFetcher, useOutletContext } from "react-router";
import { toast } from "sonner";
import type { Route } from "./+types/projects.$id.tasks";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { Comment, Feature, ProjectStaffRef, ReorderTaskPosition, Task, TaskStatus } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { EmptyState } from "~/components/admin/empty-state";
import { CommentThread } from "~/components/portal/comment-thread";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { KanbanSquare, Plus, Trash2, CalendarClock, Clock } from "lucide-react";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "backlog", label: "Backlog" },
  { status: "todo", label: "To do" },
  { status: "in_progress", label: "In progress" },
  { status: "in_review", label: "In review" },
  { status: "done", label: "Done" },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  await requirePortalUser(request);
  const [tasks, features] = await Promise.all([
    callPortalApi(request, (accessToken) =>
      apiFetch<Task[]>(`/portal/projects/${params.id}/tasks`, { accessToken }),
    ),
    callPortalApi(request, (accessToken) =>
      apiFetch<Feature[]>(`/portal/projects/${params.id}/features`, { accessToken }),
    ),
  ]);
  return { tasks, features };
}

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  function taskBody() {
    const feature = String(formData.get("feature") ?? "");
    const assignee = String(formData.get("assignee") ?? "");
    const dueDate = String(formData.get("dueDate") ?? "");
    const estimateHours = String(formData.get("estimateHours") ?? "");
    return {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      status: String(formData.get("status") ?? "backlog"),
      feature: feature || null,
      assignee: assignee || null,
      dueDate: dueDate || null,
      ...(estimateHours ? { estimateHours: Number(estimateHours) } : {}),
      clientVisible: formData.get("clientVisible") === "on",
    };
  }

  try {
    if (intent === "create") {
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/tasks`, { method: "POST", accessToken, body: taskBody() }),
      );
      return { ok: true };
    }
    if (intent === "update") {
      const id = String(formData.get("id"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/tasks/${id}`, { method: "PATCH", accessToken, body: taskBody() }),
      );
      return { ok: true };
    }
    if (intent === "delete") {
      const id = String(formData.get("id"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/tasks/${id}`, { method: "DELETE", accessToken }),
      );
      return { ok: true };
    }
    if (intent === "reorder") {
      const positions = JSON.parse(String(formData.get("positions") ?? "[]")) as ReorderTaskPosition[];
      await callPortalApi(request, (accessToken) =>
        apiFetch("/portal/tasks/reorder", { method: "PATCH", accessToken, body: { positions } }),
      );
      return { ok: true };
    }
    if (intent === "comment") {
      const endpoint = String(formData.get("endpoint"));
      await callPortalApi(request, (accessToken) =>
        apiFetch(endpoint, {
          method: "POST",
          accessToken,
          body: {
            body: String(formData.get("body") ?? ""),
            internal: formData.get("internal") === "on",
            mentions: JSON.parse(String(formData.get("mentions") ?? "[]")),
          },
        }),
      );
      return { ok: true };
    }
    if (intent === "load-comments") {
      const endpoint = String(formData.get("endpoint"));
      const comments = await callPortalApi(request, (accessToken) =>
        apiFetch<Comment[]>(endpoint, { accessToken }),
      );
      return { ok: true, comments };
    }
    if (intent === "log-time") {
      const task = String(formData.get("task") ?? "");
      await callPortalApi(request, (accessToken) =>
        apiFetch(`/portal/projects/${params.id}/time-entries`, {
          method: "POST",
          accessToken,
          body: {
            task: task || undefined,
            date: new Date().toISOString().slice(0, 10),
            minutes: Number(formData.get("minutes") ?? 0),
            note: String(formData.get("note") ?? ""),
            billable: true,
          },
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

function staffName(ref: ProjectStaffRef | string | undefined) {
  if (!ref || typeof ref === "string") return undefined;
  return `${ref.firstName} ${ref.lastName}`;
}

function staffInitials(ref: ProjectStaffRef | string | undefined) {
  if (!ref || typeof ref === "string") return "?";
  return `${ref.firstName[0] ?? ""}${ref.lastName[0] ?? ""}`.toUpperCase();
}

function featureTitle(ref: Task["feature"]) {
  if (!ref || typeof ref === "string") return undefined;
  return ref.title;
}

/**
 * Client-side elapsed-time timer, not a server-persisted "running timer"
 * concept — the start timestamp lives in localStorage (keyed per task) so
 * a reload doesn't lose it, but there's no TimeEntry row until "Stop" is
 * pressed. Posts a single time-entries POST with the elapsed minutes.
 */
function TimerWidget({ taskId }: { taskId: string }) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const storageKey = `weblaud-timer-${taskId}`;
  const [startedAt, setStartedAt] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(storageKey);
    return raw ? Number(raw) : null;
  });
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!startedAt) return;
    const tick = () => setElapsedMs(Date.now() - startedAt);
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) toast.success("Time logged.");
      else if (fetcher.data.error) toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  const start = () => {
    const now = Date.now();
    window.localStorage.setItem(storageKey, String(now));
    setStartedAt(now);
  };

  const stop = () => {
    if (!startedAt) return;
    const minutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    window.localStorage.removeItem(storageKey);
    setStartedAt(null);
    fetcher.submit({ intent: "log-time", task: taskId, minutes: String(minutes) }, { method: "post" });
  };

  const elapsedLabel = () => {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h > 0 ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-white/10">
      <Clock className="size-3.5 text-white/40" />
      {startedAt ? (
        <>
          <span className="text-sm text-white tabular-nums">{elapsedLabel()}</span>
          <Button type="button" size="sm" variant="outline" onClick={stop}>
            Stop &amp; log
          </Button>
        </>
      ) : (
        <Button type="button" size="sm" variant="outline" onClick={start}>
          Start timer
        </Button>
      )}
    </div>
  );
}

function TaskDialog({
  trigger,
  task,
  defaultStatus,
  assignable,
  features,
  currentUserId,
  isStaff,
  onDeleted,
}: {
  trigger: React.ReactNode;
  task?: Task;
  defaultStatus: TaskStatus;
  assignable: ProjectStaffRef[];
  features: Feature[];
  currentUserId: string;
  isStaff: boolean;
  onDeleted?: () => void;
}) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const deleteFetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const commentsFetcher = useFetcher<{ ok?: boolean; comments?: Comment[] }>();
  const [open, setOpen] = useState(false);
  const isSaving = fetcher.state !== "idle";
  const isDeleting = deleteFetcher.state !== "idle";

  const assigneeId = typeof task?.assignee === "object" ? task.assignee._id : (task?.assignee ?? "");
  const featureId = typeof task?.feature === "object" ? task.feature._id : (task?.feature ?? "");
  const commentsEndpoint = task ? `/portal/tasks/${task._id}/comments` : undefined;

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) setOpen(false);
      else if (fetcher.data.error) toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    if (deleteFetcher.state === "idle" && deleteFetcher.data?.ok) {
      setOpen(false);
      onDeleted?.();
    }
  }, [deleteFetcher.state, deleteFetcher.data]);

  useEffect(() => {
    if (open && commentsEndpoint) {
      commentsFetcher.submit({ intent: "load-comments", endpoint: commentsEndpoint }, { method: "post" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit task" : "New task"}</DialogTitle>
        </DialogHeader>
        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value={task ? "update" : "create"} />
          {task && <input type="hidden" name="id" value={task._id} />}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required defaultValue={task?.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" className="h-20" defaultValue={task?.description} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={task?.status ?? defaultStatus}>
                {COLUMNS.map((col) => (
                  <option key={col.status} value={col.status}>
                    {col.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feature">Feature</Label>
              <Select id="feature" name="feature" defaultValue={featureId}>
                <option value="">None</option>
                {features.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.title}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select id="assignee" name="assignee" defaultValue={assigneeId}>
                <option value="">Unassigned</option>
                {assignable.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.firstName} {member.lastName}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" name="dueDate" type="date" defaultValue={task?.dueDate?.slice(0, 10)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimateHours">Estimate (hours)</Label>
            <Input
              id="estimateHours"
              name="estimateHours"
              type="number"
              min={0}
              step="0.5"
              defaultValue={task?.estimateHours}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <Checkbox name="clientVisible" defaultChecked={task?.clientVisible ?? true} />
            Visible to the client
          </label>

          {fetcher.data?.error && <p className="text-red-400 text-sm">{fetcher.data.error}</p>}

          <DialogFooter className="flex items-center justify-between sm:justify-between">
            {task ? (
              <deleteFetcher.Form method="post">
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="id" value={task._id} />
                <Button type="submit" variant="outline" size="sm" disabled={isDeleting}>
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </deleteFetcher.Form>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : task ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </fetcher.Form>

        {task && isStaff && <TimerWidget taskId={task._id} />}

        {task && commentsEndpoint && (
          <div className="pt-4 mt-4 border-t border-white/10">
            <CommentThread
              endpoint={commentsEndpoint}
              comments={commentsFetcher.data?.comments ?? []}
              currentUserId={currentUserId}
              isStaff={isStaff}
              mentionable={assignable}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TaskCard({
  task,
  draggable,
  onDragStart,
  assignable,
  features,
  currentUserId,
  isStaff,
}: {
  task: Task;
  draggable: boolean;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  assignable: ProjectStaffRef[];
  features: Feature[];
  currentUserId: string;
  isStaff: boolean;
}) {
  const feature = featureTitle(task.feature);
  const name = staffName(task.assignee);

  const card = (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart(e, task)}
      className={
        "rounded-lg border border-white/10 bg-black/20 p-3 space-y-2 hover:border-white/20 transition-colors text-left w-full " +
        (draggable ? "cursor-grab active:cursor-grabbing" : "")
      }
    >
      <p className="text-sm text-white leading-snug">{task.title}</p>
      {feature && (
        <Badge variant="outline" className="text-[10px]">
          {feature}
        </Badge>
      )}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {name && (
            <Avatar size="sm" className="size-5">
              <AvatarFallback className="text-[9px]">{staffInitials(task.assignee)}</AvatarFallback>
            </Avatar>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[10px] text-white/40">
              <CalendarClock className="size-3" />
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        {task.estimateHours && <span className="text-[10px] text-white/30">{task.estimateHours}h</span>}
      </div>
    </div>
  );

  if (!draggable) return card;

  return (
    <TaskDialog
      trigger={<button type="button">{card}</button>}
      task={task}
      defaultStatus={task.status}
      assignable={assignable}
      features={features}
      currentUserId={currentUserId}
      isStaff={isStaff}
    />
  );
}

export default function PortalProjectTasks({ loaderData }: Route.ComponentProps) {
  const { tasks, features } = loaderData;
  const { user, isStaffOnProject, project } = useOutletContext<ProjectWorkspaceContext>();
  const isStaff = user.role === "admin" || user.role === "manager";
  const reorderFetcher = useFetcher();
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);

  const team = project.team as ProjectStaffRef[];
  const pm = project.projectManager as ProjectStaffRef;
  const assignable = [...(pm && typeof pm === "object" ? [pm] : []), ...team].filter(
    (member, index, all) => all.findIndex((m) => m._id === member._id) === index,
  );

  const byColumn = new Map<TaskStatus, Task[]>();
  for (const col of COLUMNS) byColumn.set(col.status, []);
  for (const task of tasks) byColumn.get(task.status)?.push(task);
  for (const list of byColumn.values()) list.sort((a, b) => a.order - b.order);

  function handleDrop(targetStatus: TaskStatus) {
    if (!dragTaskId) return;
    const dragged = tasks.find((t) => t._id === dragTaskId);
    if (!dragged || dragged.status === targetStatus) {
      setDragTaskId(null);
      return;
    }

    // Append to the end of the target column and compact the source
    // column's remaining order values — see the route's doc comment on why
    // drag-and-drop here targets a column, not a precise in-column position.
    const targetList = (byColumn.get(targetStatus) ?? []).filter((t) => t._id !== dragTaskId);
    const sourceList = (byColumn.get(dragged.status) ?? []).filter((t) => t._id !== dragTaskId);

    const positions: ReorderTaskPosition[] = [
      ...targetList.map((t, i) => ({ id: t._id, status: targetStatus, order: i })),
      { id: dragTaskId, status: targetStatus, order: targetList.length },
      ...sourceList.map((t, i) => ({ id: t._id, status: dragged.status, order: i })),
    ];

    reorderFetcher.submit(
      { intent: "reorder", positions: JSON.stringify(positions) },
      { method: "post" },
    );
    setDragTaskId(null);
  }

  const hasAnyTasks = tasks.length > 0;

  return (
    <div>
      {isStaffOnProject && (
        <div className="mb-4 flex justify-end">
          <TaskDialog
            trigger={
              <Button size="sm">
                <Plus className="size-3.5" />
                New task
              </Button>
            }
            defaultStatus="backlog"
            assignable={assignable}
            features={features}
            currentUserId={user._id}
            isStaff={isStaff}
          />
        </div>
      )}

      {!hasAnyTasks ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <EmptyState
            icon={KanbanSquare}
            title="No tasks yet"
            description={
              isStaffOnProject
                ? "Break the work down into tasks to track it here."
                : "Your team hasn't added any tasks yet."
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {COLUMNS.map((col) => {
            const colTasks = byColumn.get(col.status) ?? [];
            return (
              <div
                key={col.status}
                onDragOver={(e) => isStaffOnProject && e.preventDefault()}
                onDrop={() => isStaffOnProject && handleDrop(col.status)}
                className="rounded-lg border border-white/10 bg-white/[0.02] p-3 min-h-[120px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-white/60 uppercase tracking-wide">{col.label}</p>
                  <span className="text-[10px] text-white/30">{colTasks.length}</span>
                </div>
                <div className="space-y-2">
                  {colTasks.map((task) => (
                    <div
                      key={task._id}
                      onDragEnd={() => setDragTaskId(null)}
                    >
                      <TaskCard
                        task={task}
                        draggable={isStaffOnProject}
                        onDragStart={(e, t) => {
                          setDragTaskId(t._id);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        assignable={assignable}
                        features={features}
                        currentUserId={user._id}
                        isStaff={isStaff}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
