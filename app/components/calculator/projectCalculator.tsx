import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "~/components/ui/button";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import {
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiCpu,
  FiSmartphone,
  FiGlobe,
  FiArrowRight,
  FiArrowLeft,
  FiAlertTriangle,
} from "react-icons/fi";
import { Link } from "react-router";
import { estimateProject } from "~/lib/calculator";
import type { CalculatorConfig } from "~/lib/types";
import { CALCULATOR_STEPS, StepIndicator } from "./stepIndicator";
import { OptionCard } from "./optionCard";
import { EstimateResult } from "./estimateResult";

// Icons are UI-only, not part of the backend content model — looked up by
// project-type id, with a default fallback for any type added via admin.
const PROJECT_TYPE_ICONS: Record<string, React.ReactNode> = {
  operations: <FiLayers className="text-primary text-2xl" />,
  webapp: <FiGlobe className="text-blue-400 text-2xl" />,
  mobile: <FiSmartphone className="text-purple-400 text-2xl" />,
  ai: <FiCpu className="text-emerald-400 text-2xl" />,
};
const DEFAULT_PROJECT_TYPE_ICON = <FiLayers className="text-primary text-2xl" />;

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
  };

  const handleSubmitted = useCallback(() => setHasSubmitted(true), []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Container */}
      <div className="bg-card-bg/80 backdrop-blur-xl border border-light-black/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4 font-barlow">
            Interactive Project Estimator
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-barlow mb-3 text-white">
            Calculate Your Sprint Scope & Timeline
          </h2>
          <p className="text-gray-400 font-barlow text-sm sm:text-base">
            Select your software requirements below to instantly generate an
            estimated delivery timeline and investment range.
          </p>
          {usingFallbackConfig && (
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-barlow text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1.5">
              <FiAlertTriangle className="shrink-0" aria-hidden="true" />
              Showing indicative rates — we'll confirm exact pricing on your call.
            </p>
          )}
        </div>

        <StepIndicator step={step} onStepChange={setStep} />

        {/* Wizard Steps */}
        <div className="relative z-10 min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* STEP 1: Project Type */}
            {step === 1 && (
              <motion.div key="step1" {...STEP_TRANSITION} className="space-y-4">
                <fieldset>
                  <legend className="text-xl font-bold font-barlow text-white mb-4">
                    1. Select your primary software focus:
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          selectedType === type.id ? (
                            <FiCheckCircle className="text-primary shrink-0" aria-hidden="true" />
                          ) : null
                        }
                      />
                    ))}
                  </div>
                </fieldset>
              </motion.div>
            )}

            {/* STEP 2: Features */}
            {step === 2 && (
              <motion.div key="step2" {...STEP_TRANSITION} className="space-y-4">
                <fieldset>
                  <legend className="text-xl font-bold font-barlow text-white mb-4">
                    2. Choose required technical capabilities:
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <span
                              aria-hidden="true"
                              className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center border transition-all ${
                                isChecked
                                  ? "bg-primary border-primary text-white"
                                  : "border-white/30 bg-black/40"
                              }`}
                            >
                              {isChecked && <FiCheckCircle className="text-sm" />}
                            </span>
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
              <motion.div key="step3" {...STEP_TRANSITION} className="space-y-6">
                <fieldset>
                  <legend className="text-xl font-bold font-barlow text-white mb-4">
                    3. Select delivery pace & view estimated breakdown:
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        icon={<FiClock className="text-primary text-xl" />}
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
          <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep((s) => s - 1)}
                className="group"
              >
                <FiArrowLeft
                  className="mr-2 group-hover:-translate-x-1 transition-transform"
                  aria-hidden="true"
                />
                <span>Back</span>
              </Button>
            ) : (
              <Link
                to="/services"
                className="inline-flex items-center text-xs sm:text-sm font-barlow text-gray-400 hover:text-white transition-colors duration-300 group"
              >
                <FiArrowLeft
                  className="mr-1.5 group-hover:-translate-x-1 transition-transform text-primary"
                  aria-hidden="true"
                />
                <span>Back to Services</span>
              </Link>
            )}

            {step < CALCULATOR_STEPS.length && (
              <Button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="group"
              >
                <span>Next Step</span>
                <FiArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </Button>
            )}
          </div>
        </div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
