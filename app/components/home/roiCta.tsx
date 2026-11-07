import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/utils";

/** Electric-blue pill with a circular arrow cap, shared by the two ROI cards. */
export function RoiCta({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex min-h-13 cursor-pointer items-center justify-between gap-4 rounded-full bg-[#0066FF] py-1.5 pl-6 pr-1.5 font-barlow text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,102,255,0.35)] transition-colors duration-300 hover:bg-[#0052cc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066FF]",
        className,
      )}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0066FF]"
      >
        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px" />
      </span>
    </Link>
  );
}
