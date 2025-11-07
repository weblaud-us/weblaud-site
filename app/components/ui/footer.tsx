import { Link, useLocation } from "react-router";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { IoCallSharp, IoLocationSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import IconTile from "./icon-tile";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import weblaudLogo from "~/assets/weblaud-logo.svg";

const Footer: React.FC = () => {
  const location = useLocation();

  const [logoRef, isLogoVisible] = useBlurAnimation<HTMLDivElement>(
    0.3,
    false,
    location.pathname
  );
  const [menuRef, isMenuVisible] = useBlurAnimation<HTMLDivElement>(
    0.3,
    false,
    location.pathname
  );
  const [socialRef, isSocialVisible] = useBlurAnimation<HTMLDivElement>(
    0.3,
    false,
    location.pathname
  );
  const [contactRef, isContactVisible] = useBlurAnimation<HTMLDivElement>(
    0.3,
    false,
    location.pathname
  );
  const [legalRef, isLegalVisible] = useBlurAnimation<HTMLDivElement>(
    0.3,
    false,
    location.pathname
  );
  const [copyrightRef, isCopyrightVisible] = useBlurAnimation<HTMLDivElement>(
    0.3,
    false,
    location.pathname
  );

  const menuItems: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/aboutUs" },
    { label: "Our Services", href: "/services" },
    { label: "Our Projects", href: "/projects" },
    { label: "Contact Us", href: "/contact" },
  ];

  const socialLinks: { icon: React.ReactNode; url: string }[] = [
    {
      icon: <FaFacebook className="text-blue-500 text-2xl" />,
      url: "https://facebook.com",
    },
    {
      icon: <FaTwitter className="text-blue-500 text-2xl" />,
      url: "https://twitter.com",
    },
    {
      icon: <FaLinkedin className="text-blue-500 text-2xl" />,
      url: "https://linkedin.com",
    },
  ];

  const contactItems: { icon: React.ReactNode; text: string }[] = [
    {
      icon: <IoIosMail className="text-blue-500 text-xl" />,
      text: "Hridoy162476@gmail.com",
    },
    { icon: <IoCallSharp />, text: "01774521320" },
    { icon: <IoLocationSharp />, text: "Dhaka, Bangladesh" },
  ];

  const legalLinks: { label: string; href: string }[] = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ];

  return (
    <footer className="bg-black text-white py-10 relative overflow-hidden">
      <motion.div
        className="absolute w-96 h-96 top-20 -left-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
        
      />
      <motion.div
        className="absolute w-80 h-80 bottom-10 right-10 bg-primary/15 rounded-full blur-3xl pointer-events-none"
        
      />
      <motion.div
        className="absolute w-64 h-64 top-1/2 right-1/4 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
        
      />

      <div className="max-w-7xl border-t border-light-black mx-auto py-4 px-4 md:py-10 md:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <motion.div
            ref={logoRef}
            className={`text-center lg:text-left ${getBlurAnimationClasses(isLogoVisible)}`}
          >
            <motion.img
              src={weblaudLogo}
              alt="Weblaud"
              className="h-8 md:h-10"
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
          </motion.div>

          <motion.div
            ref={menuRef}
            className={`text-center lg:text-left ${getBlurAnimationClasses(isMenuVisible)}`}
          >
            <ul className="flex flex-wrap justify-center lg:flex-row font-barlow gap-4 md:gap-6 font-medium">
              {menuItems.map(({ label, href }, index) => (
                <motion.li
                  key={label}
                  className="text-gray hover:text-primary font-barlow cursor-pointer transition-all duration-200 relative group"
                >
                  <Link to={href}>{label}</Link>
                  <motion.span className="absolute rounded-full -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-[70%] transition-all duration-300" />
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            ref={socialRef}
            className={`flex justify-center lg:justify-end gap-3 border border-light-black p-4 rounded-xl relative ${getBlurAnimationClasses(isSocialVisible)}`}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-primary/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 blur-xl pointer-events-none"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            {socialLinks.map(({ icon, url }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -8,
                  scale: 1.2,
                  rotate: 10,
                }}
                className="relative"
              >
                <IconTile href={url} ariaLabel={`Visit ${url}`}>
                  {icon}
                </IconTile>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between mt-10 gap-6">
          <motion.div
            ref={contactRef}
            className={`flex flex-col sm:flex-row gap-4 sm:gap-6 items-center text-sm ${getBlurAnimationClasses(isContactVisible)}`}
          >
            {contactItems.map(({ icon, text }, index) => (
              <div className="flex justify-center items-center text-gray font-barlow gap-2 relative group">
                <span className="text-blue-500 text-lg relative">{icon}</span>
                <p className="text-center sm:text-left">{text}</p>
              </div>
            ))}
          </motion.div>
          <motion.div
            ref={legalRef}
            className={`flex gap-4 flex-wrap justify-center ${getBlurAnimationClasses(isLegalVisible)}`}
          >
            {legalLinks.map(({ label, href }, index) => (
              <Link
                key={label}
                to={href}
                className="text-sm font-barlow text-dark-gray transition duration-200 relative group"
              >
                {label}
              </Link>
            ))}
          </motion.div>
        </div>

        <motion.div
          ref={copyrightRef}
          className={`flex flex-col md:flex-row justify-center font-barlow items-center text-sm text-dark-gray mt-10 pt-4 ${getBlurAnimationClasses(isCopyrightVisible)}`}
        >
          <p className="text-center">Design By Hridoy Hossain 2025 (Mkt)</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
