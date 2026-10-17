import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { AuditScores as Scores, AuditVitals } from "~/lib/types";
import { SCORE_BAND_LABEL, scoreBand, vitalRows, type ScoreBand } from "~/lib/audit";

const CATEGORIES: { key: keyof Scores; label: string }[] = [
  { key: "performance", label: "Performance" },
  { key: "seo", label: "SEO" },
  { key: "accessibility", label: "Accessibility" },
  { key: "bestPractices", label: "Best practices" },
];

/**
 * Status colours are reserved for state and always travel with an icon and a
 * text label, so a band is never conveyed by colour alone. The score number
 * itself stays in the primary text colour.
 */
const BAND_STYLE: Record<ScoreBand, { icon: typeof CheckCircle2; text: string; bar: string }> = {
  good: { icon: CheckCircle2, text: "text-emerald-400", bar: "bg-emerald-400" },
  "needs-work": { icon: AlertTriangle, text: "text-amber-400", bar: "bg-amber-400" },
  poor: { icon: XCircle, text: "text-red-400", bar: "bg-red-400" },
};

export function AuditScoreTiles({ scores }: { scores: Scores }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {CATEGORIES.map(({ key, label }) => {
        const score = scores[key];
        const band = scoreBand(score);
        const { icon: Icon, text, bar } = BAND_STYLE[band];
        return (
          <div
            key={key}
            className="rounded-xl border border-white/10 bg-black/40 p-3.5 sm:p-4"
            title={`${label}: ${score} / 100 — ${SCORE_BAND_LABEL[band]}`}
          >
            <p className="text-xs text-gray-400 font-barlow">{label}</p>
            <p className="mt-1.5 text-3xl sm:text-4xl font-bold font-barlow text-white tabular-nums leading-none">
              {score}
              <span className="text-sm text-white/30 font-medium"> /100</span>
            </p>
            {/* Thin track + fill, anchored left — magnitude at a glance. */}
            <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden" aria-hidden="true">
              <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.max(3, score)}%` }} />
            </div>
            <p className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold font-barlow ${text}`}>
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              {SCORE_BAND_LABEL[band]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function AuditVitalsTable({ vitals }: { vitals?: AuditVitals }) {
  const rows = vitalRows(vitals);
  if (!rows.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
      <table className="w-full text-sm font-barlow">
        <caption className="text-left text-xs uppercase tracking-wider text-gray-400 font-semibold px-4 pt-3.5 pb-2">
          Core Web Vitals (lab)
        </caption>
        <thead className="sr-only">
          <tr>
            <th>Metric</th>
            <th>Your page</th>
            <th>Good is</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const { icon: Icon, text } = BAND_STYLE[row.good ? "good" : "poor"];
            return (
              <tr key={row.label} className="border-t border-white/[0.06]">
                <td className="px-4 py-2.5 text-gray-300">{row.label}</td>
                <td className="px-2 py-2.5 text-right text-white font-semibold tabular-nums whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${text}`} aria-label={row.good ? "meets target" : "misses target"} />
                    {row.value}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right text-xs text-gray-500 whitespace-nowrap">
                  good: {row.target}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
