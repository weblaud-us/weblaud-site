import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiPhone, FiChevronDown, FiSearch, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { countryCodes } from "~/data/country-codes";

interface CountryCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function CountryCodeSelect({
  value,
  onChange,
  className = "",
}: CountryCodeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 280 });

  const selectedCountry =
    countryCodes.find((c) => c.code === value) || countryCodes[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = Math.max(280, rect.width);
    const spaceBelow = window.innerHeight - rect.bottom;
    const popoverHeight = 280;

    let top = rect.bottom + 6;
    if (spaceBelow < popoverHeight && rect.top > popoverHeight) {
      top = rect.top - popoverHeight - 6;
    }

    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 16) {
      left = window.innerWidth - dropdownWidth - 16;
    }
    if (left < 16) left = 16;

    setPosition({
      top: Math.max(8, top),
      left,
      width: dropdownWidth,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleWindowScroll = (event: Event) => {
      // Ignore scroll events originating from inside the dropdown itself
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node)
      ) {
        return;
      }
      updatePosition();
    };

    const handleResize = () => updatePosition();

    window.addEventListener("scroll", handleWindowScroll, true);
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    const timer = setTimeout(() => searchInputRef.current?.focus(), 60);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll, true);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, updatePosition]);

  const filteredCountries = countryCodes.filter(
    (c) =>
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!isOpen) updatePosition();
          setIsOpen(!isOpen);
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full bg-black/60 border border-white/[0.08] hover:border-primary/40 focus:border-primary/60 focus:bg-black/90 rounded-xl px-3.5 py-3 text-white font-barlow text-sm flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer shadow-sm group"
      >
        <div className="flex items-center gap-2 min-w-0">
          <FiPhone className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors shrink-0" />
          <span className="text-base leading-none shrink-0">
            {selectedCountry.flag}
          </span>
          <span className="font-mono text-xs sm:text-sm text-gray-200 font-medium">
            {selectedCountry.code}
          </span>
        </div>
        <FiChevronDown
          className={`w-4 h-4 text-gray-400 group-hover:text-primary transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Portal Dropdown Menu */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: position.top,
                  left: position.left,
                  width: position.width,
                  zIndex: 999999,
                }}
                className="bg-[#121212] border border-white/[0.14] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl"
              >
                {/* Search Box */}
                <div className="p-2.5 border-b border-white/[0.08] bg-[#161616]">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search country or code..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-black/80 border border-white/[0.1] focus:border-primary/60 rounded-lg pl-8 pr-3 py-1.5 text-xs sm:text-sm text-white font-barlow placeholder:text-gray-500 outline-none"
                    />
                  </div>
                </div>

                {/* List Container with isolated scrolling */}
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="max-h-56 overflow-y-auto overscroll-contain py-1 divide-y divide-white/[0.02] touch-pan-y"
                >
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country, idx) => {
                      const isSelected = country.code === value;
                      return (
                        <button
                          key={`${country.code}-${country.country}-${idx}`}
                          type="button"
                          onClick={() => {
                            onChange(country.code);
                            setIsOpen(false);
                            setSearch("");
                          }}
                          className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer text-xs sm:text-sm font-barlow ${
                            isSelected
                              ? "bg-primary/20 text-white font-semibold"
                              : "text-gray-300 hover:bg-white/[0.08] hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span className="text-base leading-none">
                              {country.flag}
                            </span>
                            <span className="truncate">{country.country}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-xs text-primary font-medium">
                              {country.code}
                            </span>
                            {isSelected && (
                              <FiCheck className="w-3.5 h-3.5 text-primary" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-6 text-center text-xs text-gray-500 font-barlow">
                      No countries found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
