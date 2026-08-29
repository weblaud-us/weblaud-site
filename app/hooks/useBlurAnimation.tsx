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
          if (!resetOnExit) {
            observer.unobserve(element);
          }
        } else if (resetOnExit) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
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
  const itemIdsKey = useMemo(() => itemIds.join(","), [itemIds]);

  const [visibleItems, setVisibleItems] = useState<Set<TId>>(() => new Set(itemIds));
  const itemRefs = useRef<Map<TId, HTMLElement>>(new Map());

  // Reset animation when resetKey changes (e.g., on route change)
  useEffect(() => {
    setVisibleItems(new Set());
  }, [resetKey]);

  useEffect(() => {
    const elToId = new Map<HTMLElement, TId>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = elToId.get(entry.target as HTMLElement);
          if (id === undefined) return;

          if (entry.isIntersecting) {
            setVisibleItems((prev) => (prev.has(id) ? prev : new Set([...prev, id])));
            if (!resetOnExit) {
              observer.unobserve(entry.target);
            }
          } else if (resetOnExit) {
            setVisibleItems((prev) => {
              if (!prev.has(id)) return prev;
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }
        });
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    itemIds.forEach((itemId) => {
      const element = itemRefs.current.get(itemId);
      if (!element) return;

      elToId.set(element, itemId);

      const rect = element.getBoundingClientRect();
      const alreadyInView =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;

      if (alreadyInView) {
        setVisibleItems((prev) => (prev.has(itemId) ? prev : new Set([...prev, itemId])));
        if (resetOnExit) {
          observer.observe(element);
        }
      } else {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [itemIdsKey, threshold, resetOnExit]);

  const isItemVisible = (itemId: TId) => visibleItems.has(itemId);

  return { itemRefs, visibleItems, isItemVisible } as const;
}
