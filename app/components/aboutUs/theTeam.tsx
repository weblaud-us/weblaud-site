import { useState, useEffect } from "react";
import person01 from "~/assets/person-01.svg";
import person02 from "~/assets/person-02.svg";
import person03 from "~/assets/person-03.svg";
import person04 from "~/assets/person-04.svg";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { blurAnimation } from "~/lib/animations";
import { motion, AnimatePresence } from "framer-motion";

const TheTeam = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Co-Founder & CEO",
      image: person01,
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
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    }, 2500); // Change slide every 2.5 seconds

    return () => clearInterval(interval);
  }, [teamMembers.length]);

  return (
    <section className="relative bg-black text-white py-20 px-4 overflow-hidden">
      <motion.div className="absolute top-10 left-10 w-50 h-50 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
      <motion.div className="absolute bottom-10 right-10 w-50 h-50 rounded-full bg-primary/30 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div
            ref={titleRef}
            className={`lg:max-w-md space-y-4 ${titleAnimation.className}`}
            style={titleAnimation.style}
          >
            <h3 className="text-blue-500 md:text-lg font-semibold font-barlow">
              Our Talent
            </h3>
            <h2 className="text-2xl md:text-4xl font-semibold font-barlow leading-tight">
              Meet The Talented and Creative Members of Our Team
            </h2>
          </div>

          <div className="flex-1 relative w-full max-w-xl mx-auto perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  staggerChildren: 0.1,
                }}
                className="grid grid-cols-2 gap-6"
              >
                {/* First Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-light-black to-black border border-blue-500/20 hover:border-blue-500/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="relative aspect-[3/4]">
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{
                        background: [
                          "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, transparent 50%, rgba(168,85,247,0.2) 100%)",
                          "linear-gradient(135deg, rgba(168,85,247,0.2) 0%, transparent 50%, rgba(59,130,246,0.2) 100%)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                    <img
                      src={teamMembers[currentIndex].image}
                      alt={teamMembers[currentIndex].name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="text-lg md:text-xl font-bold font-barlow mb-1 text-white group-hover:text-blue-400 transition-colors duration-300">
                        {teamMembers[currentIndex].name}
                      </h4>
                      <p className="text-sm md:text-base text-gray-300 font-barlow group-hover:text-white transition-colors duration-300">
                        {teamMembers[currentIndex].role}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Second Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-light-black to-black border border-blue-500/20 hover:border-blue-500/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                  whileHover={{
                    scale: 1.05,
                    rotateY: -5,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="relative aspect-[3/4]">
                    {/* Animated gradient overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{
                        background: [
                          "linear-gradient(135deg, rgba(168,85,247,0.2) 0%, transparent 50%, rgba(59,130,246,0.2) 100%)",
                          "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, transparent 50%, rgba(168,85,247,0.2) 100%)",
                        ],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                    <img
                      src={
                        teamMembers[(currentIndex + 1) % teamMembers.length]
                          .image
                      }
                      alt={
                        teamMembers[(currentIndex + 1) % teamMembers.length]
                          .name
                      }
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:-rotate-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="text-lg md:text-xl font-bold font-barlow mb-1 text-white group-hover:text-blue-400 transition-colors duration-300">
                        {
                          teamMembers[(currentIndex + 1) % teamMembers.length]
                            .name
                        }
                      </h4>
                      <p className="text-sm md:text-base text-gray-300 font-barlow group-hover:text-white transition-colors duration-300">
                        {
                          teamMembers[(currentIndex + 1) % teamMembers.length]
                            .role
                        }
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-blue-500"
                      : "w-2 bg-gray-600 hover:bg-gray-500"
                  }`}
                  aria-label={`Go to team member ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheTeam;
