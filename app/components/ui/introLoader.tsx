import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import weblaudLogo from "~/assets/weblaud-logo.svg";

interface IntroLoaderProps {
  onComplete?: () => void;
}

const IntroLoader = ({ onComplete }: IntroLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);

  const loadingStages = [
    "Initializing systems...",
    "Loading resources...",
    "Preparing experience...",
    "Almost ready...",
    "Done!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 15);

    const stageInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 25) setLoadingStage(0);
        else if (prev < 50) setLoadingStage(1);
        else if (prev < 75) setLoadingStage(2);
        else if (prev < 90) setLoadingStage(3);
        else setLoadingStage(4);
        return prev;
      });
    }, 15);

    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(stageInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-black z-9999 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute w-96 h-96 top-1/4 -left-48 bg-blue-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-80 h-80 bottom-1/4 -right-40 bg-primary/25 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.35, 0.25],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute w-72 h-72 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 132, 255, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(10, 132, 255, 0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          className="relative mb-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-0 w-40 h-40 -left-20 -top-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-full h-full" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#gradient1)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                opacity="1"
              />
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#0a84ff" stopOpacity="0" />
                  <stop offset="50%" stopColor="#0a84ff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0a84ff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.div
            className="absolute inset-0 w-40 h-40 -left-20 -top-20"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-full h-full" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="50"
                stroke="url(#gradient2)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="3 6"
                opacity="0.8"
              />
              <defs>
                <linearGradient
                  id="gradient2"
                  x1="100%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
                  <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.div
            className="relative w-32 h-32 rounded-full flex items-center justify-center bg-light-black/40 backdrop-blur-xl border border-primary/20"
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
              rotateY: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2,
              rotateY: {
                duration: 8,
                repeat: Infinity,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-400/15 blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.5,
              }}
            />

            <motion.img
              src={weblaudLogo}
              alt="Weblaud"
              className="w-20 h-20 relative z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -5, 0],
              }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.5,
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex gap-4">
            <div className="flex">
              {["W", "e", "l", "c", "o", "m", "e"].map((letter, index) => (
                <motion.span
                  key={index}
                  className="text-4xl md:text-5xl font-bold font-lexend text-white inline-block"
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -5,
                    color: "#0a84ff",
                    transition: { duration: 0.2 },
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <div className="flex">
              {["T", "o"].map((letter, index) => (
                <motion.span
                  key={index}
                  className="text-4xl md:text-5xl font-bold font-lexend text-white inline-block"
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + (7 + index) * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -5,
                    color: "#0a84ff",
                    transition: { duration: 0.2 },
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            initial={{ scale: 0 }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            style={{ transitionDelay: "0.8s" }}
          />
        </motion.div>

        <div className="h-10 mb-12">
          <motion.div className="flex items-center justify-center relative gap-2">
            <div className="flex">
              {["C", "r", "a", "f", "t", "i", "n", "g"].map((char, index) => (
                <motion.span
                  key={`crafting-${index}`}
                  className="text-lg md:text-xl text-white font-poppins font-semibold relative"
                  initial={{ opacity: 0, scaleY: 0, y: 10 }}
                  animate={{ opacity: 1, scaleY: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.6 + index * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformOrigin: "center" }}
                >
                  <motion.span
                    className="absolute inset-0 text-primary blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{
                      duration: 1.5,
                      delay: 0.6 + index * 0.03,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {char}
                  </motion.span>
                  {char}
                </motion.span>
              ))}
            </div>

            <div className="flex">
              {["D", "i", "g", "i", "t", "a", "l"].map((char, index) => (
                <motion.span
                  key={`digital-${index}`}
                  className="text-lg md:text-xl text-white font-poppins font-semibold relative"
                  initial={{ opacity: 0, scaleY: 0, y: 10 }}
                  animate={{ opacity: 1, scaleY: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.6 + (8 + index) * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformOrigin: "center" }}
                >
                  <motion.span
                    className="absolute inset-0 text-primary blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{
                      duration: 1.5,
                      delay: 0.6 + (8 + index) * 0.03,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {char}
                  </motion.span>
                  {char}
                </motion.span>
              ))}
            </div>

            <div className="flex">
              {["E", "x", "c", "e", "l", "l", "e", "n", "c", "e"].map(
                (char, index) => (
                  <motion.span
                    key={`excellence-${index}`}
                    className="text-lg md:text-xl text-white font-poppins font-semibold relative"
                    initial={{ opacity: 0, scaleY: 0, y: 10 }}
                    animate={{ opacity: 1, scaleY: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.6 + (15 + index) * 0.03,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: "center" }}
                  >
                    <motion.span
                      className="absolute inset-0 text-primary blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{
                        duration: 1.5,
                        delay: 0.6 + (15 + index) * 0.03,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {char}
                    </motion.span>
                    {char}
                  </motion.span>
                )
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="w-72 md:w-96"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden shadow-lg border border-white/10">
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ["0px 0px", "40px 0px"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent 0px,
                  rgba(10, 132, 255, 0.2) 10px,
                  transparent 20px
                )`,
                backgroundSize: "40px 100%",
              }}
            />

            <motion.div
              className="relative h-full rounded-full bg-linear-to-r from-blue-600 via-blue-500 to-blue-400"
              style={{ width: `${progress}%` }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
                }}
              />
            </motion.div>

            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                width: `${progress}%`,
                boxShadow: `0 0 12px rgba(10, 132, 255, ${Math.max(progress / 100, 0.3)})`,
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <motion.span
                className="text-xs text-gray-500 font-poppins"
                key={loadingStage}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                {loadingStages[loadingStage]}
              </motion.span>

              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.span
                className="text-sm font-semibold text-primary font-mono relative z-10"
                key={progress}
                initial={{ scale: 1.3, y: -5 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {progress}%
              </motion.span>

              <motion.div
                className="absolute inset-0 text-primary font-mono text-sm font-semibold blur-sm"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {progress}%
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute top-6 left-6 w-24 h-24"
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="5" cy="5" r="3" fill="#0a84ff" opacity="0.8" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 w-24 h-24"
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="95" cy="5" r="3" fill="#0a84ff" opacity="0.8" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-6 w-24 h-24"
        initial={{ opacity: 0, scale: 0, rotate: 45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="5" cy="95" r="3" fill="#0a84ff" opacity="0.8" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-6 right-6 w-24 h-24"
        initial={{ opacity: 0, scale: 0, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="95" cy="95" r="3" fill="#0a84ff" opacity="0.8" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-6 left-6"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        style={{ originY: "top" }}
      >
        <div className="w-0.5 h-20 bg-linear-to-b from-primary to-transparent" />
      </motion.div>

      <motion.div
        className="absolute top-6 left-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
        style={{ originX: "left" }}
      >
        <div className="w-20 h-0.5 bg-linear-to-r from-primary to-transparent" />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
        style={{ originY: "top" }}
      >
        <div className="w-0.5 h-20 bg-linear-to-b from-primary to-transparent" />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
        style={{ originX: "right" }}
      >
        <div className="w-20 h-0.5 bg-linear-to-l from-primary to-transparent" />
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-6"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        style={{ originY: "bottom" }}
      >
        <div className="w-0.5 h-20 bg-linear-to-t from-primary to-transparent" />
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        style={{ originX: "left" }}
      >
        <div className="w-20 h-0.5 bg-linear-to-r from-primary to-transparent" />
      </motion.div>

      <motion.div
        className="absolute bottom-6 right-6"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
        style={{ originY: "bottom" }}
      >
        <div className="w-0.5 h-20 bg-linear-to-t from-primary to-transparent" />
      </motion.div>

      <motion.div
        className="absolute bottom-6 right-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
        style={{ originX: "right" }}
      >
        <div className="w-20 h-0.5 bg-linear-to-l from-primary to-transparent" />
      </motion.div>
    </motion.div>
  );
};

export default IntroLoader;
