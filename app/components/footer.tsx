import { useLocation } from "react-router";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { IoCallSharp, IoLocationSharp } from "react-icons/io5";
import IconTile from "./ui/icon-tile";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import logo from "~/assets/weblaud.com.svg";

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

  const menuItems: string[] = [
    "Home",
    "Services",
    "Portfolio",
    "About Us",
    "Careers",
  ];

  const socialLinks: { icon: React.ReactNode; url: string }[] = [
    {
      icon: <FaFacebook className="text-blue-500 text-2xl" />,
      url: "https://www.facebook.com/weblaud",
    },
    {
      icon: <FaTwitter className="text-blue-500 text-2xl" />,
      url: "https://twitter.com",
    },
    {
      icon: <FaLinkedin className="text-blue-500 text-2xl" />,
      url: "https://linkedin.com",
    },
    {
      icon: <FaInstagram className="text-blue-500 text-2xl" />,
      url: "https://www.instagram.com/weblaud",
    },
  ];

  const contactItems: { icon: React.ReactNode; text: string; href?: string }[] =
    [
      {
        icon: <IoIosMail className="text-blue-500 text-xl" />,
        text: "info@weblaud.com",
        href: "mailto:info@weblaud.com",
      },
      {
        icon: <IoCallSharp />,
        text: "+880 1577 466217",
        href: "tel:+8801577466217",
      },
      {
        icon: <IoLocationSharp />,
        text: "1621 Central Ave, Cheyenne, WY 82001, USA",
        href: "https://www.google.com/maps/search/1621+Central+Ave,+Cheyenne,+WY+82001,+USA",
      },
    ];

  const legalLinks: { label: string; href: string }[] = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ];

  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl border-t border-light-black mx-auto py-4 px-4 md:py-10 md:px-16">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div
            ref={logoRef}
            className={`text-center lg:text-left ${getBlurAnimationClasses(isLogoVisible)}`}
          >
            <img src={logo} alt="Weblaud Logo" className="h-8 md:h-10" />
          </div>

          <div
            ref={menuRef}
            className={`text-center lg:text-left ${getBlurAnimationClasses(isMenuVisible)}`}
          >
            <ul className="flex flex-wrap justify-center lg:flex-row font-barlow gap-4 md:gap-6 font-medium">
              {menuItems.map((item) => (
                <li
                  key={item}
                  className="hover:text-blue-500 text-gray font-barlow cursor-pointer transition duration-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            ref={socialRef}
            className={`flex justify-center lg:justify-end gap-3 border border-light-black p-4 rounded-xl ${getBlurAnimationClasses(isSocialVisible)}`}
          >
            {socialLinks.map(({ icon, url }, index) => (
              <IconTile key={index} href={url} ariaLabel={`Visit ${url}`}>
                {icon}
              </IconTile>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between mt-10 gap-6">
          <div
            ref={contactRef}
            className={`flex flex-col sm:flex-row gap-4 sm:gap-6 items-center text-sm ${getBlurAnimationClasses(isContactVisible)}`}
          >
            {contactItems.map(({ icon, text, href }) => (
              <div
                key={text}
                className="flex justify-center items-center text-gray font-barlow gap-2"
              >
                <span className="text-blue-500 text-lg">{icon}</span>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-center sm:text-left hover:text-blue-500 transition-colors"
                  >
                    {text}
                  </a>
                ) : (
                  <p className="text-center sm:text-left">{text}</p>
                )}
              </div>
            ))}
          </div>
          <div
            ref={legalRef}
            className={`flex gap-4 flex-wrap justify-center ${getBlurAnimationClasses(isLegalVisible)}`}
          >
            {legalLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="hover:text-blue-500 text-sm font-barlow text-dark-gray transition duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div
          ref={copyrightRef}
          className={`flex flex-col md:flex-row justify-center font-barlow items-center text-sm text-dark-gray mt-10 pt-4 ${getBlurAnimationClasses(isCopyrightVisible)}`}
        >
          <p className="text-center">
            © {new Date().getFullYear()} Weblaud. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
