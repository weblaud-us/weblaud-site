import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import SectionBadge from "~/components/ui/section-badge";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import {
  FiAlertTriangle,
} from "react-icons/fi";
import {
  LayoutDashboard,
  Globe,
  Smartphone,
  Cpu,
  Layers,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Clock,
  Check,
} from "lucide-react";
import { Link } from "react-router";
import { estimateProject } from "~/lib/calculator";
import type { CalculatorConfig } from "~/lib/types";
import { CALCULATOR_STEPS, StepIndicator } from "./stepIndicator";
import { OptionCard } from "./optionCard";
import { EstimateResult } from "./estimateResult";
import { EstimateSuccessModal } from "./estimateSuccessModal";

// Icons are UI-only, not part of the backend content model — looked up by
// project-type id, with a default fallback for any type added via admin.
const PROJECT_TYPE_ICONS: Record<string, React.ReactNode> = {
  operations: <LayoutDashboard className="w-5 h-5 text-primary" />,
  webapp: <Globe className="w-5 h-5 text-primary" />,
  mobile: <Smartphone className="w-5 h-5 text-primary" />,
  ai: <Cpu className="w-5 h-5 text-primary" />,
};
const DEFAULT_PROJECT_TYPE_ICON = <Layers className="w-5 h-5 text-primary" />;

const STEP_TRANSITION = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 },
};

interface ProjectCalculatorProps {
  config: CalculatorConfig;
  /** True when the live config was unreachable and defaults are standing in. */
  usingFallbackConfig?: boolean;
}

export default function ProjectCalculator({
  config,
  usingFallbackConfig = false,
}: ProjectCalculatorProps) {
  const { projectTypes, features, timelineSpeeds } = config;

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>(
    projectTypes[0]?.id ?? "",
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedSpeed, setSelectedSpeed] = useState<string>(
    timelineSpeeds[0]?.id ?? "",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const selection = useMemo(
    () => ({
      projectTypeId: selectedType,
      featureIds: selectedFeatures,
      speedId: selectedSpeed,
    }),
    [selectedType, selectedFeatures, selectedSpeed],
  );

  const estimate = useMemo(
    () => estimateProject(config, selection),
    [config, selection],
  );

  const handleReset = () => {
    setStep(1);
    setSelectedType(projectTypes[0]?.id ?? "");
    setSelectedFeatures([]);
    setSelectedSpeed(timelineSpeeds[0]?.id ?? "");
    setHasSubmitted(false);
    setIsSuccessModalOpen(false);
  };

  const handleSubmitted = useCallback(() => {
    setHasSubmitted(true);
    setIsSuccessModalOpen(true);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-0 sm:px-6 lg:px-8 py-2 sm:py-8">
      {/* Container */}
      <div className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 relative z-10 flex flex-col items-center">
          <SectionBadge
            icon={<Calculator className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            color="#0a84ff"
            className="mb-2 sm:mb-4 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-xs"
          >
            <span className="font-bold tracking-[0.06em] text-primary whitespace-nowrap">
              <span className="sm:hidden">Instant Scope</span>
              <span className="hidden sm:inline">Instant Scope & Budget</span>
            </span>
            <span className="text-white/50 pl-1.5 sm:pl-2 border-l border-white/10 font-medium tracking-[0.04em] text-[9px] sm:text-[11px] whitespace-nowrap">
              <span className="sm:hidden">Estimator</span>
              <span className="hidden sm:inline">Project Estimator</span>
            </span>
          </SectionBadge>
          <h1 className="text-xl sm:text-4xl md:text-5xl font-bold font-barlow text-white tracking-tight mb-2 sm:mb-4 leading-tight">
            Calculate Your Sprint Scope & Timeline
          </h1>
          <p className="text-gray-400 font-barlow text-xs sm:text-base leading-relaxed max-w-xl">
            Select your software requirements below to instantly generate an estimated delivery timeline and investment range.
          </p>
          {usingFallbackConfig && (
            <p className="mt-2.5 inline-flex items-center gap-2 text-[11px] sm:text-xs font-barlow text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5">
              <FiAlertTriangle className="shrink-0" aria-hidden="true" />
              <span>Showing indicative rates — we'll confirm exact pricing on your call.</span>
            </p>
          )}
        </div>

        <StepIndicator step={step} onStepChange={setStep} />

        {/* Wizard Steps */}
        <div className="relative z-10 min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* STEP 1: Project Type */}
            {step === 1 && (
              <motion.div key="step1" {...STEP_TRANSITION} className="space-y-4 sm:space-y-5">
                <fieldset>
                  <legend className="text-base sm:text-xl font-bold font-barlow text-white mb-3 sm:mb-4 flex items-start gap-2.5 leading-snug">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      01
                    </span>
                    <span>Select your primary software focus:</span>
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {projectTypes.map((type) => (
                      <OptionCard
                        key={type.id}
                        name="projectType"
                        type="radio"
                        value={type.id}
                        checked={selectedType === type.id}
                        onSelect={setSelectedType}
                        title={type.title}
                        desc={type.desc}
                        icon={
                          PROJECT_TYPE_ICONS[type.id] ?? DEFAULT_PROJECT_TYPE_ICON
                        }
                        indicator={
                          <div
                            aria-hidden="true"
                            className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0 ${
                              selectedType === type.id
                                ? "bg-primary border-primary text-white shadow-md shadow-blue-500/40 ring-2 ring-primary/20"
                                : "border-white/20 bg-white/[0.02]"
                            }`}
                          >
                            {selectedType === type.id && (
                              <Check className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                        }
                      />
                    ))}
                  </div>
                </fieldset>
              </motion.div>
            )}

            {/* STEP 2: Features */}
            {step === 2 && (
              <motion.div key="step2" {...STEP_TRANSITION} className="space-y-4 sm:space-y-5">
                <fieldset>
                  <legend className="text-base sm:text-xl font-bold font-barlow text-white mb-3 sm:mb-4 flex items-start gap-2.5 leading-snug">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      02
                    </span>
                    <span>Choose required technical capabilities:</span>
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {features.map((feat) => {
                      const isChecked = selectedFeatures.includes(feat.id);
                      return (
                        <OptionCard
                          key={feat.id}
                          name="features"
                          type="checkbox"
                          value={feat.id}
                          checked={isChecked}
                          onSelect={toggleFeature}
                          title={feat.title}
                          desc={feat.desc}
                          indicator={
                            <div
                              aria-hidden="true"
                              className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all duration-300 shrink-0 ${
                                isChecked
                                  ? "bg-primary border-primary text-white shadow-md shadow-blue-500/40 ring-2 ring-primary/20"
                                  : "border-white/20 bg-white/[0.02]"
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          }
                        />
                      );
                    })}
                  </div>
                </fieldset>
              </motion.div>
            )}

            {/* STEP 3: Timeline & Final Estimate */}
            {step === 3 && (
              <motion.div key="step3" {...STEP_TRANSITION} className="space-y-5 sm:space-y-6">
                <fieldset>
                  <legend className="text-base sm:text-xl font-bold font-barlow text-white mb-3 sm:mb-4 flex items-start gap-2.5 leading-snug">
                    <span className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                      03
                    </span>
                    <span>Select delivery pace & view estimated breakdown:</span>
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {timelineSpeeds.map((speed) => (
                      <OptionCard
                        key={speed.id}
                        name="speed"
                        type="radio"
                        value={speed.id}
                        checked={selectedSpeed === speed.id}
                        onSelect={setSelectedSpeed}
                        title={speed.label}
                        desc={speed.desc}
                        icon={<Clock className="w-5 h-5 text-primary" />}
                        indicator={
                          <div
                            aria-hidden="true"
                            className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0 ${
                              selectedSpeed === speed.id
                                ? "bg-primary border-primary text-white shadow-md shadow-blue-500/40 ring-2 ring-primary/20"
                                : "border-white/20 bg-white/[0.02]"
                            }`}
                          >
                            {selectedSpeed === speed.id && (
                              <Check className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                        }
                      />
                    ))}
                  </div>
                </fieldset>

                <EstimateResult
                  estimate={estimate}
                  selection={selection}
                  submitted={hasSubmitted}
                  onSubmitted={handleSubmitted}
                  onBookCall={() => setIsModalOpen(true)}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 sm:pt-8 border-t border-white/[0.08] mt-8">
            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-gray-300 hover:text-white transition-all duration-300 cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4 text-white" aria-hidden="true" />
                <span>Back</span>
              </Button>
            ) : (
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-barlow text-gray-400 hover:text-white transition-colors duration-300 group"
              >
                <ChevronLeft
                  className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform"
                  aria-hidden="true"
                />
                <span>Back to Services</span>
              </Link>
            )}

            {step < CALCULATOR_STEPS.length && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="group inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-blue-600 text-white font-barlow font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-blue-500/25 hover:scale-[1.02] cursor-pointer"
              >
                <span>Next Step</span>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                  <ChevronRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <EstimateSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        estimate={estimate}
        onBookCall={() => {
          setIsSuccessModalOpen(false);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}
