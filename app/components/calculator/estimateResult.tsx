import { FiArrowRight, FiClock, FiRefreshCw } from "react-icons/fi";
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
    <div className="mt-8 bg-gradient-to-br from-primary/20 via-blue-900/20 to-black border border-primary/30 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
      {/* Announced so changing the delivery pace is audible, not just visible. */}
      <div
        role="status"
        aria-live="polite"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
      >
        <div className="text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
          <span className="text-xs uppercase font-barlow font-semibold text-gray-400 tracking-wider">
            Estimated Delivery Time
          </span>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-barlow text-white mt-1 flex items-start gap-2 sm:gap-3">
            <FiClock className="text-primary shrink-0 mt-1 sm:mt-1.5" aria-hidden="true" />
            <span>{estimate.totalWeeks} SPRINT WEEKS</span>
          </div>
          <p className="text-xs text-gray-400 font-barlow mt-2">
            Includes discovery, UX prototyping, backend engineering, QA testing,
            and launch.
          </p>
        </div>

        <div className="text-left">
          <span className="text-xs uppercase font-barlow font-semibold text-gray-400 tracking-wider">
            Estimated Investment Range
          </span>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-barlow text-primary mt-1 break-words">
            {formatCurrency(estimate.costMin)} – {formatCurrency(estimate.costMax)}
          </div>
          <p className="text-xs text-gray-400 font-barlow mt-2">
            Fixed-fee sprint pricing. Zero hidden costs or unexpected hourly
            overruns.
          </p>
        </div>
      </div>

      <LeadForm
        selection={selection}
        submitted={submitted}
        onSubmitted={onSubmitted}
      />

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        {submitted && (
          <Button
            onClick={onBookCall}
            className="w-full sm:w-auto px-8 py-4 text-base font-bold"
          >
            Book Call with This Scope
            <FiArrowRight className="ml-2" aria-hidden="true" />
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onReset}>
          <FiRefreshCw className="mr-1.5" aria-hidden="true" /> Start Over
        </Button>
      </div>
    </div>
  );
}
