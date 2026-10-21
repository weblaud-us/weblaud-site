import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Progress } from "~/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
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

const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED"];

function RequiredMark() {
  return <span className="text-red-400">*</span>;
}

function initials(member: ProjectStaffRef) {
  return `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase();
}

/**
 * Client-side selection state only — the picker still renders native
 * `Checkbox name="team"` inputs, so the submitted FormData is exactly what
 * parseClientProjectForm already reads. Radix keeps each checkbox's hidden
 * input in sync with its checked state.
 */
function TeamPicker({ staff, initialSelected }: { staff: ProjectStaffRef[]; initialSelected: string[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));

  const toggle = (id: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  const allSelected = staff.length > 0 && staff.every((m) => selected.has(m._id));

  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/[0.02]">
        <span className="text-xs text-white/40">
          {selected.size} of {staff.length} selected
        </span>
        {staff.length > 0 && (
          <button
            type="button"
            className="text-xs text-primary-bright hover:text-white transition-colors"
            onClick={() =>
              setSelected(allSelected ? new Set() : new Set(staff.map((m) => m._id)))
            }
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
        )}
      </div>
      <div className="p-1.5 space-y-0.5 max-h-56 overflow-y-auto">
        {staff.length === 0 && (
          <p className="text-xs text-white/40 px-2 py-1.5">No staff to assign yet.</p>
        )}
        {staff.map((member) => (
          <div
            key={member._id}
            className="flex items-center gap-3 rounded-lg px-2.5 py-2 cursor-pointer hover:bg-white/[0.03] transition-colors"
            onClick={() => toggle(member._id, !selected.has(member._id))}
          >
            <Checkbox
              name="team"
              value={member._id}
              checked={selected.has(member._id)}
              onCheckedChange={(checked) => toggle(member._id, checked === true)}
              onClick={(e) => e.stopPropagation()}
            />
            <Avatar size="sm">
              {member.avatar && <AvatarImage src={member.avatar} alt="" />}
              <AvatarFallback>{initials(member)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm text-white/90 truncate">
                {member.firstName} {member.lastName}
              </p>
              <p className="text-xs text-white/40 truncate">{member.email}</p>
            </div>
            <span className="ml-auto text-xs text-white/30 capitalize shrink-0">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
            <CardDescription>Basic info the client sees on the project overview.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Project name <RequiredMark />
              </Label>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="h-10 flex items-center gap-3 px-3 rounded-lg border border-white/10 bg-black/20">
                    <Progress value={project.progress} className="flex-1" />
                    <span className="text-xs text-white/50 shrink-0">{project.progress}%</span>
                  </div>
                  <p className="text-xs text-white/40">Derived from the task board.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client & team</CardTitle>
            <CardDescription>Who the project is for and who's delivering it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization">
                  Organization <RequiredMark />
                </Label>
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
                <Label htmlFor="projectManager">
                  Project manager <RequiredMark />
                </Label>
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
            </div>
            <div className="space-y-2">
              <Label>Team members</Label>
              <TeamPicker staff={staff} initialSelected={teamIds} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Budget & timeline</CardTitle>
            <CardDescription>Money, dates, and the milestones the work is broken into.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Select
                  id="budgetCurrency"
                  name="budgetCurrency"
                  defaultValue={project?.budget?.currency ?? "USD"}
                >
                  {CURRENCY_OPTIONS.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </Select>
              </div>
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
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
        <Link to="/cpadmin/client-projects">
          <Button variant="ghost" type="button">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}