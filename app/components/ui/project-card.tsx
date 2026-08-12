import { Link } from "react-router";
import { BsCheckCircle } from "react-icons/bs";

export interface ProjectCardProps {
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  className?: string;
  style?: React.CSSProperties;
  /** Case study URL — the cover image and the title both link to it. */
  href: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  features,
  image,
  imageAlt,
  className = "",
  style,
  href,
}) => {
  // Animate per character, but keep each word in its own inline-block so the
  // title only ever wraps at spaces instead of splitting words apart.
  const words = title.split(" ").filter(Boolean);
  let charOffset = 0;
  const wordOffsets = words.map((word) => {
    const offset = charOffset;
    charOffset += word.length;
    return offset;
  });

  return (
    <div
      className={`group relative bg-card-bg border border-light-black rounded-3xl overflow-hidden hover:border-primary/50 hover:-transition-all duration-500 h-full ${className}`}
      style={style}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 group-hover:scale-150 group-hover:rotate-90 transition-all duration-1000"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 group-hover:scale-150 group-hover:-rotate-90 transition-all duration-1000"></div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* The cover image and the title below are separate links to the same
            case study. The image one is hidden from assistive tech so screen
            reader and keyboard users hit the title link only, not both. */}
        <Link
          to={href}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block cursor-pointer overflow-hidden rounded-t-3xl bg-linear-to-br from-gray-800 to-gray-900"
        >
          <img
            src={image}
            alt={imageAlt}
            width={400}
            height={192}
            loading="lazy"
            className="w-full h-48 object-cover group-hover:scale-115 group-hover:rotate-2 group-hover:brightness-110 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-card-bg/60 to-transparent group-hover:from-card-bg/20 transition-colors duration-500"></div>

          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/70 rounded-tr-2xl transition-all duration-500 group-hover:w-20 group-hover:h-20"></div>
          <div
            className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-blue-500/0 group-hover:border-blue-500/70 rounded-bl-2xl transition-all duration-500 group-hover:w-20 group-hover:h-20"
            style={{ transitionDelay: "100ms" }}
          ></div>
        </Link>

        <div className="flex flex-col flex-1 p-6 relative">
          <h3 className="mb-4 text-white font-barlow font-bold text-xl leading-snug text-balance">
            <Link
              to={href}
              className="block cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card-bg"
            >
              {words.map((word, wordIndex) => (
                <span key={wordIndex}>
                  <span className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className="inline-block transition-all duration-400 ease-out group-hover:text-primary group-hover:-translate-y-1 group-hover:scale-110"
                        style={{
                          transitionDelay: `${
                            (wordOffsets[wordIndex] + charIndex) * 25
                          }ms`,
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                  {wordIndex < words.length - 1 ? " " : null}
                </span>
              ))}
            </Link>
          </h3>

          <p className="text-white/70 group-hover:text-white/90 font-barlow text-sm leading-relaxed mb-4 transition-all duration-300 group-hover:tracking-wide">
            {description}
          </p>

          <ul className="space-y-2.5 mt-auto relative">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-white/70 group-hover:text-white/95 font-barlow text-sm transition-all duration-500 group-hover:translate-x-3 relative"
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <BsCheckCircle
                  className="relative w-4 h-4 text-primary shrink-0 mt-0.5 group-hover:scale-130 group-hover:rotate-360 transition-all duration-500 "
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                />
                <span className="relative group-hover:font-semibold transition-all duration-500 group-hover:text-white">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/0 group-hover:via-primary/50 to-transparent transition-all duration-700"></div>
        </div>
      </div>
    </div>
  );
};
