import { useOutletContext } from "react-router";
import { SectionLayout } from "~/components/portal/sub-nav";
import { projectPath } from "~/lib/portal-paths";
import type { ProjectWorkspaceContext } from "./projects.$id";

/** Updates tab: the PM's progress updates (index) and the project discussion. */
export default function UpdatesSection() {
  const { project, attention } = useOutletContext<ProjectWorkspaceContext>();
  const summary = attention?.summary;
  const mentions = attention ? attention.counts.updates - (summary?.updatesPendingReview?.count ?? 0) : 0;
  return (
    <SectionLayout
      label="Updates"
      items={[
        {
          to: projectPath(project._id, "updates"),
          label: "Updates",
          end: true,
          count: summary?.updatesPendingReview?.count,
        },
        { to: projectPath(project._id, "discussion"), label: "Discussion", count: mentions },
      ]}
    />
  );
}
