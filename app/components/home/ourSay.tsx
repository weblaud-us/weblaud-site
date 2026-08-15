import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { motion } from "framer-motion";
import type { Swiper as SwiperType } from "swiper";
import type { Testimonial } from "~/lib/types";
import SectionBadge from "~/components/ui/section-badge";
import { MessageSquareQuote } from "lucide-react";

interface OurSayProps {
  testimonials: Testimonial[];
}

export default function OurSay({ testimonials }: OurSayProps) {
  const items = testimonials;
  const [containerRef, isVisible] = useBlurAnimation<HTMLDivElement>();
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <section ref={containerRef} className="bg-black text-white py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className={`text-center mb-8 ${getBlurAnimationClasses(isVisible)}`}>
          <SectionBadge
            icon={<MessageSquareQuote className="w-3.5 h-3.5" />}
            text="Client Stories"
            badgeLabel="Real Feedback"
            color="#0a84ff"
            className="mb-4"
          />
          <h2 className="text-2xl md:text-3xl font-semibold">
            What Our Clients Say
          </h2>
        </div>

        <div
          className={`relative ${getBlurAnimationClasses(isVisible)}`}
          style={{ transitionDelay: "200ms" }}
        >
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
              loop={items.length >= 3}
              centeredSlides={items.length >= 3}
              spaceBetween={16}
              slidesPerView={1.05}
              speed={600}
              onSlideChange={handleSlideChange}
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="[&_.swiper-slide]:h-auto [&_.swiper-slide]:transition-all [&_.swiper-slide]:duration-500 [&_.swiper-slide:not(.swiper-slide-active)]:scale-95 [&_.swiper-slide:not(.swiper-slide-active)]:opacity-60 [&_.swiper-slide-active]:opacity-100 [&_.swiper-slide-active]:scale-100 [&_.swiper-slide-active]:z-10"
            >
              {items.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <SwiperSlide key={item._id}>
                    <article className="relative h-full rounded-2xl mt-10 border border-light-black bg-card-bg p-6 md:p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden">
                      
                      <motion.div
                        className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary/30 blur-2xl"
                        animate={{
                          opacity: 1,
                        }}
                      />
                      <motion.div
                        className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-blue-500/30 blur-2xl"
                        animate={{
                          opacity: 1,
                        }}
                      />
                     

                      <motion.div
                        className="flex items-center gap-3 mb-4"
                        initial={{ y: -20 }}
                        animate={{
                          y: isActive ? 0 : -20,
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <motion.div
                          className="h-px flex-1 bg-light-black"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                        <motion.span
                          className="text-primary text-4xl font-serif leading-none select-none"
                          aria-hidden
                          animate={{
                            scale: isActive ? [1, 1.2, 1] : 1,
                            rotate: isActive ? [0, -10, 0] : 0,
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                          &ldquo;
                        </motion.span>
                        <motion.div
                          className="h-px flex-1 bg-light-black"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </motion.div>
                      <motion.p
                        className="text-sm md:text-[15px] text-[#cfcfcf] leading-relaxed"
                        initial={{ y: 20 }}
                        animate={{
                          y: isActive ? 0 : 20,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {item.quote}
                      </motion.p>
                      <motion.div
                        className="mt-8"
                        transition={{
                          duration: 0.5,
                          delay: 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <h4 className="text-primary font-medium font-barlow text-base m-0">
                          {item.authorName}
                        </h4>
                        {item.authorTitle && (
                          <motion.p
                            className="text-xs text-[#8a8a8a] truncate block"
                            transition={{ duration: 0.4, delay: 0.3 }}
                          >
                            {item.authorTitle}
                          </motion.p>
                        )}
                      </motion.div>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>


      </div>
    </section>
  );
}
