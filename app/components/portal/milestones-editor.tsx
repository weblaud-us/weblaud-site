import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import type { MilestoneStatus, ProjectMilestone } from "~/lib/types";
import { Plus, X } from "lucide-react";

const STATUS_OPTIONS: { value: MilestoneStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

interface MilestoneRow {
  title: string;
  dueDate: string;
  status: MilestoneStatus;
}

function toRows(milestones: ProjectMilestone[]): MilestoneRow[] {
  return milestones.map((m) => ({
    title: m.title,
    dueDate: m.dueDate?.slice(0, 10) ?? "",
    status: m.status,
  }));
}

/**
 * Structured milestone list — previously milestones had no editor anywhere
 * (portal manage.tsx showed a note that only an admin could set them, and
 * the admin project form didn't render them either, despite
 * PortalUpdateProjectDto/CreateClientProjectDto both already accepting
 * timeline.milestones[]). Same hidden-JSON-field submission pattern as
 * FeaturesEditor — see its doc comment.
 */
export function MilestonesEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: ProjectMilestone[];
}) {
  const [rows, setRows] = useState<MilestoneRow[]>(() => toRows(defaultValue));

  const update = (index: number, patch: Partial<MilestoneRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const remove = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const add = () => {
    setRows((prev) => [...prev, { title: "", dueDate: "", status: "pending" }]);
  };

  const payload = rows
    .filter((r) => r.title.trim())
    .map((r) => ({
      title: r.title,
      status: r.status,
      ...(r.dueDate ? { dueDate: r.dueDate } : {}),
    }));

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(payload)} />

      {rows.length === 0 && <p className="text-xs text-white/40">No milestones yet.</p>}

      {rows.map((row, index) => (
        <div key={index} className="flex items-end gap-2 rounded-lg border border-white/10 p-3">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor={`milestone-title-${index}`} className="text-xs">
              Title
            </Label>
            <Input
              id={`milestone-title-${index}`}
              value={row.title}
              onChange={(e) => update(index, { title: e.target.value })}
              placeholder="e.g. Design sign-off"
            />
          </div>
          <div className="w-40 space-y-1.5">
            <Label htmlFor={`milestone-due-${index}`} className="text-xs">
              Due date
            </Label>
            <Input
              id={`milestone-due-${index}`}
              type="date"
              value={row.dueDate}
              onChange={(e) => update(index, { dueDate: e.target.value })}
            />
          </div>
          <div className="w-36 space-y-1.5">
            <Label htmlFor={`milestone-status-${index}`} className="text-xs">
              Status
            </Label>
            <Select
              id={`milestone-status-${index}`}
              value={row.status}
              onChange={(e) => update(index, { status: e.target.value as MilestoneStatus })}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => remove(index)} aria-label="Remove milestone">
            <X className="size-3.5" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="size-3.5" />
        Add milestone
      </Button>
    </div>
  );
}
