import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  backTo?: string;
  actions?: ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  backTo,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {backTo && (
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Link>
        )}
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-white/50 mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
