import { useState, useEffect } from "react";
import type { Route } from "./+types/privacy-policy";
import SectionBadge from "~/components/ui/section-badge";
import { useBlurAnimation, useBlurAnimationList } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import {
  ShieldCheck,
  FileText,
  Database,
  Share2,
  Cpu,
  LockKeyhole,
  Mail,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Read the Privacy Policy of Weblaud LLC to understand how we collect, use, and protect your personal data.",
    },
    {
      property: "og:title",
      content: "Privacy Policy – Weblaud LLC",
    },
    {
      property: "og:description",
      content:
        "Read the Privacy Policy of Weblaud LLC to understand how we collect, use, and protect your personal data.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/privacy-policy" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Privacy Policy – Weblaud LLC" },
    {
      name: "twitter:description",
      content:
        "Read the Privacy Policy of Weblaud LLC to understand how we collect, use, and protect your personal data.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://weblaud.com/privacy-policy",
    },
  ];
}

const sections = [
  {
    id: "introduction",
    number: "01",
    title: "Introduction",
    icon: FileText,
    content: (
      <p className="text-gray-300 leading-relaxed">
        Welcome to <strong className="text-white">Weblaud LLC</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
        We are deeply committed to protecting your privacy and ensuring your personal information
        is handled with the highest standards of safety, transparency, and data integrity. This
        Privacy Policy outlines how we collect, use, and safeguard your data when you visit our
        website, interact with our calculators, or engage our engineering services.
      </p>
    ),
  },
  {
    id: "collection",
    number: "02",
    title: "Information We Collect",
    icon: Database,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          We collect limited, purposeful information necessary to provide high-quality engineering
          consulting and user experiences:
        </p>
        <div className="grid gap-3">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Personal & Contact Information</span>
            </div>
            <p className="text-xs text-gray-400 pl-6 leading-relaxed">
              Name, corporate email address, telephone number, company name, and project scope details
              submitted voluntarily when submitting inquiries or booking discovery calls.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Technical & Usage Telemetry</span>
            </div>
            <p className="text-xs text-gray-400 pl-6 leading-relaxed">
              IP address, browser user-agent, operating system, pages visited, session duration, and
              referral channels captured to analyze traffic trends and protect system integrity.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "third-party",
    number: "03",
    title: "Third-Party Processors",
    icon: Share2,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          We integrate trusted third-party service providers solely to power core features. Each
          provider processes information under strict security obligations:
        </p>
        <div className="grid sm:grid-cols-2 gap-3.5">
          {[
            {
              name: "Web3Forms",
              badge: "Form Processing",
              desc: "Transmits inquiry form submissions safely to our engineering team inbox.",
              link: "https://web3forms.com",
            },
            {
              name: "Zcal",
              badge: "Meeting Scheduling",
              desc: "Manages calendar availability and booking confirmations seamlessly.",
              link: "https://zcal.co",
            },
            {
              name: "Google Fonts",
              badge: "Typography Delivery",
              desc: "Serves optimized web typefaces directly from high-speed edge CDN nodes.",
              link: "https://fonts.google.com",
            },
            {
              name: "Google Analytics (GA4)",
              badge: "Privacy-Preserving Telemetry",
              desc: "Provides aggregated traffic insights without storing raw personal profiles.",
              link: "https://tools.google.com/dlpage/gaoptout",
              optOut: true,
            },
          ].map((provider, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-white font-bold text-sm">{provider.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {provider.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">{provider.desc}</p>
              </div>
              <a
                href={provider.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
              >
                <span>{provider.optOut ? "GA4 Opt-out Add-on" : "Privacy Policy"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "use-of-info",
    number: "04",
    title: "How We Use Data",
    icon: Cpu,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          Collected data is utilized strictly for transparent business operations:
        </p>
        <div className="grid gap-2.5">
          {[
            "Deliver, configure, and maintain our custom software engineering solutions.",
            "Respond to discovery inquiries, technical RFPs, and consultation requests.",
            "Analyze platform performance to optimize responsiveness, SEO, and user workflows.",
            "Comply with international data regulations and prevent fraudulent or abusive activity.",
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
            >
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "security",
    number: "05",
    title: "Data Security & Retention",
    icon: LockKeyhole,
    content: (
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 via-[#0e0e0e] to-[#0e0e0e] border border-blue-500/20 space-y-2">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <LockKeyhole className="w-4 h-4 text-primary" />
          <span>Enterprise-Grade Encryption</span>
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed">
          We apply robust organizational, administrative, and technical measures including TLS 1.3
          transit encryption, zero-trust backend access controls, and strict key rotation policies to
          protect your personal information from unauthorized access, loss, or disclosure.
        </p>
      </div>
    ),
  },
  {
    id: "contact",
    number: "06",
    title: "Data Controller & Contact",
    icon: Mail,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          If you have questions regarding data processing, privacy rights, or wish to request data
          deletion, please reach out directly:
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="mailto:info@weblaud.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25"
          >
            <Mail className="w-4 h-4" />
            <span>info@weblaud.com</span>
          </a>
        </div>
      </div>
    ),
  },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [heroRef, isHeroVisible] = useBlurAnimation<HTMLDivElement>();
  const [sidebarRef, isSidebarVisible] = useBlurAnimation<HTMLDivElement>();
  const sectionIds = sections.map((s) => s.id);
  const { itemRefs, isItemVisible } = useBlurAnimationList(sectionIds, 0.08);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 110;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
      window.history.pushState(null, "", `#${id}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pt-28 sm:pt-32 md:pt-36 pb-20 px-4 sm:px-6 lg:px-8 xl:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Hero Header */}
        <div
          ref={heroRef}
          className={`text-center mb-12 sm:mb-16 ${getBlurAnimationClasses(isHeroVisible)}`}
        >
          <SectionBadge
            icon={<ShieldCheck className="w-3.5 h-3.5" />}
            text="Data Protection"
            badgeLabel="Privacy Policy"
            color="#0a84ff"
            className="mb-4"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-barlow text-white tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 font-barlow text-sm sm:text-base max-w-2xl mx-auto">
            Learn how Weblaud LLC collects, processes, and safeguards personal data across all
            our software platforms, client channels, and engineering operations.
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Sticky Table of Contents */}
          <aside
            ref={sidebarRef}
            className={`hidden lg:block lg:col-span-4 sticky top-28 space-y-5 ${getBlurAnimationClasses(isSidebarVisible)}`}
          >
            <div className="p-5 rounded-2xl bg-[#0e0e0e] border border-[#1f1f1f]">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-4 px-2">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => scrollToSection(e, section.id)}
                      className={`group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-barlow font-medium transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 select-none border cursor-pointer ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold border-primary/30 shadow-[0_0_12px_rgba(10,132,255,0.15)]"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.03] border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-white/30 group-hover:text-primary">
                          {section.number}
                        </span>
                        <span className="truncate">{section.title}</span>
                      </div>
                      <ArrowUpRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                        }`}
                      />
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Privacy Inquiries Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-[#0e0e0e] to-[#0e0e0e] border border-blue-500/20">
              <h4 className="text-sm font-bold font-barlow text-white mb-1.5">
                Privacy Requests?
              </h4>
              <p className="text-xs text-gray-400 mb-3.5 leading-relaxed">
                Contact our data controller to request information or request data updates.
              </p>
              <a
                href="mailto:info@weblaud.com"
                className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
              >
                <span>info@weblaud.com</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </aside>

          {/* Right Column: Section Cards */}
          <div className="lg:col-span-8 space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              const isVisible = isItemVisible(section.id);
              return (
                <article
                  id={section.id}
                  key={section.id}
                  ref={(el) => {
                    if (el) itemRefs.current.set(section.id, el);
                  }}
                  className={`rounded-2xl p-6 sm:p-8 bg-[#0e0e0e] border border-[#1f1f1f] hover:border-primary/30 transition-all duration-700 hover:-translate-y-0.5 scroll-mt-32 ${getBlurAnimationClasses(isVisible)}`}
                >
                  {/* Section Top Header */}
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold font-barlow text-white tracking-tight">
                        {section.number}. {section.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-inner">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="font-mono text-xs font-bold text-white/50">
                        {section.number}
                      </span>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="font-barlow text-sm sm:text-base">{section.content}</div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
