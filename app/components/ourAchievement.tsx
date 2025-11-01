import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface Achievement {
  label: string;
  value: number;
  suffix: string;
  duration?: number;
}

const achievements: Achievement[] = [
  { label: "CLIENTS", value: 200, suffix: "+", duration: 2 },
  { label: "PROJECTS", value: 280, suffix: "+", duration: 2.2 },
  { label: "HAPPY CLIENTS", value: 100, suffix: "%", duration: 1.8 },
  { label: "FOLLOWER", value: 420, suffix: "K", duration: 2.5 },
  { label: "Years of Experience", value: 10, suffix: "+", duration: 1.5 },
];

function AnimatedCounter({
  value,
}: {
  value: number;
  suffix: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return (
    <span ref={ref} className="inline-block">
      0
    </span>
  );
}

const OurAchievement = () => {
  return (
    <div className="bg-black pt-3 sm:pt-4 md:pt-5 lg:pt-6 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" />

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.label}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group h-full sm:hover:scale-[1.03] sm:hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative bg-linear-to-br bg-card-bg rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-7 border border-light-black hover:border-gray-600/50 transition-all duration-300 backdrop-blur-sm overflow-hidden h-full flex flex-col justify-center min-h-[100px] sm:min-h-10">
                <div className="relative z-10 text-center space-y-1.5 sm:space-y-2">
                  <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm lg:text-xs xl:text-sm font-medium tracking-wider uppercase whitespace-nowrap overflow-hidden text-ellipsis px-1">
                    {achievement.label}
                  </p>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold bg-linear-to-br from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight whitespace-nowrap">
                    <AnimatedCounter
                      value={achievement.value}
                      suffix={achievement.suffix}
                      duration={achievement.duration}
                    />
                    <span className="text-blue-400">{achievement.suffix}</span>
                  </h3>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-0.5 bg-linear-to-r from-transparent via-blue-500/50 to-transparent group-hover:via-blue-400/70 transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default OurAchievement;
