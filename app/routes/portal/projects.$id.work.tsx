import { useOutletContext } from "react-router";
import { SectionLayout } from "~/components/portal/sub-nav";
import { projectPath } from "~/lib/portal-paths";
import type { ProjectWorkspaceContext } from "./projects.$id";

/** Work tab: the task board and the milestone timeline. */
export default function WorkSection() {
  const { project, attention } = useOutletContext<ProjectWorkspaceContext>();
  return (
    <SectionLayout
      label="Work"
      items={[
        { to: projectPath(project._id, "tasks"), label: "Tasks", count: attention?.counts.work },
        { to: projectPath(project._id, "timeline"), label: "Timeline" },
      ]}
    />
  );
}
