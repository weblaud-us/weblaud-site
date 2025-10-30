interface ImageContainerProps {
  image: string;
  alt: string;
  variant: "blue" | "purple";
  clipPath: "left" | "right";
}

export const ImageContainer = ({
  image,
  alt,
  variant,
  clipPath,
}: ImageContainerProps) => {
  const colors = {
    blue: {
      ring1: "border-blue-400/20",
      ring2: "border-blue-400/10",
      ring3: "border-cyan-400/5",
      glow: "bg-blue-500/20",
      dot1: "bg-blue-400",
      dot2: "bg-purple-400",
      gradient: "from-blue-500/20 to-purple-500/20",
      border: "border-white/20 hover:border-blue-400/50",
      shadow: "group-hover:shadow-[0_20px_80px_rgba(59,130,246,0.4)]",
      scanLine: "via-blue-400/10",
      imageShadow: "group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]",
    },
    purple: {
      ring1: "border-purple-400/20",
      ring2: "border-purple-400/10",
      ring3: "border-pink-400/5",
      glow: "bg-purple-500/20",
      dot1: "bg-purple-400",
      dot2: "bg-pink-400",
      gradient: "from-purple-500/20 to-blue-500/20",
      border: "border-white/20 hover:border-purple-400/50",
      shadow: "group-hover:shadow-[0_20px_80px_rgba(168,85,247,0.4)]",
      scanLine: "via-purple-400/10",
      imageShadow: "group-hover:drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]",
    },
  };

  const color = colors[variant];
  const isLeft = clipPath === "left";
  const clipPathStyle = isLeft
    ? "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)"
    : "polygon(0% 0%, 90% 0%, 100% 100%, 10% 100%)";

  return (
    <div className="flex justify-center relative py-8 sm:py-0">
      <div className="relative group">
        <div
          className={`absolute inset-0 rounded-full border-2 ${color.ring1} scale-75 sm:scale-70 group-hover:scale-90 sm:group-hover:scale-80 transition-transform duration-700 ${isLeft ? "group-hover:rotate-45" : "group-hover:-rotate-45"}`}
        ></div>
        <div
          className={`absolute inset-0 rounded-full border ${color.ring2} scale-95 sm:scale-90 group-hover:scale-110 sm:group-hover:scale-100 transition-transform duration-1000 ${isLeft ? "group-hover:rotate-90" : "group-hover:-rotate-90"}`}
        ></div>
        <div
          className={`absolute inset-0 rounded-full border ${color.ring3} scale-[1.15] sm:scale-110 group-hover:scale-[1.35] sm:group-hover:scale-[1.2] transition-transform duration-1200 ${isLeft ? "group-hover:-rotate-45" : "group-hover:rotate-45"}`}
        ></div>

        <div
          className={`absolute inset-0 ${color.glow} rounded-full blur-2xl sm:blur-3xl opacity-40 sm:opacity-50 group-hover:opacity-100 transition-opacity duration-700 animate-pulse`}
        ></div>

        <div
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: isLeft ? "10s" : "12s" }}
        >
          <div
            className={`absolute top-0 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 ${color.dot1} rounded-full -translate-x-1/2`}
          ></div>
        </div>
        <div
          className="absolute inset-0 animate-spin"
          style={{
            animationDuration: isLeft ? "15s" : "18s",
            animationDirection: "reverse",
          }}
        >
          <div
            className={`absolute bottom-0 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 ${color.dot2} rounded-full -translate-x-1/2`}
          ></div>
        </div>

        <div className="relative p-8 sm:p-12 md:p-16">
          <img
            src={image}
            alt={alt}
            className={`w-48 h-48 sm:w-56 sm:h-56 md:w-96 md:h-96 object-contain drop-shadow-2xl ${color.imageShadow} transition-all duration-500`}
          />
        </div>
      </div>
    </div>
  );
};
