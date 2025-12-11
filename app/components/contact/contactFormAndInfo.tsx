import {
  FiPhone,
  FiSend,
  FiAlertCircle,
  FiUser,
  FiMessageSquare,
  FiMail,
} from "react-icons/fi";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { ContactInfo } from "../ui/contact-info";
import { BookMeeting } from "../ui/book-meeting";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  message: string;
};

const ContactFormAndInfo = () => {
  const [formRef, isFormVisible] = useBlurAnimation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      countryCode: "+1",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    toast.success("Message sent successfully!");
    reset();
  };

  return (
    <div className="bg-black px-4 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div
            ref={formRef}
            className={`group bg-card-bg border border-light-black rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 ${getBlurAnimationClasses(isFormVisible)}`}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0">
                <FiSend className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h2 className="text-white font-barlow font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                Send Us a Message
              </h2>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 sm:space-y-4 md:space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 md:gap-4">
                <div className="group/input">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                      <FiUser className="w-4 h-4 text-white/40 group-hover/input:text-primary transition-colors duration-300" />
                    </div>
                    <Input
                      type="text"
                      placeholder="First Name"
                      {...register("firstName", {
                        required: "First name is required",
                        minLength: {
                          value: 2,
                          message: "First name must be at least 2 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "First name can only contain letters",
                        },
                      })}
                      className={`pl-10 group-hover/input:border-primary/40 group-hover/input:shadow-sm group-hover/input:shadow-primary/20 transition-all duration-300 ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <div className="flex items-center gap-1.5 mt-1 animate-[scale-in_0.2s_ease-out]">
                      <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      <p className="text-red-400 text-xs font-barlow">
                        {errors.firstName.message}
                      </p>
                    </div>
                  )}
                </div>
                <div className="group/input">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                      <FiUser className="w-4 h-4 text-white/40 group-hover/input:text-primary transition-colors duration-300" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Last Name"
                      {...register("lastName", {
                        required: "Last name is required",
                        minLength: {
                          value: 2,
                          message: "Last name must be at least 2 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Last name can only contain letters",
                        },
                      })}
                      className={`pl-10 group-hover/input:border-primary/40 group-hover/input:shadow-sm group-hover/input:shadow-primary/20 transition-all duration-300 ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.lastName && (
                    <div className="flex items-center gap-1.5 mt-1 animate-[scale-in_0.2s_ease-out]">
                      <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      <p className="text-red-400 text-xs font-barlow">
                        {errors.lastName.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="group/input">
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                    <FiMail className="w-4 h-4 text-white/40 group-hover/input:text-primary transition-colors duration-300" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={`pl-10 group-hover/input:border-primary/40 group-hover/input:shadow-sm group-hover/input:shadow-primary/20 transition-all duration-300 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1.5 mt-1 animate-[scale-in_0.2s_ease-out]">
                    <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs font-barlow">
                      {errors.email.message}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 sm:gap-2">
                <div className="relative group/select w-full sm:w-36">
                  <div className="absolute top-4 left-3 flex items-center pointer-events-none z-10">
                    <FiPhone className="w-4 h-4 text-white/40 group-hover/select:text-primary transition-colors duration-300" />
                  </div>
                  <Select
                    {...register("countryCode")}
                    className="w-full pl-10 pr-8 appearance-none text-white/40 hover:border-primary/40 hover:shadow-sm hover:shadow-primary/20 group-hover/select:border-primary/50 transition-all duration-300 cursor-pointer"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+880">🇧🇩 +880</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+91">🇮🇳 +91</option>
                  </Select>
                  <div className="absolute top-4 right-3 flex items-center pointer-events-none z-10">
                    <svg
                      className="w-4 h-4 text-white/40 group-hover/select:text-primary transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="group/input w-full">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                      <FiPhone className="w-4 h-4 text-white/40 group-hover/input:text-primary transition-colors duration-300" />
                    </div>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: "Phone number must be 10-15 digits",
                        },
                      })}
                      className={`pl-10 group-hover/input:border-primary/40 group-hover/input:shadow-sm group-hover/input:shadow-primary/20 transition-all duration-300 ${
                        errors.phoneNumber ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.phoneNumber && (
                    <div className="flex items-center gap-1.5 mt-1 animate-[scale-in_0.2s_ease-out]">
                      <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                      <p className="text-red-400 text-xs font-barlow">
                        {errors.phoneNumber.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="group/input">
                <div className="relative">
                  <div className="absolute top-4 left-3 flex items-center pointer-events-none z-10">
                    <FiMessageSquare className="w-4 h-4 text-white/40 group-hover/input:text-primary transition-colors duration-300" />
                  </div>
                  <Textarea
                    placeholder="Message"
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters",
                      },
                      maxLength: {
                        value: 500,
                        message: "Message must not exceed 500 characters",
                      },
                    })}
                    rows={5}
                    className={`pl-10 group-hover/input:border-primary/40 group-hover/input:shadow-sm group-hover/input:shadow-primary/20 transition-all duration-300 ${
                      errors.message ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.message && (
                  <div className="flex items-center gap-1.5 mt-1 animate-[scale-in_0.2s_ease-out]">
                    <FiAlertCircle className="w-3 h-3 text-red-400 shrink-0" />
                    <p className="text-red-400 text-xs font-barlow">
                      {errors.message.message}
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full font-barlow font-semibold text-xs sm:text-sm py-3 sm:py-3.5 flex items-center justify-center gap-2 "
              >
                Send
                <FiSend className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-2 group-hover/btn:rotate-12 transition-all duration-300" />
              </Button>
            </form>
          </div>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <ContactInfo />
            <BookMeeting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormAndInfo;
