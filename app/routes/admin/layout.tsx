import { useEffect, useState } from "react";
import { Form, Link, Outlet, redirect, useLocation } from "react-router";
import type { Route } from "./+types/layout";
import { destroyAdminSession, requireAdminUser } from "~/lib/session.server";
import { Button } from "~/components/ui/button";
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Wrench,
  Users,
  Quote,
  HelpCircle,
  Briefcase,
  ClipboardList,
  Info,
  Calculator,
  Phone,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Building2,
  Users2,
  LayoutGrid,
  Settings,
  ChevronDown,
  FileSignature,
  Receipt,
  ClipboardCheck,
  Repeat,
  History,
  type LucideIcon,
  Gauge,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireAdminUser(request);
  return { user };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = await destroyAdminSession(request);
  throw redirect("/cpadmin/login", { headers: { "Set-Cookie": cookie } });
}

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ to: "/cpadmin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Content",
    items: [
      { to: "/cpadmin/projects", label: "Projects", icon: FolderKanban },
      { to: "/cpadmin/insights", label: "Insights", icon: Newspaper },
      { to: "/cpadmin/services", label: "Services", icon: Wrench },
      { to: "/cpadmin/careers", label: "Careers", icon: Briefcase },
      { to: "/cpadmin/team", label: "Team", icon: Users },
      { to: "/cpadmin/testimonials", label: "Testimonials", icon: Quote },
      { to: "/cpadmin/faqs", label: "FAQ", icon: HelpCircle },
    ],
  },
  {
    label: "Site settings",
    items: [
      { to: "/cpadmin/about", label: "About / Stats", icon: Info },
      { to: "/cpadmin/calculator-config", label: "Calculator", icon: Calculator },
      { to: "/cpadmin/contact-info", label: "Contact Info", icon: Phone },
    ],
  },
  {
    label: "Leads",
    items: [
      { to: "/cpadmin/contact-submissions", label: "Submissions", icon: Inbox },
      { to: "/cpadmin/estimate-submissions", label: "Estimates", icon: Calculator },
      { to: "/cpadmin/audit-submissions", label: "Website Audits", icon: Gauge },
      { to: "/cpadmin/applicants", label: "Applicants", icon: ClipboardList },
    ],
  },
  {
    label: "Client Portal",
    items: [
      { to: "/cpadmin/client-projects", label: "Client Projects", icon: LayoutGrid },
      { to: "/cpadmin/organizations", label: "Organizations", icon: Building2 },
      { to: "/cpadmin/people", label: "People", icon: Users2 },
      { to: "/cpadmin/contracts", label: "Contracts", icon: FileSignature },
      { to: "/cpadmin/invoices", label: "Invoices", icon: Receipt },
      { to: "/cpadmin/approvals", label: "Approvals", icon: ClipboardCheck },
      { to: "/cpadmin/change-requests", label: "Change Requests", icon: Repeat },
      { to: "/cpadmin/audit-log", label: "Audit Log", icon: History },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeItem =
    ALL_ITEMS.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    ) ?? ALL_ITEMS[0];

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

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
          <Link to="/cpadmin" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-[#0A84FF] text-xs font-bold text-white">
              W
            </div>
            <p className="font-semibold text-sm tracking-tight">Weblaud Admin</p>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-white/60 hover:text-white p-1.5 -mr-1.5"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.end
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors " +
                        (isActive
                          ? "bg-[#0A84FF]/15 text-white font-medium"
                          : "text-white/55 hover:bg-white/5 hover:text-white")
                      }
                    >
                      <Icon
                        className={
                          "size-4 shrink-0 " +
                          (isActive ? "text-[#0A84FF]" : "text-white/40")
                        }
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-white/55 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ExternalLink className="size-4 shrink-0 text-white/40" />
            View live site
          </a>
          <a
            href="/portal"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-white/55 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ExternalLink className="size-4 shrink-0 text-white/40" />
            Open client portal
          </a>
        </div>
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
            <p className="text-sm font-medium text-white/80 truncate">{activeItem.label}</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-white/5 transition-colors">
                  <div className="flex size-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-medium text-white/80">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <span className="text-xs text-white/50 hidden sm:inline">
                    {user.firstName} {user.lastName}
                  </span>
                  <ChevronDown className="size-3.5 text-white/30 hidden sm:inline" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/cpadmin/settings">
                    <Settings className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Form method="post">
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
