import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";

interface TrackRecord {
  id: number;
  number: string;
  suffix: string;
  title: string;
  description: string;
}

const trackRecords: TrackRecord[] = [
  {
    id: 1,
    number: "12",
    suffix: "+",
    title: "Years AI & ML Development",
    description:
      "Building and deploying production grade ML systems and AI solutions",
  },
  {
    id: 2,
    number: "$2",
    suffix: "B+",
    title: "Website Development",
    description: "Through our battle tested algorithmic trading systems",
  },
  {
    id: 3,
    number: "100",
    suffix: "+",
    title: "Custom Mobile App dev",
    description: "Including DeFi protocols and smart contracts",
  },
  {
    id: 4,
    number: "25",
    suffix: "+",
    title: "Ai Website development",
    description: "With data driven performance optimization",
  },
];

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, {
    once: false,
    margin: "-50px",
    amount: 0.5,
  });
  const [displayValue, setDisplayValue] = useState(0);

  const hasPrefix = value.startsWith("$");
  const prefix = hasPrefix ? "$" : "";
  const numericValue = parseFloat(value.replace("$", ""));

  useEffect(() => {
    if (inView) {
      setDisplayValue(0);
      const controls = animate(0, numericValue, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(latest);
        },
      });

      return controls.stop;
    } else {
      setDisplayValue(0);
    }
  }, [inView, numericValue]);

  return (
    <span ref={nodeRef} className="inline-block">
      {prefix}
      {numericValue < 10 && numericValue % 1 !== 0
        ? displayValue.toFixed(1)
        : Math.round(displayValue)}
      {suffix}
    </span>
  );
}

const OurTrack = () => {
  const [titleRef, isVisible] = useBlurAnimation<HTMLHeadingElement>();

  return (
    <section className="bg-black text-white py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2
          ref={titleRef}
          className={`text-center text-2xl md:text-3xl font-semibold mb-12 md:mb-16 font-barlow ${getBlurAnimationClasses(isVisible)}`}
        >
          Our Track Record
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trackRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border border-light-black rounded-3xl p-6 md:p-8 bg-card-bg"
            >
              <div className="mb-4 md:mb-6 relative">
                <h3
                  className="text-5xl md:text-6xl lg:text-7xl font-bold font-barlow tracking-tight relative"
                  style={{
                    background:
                      "linear-gradient(180deg, #ffffff 0%, #d0d0d0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter:
                      "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3))",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%,  white)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      zIndex: 1,
                    }}
                  >
                    <Counter value={record.number} suffix={record.suffix} />
                  </span>
                  <Counter value={record.number} suffix={record.suffix} />
                </h3>
              </div>

              <div className="space-y-2">
                <h4 className="text-base md:text-lg font-bold font-barlow leading-tight">
                  {record.title}
                </h4>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed font-barlow">
                  {record.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTrack;
