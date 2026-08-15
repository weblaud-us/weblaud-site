import { useState, useEffect, useCallback } from "react";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { blurAnimation } from "~/lib/animations";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import SectionBadge from "../ui/section-badge";
import type { TeamMember } from "~/lib/types";

interface TheTeamProps {
  teamMembers: TeamMember[];
}

const TheTeam = ({ teamMembers }: TheTeamProps) => {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLDivElement>();

  const titleAnimation = blurAnimation(isTitleVisible, undefined, {
    variant: "default",
  });

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % teamMembers.length);
  }, [teamMembers.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  }, [teamMembers.length]);

  const isActive = (index: number) => index === active;

  // Auto-play
  useEffect(() => {
    if (isPaused || teamMembers.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, handleNext, teamMembers.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const randomRotateY = (index: number) => {
    // Deterministic angle based on index
    const angles = [-6, 7, -4, 5, -8, 6, -3, 8];
    return angles[index % angles.length];
  };

  if (teamMembers.length === 0) return null;

  const currentMember = teamMembers[active] || teamMembers[0];

  return (
    <section className="relative bg-black text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text & Controls */}
          <div
            ref={titleRef}
            className={`lg:col-span-6 space-y-6 ${titleAnimation.className}`}
            style={titleAnimation.style}
          >
            <SectionBadge
              icon={<FiUsers className="w-3.5 h-3.5" />}
              text="Our Core Team"
              badgeLabel="Engineering Leadership"
              color="#0a84ff"
              className="mb-2"
            />

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-barlow text-white tracking-tight leading-[1.15]">
              Built by Experts. Driven by Results.
            </h2>

            <p className="text-gray-300 font-barlow text-base sm:text-lg leading-relaxed max-w-lg">
              Partner with a dedicated, high-performance team. We build stable, scalable applications that handle your core business logic and deliver exceptional user experiences.
            </p>

            {/* Active Team Member Name & Title */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMember._id}
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="space-y-1"
                >
                  <h4 className="text-2xl font-bold font-barlow text-white tracking-tight">
                    {currentMember.name}
                  </h4>
                  <p className="text-primary font-mono text-sm sm:text-base font-medium">
                    {currentMember.title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous team member"
                className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.12] hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 cursor-pointer shadow-lg active:scale-95"
              >
                <FiArrowLeft className="h-4 w-4 text-gray-300 group-hover:text-primary transition-transform duration-300 group-hover:-translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next team member"
                className="group flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.12] hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 cursor-pointer shadow-lg active:scale-95"
              >
                <FiArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>

              <span className="text-xs font-mono text-gray-400 pl-3">
                <span className="text-white font-bold">{active + 1}</span> / {teamMembers.length}
              </span>
            </div>
          </div>

          {/* Right 3D Rotating Stack Cards */}
          <div
            className="lg:col-span-6 relative w-full flex items-center justify-center py-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative h-[380px] sm:h-[440px] md:h-[480px] w-full max-w-[360px] sm:max-w-[400px]">
              <AnimatePresence>
                {teamMembers.map((member, index) => {
                  const activeCard = isActive(index);
                  const rot = randomRotateY(index);

                  return (
                    <motion.div
                      key={member._id}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        rotate: rot,
                      }}
                      animate={{
                        opacity: activeCard ? 1 : 0.65,
                        scale: activeCard ? 1 : 0.94,
                        rotate: activeCard ? 0 : rot,
                        zIndex: activeCard ? 40 : teamMembers.length + 2 - index,
                        y: activeCard ? [0, -35, 0] : 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        rotate: rot,
                      }}
                      transition={{
                        duration: 0.45,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 origin-bottom rounded-3xl overflow-hidden bg-[#0e0e0e] border border-white/[0.12] shadow-2xl group hover:border-primary/50 transition-colors"
                    >
                      <div className="relative h-full w-full">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          width={500}
                          height={500}
                          loading="lazy"
                          className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-102 transition-all duration-700"
                          draggable={false}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                        {/* Card bottom info tag */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
                          <h4 className="text-2xl font-bold font-barlow text-white tracking-tight">
                            {member.name}
                          </h4>
                          <p className="text-primary font-mono text-sm tracking-wide font-medium">
                            {member.title}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheTeam;
