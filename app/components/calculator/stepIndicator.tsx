import { FiCheckCircle } from "react-icons/fi";

export const CALCULATOR_STEPS = [
  { num: 1, label: "Project Focus" },
  { num: 2, label: "Capabilities" },
  { num: 3, label: "Pace & Estimate" },
] as const;

interface StepIndicatorProps {
  step: number;
  onStepChange: (step: number) => void;
}

export function StepIndicator({ step, onStepChange }: StepIndicatorProps) {
  return (
    <div className="max-w-xl mx-auto mb-8 sm:mb-12 relative z-10 px-1 sm:px-4">
      <ol className="flex items-center justify-between">
        {CALCULATOR_STEPS.map((item, idx) => {
          const isCurrent = step === item.num;
          const isComplete = step > item.num;
          const isReachable = item.num <= step;
          const isSegmentActive = step > item.num;

          return (
            <div key={item.num} className="contents">
              {/* Step Node */}
              <li className="relative z-10 flex flex-col items-center shrink-0">
                <button
                  type="button"
                  disabled={!isReachable}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Step ${item.num}: ${item.label}${
                    isComplete ? " (completed)" : ""
                  }`}
                  onClick={() => isReachable && onStepChange(item.num)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-mono text-[11px] sm:text-sm font-bold flex items-center justify-center transition-all duration-300 outline-none ${
                    isCurrent
                      ? "bg-primary text-white shadow-lg shadow-blue-500/40 ring-2 sm:ring-4 ring-primary/20 scale-105 sm:scale-110 cursor-pointer"
                      : isComplete
                        ? "bg-primary text-white cursor-pointer hover:bg-blue-600"
                        : "bg-[#0e0e0e] text-gray-500 border border-white/[0.12] cursor-not-allowed"
                  }`}
                >
                  {isComplete ? (
                    <FiCheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" aria-hidden="true" />
                  ) : (
                    <span>0{item.num}</span>
                  )}
                </button>
                <span
                  className={`text-[10px] sm:text-xs font-barlow mt-1.5 sm:mt-2 font-medium tracking-tight whitespace-nowrap transition-colors ${
                    isCurrent
                      ? "text-white font-semibold"
                      : isComplete
                        ? "text-gray-300"
                        : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </li>

              {/* Segmented Line with Endpoint Rings */}
              {idx < CALCULATOR_STEPS.length - 1 && (
                <div
                  className="flex-1 min-w-[20px] sm:min-w-[40px] flex items-center mx-1.5 sm:mx-3 mb-4 sm:mb-6"
                  aria-hidden="true"
                >
                  {/* Left Ring */}
                  <div
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border transition-all duration-500 shrink-0 ${
                      isSegmentActive
                        ? "border-primary bg-primary/30 shadow-sm shadow-blue-500/50"
                        : "border-white/20 bg-[#0e0e0e]"
                    }`}
                  />
                  {/* Middle Line */}
                  <div
                    className={`flex-1 h-[1.5px] min-w-[12px] transition-all duration-500 ${
                      isSegmentActive ? "bg-primary shadow-sm shadow-blue-500/40" : "bg-white/[0.10]"
                    }`}
                  />
                  {/* Right Ring */}
                  <div
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border transition-all duration-500 shrink-0 ${
                      isSegmentActive
                        ? "border-primary bg-primary/30 shadow-sm shadow-blue-500/50"
                        : "border-white/20 bg-[#0e0e0e]"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </ol>
    </div>
  );
}
