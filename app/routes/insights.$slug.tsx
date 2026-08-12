import { Link } from "react-router";
import type { Route } from "./+types/insights.$slug";
import Discuss from "~/components/aboutUs/discuss";
import { useEffect } from "react";
import { FiArrowLeft, FiCheckCircle, FiClock } from "react-icons/fi";
import { RouteErrorBoundary } from "~/components/ui/error-page";
import { apiFetch, resolveMediaUrl, ApiError } from "~/lib/api.server";
import type { Insight } from "~/lib/types";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const article = await apiFetch<Insight>(`/insights/slug/${params.slug}`);
    return {
      article: {
        ...article,
        author: {
          ...article.author,
          avatarUrl: resolveMediaUrl(article.author.avatarUrl),
        },
      },
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      throw new Response("Not Found", { status: 404 });
    }
    throw err;
  }
}

function articleISODate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatPublishedDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function meta({ data }: Route.MetaArgs) {
  const article = data?.article;
  if (!article) return [{ title: "Article Not Found | Weblaud LLC" }];

  const pageUrl = `https://weblaud.com/insights/${article.slug}`;
  const pageTitle = `${article.title} | Weblaud Engineering Journal`;

  return [
    { title: pageTitle },
    { name: "description", content: article.summary },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: article.summary },
    { property: "og:type", content: "article" },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: pageTitle },
    { name: "twitter:description", content: article.summary },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": ["BlogPosting", "TechArticle"],
        headline: article.title,
        description: article.summary,
        url: pageUrl,
        datePublished: articleISODate(article.publishedAt),
        dateModified: articleISODate(article.publishedAt),
        articleSection: article.category,
        about: {
          "@type": "Thing",
          name: article.category,
        },
        author: {
          "@type": "Person",
          name: article.author.name,
          jobTitle: article.author.role,
          worksFor: {
            "@type": "Organization",
            name: "Weblaud LLC",
            url: "https://weblaud.com",
          },
        },
        publisher: {
          "@type": "Organization",
          name: "Weblaud LLC",
          logo: {
            "@type": "ImageObject",
            url: "https://weblaud.com/favicon.png",
          },
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".rag-summary-box", "h1"],
        },
        articleBody: article.directAnswer,
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
            item: "https://weblaud.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Insights",
            item: "https://weblaud.com/insights",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: pageUrl,
          },
        ],
      },
    },
    { tagName: "link", rel: "canonical", href: pageUrl },
  ];
}

function renderTextWithLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      const [, linkText, linkUrl] = match;
      if (linkUrl.startsWith("http")) {
        return (
          <a
            key={index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline transition-colors"
          >
            {linkText}
          </a>
        );
      }
      return (
        <Link
          key={index}
          to={linkUrl}
          className="text-primary font-semibold hover:underline transition-colors"
        >
          {linkText}
        </Link>
      );
    }
    return part;
  });
}

export function ErrorBoundary() {
  return (
    <RouteErrorBoundary
      notFound={{
        badge: "Article not found",
        title: "That article isn't here.",
        description:
          "The engineering insight you requested doesn't exist or may have been moved. Have a read through our latest writing instead.",
        primaryAction: { label: "Back to Insights", to: "/insights" },
        suggestions: [
          { label: "Our Services", to: "/services" },
          { label: "Our Projects", to: "/projects" },
          { label: "Contact Us", to: "/contact" },
        ],
      }}
    />
  );
}

export default function ArticleDetail({ loaderData }: Route.ComponentProps) {
  const { article } = loaderData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.slug]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <Link
          to="/insights"
          className="inline-flex items-center text-primary hover:text-white transition-colors duration-300 mb-8 font-barlow font-medium group"
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Insights
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-4 text-xs font-barlow text-gray-400 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
              {article.category}
            </span>
            <span className="flex items-center">
              <FiClock className="mr-1" />
              {article.readTime}
            </span>
            <span>•</span>
            <span>{formatPublishedDate(article.publishedAt)}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-barlow leading-tight mb-6">
            {article.title}
          </h1>

          <p className="text-lg text-gray-300 font-barlow leading-relaxed">
            {article.summary}
          </p>
        </header>

        {/* Executive Direct Answer / RAG Summary Box */}
        <section className="bg-gradient-to-r from-primary/15 via-blue-900/10 to-transparent border-l-4 border-primary p-6 sm:p-8 rounded-r-3xl mb-12 shadow-xl">
          <h2 className="text-xs uppercase font-barlow font-bold tracking-widest text-primary mb-2">
            Direct Architecture Summary
          </h2>
          <p className="text-white font-barlow text-base leading-relaxed font-medium">
            "{article.directAnswer}"
          </p>
        </section>

        {/* Key Takeaways */}
        <section className="bg-card-bg/60 border border-light-black p-6 sm:p-8 rounded-3xl mb-12">
          <h2 className="text-lg font-bold font-barlow mb-4 text-white">Key Takeaways</h2>
          <ul className="space-y-3">
            {article.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start text-gray-300 font-barlow text-sm sm:text-base">
                <FiCheckCircle className="text-primary mt-1 mr-3 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Content Blocks */}
        <div className="space-y-10 text-gray-300 font-barlow leading-relaxed text-base sm:text-lg">
          {article.content.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-2xl font-bold text-white font-barlow border-b border-white/10 pb-3">
                {section.heading}
              </h2>
              <p className="whitespace-pre-line text-gray-300 font-barlow leading-relaxed">
                {renderTextWithLinks(section.text)}
              </p>
            </section>
          ))}
        </div>
      </article>

      <Discuss />
    </div>
  );
}
