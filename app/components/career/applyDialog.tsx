import { useState } from "react";
import { FiSend } from "react-icons/fi";
import ApplyForm from "./applyForm";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ApplyDialogProps {
  careerId: string;
  jobTitle: string;
  /** Rendered as the trigger, so one dialog can back several CTAs. */
  children: React.ReactNode;
}

/**
 * The application form as a modal. It used to sit inline at the bottom of the
 * job posting, which buried the role description under a wall of inputs.
 *
 * The public site isn't wrapped in the `dark` class the admin layout applies,
 * so the shadcn defaults (`bg-background`, `text-muted-foreground`) would
 * resolve to the light palette here — the dark surface is set explicitly.
 */
export function ApplyDialog({ careerId, jobTitle, children }: ApplyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card-bg border-light-black text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <FiSend className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-white font-barlow font-bold text-xl">
                Apply for this Role
              </DialogTitle>
              <DialogDescription className="text-gray-500 text-xs font-barlow">
                {jobTitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ApplyForm careerId={careerId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

/**
 * The CTA itself, so the hero, footer and mobile bar stay in sync.
 *
 * Every prop is forwarded: `DialogTrigger asChild` clones this element to
 * attach its onClick, ref and aria state. Accepting only `className` silently
 * dropped all of that and the button did nothing.
 */
export function ApplyButton({
  className = "",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={`font-barlow font-semibold text-sm px-8 py-3.5 inline-flex items-center justify-center gap-2 group/btn ${className}`}
    >
      Apply Now
      <FiSend className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:rotate-12 transition-all duration-300" />
    </Button>
  );
}
