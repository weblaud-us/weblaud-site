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

export interface EstimateSubmission {
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

export type ContactSubmissionStatus = "new" | "read";

export interface ContactSubmission {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactSubmissionStatus;
  createdAt: string;
}
