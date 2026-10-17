import { useOutletContext } from "react-router";
import { SectionLayout } from "~/components/portal/sub-nav";
import { projectPath } from "~/lib/portal-paths";
import type { ProjectWorkspaceContext } from "./projects.$id";

/** Decisions tab: formal approvals, priced scope changes, and status questions. */
export default function DecisionsSection() {
  const { project, attention } = useOutletContext<ProjectWorkspaceContext>();
  const s = attention?.summary;
  return (
    <SectionLayout
      label="Decisions"
      items={[
        { to: projectPath(project._id, "approvals"), label: "Approvals", count: s?.pendingApprovals.count },
        {
          to: projectPath(project._id, "changes"),
          label: "Changes",
          count: (s?.changeRequestsAwaitingDecision.count ?? 0) + (s?.changeRequestsAwaitingQuote?.count ?? 0),
        },
        { to: projectPath(project._id, "questions"), label: "Questions", count: s?.openUpdateRequests?.count },
      ]}
    />
  );
}
