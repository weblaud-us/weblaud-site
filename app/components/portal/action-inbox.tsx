import { Link, useFetcher } from "react-router";
import {
  AtSign,
  CheckCircle2,
  ClipboardCheck,
  FileSignature,
  GitPullRequestArrow,
  MessageCircleQuestion,
  ReceiptText,
  Tag,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { AttentionGroup, AttentionItem, PortalAttentionSummary } from "~/lib/types";
import { cn } from "~/lib/utils";

type GroupKey = Exclude<keyof PortalAttentionSummary, "total">;

/** Display order: things only the reader can unblock first, money next, staff work last. */
const GROUPS: { key: GroupKey; label: string; icon: LucideIcon; tone?: "warn" }[] = [
  { key: "contractsAwaitingSignature", label: "Contracts to sign", icon: FileSignature },
  { key: "pendingApprovals", label: "Approvals pending", icon: ClipboardCheck },
  { key: "changeRequestsAwaitingDecision", label: "Quotes to decide", icon: GitPullRequestArrow },
  { key: "overdueInvoices", label: "Invoices overdue", icon: TriangleAlert, tone: "warn" },
  { key: "unpaidInvoices", label: "Invoices to pay", icon: ReceiptText },
  { key: "unreadMentions", label: "Mentions", icon: AtSign },
  { key: "changeRequestsAwaitingQuote", label: "Requests to price", icon: Tag },
  { key: "openUpdateRequests", label: "Questions to answer", icon: MessageCircleQuestion },
  { key: "updatesPendingReview", label: "Updates to review", icon: ClipboardCheck },
];

function InboxItem({ item, isMention }: { item: AttentionItem; isMention: boolean }) {
  // The layout route owns the mark-read action; posting to /portal (no
  // ?index) targets it from anywhere in the portal.
  const fetcher = useFetcher();
  const markRead = () => {
    if (isMention) {
      fetcher.submit({ intent: "mark-read", id: item._id }, { method: "post", action: "/portal" });
    }
  };

  const text = (
    <>
      <span className="text-white/80">{item.title}</span>{" "}
      <span className="text-white/35">· {item.meta}</span>
    </>
  );

  return item.link ? (
    <Link
      to={item.link}
      onClick={markRead}
      className="block truncate rounded px-1 -mx-1 py-0.5 text-xs hover:bg-white/5 transition-colors"
    >
      {text}
    </Link>
  ) : (
    <p className="truncate py-0.5 text-xs">{text}</p>
  );
}

function Group({
  label,
  icon: Icon,
  group,
  tone,
  isMention,
}: {
  label: string;
  icon: LucideIcon;
  group: AttentionGroup;
  tone?: "warn";
  isMention: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3.5 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("size-4 shrink-0", tone === "warn" ? "text-amber-400" : "text-[#0A84FF]")} />
        <p className="text-sm font-medium text-white">
          {label}
          <span className="ml-1.5 text-white/40 font-normal">{group.count}</span>
        </p>
      </div>
      <div className="space-y-0.5">
        {group.items.map((item) => (
          <InboxItem key={item._id} item={item} isMention={isMention} />
        ))}
        {group.count > group.items.length && (
          <p className="pt-1 text-[11px] text-white/35">
            +{group.count - group.items.length} more
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * "Needs your input" — everything waiting on the reader, each item linking
 * straight to where it's acted on. Used on the portal dashboard (all
 * projects) and on a project's Overview (`compact`, one project).
 */
export function ActionInbox({
  summary,
  compact = false,
  title = "Needs your input",
}: {
  summary: PortalAttentionSummary;
  compact?: boolean;
  title?: string;
}) {
  const groups = GROUPS.filter(({ key }) => (summary[key]?.count ?? 0) > 0);

  if (groups.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-sm text-white/55",
          compact ? "p-4" : "mb-8 p-5",
        )}
      >
        <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
        You're all caught up.
      </div>
    );
  }

  return (
    <section
      aria-label={title}
      className={cn(
        "rounded-xl border border-[#0A84FF]/25 bg-[#0A84FF]/[0.06]",
        compact ? "p-4" : "mb-8 p-5",
      )}
    >
      <h2 className="text-sm font-medium text-white mb-3.5">
        {title}
        <span className="ml-2 inline-flex min-w-[20px] h-5 items-center justify-center rounded-full bg-[#0A84FF]/20 px-1.5 text-[11px] font-semibold text-[#0A84FF]">
          {summary.total}
        </span>
      </h2>
      <div className={cn("grid grid-cols-1 gap-3", !compact && "sm:grid-cols-2 lg:grid-cols-3")}>
        {groups.map(({ key, label, icon, tone }) => (
          <Group
            key={key}
            label={label}
            icon={icon}
            tone={tone}
            group={summary[key] as AttentionGroup}
            isMention={key === "unreadMentions"}
          />
        ))}
      </div>
    </section>
  );
}
