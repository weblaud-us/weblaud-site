import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedGridBgProps {
  className?: string;
  defaultGrayCells?: Array<{ x: number; y: number }>;
  cellWidth?: number;
  cellHeight?: number;
  showGrid?: boolean;
  showOverlay?: boolean;
}

export interface AnimatedGridBgRef {
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: () => void;
}

const AnimatedGridBg = forwardRef<AnimatedGridBgRef, AnimatedGridBgProps>(
  (
    {
      className = "",
      defaultGrayCells = [
        { x: 2, y: 1 },
        { x: 6, y: 3 },
        { x: 25, y: 3 },
        { x: 15, y: 1 },
        { x: 4, y: 6 },
        { x: 11, y: 5 },
        { x: 19, y: 4 },
        { x: 23, y: 1 },
      ],
      cellWidth = 48,
      cellHeight = 50,
      showGrid = true,
      showOverlay = true,
    },
    ref
  ) => {
    const [hoveredCell, setHoveredCell] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const gridX = Math.floor(mouseX / cellWidth);
      const gridY = Math.floor(mouseY / cellHeight);

      if (!hoveredCell || hoveredCell.x !== gridX || hoveredCell.y !== gridY) {
        setHoveredCell({ x: gridX, y: gridY });
      }
    };

    const handleMouseLeave = () => {
      setHoveredCell(null);
    };

    useImperativeHandle(ref, () => ({
      handleMouseMove,
      handleMouseLeave,
    }));

    return (
      <>
        {showGrid && (
          <div className="absolute inset-0 bg-grid-pattern grid-fade-mask pointer-events-none" />
        )}

        <div
          ref={containerRef}
          className={`absolute inset-0 grid-fade-mask ${className}`}
          style={{ zIndex: 0 }}
        >
          {defaultGrayCells.map((cell) => (
            <div
              key={`gray-${cell.x}-${cell.y}`}
              className="absolute pointer-events-none bg-white/8 border border-white/10"
              style={{
                left: cell.x * cellWidth,
                top: cell.y * cellHeight,
                width: `${cellWidth}px`,
                height: `${cellHeight}px`,
              }}
            />
          ))}

          {hoveredCell && (
            <motion.div
              className="absolute pointer-events-none bg-white/12 border border-white/25"
              style={{
                left: hoveredCell.x * cellWidth,
                top: hoveredCell.y * cellHeight,
                width: `${cellWidth}px`,
                height: `${cellHeight}px`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>

        {showOverlay && (
          <div
            className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/60 pointer-events-none"
            style={{ zIndex: 1 }}
          />
        )}
      </>
    );
  }
);

AnimatedGridBg.displayName = "AnimatedGridBg";

export default AnimatedGridBg;
