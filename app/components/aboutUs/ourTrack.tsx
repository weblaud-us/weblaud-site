import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import type { TrackRecordItem } from "~/lib/types";

interface OurTrackProps {
  trackRecord: TrackRecordItem[];
}

// Backend stores each stat as a single string (e.g. "75+", "99%") — split it
// into the numeric part (animated by <Counter>) and the trailing suffix.
function splitNumberAndSuffix(title: string): { number: string; suffix: string } {
  const match = title.match(/^(\$?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { number: title, suffix: "" };
  return { number: match[1], suffix: match[2] };
}

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

const OurTrack = ({ trackRecord }: OurTrackProps) => {
  const [titleRef, isVisible] = useBlurAnimation<HTMLHeadingElement>();

  if (trackRecord.length === 0) return null;

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
          {trackRecord.map((record, index) => {
            const { number, suffix } = splitNumberAndSuffix(record.title);
            return (
              <motion.div
                key={record.subtitle}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-light-black rounded-3xl p-6 md:p-8 bg-card-bg"
              >
                <div className="mb-4 md:mb-6">
                  <h3
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-barlow tracking-tight break-words"
                    style={{
                      background:
                        "linear-gradient(180deg, #ffffff 0%, #8a8a9a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <Counter value={number} suffix={suffix} />
                  </h3>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base md:text-lg font-bold font-barlow leading-tight">
                    {record.subtitle}
                  </h4>
                  {record.description && (
                    <p className="text-sm md:text-base text-gray-400 leading-relaxed font-barlow">
                      {record.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurTrack;
