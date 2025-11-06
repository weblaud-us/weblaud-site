import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      icons={{
        success: <CircleCheckIcon className="size-5 text-primary" />,
        info: <InfoIcon className="size-5 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-5 text-yellow-400" />,
        error: <OctagonXIcon className="size-5 text-red-400" />,
        loading: <Loader2Icon className="size-5 text-primary animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast border-light-black shadow-xl shadow-primary/10 backdrop-blur-sm !bg-[#0e0e0e]",
          title: "text-white font-barlow font-semibold text-sm",
          description: "text-white/70 font-barlow text-xs",
          actionButton:
            "bg-primary hover:bg-primary/90 text-white font-barlow font-medium",
          cancelButton: "bg-white/10 hover:bg-white/20 text-white font-barlow",
          success: "border-primary/50",
          error: "border-red-500/50",
          warning: "border-yellow-500/50",
          info: "border-blue-500/50",
        },
        style: {
          background: "#0e0e0e",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
