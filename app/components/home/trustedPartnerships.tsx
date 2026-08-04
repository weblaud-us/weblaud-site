import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
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
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" {...props}>
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
    className="w-6 h-6"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" />
    <rect x="9" y="11" width="6" height="5" rx="1" fill="currentColor" />
    <path d="M10 11V9a2 2 0 0 1 4 0v2" />
  </svg>
);

interface Partner {
  name: string;
  logo?: string;
  icon?: React.ReactNode;
  showName?: boolean;
}

const partners: Partner[] = [
  // Cloud & Infra
  {
    name: "AWS",
    icon: <SiAmazonwebservices className="text-[#FF9900]" />,
    showName: true,
  },
  {
    name: "Google Cloud",
    icon: <SiGooglecloud className="text-[#4285F4]" />,
    showName: true,
  },
  {
    name: "Microsoft Azure",
    icon: <VscAzure className="text-[#0089D6]" />,
    showName: true,
  },
  {
    name: "Vercel",
    icon: <SiVercel className="text-white" />,
    showName: true,
  },
  {
    name: "Replit",
    icon: <SiReplit className="text-[#F26207]" />,
    showName: true,
  },
  // AI Platforms & Frameworks
  {
    name: "OpenAI",
    icon: <SiOpenai className="text-[#10A37F]" />,
    showName: true,
  },
  {
    name: "Google Gemini",
    icon: <SiGooglegemini className="text-[#8E75FF]" />,
    showName: true,
  },
  {
    name: "Anthropic",
    icon: <SiAnthropic className="text-[#D97757]" />,
    showName: true,
  },
  {
    name: "Perplexity AI",
    icon: <SiPerplexity className="text-[#22B8CF]" />,
    showName: true,
  },
  {
    name: "ElevenLabs",
    icon: <SiElevenlabs className="text-white" />,
    showName: true,
  },
  {
    name: "Hugging Face",
    icon: <SiHuggingface className="text-[#FFD21E]" />,
    showName: true,
  },
  {
    name: "Meta AI",
    icon: <SiMeta className="text-[#0467DF]" />,
    showName: true,
  },
  {
    name: "LangChain",
    icon: <SiLangchain className="text-[#2DD4BF]" />,
    showName: true,
  },
  {
    name: "Ollama",
    icon: <SiOllama className="text-white" />,
    showName: true,
  },
  {
    name: "GitHub Copilot",
    icon: <SiGithubcopilot className="text-[#6E40C9]" />,
    showName: true,
  },
  {
    name: "NVIDIA AI",
    icon: <SiNvidia className="text-[#76B900]" />,
    showName: true,
  },
  {
    name: "PyTorch",
    icon: <SiPytorch className="text-[#EE4C2C]" />,
    showName: true,
  },
  {
    name: "Replicate",
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/replicate.svg",
    showName: true,
  },
  // Payments & Commerce
  {
    name: "Stripe",
    icon: <SiStripe className="text-[#635BFF]" />,
    showName: true,
  },
  {
    name: "Paystack",
    icon: <PaystackIcon className="text-[#00C3F7]" />,
    showName: true,
  },
  {
    name: "SSLCommerz",
    icon: <SslCommerzIcon className="text-[#E31E24]" />,
    showName: true,
  },
  // Dev Tools & Communication
  {
    name: "Figma",
    icon: <SiFigma className="text-[#F24E1E]" />,
    showName: true,
  },
  {
    name: "Twilio",
    icon: <SiTwilio className="text-[#F22F46]" />,
    showName: true,
  },
];

const PartnerLogoCard = ({ partner }: { partner: Partner }) => (
  <div
    title={partner.name}
    aria-label={`${partner.name} Logo`}
    role="img"
    className="group flex items-center justify-center gap-3 mx-3 rounded-xl border border-white/8 bg-white/3 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer shrink-0 min-w-[160px] h-[72px] px-5 relative overflow-hidden"
  >
    {/* Hover shimmer */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

    {partner.icon ? (
      <div className="text-2xl opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0">
        {partner.icon}
      </div>
    ) : partner.logo ? (
      <img
        src={partner.logo}
        alt={`${partner.name} logo`}
        className="h-6 w-6 object-contain brightness-0 invert opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shrink-0"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    ) : null}

    {partner.showName && (
      <span className="text-white/60 text-xs font-bold tracking-[0.1em] uppercase font-barlow whitespace-nowrap group-hover:text-white transition-colors duration-300">
        {partner.name}
      </span>
    )}
  </div>
);

const TrustedPartnerships = () => {
  const [titleRef, isTitleVisible] = useBlurAnimation<HTMLDivElement>();
  const [marqueeRef, isMarqueeVisible] = useBlurAnimation<HTMLDivElement>();

  // Triple the list so the seamless loop never shows a gap
  const tripled = [...partners, ...partners, ...partners];

  return (
    <section className="bg-black py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[220px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div
          ref={titleRef}
          className={`text-center mb-10 ${getBlurAnimationClasses(isTitleVisible)}`}
        >
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase font-barlow mb-3">
            Trusted By Industry Leaders
          </p>
          <h2 className="text-white font-barlow text-2xl md:text-3xl font-semibold">
            Our Trusted Partnerships
          </h2>
          <p className="text-dark-gray text-sm md:text-base font-barlow mt-3 max-w-xl mx-auto leading-relaxed">
            We collaborate with world-class platforms and technology providers.
            We use modern engineering practices to deliver exceptional results.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div
        ref={marqueeRef}
        className={`relative overflow-hidden ${getBlurAnimationClasses(isMarqueeVisible)}`}
      >
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex items-center animate-trusted-marquee">
          {tripled.map((partner, index) => (
            <PartnerLogoCard key={`${partner.name}-${index}`} partner={partner} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 relative z-10">
        <div className="border-t border-white/8 pt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: "50+", label: "Happy Clients" },
              { value: "75+", label: "Projects Delivered" },
              { value: "20+", label: "Tech Partners" },
              { value: "99%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="text-center group py-4 px-2 rounded-2xl hover:bg-white/[0.03] transition-colors duration-300">
                <p className="text-primary font-barlow text-3xl md:text-4xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {stat.value}
                </p>
                <p className="text-dark-gray text-xs md:text-sm font-barlow tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes trusted-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-trusted-marquee {
          animation: trusted-marquee 36s linear infinite;
          will-change: transform;
          width: max-content;
        }
        .animate-trusted-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TrustedPartnerships;
