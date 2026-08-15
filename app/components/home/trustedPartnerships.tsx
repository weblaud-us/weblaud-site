import React, { useState } from "react";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import SectionBadge from "~/components/ui/section-badge";
import { Cpu, FileText, Users, Clock, Globe } from "lucide-react";
import type { TrackRecordItem } from "~/lib/types";
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      aria-label={`${partner.name} - ${partner.category}`}
      role="img"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex items-center gap-3.5 mx-2.5 rounded-2xl px-5 h-[64px] min-w-[170px] cursor-pointer shrink-0 transition-all duration-300 backdrop-blur-2xl overflow-hidden select-none"
      style={{
        backgroundColor: isHovered ? `${partner.color}20` : "rgba(255, 255, 255, 0.07)",
        borderColor: isHovered ? `${partner.color}75` : "rgba(255, 255, 255, 0.12)",
        borderWidth: "1px",
        borderStyle: "solid",
        boxShadow: isHovered
          ? `0 0 25px ${partner.color}25, 0 10px 30px rgba(0,0,0,0.6), inset 0 0 15px ${partner.color}15`
          : "0 4px 20px rgba(0,0,0,0.3)",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* Dynamic Brand Gradient Background on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 90% 80% at 50% 50%, ${partner.color}22 0%, transparent 80%)`,
        }}
      />

      {/* Icon with Brand Color */}
      <div
        className="text-xl shrink-0 transition-all duration-300"
        style={{
          color: partner.color,
          transform: isHovered ? "scale(1.15)" : "scale(1)",
          filter: isHovered
            ? `drop-shadow(0 0 10px ${partner.color}90)`
            : `drop-shadow(0 0 2px ${partner.color}30)`,
        }}
      >
        {partner.icon}
      </div>

      {/* Partner Name */}
      {partner.showName && (
        <div className="flex flex-col min-w-0">
          <span
            className="text-xs font-bold tracking-[0.08em] uppercase font-barlow whitespace-nowrap transition-colors duration-300"
            style={{
              color: isHovered ? "#FFFFFF" : "rgba(255, 255, 255, 0.85)",
              textShadow: isHovered ? `0 0 12px ${partner.color}50` : "none",
            }}
          >
            {partner.name}
          </span>
          <span
            className="text-[9px] font-mono tracking-wider transition-colors duration-300"
            style={{
              color: isHovered ? partner.color : "rgba(255, 255, 255, 0.4)",
            }}
          >
            {partner.category}
          </span>
        </div>
      )}
    </div>
  );
};

interface TrustedPartnershipsProps {
  trackRecord?: TrackRecordItem[];
}

const TrustedPartnerships = ({ trackRecord = [] }: TrustedPartnershipsProps) => {
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLDivElement>();
  const [marqueeRef, isMarqueeVisible] = useBlurAnimation<HTMLDivElement>();

  // Tripled lists so seamless looping never shows a seam
  const tripledRow1 = [...partnersRow1, ...partnersRow1, ...partnersRow1];
  const tripledRow2 = [...partnersRow2, ...partnersRow2, ...partnersRow2];

  return (
    <section className="bg-black py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-[#635BFF]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[250px] bg-[#00C3F7]/8 rounded-full blur-[120px]" />
      </div>

      {/* Top & Bottom decorative gradient dividers */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div
          ref={titleRef}
          className={`text-center mb-12 ${getBlurAnimationClasses(isTitleVisible)}`}
        >
          <SectionBadge
            icon={<Cpu className="w-3.5 h-3.5" />}
            text="Our Technology Stack"
            badgeLabel="Modern Infrastructure"
            color="#0a84ff"
            className="mb-4"
          />

          <h2 className="text-white font-barlow text-2xl md:text-4xl font-bold tracking-tight">
            Platforms & Tools We Build With
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-barlow mt-3 max-w-2xl mx-auto leading-relaxed">
            We engineer on modern, industry-standard cloud, AI, and payment
            infrastructure — no legacy stacks, no vendor lock-in.
          </p>
        </div>
      </div>

      {/* Dual Direction Marquee Container */}
      <div
        ref={marqueeRef}
        className={`relative overflow-hidden py-3 space-y-3 ${getBlurAnimationClasses(isMarqueeVisible)}`}
      >
        {/* Soft edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

        {/* Row 1: Scrolling Left */}
        <div className="flex items-center animate-marquee-left py-2">
          {tripledRow1.map((partner, index) => (
            <PartnerLogoCard key={`r1-${partner.name}-${index}`} partner={partner} />
          ))}
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="flex items-center animate-marquee-right py-2">
          {tripledRow2.map((partner, index) => (
            <PartnerLogoCard key={`r2-${partner.name}-${index}`} partner={partner} />
          ))}
        </div>
      </div>

      {/* Track Record Stats */}
      {trackRecord.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-16 relative z-10">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
              {trackRecord.map((stat, i) => {
                const getStatIcon = () => {
                  const s = `${stat.subtitle} ${stat.title}`.toLowerCase();
                  if (s.includes("project") || s.includes("deliver"))
                    return <FileText className="w-5 h-5 text-primary" />;
                  if (s.includes("satisfaction") || s.includes("client") || s.includes("reviewer") || s.includes("user"))
                    return <Users className="w-5 h-5 text-primary" />;
                  if (s.includes("time") || s.includes("on-time") || s.includes("deliver") || s.includes("issue"))
                    return <Clock className="w-5 h-5 text-primary" />;
                  if (s.includes("countr") || s.includes("global") || s.includes("serve") || s.includes("volume"))
                    return <Globe className="w-5 h-5 text-primary" />;
                  const icons = [
                    <FileText key="1" className="w-5 h-5 text-primary" />,
                    <Users key="2" className="w-5 h-5 text-primary" />,
                    <Clock key="3" className="w-5 h-5 text-primary" />,
                    <Globe key="4" className="w-5 h-5 text-primary" />,
                  ];
                  return icons[i % icons.length];
                };

                return (
                  <div
                    key={i}
                    className="flex items-center justify-start gap-4 p-5 sm:p-6 group hover:bg-white/[0.02] transition-colors duration-300"
                  >
                    {/* Icon Box */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(10,132,255,0.15)] group-hover:scale-105 group-hover:bg-primary/15 transition-all duration-300">
                      {getStatIcon()}
                    </div>

                    {/* Text block */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-barlow text-2xl sm:text-3xl font-bold tracking-tight leading-none group-hover:text-primary transition-colors duration-300">
                        {stat.title}
                      </span>
                      <span className="text-gray-400 font-barlow text-[11px] sm:text-xs font-semibold tracking-[0.06em] uppercase mt-1.5 leading-tight truncate">
                        {stat.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Scoped Keyframes */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(calc(-100% / 3)); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 42s linear infinite;
          will-change: transform;
          width: max-content;
        }
        .animate-marquee-right {
          animation: marquee-right 45s linear infinite;
          will-change: transform;
          width: max-content;
        }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TrustedPartnerships;

