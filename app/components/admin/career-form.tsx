import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { JOB_TYPES, type Career } from "~/lib/types";

/** Same "one per line" textarea convention the insights form uses for lists. */
function linesToList(formData: FormData, key: string): string[] {
  return String(formData.get(key) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function optional(formData: FormData, key: string): string | undefined {
  const value = String(formData.get(key) ?? "").trim();
  return value || undefined;
}

/**
 * Builds the CreateCareerDto / UpdateCareerDto body. Blank optional fields are
 * dropped rather than sent as "" — the DTO's @IsDateString on `deadline`
 * rejects an empty string, and an empty `slug` would otherwise be treated as an
 * explicit slug change on update.
 */
export function parseCareerForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    position: String(formData.get("position") ?? ""),
    slug: optional(formData, "slug"),
    summary: String(formData.get("summary") ?? ""),
    department: String(formData.get("department") ?? ""),
    location: String(formData.get("location") ?? ""),
    jobType: String(formData.get("jobType") ?? ""),
    experience: String(formData.get("experience") ?? ""),
    salaryRange: String(formData.get("salaryRange") ?? ""),
    deadline: optional(formData, "deadline"),
    responsibilities: linesToList(formData, "responsibilities"),
    requirements: linesToList(formData, "requirements"),
    jobDetails: String(formData.get("jobDetails") ?? ""),
    isActive: formData.get("isActive") === "on",
  };
}

/** `<input type="date">` wants YYYY-MM-DD, the API returns an ISO timestamp. */
function toDateInput(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

interface CareerFormFieldsProps {
  /** Omitted when creating. */
  career?: Career;
}

export function CareerFormFields({ career }: CareerFormFieldsProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job title</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={career?.title}
                placeholder="UI/UX Designer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Openings</Label>
              <Input
                id="position"
                name="position"
                required
                defaultValue={career?.position}
                placeholder="3 positions"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              className="h-20"
              defaultValue={career?.summary}
              placeholder="One-line blurb shown on the /career listing card."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                defaultValue={career?.department}
                placeholder="Design"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={career?.slug}
                placeholder="ui-ux-designer"
              />
              <p className="text-xs text-white/40">
                {career
                  ? "Changing this changes the public /career URL."
                  : "Leave blank to generate it from the title."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                defaultValue={career?.location}
                placeholder="Remote · Dhaka, Bangladesh"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobType">Job type</Label>
              <Select
                id="jobType"
                name="jobType"
                className="w-full"
                defaultValue={career?.jobType ?? ""}
              >
                <option value="">Not specified</option>
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                name="experience"
                defaultValue={career?.experience}
                placeholder="2-4 years"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryRange">Salary range</Label>
              <Input
                id="salaryRange"
                name="salaryRange"
                defaultValue={career?.salaryRange}
                placeholder="Negotiable"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Application deadline</Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              defaultValue={toDateInput(career?.deadline)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobDetails">About the role</Label>
            <Textarea
              id="jobDetails"
              name="jobDetails"
              className="h-32"
              defaultValue={career?.jobDetails}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsibilities">
              Responsibilities (one per line)
            </Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              className="h-28"
              defaultValue={career?.responsibilities.join("\n")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (one per line)</Label>
            <Textarea
              id="requirements"
              name="requirements"
              className="h-28"
              defaultValue={career?.requirements.join("\n")}
            />
          </div>
        </CardContent>
      </Card>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <Checkbox name="isActive" defaultChecked={career?.isActive ?? true} />
        Published (visible on /career)
      </label>
    </>
  );
}
