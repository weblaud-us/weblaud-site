import { useState } from "react";
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
  FiRefreshCw
} from "react-icons/fi";
import { Link } from "react-router";
import { TIMELINE } from "~/lib/constants";

interface Option {
  id: string;
  title: string;
  desc: string;
  weeks: number;
  costMultiplier: number;
  icon?: React.ReactNode;
}

const PROJECT_TYPES: Option[] = [
  {
    id: "operations",
    title: "Operations Platform / Admin Portal",
    desc: "Custom internal dashboards, RBAC workflows, data management to replace spreadsheets.",
    weeks: 6,
    costMultiplier: 1.0,
    icon: <FiLayers className="text-primary text-2xl" />,
  },
  {
    id: "webapp",
    title: "SaaS & Web Application",
    desc: "Customer-facing portal, subscription engine, high-concurrency cloud web app.",
    weeks: 8,
    costMultiplier: 1.25,
    icon: <FiGlobe className="text-blue-400 text-2xl" />,
  },
  {
    id: "mobile",
    title: "Mobile App & Backend",
    desc: "iOS & Android mobile apps paired with scalable cloud microservices.",
    weeks: 8,
    costMultiplier: 1.3,
    icon: <FiSmartphone className="text-purple-400 text-2xl" />,
  },
  {
    id: "ai",
    title: "AI & Machine Learning Engine",
    desc: "Custom RAG pipelines, predictive analytics, automated decision-making models.",
    weeks: 10,
    costMultiplier: 1.5,
    icon: <FiCpu className="text-emerald-400 text-2xl" />,
  },
];

const FEATURES_LIST: Option[] = [
  { id: "auth", title: "User Auth & Multi-Role RBAC", desc: "SSO, OAuth, granular permissions", weeks: 1, costMultiplier: 0.1 },
  { id: "payments", title: "Stripe / Payment Billing", desc: "Subscriptions, invoicing, webhooks", weeks: 1, costMultiplier: 0.15 },
  { id: "ai_integration", title: "Custom AI / LLM Feature", desc: "Smart search, automated summaries, predictions", weeks: 2, costMultiplier: 0.25 },
  { id: "realtime", title: "Real-time Sync & WebSockets", desc: "Live chat, notifications, live data updates", weeks: 1.5, costMultiplier: 0.2 },
  { id: "integrations", title: "Third-Party API Integrations", desc: "CRM, ERP, Quickbooks, Zapier connections", weeks: 1.5, costMultiplier: 0.15 },
  { id: "mobile_sync", title: "Offline Storage & Mobile Sync", desc: "Offline capability for field workers", weeks: 2, costMultiplier: 0.2 },
];

const TIMELINE_SPEEDS: Option[] = [
  { id: "standard", title: "Standard Sprint Pace", desc: `Regular agile iterations (${TIMELINE.min}–${TIMELINE.max} weeks total)`, weeks: 0, costMultiplier: 1.0 },
  { id: "expedited", title: "Expedited Launch Pace", desc: "Dedicated multi-engineer squad for accelerated delivery", weeks: -2, costMultiplier: 1.25 },
];

export default function ProjectCalculator() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>("operations");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["auth", "integrations"]);
  const [selectedSpeed, setSelectedSpeed] = useState<string>("standard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Calculation Logic
  const projectTypeObj = PROJECT_TYPES.find((p) => p.id === selectedType) || PROJECT_TYPES[0];
  const speedObj = TIMELINE_SPEEDS.find((s) => s.id === selectedSpeed) || TIMELINE_SPEEDS[0];

  const totalFeatureWeeks = selectedFeatures.reduce((acc, featId) => {
    const feat = FEATURES_LIST.find((f) => f.id === featId);
    return acc + (feat ? feat.weeks : 0);
  }, 0);

  // Bound timeline to the company delivery range (single source of truth)
  const rawWeeks = projectTypeObj.weeks + totalFeatureWeeks + speedObj.weeks;
  const totalWeeks = Math.min(TIMELINE.max, Math.max(TIMELINE.min, Math.round(rawWeeks * 10) / 10));

  // 2026 Affordable & Standard Base Pricing ($4,500 base)
  const baseCost = 4500;
  const featureCostMultiplier = selectedFeatures.reduce((acc, featId) => {
    const feat = FEATURES_LIST.find((f) => f.id === featId);
    return acc + (feat ? feat.costMultiplier : 0);
  }, 0);

  const calculatedCostMin = Math.round(
    (baseCost * projectTypeObj.costMultiplier * (1 + featureCostMultiplier) * speedObj.costMultiplier) / 500
  ) * 500;
  const calculatedCostMax = Math.round((calculatedCostMin * 1.28) / 500) * 500;

  const handleReset = () => {
    setStep(1);
    setSelectedType("operations");
    setSelectedFeatures(["auth", "integrations"]);
    setSelectedSpeed("standard");
  };

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
            Select your software requirements below to instantly generate an estimated delivery timeline and investment range.
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-10 relative z-10">
          {[
            { num: 1, label: "Project Type" },
            { num: 2, label: "Capabilities" },
            { num: 3, label: "Pace & Estimate" },
          ].map((item) => (
            <div key={item.num} className="flex flex-col items-center">
              <button
                onClick={() => item.num <= step && setStep(item.num)}
                className={`w-10 h-10 rounded-full font-barlow font-bold flex items-center justify-center transition-all duration-300 ${
                  step === item.num
                    ? "bg-primary text-white shadow-lg shadow-primary/40 ring-4 ring-primary/20"
                    : step > item.num
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-gray-500 border border-white/10"
                }`}
              >
                {step > item.num ? <FiCheckCircle /> : item.num}
              </button>
              <span className="text-xs font-barlow mt-2 text-gray-400 font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Steps */}
        <div className="relative z-10 min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* STEP 1: Project Type */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold font-barlow text-white mb-4">
                  1. Select your primary software focus:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROJECT_TYPES.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex items-start space-x-4 ${
                        selectedType === type.id
                          ? "bg-primary/10 border-primary shadow-lg shadow-primary/10 scale-[1.01]"
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="p-3 bg-black/40 rounded-xl shrink-0">
                        {type.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold font-barlow text-white flex items-center justify-between">
                          {type.title}
                          {selectedType === type.id && (
                            <FiCheckCircle className="text-primary ml-2" />
                          )}
                        </h4>
                        <p className="text-xs text-gray-400 font-barlow mt-1.5 leading-relaxed">
                          {type.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Features */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold font-barlow text-white mb-4">
                  2. Choose required technical capabilities:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FEATURES_LIST.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat.id);
                    return (
                      <div
                        key={feat.id}
                        onClick={() => toggleFeature(feat.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                          isChecked
                            ? "bg-primary/10 border-primary shadow-sm"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <h4 className="text-sm font-bold font-barlow text-white">
                            {feat.title}
                          </h4>
                          <p className="text-xs text-gray-400 font-barlow mt-1">
                            {feat.desc}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                            isChecked
                              ? "bg-primary border-primary text-white"
                              : "border-white/30 bg-black/40"
                          }`}
                        >
                          {isChecked && <FiCheckCircle className="text-sm" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Timeline & Final Estimate */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold font-barlow text-white mb-4">
                  3. Select delivery pace & view estimated breakdown:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {TIMELINE_SPEEDS.map((speed) => (
                    <div
                      key={speed.id}
                      onClick={() => setSelectedSpeed(speed.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        selectedSpeed === speed.id
                          ? "bg-primary/10 border-primary"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <h4 className="text-base font-bold font-barlow text-white flex items-center">
                        <FiClock className="mr-2 text-primary" />
                        {speed.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-barlow mt-1">
                        {speed.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Estimate Result Box */}
                <div className="mt-8 bg-gradient-to-br from-primary/20 via-blue-900/20 to-black border border-primary/30 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                      <span className="text-xs uppercase font-barlow font-semibold text-gray-400 tracking-wider">
                        Estimated Delivery Time
                      </span>
                      <div className="text-3xl sm:text-4xl font-bold font-barlow text-white mt-1 flex items-center">
                        <FiClock className="mr-3 text-primary" />
                        {totalWeeks} SPRINT WEEKS
                      </div>
                      <p className="text-xs text-gray-400 font-barlow mt-2">
                        Includes discovery, UX prototyping, backend engineering, QA testing, and launch.
                      </p>
                    </div>

                    <div className="text-left">
                      <span className="text-xs uppercase font-barlow font-semibold text-gray-400 tracking-wider">
                        Estimated Investment Range
                      </span>
                      <div className="text-3xl sm:text-4xl font-bold font-barlow text-primary mt-1">
                        ${calculatedCostMin.toLocaleString()} – ${calculatedCostMax.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-400 font-barlow mt-2">
                        Fixed-fee sprint pricing. Zero hidden costs or unexpected hourly overruns.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full sm:w-auto px-8 py-4 text-base font-bold"
                    >
                      Book Call with This Scope
                      <FiArrowRight className="ml-2" />
                    </Button>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center text-xs text-gray-400 hover:text-white font-barlow transition-colors"
                    >
                      <FiRefreshCw className="mr-1.5" /> Start Over
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-5 py-2.5 font-barlow font-semibold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 inline-flex items-center shadow-md active:scale-95 cursor-pointer group"
              >
                <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
            ) : (
              <Link
                to="/services"
                className="inline-flex items-center text-xs sm:text-sm font-barlow text-gray-400 hover:text-white transition-colors duration-300 group"
              >
                <FiArrowLeft className="mr-1.5 group-hover:-translate-x-1 transition-transform text-primary" />
                <span>Back to Services</span>
              </Link>
            )}

            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2.5 font-barlow font-semibold text-xs sm:text-sm text-white bg-primary hover:bg-blue-600 rounded-xl shadow-[0_2px_12px_rgba(10,132,255,0.4)] hover:shadow-[0_4px_20px_rgba(10,132,255,0.5)] transition-all duration-300 inline-flex items-center active:scale-95 cursor-pointer group"
              >
                <span>Next Step</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
