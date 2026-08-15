import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useId } from "react";

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className = "",
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay && testimonials.length > 1) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials.length]);

  const randomRotateY = (seed: number) => {
    // Deterministic pseudo-random rotation to avoid hydration mismatches
    const pseudo = ((seed * 9301 + 49297) % 233280) / 233280;
    return Math.floor(pseudo * 21) - 10;
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className={`mx-auto max-w-sm px-4 py-12 font-sans antialiased md:max-w-5xl md:px-8 lg:px-12 ${className}`}>
      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 items-center">
        {/* Left/Right 3D Card Stack */}
        <div>
          <div className="relative h-80 sm:h-96 w-full max-w-md mx-auto">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src + index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(index),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(index),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -40, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(index),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center border border-white/10 shadow-2xl"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Info & Quote & Controls */}
        <div className="flex flex-col justify-between py-4 space-y-6">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
            className="space-y-3"
          >
            <h3 className="text-2xl sm:text-3xl font-bold font-barlow text-white tracking-tight">
              {testimonials[active].name}
            </h3>
            <p className="text-sm sm:text-base text-primary font-mono font-medium">
              {testimonials[active].designation}
            </p>
            <motion.p className="mt-4 text-base sm:text-lg text-gray-300 font-barlow leading-relaxed">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.015 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 cursor-pointer"
            >
              <FiArrowLeft className="h-4 w-4 text-gray-300 group-hover:text-primary transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 cursor-pointer"
            >
              <FiArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
