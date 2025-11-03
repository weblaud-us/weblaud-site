import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const NavBar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { name: "Our Services", href: "/services" },
    { name: "Our Projects", href: "/projects" },
    { name: "Contact Us", href: "/contact" },
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
                ? "bg-card-bg backdrop-blur-lg border border-light-black rounded-2xl px-4 md:px-6 py-2 md:py-3 shadow-lg shadow-black/50"
                : "bg-card-bg backdrop-blur-md border border-light-black   rounded-3xl px-6 md:px-8 py-3 md:py-4"
            } ${
              isVisible
                ? "opacity-100 blur-0 translate-y-0"
                : "opacity-0 blur-[10px] -translate-y-5"
            }`}
          >
            <div className="shrink-0">
              <Link
                to="/"
                className={`text-xl md:text-2xl font-semibold font-poppins transition-all duration-300 ${
                  isScrolled ? "text-lg md:text-xl" : "text-xl md:text-2xl"
                }`}
              >
                <span className="text-blue-500">Dev</span>{" "}
                <span className="text-white">Nest</span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`relative text-white font-barlow font-medium px-4 py-2 rounded-lg hover:text-blue-500 transition-all duration-300 group ${
                      isScrolled ? "text-sm" : "text-base"
                    } ${isActive ? "text-blue-500" : ""}`}
                  >
                    <span className="relative">
                      {link.name}
                      {/* Underline animation */}
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

            <div className="hidden lg:flex items-center">
              <Button
                className={`text-xs font-bold transition-all duration-300 ${
                  isScrolled ? "px-6 py-2.5 text-xs" : "px-8 py-3 text-sm"
                }`}
              >
                Contact Us
              </Button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white cursor-pointer p-2 hover:bg-blue-500/20 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 relative overflow-hidden group"
              aria-label="Toggle menu"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 group-hover:translate-x-full transition-transform duration-700"></div>
              <div
                className={`relative transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : "rotate-0"}`}
              >
                {isMobileMenuOpen ? (
                  <HiX className="w-6 h-6" />
                ) : (
                  <HiMenuAlt3 className="w-6 h-6" />
                )}
              </div>
            </button>
          </div>

          <div
            className={`lg:hidden fixed right-6.5 top-0 bottom-4 h-fit w-[80%] max-w-sm bg-linear-to-br from-card-bg via-card-bg to-black border border-light-black rounded-xl shadow-2xl shadow-blue-500/10 z-50 transition-all duration-500 ease-out ${
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
                {navLinks.map((link, index) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group relative text-white font-barlow font-semibold text-lg px-6 py-4 rounded-xl border border-white/5 hover:border-blue-500/50 hover:bg-linear-to-r hover:from-blue-500/10 hover:to-transparent transition-all duration-500 overflow-hidden ${
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

                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-500/30 text-xs font-bold">
                      0{index + 1}
                    </span>

                    <span className="relative ml-6 group-hover:text-blue-400 transition-colors duration-300">
                      {link.name}
                    </span>

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all duration-300 text-blue-500">
                      →
                    </span>
                  </Link>
                ))}
              </nav>

              <div
                className={`transition-all duration-500 ${
                  isMobileMenuOpen
                    ? "opacity-100 blur-0 translate-y-0 scale-100"
                    : "opacity-0 blur-sm translate-y-10 scale-95"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? "500ms" : "0ms" }}
              >
                <Button className="w-full text-sm font-bold px-8 py-4 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow duration-300">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
