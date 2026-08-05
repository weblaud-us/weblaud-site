import { motion } from "framer-motion";
import { useState } from "react";

export interface TabItem {
  id: number | string;
  title: string;
  [key: string]: any;
}

interface VerticalTabsProps {
  tabs: TabItem[];
  activeTab: number | string;
  onTabChange: (tabId: number | string) => void;
  className?: string;
  showTitleOnMobile?: boolean;
}

const VerticalTabs = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  showTitleOnMobile = false,
}: VerticalTabsProps) => {
  const [hoveredTab, setHoveredTab] = useState<number | string | null>(null);
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const progressPercent =
    tabs.length > 1 ? (activeIndex / (tabs.length - 1)) * 100 : 0;

  return (
    <div
      className={`relative flex lg:flex-col gap-2 lg:gap-4 ${className}`}
      onMouseLeave={() => setHoveredTab(null)}
    >
      {/* Vertical Connecting Laser Track line (Desktop) */}
      <div className="hidden lg:block absolute left-[36px] top-7 bottom-7 w-[2px] bg-white/10 rounded-full z-0 overflow-hidden">
        <motion.div
          className="w-full bg-linear-to-b from-primary via-cyan-400 to-primary shadow-[0_0_12px_rgba(10,132,255,0.8)]"
          animate={{ height: `${progressPercent}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        const isHovered = hoveredTab === tab.id;

        return (
          <div
            key={tab.id}
            className="relative py-1 lg:py-1 cursor-pointer"
            onMouseEnter={() => setHoveredTab(tab.id)}
          >
            {/* Active Tab Background Glow & Pill */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-linear-to-r from-primary/20 via-primary/10 to-transparent rounded-2xl border border-primary/40 shadow-[0_0_20px_rgba(10,132,255,0.15)] z-0"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                }}
              />
            )}

            <motion.button
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-4 text-left transition-colors duration-300 z-10 cursor-pointer py-2.5 px-3.5 w-full rounded-2xl ${
                isActive
                  ? "text-white"
                  : isHovered
                  ? "text-gray-200"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              whileHover={{ x: isActive ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`relative flex items-center justify-center w-9 h-9 lg:w-11 lg:h-11 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 z-10 shrink-0 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/50 ring-2 ring-primary/40"
                    : "bg-black border border-white/15 text-gray-400 group-hover:border-white/30"
                }`}
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {tab.id}
              </motion.div>

              <span
                className={`${
                  showTitleOnMobile ? "block" : "hidden lg:block"
                } font-barlow font-bold text-lg tracking-wider whitespace-nowrap uppercase`}
              >
                {tab.title}
              </span>
            </motion.button>
          </div>
        );
      })}
    </div>
  );
};

export default VerticalTabs;
