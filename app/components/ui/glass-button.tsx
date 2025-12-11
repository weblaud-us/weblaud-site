import { Link } from "react-router";
import { HiArrowRight } from "react-icons/hi";
import type { IconType } from "react-icons";

interface GlassButtonProps {
  children: React.ReactNode;
  to?: string;
  icon?: IconType;
  className?: string;
  onClick?: () => void;
}

const GlassButton = ({
  children,
  to,
  icon: Icon = HiArrowRight,
  className = "",
  onClick,
}: GlassButtonProps) => {
  const buttonContent = (
    <>
      <span className="absolute inset-0 bg-linear-to-br from-white/8 via-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

      <span className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/0 group-hover:from-primary/15 group-hover:to-blue-500/10 transition-all duration-500"></span>

      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out skew-x-12"></span>

      <span className="relative z-10 flex items-center gap-2.5">
        <span className="group-hover:text-primary transition-colors duration-300 tracking-wide">
          {children}
        </span>

        <span className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/0 group-hover:bg-primary/20 transition-all duration-300">
          <Icon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300 group-hover:text-primary" />
        </span>
      </span>
    </>
  );

  const baseClasses = `group relative w-fit sm:w-auto inline-flex items-center justify-center gap-2.5 overflow-hidden bg-white/3 backdrop-blur-md border border-white/15 hover:border-primary/50 text-white px-6 sm:px-7 py-3 sm:py-2 rounded-lg text-xs font-barlow font-semibold transition-all duration-500 active:translate-y-0 ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {buttonContent}
    </button>
  );
};

export default GlassButton;
