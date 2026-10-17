import { useEffect, useState } from "react";
import { Link, useFetcher, useSearchParams } from "react-router";
import { toast } from "sonner";
import { CalendarClock, UserPlus } from "lucide-react";
import type { LeadPipelineFields, LeadStage } from "~/lib/types";
import {
  HEARD_ABOUT_LABEL,
  LEAD_STAGES,
  LEAD_STAGE_LABEL,
  followUpInputValue,
  formatFollowUpDate,
  isFollowUpDue,
  splitName,
} from "~/lib/leads";
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

/** Pill colours per stage — open stages blue-ish, closed ones green/grey. */
const STAGE_STYLE: Record<LeadStage, string> = {
  new: "bg-[#0A84FF]/15 text-[#5AB0FF] border-[#0A84FF]/30",
  contacted: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  call_booked: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  proposal_sent: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  won: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  lost: "bg-white/5 text-white/40 border-white/10",
};

export function StagePill({ stage = "new" }: { stage?: LeadStage }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${STAGE_STYLE[stage]}`}
    >
      {LEAD_STAGE_LABEL[stage]}
    </span>
  );
}

/**
 * Pipeline stage tabs. Keeps other query params (e.g. the contact page's
 * ?view=spam) but always resets pagination.
 */
export function StageFilter({ active }: { active: LeadStage | null }) {
  const [searchParams] = useSearchParams();
  const hrefFor = (stage: LeadStage | null) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (stage) params.set("stage", stage);
    else params.delete("stage");
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  };

  return (
    <div className="mb-4 flex flex-wrap gap-1">
      {[{ value: null, label: "All stages" }, ...LEAD_STAGES].map((s) => (
        <Link
          key={s.label}
          to={hrefFor(s.value)}
          className={
            "px-2.5 py-1 rounded-md text-xs transition-colors border " +
            (active === s.value
              ? "bg-white/10 text-white border-white/20"
              : "text-white/50 hover:text-white border-transparent")
          }
        >
          {s.label}
        </Link>
      ))}
    </div>
  );
}

/** Where the lead came from, compactly — blank when nothing was captured. */
export function LeadSource({ lead }: { lead: LeadPipelineFields }) {
  const a = lead.attribution;
  const utm = [a?.utmSource, a?.utmMedium, a?.utmCampaign]
    .filter(Boolean)
    .join(" / ");
  let referrerHost: string | undefined;
  try {
    referrerHost = a?.referrer ? new URL(a.referrer).host : undefined;
  } catch {
    referrerHost = a?.referrer;
  }

  if (!lead.heardAbout && !utm && !referrerHost && !a?.landingPath) {
    return <span className="text-white/25">—</span>;
  }

  return (
    <div className="space-y-0.5 text-xs">
      {lead.heardAbout && (
        <div className="text-white/70">{HEARD_ABOUT_LABEL[lead.heardAbout]}</div>
      )}
      {utm && <div className="text-white/50">utm: {utm}</div>}
      {referrerHost && <div className="text-white/50">via {referrerHost}</div>}
      {a?.landingPath && (
        <div className="text-white/35 truncate max-w-[180px]" title={a.landingPath}>
          landed {a.landingPath}
        </div>
      )}
    </div>
  );
}

/** Stage pill, follow-up date, and the notes excerpt for one lead row. */
export function LeadPipelineSummary({ lead }: { lead: LeadPipelineFields }) {
  const due = isFollowUpDue(lead.nextFollowUpAt);
  return (
    <div className="space-y-1">
      <StagePill stage={lead.stage} />
      {lead.nextFollowUpAt && (
        <div
          className={
            "flex items-center gap-1 text-xs " +
            (due ? "text-red-400 font-medium" : "text-white/50")
          }
        >
          <CalendarClock className="size-3" />
          {due ? "Due " : ""}
          {formatFollowUpDate(lead.nextFollowUpAt)}
        </div>
      )}
      {lead.stage === "lost" && lead.lostReason && (
        <div className="text-xs text-white/35">{lead.lostReason}</div>
      )}
      {lead.internalNotes && (
        <div
          className="text-xs text-white/35 italic line-clamp-2 max-w-[200px]"
          title={lead.internalNotes}
        >
          {lead.internalNotes}
        </div>
      )}
    </div>
  );
}

/** Closes a dialog and toasts once its fetcher reports success. */
function useCloseOnSuccess(
  fetcher: ReturnType<typeof useFetcher<ActionResult>>,
  close: () => void,
  fallbackMessage: string,
) {
  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if ("ok" in fetcher.data) {
      toast.success(fetcher.data.message ?? fallbackMessage);
      close();
    }
  }, [fetcher.state, fetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function LeadPipelineDialog({
  lead,
  leadId,
  leadName,
  open,
  onOpenChange,
}: {
  lead: LeadPipelineFields;
  leadId: string;
  leadName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const fetcher = useFetcher<ActionResult>();
  const [stage, setStage] = useState<LeadStage>(lead.stage ?? "new");
  useCloseOnSuccess(fetcher, () => onOpenChange(false), "Lead updated.");

  // Re-sync when reopened on a lead whose stage changed meanwhile.
  useEffect(() => {
    if (open) setStage(lead.stage ?? "new");
  }, [open, lead.stage]);

  const saving = fetcher.state !== "idle";
  const error = fetcher.data && "error" in fetcher.data ? fetcher.data.error : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pipeline — {leadName}</DialogTitle>
          <DialogDescription>
            Only visible to admins. A follow-up date puts this lead in the daily
            follow-up email on that morning.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="pipeline" />
          <input type="hidden" name="id" value={leadId} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`stage-${leadId}`}>Stage</Label>
              <Select
                id={`stage-${leadId}`}
                name="stage"
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="w-full"
              >
                {LEAD_STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`followup-${leadId}`}>Next follow-up</Label>
              <Input
                id={`followup-${leadId}`}
                name="nextFollowUpAt"
                type="date"
                defaultValue={followUpInputValue(lead.nextFollowUpAt)}
              />
            </div>
          </div>

          {stage === "lost" && (
            <div className="space-y-2">
              <Label htmlFor={`lost-${leadId}`}>Why was it lost?</Label>
              <Input
                id={`lost-${leadId}`}
                name="lostReason"
                maxLength={500}
                placeholder="e.g. Budget, went with in-house, no response"
                defaultValue={lead.lostReason}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`notes-${leadId}`}>Notes</Label>
            <Textarea
              id={`notes-${leadId}`}
              name="internalNotes"
              maxLength={5000}
              className="h-28"
              placeholder="Call notes, budget, decision makers, next steps…"
              defaultValue={lead.internalNotes}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

export function ConvertToClientDialog({
  leadId,
  name,
  email,
  company,
  open,
  onOpenChange,
}: {
  leadId: string;
  name: string;
  email: string;
  company?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const fetcher = useFetcher<ActionResult>();
  useCloseOnSuccess(fetcher, () => onOpenChange(false), "Client created.");
  const { firstName, lastName } = splitName(name);
  const saving = fetcher.state !== "idle";
  const error = fetcher.data && "error" in fetcher.data ? fetcher.data.error : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convert to client</DialogTitle>
          <DialogDescription>
            Creates the organization, emails {email} an invite to the client
            portal as its admin, and marks this lead won.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="convert" />
          <input type="hidden" name="id" value={leadId} />

          <div className="space-y-2">
            <Label htmlFor={`org-${leadId}`}>Organization name</Label>
            <Input
              id={`org-${leadId}`}
              name="organizationName"
              required
              defaultValue={company || name}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`first-${leadId}`}>First name</Label>
              <Input
                id={`first-${leadId}`}
                name="firstName"
                required
                defaultValue={firstName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`last-${leadId}`}>Last name</Label>
              <Input
                id={`last-${leadId}`}
                name="lastName"
                required
                defaultValue={lastName}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`email-${leadId}`}>Email (billing + portal login)</Label>
            <Input
              id={`email-${leadId}`}
              name="email"
              type="email"
              required
              defaultValue={email}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create client & send invite"}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

/** The two pipeline buttons for a lead row, with their dialogs. */
export function LeadPipelineActions({
  lead,
  leadId,
  name,
  email,
  company,
}: {
  lead: LeadPipelineFields;
  leadId: string;
  name: string;
  email: string;
  company?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [converting, setConverting] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
        Pipeline
      </Button>
      {lead.stage !== "won" && lead.stage !== "lost" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConverting(true)}
          title="Create the organization and invite them to the portal"
        >
          <UserPlus className="size-3.5" />
          Convert
        </Button>
      )}
      <LeadPipelineDialog
        lead={lead}
        leadId={leadId}
        leadName={name}
        open={editing}
        onOpenChange={setEditing}
      />
      <ConvertToClientDialog
        leadId={leadId}
        name={name}
        email={email}
        company={company}
        open={converting}
        onOpenChange={setConverting}
      />
    </>
  );
}
