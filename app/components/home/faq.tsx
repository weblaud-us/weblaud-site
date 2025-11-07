import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import IconTile from "../ui/icon-tile";
import {
  useBlurAnimation,
  useBlurAnimationList,
} from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { motion } from "framer-motion";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

const items: FAQItem[] = [
  {
    id: 1,
    question: "What services does your company offer?",
    answer:
      "We provide comprehensive digital solutions including custom web development, mobile app development, UI/UX design, cloud infrastructure setup, API development, and ongoing maintenance and support. Our team specializes in modern technologies like React, Next.js, Node.js, and cloud platforms to deliver scalable, high-performance applications tailored to your business needs.",
  },
  {
    id: 2,
    question: "How long does a typical project take to complete?",
    answer:
      "Project timelines vary based on complexity and scope. A simple website typically takes 4-6 weeks, while a full-featured web application may require 3-6 months. We provide detailed timelines during the discovery phase and keep you updated throughout development with regular milestone reviews and demos.",
  },
  {
    id: 3,
    question: "Do you offer post-launch support and maintenance?",
    answer:
      "Yes, we provide comprehensive post-launch support including bug fixes, security updates, performance monitoring, and feature enhancements. We offer flexible maintenance packages tailored to your needs, from basic monitoring to full ongoing development partnerships with dedicated support teams.",
  },
  {
    id: 4,
    question: "What is your development process like?",
    answer:
      "We follow an agile development methodology with clear phases: discovery and planning, design and prototyping, development with regular sprints, quality assurance testing, and deployment. You'll have full visibility throughout with regular check-ins, demos, and the ability to provide feedback at every stage to ensure the final product exceeds your expectations.",
  },
  {
    id: 5,
    question:
      "Can you work with our existing tech stack or integrate with our systems?",
    answer:
      "Absolutely! We're experienced in working with diverse tech stacks and can seamlessly integrate with your existing systems, APIs, databases, and third-party services. Whether you need to modernize legacy systems, add new features, or build complementary tools, we'll work within your technical ecosystem while recommending best practices for optimal results.",
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
    <section className="relative py-16 pb-32 bg-black text-white overflow-hidden">

      <motion.div className="absolute top-20 left-30 w-40 h-40 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
      <motion.div className="absolute md:block hidden bottom-10 right-25 w-40 h-40 rounded-full bg-primary/30 blur-3xl pointer-events-none" />

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
                className={`rounded-2xl border border-light-black ${
                  isOpen ? "bg-card-bg" : "bg-card-bg"
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
