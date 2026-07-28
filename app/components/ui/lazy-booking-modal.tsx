import { lazy, Suspense, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Lazy-load the BookingModal to avoid including it in the initial JS bundle.
// This defers ~36 KiB of JS until the user actually opens the modal.
const BookingModal = lazy(() =>
  import("~/components/ui/booking-modal").then((m) => ({
    default: m.BookingModal,
  }))
);

interface LazyBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LazyBookingModal = ({
  isOpen,
  onClose,
}: LazyBookingModalProps) => {
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
    }
  }, [isOpen]);

  // Only render (and thus load) the modal when it's first opened or after it has been opened
  if (!hasBeenOpened) return null;

  return (
    <Suspense
      fallback={
        isOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : null
      }
    >
      <BookingModal isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
};
