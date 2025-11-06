import { useRef } from "react";
import { Button } from "./ui/button";
import AnimatedGridBg, { type AnimatedGridBgRef } from "./ui/animated-grid-bg";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";

const Discuss = () => {
  const [containerRef, isVisible] = useBlurAnimation<HTMLDivElement>();
  const gridBgRef = useRef<AnimatedGridBgRef>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gridBgRef.current) {
      gridBgRef.current.handleMouseMove(e);
    }
  };

  const handleMouseLeave = () => {
    if (gridBgRef.current) {
      gridBgRef.current.handleMouseLeave();
    }
  };

  return (
    <section ref={containerRef} className="bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className={`relative border border-light-black rounded-3xl p-12 md:p-16 lg:p-[90px] overflow-hidden bg-linear-to-b from-primary/15 to-primary/3 ${getBlurAnimationClasses(isVisible)}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatedGridBg ref={gridBgRef} />

          <div
            className="relative z-10 flex w-fit mx-auto flex-col items-center justify-center text-center space-y-6"
            style={{ pointerEvents: "auto" }}
          >
            <h2
              className={`text-3xl md:text-4xl font-bold font-barlow ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
              style={{ transitionDelay: "200ms" }}
            >
              READY TO DISCUSS
            </h2>

            <p
              className={`text-base md:text-lg font-barlow text-gray-300 max-w-2xl ${getBlurAnimationClasses(isVisible, { variant: "light" })}`}
              style={{ transitionDelay: "400ms" }}
            >
              Your Product Needs With{" "}
              <span className="text-blue-500 font-semibold">
                Catalyst Analytic
              </span>{" "}
              Experts?
            </p>

            <div
              className={getBlurAnimationClasses(isVisible, {
                variant: "light",
              })}
              style={{ transitionDelay: "600ms" }}
            >
              <Button className="text-xs font-bold px-9 py-4.5 mt-4">
                Get In Touch
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Discuss;
