import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { Button } from "./ui/button";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type WhyItem = {
  id: number;
  quote: string;
  author: string;
  role: string;
};

const items: WhyItem[] = [
  {
    id: 1,
    quote:
      "That’s when we knew there had to be a better way — a smarter, faster, more intuitive solution.",
    author: "Sarah Mitchell",
    role: "Founder & CEO",
  },
  {
    id: 2,
    quote:
      "So we built a platform that empowers companies to transform raw data into real-time decisions using the power of AI.",
    author: "Michael Chen",
    role: "Chief Technology Officer",
  },
  {
    id: 3,
    quote:
      "We’re here to make intelligent systems accessible, actionable, and aligned with real business goals.",
    author: "Elena Rodriguez",
    role: "Head of Product",
  },
  {
    id: 4,
    quote:
      "Innovation isn't just about technology—it's about understanding people and solving their real challenges every day.",
    author: "David Thompson",
    role: "VP of Engineering",
  },
  {
    id: 5,
    quote:
      "Our mission is to bridge the gap between complex data and meaningful insights that drive business growth.",
    author: "Priya Sharma",
    role: "Chief Data Officer",
  },
];

export default function OurSay() {
  return (
    <section className="bg-black text-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h2 className="text-center text-2xl md:text-3xl font-semibold mb-10">
          Why We Started
        </h2>

        <div className="relative">
          <button
            className="why-prev cursor-pointer hidden md:flex absolute md:-left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 size-12 items-center justify-center rounded-full bg-card-bg border border-light-black text-primary hover:text-blue-400 transition-colors"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="text-xl" />
          </button>
          <button
            className="why-next cursor-pointer hidden md:flex absolute md:-right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 size-12 items-center justify-center rounded-full bg-card-bg border border-light-black text-primary hover:text-blue-400 transition-colors"
            aria-label="Next slide"
          >
            <FiChevronRight className="text-xl" />
          </button>

          <div className="relative">
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1/4 bg-linear-to-r from-black via-black/60 to-transparent z-10 pointer-events-none" />
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/4 bg-linear-to-l from-black via-black/60 to-transparent z-10 pointer-events-none" />

            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: ".why-prev", nextEl: ".why-next" }}
              loop={true}
              centeredSlides={true}
              spaceBetween={16}
              slidesPerView={1.05}
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="[&_.swiper-slide]:h-auto [&_.swiper-slide]:transition-all [&_.swiper-slide]:duration-300"
            >
              {items.map((item) => (
                <SwiperSlide key={item.id}>
                  <article className="h-full rounded-2xl border border-light-black bg-card-bg p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1 bg-light-black" />
                      <span className="text-primary text-5xl" aria-hidden>
                        “
                      </span>
                      <div className="h-px flex-1 bg-light-black" />
                    </div>
                    <p className="text-sm md:text-[15px] text-[#cfcfcf] leading-relaxed">
                      {item.quote}
                    </p>
                    <div className="mt-8">
                      <p className="text-primary font-medium font-lexend">
                        {item.author}
                      </p>
                      <p className="text-xs text-[#8a8a8a]">{item.role}</p>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button className="text-xs font-bold px-9 py-4.5">Learn More</Button>
        </div>
      </div>
    </section>
  );
}
