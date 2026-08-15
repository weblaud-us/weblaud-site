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

  return (
    <div
      className={`relative flex lg:flex-col gap-2 lg:gap-3.5 ${className}`}
      onMouseLeave={() => setHoveredTab(null)}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isHovered = hoveredTab === tab.id;

        return (
          <div
            key={tab.id}
            className="relative py-0.5 lg:py-1 cursor-pointer select-none"
            onMouseEnter={() => setHoveredTab(tab.id)}
          >
            {/* Active Tab Background Glow & Pill */}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-2xl z-0 transform-gpu pointer-events-none"
                style={{
                  backgroundColor: tab.color ? `${tab.color}15` : "rgba(10, 132, 255, 0.15)",
                  borderColor: tab.color ? `${tab.color}45` : "rgba(10, 132, 255, 0.4)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  boxShadow: tab.color ? `0 0 25px ${tab.color}20` : "0 0 20px rgba(10,132,255,0.15)",
                  willChange: "transform",
                }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 34,
                }}
              />
            )}

            <button
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-3.5 text-left transition-colors duration-200 z-10 cursor-pointer py-2 px-3 lg:py-2.5 lg:px-3.5 w-full rounded-2xl active:scale-[0.98] ${
                isActive
                  ? "text-white"
                  : isHovered
                  ? "text-gray-200"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-9 h-9 lg:w-11 lg:h-11 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 z-10 shrink-0 transform-gpu ${
                  isActive
                    ? "text-white ring-2 ring-white/30 scale-[1.04]"
                    : "bg-black border border-white/15 text-gray-400 hover:border-white/30"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: tab.color || "#0a84ff",
                        borderColor: tab.color || "#0a84ff",
                        boxShadow: tab.color
                          ? `0 4px 22px ${tab.color}60`
                          : "0 4px 20px rgba(10,132,255,0.5)",
                      }
                    : {}
                }
              >
                {tab.id}
              </div>

              <span
                className={`${
                  showTitleOnMobile ? "block" : "hidden lg:block"
                } font-barlow font-bold text-base lg:text-lg tracking-wider whitespace-nowrap uppercase transition-colors duration-200`}
              >
                {tab.title}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default VerticalTabs;
