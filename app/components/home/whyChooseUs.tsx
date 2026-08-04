import { motion } from "framer-motion";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { BsLightningChargeFill, BsPeopleFill, BsShieldFillCheck, BsClockFill } from "react-icons/bs";

const reasons = [
  {
    title: "Innovation",
    description:
      "Pushing boundaries with AI, cloud infrastructure, and next-gen application solutions.",
    icon: BsLightningChargeFill,
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400",
    glowColor: "bg-blue-500/20",
    borderHover: "hover:border-blue-500/40",
    number: "01",
  },
  {
    title: "Collaboration",
    description:
      "Working closely with clients to deliver solutions that fit your unique needs.",
    icon: BsPeopleFill,
    gradient: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400",
    glowColor: "bg-violet-500/20",
    borderHover: "hover:border-violet-500/40",
    number: "02",
  },
  {
    title: "Excellence",
    description:
      "Maintaining the highest standards in code quality, performance, and outcomes.",
    icon: BsShieldFillCheck,
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
    glowColor: "bg-emerald-500/20",
    borderHover: "hover:border-emerald-500/40",
    number: "03",
  },
  {
    title: "Reliable Delivery",
    description:
      "We keep your project moving with dedicated Slack channels, weekly milestone reviews, and fast turnaround times.",
    icon: BsClockFill,
    gradient: "from-orange-500/20 to-amber-500/10",
    iconColor: "text-orange-400",
    glowColor: "bg-orange-500/20",
    borderHover: "hover:border-orange-500/40",
    number: "04",
  },
];

const WhyChooseUs = () => {
  const [titleRef, isTitleVisible] = useBlurAnimation();
  const [cardsRef, areCardsVisible] = useBlurAnimation();

  return (
    <section className="bg-black px-4 sm:px-6 md:px-8 lg:px-6 xl:px-10 py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={titleRef}
          className={`text-center mb-12 md:mb-16 ${getBlurAnimationClasses(isTitleVisible)}`}
        >
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase font-barlow mb-3">
            Why Work With Us
          </p>
          <h2 className="text-white font-barlow text-2xl md:text-3xl font-semibold">
            Why Choose Us
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group relative bg-card-bg border border-light-black rounded-2xl p-6 md:p-8 ${reason.borderHover} transition-all duration-300 hover:shadow-lg overflow-hidden cursor-pointer`}
              >
                {/* Card gradient bg on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                />

                {/* Shimmer sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Number */}
                  <span className="text-white/10 font-barlow font-bold text-5xl absolute top-4 right-5 select-none leading-none group-hover:text-white/15 transition-colors duration-300">
                    {reason.number}
                  </span>

                  {/* Icon */}
                  <div
                    className={`relative w-12 h-12 rounded-xl ${reason.glowColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div
                      className={`absolute inset-0 rounded-xl ${reason.glowColor} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150`}
                    />
                    <Icon
                      className={`relative z-10 w-5 h-5 ${reason.iconColor}`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-barlow font-bold text-lg mb-2 group-hover:text-white transition-colors duration-300">
                    {reason.title}
                  </h3>

                  {/* Description */}
                  <p className="text-dark-gray font-barlow text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {reason.description}
                  </p>

                  {/* Bottom accent line */}
                  <div
                    className={`mt-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-colors duration-300`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
