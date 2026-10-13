import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import type { Feature, FeatureStatus } from "~/lib/types";
import { Plus, X } from "lucide-react";

const STATUS_OPTIONS: { value: FeatureStatus; label: string }[] = [
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

interface FeatureRow {
  _id?: string;
  title: string;
  description: string;
  status: FeatureStatus;
}

function toRows(features: Feature[]): FeatureRow[] {
  return features.map((f) => ({
    _id: f._id,
    title: f.title,
    description: f.description ?? "",
    status: f.status,
  }));
}

/**
 * Features are their own collection now (see backend/src/modules/feature),
 * not a field on the project — so this is a self-contained save unit with
 * its own fetcher, not a hidden field folded into a bigger project-edit
 * form. `_id` is preserved per row across a save so an unchanged feature
 * keeps its identity (and anything referencing it, like Task.feature,
 * doesn't dangle) — see FeatureService.replaceForProject for the diff logic
 * this round-trips through.
 *
 * Structured per-feature editing (title, description, status all edit in
 * place) replaced an earlier newline-textarea + title-match-reconciliation
 * design that silently reset a feature's status on rename; nothing here
 * reconstructs state from a title match anymore.
 */
export function FeaturesEditor({
  projectId,
  defaultValue,
}: {
  projectId: string;
  defaultValue: Feature[];
}) {
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const isSaving = fetcher.state !== "idle";
  const [rows, setRows] = useState<FeatureRow[]>(() => toRows(defaultValue));

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.ok) toast.success("Features updated.");
      else if (fetcher.data.error) toast.error(fetcher.data.error);
    }
  }, [fetcher.state, fetcher.data]);

  const update = (index: number, patch: Partial<FeatureRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const remove = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const add = () => {
    setRows((prev) => [...prev, { title: "", description: "", status: "planned" }]);
  };

  const payload = JSON.stringify(
    rows
      .filter((r) => r.title.trim())
      .map((r) => ({ ...(r._id ? { _id: r._id } : {}), title: r.title, description: r.description, status: r.status })),
  );

  return (
    <fetcher.Form method="post" className="space-y-3">
      <input type="hidden" name="intent" value="features" />
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="featuresJson" value={payload} />

      {rows.length === 0 && <p className="text-xs text-white/40">No features yet.</p>}

      {rows.map((row, index) => (
        <div key={row._id ?? `new-${index}`} className="rounded-lg border border-white/10 p-3 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor={`feature-title-${index}`} className="text-xs">
                Title
              </Label>
              <Input
                id={`feature-title-${index}`}
                value={row.title}
                onChange={(e) => update(index, { title: e.target.value })}
                placeholder="e.g. Checkout flow"
              />
            </div>
            <div className="w-40 space-y-1.5">
              <Label htmlFor={`feature-status-${index}`} className="text-xs">
                Status
              </Label>
              <Select
                id={`feature-status-${index}`}
                value={row.status}
                onChange={(e) => update(index, { status: e.target.value as FeatureStatus })}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="pt-6">
              <Button type="button" variant="outline" size="sm" onClick={() => remove(index)} aria-label="Remove feature">
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`feature-desc-${index}`} className="text-xs">
              Description (optional)
            </Label>
            <Input
              id={`feature-desc-${index}`}
              value={row.description}
              onChange={(e) => update(index, { description: e.target.value })}
              placeholder="Short note about scope"
            />
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="size-3.5" />
          Add feature
        </Button>
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save features"}
        </Button>
      </div>
    </fetcher.Form>
  );
}
