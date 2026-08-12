import { Search } from "lucide-react";
import { cn } from "~/lib/utils";

interface ListSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ListSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: ListSearchProps) {
  return (
    <div className={cn("relative w-full max-w-xs", className)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-light-black bg-black/40 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-primary/50 focus:outline-none transition-colors"
      />
    </div>
  );
}
