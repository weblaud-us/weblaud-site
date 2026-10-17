// Frontend-facing content shapes. Kept separate from app/data/*.ts (which stay
// in place as a fallback reference) so the API integration doesn't touch them.

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  problem: string;
  solution: string;
  techStack: string[];
  businessImpact: string;
  /** Extra screenshots for the case study page (backend `detailImages`). */
  detailImages: string[];
}

// ---------------------------------------------------------------------------
// Admin CMS shapes — these mirror the backend Mongo documents directly
// (fields as the API returns them) rather than the frontend-facing shapes
// above, since the admin panel reads and writes raw backend records.
// ---------------------------------------------------------------------------

export interface Paginated<T> {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export const INSIGHT_CATEGORIES = [
  "Engineering",
  "Architecture",
  "AI & ML",
  "Operations",
] as const;
export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

export interface InsightAuthor {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface InsightContentSection {
  heading: string;
  text: string;
}

export interface Insight {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  category: InsightCategory;
  readTime: string;
  publishedAt: string;
  author: InsightAuthor;
  directAnswer: string;
  keyTakeaways: string[];
  content: InsightContentSection[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  _id: string;
  slug: string;
  title: string;
  /** Openings label, e.g. "2 positions". */
  position: string;
  summary: string;
  department: string;
  location: string;
  jobType: string;
  experience: string;
  salaryRange: string;
  deadline?: string;
  responsibilities: string[];
  requirements: string[];
  /** Long-form "About the role" copy. */
  jobDetails: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;

export const APPLICATION_STATUSES = [
  "new",
  "review",
  "shortlisted",
  "rejected",
  "hired",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface JobApplication {
  _id: string;
  /** Populated by the backend; null once the referenced job is deleted. */
  careerId: { _id: string; title: string; position: string } | null;
  name: string;
  email: string;
  phone: string;
  interestReason?: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface AdminService {
  _id: string;
  title: string;
  description: string;
  image?: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberSocial {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  [key: string]: string | undefined;
}

export interface TeamMember {
  _id: string;
  name: string;
  title: string;
  avatar?: string;
  social: TeamMemberSocial;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  isActive: boolean;
  createdAt: string;
}

export interface TrackRecordItem {
  title: string;
  subtitle: string;
  description?: string;
}

export interface AboutStats {
  clients: number;
  projects: number;
  successRate: number;
  followers: number;
  experienceYears: number;
}

export interface AboutInfo {
  isActive: boolean;
  story?: string;
  mission?: string;
  vision?: string;
  stats: AboutStats;
  trackRecord: TrackRecordItem[];
}

export interface RateOption {
  id: string;
  title: string;
  desc: string;
  weeks: number;
  costMultiplier: number;
}

export interface TimelineSpeed {
  id: string;
  label: string;
  multiplier: number;
  desc?: string;
  weeksOffset?: number;
}

export interface CalculatorConfig {
  baseCost: number;
  /** Upper bound of the quoted range: max = min * (1 + rangeSpreadPct). */
  rangeSpreadPct: number;
  /** Both ends of the range snap to this increment, e.g. 500 -> $12,500. */
  roundToNearest: number;
  projectTypes: RateOption[];
  features: RateOption[];
  timelineSpeeds: TimelineSpeed[];
}

/**
 * Sales-pipeline stage shared by contact and estimate leads. Separate from a
 * lead's inbox `status` (new/read/spam). Labels live in app/lib/leads.ts;
 * backend source of truth is backend/src/modules/leads/lead.constants.ts.
 */
export type LeadStage =
  | "new"
  | "contacted"
  | "call_booked"
  | "proposal_sent"
  | "won"
  | "lost";

/** Self-reported "How did you hear about us?" answer. */
export type HeardAbout =
  | "google"
  | "ai_assistant"
  | "clutch"
  | "linkedin"
  | "referral"
  | "other";

/** Optional contact-form qualifiers. Labels and option order live in app/lib/leads.ts. */
export type BudgetBand = "under_5k" | "5k_10k" | "10k_20k" | "20k_plus" | "not_sure";
export type LeadTimeline = "asap" | "1_3_months" | "3_6_months" | "exploring";

/** First-touch marketing source, captured by app/lib/attribution.ts. */
export interface LeadAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  landingPath?: string;
}

/** Pipeline + source fields every lead record carries. */
export interface LeadPipelineFields {
  /** Missing on leads created before the pipeline existed — treat as "new". */
  stage?: LeadStage;
  internalNotes?: string;
  nextFollowUpAt?: string;
  lostReason?: string;
  attribution?: LeadAttribution;
  heardAbout?: HeardAbout;
  /** When the automatic reply/estimate email went out to the lead. */
  autoReplySentAt?: string;
}

/** GET /leads/admin/summary — contact (spam excluded) + estimate leads. */
export interface LeadsSummary {
  stages: Record<LeadStage, number>;
  /** Same definition as the daily follow-up email. */
  followUpsDue: number;
  sources: {
    windowDays: number;
    total: number;
    /** HeardAbout values plus "unknown" (skipped / pre-dates the question). */
    heardAbout: Record<string, number>;
    utmSources: { source: string; count: number }[];
    /** Website audits run in the window whose report nobody claimed. */
    auditsRunUnclaimed?: number;
  };
}

/** Lighthouse category scores, 0–100. */
export interface AuditScores {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}

export interface AuditVitals {
  lcpMs?: number;
  cls?: number;
  tbtMs?: number;
  fcpMs?: number;
}

export type AuditStrategy = "mobile" | "desktop";

/** GET /audits/:id — what the public /audit page may see while polling. */
export interface AuditPublicResult {
  id: string;
  runStatus: "running" | "done" | "failed";
  /** "quota" | "unreachable" | "timeout" | "api" */
  failureReason?: string;
  url: string;
  host: string;
  strategy: AuditStrategy;
  scores?: AuditScores;
  vitals?: AuditVitals;
  issueCount: number;
  claimed: boolean;
}

/** A claimed website audit, as listed in /cpadmin/audit-submissions. */
export interface AuditSubmission extends LeadPipelineFields {
  _id: string;
  url: string;
  host: string;
  strategy: AuditStrategy;
  scores?: AuditScores;
  vitals?: AuditVitals;
  issues: {
    id: string;
    title: string;
    displayValue?: string;
    savingsMs?: number;
    category: string;
  }[];
  name: string;
  email: string;
  company?: string;
  status: string;
  createdAt: string;
  claimedAt?: string;
}

export interface EstimateSubmission extends LeadPipelineFields {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
  selection: {
    projectTypeId: string;
    projectTypeTitle: string;
    featureIds: string[];
    featureTitles: string[];
    speedId: string;
    speedLabel: string;
  };
  result: {
    totalWeeks: number;
    costMin: number;
    costMax: number;
  };
  status: string;
  createdAt: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Intent landing pages — the data-driven GEO content system.
// One LandingPageConfig describes a single high-intent query page (a /vs/*
// comparison, a /solutions/* use-case page, or a standalone hub/guide). A shared
// template (components/landing/IntentLandingPage) renders it and a shared helper
// (lib/landing-schema) builds its meta + JSON-LD, so every page stays consistent
// and every factual figure derives from lib/constants.
// ---------------------------------------------------------------------------

export type LandingGroup = "vs" | "solutions";

export interface LandingMatrixRow {
  feature: string;
  /** The Weblaud column value (rendered as the winning/highlighted cell). */
  weblaud: string;
  /** The alternative column value (in-house, freelancer, no-code, etc.). */
  other: string;
}

export interface LandingFaq {
  question: string;
  answer: string;
}

export interface LandingFeatureCard {
  title: string;
  body: string;
}

export interface LandingPageConfig {
  /** URL slug, e.g. "offshore-developers" or "saas-mvp". */
  slug: string;
  /** Full absolute path, e.g. "/vs/offshore-developers". */
  path: string;
  badge: string;
  h1: string;
  subhead: string;
  metaTitle: string;
  metaDescription: string;
  /** The quotable "direct answer" paragraph engineered for RAG citation. */
  ragHeading: string;
  ragAnswer: string;
  /** Optional comparison matrix (used by /vs/* pages). */
  matrixTitle?: string;
  matrixColumns?: { weblaud: string; other: string };
  matrixRows?: LandingMatrixRow[];
  /** Optional highlight cards (used by /solutions/* and some /vs/* pages). */
  cardsTitle?: string;
  featureCards?: LandingFeatureCard[];
  /** Optional inline CTA button rendered above the RAG box (e.g. cost -> calculator). */
  ctaLink?: { label: string; to: string };
  faqs: LandingFaq[];
  breadcrumbName: string;
  /** Plain-text answer embedded in the Article JSON-LD articleBody. */
  articleBody: string;
  /** schema.org article type; defaults to "TechArticle". */
  articleType?: "TechArticle" | "Article";
}

/** "spam": caught by the backend content filter — kept for review, never emailed. */
export type ContactSubmissionStatus = "new" | "read" | "spam";

export interface ContactSubmission extends LeadPipelineFields {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  budget?: BudgetBand;
  timeline?: LeadTimeline;
  status: ContactSubmissionStatus;
  /** Why the backend filed it as spam, e.g. "3 links in message". */
  spamReason?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Client portal / agency OS — the project-management dashboard clients and
// staff log into. See backend/src/modules/{organization,client-project}.
// ---------------------------------------------------------------------------

export type PlatformRole = "admin" | "manager" | "editor" | "user";
export type OrgRole = "client_admin" | "client_viewer";

export interface Organization {
  _id: string;
  name: string;
  logo?: string;
  billingEmail: string;
  address?: string;
  taxId?: string;
  defaultCurrency: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

/** Per-user opt-outs for the transactional emails NotificationService sends alongside in-app notifications. All default true. */
export interface EmailPreferences {
  contracts: boolean;
  invoices: boolean;
  approvals: boolean;
  changeRequests: boolean;
  updates: boolean;
  mentions: boolean;
  /** The Monday summary email of each project's week. */
  digest: boolean;
}

/** A user as returned by GET /users/me and populate() on PM/team fields. */
export interface PortalUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: PlatformRole;
  isActive: boolean;
  organization?: string | Organization;
  orgRole?: OrgRole;
  avatar?: string;
  title?: string;
  phone?: string;
  emailPreferences?: EmailPreferences;
}

export type ClientProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type FeatureStatus = "planned" | "in_progress" | "done";
export type MilestoneStatus = "pending" | "in_progress" | "done";

export interface ProjectBudget {
  amount: number;
  currency: string;
  spent: number;
}

/**
 * Its own collection now (GET/PUT /portal/projects/:id/features), not a
 * subdocument on ClientProject — see backend/src/modules/feature. `order`
 * drives display order; the editor renders rows in array order and PUTs the
 * whole list back, and the backend derives `order` from each row's index.
 */
export interface Feature {
  _id: string;
  project: string;
  title: string;
  description?: string;
  status: FeatureStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMilestone {
  _id: string;
  title: string;
  dueDate?: string;
  status: MilestoneStatus;
  completedAt?: string;
}

export interface ProjectTimeline {
  startDate?: string;
  endDate?: string;
  milestones: ProjectMilestone[];
}

/** Staff summary as populated onto projectManager/team — a subset of PortalUser. */
export interface ProjectStaffRef {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  title?: string;
  role: PlatformRole;
}

export interface ClientProject {
  _id: string;
  name: string;
  description?: string;
  status: ClientProjectStatus;
  organization: Organization | string;
  projectManager: ProjectStaffRef | string;
  team: ProjectStaffRef[] | string[];
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  /** Derived by TaskService from the task board (estimate-weighted done/total) — no longer hand-entered. See the backend schema comment on ClientProject.progress. */
  progress: number;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Task board (Phase 6). See backend/src/modules/task.
// ---------------------------------------------------------------------------

export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";

export interface Task {
  _id: string;
  project: string;
  feature?: { _id: string; title: string } | string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: ProjectStaffRef | string;
  dueDate?: string;
  estimateHours?: number;
  order: number;
  clientVisible: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReorderTaskPosition {
  id: string;
  status: TaskStatus;
  order: number;
}

// ---------------------------------------------------------------------------
// Time tracking (Phase 8) — never reaches a client account at all (the
// backend rejects Role.USER at the controller). See backend/src/modules/time-entry.
// ---------------------------------------------------------------------------

export interface TimeEntry {
  _id: string;
  project: string;
  task?: { _id: string; title: string } | string;
  user: ProjectStaffRef | string;
  date: string;
  minutes: number;
  note?: string;
  billable: boolean;
  invoiced: boolean;
  invoiceId?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Files (Phase 7). See backend/src/modules/file.
// ---------------------------------------------------------------------------

export type FileVisibility = "internal" | "client";

/** Never carries the raw storage key — see FileService.stripStorageKey. Download goes through GET /portal/files/:id/download. */
export interface ProjectFile {
  _id: string;
  project: string;
  name: string;
  mimeType: string;
  size: number;
  uploadedBy: UpdateAuthorRef | string;
  visibility: FileVisibility;
  version: number;
  supersedes?: string;
  folder?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Comments (Phase 7) — generic threaded discussion reused across the
// project's general thread, individual tasks, and individual files. See
// backend/src/modules/comment.
// ---------------------------------------------------------------------------

export type CommentSubjectType = "project" | "task" | "file";

export interface Comment {
  _id: string;
  project: string;
  subjectType: CommentSubjectType;
  subjectId?: string;
  author: UpdateAuthorRef | string;
  body: string;
  mentions: (UpdateAuthorRef | string)[];
  internal: boolean;
  parent?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Developer -> PM -> Client update flow. See
// backend/src/modules/{project-update,update-request}.
// ---------------------------------------------------------------------------

export type ProjectUpdateType = "progress" | "milestone" | "general";
export type ProjectUpdateStatus = "pending_review" | "published" | "rejected";

/** Subset of PortalUser populated onto author/reviewedBy/requestedBy/answeredBy fields. */
export interface UpdateAuthorRef {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  title?: string;
  role?: PlatformRole;
}

export interface ProjectUpdateItem {
  _id: string;
  project: string | { _id: string; name: string };
  author: UpdateAuthorRef | string;
  authorRole: "pm" | "developer";
  title: string;
  body: string;
  type: ProjectUpdateType;
  progressValue?: number;
  status: ProjectUpdateStatus;
  reviewNote?: string;
  reviewedBy?: UpdateAuthorRef | string;
  reviewedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type UpdateRequestStatus = "open" | "answered" | "closed";

export interface UpdateRequestItem {
  _id: string;
  project: string;
  requestedBy: UpdateAuthorRef | string;
  message: string;
  status: UpdateRequestStatus;
  answeredBy?: UpdateAuthorRef | string;
  answeredAt?: string;
  /** The PM's reply — set only when a PM (not the requester) closes this. */
  response?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// In-app notifications. See backend/src/modules/notification.
// ---------------------------------------------------------------------------

export interface PortalNotification {
  _id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// ---- Portal dashboard "needs your attention" rollup (GET /portal/dashboard/attention) ----

export interface AttentionItem {
  _id: string;
  title: string;
  meta: string;
  link?: string;
}

export interface AttentionGroup {
  count: number;
  items: AttentionItem[];
}

export interface PortalAttentionSummary {
  contractsAwaitingSignature: AttentionGroup;
  pendingApprovals: AttentionGroup;
  changeRequestsAwaitingDecision: AttentionGroup;
  unpaidInvoices: AttentionGroup;
  overdueInvoices: AttentionGroup;
  /** Item `_id` is the notification's — clicking one marks it read. */
  unreadMentions: AttentionGroup;
  /** Staff only (admin, or the project's PM). */
  changeRequestsAwaitingQuote?: AttentionGroup;
  openUpdateRequests?: AttentionGroup;
  updatesPendingReview?: AttentionGroup;
  /** Sum of every group's count. */
  total: number;
}

/** Badge counts per top-level project tab (GET /portal/projects/:id/attention). */
export interface ProjectAttentionCounts {
  decisions: number;
  billing: number;
  updates: number;
  work: number;
  files: number;
  total: number;
}

export interface ProjectAttention {
  counts: ProjectAttentionCounts;
  summary: PortalAttentionSummary;
}

/** One row of a project's recent activity (GET /portal/projects/:id/activity). */
export interface ProjectActivityItem {
  _id: string;
  type: "update_published" | "file_shared" | "approval_decided" | "invoice_paid";
  title: string;
  at: string;
  link: string;
}

// ---------------------------------------------------------------------------
// Get paid & protect scope: contracts, change requests, approvals, invoices.
// See backend/src/modules/{contract,change-request,approval,invoice,payment}.
// ---------------------------------------------------------------------------

export type ContractStatus = "draft" | "sent" | "accepted" | "void";

export interface ContractAcceptance {
  name: string;
  signatureImage?: string;
  acceptedAt: string;
  ip: string;
  userAgent: string;
}

export interface Contract {
  _id: string;
  organization: Organization | string;
  project?: { _id: string; name: string } | string;
  title: string;
  // Present on admin (/contracts) responses only — the agency panel manages
  // the file directly (upload/replace). Portal responses (/portal/contracts)
  // never include the raw storage URL; they carry `hasDocument` instead and
  // the file is fetched through the authenticated
  // /portal/contracts/:id/document route. See ContractService.stripDocumentUrl.
  documentUrl?: string;
  hasDocument?: boolean;
  version: number;
  status: ContractStatus;
  acceptance?: ContractAcceptance;
  createdAt: string;
  updatedAt: string;
}

export type ChangeRequestStatus = "requested" | "quoted" | "client_approved" | "rejected" | "invoiced";

/** Populated shape only on the admin cross-project list (GET /change-requests) — the portal's per-project endpoints already know the project from the URL and never populate it. */
export interface ChangeRequestProjectRef {
  _id: string;
  name: string;
  organization?: Organization | string;
}

export interface ChangeRequest {
  _id: string;
  project: ChangeRequestProjectRef | string;
  title: string;
  description?: string;
  priceAmount: number;
  currency: string;
  status: ChangeRequestStatus;
  requestedBy: UpdateAuthorRef | string;
  approvedBy?: UpdateAuthorRef | string;
  approvedAt?: string;
  rejectionReason?: string;
  /** Set once approved — ChangeRequestService.approve auto-generates a draft invoice for the priced scope. Absent on change requests approved before this existed. */
  invoiceId?: string;
  createdAt: string;
}

export type ApprovalSubjectType = "deliverable" | "milestone" | "change_request" | "invoice";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Approval {
  _id: string;
  project: ChangeRequestProjectRef | string;
  subjectType: ApprovalSubjectType;
  subjectId?: string;
  title: string;
  description?: string;
  status: ApprovalStatus;
  requestedBy: UpdateAuthorRef | string;
  decidedBy?: UpdateAuthorRef | string;
  decidedAt?: string;
  comment?: string;
  createdAt: string;
}

export type InvoiceType = "one_off" | "deposit" | "milestone" | "retainer";
export type InvoiceStatus = "draft" | "sent" | "paid" | "partially_paid" | "overdue" | "void";

export interface InvoiceLineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Invoice {
  _id: string;
  organization: Organization | string;
  project: { _id: string; name: string } | string;
  number: string;
  type: InvoiceType;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  notes?: string;
  recurring: boolean;
  recurrenceIntervalDays?: number;
  createdAt: string;
  /** Only present on a `partially_paid` invoice — see InvoiceService.withAmountPaid. `total - amountPaid` is what's actually still owed. */
  amountPaid?: number;
}

// ---- Owner analytics (GET /analytics/overview) — see backend AnalyticsService ----

/**
 * A currency-scoped sum — every money rollup is grouped by currency rather
 * than collapsed into one number, since the system has no FX conversion.
 * In the common single-currency case this is just a one-element array.
 */
export interface CurrencyAmount {
  currency: string;
  amount: number;
}

export type AgingBucketLabel = "current" | "0-30" | "31-60" | "61-90" | "90+";

export interface AgingBucket {
  bucket: AgingBucketLabel;
  currency: string;
  amount: number;
  count: number;
}

/** "Over budget" means labor burn (hoursLogged × costRate) past budgetAmount, not budgetSpent (Σ paid invoices) — see the backend's doc comment. budgetSpent is kept here as extra context only. */
export interface OverBudgetProject {
  _id: string;
  name: string;
  organizationName: string;
  budgetAmount: number;
  budgetSpent: number;
  currency: string;
  hoursLogged: number;
  laborCost: number;
}

/** `laborCost` has no currency of its own (User.costRate isn't currency-tagged) — see the backend's doc comment on why it's shown next to budgetAmount/currency rather than netted into one figure. */
export interface ProjectProfitability {
  _id: string;
  name: string;
  organizationName: string;
  budgetAmount: number;
  currency: string;
  hoursLogged: number;
  laborCost: number;
}

export type PaymentProvider = "stripe" | "manual";
export type PaymentStatus = "pending" | "succeeded" | "failed";

/** A ledger row — see InvoiceService.recordPayment / GET /invoices/:id/payments. */
export interface Payment {
  _id: string;
  invoice: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  createdAt: string;
}

// ---- Audit log (GET /audit-log) ----

export interface AuditLogActorRef {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: PlatformRole;
}

export interface AuditLogEntry {
  _id: string;
  actor: AuditLogActorRef | string;
  action: string;
  entityType: string;
  entityId: string;
  meta?: Record<string, unknown>;
  ip?: string;
  at: string;
}

export interface AnalyticsOverview {
  revenue: {
    thisMonth: CurrencyAmount[];
    thisQuarter: CurrencyAmount[];
  };
  mrr: CurrencyAmount[];
  receivables: {
    outstanding: CurrencyAmount[];
    overdue: CurrencyAmount[];
    aging: AgingBucket[];
  };
  projects: {
    byStatus: Record<ClientProjectStatus, number>;
    overBudget: OverBudgetProject[];
    overBudgetCount: number;
    profitability: ProjectProfitability[];
  };
  actionRequired: {
    contractsAwaitingSignature: number;
    invoicesOverdue: number;
    pendingApprovals: number;
    /** Client-requested scope with no PM pricing yet — distinct from changeRequestsAwaitingDecision (already quoted, waiting on the client). */
    changeRequestsAwaitingQuote: number;
    changeRequestsAwaitingDecision: number;
    openUpdateRequests: number;
  };
  generatedAt: string;
}
