interface SectionBackgroundProps {
  children: React.ReactNode;
}

export const SectionBackground = ({ children }: SectionBackgroundProps) => {
  return (
    <section className="relative bg-black text-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-64 md:w-72 h-48 sm:h-64 md:h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>

      {children}
    </section>
  );
};
