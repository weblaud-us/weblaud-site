import { motion } from "framer-motion";
import { useState, useRef, useLayoutEffect } from "react";

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
  const [tabWidths, setTabWidths] = useState<{
    [key: string | number]: number;
  }>({});
  const tabRefs = useRef<{ [key: string | number]: HTMLButtonElement | null }>(
    {}
  );

  const backgroundTab = hoveredTab !== null ? hoveredTab : activeTab;
  const backgroundIndex = tabs.findIndex((t) => t.id === backgroundTab);
  const backgroundWidth = tabWidths[backgroundTab] || 0;

  useLayoutEffect(() => {
    const widths: { [key: string | number]: number } = {};
    Object.entries(tabRefs.current).forEach(([id, ref]) => {
      if (ref) {
        widths[id] = ref.offsetWidth;
      }
    });
    setTabWidths(widths);
  }, [tabs]);

  return (
    <div
      className={`relative flex lg:flex-col ${className}`}
      onMouseLeave={() => setHoveredTab(null)}
    >
      <motion.div
        className="hidden lg:block absolute left-0 bg-primary/10 rounded-2xl -z-10 border border-primary/30"
        animate={{
          top: `${backgroundIndex * (48 + 24) + 12}px`,
          height: "48px",
          width: backgroundWidth > 0 ? `${backgroundWidth}px` : "100%",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        }}
      />

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className="py-3 lg:py-3 cursor-pointer"
          onMouseEnter={() => setHoveredTab(tab.id)}
        >
          <motion.button
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-3 text-left transition-colors duration-200 z-10 cursor-pointer px-3 ${
              activeTab === tab.id
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className={`flex items-center justify-center w-8 h-8 lg:w-12 lg:h-12 rounded-full font-bold text-sm md:text-base lg:text-lg transition-all duration-300 border-light-black border ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/50"
                  : "bg-card-bg text-gray-400 "
              }`}
              animate={{
                scale: activeTab === tab.id ? 1.1 : 1,
              }}
            >
              {tab.id}
            </motion.div>

            <span
              className={`${
                showTitleOnMobile ? "block" : "hidden lg:block"
              } font-barlow font-bold text-lg whitespace-nowrap`}
            >
              {tab.title}
            </span>
          </motion.button>
        </div>
      ))}
    </div>
  );
};

export default VerticalTabs;
