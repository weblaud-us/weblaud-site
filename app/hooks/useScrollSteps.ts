import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

/** Same media query as the `pin:` variant in app.css. */
export const PIN_QUERY = "(min-width: 64rem) and (min-height: 560px)";

/**
 * Drives a scroll-pinned section: the section is a tall track whose inner
 * panel is `pin:sticky`, and each item owns an equal slice of the track's
 * scroll. The track is 100svh plus 40svh per item, so the last item also
 * holds for a full step before the panel releases.
 *
 * Below the pin query the track is a normal section, so scroll is ignored and
 * `goTo` just sets the index.
 *
 * @param count - Number of items the section steps through
 * @returns trackRef for the section, the active index, and goTo(i), which
 *   also moves the scroll position to step i so scroll and clicks agree
 */
export function useScrollSteps<T extends HTMLElement = HTMLElement>(count: number) {
  const trackRef = useRef<T>(null);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Scroll fires every frame; only touch React state when the step changes.
  const indexRef = useRef(0);
  const show = (next: number) => {
    if (next === indexRef.current) return;
    indexRef.current = next;
    setIndex(next);
  };
  const stepFor = (progress: number) => Math.min(count - 1, Math.max(0, Math.floor(progress * count)));

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (pinned) show(stepFor(progress));
  });

  // Entering pinned mode mid-page (a resize, or a reload part way down)
  // should show the step the scroll position is already on.
  useEffect(() => {
    if (pinned) show(stepFor(scrollYProgress.get()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinned]);

  const goTo = useCallback(
    (next: number) => {
      show(next);
      const track = trackRef.current;
      if (!pinned || !track) return;
      // Land in the middle of the step. The panel is sticky, so an instant
      // jump is invisible, and it skips the steps in between.
      const top = track.getBoundingClientRect().top + window.scrollY;
      const travel = track.offsetHeight - window.innerHeight;
      const y = top + ((next + 0.5) / count) * travel;
      const lenis = (window as { lenis?: { scrollTo: (y: number, opts: { immediate: boolean }) => void } | null }).lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo({ top: y, behavior: "instant" });
    },
    [pinned, count],
  );

  return { trackRef, index, goTo } as const;
}
