import { useEffect, useRef, useState } from "react";
import { Form, Link, Outlet, redirect, useFetcher, useLocation, useRevalidator } from "react-router";
import type { Route } from "./+types/layout";
import { destroyPortalSession, requirePortalUser, callPortalApi } from "~/lib/portal.server";
import { ApiError, apiFetch } from "~/lib/api.server";
import type { PortalAttentionSummary, PortalNotification } from "~/lib/types";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  ChevronDown,
  ClipboardCheck,
  Wallet,
} from "lucide-react";
import { cn } from "~/lib/utils";
import weblaudLogo from "~/assets/weblaud-logo.svg";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requirePortalUser(request);

  const [notifications, attention] = await Promise.all([
    callPortalApi(request, (accessToken) =>
      apiFetch<PortalNotification[]>("/portal/notifications", { accessToken }),
    ),
    // Badge counts only — a failure here must never take down every portal page.
    callPortalApi(request, (accessToken) =>
      apiFetch<PortalAttentionSummary>("/portal/dashboard/attention", { accessToken }),
    ).catch((err) => {
      if (err instanceof ApiError) return null;
      throw err;
    }),
  ]);

  return {
    user,
    notifications,
    // The review queue is one of the staff groups in the same summary.
    reviewQueueCount: attention?.updatesPendingReview?.count ?? 0,
    attentionTotal: attention?.total ?? 0,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));

  if (intent === "logout") {
    const cookie = await destroyPortalSession(request);
    throw redirect("/portal/login", { headers: { "Set-Cookie": cookie } });
  }

  if (intent === "mark-read") {
    const id = String(formData.get("id"));
    await callPortalApi(request, (accessToken) =>
      apiFetch(`/portal/notifications/${id}/read`, { method: "PATCH", accessToken }),
    );
    return { ok: true };
  }

  if (intent === "mark-all-read") {
    await callPortalApi(request, (accessToken) =>
      apiFetch("/portal/notifications/read-all", { method: "PATCH", accessToken }),
    );
    return { ok: true };
  }

  return { error: "Unknown action." };
}

function CountPill({ count, label }: { count: number; label: string }) {
  return (
    <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#0A84FF]/20 text-[#0A84FF] text-[10px] font-semibold">
      <span aria-hidden="true">{count > 99 ? "99+" : count}</span>
      <span className="sr-only">, {label}</span>
    </span>
  );
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

/** "Client · Acme Inc" or "Project Manager" — shown under the user's name in the header. */
function roleLabel(user: Route.ComponentProps["loaderData"]["user"]) {
  if (user.role === "admin") return "Agency admin";
  if (user.role === "manager") return "Agency staff";
  const org = typeof user.organization === "object" ? user.organization?.name : undefined;
  return org ? `Client · ${org}` : "Client";
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function NotificationsBell({ notifications }: { notifications: PortalNotification[] }) {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllFetcher = useFetcher();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative text-white/70 hover:text-white p-1.5 rounded-md hover:bg-white/5 transition-colors" aria-label="Notifications">
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex size-3.5 items-center justify-center rounded-full bg-[#0A84FF] text-[9px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-xs font-medium text-white/60">Notifications</span>
          {unreadCount > 0 && (
            <markAllFetcher.Form method="post">
              <input type="hidden" name="intent" value="mark-all-read" />
              <button type="submit" className="text-xs text-[#0A84FF] hover:underline">
                Mark all read
              </button>
            </markAllFetcher.Form>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="px-2 py-4 text-xs text-white/40 text-center">You're all caught up.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 15).map((n) => (
              <NotificationRow key={n._id} notification={n} />
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationRow({ notification }: { notification: PortalNotification }) {
  const fetcher = useFetcher();

  const content = (
    <div
      className={cn(
        "px-3 py-2.5 text-sm transition-colors",
        notification.read ? "text-white/50" : "text-white bg-white/[0.03]",
      )}
    >
      <p className="font-medium leading-snug">{notification.title}</p>
      {notification.body && <p className="text-xs text-white/40 mt-0.5 line-clamp-2">{notification.body}</p>}
      <p className="text-[10px] text-white/30 mt-1">{timeAgo(notification.createdAt)}</p>
    </div>
  );

  const markRead = () => {
    if (!notification.read) {
      fetcher.submit({ intent: "mark-read", id: notification._id }, { method: "post" });
    }
  };

  if (notification.link) {
    return (
      <Link to={notification.link} onClick={markRead} className="block hover:bg-white/5">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={markRead} className="block w-full text-left hover:bg-white/5">
      {content}
    </button>
  );
}

/**
 * Every navigation already re-runs the layout loader (fresh notifications +
 * review-queue count), but a user who stays on one tab for a while never
 * navigates — so the bell can go stale. This polls the cheap /count endpoint
 * on an interval and only pays for a full revalidation (re-fetching all 100
 * rows + the review queue) when the number actually changed.
 */
function useNotificationPolling(currentUnread: number) {
  const revalidator = useRevalidator();
  const countFetcher = useFetcher<{ unread: number }>();
  const knownUnread = useRef(currentUnread);

  useEffect(() => {
    knownUnread.current = currentUnread;
  }, [currentUnread]);

  useEffect(() => {
    const interval = setInterval(() => {
      countFetcher.load("/portal/notifications/count");
    }, 30_000);
    return () => clearInterval(interval);
    // countFetcher is stable across renders per React Router's contract —
    // intentionally omitted so this doesn't restart the interval on load().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countFetcher.data && countFetcher.data.unread !== knownUnread.current) {
      revalidator.revalidate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countFetcher.data]);
}

export default function PortalLayout({ loaderData }: Route.ComponentProps) {
  const { user, notifications, reviewQueueCount, attentionTotal } = loaderData;
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isStaff = user.role === "admin" || user.role === "manager";

  useNotificationPolling(notifications.filter((n) => !n.read).length);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const isDashboardActive = location.pathname === "/portal";
  const isReviewQueueActive = location.pathname === "/portal/review-queue";
  const isBillingActive = location.pathname === "/portal/billing";

  return (
    <div className="dark min-h-screen bg-black text-white flex font-sans">
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      <aside
        className={
          "w-60 shrink-0 border-r border-white/10 flex flex-col bg-black fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:static md:translate-x-0 " +
          (isSidebarOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/portal" className="flex items-center gap-2" aria-label="Weblaud Portal home">
            <img src={weblaudLogo} alt="" className="h-6 w-auto" />
            <span className="rounded border border-white/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/60">
              Portal
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-white/60 hover:text-white p-1.5 -mr-1.5"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <Link
            to="/portal"
            className={
              "flex items-center justify-between gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors " +
              (isDashboardActive
                ? "bg-[#0A84FF]/15 text-white font-medium"
                : "text-white/55 hover:bg-white/5 hover:text-white")
            }
          >
            <span className="flex items-center gap-2.5">
              <LayoutDashboard
                className={"size-4 shrink-0 " + (isDashboardActive ? "text-[#0A84FF]" : "text-white/40")}
              />
              Projects
            </span>
            {attentionTotal > 0 && (
              <CountPill count={attentionTotal} label={`${attentionTotal} item${attentionTotal === 1 ? "" : "s"} need your input`} />
            )}
          </Link>

          <Link
            to="/portal/billing"
            className={
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors " +
              (isBillingActive
                ? "bg-[#0A84FF]/15 text-white font-medium"
                : "text-white/55 hover:bg-white/5 hover:text-white")
            }
          >
            <Wallet className={"size-4 shrink-0 " + (isBillingActive ? "text-[#0A84FF]" : "text-white/40")} />
            Billing
          </Link>

          {isStaff && (
            <Link
              to="/portal/review-queue"
              className={
                "flex items-center justify-between gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors " +
                (isReviewQueueActive
                  ? "bg-[#0A84FF]/15 text-white font-medium"
                  : "text-white/55 hover:bg-white/5 hover:text-white")
              }
            >
              <span className="flex items-center gap-2.5">
                <ClipboardCheck
                  className={"size-4 shrink-0 " + (isReviewQueueActive ? "text-[#0A84FF]" : "text-white/40")}
                />
                Review queue
              </span>
              {reviewQueueCount > 0 && (
                <CountPill count={reviewQueueCount} label={`${reviewQueueCount} waiting for review`} />
              )}
            </Link>
          )}
        </nav>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 shrink-0 border-b border-white/10 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-white/70 hover:text-white p-1.5 -ml-1.5 shrink-0"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <NotificationsBell notifications={notifications} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-white/5 transition-colors">
                  <div className="flex size-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-medium text-white/80">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs text-white/80 leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-white/40 leading-none mt-0.5">{roleLabel(user)}</p>
                  </div>
                  <ChevronDown className="size-3.5 text-white/30 hidden sm:inline" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/portal/settings">
                    <Settings className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Form method="post">
                  <input type="hidden" name="intent" value="logout" />
                  <DropdownMenuItem asChild>
                    <button type="submit" className="w-full">
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </DropdownMenuItem>
                </Form>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
