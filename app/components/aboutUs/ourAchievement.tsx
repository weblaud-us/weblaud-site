import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface Achievement {
  label: string;
  value: number;
  suffix: string;
  duration?: number;
}

const achievements: Achievement[] = [
  { label: "CLIENTS", value: 30, suffix: "+", duration: 2.5 },
  { label: "PROJECTS", value: 50, suffix: "+", duration: 2.5 },
  { label: "HAPPY CLIENTS", value: 98, suffix: "%", duration: 2.2 },
  { label: "COUNTRIES SERVED", value: 8, suffix: "+", duration: 2.5 },
  { label: "YEARS OF EXPERIENCE", value: 1, suffix: "+", duration: 1.2 },
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
    <div className="bg-black pt-3 sm:pt-4 md:pt-4 pb-0 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 opacity-20" />

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
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
              <div className="relative bg-linear-to-br bg-card-bg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-light-black hover:border-gray-600/50 transition-all duration-300 backdrop-blur-sm overflow-hidden h-full flex flex-col justify-center min-h-[90px] sm:min-h-10">
                <div className="relative z-10 text-center space-y-1 sm:space-y-1.5">
                  <p className="text-gray-400 text-[10px] sm:text-xs md:text-xs lg:text-xs font-medium tracking-wider uppercase whitespace-nowrap overflow-hidden text-ellipsis px-1">
                    {achievement.label}
                  </p>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-br from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight whitespace-nowrap">
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
