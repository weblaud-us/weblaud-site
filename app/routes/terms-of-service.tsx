import { useState, useEffect } from "react";
import type { Route } from "./+types/terms-of-service";
import SectionBadge from "~/components/ui/section-badge";
import { useBlurAnimation, useBlurAnimationList } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import {
  Scale,
  FileCheck,
  ShieldCheck,
  Copyright,
  SlidersHorizontal,
  ShieldAlert,
  RotateCcw,
  Mail,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Service – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Read the Terms of Service of Weblaud LLC. These terms govern your use of our website and custom software engineering services.",
    },
    {
      property: "og:title",
      content: "Terms of Service – Weblaud LLC",
    },
    {
      property: "og:description",
      content:
        "Read the Terms of Service of Weblaud LLC. These terms govern your use of our website and services.",
    },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://weblaud.com/terms-of-service",
    },
    {
      name: "twitter:title",
      content: "Terms of Service – Weblaud LLC",
    },
    {
      name: "twitter:description",
      content:
        "Read the Terms of Service of Weblaud LLC. These terms govern your use of our website and services.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://weblaud.com/terms-of-service",
    },
  ];
}

const sections = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of Terms",
    icon: FileCheck,
    content: (
      <p className="text-gray-300 leading-relaxed">
        By accessing and using Weblaud&apos;s website, digital tools, and custom software
        engineering services, you agree to be bound by these Terms of Service. If you do
        not agree with any part of these terms, please do not use our website or services.
        Continued use indicates your full legal acceptance of these stipulations.
      </p>
    ),
  },
  {
    id: "services",
    number: "02",
    title: "Use of Services",
    icon: ShieldCheck,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          You agree to use our services solely for lawful purposes and in strict accordance
          with these Terms. When utilizing our platforms and services, you agree not to:
        </p>
        <div className="grid gap-3">
          {[
            "Violate any applicable local, national, or international laws, regulatory frameworks, or industry compliance standards.",
            "Engage in any conduct that restricts, disables, or inhibits anyone else's use, access, or enjoyment of our services.",
            "Attempt to gain unauthorized access to any portion of our services, private servers, databases, or client repositories.",
            "Transmit any malware, automated scrapers, denial-of-service attacks, or malicious computational payloads.",
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
    id: "ip",
    number: "03",
    title: "Intellectual Property Rights",
    icon: Copyright,
    content: (
      <div className="space-y-3">
        <p className="text-gray-300 leading-relaxed">
          All website materials, software architecture designs, interface components, code
          frameworks, branding, logos, and digital copy are the exclusive intellectual
          property of <strong className="text-white">Weblaud LLC</strong> and are protected by
          international copyright, trademark, and trade secret laws.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Custom software deliverables developed under separate signed client agreements
          remain governed by the explicit IP assignment and licensing clauses specified in
          those dedicated master service agreements.
        </p>
      </div>
    ),
  },
  {
    id: "modifications",
    number: "04",
    title: "Service Modifications",
    icon: SlidersHorizontal,
    content: (
      <p className="text-gray-300 leading-relaxed">
        Weblaud reserves the right to modify, upgrade, suspend, or discontinue any public
        aspect of our website or exploratory digital tools at any time without prior
        notice. We will not be liable to you or any third party for modifications, price
        adjustments, or temporary service discontinuations.
      </p>
    ),
  },
  {
    id: "liability",
    number: "05",
    title: "Limitation of Liability",
    icon: ShieldAlert,
    content: (
      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
        <p className="text-sm text-gray-300 leading-relaxed">
          To the maximum extent permitted by applicable law, Weblaud LLC, its directors,
          officers, and engineering staff shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages, or loss of profits, data, or
          business opportunities resulting from your use of or inability to use our
          services.
        </p>
      </div>
    ),
  },
  {
    id: "changes",
    number: "06",
    title: "Changes to Terms",
    icon: RotateCcw,
    content: (
      <p className="text-gray-300 leading-relaxed">
        We periodically review and update these Terms of Service to reflect evolving legal
        requirements and technical practices. The revised version will be published on
        this page with an updated revision date. Your ongoing use of our platform constitutes
        acceptance of the updated Terms.
      </p>
    ),
  },
  {
    id: "contact",
    number: "07",
    title: "Contact & Legal Inquiries",
    icon: Mail,
    content: (
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">
          If you have questions, inquiries, or legal notices concerning these Terms of
          Service, our legal and compliance team is available to assist:
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

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState("acceptance");
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
            icon={<Scale className="w-3.5 h-3.5" />}
            text="Legal & Compliance"
            badgeLabel="Terms of Service"
            color="#0a84ff"
            className="mb-4"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-barlow text-white tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 font-barlow text-sm sm:text-base max-w-2xl mx-auto">
            Please read these terms carefully before utilizing Weblaud LLC platforms,
            software systems, and engineering consulting services.
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

            {/* Quick Contact Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-[#0e0e0e] to-[#0e0e0e] border border-blue-500/20">
              <h4 className="text-sm font-bold font-barlow text-white mb-1.5">
                Have a question?
              </h4>
              <p className="text-xs text-gray-400 mb-3.5 leading-relaxed">
                Our legal and advisory team is here to answer any questions about our
                service agreements.
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
