import { useOutletContext } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { apiFetch, ApiError, resolveMediaUrl } from "~/lib/api.server";
import { callPortalApi, requirePortalUser } from "~/lib/portal.server";
import type { ProjectActivityItem } from "~/lib/types";
import type { ProjectWorkspaceContext } from "./projects.$id";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  ClipboardCheck,
  FileText,
  FolderOpen,
  History,
  Megaphone,
  MessageCircle,
  ReceiptText,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { LocalTime } from "~/components/ui/local-time";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requirePortalUser(request);
  const items = await callPortalApi(request, (accessToken) =>
    apiFetch<ProjectActivityItem[]>(`/portal/projects/${params.id}/activity`, {
      accessToken,
    }),
  ).catch((err) => {
    if (err instanceof ApiError) return [];
    throw err;
  });
  // Resolved here, not in the component — resolveMediaUrl lives in
  // api.server.ts, and calling it from the component body pulls that
  // server-only module into the client bundle (see admin/settings.tsx's
  // loader for the same fix).
  const activity = items.map((item) =>
    item.actor
      ? {
          ...item,
          actor: {
            ...item.actor,
            avatar: item.actor.avatar
              ? resolveMediaUrl(item.actor.avatar)
              : item.actor.avatar,
          },
        }
      : item,
  );
  return { activity };
}

const ACTIVITY_CONFIG: Record<
  ProjectActivityItem["type"],
  { icon: LucideIcon; color: string; label: string }
> = {
  update_published: {
    icon: Megaphone,
    color: "text-blue-400",
    label: "Update published",
  },
  file_shared: {
    icon: FolderOpen,
    color: "text-emerald-400",
    label: "File shared",
  },
  approval_decided: {
    icon: ClipboardCheck,
    color: "text-violet-400",
    label: "Approval decided",
  },
  invoice_paid: {
    icon: ReceiptText,
    color: "text-amber-400",
    label: "Invoice paid",
  },
  comment_posted: {
    icon: MessageCircle,
    color: "text-cyan-400",
    label: "Comment posted",
  },
  contract_signed: {
    icon: FileText,
    color: "text-pink-400",
    label: "Contract signed",
  },
  change_request_approved: {
    icon: Scale,
    color: "text-orange-400",
    label: "Change approved",
  },
};

function getActivityConfig(type: string) {
  return (
    ACTIVITY_CONFIG[type as keyof typeof ACTIVITY_CONFIG] ?? {
      icon: History,
      color: "text-white/40",
      label: "Activity",
    }
  );
}

function groupByDate(
  items: ProjectActivityItem[],
): Map<string, ProjectActivityItem[]> {
  const groups = new Map<string, ProjectActivityItem[]>();
  for (const item of items) {
    const dateKey = new Date(item.at).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const existing = groups.get(dateKey) ?? [];
    existing.push(item);
    groups.set(dateKey, existing);
  }
  return groups;
}

function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return "";
}

export default function PortalProjectActivity({
  loaderData,
}: {
  loaderData: { activity: ProjectActivityItem[] };
}) {
  const { activity } = loaderData;
  const { project } = useOutletContext<ProjectWorkspaceContext>();
  const grouped = groupByDate(activity);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white tracking-tight">
          Activity Timeline
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Everything that has happened on{" "}
          <span className="text-white/60">{project.name}</span>, in
          chronological order.
        </p>
      </div>

      {activity.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] py-16 text-center">
          <History className="size-10 mx-auto text-white/10 mb-3" />
          <p className="text-sm text-white/40 font-medium">No activity yet</p>
          <p className="text-xs text-white/25 mt-1">
            Updates, files, approvals, and discussions will appear here as they
            happen.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div
            className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10"
            aria-hidden="true"
          />

          {Array.from(grouped.entries()).map(([dateKey, items], groupIndex) => {
            const relative = formatRelativeDate(items[0].at);

            return (
              <div key={dateKey} className={groupIndex > 0 ? "mt-8" : ""}>
                <div className="relative flex items-center gap-3 mb-4 z-10">
                  <div className="flex items-center justify-center size-[31px] rounded-full bg-[#0a0a0b] border border-white/10 shrink-0">
                    <span className="text-[10px] font-bold text-white/40">
                      {new Date(items[0].at).getDate()}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-medium text-white/70">
                      {dateKey}
                    </h3>
                    {relative && (
                      <span className="text-[11px] text-white/30">
                        {relative}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 ml-[15px] pl-5 border-l border-transparent">
                  {items.map((item) => {
                    const config = getActivityConfig(item.type);
                    const Icon = config.icon;
                    const actorAvatar = item.actor?.avatar || undefined;
                    const actorInitials = item.actor
                      ? `${item.actor.firstName?.[0] ?? ""}${item.actor.lastName?.[0] ?? ""}`.toUpperCase()
                      : null;

                    return (
                      <a
                        key={item._id}
                        href={item.link}
                        className="group flex items-start gap-3 rounded-lg px-3 py-2.5 -mx-3 hover:bg-white/[0.03] transition-colors"
                      >
                        <div
                          className={`flex items-center justify-center size-[31px] rounded-full bg-[#0a0a0b] border border-white/10 shrink-0 -ml-5 ${config.color}`}
                        >
                          <Icon className="size-3.5" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-medium uppercase tracking-wide text-white/30">
                              {config.label}
                            </span>
                            <span className="text-[11px] text-white/20">
                              <LocalTime value={item.at} withTime />
                            </span>
                          </div>
                          <p className="text-sm text-white/80 mt-0.5 group-hover:text-white transition-colors truncate">
                            {item.title}
                          </p>
                          {item.excerpt && (
                            <p className="text-xs text-white/40 mt-1 line-clamp-2">
                              {item.excerpt}
                            </p>
                          )}
                        </div>

                        {item.actor && (
                          <div
                            className="shrink-0 pt-0.5"
                            title={
                              item.actor.firstName + " " + item.actor.lastName
                            }
                          >
                            <Avatar size="sm" className="size-6">
                              {actorAvatar && (
                                <AvatarImage src={actorAvatar} alt="" />
                              )}
                              <AvatarFallback className="text-[9px]">
                                {actorInitials ?? "?"}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
