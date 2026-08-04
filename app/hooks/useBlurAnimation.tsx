import { useEffect, useRef, useState, useMemo } from "react";

/**
 * Custom hook for blur-in animation on scroll using Intersection Observer
 * @param threshold - Intersection observer threshold (default: 0.1)
 * @param resetOnExit - Whether to reset animation when element exits viewport (default: false)
 * @param resetKey - Optional key to reset animation when changed (e.g., route pathname)
 * @returns tuple of [ref, isVisible] where ref should be attached to the element to observe
 */
export function useBlurAnimation<T extends HTMLElement = HTMLDivElement>(
  threshold: number = 0.1,
  resetOnExit: boolean = false,
  resetKey?: string | number
) {
  // Start as true — content is visible by default.
  // We only hide it temporarily on scroll-triggered re-animation (resetOnExit=true).
  const [isVisible, setIsVisible] = useState(true);
  const ref = useRef<T>(null);

  // Reset animation when resetKey changes (e.g., on route change)
  useEffect(() => {
    setIsVisible(false);
  }, [resetKey]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Immediately check if element is already in the viewport on mount.
    const rect = element.getBoundingClientRect();
    const alreadyInView =
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0;

    if (alreadyInView) {
      setIsVisible(true);
      if (!resetOnExit) return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (resetOnExit) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, resetOnExit]);

  return [ref, isVisible] as const;
}

/**
 * Hook for animating multiple items with individual visibility tracking
 * Useful for lists where each item should animate independently
 * @param itemIds - Array of item IDs to track
 * @param threshold - Intersection observer threshold (default: 0.1)
 * @param resetOnExit - Whether to reset animation when element exits viewport (default: false)
 * @param resetKey - Optional key to reset animation when changed (e.g., route pathname)
 * @returns object with refs Map, visibleItems Set, and helper to check if item is visible
 */
export function useBlurAnimationList<TId extends string | number>(
  itemIds: TId[],
  threshold: number = 0.1,
  resetOnExit: boolean = false,
  resetKey?: string | number
) {
  // Stabilize itemIds to prevent infinite loops when called with inline map/filter
  const stableItemIds = useMemo(() => itemIds, [JSON.stringify(itemIds)]);

  // Start with all items visible — content renders immediately by default.
  const [visibleItems, setVisibleItems] = useState<Set<TId>>(() => new Set(stableItemIds));
  const itemRefs = useRef<Map<TId, HTMLElement>>(new Map());

  // Reset animation when resetKey changes (e.g., on route change)
  useEffect(() => {
    setVisibleItems(new Set());
  }, [resetKey]);

  useEffect(() => {
    const observers = new Map<TId, IntersectionObserver>();

    stableItemIds.forEach((itemId) => {
      const element = itemRefs.current.get(itemId);
      if (!element) return;

      // Immediately check if element is already in the viewport on mount.
      const rect = element.getBoundingClientRect();
      const alreadyInView =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;

      if (alreadyInView) {
        setVisibleItems((prev) => new Set([...prev, itemId]));
        if (!resetOnExit) return; // No need to observe if we won't reset
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, itemId]));
          } else if (resetOnExit) {
            // Reset animation when element leaves viewport
            setVisibleItems((prev) => {
              const newSet = new Set(prev);
              newSet.delete(itemId);
              return newSet;
            });
          }
        },
        { threshold, rootMargin: "0px 0px -50px 0px" }
      );

      observer.observe(element);
      observers.set(itemId, observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [stableItemIds, threshold, resetOnExit]);

  const isItemVisible = (itemId: TId) => visibleItems.has(itemId);

  return { itemRefs, visibleItems, isItemVisible } as const;
}
