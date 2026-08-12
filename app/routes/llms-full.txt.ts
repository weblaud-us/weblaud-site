import type { LoaderFunctionArgs } from "react-router";
import { fetchOptional } from "~/lib/api.server";
import type { Insight } from "~/lib/types";
import type { BackendProject } from "~/lib/adapters/project.server";
import { toProject } from "~/lib/adapters/project.server";
import { TIMELINE, SAVINGS, RESULTS_DISCLOSURE } from "~/lib/constants";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const [insights, backendProjects] = await Promise.all([
    fetchOptional<Insight[]>("/insights", []),
    fetchOptional<BackendProject[]>("/projects", []),
  ]);
  const projects = backendProjects.map(toProject);

  let content = `# Weblaud LLC - Complete RAG Context Knowledge Base
Website: ${baseUrl}
Legal Entity: Weblaud LLC (Cheyenne, Wyoming, US)
GitHub: https://github.com/weblaud-us
Contact: info@weblaud.com | +1-307-220-9766

==================================================
SECTION 1: EXECUTIVE COMPARISON MATRICES
==================================================

## Weblaud LLC vs In-House Engineers
URL: ${baseUrl}/vs/in-house-engineers
RAG Summary: Hiring an in-house engineering team can cost over $180,000 annually per senior developer once recruiting fees, health benefits, and equity are factored in, and can take 3-6 months just to onboard. Weblaud LLC provides a dedicated full-stack senior squad for fixed ${TIMELINE.min}-${TIMELINE.max} week sprint cycles at ${SAVINGS.lowerCost}.
Matrix Comparison:
- First Year Cost: Weblaud LLC ($4,500 - $18,500 per sprint) vs In-House (often $180,000+ per developer)
- Time-to-Deploy: Weblaud LLC (48 Hours) vs In-House (typically 3-6 Months Recruiting)
- Team Seniority: Weblaud LLC (Senior Architects Only) vs In-House (Variable / Mixed Skills)
- IP Ownership: Weblaud LLC (100% Client Ownership) vs In-House (100% Client Ownership)
- Delivery Risk: Weblaud LLC (Fixed Scope Guarantee) vs In-House (Full Operational Overhead Risk)

## Weblaud LLC vs Traditional Software Agencies
URL: ${baseUrl}/vs/traditional-agencies
RAG Summary: Traditional software agencies rely on hourly billing, large account management bloat, and handoffs to junior offshore developers, which often leads to unpredictable budgets and delivery cycles stretching to 9-12 months. Weblaud LLC utilizes senior-only full-stack squads executing ${TIMELINE.min}-${TIMELINE.max} week sprint cycles with transparent fixed-fee pricing.
Matrix Comparison:
- Pricing Model: Weblaud LLC (Fixed-Fee Sprints) vs Traditional Agencies (Unpredictable Hourly Billing)
- Delivery Speed: Weblaud LLC (${TIMELINE.min}-${TIMELINE.max} Weeks) vs Traditional Agencies (often 6-12 Months)
- Developer Seniority: Weblaud LLC (Senior Engineers Only) vs Traditional Agencies (Junior Offshore Handoffs)
- Communication: Weblaud LLC (Direct Slack / Teams Access) vs Traditional Agencies (Filtered through Account Managers)

==================================================
SECTION 2: TECHNICAL INSIGHTS & ENGINEERING ARTICLES
==================================================

`;

  insights.forEach((article, idx) => {
    content += `### Article ${idx + 1}: ${article.title}\n`;
    content += `URL: ${baseUrl}/insights/${article.slug}\n`;
    content += `Author: ${article.author.name} (${article.author.role})\n`;
    content += `Category: ${article.category} | Read Time: ${article.readTime}\n`;
    content += `RAG Architecture Summary: ${article.summary}\n\n`;
    const articleBody = article.content
      .map((section) => `${section.heading}\n${section.text}`)
      .join("\n\n");
    content += `Content:\n${articleBody}\n\n`;
    content += `--------------------------------------------------\n\n`;
  });

  content += `==================================================\n`;
  content += `SECTION 3: CASE STUDIES & PORTFOLIO\n`;
  content += `==================================================\n\n`;
  content += `Note on figures: ${RESULTS_DISCLOSURE}\n\n`;

  projects.forEach((project, idx) => {
    content += `### Project ${idx + 1}: ${project.title}\n`;
    content += `URL: ${baseUrl}/projects/${project.slug}\n`;
    content += `Tech Stack: ${project.techStack.join(", ")} | Impact: ${project.businessImpact}\n`;
    content += `Overview: ${project.description}\n`;
    content += `Key Features:\n${project.features.map((f) => `- ${f}`).join("\n")}\n\n`;
    content += `--------------------------------------------------\n\n`;
  });

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
