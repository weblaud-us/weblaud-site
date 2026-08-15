import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import IconTile from "../ui/icon-tile";
import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { motion } from "framer-motion";
import type { Faq } from "~/lib/types";
import SectionBadge from "~/components/ui/section-badge";
import { HelpCircle } from "lucide-react";

interface FAQProps {
  faqs: Faq[];
}

export default function FAQ({ faqs }: FAQProps) {
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

      <motion.div className="absolute top-20 left-30 w-40 h-40 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
      <motion.div className="absolute md:block hidden bottom-20 right-30 w-40 h-40 rounded-full bg-primary/30 blur-3xl pointer-events-none" />

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
              <li
                key={item._id}
                ref={(el) => {
                  if (el) itemRefs.current.set(item._id, el);
                }}
                className={`rounded-2xl border bg-card-bg transition-all duration-300 ${
                  isOpen
                    ? "border-primary/40 border-l-2 border-l-primary shadow-sm shadow-primary/10"
                    : "border-light-black"
                } ${getBlurAnimationClasses(itemVisible)}`}
              >
                <div className="flex items-start gap-4 p-4 md:p-6">
                  <IconTile size="lg" className="shrink-0">
                    <span
                      className={`font-semibold text-xl ${isOpen ? "text-primary" : "text-white"}`}
                    >
                      {number}
                    </span>
                  </IconTile>

                  <div className="flex-1">
                    <div className="w-full flex items-center justify-between gap-4">
                      <span
                        className={`font-medium md:font-medium font-barlow text-sm md:text-lg transition-colors ${
                          isOpen ? "text-primary" : "text-white"
                        }`}
                      >
                        {item.question}
                      </span>
                      <button
                        id={buttonId}
                        aria-controls={panelId}
                        aria-expanded={isOpen}
                        onClick={() => toggle(item._id)}
                        className="grid place-items-center rounded-md size-10 -m-1 shrink-0 transition-transform"
                        aria-label={isOpen ? "Collapse" : "Expand"}
                      >
                        <FiPlus
                          className={`transition-transform duration-200 ${
                            isOpen
                              ? "rotate-45 text-primary"
                              : "rotate-0 text-gray-300 "
                          } text-2xl cursor-pointer`}
                        />
                      </button>
                    </div>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:duration-0 ${
                        isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm md:text-[15px] text-dark-gray leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
