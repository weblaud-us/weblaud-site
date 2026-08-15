import { FiMail, FiPhone, FiMapPin, FiCopy } from "react-icons/fi";
import { toast } from "sonner";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import type { ContactInfo as ContactInfoType } from "~/lib/types";

interface ContactInfoProps {
  contactInfo: ContactInfoType | null;
}

function splitAddress(address: string): [string, string] {
  const lastComma = address.lastIndexOf(",");
  if (lastComma === -1) return [address, ""];
  const secondLastComma = address.lastIndexOf(",", lastComma - 1);
  if (secondLastComma === -1) return [address, ""];
  return [
    address.slice(0, secondLastComma).trim(),
    address.slice(secondLastComma + 1).trim(),
  ];
}

const ContactInfo = ({ contactInfo }: ContactInfoProps) => {
  const [contactInfoRef, isContactInfoVisible] = useBlurAnimation();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`, {
        duration: 3000,
      });
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (!contactInfo) return null;

  const [addressLine1, addressLine2] = splitAddress(contactInfo.address);
  const telHref = `tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`;

  return (
    <div
      ref={contactInfoRef}
      className={`bg-[#0c0c0c] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-5 hover:border-primary/30 transition-all duration-500 shadow-2xl relative overflow-hidden ${getBlurAnimationClasses(
        isContactInfoVisible
      )}`}
      style={{ transitionDelay: "150ms" }}
    >
      {/* Ambient top light */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <h2 className="text-white font-barlow font-bold text-xl sm:text-2xl tracking-tight">
          Contact Information
        </h2>
        <p className="text-gray-400 font-barlow text-xs sm:text-sm mt-1">
          Reach our team directly through any of the channels below.
        </p>
      </div>

      <div className="space-y-3">
        {/* Email */}
        <div
          onClick={() => copyToClipboard(contactInfo.email, "Email")}
          className="group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-black/60 border border-white/[0.06] hover:border-primary/40 hover:bg-black/90 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 group-hover:bg-primary/20 transition-all">
              <FiMail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Email
              </p>
              <a
                href={`mailto:${contactInfo.email}`}
                onClick={(e) => e.stopPropagation()}
                className="text-white font-barlow text-sm sm:text-base font-medium truncate hover:text-primary transition-colors block"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
          <FiCopy className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary transition-colors shrink-0" />
        </div>

        {/* Phone */}
        <div
          onClick={() => copyToClipboard(contactInfo.phone, "Phone")}
          className="group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-black/60 border border-white/[0.06] hover:border-primary/40 hover:bg-black/90 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 group-hover:bg-primary/20 transition-all">
              <FiPhone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Phone
              </p>
              <a
                href={telHref}
                onClick={(e) => e.stopPropagation()}
                className="text-white font-barlow text-sm sm:text-base font-medium truncate hover:text-primary transition-colors block"
              >
                {contactInfo.phone}
              </a>
            </div>
          </div>
          <FiCopy className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary transition-colors shrink-0" />
        </div>

        {/* Office Address */}
        <div
          onClick={() => copyToClipboard(contactInfo.address, "Address")}
          className="group flex items-start justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-black/60 border border-white/[0.06] hover:border-primary/40 hover:bg-black/90 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5 group-hover:scale-105 group-hover:bg-primary/20 transition-all">
              <FiMapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400">
                Office Location
              </p>
              <p className="text-white font-barlow text-sm sm:text-base font-medium leading-snug pt-0.5">
                {addressLine1}
              </p>
              {addressLine2 && (
                <p className="text-gray-400 font-barlow text-xs sm:text-sm leading-snug">
                  {addressLine2}
                </p>
              )}
            </div>
          </div>
          <FiCopy className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary transition-colors shrink-0 mt-1" />
        </div>
      </div>
    </div>
  );
};

export { ContactInfo };
export default ContactInfo;
