import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type { AdminService, Paginated } from "~/lib/types";
import type { BackendProject } from "~/lib/adapters/project.server";
import { StatCard } from "~/components/admin/stat-card";
import {
  FolderKanban,
  Newspaper,
  Wrench,
  Users,
  Quote,
  Inbox,
  Info,
  Calculator,
  Phone,
  Briefcase,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

async function safeCount(fn: () => Promise<number>) {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ApiError) return 0;
    throw err;
  }
}

/** Total + unread counts for a paginated admin list that has no status filter. */
async function safeStatusCounts(request: Request, path: string) {
  try {
    const result = await callAdminApi(request, (accessToken) =>
      apiFetch<Paginated<{ status: string }>>(path, { accessToken }),
    );
    return {
      total: result.meta.total,
      unread: result.items.filter((item) => item.status === "new").length,
    };
  } catch (err) {
    if (err instanceof ApiError) return { total: 0, unread: 0 };
    throw err;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const [
    projects,
    insightsTotal,
    services,
    team,
    testimonialsTotal,
    submissions,
    estimates,
    careers,
    applicants,
  ] = await Promise.all([
      safeCount(async () => (await apiFetch<BackendProject[]>("/projects")).length),
      safeCount(async () =>
        (
          await callAdminApi(request, (accessToken) =>
            apiFetch<Paginated<unknown>>("/insights/admin?page=1&limit=1", { accessToken }),
          )
        ).meta.total,
      ),
      safeCount(async () => (await apiFetch<AdminService[]>("/services")).length),
      safeCount(async () =>
        (
          await callAdminApi(request, (accessToken) =>
            apiFetch<unknown[]>("/team/admin", { accessToken }),
          )
        ).length,
      ),
      safeCount(async () =>
        (
          await callAdminApi(request, (accessToken) =>
            apiFetch<Paginated<unknown>>("/testimonials/admin?page=1&limit=1", { accessToken }),
          )
        ).meta.total,
      ),
      // The backend's /contact/admin endpoint has no status filter, so pull a
      // page large enough to cover the common case and derive both counts
      // from it rather than guessing at unsupported query params.
      safeStatusCounts(request, "/contact/admin?page=1&limit=200"),
      // Same shape for /estimates/admin.
      safeStatusCounts(request, "/estimates/admin?page=1&limit=200"),
      safeCount(async () =>
        (
          await callAdminApi(request, (accessToken) =>
            apiFetch<Paginated<unknown>>("/careers/admin?page=1&limit=1", { accessToken }),
          )
        ).meta.total,
      ),
      // The applicant listing has no status filter either, so derive the "new"
      // count the same way as contact submissions.
      safeStatusCounts(request, "/careers/admin/applicants?page=1&limit=200"),
    ]);

  return {
    stats: {
      projects,
      insights: insightsTotal,
      services,
      team,
      testimonials: testimonialsTotal,
      submissions: submissions.total,
      newSubmissions: submissions.unread,
      estimates: estimates.total,
      newEstimates: estimates.unread,
      careers,
      newApplicants: applicants.unread,
    },
  };
}

const SECTIONS = [
  { to: "/cpadmin/projects", label: "Projects", desc: "Case studies shown on /projects", icon: FolderKanban },
  { to: "/cpadmin/insights", label: "Insights", desc: "Blog articles shown on /insights", icon: Newspaper },
  { to: "/cpadmin/services", label: "Services", desc: "Service cards on /services", icon: Wrench },
  { to: "/cpadmin/careers", label: "Careers", desc: "Job posts shown on /career", icon: Briefcase },
  { to: "/cpadmin/team", label: "Team", desc: "Team grid on /aboutus", icon: Users },
  { to: "/cpadmin/testimonials", label: "Testimonials", desc: "Quotes on the home page", icon: Quote },
  { to: "/cpadmin/about", label: "About / Stats", desc: "Story, mission, stats, track record", icon: Info },
  { to: "/cpadmin/calculator-config", label: "Calculator", desc: "Pricing rates on /calculator", icon: Calculator },
  { to: "/cpadmin/contact-info", label: "Contact Info", desc: "Address, email, phone", icon: Phone },
  { to: "/cpadmin/contact-submissions", label: "Contact Submissions", desc: "Leads from the contact form", icon: Inbox },
  { to: "/cpadmin/estimate-submissions", label: "Estimate Submissions", desc: "Leads from the cost estimator", icon: Calculator },
  { to: "/cpadmin/applicants", label: "Applicants", desc: "Applications from job posts", icon: ClipboardList },
];

export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
  const { stats } = loaderData;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-white/50 mt-1">
          A snapshot of everything live on weblaud.com.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
        <StatCard label="Projects" value={stats.projects} icon={FolderKanban} to="/cpadmin/projects" />
        <StatCard label="Insights" value={stats.insights} icon={Newspaper} to="/cpadmin/insights" />
        <StatCard label="Services" value={stats.services} icon={Wrench} to="/cpadmin/services" />
        <StatCard label="Open positions" value={stats.careers} icon={Briefcase} to="/cpadmin/careers" />
        <StatCard label="Team members" value={stats.team} icon={Users} to="/cpadmin/team" />
        <StatCard label="Testimonials" value={stats.testimonials} icon={Quote} to="/cpadmin/testimonials" />
        <StatCard
          label="New submissions"
          value={stats.newSubmissions}
          icon={Inbox}
          to="/cpadmin/contact-submissions"
          accent={stats.newSubmissions > 0}
        />
        <StatCard
          label="New estimates"
          value={stats.newEstimates}
          icon={Calculator}
          to="/cpadmin/estimate-submissions"
          accent={stats.newEstimates > 0}
        />
        <StatCard
          label="New applicants"
          value={stats.newApplicants}
          icon={ClipboardList}
          to="/cpadmin/applicants"
          accent={stats.newApplicants > 0}
        />
      </div>

      <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
        Manage content
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.to}
              to={section.to}
              className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-white/20 hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/60 group-hover:text-[#0A84FF] transition-colors">
                <Icon className="size-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-white">{section.label}</p>
                <p className="text-white/45 text-xs mt-0.5">{section.desc}</p>
              </div>
              <ArrowRight className="size-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
