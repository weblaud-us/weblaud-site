import person01 from "~/assets/person-01.svg";
import person02 from "~/assets/person-02.svg";
import person03 from "~/assets/person-03.svg";
import person04 from "~/assets/person-04.svg";
import { useState, useEffect, useRef } from "react";

const TheTeam = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  const teamMembers = [
    {
      id: 1,
      name: "SV Hridoy",
      role: "CO-Founder",
      image: person01,
    },
    {
      id: 2,
      name: "SV Hridoy",
      role: "Full Stack Developer",
      image: person02,
    },
    {
      id: 3,
      name: "SV Hridoy",
      role: "Graphic Designer",
      image: person03,
    },
    {
      id: 4,
      name: "SV Hridoy",
      role: "UI/UX Designer",
      image: person04,
    },
  ];

  return (
    <section ref={containerRef} className="bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-5">
          <div
            className={`lg:max-w-md space-y-4 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 blur-0 translate-x-0"
                : "opacity-0 blur-[10px] -translate-x-5"
            }`}
          >
            <h3 className="text-blue-500 md:text-lg font-semibold font-barlow">
              The team
            </h3>
            <h2 className="text-2xl md:text-4xl font-semibold font-barlow leading-tight">
              Meet The Awesome and Creative members of Our Team
            </h2>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`group relative overflow-hidden rounded-2xl bg-light-black transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 blur-0 translate-y-0"
                    : "opacity-0 blur-[10px] translate-y-5"
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="md:text-lg text-sm font-bold font-barlow mb-1">
                      {member.name}
                    </h4>
                    <p className="md:text-sm text-xs text-gray-300 font-barlow">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheTeam;
