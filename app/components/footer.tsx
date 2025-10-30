import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { IoCallSharp, IoLocationSharp } from "react-icons/io5";
import IconTile from "./ui/icon-tile";

const Footer: React.FC = () => {
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
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl border-t border-light-black mx-auto py-4 px-4 md:py-10 md:px-16">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold font-poppins">
              <span className="text-blue-500">Dev</span> Nest
            </h2>
          </div>

          <div className="text-center lg:text-left">
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

          <div className="flex justify-center lg:justify-end gap-3 border border-light-black p-4 rounded-xl">
            {socialLinks.map(({ icon, url }, index) => (
              <IconTile key={index} href={url} ariaLabel={`Visit ${url}`}>
                {icon}
              </IconTile>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between mt-10 gap-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center text-sm">
            {contactItems.map(({ icon, text }) => (
              <div
                key={text}
                className="flex justify-center items-center text-gray font-barlow gap-2"
              >
                <span className="text-blue-500 text-lg">{icon}</span>
                <p className="text-center sm:text-left">{text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
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

        <div className="flex flex-col md:flex-row justify-center font-barlow items-center text-sm text-dark-gray mt-10 pt-4">
          <p className="text-center">Design By Hridoy Hossain 2025 (Mkt)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
