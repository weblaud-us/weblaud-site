import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { ChevronDown, ChevronRight } from "lucide-react";
import weblaudLogo from "~/assets/weblaud-logo.svg";
import { LazyBookingModal as BookingModal } from "~/components/ui/lazy-booking-modal";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { cn } from "~/lib/utils";

type NavItem = { name: string; href: string; children?: { name: string; href: string; description: string }[] };

// Contact, Free Audit and the client portal live in the drawer's secondary
// row and the footer; the top level is for people hiring us.
const NAV_ITEMS: NavItem[] = [
  { name: "Services", href: "/services" },
  // /projects, not /#work: the home page's featured-work block only renders
  // when the CMS has published case studies, so the anchor can be missing.
  { name: "Our Work", href: "/projects" },
  { name: "Process", href: "/#process" },
  {
    name: "Pricing & Estimator",
    href: "/software-development-cost",
    children: [
      { name: "Pricing guide", href: "/software-development-cost", description: "How milestone pricing works" },
      { name: "Project estimator", href: "/calculator", description: "A ballpark in about two minutes" },
    ],
  },
  { name: "About", href: "/aboutus" },
  { name: "Insights", href: "/insights" },
];

const SECONDARY_LINKS = [
  { name: "Contact", href: "/contact" },
  { name: "Free Audit", href: "/audit" },
  { name: "Client Login", href: "/portal/login" },
];

const CTA = { label: "Discuss Your Project", href: "/#discuss" };

function isActive(pathname: string, item: { href: string; children?: { href: string }[] }) {
  if (item.href.startsWith("/#")) return false;
  const hrefs = item.children ? item.children.map((child) => child.href) : [item.href];
  return hrefs.some((href) => pathname.startsWith(href));
}

const NavBar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const drawerId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // No entrance animation: the navbar used to render hidden (opacity 0 +
  // blur) until hydration flipped it visible, so the logo — the page's
  // largest-paint candidate — waited ~4 s for JS on a phone.
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the drawer on any navigation, including hash links on the same page.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.key]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Focus moves into the drawer when it opens and back to its toggle when it closes.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Next frame: the drawer is still visibility:hidden in this commit.
      const frame = requestAnimationFrame(() => drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus());
      wasOpen.current = true;
      return () => cancelAnimationFrame(frame);
    } else if (wasOpen.current) {
      menuButtonRef.current?.focus();
    }
    wasOpen.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  // While open: Escape closes, and Tab cycles through the toggle and the
  // drawer only, since the page behind is covered by the scrim.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current || !menuButtonRef.current) return;
      const focusables = [
        menuButtonRef.current,
        ...drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (current === first || !focusables.includes(current!))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !focusables.includes(current!))) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <>
      {isMobileMenuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-[fadeIn_0.3s_ease-out]"
        />
      )}

      <nav
        aria-label="Main"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled ? "py-2 md:py-3" : "py-3 md:py-4"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10">
          <div
            className={`flex items-center justify-between gap-3 transition-all duration-1000 ease-out ${
              isScrolled
                ? "bg-[#0e0e0e] border border-light-black/50 rounded-2xl px-3 md:px-5 py-2 shadow-lg shadow-black/50"
                : "bg-[#0e0e0e] border border-white/[0.08] md:border-light-black rounded-2xl md:rounded-3xl px-3 sm:px-5 py-2 md:py-2.5 shadow-lg shadow-black/40"
            }`}
          >
            <Link to="/" aria-label="Weblaud home" className="flex min-h-11 shrink-0 items-center">
              <img
                src={weblaudLogo}
                alt=""
                className={`w-auto object-contain transition-all duration-300 ${isScrolled ? "h-6 sm:h-7" : "h-6 sm:h-8 xl:h-9"}`}
              />
            </Link>

            <ul className="hidden lg:flex items-center">
              {NAV_ITEMS.map((item) => {
                const active = isActive(location.pathname, item);
                return (
                  <li key={item.name}>
                    {item.children ? (
                      <NavDropdown item={item} active={active} />
                    ) : (
                      <Link
                        to={item.href}
                        viewTransition={!item.href.startsWith("/#")}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative group inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-2 xl:px-3 font-barlow text-[15px] font-medium transition-colors duration-300",
                          active ? "text-primary" : "text-white hover:text-primary",
                        )}
                      >
                        <span className="relative">
                          {item.name}
                          <span
                            aria-hidden="true"
                            className={cn(
                              "absolute rounded-full left-0 -bottom-1 h-[1.5px] bg-primary transition-all duration-300 origin-left",
                              active ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100",
                            )}
                          />
                        </span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle />
              <Link
                to={CTA.href}
                className="hidden sm:inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl px-4 xl:px-5 font-barlow font-semibold text-sm text-white bg-primary-solid hover:bg-primary-solid-hover shadow-[0_2px_12px_rgba(10,132,255,0.4)] hover:shadow-[0_4px_20px_rgba(10,132,255,0.5)] transition-all duration-300"
              >
                {CTA.label}
              </Link>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="lg:hidden inline-flex size-11 shrink-0 cursor-pointer items-center justify-center text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] hover:border-white/[0.2] rounded-xl transition-colors duration-300"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls={drawerId}
              >
                {isMobileMenuOpen ? <HiX className="size-5" aria-hidden="true" /> : <HiMenuAlt3 className="size-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div
            id={drawerId}
            ref={drawerRef}
            className={`lg:hidden fixed right-4 sm:right-6 z-50 w-[calc(100%-2rem)] max-w-sm overflow-y-auto overscroll-contain bg-[#0e0e0e] border border-light-black rounded-xl shadow-2xl shadow-blue-500/10 ease-out motion-reduce:transition-none ${
              // Visibility flips instantly on open (so focus can move in) and
              // only after the slide-out on close.
              isMobileMenuOpen
                ? "visible translate-x-0 opacity-100 [transition:transform_500ms,opacity_500ms,visibility_0s]"
                : "invisible translate-x-[120%] opacity-0 [transition:transform_500ms,opacity_500ms,visibility_0s_500ms]"
            }`}
            style={{ top: isScrolled ? "76px" : "88px", maxHeight: "calc(100dvh - 100px)" }}
          >
            <div className="flex flex-col p-4">
              <ul className="mb-4 flex flex-col gap-1.5">
                {NAV_ITEMS.flatMap((item) =>
                  item.children ? item.children.map((child) => ({ name: child.name, href: child.href })) : [item],
                ).map((link, index) => {
                  const active = isActive(location.pathname, link);
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex min-h-12 items-center justify-between rounded-xl border px-4 font-barlow font-semibold text-base transition-colors duration-300",
                          active
                            ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                            : "border-white/5 hover:border-blue-500/40 hover:bg-white/[0.04] text-white",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span className={cn("text-xs font-mono font-bold", active ? "text-blue-400" : "text-gray-500 group-hover:text-blue-400")}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {link.name}
                        </span>
                        <ChevronRight className={cn("size-4", active ? "text-blue-400" : "text-gray-500")} aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <ul className="mb-4 flex flex-wrap gap-x-1 border-t border-white/[0.08] pt-3">
                {SECONDARY_LINKS.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex min-h-11 items-center rounded-lg px-3 font-barlow text-sm font-medium text-gray-400 transition-colors duration-300 hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-2">
                <Link
                  to={CTA.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary-solid hover:bg-primary-solid-hover font-barlow font-semibold text-sm text-white transition-colors duration-300"
                >
                  {CTA.label}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.04] font-barlow font-semibold text-sm text-white transition-colors duration-300"
                >
                  Book a discovery call
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

/**
 * Disclosure menu (button + list of links), not an ARIA menu: links stay links,
 * Tab moves through them, Escape and focus leaving the group close it.
 */
function NavDropdown({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  // A mouse user's click usually lands just after hover opened the menu; that
  // click should not close it again.
  const hoverOpenedAt = useRef(0);

  useEffect(() => setOpen(false), [location.key]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={() => {
        hoverOpenedAt.current = Date.now();
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (open && Date.now() - hoverOpenedAt.current < 600) return;
          setOpen((current) => !current);
        }}
        className={cn(
          "inline-flex min-h-11 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-2 xl:px-3 font-barlow text-[15px] font-medium transition-colors duration-300",
          active || open ? "text-primary" : "text-white hover:text-primary",
        )}
      >
        {item.name}
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} aria-hidden="true" />
      </button>
      <div id={panelId} hidden={!open} className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2">
        <ul className="rounded-2xl border border-light-black bg-[#0e0e0e] p-2 shadow-xl shadow-black/40">
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link
                to={child.href}
                viewTransition
                className="flex min-h-11 flex-col justify-center rounded-xl px-3 py-2.5 transition-colors duration-300 hover:bg-white/[0.06]"
              >
                <span className="font-barlow text-sm font-semibold text-white">{child.name}</span>
                <span className="text-xs text-gray-400">{child.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
