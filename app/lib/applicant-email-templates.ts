import type { ApplicationStatus } from "~/lib/types";

/**
 * Starting points for emailing an applicant from /cpadmin/applicants/:id.
 * Picking one pre-fills the form; the admin edits before sending. {name} and
 * {role} are substituted with the applicant's first name and the job title.
 * The email itself already opens with "Hi {name}," and closes with a sign-off.
 */
export interface ApplicantEmailTemplate {
  id: string;
  label: string;
  subject: string;
  message: string;
  /** Show the task link + due date fields open. */
  withTask?: boolean;
  /** Days from today the due date defaults to, when withTask. */
  dueInDays?: number;
  setStatus?: Exclude<ApplicationStatus, "new">;
}

export const APPLICANT_EMAIL_TEMPLATES: ApplicantEmailTemplate[] = [
  {
    id: "task",
    label: "Assignment task",
    subject: "Next step for the {role} role: a short task",
    message:
      "Thanks for applying for the {role} role. We enjoyed reading your application and would like to move you to the next step.\n\n" +
      "Please complete the task linked below. It should take a few hours; we care more about how you approach it than about polish.\n\n" +
      "When you're done, reply to this email with a link to your work (GitHub, Figma, Google Drive...) before the due date. If the deadline doesn't work for you, just tell us.",
    withTask: true,
    dueInDays: 5,
    setStatus: "review",
  },
  {
    id: "interview",
    label: "Interview invite",
    subject: "Interview for the {role} role at Weblaud",
    message:
      "Thanks for your application for the {role} role. We'd like to invite you to a 30-minute video interview.\n\n" +
      "Please reply with two or three times that suit you over the next week, along with your time zone, and we'll send a calendar invite.",
    setStatus: "shortlisted",
  },
  {
    id: "received",
    label: "Task received",
    subject: "We received your task",
    message:
      "Thanks for sending your task. Our team is reviewing it now and we'll get back to you within a few working days.",
  },
  {
    id: "rejection",
    label: "Rejection",
    subject: "Your application for the {role} role",
    message:
      "Thank you for your interest in the {role} role and for the time you put into your application.\n\n" +
      "After careful consideration, we've decided not to move forward with your application this time. This was a hard decision, and it isn't a reflection of your potential.\n\n" +
      "We'll keep your details on file and may reach out if a role that fits opens up. We wish you all the best.",
    setStatus: "rejected",
  },
  {
    id: "custom",
    label: "Custom",
    subject: "",
    message: "",
  },
];

export function fillTemplate(text: string, vars: { name: string; role: string }) {
  return text.replaceAll("{name}", vars.name).replaceAll("{role}", vars.role);
}
