import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsLoading(true);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-card-bg rounded-t-2xl sm:rounded-2xl overflow-hidden border-t sm:border border-white/10 shadow-2xl h-[90vh] sm:h-auto"
          >
            {/* Header / Close Button */}
            <div className="absolute top-0 right-0 z-20 p-4 flex justify-end pointer-events-none">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 transition-colors cursor-pointer backdrop-blur-md pointer-events-auto"
              >
                <X size={20} />
              </button>
            </div>

            {/* Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-card-bg">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            )}

            <div className="w-full h-full sm:h-[80vh] bg-white">
              <iframe
                src="https://zcal.co/i/JW03svfU?showBackground=1&embed=1&embedType=iframe"
                loading="lazy"
                style={{ border: "none", width: "100%", height: "100%" }}
                id="zcal-invite"
                onLoad={() => setIsLoading(false)}
              ></iframe>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
