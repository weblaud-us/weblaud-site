import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { toast } from "sonner";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import type { ContactInfo as ContactInfoType } from "~/lib/types";

interface ContactInfoProps {
  contactInfo: ContactInfoType | null;
}

// Address is stored as one string in the backend but displayed as two
// lines here — split on the last comma so "123 Main St, City, ST 00000,
// USA" reads as "123 Main St, City" / "ST 00000, USA".
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
      className={`group bg-card-bg border border-light-black rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 ${getBlurAnimationClasses(isContactInfoVisible)}`}
      style={{ transitionDelay: "150ms" }}
    >
      <h2 className="text-white font-barlow font-bold text-base sm:text-lg md:text-xl lg:text-2xl mb-3 sm:mb-4 md:mb-6 group-hover:text-primary transition-colors duration-300">
        Contact Information
      </h2>

      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <div
          onClick={() => copyToClipboard(contactInfo.email, "Email")}
          className="group/item flex items-start gap-2.5 sm:gap-3 md:gap-4 p-2 sm:p-2.5 md:p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 cursor-pointer"
        >
          <a
            href={`mailto:${contactInfo.email}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-6 group-hover/item:bg-primary/20 transition-all duration-300 hover:bg-primary/30 cursor-pointer"
          >
            <FiMail className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover/item:scale-110 transition-transform duration-300" />
          </a>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-barlow font-semibold text-sm sm:text-base mb-1 group-hover/item:text-primary transition-colors duration-300">
              Email
            </h3>
            <p className="text-white/70 font-barlow text-xs sm:text-sm wrap-break-word group-hover/item:text-white transition-colors duration-300">
              {contactInfo.email}
            </p>
          </div>
        </div>

        <div
          onClick={() => copyToClipboard(contactInfo.phone, "Phone")}
          className="group/item flex items-start gap-3 sm:gap-4 p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 cursor-pointer"
        >
          <a
            href={telHref}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-6 group-hover/item:bg-primary/20 transition-all duration-300 hover:bg-primary/30 cursor-pointer"
          >
            <FiPhone className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover/item:scale-110 group-hover/item:animate-pulse transition-transform duration-300" />
          </a>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-barlow font-semibold text-sm sm:text-base mb-1 group-hover/item:text-primary transition-colors duration-300">
              Phone
            </h3>
            <p className="text-white/70 font-barlow text-xs sm:text-sm group-hover/item:text-white transition-colors duration-300">
              {contactInfo.phone}
            </p>
          </div>
        </div>

        <div
          onClick={() => copyToClipboard(contactInfo.address, "Office Address")}
          className="group/item flex items-start gap-3 sm:gap-4 p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 cursor-pointer"
        >
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(contactInfo.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-6 group-hover/item:bg-primary/20 transition-all duration-300 hover:bg-primary/30"
          >
            <FiMapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover/item:scale-110 group-hover/item:animate-bounce transition-transform duration-300" />
          </a>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-barlow font-semibold text-sm sm:text-base mb-1 group-hover/item:text-primary transition-colors duration-300">
              Office
            </h3>
            <p className="text-white/70 font-barlow text-xs sm:text-sm group-hover/item:text-white transition-colors duration-300">
              {addressLine1}
              {addressLine2 && (
                <>
                  <br />
                  {addressLine2}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ContactInfo };
