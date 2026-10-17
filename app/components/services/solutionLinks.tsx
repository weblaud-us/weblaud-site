import { Link } from "react-router";
import { ArrowRight, Compass } from "lucide-react";
import SectionBadge from "~/components/ui/section-badge";
import { landingLinksIn } from "~/data/landing/links";

/**
 * "Explore by solution" strip on /services. The service cards come from the
 * CMS and don't map 1:1 to the /solutions/* pages, so this links all of them
 * explicitly — those pages had no internal links pointing at them.
 */
export default function SolutionLinks() {
  return (
    <section className="bg-black px-4 sm:px-6 lg:px-8 xl:px-10 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <SectionBadge
            icon={<Compass className="w-3.5 h-3.5" />}
            text="Explore by Solution"
            badgeLabel="Find Your Fit"
            color="#0a84ff"
            className="mb-4"
          />
          <h2 className="text-white font-barlow font-bold text-2xl md:text-3xl tracking-tight">
            What are you building?
          </h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {landingLinksIn("solutions").map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="group flex h-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#0e0e0e] hover:border-primary/40 px-4 py-4 font-barlow text-sm font-semibold text-gray-200 hover:text-white transition-colors duration-300"
              >
                <span>{link.label}</span>
                <ArrowRight
                  className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
