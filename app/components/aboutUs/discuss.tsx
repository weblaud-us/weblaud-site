import { useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import AnimatedGridBg, { type AnimatedGridBgRef } from "../ui/animated-grid-bg";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { FiArrowRight } from "react-icons/fi";

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Discuss = () => {
  const [containerRef, isVisible] = useBlurAnimation<HTMLDivElement>();
  const gridBgRef = useRef<AnimatedGridBgRef>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gridBgRef.current) gridBgRef.current.handleMouseMove(e);
  };
  const handleMouseLeave = () => {
    if (gridBgRef.current) gridBgRef.current.handleMouseLeave();
  };

  return (
    <>
      <section ref={containerRef} className="bg-black text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className={`relative border border-light-black rounded-3xl p-12 md:p-16 lg:p-[90px] overflow-hidden bg-linear-to-b from-primary/15 to-primary/3 ${getBlurAnimationClasses(isVisible)}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <AnimatedGridBg ref={gridBgRef} />

            {/* Ambient floating orbs */}
            <div
              className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
              style={{
                animation: "orb-float 7s ease-in-out infinite",
              }}
            />
            <div
              className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl"
              style={{
                animation: "orb-float 9s ease-in-out infinite reverse",
              }}
            />

            {/* Content */}
            <motion.div
              className="relative z-10 flex flex-col items-center justify-center text-center"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
            >
              {/* Eyebrow badge */}
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-barlow text-xs font-semibold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Free discovery call
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                variants={fadeUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-barlow text-white leading-tight max-w-2xl mb-5"
              >
                Tell us what{" "}
                <span className="text-primary">you're building.</span>
              </motion.h2>

              {/* Sub-copy */}
              <motion.p
                variants={fadeUp}
                className="text-base md:text-lg font-barlow text-white/60 max-w-xl leading-relaxed mb-10"
              >
                We'll come back within a day with a clear plan — no jargon,
                no lock-in, no pitch deck.
              </motion.p>

              {/* CTA button with pulse ring */}
              <motion.div variants={fadeUp} className="relative">
                {/* Pulse ring */}
                <span
                  className="absolute inset-0 rounded-full bg-primary opacity-30 pointer-events-none"
                  style={{ animation: "cta-pulse 2.4s ease-out infinite" }}
                />
                <button
                  id="discuss-book-call-cta"
                  onClick={() => setIsModalOpen(true)}
                  className="group relative z-10 inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-barlow font-semibold text-base px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.04] cursor-pointer"
                >
                  <span>Book a free call</span>
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                    <FiArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                  </span>
                </button>
              </motion.div>

              {/* Micro-copy trust signal */}
              <motion.p
                variants={fadeUp}
                className="mt-5 font-barlow text-xs text-white/30 tracking-wide"
              >
                15-min session &nbsp;·&nbsp; No commitment &nbsp;·&nbsp; Response within 24 h
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Keyframe styles */}
      <style>{`
        @keyframes orb-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-22px) scale(1.06); }
        }
        @keyframes cta-pulse {
          0%   { transform: scale(1);   opacity: 0.3; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Discuss;
