import { COMPANY } from "./constants";
import type { LandingPageConfig } from "./types";

/**
 * Builds the full meta descriptor array (title, description, Open Graph, Twitter,
 * canonical, and Article + FAQPage + BreadcrumbList JSON-LD) for one intent
 * landing page. Centralised here so every page in the catalog gets identical,
 * valid, RAG-friendly markup instead of hand-rolled per-file schema.
 */
export function buildLandingMeta(config: LandingPageConfig) {
  const pageUrl = `${COMPANY.url}${config.path}`;
  const articleType = config.articleType ?? "TechArticle";

  return [
    { title: config.metaTitle },
    { name: "description", content: config.metaDescription },

    { property: "og:title", content: config.metaTitle },
    { property: "og:description", content: config.metaDescription },
    { property: "og:type", content: "article" },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: COMPANY.ogImage },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: config.metaTitle },
    { name: "twitter:description", content: config.metaDescription },
    { name: "twitter:image", content: COMPANY.ogImage },

    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": articleType,
        headline: config.metaTitle,
        description: config.metaDescription,
        url: pageUrl,
        author: {
          "@type": "Organization",
          name: COMPANY.name,
          url: COMPANY.url,
        },
        publisher: {
          "@type": "Organization",
          name: COMPANY.name,
          url: COMPANY.url,
          logo: COMPANY.logo,
        },
        articleBody: config.articleBody,
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: config.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: COMPANY.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: config.breadcrumbName,
            item: pageUrl,
          },
        ],
      },
    },
    { tagName: "link", rel: "canonical", href: pageUrl },
  ];
}
