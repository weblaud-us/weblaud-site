import { lazy, Suspense, useState, useEffect } from "react";

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
    <Suspense fallback={null}>
      <BookingModal isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
};
