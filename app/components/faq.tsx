import React from "react";
import { FiPlus } from "react-icons/fi";
import IconTile from "./ui/icon-tile";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

const items: FAQItem[] = [
  {
    id: 1,
    question: "What services does Catalyst Analytics provide?",
    answer:
      "Catalyst Analytics offers a range of services including design, engineering, and project management. We specialize in user experience design, web development, mobile app development, custom software development, branding and identity, and more.",
  },
  {
    id: 2,
    question: "Lorem Ipsum is simply dummy text of the printing",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
  },
  {
    id: 3,
    question: "Lorem Ipsum is simply dummy text of the printing",
    answer:
      "Suspendisse potenti. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
  },
  {
    id: 4,
    question: "Lorem Ipsum is simply dummy text of the printing",
    answer:
      "Curabitur blandit tempus porttitor. Donec id elit non mi porta gravida at eget metus.",
  },
  {
    id: 5,
    question: "Lorem Ipsum is simply dummy text of the printing",
    answer:
      "Etiam porta sem malesuada magna mollis euismod. Aenean lacinia bibendum nulla sed consectetur.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = React.useState<number | null>(1);

  const toggle = (id: number) => {
    setOpenId((cur) => (cur === id ? null : id));
  };

  return (
    <section className="py-16 md:py-24 bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h2 className="text-center font-barlow text-2xl md:text-3xl font-semibold mb-8 md:mb-12">
          Frequently Asked Questions
        </h2>

        <ul className="space-y-4">
          {items.map((item, idx) => {
            const isOpen = item.id === openId;
            const number = String(idx + 1).padStart(2, "0");
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-button-${item.id}`;
            return (
              <li
                key={item.id}
                className={`rounded-2xl border border-light-black ${
                  isOpen ? "bg-[#1b1b1b]" : "bg-[#111]"
                }`}
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
