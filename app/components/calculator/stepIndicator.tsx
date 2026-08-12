import { FiCheckCircle } from "react-icons/fi";

export const CALCULATOR_STEPS = [
  { num: 1, label: "Project Type" },
  { num: 2, label: "Capabilities" },
  { num: 3, label: "Pace & Estimate" },
] as const;

interface StepIndicatorProps {
  step: number;
  onStepChange: (step: number) => void;
}

export function StepIndicator({ step, onStepChange }: StepIndicatorProps) {
  return (
    <ol className="flex items-center justify-between max-w-md mx-auto mb-10 relative z-10">
      {CALCULATOR_STEPS.map((item) => {
        const isCurrent = step === item.num;
        const isComplete = step > item.num;
        // Steps ahead of the wizard are genuinely unreachable, so disable them
        // rather than leaving a focusable control whose click does nothing.
        const isReachable = item.num <= step;

        return (
          <li key={item.num} className="flex flex-col items-center">
            <button
              type="button"
              disabled={!isReachable}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Step ${item.num}: ${item.label}${
                isComplete ? " (completed)" : ""
              }`}
              onClick={() => isReachable && onStepChange(item.num)}
              className={`w-10 h-10 rounded-full font-barlow font-bold flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                isCurrent
                  ? "bg-primary text-white shadow-lg shadow-primary/40 ring-4 ring-primary/20 cursor-pointer"
                  : isComplete
                    ? "bg-emerald-500 text-white cursor-pointer"
                    : "bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed"
              }`}
            >
              {isComplete ? <FiCheckCircle aria-hidden="true" /> : item.num}
            </button>
            <span className="text-xs font-barlow mt-2 text-gray-400 font-medium">
              {item.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
