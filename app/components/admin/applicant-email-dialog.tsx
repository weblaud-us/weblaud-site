import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Send } from "lucide-react";
import {
  APPLICANT_EMAIL_TEMPLATES,
  fillTemplate,
  type ApplicantEmailTemplate,
} from "~/lib/applicant-email-templates";
import type { ApplicationStatus } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type ActionResult = { ok: true; message?: string } | { error: string } | null;

const STATUS_OPTIONS: { value: Exclude<ApplicationStatus, "new">; label: string }[] = [
  { value: "review", label: "In review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "hired", label: "Hired" },
];

/** `YYYY-MM-DDTHH:mm` in local time, `days` from now at 5 PM. */
function defaultDue(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(17, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * "Email applicant" composer: pick a template (assignment task, interview
 * invite, rejection...), edit it, optionally attach a task link + deadline and
 * move the applicant's status in the same step. Posts intent=email to the
 * page's action.
 */
export function ApplicantEmailDialog({
  open,
  onOpenChange,
  applicantName,
  applicantEmail,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicantName: string;
  applicantEmail: string;
  role: string;
}) {
  const fetcher = useFetcher<ActionResult>();
  const vars = { name: applicantName.trim().split(/\s+/)[0] || "there", role };
  const [templateId, setTemplateId] = useState(APPLICANT_EMAIL_TEMPLATES[0].id);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [withTask, setWithTask] = useState(false);
  const [taskUrl, setTaskUrl] = useState("");
  const [due, setDue] = useState("");
  const [status, setStatus] = useState("");

  const apply = (t: ApplicantEmailTemplate) => {
    setTemplateId(t.id);
    setSubject(fillTemplate(t.subject, vars));
    setMessage(fillTemplate(t.message, vars));
    setWithTask(!!t.withTask);
    setDue(t.withTask ? defaultDue(t.dueInDays ?? 5) : "");
    setStatus(t.setStatus ?? "");
  };

  // Fresh form every time it opens, starting from the first template.
  useEffect(() => {
    if (open) {
      apply(APPLICANT_EMAIL_TEMPLATES[0]);
      setTaskUrl("");
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if ("ok" in fetcher.data) {
      toast.success(fetcher.data.message ?? "Email sent.");
      onOpenChange(false);
    }
  }, [fetcher.state, fetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const sending = fetcher.state !== "idle";
  const error = fetcher.data && "error" in fetcher.data ? fetcher.data.error : null;
  const dueIso = withTask && due ? new Date(due).toISOString() : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email {applicantName}</DialogTitle>
          <DialogDescription>
            Sent to {applicantEmail}. Replies go to the HR inbox.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="email" />
          <input type="hidden" name="dueAt" value={dueIso} />
          <input
            type="hidden"
            name="timeZone"
            value={typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : ""}
          />

          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Template">
            {APPLICANT_EMAIL_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={templateId === t.id}
                onClick={() => apply(t)}
                className={
                  "px-2.5 py-1 rounded-md text-xs border transition-colors " +
                  (templateId === t.id
                    ? "bg-white/10 text-white border-white/20"
                    : "text-white/50 hover:text-white border-white/10")
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicant-email-subject">Subject</Label>
            <Input
              id="applicant-email-subject"
              name="subject"
              required
              maxLength={200}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicant-email-message">Message</Label>
            <Textarea
              id="applicant-email-message"
              name="message"
              required
              maxLength={5000}
              className="h-48"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-xs text-white/40">
              The email starts with "Hi {vars.name}," and ends with a sign-off, so
              leave those out. A blank line starts a new paragraph.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={withTask}
              onChange={(e) => {
                setWithTask(e.target.checked);
                if (e.target.checked && !due) setDue(defaultDue(5));
              }}
              className="accent-[#0A84FF]"
            />
            Include a task link and deadline
          </label>

          {withTask && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="applicant-email-task">Task link</Label>
                <Input
                  id="applicant-email-task"
                  name="taskUrl"
                  type="url"
                  required
                  placeholder="https://docs.google.com/..."
                  value={taskUrl}
                  onChange={(e) => setTaskUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicant-email-due">Due</Label>
                <Input
                  id="applicant-email-due"
                  type="datetime-local"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="applicant-email-status">Also set status to</Label>
            <Select
              id="applicant-email-status"
              name="setStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="py-2"
            >
              <option value="">Don't change</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={sending}>
              <Send className="size-3.5" />
              {sending ? "Sending..." : "Send email"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
