import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import IconTile from "../ui/icon-tile";
import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { motion } from "framer-motion";
import { TIMELINE, SAVINGS } from "~/lib/constants";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

const items: FAQItem[] = [
  {
    id: 1,
    question: "What services does Weblaud LLC offer?",
    answer:
      "Weblaud LLC provides end-to-end software engineering including custom operations platforms, B2B SaaS web applications, cross-platform mobile apps (React Native & Flutter), production AI/LLM integrations, real-time WebSocket infrastructure, and cloud DevOps management.",
  },
  {
    id: 2,
    question: "How long does a software project take to ship?",
    answer:
      `We operate on focused, fixed-scope agile sprint cycles. Simple builds typically ship in ${TIMELINE.mvp}, while full enterprise systems complete ${TIMELINE.enterprise}. We provide detailed milestone roadmaps during discovery and host bi-weekly sprint reviews.`,
  },
  {
    id: 3,
    question: "What is Weblaud LLC's pricing model?",
    answer:
      "We operate on transparent, fixed-fee sprint pricing starting at $4,500 for MVP projects up to $18,500 for full enterprise platforms. You receive 100% IP source code ownership with zero unpredictable hourly billing or unexpected invoices.",
  },
  {
    id: 4,
    question: "Why hire Weblaud LLC instead of in-house software engineers?",
    answer:
      `Hiring a senior developer costs over $180,000 annually per engineer once salary, health benefits, and recruiting commissions are factored in—requiring 3 to 6 months just to hire. Weblaud LLC deploys an active senior squad instantly for a fixed sprint fee at ${SAVINGS.shareOfCost}.`,
  },
  {
    id: 5,
    question: "Do you provide post-launch support and cloud maintenance?",
    answer:
      "Yes, we provide continuous SLA support packages including 99.9% uptime monitoring, automated database backups, security patch updates, and feature expansion as your active user base grows.",
  },
  {
    id: 6,
    question: "Can you integrate with our existing APIs, databases, or legacy systems?",
    answer:
      "Yes. We work with modern and legacy tech stacks, connecting directly to your existing PostgreSQL/MySQL databases, third-party APIs, and cloud services without disrupting active operational workflows.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = React.useState<number | null>(1);

  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLHeadingElement>();
  const { itemRefs, isItemVisible } = useBlurAnimationList(
    items.map((item) => item.id),
    0.1
  );

  const toggle = (id: number) => {
    setOpenId((cur) => (cur === id ? null : id));
  };

  return (
    <section className="relative py-14 pb-16 bg-black text-white overflow-hidden scroll-mt-24">

      <motion.div className="absolute top-20 left-30 w-40 h-40 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
      <motion.div className="absolute md:block hidden bottom-20 right-30 w-40 h-40 rounded-full bg-primary/30 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
        <h2
          ref={titleRef}
          className={`text-center font-barlow text-2xl md:text-3xl font-semibold mb-8 md:mb-12 ${getBlurAnimationClasses(isTitleVisible)}`}
        >
          Frequently Asked Questions
        </h2>

        <ul className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = item.id === openId;
            const number = String(idx + 1).padStart(2, "0");
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-button-${item.id}`;
            const itemVisible = isItemVisible(item.id);
            return (
              <li
                key={item.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.id, el);
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
                        onClick={() => toggle(item.id)}
                        className="grid place-items-center rounded-md size-8  transition-transform"
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
