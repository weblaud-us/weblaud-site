import { FiCheckCircle, FiClock, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import { Calendar, Layers, ShieldCheck, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/lib/utils";
import type { EstimateResult as Estimate, EstimateSelection } from "~/lib/calculator";
import { LeadForm } from "./leadForm";

interface EstimateResultProps {
  estimate: Estimate;
  selection: EstimateSelection;
  submitted: boolean;
  onSubmitted: () => void;
  onBookCall: () => void;
  onReset: () => void;
}

export function EstimateResult({
  estimate,
  selection,
  submitted,
  onSubmitted,
  onBookCall,
  onReset,
}: EstimateResultProps) {
  return (
    <div className="mt-6 sm:mt-8 bg-gradient-to-br from-primary/15 via-blue-900/10 to-[#0e0e0e] border border-primary/30 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 text-center relative overflow-hidden shadow-2xl space-y-6 sm:space-y-8">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      {/* Metrics Row */}
      <div
        role="status"
        aria-live="polite"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10 text-left"
      >
        {/* Sprint Timeline Metric */}
        <div className="p-4 sm:p-6 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-primary font-bold truncate">
              Delivery Timeline
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 shrink-0 whitespace-nowrap">
              Agile Sprints
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 pt-1">
            <FiClock className="text-primary shrink-0 text-lg sm:text-2xl" aria-hidden="true" />
            <span className="text-xl sm:text-3xl md:text-4xl font-bold font-barlow text-white tracking-tight">
              {estimate.totalWeeks} Sprint Weeks
            </span>
          </div>
          <p className="text-xs text-gray-400 font-barlow leading-relaxed pt-1">
            Includes discovery, architecture design, frontend/backend engineering, QA validation, and launch.
          </p>
        </div>

        {/* Investment Range Metric */}
        <div className="p-4 sm:p-6 rounded-2xl bg-black/60 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-primary font-bold truncate">
              Investment Range
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 shrink-0 whitespace-nowrap">
              Fixed-Fee
            </span>
          </div>
          <div className="text-xl sm:text-3xl lg:text-4xl font-bold font-barlow text-white pt-1 flex items-center flex-wrap gap-1 sm:gap-2">
            <span className="text-primary">{formatCurrency(estimate.costMin)}</span>
            <span className="text-gray-400 font-normal mx-0.5 sm:mx-1">–</span>
            <span className="text-primary">{formatCurrency(estimate.costMax)}</span>
          </div>
          <p className="text-xs text-gray-400 font-barlow leading-relaxed pt-1">
            Fixed-fee sprint pricing. Zero hidden costs, no vendor lock-in, and full code ownership.
          </p>
        </div>
      </div>

      {/* Included Guarantees */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1 sm:pt-2 text-left relative z-10">
        {[
          { label: "100% Code Ownership", icon: <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" /> },
          { label: "Direct Senior Engineers", icon: <Layers className="w-3.5 h-3.5 text-primary shrink-0" /> },
          { label: "Daily Async Updates", icon: <FiClock className="w-3.5 h-3.5 text-primary shrink-0" /> },
          { label: "CI/CD & QA Included", icon: <Zap className="w-3.5 h-3.5 text-primary shrink-0" /> },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center gap-2 text-[11px] sm:text-xs font-barlow text-gray-300"
          >
            {item.icon}
            <span className="font-medium truncate">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Lead Form */}
      <div className="relative z-10">
        <LeadForm
          selection={selection}
          submitted={submitted}
          onSubmitted={onSubmitted}
        />
      </div>

      {/* Action CTA Footer */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 relative z-10">
        {submitted && (
          <button
            type="button"
            onClick={onBookCall}
            className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-barlow font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-blue-500/25 hover:scale-[1.02] cursor-pointer"
          >
            <span>Book Discovery Call</span>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
              <FiArrowRight className="w-3 h-3 text-white -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white font-barlow transition-all duration-300 cursor-pointer py-2.5 sm:py-2.5 px-4 sm:px-5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98]"
        >
          <FiRefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset Calculator</span>
        </button>
      </div>
    </div>
  );
}
