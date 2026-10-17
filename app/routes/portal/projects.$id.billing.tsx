import { useOutletContext } from "react-router";
import { SectionLayout } from "~/components/portal/sub-nav";
import { projectPath } from "~/lib/portal-paths";
import type { ProjectWorkspaceContext } from "./projects.$id";

/** Billing tab: the project's invoices and its contract. */
export default function BillingSection() {
  const { project, attention } = useOutletContext<ProjectWorkspaceContext>();
  const s = attention?.summary;
  return (
    <SectionLayout
      label="Billing"
      items={[
        {
          to: projectPath(project._id, "invoices"),
          label: "Invoices",
          count: (s?.unpaidInvoices.count ?? 0) + (s?.overdueInvoices.count ?? 0),
        },
        { to: projectPath(project._id, "contract"), label: "Contract", count: s?.contractsAwaitingSignature.count },
      ]}
    />
  );
}
