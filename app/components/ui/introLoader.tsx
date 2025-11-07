import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface IntroLoaderProps {
  onComplete?: () => void;
}

const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // Stage 1: Logo reveal (0-1.2s)
    const stage1Timer = setTimeout(() => setAnimationStage(1), 1200);
    // Stage 2: Full reveal (1.2-2.2s)
    const stage2Timer = setTimeout(() => setAnimationStage(2), 2200);
    // Notify completion before exit animation
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2800);

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);
  return (
    <motion.div
      className="fixed inset-0 bg-black z-9999 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? "#0a84ff" : "#ffffff",
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated grid background */}
      <motion.div
        className="absolute inset-0 bg-grid-pattern grid-fade-mask opacity-20"
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main logo container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Logo circle with pulsing ring */}
        <div className="relative">
          {/* Outer pulsing rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-primary"
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
              style={{
                width: "200px",
                height: "200px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* Logo container with morphing background */}
          <motion.div
            className="relative flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5 backdrop-blur-xl rounded-full overflow-hidden"
            style={{
              width: "200px",
              height: "200px",
              boxShadow:
                "0 0 60px rgba(10, 132, 255, 0.3), inset 0 0 60px rgba(10, 132, 255, 0.1)",
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {/* Inner rotating gradient */}
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, rgba(10, 132, 255, 0.3) 50%, transparent 100%)",
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Logo text container */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {/* "W" Letter with stagger animation */}
              <motion.div
                className="flex items-center justify-center mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.span
                  className="text-6xl font-bold font-lexend"
                  style={{
                    background:
                      "linear-gradient(135deg, #0a84ff 0%, #ffffff 50%, #0a84ff 100%)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  W
                </motion.span>
              </motion.div>

              {/* Company name with letter stagger */}
              <motion.div
                className="flex space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {["W", "E", "B", "L", "A", "U", "D"].map((letter, index) => (
                  <motion.span
                    key={index}
                    className="text-lg font-semibold font-lexend text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.6 + index * 0.05,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Loading indicator */}
        <motion.div
          className="mt-12 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {/* Animated dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <motion.div
            className="mt-4 w-64 h-1 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 256 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-linear-to-r from-primary to-blue-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Loading text */}
          <motion.p
            className="mt-4 text-sm text-white/60 font-poppins tracking-wider"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Loading Experience...
          </motion.p>
        </motion.div>
      </div>

      {/* Corner accents */}
      {[
        { top: 20, left: 20, rotate: 0 },
        { top: 20, right: 20, rotate: 90 },
        { bottom: 20, left: 20, rotate: -90 },
        { bottom: 20, right: 20, rotate: 180 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={pos}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M0 0 L40 0 L40 2 L2 2 L2 40 L0 40 Z"
              fill="#0a84ff"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default IntroLoader;
