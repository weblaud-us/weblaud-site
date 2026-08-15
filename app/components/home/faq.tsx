import React, { useState, useRef, useLayoutEffect } from "react";
import { FiPlus } from "react-icons/fi";
import IconTile from "../ui/icon-tile";
import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import {
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import type { Faq } from "~/lib/types";
import SectionBadge from "~/components/ui/section-badge";
import { HelpCircle } from "lucide-react";

// Bouncy spring transitions
const ROW_TRANSITION: Transition = {
  type: "spring",
  duration: 0.55,
  bounce: 0.38,
};

const CONTENT_OPEN_TRANSITION: Transition = {
  type: "spring",
  duration: 0.58,
  bounce: 0.32,
};

const CONTENT_CLOSE_TRANSITION: Transition = {
  type: "spring",
  duration: 0.46,
  bounce: 0.26,
};

const DESCRIPTION_TRANSITION: Transition = {
  duration: 0.22,
  ease: [0.16, 1, 0.3, 1],
};

const PLUS_TRANSITION: Transition = {
  type: "spring",
  duration: 0.42,
  bounce: 0.28,
};

interface FAQRowProps {
  item: Faq;
  number: string;
  isOpen: boolean;
  panelId: string;
  buttonId: string;
  itemVisible: boolean;
  reduce: boolean | null;
  onToggle: () => void;
  rowRef: (el: HTMLLIElement | null) => void;
}

function FAQRow({
  item,
  number,
  isOpen,
  panelId,
  buttonId,
  itemVisible,
  reduce,
  onToggle,
  rowRef,
}: FAQRowProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const updateHeight = () => {
      setContentHeight(node.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <motion.li
      ref={rowRef}
      layout="position"
      initial={false}
      transition={reduce ? { duration: 0 } : ROW_TRANSITION}
      className={`rounded-2xl border bg-[#0e0e0e] transition-colors duration-300 overflow-hidden ${
        isOpen
          ? "border-primary/50"
          : "border-[#1f1f1f] hover:border-white/15"
      } ${getBlurAnimationClasses(itemVisible)}`}
    >
      <div className="p-4 md:p-6">
        <div
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 cursor-pointer select-none"
        >
          <div className="flex items-center gap-4 min-w-0">
            <IconTile size="lg" className="shrink-0">
              <span
                className={`font-semibold text-xl transition-colors duration-300 ${
                  isOpen ? "text-primary" : "text-white"
                }`}
              >
                {number}
              </span>
            </IconTile>

            <span
              className={`font-medium font-barlow text-sm md:text-lg transition-colors duration-300 ${
                isOpen ? "text-primary" : "text-white"
              }`}
            >
              {item.question}
            </span>
          </div>

          <button
            type="button"
            id={buttonId}
            aria-controls={panelId}
            aria-expanded={isOpen}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`w-9 h-9 md:w-10 md:h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors duration-300 cursor-pointer ${
              isOpen
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-white/[0.04] border-white/[0.08] text-white/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            }`}
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <motion.span
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={reduce ? { duration: 0 } : PLUS_TRANSITION}
              className="inline-flex"
            >
              <FiPlus className="text-lg md:text-xl" />
            </motion.span>
          </button>
        </div>

        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          aria-hidden={!isOpen}
          initial={false}
          animate={{ height: isOpen ? contentHeight : 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : isOpen
              ? CONTENT_OPEN_TRANSITION
              : CONTENT_CLOSE_TRANSITION
          }
          className="overflow-hidden"
        >
          <motion.div
            ref={contentRef}
            animate={{
              opacity: isOpen ? 1 : 0,
              y: isOpen ? 0 : -8,
            }}
            transition={reduce ? { duration: 0 } : DESCRIPTION_TRANSITION}
            className="pt-4 md:pl-[4.5rem]"
          >
            <p className="text-sm md:text-[15px] text-gray-400 font-barlow leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.li>
  );
}

interface FAQProps {
  faqs: Faq[];
}

export default function FAQ({ faqs }: FAQProps) {
  const reduce = useReducedMotion();
  const items = faqs;
  const [openId, setOpenId] = React.useState<string | null>(
    items[0]?._id ?? null,
  );

  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLHeadingElement>();
  const { itemRefs, isItemVisible } = useBlurAnimationList(
    items.map((item) => item._id),
    0.1
  );

  const toggle = (id: string) => {
    setOpenId((cur) => (cur === id ? null : id));
  };

  if (items.length === 0) return null;

  return (
    <section className="relative py-14 pb-16 bg-black text-white overflow-hidden scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
        <div
          ref={titleRef}
          className={`text-center mb-8 md:mb-12 ${getBlurAnimationClasses(isTitleVisible)}`}
        >
          <SectionBadge
            icon={<HelpCircle className="w-3.5 h-3.5" />}
            text="Got Questions?"
            badgeLabel="We Have Answers"
            color="#0a84ff"
            className="mb-4"
          />
          <h2 className="font-barlow text-2xl md:text-3xl font-semibold">
            Frequently Asked Questions
          </h2>
        </div>

        <ul className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = item._id === openId;
            const number = String(idx + 1).padStart(2, "0");
            const panelId = `faq-panel-${item._id}`;
            const buttonId = `faq-button-${item._id}`;
            const itemVisible = isItemVisible(item._id);
            return (
              <FAQRow
                key={item._id}
                item={item}
                number={number}
                isOpen={isOpen}
                panelId={panelId}
                buttonId={buttonId}
                itemVisible={itemVisible}
                reduce={reduce}
                onToggle={() => toggle(item._id)}
                rowRef={(el) => {
                  if (el) itemRefs.current.set(item._id, el);
                }}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
}

