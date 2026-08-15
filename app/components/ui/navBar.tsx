import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { ChevronRight } from "lucide-react";
import weblaudLogo from "~/assets/weblaud-logo.svg";
import logo from "~/assets/weblaud.com.svg";
// import { Button } from "./button";
// import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";

const NavBar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/aboutus" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Insights", href: "/insights" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-[fadeIn_0.3s_ease-out]"
        />
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled ? "py-2 md:py-3" : "py-3 md:py-4"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10">
          <div
            className={`flex items-center justify-between transition-all duration-1000 ease-out ${
              isScrolled
                ? "bg-[#0e0e0e] border border-light-black/50 rounded-2xl px-4 md:px-6 py-2 md:py-3 shadow-lg shadow-black/50"
                : "bg-[#0e0e0e] border border-white/[0.08] md:border-light-black rounded-2xl md:rounded-3xl px-4 sm:px-6 md:px-8 py-2.5 md:py-4 shadow-lg shadow-black/40"
            } ${
              isVisible
                ? "opacity-100 blur-0 translate-y-0"
                : "opacity-0 blur-[10px] -translate-y-5"
            }`}
          >
            <div className="shrink-0">
              <Link
                to="/"
                className={`transition-all duration-300 flex items-center ${
                  isScrolled ? "h-8" : "h-9 md:h-10"
                }`}
              >
                <img
                  src={weblaudLogo}
                  alt="Weblaud Logo"
                  className="h-full w-auto object-contain"
                  style={{ transitionDelay: "100ms" }}
                />
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    viewTransition
                    className={`relative text-white font-barlow font-medium px-4 py-2 rounded-lg hover:text-blue-500 transition-all duration-300 group ${
                      isScrolled ? "text-sm" : "text-base"
                    } ${isActive ? "text-blue-500" : ""}`}
                  >
                    <span className="relative">
                      {link.name}
                      <span
                        className={`absolute rounded-full left-0 -bottom-1 h-[1.5px] bg-primary transition-all duration-300 origin-left ${
                          isActive
                            ? "w-[80%] opacity-100"
                            : "w-0 opacity-0 group-hover:w-[80%] group-hover:opacity-100"
                        }`}
                      />
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Dedicated Cost Estimator button on the right side */}
            <div className="hidden lg:flex items-center">
              <Link
                to="/calculator"
                className={`relative group inline-flex items-center justify-center font-barlow font-semibold text-white bg-[#0A84FF] hover:bg-blue-600 transition-all duration-300 rounded-xl shadow-[0_2px_12px_rgba(10,132,255,0.4)] hover:shadow-[0_4px_20px_rgba(10,132,255,0.5)] hover:-translate-y-[1px] active:translate-y-0 ${
                  isScrolled ? "px-5 py-2 text-xs" : "px-6 py-2.5 text-sm"
                }`}
              >
                <span>Cost Estimator</span>
              </Link>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white cursor-pointer p-2 sm:p-2.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] hover:border-white/[0.2] rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              aria-label="Toggle menu"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 group-hover:translate-x-full transition-transform duration-700"></div>
              <div
                className={`relative transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : "rotate-0"}`}
              >
                {isMobileMenuOpen ? (
                  <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <HiMenuAlt3 className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
            </button>
          </div>

          <div
            className={`lg:hidden fixed right-6.5 top-0 bottom-4 h-fit w-[80%] max-w-sm bg-[#0e0e0e] border border-light-black rounded-xl shadow-2xl shadow-blue-500/10 z-50 transition-all duration-500 ease-out ${
              isMobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-[120%] opacity-0"
            }`}
            style={{ top: isScrolled ? "85px" : "100px" }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative flex flex-col h-full px-6 py-8">
              <nav className="flex flex-col space-y-3 mb-8">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      viewTransition
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group relative font-barlow font-semibold text-base sm:text-lg px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl border transition-all duration-300 overflow-hidden flex items-center justify-between ${
                        isActive
                          ? "border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(10,132,255,0.15)]"
                          : "border-white/5 hover:border-blue-500/40 hover:bg-white/[0.04] text-white"
                      } ${
                        isMobileMenuOpen
                          ? "opacity-100 blur-0 translate-x-0 scale-100"
                          : "opacity-0 blur-sm -translate-x-10 scale-95"
                      }`}
                      style={{
                        transitionDelay: isMobileMenuOpen
                          ? `${100 + index * 80}ms`
                          : "0ms",
                      }}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono font-bold transition-colors duration-300 ${
                          isActive ? "text-blue-400" : "text-gray-500 group-hover:text-blue-400/70"
                        }`}>
                          0{index + 1}
                        </span>

                        <span className={`transition-colors duration-300 ${
                          isActive ? "text-blue-400" : "group-hover:text-blue-400"
                        }`}>
                          {link.name}
                        </span>
                      </div>

                      <span
                        className={`transition-all duration-300 ${
                          isActive
                            ? "opacity-100 translate-x-0 text-blue-400"
                            : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 text-blue-500"
                        }`}
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Book a Call — mobile drawer button (commented out; re-enable when needed)
              <div
                className={`transition-all duration-500 ${
                  isMobileMenuOpen
                    ? "opacity-100 blur-0 translate-y-0 scale-100"
                    : "opacity-0 blur-sm translate-y-10 scale-95"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? "500ms" : "0ms" }}
              >
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full text-sm font-bold px-8 py-4 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow duration-300"
                >
                  Book a Call
                </Button>
              </div>
              */}

            </div>
          </div>
        </div>
      </nav>
      {/* <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
    </>
  );
};

export default NavBar;
