import { useEffect } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/insights.$slug";
import Discuss from "~/components/aboutUs/discuss";
import SectionBadge from "~/components/ui/section-badge";
import { useBlurAnimation } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { RouteErrorBoundary } from "~/components/ui/error-page";
import { apiFetch, resolveMediaUrl, ApiError } from "~/lib/api.server";
import type { Insight } from "~/lib/types";
import { FiCheckCircle } from "react-icons/fi";
import {
  ChevronLeft,
  Clock,
  Calendar,
  BookOpen,
  Layers,
  Share2,
} from "lucide-react";

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

  const [headerRef, isHeaderVisible] = useBlurAnimation<HTMLDivElement>();
  const [takeawaysRef, areTakeawaysVisible] = useBlurAnimation<HTMLDivElement>();
  const [contentRef, isContentVisible] = useBlurAnimation<HTMLDivElement>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.slug]);

  return (
    <div className="min-h-screen bg-black text-white pt-28 sm:pt-32 md:pt-36 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 sm:space-y-14">
        {/* Navigation & Header */}
        <div
          ref={headerRef}
          className={`space-y-6 ${getBlurAnimationClasses(isHeaderVisible)}`}
        >
          {/* Top Bar with Badge on left and Back Link on right */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <SectionBadge
              icon={<BookOpen className="w-3.5 h-3.5" />}
              text="Engineering Teardown"
              badgeLabel={article.category}
              color="#0a84ff"
            />

            <Link
              to="/insights"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 text-gray-300 hover:text-white text-xs font-barlow font-medium transition-all duration-300 group shrink-0"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-white shrink-0" />
              <span className="sm:hidden">Back</span>
              <span className="hidden sm:inline">Back to Insights Hub</span>
            </Link>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-barlow text-white tracking-tight leading-[1.15]">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 font-barlow leading-relaxed">
            {article.summary}
          </p>

          {/* Author & Publication Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-mono font-bold text-xs">
                {article.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="text-xs font-barlow">
                <p className="font-semibold text-white text-sm">
                  {article.author.name}
                </p>
                <p className="text-gray-400 text-xs">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{formatPublishedDate(article.publishedAt)}</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{article.readTime}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Executive Direct Answer / RAG Summary Box */}
        {article.directAnswer && (
          <section className="bg-gradient-to-r from-primary/15 via-blue-900/10 to-transparent border-l-4 border-primary p-6 sm:p-8 rounded-r-3xl shadow-xl">
            <h2 className="text-xs uppercase font-barlow font-bold tracking-widest text-primary mb-2">
              Direct Architecture Summary
            </h2>
            <p className="text-white font-barlow text-base sm:text-lg leading-relaxed font-medium">
              "{article.directAnswer}"
            </p>
          </section>
        )}

        {/* Key Takeaways Card */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <section
            ref={takeawaysRef}
            className={`rounded-2xl p-4 sm:p-6 md:p-8 bg-[#0e0e0e] border border-[#1f1f1f] shadow-2xl space-y-4 relative overflow-hidden ${getBlurAnimationClasses(
              areTakeawaysVisible
            )}`}
          >
            {/* Subtle top-right ambient light */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2.5 pb-3.5 sm:pb-4 border-b border-white/[0.06] relative z-10">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                <Layers className="w-4 h-4 text-primary shrink-0" />
                <h2 className="text-sm sm:text-lg md:text-xl font-bold font-barlow text-white tracking-tight leading-snug">
                  Key Architectural Takeaways
                </h2>
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary shrink-0 whitespace-nowrap">
                {article.keyTakeaways.length} Highlights
              </span>
            </div>

            <ul className="grid gap-2.5 sm:gap-3 pt-1 relative z-10">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 sm:gap-3.5 p-3.5 sm:p-4 rounded-xl bg-black/60 border border-white/[0.12] hover:border-primary/50 hover:bg-black/80 transition-all duration-300 group"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                    <FiCheckCircle className="text-primary text-xs sm:text-sm" />
                  </div>
                  <span className="text-gray-200 font-barlow text-xs sm:text-sm md:text-base leading-relaxed">
                    {takeaway}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Content Sections */}
        <div
          ref={contentRef}
          className={`space-y-12 ${getBlurAnimationClasses(isContentVisible)}`}
        >
          {article.content.map((section, idx) => (
            <section key={idx} className="space-y-3.5 sm:space-y-4">
              <div className="flex items-start gap-3 sm:gap-3.5 pb-3 sm:pb-4 border-b border-white/[0.08]">
                <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/[0.08] text-primary font-mono text-[11px] sm:text-xs font-bold shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white font-barlow tracking-tight leading-snug">
                  {section.heading}
                </h2>
              </div>
              <p className="whitespace-pre-line text-gray-300 font-barlow text-sm sm:text-base md:text-lg leading-relaxed pt-1">
                {renderTextWithLinks(section.text)}
              </p>
            </section>
          ))}
        </div>

        {/* Author Bio Card & Return Link */}
        <div className="rounded-2xl p-4 sm:p-5 bg-[#0e0e0e] border border-[#1f1f1f] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4 mt-10 sm:mt-12">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-mono font-bold text-xs shrink-0">
              {article.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white font-barlow text-sm truncate">
                Published by {article.author.name}
              </h3>
              <p className="text-[11px] text-gray-400 font-barlow truncate">
                {article.author.role} at Weblaud LLC
              </p>
            </div>
          </div>

          <Link
            to="/insights"
            className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-white font-barlow font-semibold text-xs hover:bg-blue-600 transition-all duration-300 shadow-md shadow-blue-500/20 shrink-0 hover:-translate-y-0.5"
          >
            <span>Explore More Blueprints</span>
          </Link>
        </div>
      </article>

      <Discuss />
    </div>
  );
}
