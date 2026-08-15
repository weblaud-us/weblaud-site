import { useState, useRef, useEffect } from "react";
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const selectedCountry =
    countryCodes.find((c) => c.code === value) || countryCodes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const filteredCountries = countryCodes.filter(
    (c) =>
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
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

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-[#121212] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
          >
            {/* Search Box */}
            <div className="p-2.5 border-b border-white/[0.08]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search country or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black/60 border border-white/[0.08] focus:border-primary/60 rounded-lg pl-8 pr-3 py-1.5 text-xs sm:text-sm text-white font-barlow placeholder:text-gray-500 outline-none"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto no-scrollbar py-1 divide-y divide-white/[0.02]">
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
                          ? "bg-primary/15 text-white font-semibold"
                          : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
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
      </AnimatePresence>
    </div>
  );
}
