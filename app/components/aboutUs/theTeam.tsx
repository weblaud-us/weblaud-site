import { useState, useEffect, useCallback } from "react";
import sakib from "~/assets/team/sakib_w.png";
import shoaib from "~/assets/team/shoaib_weblaud.png";
import ruhul from "~/assets/team/ruhul_w.png";
import ishtique from "~/assets/team/ishtique.png";
import jubayed from "~/assets/team/Jubayed.png";
import shuvo from "~/assets/team/shuvo.png";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { blurAnimation } from "~/lib/animations";
import {
  motion,
  AnimatePresence,
  useMotionValue,
} from "framer-motion";

const TheTeam = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: "Sakib Al Jaber",
      role: "Lead Software Engineer",
      image: sakib,
    },
    {
      id: 2,
      name: "Shoaib Al Jayed",
      role: "Software Engineer",
      image: shoaib,
    },
    {
      id: 3,
      name: "Ruhul Amin",
      role: "Full Stack Engineer",
      image: ruhul,
    },
    {
      id: 4,
      name: "Kazi Arif Ishtique",
      role: "Senior Software Engineer",
      image: ishtique,
    },
    {
      id: 5,
      name: "Jubayed Islam",
      role: "Software Engineer",
      image: jubayed,
    },
    {
      id: 6,
      name: "Shuvo Chandra Debnath",
      role: "Software Engineer",
      image: shuvo,
    },
  ];

  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLDivElement>();

  const titleAnimation = blurAnimation(isTitleVisible, undefined, {
    variant: "default",
  });

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  }, [teamMembers.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  }, [teamMembers.length]);

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x;

    if (swipe < -10000) {
      handleNext();
    } else if (swipe > 10000) {
      handlePrev();
    }
  };

  const getCardStyle = (index: number) => {
    const diff =
      (index - currentIndex + teamMembers.length) % teamMembers.length;

    // Only show top 3 cards
    if (diff > 2) return { zIndex: 0, opacity: 0, scale: 0.8, x: 0 };

    const zIndex = 3 - diff;
    const scale = 1 - diff * 0.05;
    const x = diff * 20; // Offset to the right
    const opacity = 1 - diff * 0.2;
    const filter = diff > 0 ? "blur(4px)" : "blur(0px)";

    return { zIndex, scale, x, opacity, filter };
  };

  return (
    <section className="relative bg-black text-white py-20 px-4 overflow-hidden">
      <motion.div className="absolute top-10 left-10 w-50 h-50 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
      <motion.div className="absolute bottom-10 right-10 w-50 h-50 rounded-full bg-primary/30 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-40 items-center">
          <div
            ref={titleRef}
            className={`lg:max-w-md space-y-4 ${titleAnimation.className}`}
            style={titleAnimation.style}
          >
            <h3 className="text-blue-500 md:text-2xl font-semibold font-barlow tracking-wider uppercase text-sm">
              Engineering Excellence
            </h3>
            <h2 className="text-3xl md:text-5xl font-bold font-barlow leading-tight">
              Built by Engineers. Driven by Results.
            </h2>
            <p className="text-gray-400 font-barlow max-w-sm text-lg">
              Partner with a dedicated team of senior software engineers. We don't just write code; we build scalable, high-performance applications engineered to drive your business forward.
            </p>

            {/* Desktop Navigation Controls */}
            <div className="hidden lg:flex gap-4 pt-6">
              <button 
                onClick={handlePrev}
                className="p-3 rounded-full border border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500 hover:text-cyan-400 transition-all duration-300"
                aria-label="Previous team member"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 hover:text-cyan-400"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button 
                onClick={handleNext}
                className="p-3 rounded-full border border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500 hover:text-cyan-400 transition-all duration-300"
                aria-label="Next team member"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 hover:text-cyan-400"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div 
            className="flex-1 relative w-full h-[500px] flex items-center justify-center lg:justify-start pl-0 lg:pl-24"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative w-full max-w-sm h-[450px]">
              {teamMembers.map((member, index) => {
                const style = getCardStyle(index);
                const isCurrent = index === currentIndex;

                return (
                  <motion.div
                    key={member.id}
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-light-black to-black border border-blue-500/20 shadow-2xl group hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-500"
                    initial={false}
                    animate={style}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag={isCurrent ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={handleDragEnd}
                    style={{
                      cursor: isCurrent ? "grab" : "default",
                      transformOrigin: "center left",
                      touchAction: "pan-y",
                    }}
                    whileTap={{ cursor: "grabbing" }}
                  >
                    <div className="relative h-full w-full">
                      {/* Animated gradient overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-50"
                        animate={{
                          background: [
                            "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, transparent 50%, rgba(168,85,247,0.1) 100%)",
                            "linear-gradient(135deg, rgba(168,85,247,0.1) 0%, transparent 50%, rgba(59,130,246,0.1) 100%)",
                          ],
                        }}
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />

                      <img
                        src={member.image}
                        alt={member.name}
                        width={400}
                        height={400}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        draggable={false}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h4 className="text-2xl font-bold font-barlow mb-1 text-white group-hover:text-cyan-50 transition-colors">
                          {member.name}
                        </h4>
                        <p className="text-cyan-400 font-mono text-sm tracking-wide">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheTeam;
