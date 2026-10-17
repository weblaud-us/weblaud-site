import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("aboutus", "routes/aboutus.tsx"),
  route("services", "routes/services.tsx"),
  route("projects", "routes/projects.tsx"),
  route("projects/:slug", "routes/projects.$slug.tsx"),
  route("calculator", "routes/calculator.tsx"),
  // Free website audit (lead magnet). The status route is a loader-only
  // resource route the page polls while Google runs Lighthouse.
  route("audit", "routes/audit.tsx"),
  route("audit/status/:id", "routes/audit.status.$id.ts"),
  route("insights", "routes/insights.tsx"),
  route("insights/:slug", "routes/insights.$slug.tsx"),
  route("career", "routes/career.tsx"),
  route("career/:slug", "routes/career.$slug.tsx"),
  route("career/:slug/apply", "routes/career.$slug.apply.tsx"),
  // Intent landing pages (GEO content system). The /vs/* and /solutions/* groups
  // are data-driven: one dynamic route each, backed by the app/data/landing
  // catalog. Standalone hub/guide/segment pages get their own route files.
  route("vs/:slug", "routes/vs.$slug.tsx"),
  route("solutions/:slug", "routes/solutions.$slug.tsx"),
  route("best-software-agency", "routes/best-software-agency.tsx"),
  route("software-development-cost", "routes/software-development-cost.tsx"),
  route("for-startups", "routes/for-startups.tsx"),
  route("contact", "routes/contactUs.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("terms-of-service", "routes/terms-of-service.tsx"),
  route("robots.txt", "routes/robots.txt.ts"),
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("llms.txt", "routes/llms.txt.ts"),
  route("llms-full.txt", "routes/llms-full.txt.ts"),

  // URL prefix is deliberately "cpadmin", not "admin": keeps the panel off the
  // path every scanner probes first. The route *files* stay under routes/admin/.
  route("cpadmin/login", "routes/admin/login.tsx"),
  route("cpadmin", "routes/admin/layout.tsx", [
    index("routes/admin/dashboard.tsx"),
    route("projects", "routes/admin/projects/index.tsx"),
    route("projects/new", "routes/admin/projects/new.tsx"),
    route("projects/:id/edit", "routes/admin/projects/edit.tsx"),
    route("insights", "routes/admin/insights/index.tsx"),
    route("insights/new", "routes/admin/insights/new.tsx"),
    route("insights/:id/edit", "routes/admin/insights/edit.tsx"),
    route("services", "routes/admin/services/index.tsx"),
    route("services/new", "routes/admin/services/new.tsx"),
    route("services/:id/edit", "routes/admin/services/edit.tsx"),
    route("careers", "routes/admin/careers/index.tsx"),
    route("careers/new", "routes/admin/careers/new.tsx"),
    route("careers/:id/edit", "routes/admin/careers/edit.tsx"),
    route("team", "routes/admin/team.tsx"),
    route("testimonials", "routes/admin/testimonials.tsx"),
    route("faqs", "routes/admin/faqs.tsx"),
    route("about", "routes/admin/about.tsx"),
    route("calculator-config", "routes/admin/calculator-config.tsx"),
    route("contact-info", "routes/admin/contact-info.tsx"),
    route("contact-submissions", "routes/admin/contact-submissions.tsx"),
    route("estimate-submissions", "routes/admin/estimate-submissions.tsx"),
    route("audit-submissions", "routes/admin/audit-submissions.tsx"),
    route("applicants", "routes/admin/applicants.tsx"),

    // Client portal / agency OS management.
    route("organizations", "routes/admin/organizations.tsx"),
    route("people", "routes/admin/people.tsx"),
    route("client-projects", "routes/admin/client-projects/index.tsx"),
    route("client-projects/new", "routes/admin/client-projects/new.tsx"),
    route("client-projects/:id/edit", "routes/admin/client-projects/edit.tsx"),
    route("contracts", "routes/admin/contracts/index.tsx"),
    route("contracts/new", "routes/admin/contracts/new.tsx"),
    route("contracts/:id/edit", "routes/admin/contracts/edit.tsx"),
    route("invoices", "routes/admin/invoices/index.tsx"),
    route("invoices/new", "routes/admin/invoices/new.tsx"),
    route("invoices/:id", "routes/admin/invoices/$id.tsx"),
    route("approvals", "routes/admin/approvals.tsx"),
    route("change-requests", "routes/admin/change-requests.tsx"),
    route("audit-log", "routes/admin/audit-log.tsx"),
    route("settings", "routes/admin/settings.tsx"),
  ]),
  // Outside the admin layout: resource routes with no component, so they must
  // not be matched as a leaf that the layout tries to render.
  route("cpadmin/applicants/export", "routes/admin/applicants.export.ts"),
  route("cpadmin/applicants/:id/resume", "routes/admin/applicants.$id.resume.ts"),
  route("cpadmin/invoices/:id/pdf", "routes/admin/invoices.$id.pdf.ts"),
  route("cpadmin/contracts/:id/certificate", "routes/admin/contracts.$id.certificate.ts"),

  // Client/staff portal — the project-management dashboard. Separate cookie
  // session and layout from /cpadmin; see app/lib/portal.server.ts.
  route("portal/login", "routes/portal/login.tsx"),
  route("portal/accept-invite", "routes/portal/accept-invite.tsx"),
  // Shared by portal and admin accounts (?from=admin returns to /cpadmin/login).
  route("portal/forgot-password", "routes/portal/forgot-password.tsx"),
  route("portal", "routes/portal/layout.tsx", [
    index("routes/portal/dashboard.tsx"),
    route("review-queue", "routes/portal/review-queue.tsx"),
    route("billing", "routes/portal/billing.tsx"),
    route("settings", "routes/portal/settings.tsx"),
    // A client org's own people — client admins invite and manage; see portal-team.controller.ts.
    route("team", "routes/portal/team.tsx"),
    // Six top-level tabs (Overview, Work, Updates, Files, Decisions,
    // Billing) plus Time and Manage for staff; tabs with sub-pages are
    // layout routes. Every page reads the parent's already-fetched project
    // via useOutletContext() (see ProjectWorkspaceContext in projects.$id.tsx)
    // and the section layouts forward that context unchanged. URLs mirror the
    // backend's portal-links.util.ts — see app/lib/portal-paths.ts.
    route("projects/:id", "routes/portal/projects.$id.tsx", { id: "portal-project" }, [
      index("routes/portal/projects.$id._index.tsx"),
      route("work", "routes/portal/projects.$id.work.tsx", [
        index("routes/portal/projects.$id.section-index.ts", { id: "portal-work-index" }),
        route("tasks", "routes/portal/projects.$id.tasks.tsx"),
        route("timeline", "routes/portal/projects.$id.work.timeline.tsx"),
      ]),
      route("updates", "routes/portal/projects.$id.updates-section.tsx", [
        index("routes/portal/projects.$id.updates.tsx"),
        route("discussion", "routes/portal/projects.$id.discussion.tsx"),
      ]),
      route("files", "routes/portal/projects.$id.files.tsx"),
      route("decisions", "routes/portal/projects.$id.decisions.tsx", [
        index("routes/portal/projects.$id.section-index.ts", { id: "portal-decisions-index" }),
        route("approvals", "routes/portal/projects.$id.approvals.tsx"),
        route("changes", "routes/portal/projects.$id.change-requests.tsx"),
        route("questions", "routes/portal/projects.$id.requests.tsx"),
      ]),
      route("billing", "routes/portal/projects.$id.billing.tsx", [
        index("routes/portal/projects.$id.section-index.ts", { id: "portal-billing-index" }),
        route("invoices", "routes/portal/projects.$id.invoices.tsx"),
        route("contract", "routes/portal/projects.$id.contract.tsx"),
      ]),
      route("time", "routes/portal/projects.$id.time.tsx"),
      route("manage", "routes/portal/projects.$id.manage.tsx"),
    ]),
  ]),
  // PERMANENT: the pre-2026-10 flat project tabs. Notification links stored
  // in the database and in emails already sent point here — never remove.
  ...(["tasks", "discussion", "approvals", "change-requests", "requests", "invoices", "contract"] as const).map(
    (old) => route(`portal/projects/:id/${old}`, "routes/portal/projects.$id.legacy.ts", { id: `portal-legacy-${old}` }),
  ),
  // Outside the portal layout: resource routes with no component.
  route("portal/invoices/:id/pdf", "routes/portal/invoices.$id.pdf.ts"),
  route("portal/contracts/:id/certificate", "routes/portal/contracts.$id.certificate.ts"),
  route("portal/contracts/:id/document", "routes/portal/contracts.$id.document.ts"),
  route("portal/notifications/count", "routes/portal/notifications.count.ts"),
  route("portal/files/:id/download", "routes/portal/files.$id.download.ts"),
  // Redirect-only routes for links in notification emails. Invoices and
  // contracts have no standalone portal page (they live on a project's tabs),
  // and emails sent before the URL fix carry a doubled /portal/portal/ prefix
  // — these keep every link already sitting in someone's inbox working.
  route("portal/invoices/:id", "routes/portal/invoices.$id.ts"),
  route("portal/contracts", "routes/portal/contracts.ts"),
  route("portal/portal/*", "routes/portal/doubled-prefix.ts"),
  // Public — no portal session required. See users.controller.ts#unsubscribe.
  route("email-preferences/unsubscribe", "routes/portal/email-preferences.unsubscribe.tsx"),

  // Must stay last: catch-all 404 for anything none of the above matched.
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
