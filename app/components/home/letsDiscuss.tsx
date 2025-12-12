import { motion } from "framer-motion";
import { Button } from "../ui/button";
import GlassButton from "../ui/glass-button";
import { HiMail, HiPhone } from "react-icons/hi";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import {
  getBlurAnimationClasses,
  getBlurAnimationDelay,
} from "~/lib/animations";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import { BookingModal } from "~/components/ui/booking-modal";

const LetsDiscuss = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [containerRef, isContainerVisible] = useBlurAnimation<HTMLDivElement>(
    0.3,
    false,
    location.pathname
  );
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLHeadingElement>(
    0.3,
    false,
    location.pathname
  );
  const [subtitleRef, isSubtitleVisible] =
    useBlurAnimation<HTMLParagraphElement>(0.3, false, location.pathname);
  const [buttonsRef, isButtonsVisible] = useBlurAnimation<HTMLDivElement>(
    0.3,
    false,
    location.pathname
  );

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <div
          ref={containerRef}
          className={`relative bg-black border border-light-black rounded-3xl p-8 sm:p-12 md:p-16 lg:p-20 overflow-hidden backdrop-blur-xl ${getBlurAnimationClasses(
            isContainerVisible,
            { variant: "heavy" }
          )}`}
        >
          <div className="absolute inset-0 bg-grid-pattern grid-fade-mask opacity-40" />

          <motion.div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl" />
          <motion.div className="absolute -bottom-10 -right-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-primary/40 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary/40 rounded-br-3xl" />

          <div className="relative z-10 text-center">
            <h2
              ref={titleRef}
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-lexend mb-6 md:mb-8 ${getBlurAnimationClasses(
                isTitleVisible,
                { variant: "default" }
              )}`}
              style={getBlurAnimationDelay(200)}
            >
              <motion.span
                className="inline-block bg-linear-to-b from-black via-gray to-white bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                LET'S DISCUSS
              </motion.span>
              <br />
              <motion.span
                className="inline-block bg-linear-to-r from-primary via-primary/40 to-primary bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  backgroundSize: ["200% 200%", "250% 250%", "200% 200%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                YOUR IDEA
              </motion.span>
            </h2>

            <p
              ref={subtitleRef}
              className={`text-gray text-sm sm:text-md md:text-lg max-w-2xl mx-auto mb-10 md:mb-12 font-poppins leading-relaxed ${getBlurAnimationClasses(
                isSubtitleVisible,
                { variant: "default" }
              )}`}
              style={getBlurAnimationDelay(400)}
            >
              Ready to transform your vision into reality? Let's connect and
              create something extraordinary together.
            </p>

            <div
              ref={buttonsRef}
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 ${getBlurAnimationClasses(
                isButtonsVisible,
                { variant: "scale" }
              )}`}
              style={getBlurAnimationDelay(600)}
            >
              <Button
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-bold px-9 py-4.5"
              >
                Contact Us
              </Button>

              <GlassButton
                icon={HiMail}
                to="/contact"
                className="cursor-pointer"
              >
                Send Mail
              </GlassButton>
            </div>
          </div>
        </div>
      </div>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default LetsDiscuss;
