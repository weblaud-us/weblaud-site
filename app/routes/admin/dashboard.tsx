import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import { apiFetch, ApiError } from "~/lib/api.server";
import { callAdminApi } from "~/lib/session.server";
import type {
  AdminService,
  AgingBucket,
  AgingBucketLabel,
  AnalyticsOverview,
  ClientProjectStatus,
  HeardAbout,
  LeadsSummary,
  Paginated,
} from "~/lib/types";
import { HEARD_ABOUT_LABEL, LEAD_STAGES } from "~/lib/leads";
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
  Gauge,
  Phone,
  Briefcase,
  ClipboardList,
  ArrowRight,
  Wallet,
  TrendingUp,
  Receipt,
  FileSignature,
  ClipboardCheck,
  Repeat,
  MessageCircleQuestion,
  LayoutGrid,
  AlertTriangle,
  Tag,
} from "lucide-react";

async function safeCount(fn: () => Promise<number>) {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof ApiError) return 0;
    throw err;
  }
}

/**
 * Total + "new" counts for a paginated admin list, via the backend's
 * ?status= filter — two cheap limit=1 requests read off meta.total.
 * Previously pulled up to 200 rows and counted `status === "new"`
 * client-side, because the endpoints had no status filter; past 200 rows
 * that undercounted, and it undercounted in the direction that hides
 * exactly the leads you'd want to see (the newest, unread ones).
 */
async function safeStatusCounts(request: Request, path: string) {
  try {
    const [all, unread] = await Promise.all([
      callAdminApi(request, (accessToken) =>
        apiFetch<Paginated<unknown>>(`${path}?page=1&limit=1`, { accessToken }),
      ),
      callAdminApi(request, (accessToken) =>
        apiFetch<Paginated<unknown>>(`${path}?page=1&limit=1&status=new`, { accessToken }),
      ),
    ]);
    return { total: all.meta.total, unread: unread.meta.total };
  } catch (err) {
    if (err instanceof ApiError) return { total: 0, unread: 0 };
    throw err;
  }
}

const EMPTY_ANALYTICS: AnalyticsOverview = {
  revenue: { thisMonth: [], thisQuarter: [] },
  mrr: [],
  receivables: { outstanding: [], overdue: [], aging: [] },
  projects: {
    byStatus: { planning: 0, active: 0, on_hold: 0, completed: 0, cancelled: 0 },
    overBudget: [],
    overBudgetCount: 0,
    profitability: [],
  },
  actionRequired: {
    contractsAwaitingSignature: 0,
    invoicesOverdue: 0,
    pendingApprovals: 0,
    changeRequestsAwaitingQuote: 0,
    changeRequestsAwaitingDecision: 0,
    openUpdateRequests: 0,
  },
  generatedAt: new Date(0).toISOString(),
};

/** The owner dashboard must render even if analytics is down — a broken aggregation shouldn't take the whole panel with it. */
async function safeAnalytics(request: Request): Promise<AnalyticsOverview> {
  try {
    return await callAdminApi(request, (accessToken) =>
      apiFetch<AnalyticsOverview>("/analytics/overview", { accessToken }),
    );
  } catch (err) {
    if (err instanceof ApiError) return EMPTY_ANALYTICS;
    throw err;
  }
}

/** Same rule as safeAnalytics: a broken rollup must not take the panel down. */
async function safeLeadsSummary(request: Request): Promise<LeadsSummary | null> {
  try {
    return await callAdminApi(request, (accessToken) =>
      apiFetch<LeadsSummary>("/leads/admin/summary", { accessToken }),
    );
  } catch (err) {
    if (err instanceof ApiError) return null;
    throw err;
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const [
    leads,
    analytics,
    projects,
    insightsTotal,
    services,
    team,
    testimonialsTotal,
    submissions,
    estimates,
    audits,
    careers,
    applicants,
  ] = await Promise.all([
    safeLeadsSummary(request),
    safeAnalytics(request),
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
    safeStatusCounts(request, "/contact/admin"),
    safeStatusCounts(request, "/estimates/admin"),
    safeStatusCounts(request, "/audits/admin"),
    safeCount(async () =>
      (
        await callAdminApi(request, (accessToken) =>
          apiFetch<Paginated<unknown>>("/careers/admin?page=1&limit=1", { accessToken }),
        )
      ).meta.total,
    ),
    safeStatusCounts(request, "/careers/admin/applicants"),
  ]);

  return {
    leads,
    analytics,
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
      newAudits: audits.unread,
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
  { to: "/cpadmin/audit-submissions", label: "Website Audits", desc: "Leads from the free audit tool", icon: Gauge },
  { to: "/cpadmin/applicants", label: "Applicants", desc: "Applications from job posts", icon: ClipboardList },
];

const PROJECT_STATUS_LABEL: Record<ClientProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

const AGING_ORDER: AgingBucketLabel[] = ["current", "0-30", "31-60", "61-90", "90+"];

const AGING_LABEL: Record<AgingBucketLabel, string> = {
  current: "Not yet due",
  "0-30": "0–30 days overdue",
  "31-60": "31–60 days overdue",
  "61-90": "61–90 days overdue",
  "90+": "90+ days overdue",
};

// Status color, not categorical — severity of "how overdue", reserved from
// the accent hue. Rises from neutral (not yet due) through amber/orange to
// red at 90+, so the worst-aged money reads as the most alarming bar
// without needing a legend.
const AGING_BAR_COLOR: Record<AgingBucketLabel, string> = {
  current: "bg-white/25",
  "0-30": "bg-amber-400/80",
  "31-60": "bg-orange-400/80",
  "61-90": "bg-orange-500/85",
  "90+": "bg-red-500/85",
};

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-US")}`;
  }
}

/** Joins per-currency amounts into one display string — just "$12,450" in the common single-currency case, "$12,450 + €3,000" if the org bills in more than one. */
function formatCurrencyAmounts(amounts: { currency: string; amount: number }[]): string {
  if (amounts.length === 0) return "—";
  return amounts.map((a) => formatMoney(a.amount, a.currency)).join(" + ");
}

function groupAgingByCurrency(aging: AgingBucket[]): Map<string, AgingBucket[]> {
  const map = new Map<string, AgingBucket[]>();
  for (const row of aging) {
    const existing = map.get(row.currency);
    if (existing) existing.push(row);
    else map.set(row.currency, [row]);
  }
  return map;
}

function AgingBars({ aging }: { aging: AgingBucket[] }) {
  if (aging.length === 0) {
    return <p className="text-sm text-white/40">Nothing outstanding — every sent invoice is either paid or not yet due.</p>;
  }

  const byCurrency = groupAgingByCurrency(aging);

  return (
    <div className="space-y-5">
      {[...byCurrency.entries()].map(([currency, rows]) => {
        const byBucket = new Map(rows.map((r) => [r.bucket, r]));
        const max = Math.max(...rows.map((r) => r.amount), 1);

        return (
          <div key={currency} className="space-y-2.5">
            {AGING_ORDER.map((bucket) => {
              const row = byBucket.get(bucket);
              if (!row) return null;
              const widthPct = Math.max(3, Math.round((row.amount / max) * 100));
              return (
                <div key={bucket} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-xs text-white/50">{AGING_LABEL[bucket]}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${AGING_BAR_COLOR[bucket]}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right text-xs text-white/70 tabular-nums">
                    {formatMoney(row.amount, currency)}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Lead counts per pipeline stage, each tile linking to the contact list
 * filtered to that stage (estimates have the same filter on their page).
 */
function LeadPipelinePanel({ leads }: { leads: LeadsSummary }) {
  const open =
    leads.stages.new +
    leads.stages.contacted +
    leads.stages.call_booked +
    leads.stages.proposal_sent;
  const closed = leads.stages.won + leads.stages.lost;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-white">Sales pipeline</p>
        <span className="text-xs text-white/40 tabular-nums">
          {open} open
          {closed > 0 &&
            ` · ${Math.round((leads.stages.won / closed) * 100)}% win rate`}
        </span>
      </div>

      {leads.followUpsDue > 0 && (
        <Link
          to="/cpadmin/contact-submissions"
          className="mb-4 flex items-center gap-3 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2.5 hover:bg-amber-400/10 transition-colors"
        >
          <AlertTriangle className="size-4 text-amber-400 shrink-0" />
          <p className="flex-1 text-sm text-white/85">
            <span className="font-semibold tabular-nums">{leads.followUpsDue}</span>{" "}
            lead{leads.followUpsDue === 1 ? "" : "s"} waiting on a follow-up
          </p>
          <ArrowRight className="size-3.5 text-white/30" />
        </Link>
      )}

      <div className="grid grid-cols-3 gap-3">
        {LEAD_STAGES.map((stage) => (
          <Link
            key={stage.value}
            to={`/cpadmin/contact-submissions?stage=${stage.value}`}
            className="rounded-lg bg-black/20 px-3 py-2.5 hover:bg-black/30 transition-colors"
          >
            <p className="text-xl font-semibold text-white leading-none tabular-nums">
              {leads.stages[stage.value]}
            </p>
            <p className="text-xs text-white/45 mt-1.5">{stage.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Self-reported "How did you hear about us?" over the window, as a single-hue
 * bar list (magnitude only, so one colour). Direct-labelled with counts;
 * hovering a row shows its share.
 */
function LeadSourcesPanel({ sources }: { sources: LeadsSummary["sources"] }) {
  const rows = Object.entries(sources.heardAbout)
    .map(([key, count]) => ({
      key,
      label:
        key === "unknown"
          ? "Not answered"
          : (HEARD_ABOUT_LABEL[key as HeardAbout] ?? key),
      count,
    }))
    // "Not answered" last regardless of size — it's the absence of a signal.
    .sort((a, b) =>
      a.key === "unknown" ? 1 : b.key === "unknown" ? -1 : b.count - a.count,
    );
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-white">Where leads come from</p>
        <span className="text-xs text-white/40">
          Last {sources.windowDays} days · {sources.total} lead
          {sources.total === 1 ? "" : "s"}
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-white/40">
          No leads in this window yet. Each form asks "How did you hear about
          us?" — answers show up here.
        </p>
      ) : (
        <div className="space-y-2.5">
          {rows.map((row) => {
            const share = sources.total ? Math.round((row.count / sources.total) * 100) : 0;
            return (
              <div
                key={row.key}
                className="flex items-center gap-3"
                title={`${row.label}: ${row.count} (${share}%)`}
              >
                <span className="w-40 shrink-0 text-xs text-white/60 truncate">{row.label}</span>
                <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      row.key === "unknown" ? "bg-white/20" : "bg-[#0A84FF]/80"
                    }`}
                    style={{ width: `${Math.max(3, Math.round((row.count / max) * 100))}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs text-white/70 tabular-nums">
                  {row.count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {sources.utmSources.length > 0 && (
        <p className="mt-4 text-xs text-white/40">
          Top campaigns:{" "}
          {sources.utmSources.map((s) => `${s.source} (${s.count})`).join(", ")}
        </p>
      )}

      {/* Audit-tool funnel: runs that never turned into a lead. */}
      {!!sources.auditsRunUnclaimed && (
        <p className="mt-2 text-xs text-white/40">
          Plus {sources.auditsRunUnclaimed} website audit
          {sources.auditsRunUnclaimed === 1 ? "" : "s"} run without requesting
          the report.
        </p>
      )}
    </div>
  );
}

interface ActionItem {
  key: string;
  label: string;
  count: number;
  to?: string;
  icon: typeof FileSignature;
}

function ActionRequiredList({ items }: { items: ActionItem[] }) {
  const withCount = items.filter((item) => item.count > 0);

  if (withCount.length === 0) {
    return <p className="text-sm text-white/40">Nothing waiting on anyone right now.</p>;
  }

  return (
    <div className="space-y-1">
      {withCount.map((item) => {
        const Icon = item.icon;
        const content = (
          <div className="flex items-center gap-3 rounded-lg px-2.5 py-2 -mx-2.5 transition-colors group-hover:bg-white/[0.04]">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
              <Icon className="size-4" />
            </div>
            <p className="flex-1 text-sm text-white/80">{item.label}</p>
            <span className="text-sm font-semibold text-white tabular-nums">{item.count}</span>
            {item.to && <ArrowRight className="size-3.5 text-white/20 group-hover:text-white/50 transition-colors" />}
          </div>
        );

        if (item.to) {
          return (
            <Link key={item.key} to={item.to} className="group block">
              {content}
            </Link>
          );
        }
        return (
          <div key={item.key} className="group" title="No dedicated admin view yet — open the relevant project in Client Projects.">
            {content}
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
  const { stats, analytics, leads } = loaderData;

  const actionItems: ActionItem[] = [
    {
      key: "contracts",
      label: "Contracts awaiting signature",
      count: analytics.actionRequired.contractsAwaitingSignature,
      to: "/cpadmin/contracts",
      icon: FileSignature,
    },
    {
      key: "invoices",
      label: "Invoices overdue",
      count: analytics.actionRequired.invoicesOverdue,
      to: "/cpadmin/invoices",
      icon: Receipt,
    },
    {
      key: "approvals",
      label: "Approvals pending a client decision",
      count: analytics.actionRequired.pendingApprovals,
      icon: ClipboardCheck,
    },
    {
      key: "change-requests-quote",
      label: "Client-requested scope awaiting a price",
      count: analytics.actionRequired.changeRequestsAwaitingQuote,
      icon: Tag,
    },
    {
      key: "change-requests",
      label: "Change requests pending a client decision",
      count: analytics.actionRequired.changeRequestsAwaitingDecision,
      icon: Repeat,
    },
    {
      key: "update-requests",
      label: "Client update requests still open",
      count: analytics.actionRequired.openUpdateRequests,
      icon: MessageCircleQuestion,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-white/50 mt-1">
          Revenue, receivables and what's waiting on someone, plus everything live on weblaud.com.
        </p>
      </div>

      {/* ---------------- Agency OS ---------------- */}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <StatCard
          label="Revenue this month"
          value={formatCurrencyAmounts(analytics.revenue.thisMonth)}
          icon={Wallet}
        />
        <StatCard
          label="Revenue this quarter"
          value={formatCurrencyAmounts(analytics.revenue.thisQuarter)}
          icon={TrendingUp}
        />
        <StatCard label="MRR" value={formatCurrencyAmounts(analytics.mrr)} icon={Repeat} />
        <StatCard
          label="Outstanding"
          value={formatCurrencyAmounts(analytics.receivables.outstanding)}
          icon={Receipt}
        />
        <StatCard
          label="Overdue"
          value={formatCurrencyAmounts(analytics.receivables.overdue)}
          icon={AlertTriangle}
          accent={analytics.receivables.overdue.some((a) => a.amount > 0)}
        />
      </div>

      {leads && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <LeadPipelinePanel leads={leads} />
          <LeadSourcesPanel sources={leads.sources} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm font-medium text-white mb-4">Receivables aging</p>
          <AgingBars aging={analytics.receivables.aging} />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm font-medium text-white mb-4">Needs attention</p>
          <ActionRequiredList items={actionItems} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-white">Projects by status</p>
            <Link
              to="/cpadmin/client-projects"
              className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <LayoutGrid className="size-3.5" />
              View all
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(PROJECT_STATUS_LABEL) as ClientProjectStatus[]).map((status) => (
              <div key={status} className="rounded-lg bg-black/20 px-3 py-2.5">
                <p className="text-xl font-semibold text-white leading-none tabular-nums">
                  {analytics.projects.byStatus[status]}
                </p>
                <p className="text-xs text-white/45 mt-1.5">{PROJECT_STATUS_LABEL[status]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-white">Over budget</p>
            {analytics.projects.overBudgetCount > 10 && (
              <span className="text-xs text-white/40">
                Showing 10 of {analytics.projects.overBudgetCount}
              </span>
            )}
          </div>
          {analytics.projects.overBudget.length === 0 ? (
            <p className="text-sm text-white/40">No project has logged more labor than its budget covers.</p>
          ) : (
            <div className="space-y-1">
              {analytics.projects.overBudget.map((project) => (
                <Link
                  key={project._id}
                  to={`/cpadmin/client-projects/${project._id}/edit`}
                  className="flex items-center gap-3 rounded-lg px-2.5 py-2 -mx-2.5 hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{project.name}</p>
                    <p className="text-xs text-white/40 truncate">
                      {project.organizationName} &middot; {project.hoursLogged}h logged
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-red-400 tabular-nums shrink-0">
                    +{formatMoney(project.laborCost - project.budgetAmount, project.currency)}
                  </span>
                  <ArrowRight className="size-3.5 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mb-10">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-white">Profitability</p>
          <span className="text-xs text-white/40">Worst margin first</span>
        </div>
        <p className="text-xs text-white/30 mb-4">
          Based on logged hours &times; cost rate — reflects staff time entered in the Time tab, not
          fixed-bid subcontractor cost or tooling spend, so treat it as a proxy, not exact P&amp;L.
        </p>
        {analytics.projects.profitability.length === 0 ? (
          <p className="text-sm text-white/40">No time has been logged against any project yet.</p>
        ) : (
          <div className="space-y-1">
            {analytics.projects.profitability.map((project) => {
              const margin = project.budgetAmount - project.laborCost;
              const marginPct = project.budgetAmount > 0 ? (margin / project.budgetAmount) * 100 : 0;
              const marginColor =
                margin < 0 ? "text-red-400" : marginPct < 15 ? "text-amber-400" : "text-emerald-400";
              return (
                <Link
                  key={project._id}
                  to={`/cpadmin/client-projects/${project._id}/edit`}
                  className="flex items-center gap-3 rounded-lg px-2.5 py-2 -mx-2.5 hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{project.name}</p>
                    <p className="text-xs text-white/40 truncate">
                      {project.organizationName} &middot; {project.hoursLogged}h logged
                    </p>
                  </div>
                  <span className="text-xs text-white/50 tabular-nums shrink-0">
                    Budget {formatMoney(project.budgetAmount, project.currency)}
                  </span>
                  <span className="text-sm font-semibold text-white tabular-nums shrink-0">
                    Cost {project.laborCost.toLocaleString("en-US")}
                  </span>
                  <span className={`text-sm font-semibold tabular-nums shrink-0 ${marginColor}`}>
                    {margin >= 0 ? "+" : ""}
                    {formatMoney(margin, project.currency)} ({marginPct.toFixed(0)}%)
                  </span>
                  <ArrowRight className="size-3.5 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------------- Marketing CMS (demoted) ---------------- */}

      <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
        Site content
      </h2>
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
          label="New audit leads"
          value={stats.newAudits}
          icon={Gauge}
          to="/cpadmin/audit-submissions"
          accent={stats.newAudits > 0}
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
