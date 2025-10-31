import * as React from "react";

export type IconTileProps = {
  children: React.ReactNode;
  href?: string;
  ariaLabel?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

const sizeClass: Record<NonNullable<IconTileProps["size"]>, string> = {
  sm: "size-8 md:size-10",
  md: "size-10 md:size-12",
  lg: "size-12 md:size-14 lg:size-16",
};

export default function IconTile({
  children,
  href,
  ariaLabel,
  className = "",
  size = "lg",
  target,
  rel,
  onClick,
}: IconTileProps) {
  const outer = `p-px rounded-md inline-block bg-linear-to-b from-light-black from-55% to-black to-100% ${sizeClass[size]} ${className}`;
  const inner =
    "rounded-md h-full w-full flex justify-center items-center bg-linear-to-b from-[#292929] to-black";

  if (href) {
    const isExternal = (target ?? "_blank") === "_blank";
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        target={target ?? "_blank"}
        rel={rel ?? (isExternal ? "noopener noreferrer" : undefined)}
        className={outer}
        onClick={onClick}
      >
        <span className={inner}>{children}</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={outer}
      onClick={onClick}
    >
      <span className={inner}>{children}</span>
    </button>
  );
}
