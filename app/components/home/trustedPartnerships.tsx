import React, { useState } from "react";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import SectionBadge from "~/components/ui/section-badge";
import { Cpu } from "lucide-react";
import {
  SiGooglecloud,
  SiReplit,
  SiAmazonwebservices,
  SiVercel,
  SiStripe,
  SiOpenai,
  SiGooglegemini,
  SiAnthropic,
  SiPerplexity,
  SiElevenlabs,
  SiHuggingface,
  SiMeta,
  SiLangchain,
  SiOllama,
  SiGithubcopilot,
  SiNvidia,
  SiPytorch,
  SiFigma,
  SiTwilio,
} from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

const PaystackIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" {...props}>
    <rect x="2" y="3" width="20" height="4.5" rx="2.25" />
    <rect x="2" y="9.75" width="14" height="4.5" rx="2.25" />
    <rect x="2" y="16.5" width="20" height="4.5" rx="2.25" />
  </svg>
);

const SslCommerzIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" />
    <rect x="9" y="11" width="6" height="5" rx="1" fill="currentColor" />
    <path d="M10 11V9a2 2 0 0 1 4 0v2" />
  </svg>
);

const ReplicateIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" {...props}>
    <path d="M24 10.272H13.627v2.449H24v-2.45zM24 3.738H13.627v2.449H24V3.738zM24 16.806H13.627v2.45H24v-2.45zM10.873 3.738H0v15.518h2.755V6.188h8.118V3.738z" />
  </svg>
);

interface Partner {
  name: string;
  category: "Cloud" | "AI & ML" | "Payments" | "Tools";
  icon: React.ReactNode;
  color: string;
  showName?: boolean;
}

const partnersRow1: Partner[] = [
  {
    name: "AWS",
    category: "Cloud",
    icon: <SiAmazonwebservices />,
    color: "#FF9900",
    showName: true,
  },
  {
    name: "Google Cloud",
    category: "Cloud",
    icon: <SiGooglecloud />,
    color: "#4285F4",
    showName: true,
  },
  {
    name: "Microsoft Azure",
    category: "Cloud",
    icon: <VscAzure />,
    color: "#0089D6",
    showName: true,
  },
  {
    name: "OpenAI",
    category: "AI & ML",
    icon: <SiOpenai />,
    color: "#10A37F",
    showName: true,
  },
  {
    name: "Google Gemini",
    category: "AI & ML",
    icon: <SiGooglegemini />,
    color: "#8E75FF",
    showName: true,
  },
  {
    name: "Anthropic",
    category: "AI & ML",
    icon: <SiAnthropic />,
    color: "#D97757",
    showName: true,
  },
  {
    name: "NVIDIA AI",
    category: "AI & ML",
    icon: <SiNvidia />,
    color: "#76B900",
    showName: true,
  },
  {
    name: "PyTorch",
    category: "AI & ML",
    icon: <SiPytorch />,
    color: "#EE4C2C",
    showName: true,
  },
  {
    name: "Stripe",
    category: "Payments",
    icon: <SiStripe />,
    color: "#635BFF",
    showName: true,
  },
  {
    name: "Figma",
    category: "Tools",
    icon: <SiFigma />,
    color: "#F24E1E",
    showName: true,
  },
  {
    name: "ElevenLabs",
    category: "AI & ML",
    icon: <SiElevenlabs />,
    color: "#FFFFFF",
    showName: true,
  },
  {
    name: "Twilio",
    category: "Tools",
    icon: <SiTwilio />,
    color: "#F22F46",
    showName: true,
  },
];

const partnersRow2: Partner[] = [
  {
    name: "Vercel",
    category: "Cloud",
    icon: <SiVercel />,
    color: "#FFFFFF",
    showName: true,
  },
  {
    name: "Replit",
    category: "Cloud",
    icon: <SiReplit />,
    color: "#F26207",
    showName: true,
  },
  {
    name: "Perplexity AI",
    category: "AI & ML",
    icon: <SiPerplexity />,
    color: "#22B8CF",
    showName: true,
  },
  {
    name: "Hugging Face",
    category: "AI & ML",
    icon: <SiHuggingface />,
    color: "#FFD21E",
    showName: true,
  },
  {
    name: "Meta AI",
    category: "AI & ML",
    icon: <SiMeta />,
    color: "#0467DF",
    showName: true,
  },
  {
    name: "LangChain",
    category: "AI & ML",
    icon: <SiLangchain />,
    color: "#2DD4BF",
    showName: true,
  },
  {
    name: "Ollama",
    category: "AI & ML",
    icon: <SiOllama />,
    color: "#FFFFFF",
    showName: true,
  },
  {
    name: "GitHub Copilot",
    category: "AI & ML",
    icon: <SiGithubcopilot />,
    color: "#6E40C9",
    showName: true,
  },
  {
    name: "Replicate",
    category: "AI & ML",
    icon: <ReplicateIcon />,
    color: "#FA5252",
    showName: true,
  },
  {
    name: "Paystack",
    category: "Payments",
    icon: <PaystackIcon />,
    color: "#00C3F7",
    showName: true,
  },
  {
    name: "SSLCommerz",
    category: "Payments",
    icon: <SslCommerzIcon />,
    color: "#E31E24",
    showName: true,
  },
];

const PartnerLogoCard = ({ partner }: { partner: Partner }) => {
  return (
    <div
      aria-label={`${partner.name} - ${partner.category}`}
      role="img"
      className="partner-card group relative flex items-center gap-2.5 sm:gap-3.5 mx-1.5 sm:mx-2 md:mx-2.5 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 md:px-5 h-[48px] sm:h-[56px] md:h-[64px] min-w-[135px] sm:min-w-[155px] md:min-w-[170px] cursor-pointer shrink-0 transition-all duration-300 overflow-hidden select-none bg-[#111111] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:-translate-y-[2px]"
      style={
        {
          "--brand-color": partner.color,
          contain: "paint layout",
          willChange: "transform",
        } as React.CSSProperties
      }
    >
      {/* Dynamic Brand Gradient Background on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 90% 80% at 50% 50%, ${partner.color}25 0%, transparent 80%)`,
        }}
      />

      {/* Icon with Brand Color */}
      <div
        className="text-base sm:text-lg md:text-xl shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{
          color: partner.color,
        }}
      >
        {partner.icon}
      </div>

      {/* Partner Name */}
      {partner.showName && (
        <div className="flex flex-col min-w-0 relative z-10">
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.06em] sm:tracking-[0.08em] uppercase font-barlow whitespace-nowrap text-white/85 group-hover:text-white transition-colors duration-300">
            {partner.name}
          </span>
          <span className="text-[8px] sm:text-[9px] font-mono tracking-wider text-white/40 group-hover:text-[var(--brand-color)] transition-colors duration-300">
            {partner.category}
          </span>
        </div>
      )}
    </div>
  );
};

const TrustedPartnerships = () => {
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLDivElement>();
  const [marqueeRef, isMarqueeVisible] = useBlurAnimation<HTMLDivElement>();

  // Tripled lists so seamless looping never shows a seam
  const tripledRow1 = [...partnersRow1, ...partnersRow1, ...partnersRow1];
  const tripledRow2 = [...partnersRow2, ...partnersRow2, ...partnersRow2];

  return (
    <section className="bg-black py-10 sm:py-16 md:py-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-[#635BFF]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[250px] bg-[#00C3F7]/8 rounded-full blur-[120px]" />
      </div>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div
          ref={titleRef}
          className={`text-center mb-8 sm:mb-10 md:mb-12 ${getBlurAnimationClasses(isTitleVisible)}`}
        >
          <SectionBadge
            icon={<Cpu className="w-3.5 h-3.5" />}
            text="Our Technology Stack"
            badgeLabel="Modern Infrastructure"
            color="#0a84ff"
            className="mb-3 sm:mb-4"
          />

          <h2 className="text-white font-barlow text-xl sm:text-2xl md:text-4xl font-bold tracking-tight">
            Platforms & Tools We Build With
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base font-barlow mt-2 sm:mt-3 max-w-2xl mx-auto leading-relaxed">
            We engineer on modern, industry-standard cloud, AI, and payment
            infrastructure — no legacy stacks, no vendor lock-in.
          </p>
        </div>
      </div>

      {/* Dual Direction Marquee Container with Smooth Edge Mask */}
      <div
        ref={marqueeRef}
        className={`relative overflow-hidden py-2 sm:py-3 space-y-2 sm:space-y-3 ${getBlurAnimationClasses(isMarqueeVisible)}`}
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          contain: "content",
        }}
      >
        {/* Row 1: Scrolling Left */}
        <div className="flex items-center animate-marquee-left py-1.5 sm:py-2 transform-gpu">
          {tripledRow1.map((partner, index) => (
            <PartnerLogoCard key={`r1-${partner.name}-${index}`} partner={partner} />
          ))}
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="flex items-center animate-marquee-right py-1.5 sm:py-2 transform-gpu">
          {tripledRow2.map((partner, index) => (
            <PartnerLogoCard key={`r2-${partner.name}-${index}`} partner={partner} />
          ))}
        </div>
      </div>

      {/* Scoped Keyframes & High Performance Rules */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(calc(-100% / 3), 0, 0); }
        }
        @keyframes marquee-right {
          0%   { transform: translate3d(calc(-100% / 3), 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-left {
          animation: marquee-left 42s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          width: max-content;
        }
        .animate-marquee-right {
          animation: marquee-right 45s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          width: max-content;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
        .partner-card:hover {
          background-color: color-mix(in srgb, var(--brand-color) 16%, #111111);
          border-color: color-mix(in srgb, var(--brand-color) 60%, transparent);
          box-shadow: 0 0 25px color-mix(in srgb, var(--brand-color) 25%, transparent), 0 10px 30px rgba(0,0,0,0.6);
        }
      `}</style>
    </section>
  );
};

export default TrustedPartnerships;

