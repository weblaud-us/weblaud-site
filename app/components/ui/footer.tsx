import { Link } from "react-router";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { IoCallSharp, IoLocationSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import IconTile from "./icon-tile";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import weblaudFooterLogo from "~/assets/Weblaud_LLC_Footer.svg";
import type { ContactInfo as ContactInfoType } from "~/lib/types";
import { ChevronRight } from "lucide-react";

interface FooterProps {
  contactInfo: ContactInfoType | null;
}

const footerNavGroups = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/aboutus" },
      { label: "Career", href: "/career" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Our Services", href: "/services" },
      { label: "Our Projects", href: "/projects" },
      { label: "Project Estimator", href: "/calculator" },
      { label: "Engineering Insights", href: "/insights" },
    ],
  },
  {
    title: "Compare",
    links: [
      { label: "Weblaud vs In-House", href: "/vs/in-house-engineers" },
      { label: "Weblaud vs Agencies", href: "/vs/traditional-agencies" },
    ],
  },
];

const Footer: React.FC<FooterProps> = ({ contactInfo }) => {
  const [footerRef, isFooterVisible] = useBlurAnimation<HTMLDivElement>(0.05, false);

  const socialLinks: { icon: React.ReactNode; url: string }[] = [
    {
      icon: <FaFacebook className="text-blue-500 text-xl" />,
      url: "https://facebook.com/weblaud",
    },
    {
      icon: <FaXTwitter className="text-blue-500 text-xl" />,
      url: "https://x.com/weblaud",
    },
    {
      icon: <FaLinkedin className="text-blue-500 text-xl" />,
      url: "https://www.linkedin.com/company/weblaud",
    },
    {
      icon: <FaInstagram className="text-blue-500 text-xl" />,
      url: "https://instagram.com/weblaud",
    },
  ];

  const contactItems: { icon: React.ReactNode; text: string; href?: string }[] =
    contactInfo
      ? [
          {
            icon: <IoIosMail className="text-primary text-base" />,
            text: contactInfo.email,
            href: `mailto:${contactInfo.email}`,
          },
          {
            icon: <IoCallSharp className="text-primary text-base" />,
            text: contactInfo.phone,
            href: `tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`,
          },
          {
            icon: <IoLocationSharp className="text-primary text-base" />,
            text: contactInfo.address,
            href: `https://www.google.com/maps/search/${encodeURIComponent(contactInfo.address)}`,
          },
        ]
      : [];

  const legalLinks: { label: string; href: string }[] = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ];

  return (
    <footer className="bg-black text-white pt-14 pb-10 relative overflow-hidden">
      {/* Ambient Gradient Lights */}
      <motion.div className="absolute w-72 h-72 top-10 -left-20 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <motion.div className="absolute w-80 h-80 bottom-0 right-10 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <motion.div className="absolute w-64 h-64 top-1/3 right-1/4 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div
        ref={footerRef}
        className={`max-w-7xl border-t border-white/[0.08] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${getBlurAnimationClasses(
          isFooterVisible
        )}`}
      >
        {/* Main Grid with 2-col on mobile, expanding to 6-col on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-8 pt-8 sm:pt-12 pb-10 sm:pb-14">
          {/* Brand Column (takes 2 cols on mobile and lg) */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2 space-y-3.5 sm:space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={weblaudFooterLogo}
                alt="Weblaud LLC"
                className="h-8 sm:h-10 md:h-12 w-auto"
              />
            </Link>
            <p className="text-gray-400 font-barlow text-xs sm:text-sm max-w-sm leading-relaxed">
              Custom operations platforms, B2B web applications, and AI integrations built for high-growth businesses.
            </p>

            {/* Contact Details */}
            {contactItems.length > 0 && (
              <div className="pt-1.5 sm:pt-2 space-y-2">
                {contactItems.map(({ icon, text, href }, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 text-xs text-gray-400 font-barlow"
                  >
                    <span className="shrink-0">{icon}</span>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="hover:text-primary transition-colors truncate"
                      >
                        {text}
                      </a>
                    ) : (
                      <span className="truncate">{text}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation List Columns */}
          {footerNavGroups.map((group) => (
            <div key={group.title} className="col-span-1 space-y-3 sm:space-y-4">
              <h4 className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-white uppercase select-none">
                {group.title}
              </h4>
              <ul className="space-y-2 sm:space-y-2.5">
                {group.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="group/link inline-flex items-center text-xs sm:text-sm font-barlow text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <span className="transition-transform duration-200 group-hover/link:translate-x-1">
                        {label}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1 text-primary opacity-0 -translate-x-1.5 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links Column */}
          <div className="col-span-1 space-y-3 sm:space-y-4">
            <h4 className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-white uppercase select-none">
              Connect
            </h4>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 max-w-max">
              {socialLinks.map(({ icon, url }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconTile href={url} size="sm" ariaLabel={`Visit ${url}`}>
                    {icon}
                  </IconTile>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="border-t border-white/[0.06] pt-5 sm:pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs font-barlow text-gray-500 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Weblaud LLC. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            {legalLinks.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className="hover:text-gray-300 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

