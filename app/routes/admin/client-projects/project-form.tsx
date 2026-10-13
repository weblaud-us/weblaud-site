import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MilestonesEditor } from "~/components/portal/milestones-editor";
import type { ClientProject, Organization, ProjectMilestone, ProjectStaffRef } from "~/lib/types";

function parseJsonField<T>(formData: FormData, name: string): T[] {
  try {
    return JSON.parse(String(formData.get(name) ?? "[]")) as T[];
  } catch {
    return [];
  }
}

/**
 * Shared between new.tsx and edit.tsx — the create/update DTOs on the
 * backend (CreateClientProjectDto / UpdateClientProjectDto) accept the same
 * shape, so one parser covers both actions. `features` and `progress` are
 * NOT part of this: features are their own collection, edited separately
 * (see FeaturesEditor, rendered outside this form on edit.tsx — a project
 * must exist before a feature can reference it) and progress is derived
 * from the task board, not settable here at all.
 */
export function parseClientProjectForm(formData: FormData) {
  const milestones = parseJsonField<ProjectMilestone>(formData, "milestonesJson");

  const team = formData.getAll("team").map(String).filter(Boolean);

  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");

  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "planning"),
    organization: String(formData.get("organization") ?? ""),
    projectManager: String(formData.get("projectManager") ?? ""),
    team,
    budget: {
      amount: Number(formData.get("budgetAmount") ?? 0),
      currency: String(formData.get("budgetCurrency") ?? "USD"),
    },
    timeline: {
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
      milestones,
    },
  };
}

interface ClientProjectFormProps {
  organizations: Organization[];
  staff: ProjectStaffRef[];
  project?: ClientProject;
  submitLabel: string;
  isSubmitting: boolean;
  error?: string;
}

const STATUS_OPTIONS: { value: ClientProject["status"]; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function ClientProjectForm({
  organizations,
  staff,
  project,
  submitLabel,
  isSubmitting,
  error,
}: ClientProjectFormProps) {
  const pmId =
    typeof project?.projectManager === "object"
      ? project.projectManager._id
      : project?.projectManager;
  const teamIds = (project?.team ?? []).map((t) => (typeof t === "object" ? t._id : t));
  const orgId = typeof project?.organization === "object" ? project.organization._id : project?.organization;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input id="name" name="name" required defaultValue={project?.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="h-24"
              defaultValue={project?.description}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={project?.status ?? "planning"}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>
            {project && (
              <div className="space-y-2">
                <Label>Progress</Label>
                <p className="text-sm text-white/70 h-10 flex items-center px-3 rounded-lg border border-white/10 bg-black/20">
                  {project.progress}% — from the task board
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client & team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Select id="organization" name="organization" required defaultValue={orgId ?? ""}>
              <option value="" disabled>
                Select a company...
              </option>
              {organizations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectManager">Project manager</Label>
            <Select id="projectManager" name="projectManager" required defaultValue={pmId ?? ""}>
              <option value="" disabled>
                Select a project manager...
              </option>
              {staff.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.firstName} {member.lastName}
                </option>
              ))}
            </Select>
            {staff.length === 0 && (
              <p className="text-xs text-white/40">
                Invite a staff member (role: Staff or Admin) on the People page first.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Team members</Label>
            <div className="rounded-lg border border-white/10 p-3 space-y-1.5 max-h-48 overflow-y-auto">
              {staff.length === 0 && (
                <p className="text-xs text-white/40">No staff to assign yet.</p>
              )}
              {staff.map((member) => (
                <label
                  key={member._id}
                  className="flex items-center gap-2 text-sm text-white/70"
                >
                  <Checkbox name="team" value={member._id} defaultChecked={teamIds.includes(member._id)} />
                  {member.firstName} {member.lastName}
                  <span className="text-white/30 text-xs">{member.email}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Budget & timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Budget amount</Label>
              <Input
                id="budgetAmount"
                name="budgetAmount"
                type="number"
                min={0}
                step="0.01"
                defaultValue={project?.budget?.amount ?? 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetCurrency">Currency</Label>
              <Input
                id="budgetCurrency"
                name="budgetCurrency"
                defaultValue={project?.budget?.currency ?? "USD"}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={project?.timeline?.startDate?.slice(0, 10)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={project?.timeline?.endDate?.slice(0, 10)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Milestones</Label>
            <MilestonesEditor name="milestonesJson" defaultValue={project?.timeline?.milestones ?? []} />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}
