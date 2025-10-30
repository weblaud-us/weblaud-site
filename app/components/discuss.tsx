import { Button } from "./ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

const Discuss = () => {
  const defaultGrayCells = [
    { x: 2, y: 1 },
    { x: 6, y: 3 },
    { x: 25, y: 3 },
    { x: 15, y: 1 },
    { x: 4, y: 6 },
    { x: 11, y: 5 },
    { x: 19, y: 4 },
    { x: 23, y: 1 },
  ];
  const [hoveredCell, setHoveredCell] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const gridX = Math.floor(mouseX / 48);
    const gridY = Math.floor(mouseY / 50);

    if (!hoveredCell || hoveredCell.x !== gridX || hoveredCell.y !== gridY) {
      setHoveredCell({ x: gridX, y: gridY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <section className="bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative border border-light-black rounded-3xl p-12 md:p-16 lg:p-[90px] overflow-hidden bg-linear-to-b from-[#1a1a28]  to-[#1a1a28]/5">
          <div className="absolute inset-0 bg-grid-pattern grid-fade-mask"></div>

          <div
            className="absolute inset-0 grid-fade-mask z-5"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {defaultGrayCells.map((cell) => (
              <div
                key={`gray-${cell.x}-${cell.y}`}
                className="absolute pointer-events-none bg-white/8 border border-white/10"
                style={{
                  left: cell.x * 48,
                  top: cell.y * 50,
                  width: "48px",
                  height: "50px",
                }}
              />
            ))}

            {hoveredCell && (
              <motion.div
                className="absolute pointer-events-none bg-white/8 border border-white/15"
                style={{
                  left: hoveredCell.x * 48,
                  top: hoveredCell.y * 50,
                  width: "48px",
                  height: "50px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 0.12 } }}
              />
            )}
          </div>

          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/60"></div>

          <div className="relative z-10 flex w-fit mx-auto flex-col items-center justify-center text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-barlow">
              READY TO DISCUSS
            </h2>

            <p className="text-base md:text-lg font-barlow text-gray-300 max-w-2xl">
              Your Product Needs With{" "}
              <span className="text-blue-500 font-semibold">
                Catalyst Analytic
              </span>{" "}
              Experts?
            </p>

            <Button className="text-xs font-bold px-9 py-4.5 mt-4">
              Get In Touch
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Discuss;
