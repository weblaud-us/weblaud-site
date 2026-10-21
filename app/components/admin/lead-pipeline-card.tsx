import type { LeadPipelineFields } from "~/lib/types";
import { HEARD_ABOUT_LABEL, LEAD_STAGE_LABEL } from "~/lib/leads";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { LocalTime } from "~/components/ui/local-time";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/50">{label}</dt>
      <dd className="text-white/90 text-right">{children}</dd>
    </div>
  );
}

/**
 * Read-only mirror of the pipeline fields a lead carries. The lists own the
 * editing (stage selects, notes, follow-up dates); a detail page only reports.
 */
export function LeadPipelineCard({ lead }: { lead: LeadPipelineFields }) {
  const attribution = lead.attribution ?? {};
  const attributionRows = Object.entries({
    Source: attribution.utmSource,
    Medium: attribution.utmMedium,
    Campaign: attribution.utmCampaign,
    Referrer: attribution.referrer,
    "Landing page": attribution.landingPath,
  }).filter(([, value]) => !!value);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="space-y-2 text-sm">
          <Row label="Stage">
            <Badge variant="outline">{LEAD_STAGE_LABEL[lead.stage ?? "new"]}</Badge>
          </Row>
          {lead.nextFollowUpAt && (
            <Row label="Next follow-up">
              <LocalTime value={lead.nextFollowUpAt} />
            </Row>
          )}
          {lead.lostReason && <Row label="Lost reason">{lead.lostReason}</Row>}
          {lead.heardAbout && (
            <Row label="Heard about us">{HEARD_ABOUT_LABEL[lead.heardAbout]}</Row>
          )}
          {lead.autoReplySentAt && (
            <Row label="Auto-reply sent">
              <LocalTime value={lead.autoReplySentAt} withTime />
            </Row>
          )}
        </dl>

        {lead.internalNotes && (
          <div className="pt-3 border-t border-white/10 text-sm">
            <p className="text-white/50 mb-1">Internal notes</p>
            <p className="text-white/70 whitespace-pre-wrap">{lead.internalNotes}</p>
          </div>
        )}

        {attributionRows.length > 0 && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-white/50 text-sm mb-2">Attribution</p>
            <dl className="space-y-2 text-sm">
              {attributionRows.map(([label, value]) => (
                <Row key={label} label={label}>
                  <span className="break-all">{value}</span>
                </Row>
              ))}
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
