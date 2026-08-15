import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import SectionBadge from "~/components/ui/section-badge";
import { FileText, Users, Clock, Globe, TrendingUp } from "lucide-react";
import type { TrackRecordItem } from "~/lib/types";

interface OurTrackProps {
  trackRecord: TrackRecordItem[];
}

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
        duration: 2.2,
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

const getRecordIcon = (subtitle: string, title: string, index: number) => {
  const s = `${subtitle} ${title}`.toLowerCase();
  if (s.includes("project") || s.includes("deliver"))
    return <FileText className="w-5 h-5 text-primary" />;
  if (s.includes("satisfaction") || s.includes("client") || s.includes("user") || s.includes("reviewer"))
    return <Users className="w-5 h-5 text-primary" />;
  if (s.includes("time") || s.includes("delivery") || s.includes("speed"))
    return <Clock className="w-5 h-5 text-primary" />;
  if (s.includes("countr") || s.includes("global") || s.includes("world"))
    return <Globe className="w-5 h-5 text-primary" />;
  const fallbacks = [
    <FileText key="1" className="w-5 h-5 text-primary" />,
    <Users key="2" className="w-5 h-5 text-primary" />,
    <Clock key="3" className="w-5 h-5 text-primary" />,
    <Globe key="4" className="w-5 h-5 text-primary" />,
  ];
  return fallbacks[index % fallbacks.length];
};

const OurTrack = ({ trackRecord }: OurTrackProps) => {
  const [titleRef, isVisible] = useBlurAnimation<HTMLHeadingElement>();
  const [cardsRef, areCardsVisible] = useBlurAnimation<HTMLDivElement>();

  if (trackRecord.length === 0) return null;

  return (
    <section className="bg-black text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={titleRef}
          className={`text-center mb-12 md:mb-16 ${getBlurAnimationClasses(isVisible)}`}
        >
          <SectionBadge
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            text="Proven Impact"
            badgeLabel="Performance Metrics"
            color="#0a84ff"
            className="mb-4"
          />
          <h2 className="text-white font-barlow text-2xl md:text-4xl font-bold tracking-tight">
            Our Track Record
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6"
        >
          {trackRecord.map((record, index) => {
            const { number, suffix } = splitNumberAndSuffix(record.title);
            return (
              <div
                key={record.subtitle}
                style={{ transitionDelay: `${index * 90}ms` }}
                className={`rounded-xl sm:rounded-2xl p-3.5 sm:p-6 md:p-7 bg-[#0e0e0e] border border-[#1f1f1f] hover:border-primary/40 transition-all duration-700 hover:-translate-y-1 flex flex-col justify-between ${getBlurAnimationClasses(areCardsVisible)}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-6">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary">
                      {getRecordIcon(record.subtitle, record.title, index)}
                    </div>
                    <span className="font-mono text-[10px] sm:text-xs font-bold text-white/20">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-barlow text-white tracking-tight mb-1 sm:mb-2">
                    <Counter value={number} suffix={suffix} />
                  </h3>

                  <h4 className="text-[11px] sm:text-xs md:text-sm font-semibold font-barlow text-gray-300 tracking-wide uppercase leading-snug">
                    {record.subtitle}
                  </h4>
                </div>

                {record.description && (
                  <p className="text-[10px] sm:text-xs text-gray-400 leading-normal sm:leading-relaxed font-barlow mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-white/[0.06]">
                    {record.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurTrack;

