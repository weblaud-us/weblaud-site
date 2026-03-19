import { useState, useEffect } from "react";
import person01 from "~/assets/person-01.svg";
import person02 from "~/assets/person-02.svg";
import person03 from "~/assets/person-03.svg";
import person04 from "~/assets/person-04.svg";
import shuvo from "~/assets/shuvo.png";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { blurAnimation } from "~/lib/animations";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

const TheTeam = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const teamMembers = [
    {
      id: 1,
      name: "Shuvo Chandra Debnath",
      role: "Software Engineer",
      image: shuvo,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Full Stack Developer",
      image: person02,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Creative Director",
      image: person03,
    },
    {
      id: 4,
      name: "David Kim",
      role: "UI/UX Designer",
      image: person04,
    },
  ];

  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLDivElement>();

  const titleAnimation = blurAnimation(isTitleVisible, undefined, {
    variant: "default",
  });

  // Auto-play carousel
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDirection(1);
  //     setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  //   }, 4000);

  //   return () => clearInterval(interval);
  // }, [teamMembers.length]);

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = Math.abs(offset.x) * velocity.x;

    if (swipe < -10000) {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    } else if (swipe > 10000) {
      setDirection(-1);
      setCurrentIndex(
        (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
      );
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
        <div className="flex flex-col lg:flex-row gap-40 items-center">
          <div
            ref={titleRef}
            className={`lg:max-w-md space-y-4 ${titleAnimation.className}`}
            style={titleAnimation.style}
          >
            <h3 className="text-blue-500 md:text-2xl font-semibold font-barlow">
              Our People
            </h3>
            <h2 className="text-2xl md:text-4xl font-semibold font-barlow leading-tight">
              Meet the Heart & Soul of Weblaud
            </h2>
            <p className="text-gray-400 font-barlow max-w-sm">
              Behind every line of code is a human being who cares about your
              success. Swipe to meet the passionate team ready to bring your
              vision to life.
            </p>
          </div>

          <div className="flex-1 relative w-full h-[500px] flex items-center justify-center lg:justify-start pl-0 lg:pl-24">
            <div className="relative w-full max-w-sm h-[450px]">
              {teamMembers.map((member, index) => {
                const style = getCardStyle(index);
                const isCurrent = index === currentIndex;

                return (
                  <motion.div
                    key={member.id}
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-light-black to-black border border-blue-500/20 shadow-2xl"
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
                        loading="lazy"
                        className="w-full h-full object-cover"
                        draggable={false}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h4 className="text-2xl font-bold font-barlow mb-1 text-white">
                          {member.name}
                        </h4>
                        <p className="text-blue-400 font-barlow font-medium">
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
