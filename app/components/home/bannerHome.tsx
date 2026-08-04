import { Link } from "react-router";
import heroBanner from "~/assets/hero-icon.png";
import dashedArrow from "~/assets/dashed-arrow.svg";

const BannerHome = () => {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 lg:pb-14 pt-30 md:pt-40 lg:pt-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-0 items-center">
          <div className="relative flex">
            {/* Absolute positioned arrow for sm and up */}
            <div className="absolute hidden sm:block -left-10 md:-left-12 lg:-left-16 top-6 h-[85%] max-h-[380px] w-[80px] lg:w-[100px] pointer-events-none">
              <img
                src={dashedArrow}
                alt="Dashed Arrow"
                className="w-full h-full object-contain object-right-top"
                loading="eager"
              />
              <span className="text-xs uppercase tracking-wider font-barlow absolute -top-8 left-2 whitespace-nowrap text-gray-500">
                OPERATIONS SOFTWARE
              </span>
            </div>

            {/* Mobile inline arrow */}
            <div className="flex sm:hidden items-start relative top-2 pr-3">
              <img
                src={dashedArrow}
                alt="Dashed Arrow"
                className="w-8 h-[220px]"
                loading="eager"
              />
            </div>

            <div className={`space-y-3 sm:space-y-4 md:space-y-6 sm:ml-12 md:ml-16 lg:ml-20 w-full`}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-barlow leading-tight text-balance">
                Your Business <span>Outgrew Its Spreadsheets</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-300 font-barlow sm:max-w-md max-w-sm lg:max-w-xl leading-relaxed text-balance">
                We build admin platforms, mobile apps, and AI tools for businesses that have outgrown manual processes. Most projects ship in 4 to 10 weeks.
              </p>

              <div className="flex flex-col pt-2">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto">
                  <Link 
                    to="/contact"
                    className="relative group h-[44px] w-full sm:w-auto inline-flex items-center justify-center px-7 rounded-[12px] text-[14px] font-semibold text-white bg-[#0A84FF] overflow-hidden shadow-[0_2px_12px_rgba(10,132,255,0.4)] hover:shadow-[0_8px_24px_rgba(10,132,255,0.3)] hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <span className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-100 mix-blend-overlay"></span>
                    <span className="relative z-10 flex items-center">Book a Call</span>
                  </Link>

                  <Link 
                    to="/services"
                    className="group relative h-[44px] w-full sm:w-auto inline-flex items-center justify-center px-7 rounded-[12px] text-[14px] font-semibold text-white bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-white/30 hover:bg-white/[0.08] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <span className="relative z-10 flex items-center">
                      Check our Services
                      <svg className="w-4 h-4 ml-2 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </Link>
                </div>
                <div className="pt-6">
                  <p className="text-xs text-gray-400 font-barlow tracking-wider uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                    React · Next.js · Flutter · FastAPI · NestJS · PostgreSQL · LLM integration
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`md:block relative mt-10 lg:mt-0`}>
            <div className="relative z-10 animate-float">
              <img
                src={heroBanner}
                alt="Weblaud hero illustration"
                className="w-full h-auto max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto drop-shadow-2xl"
                width="576"
                height="576"
                fetchPriority="high"
                loading="eager"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerHome;
