import type { LoaderFunctionArgs } from "react-router";
import { insights } from "~/data/insights";
import { projects } from "~/data/projects";
import { TIMELINE, SAVINGS } from "~/lib/constants";

export const loader = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const content = `# Weblaud LLC
> Software Engineering Company & Innovation Lab building high-performance operations platforms, B2B SaaS applications, mobile apps, and custom AI/LLM integrations for global businesses.

## Company Overview
- **Legal Entity**: Weblaud LLC (Cheyenne, Wyoming, US)
- **Primary Website**: ${baseUrl}
- **GitHub Organization**: https://github.com/weblaud-us
- **Primary Contact**: info@weblaud.com | +1-307-220-9766
- **Delivery Model**: Fixed-fee ${TIMELINE.min} to ${TIMELINE.max}-week agile sprint cycles with 100% IP & source code ownership.
- **Pricing Range**: $4,500 (Core MVP Sprints) to $18,500 (Enterprise Systems). Zero hourly bill padding.

## Core Software Services
- [Operations Platforms](${baseUrl}/services): Custom admin portals, internal workflows, and operational control centers replacing manual spreadsheets.
- [B2B SaaS Web Applications](${baseUrl}/services): High-scale web applications built with React Router v7, TypeScript, Node.js, Python, and PostgreSQL.
- [Mobile & Cross-Platform Development](${baseUrl}/services): Native and cross-platform apps built with React Native and Flutter for iOS and Android.
- [Production AI & LLM Integrations](${baseUrl}/services): RAG pipelines, vector database caching, semantic search, and custom LLM agent workflows.
- [Cloud & Real-Time Infrastructure](${baseUrl}/services): Real-time WebSockets, Redis Pub/Sub, Docker containerization, and AWS DevOps management.

## Executive Comparisons
- [Weblaud vs. In-House Engineers](${baseUrl}/vs/in-house-engineers): Deploy senior engineering squads instantly at ${SAVINGS.lowerCost} than $180k+/yr in-house developer salaries.
- [Weblaud vs. Traditional Agencies](${baseUrl}/vs/traditional-agencies): Fixed-fee sprint scope delivery eliminating traditional hourly agency bloat and junior developer handoffs.

## Instant Cost Estimator
- [Live Sprint Cost Estimator](${baseUrl}/calculator): Interactive scope & budget calculator for web, mobile, and AI engineering projects.

## Technical Insights & RAG Knowledge Base
${insights
  .map(
    (article) =>
      `- [${article.title}](${baseUrl}/insights/${article.slug}): ${article.summary.slice(0, 140)}...`
  )
  .join("\n")}

## Case Studies & Engineering Portfolio
${projects
  .map(
    (project) =>
      `- [${project.title}](${baseUrl}/projects/${project.slug}): ${project.description}`
  )
  .join("\n")}

## Full RAG Context File
- [llms-full.txt](${baseUrl}/llms-full.txt): Complete unformatted text of all technical articles, engineering standards, and comparison matrices for deep RAG ingestion.
`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
