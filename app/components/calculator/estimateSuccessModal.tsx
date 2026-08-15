import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, ShieldCheck, Zap } from "lucide-react";
import { FiCheckCircle, FiClock, FiArrowRight } from "react-icons/fi";
import { formatCurrency } from "~/lib/utils";
import type { EstimateResult as Estimate } from "~/lib/calculator";
import SectionBadge from "~/components/ui/section-badge";

interface EstimateSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimate: Estimate;
  onBookCall: () => void;
}

export function EstimateSuccessModal({
  isOpen,
  onClose,
  estimate,
  onBookCall,
}: EstimateSuccessModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
          style={{ pointerEvents: "auto" }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg bg-[#0e0e0e] border border-white/[0.12] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-center z-10 space-y-6"
          >
            {/* Ambient corner glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer z-20"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Header Icon & Badge */}
            <div className="flex flex-col items-center space-y-2.5 sm:space-y-3 relative z-10 pt-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                <FiCheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>

              <SectionBadge
                icon={<ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                color="#0a84ff"
                className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-xs"
              >
                <span className="font-bold tracking-[0.06em] text-primary whitespace-nowrap">
                  Estimate Sent
                </span>
                <span className="text-white/50 pl-1.5 sm:pl-2 border-l border-white/10 font-medium tracking-[0.04em] text-[9px] sm:text-[11px] whitespace-nowrap">
                  Scope Recorded
                </span>
              </SectionBadge>

              <h3 className="text-xl sm:text-3xl font-bold font-barlow text-white tracking-tight leading-snug">
                Scope & Estimate Confirmed!
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 font-barlow leading-relaxed max-w-sm">
                We've saved your custom technical blueprint. A copy is on its way to our team, and we'll review your specs right away.
              </p>
            </div>

            {/* Scope Summary Preview Box */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-black/60 border border-white/[0.08] text-left space-y-2.5 sm:space-y-3 relative z-10">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pb-2.5 sm:pb-3 border-b border-white/[0.06]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                    Est. Delivery
                  </span>
                  <p className="text-sm sm:text-lg font-bold font-barlow text-white flex items-center gap-1.5 mt-0.5">
                    <FiClock className="text-primary text-xs sm:text-sm shrink-0" />
                    <span>{estimate.totalWeeks} Sprints</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                    Investment Range
                  </span>
                  <p className="text-xs sm:text-base font-bold font-barlow text-primary mt-0.5 truncate">
                    {formatCurrency(estimate.costMin)} – {formatCurrency(estimate.costMax)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-barlow text-gray-300">
                <Zap className="w-3 h-3 text-primary shrink-0" />
                <span>Fixed-fee sprint pricing with 100% code ownership.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 relative z-10 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookCall();
                }}
                className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-barlow font-semibold text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-full transition-all duration-300 shadow-md shadow-blue-500/25 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
              >
                <span>Book Discovery Call</span>
                <span className="flex items-center justify-center w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                  <FiArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 sm:py-3 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white font-barlow transition-all duration-300 cursor-pointer whitespace-nowrap rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98]"
              >
                Continue Browsing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
