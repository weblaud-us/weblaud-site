import { useState, useMemo } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/insights";
import Discuss from "~/components/aboutUs/discuss";
import SectionBadge from "~/components/ui/section-badge";
import { useBlurAnimation, useBlurAnimationList } from "~/hooks/useBlurAnimation";
import { getBlurAnimationClasses } from "~/lib/animations";
import { fetchOptional } from "~/lib/api.server";
import type { Insight } from "~/lib/types";
import { FiCheckCircle } from "react-icons/fi";
import {
  BookOpen,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Calendar,
  Search,
} from "lucide-react";

export async function loader() {
  const insights = await fetchOptional<Insight[]>("/insights", []);
  return { insights };
}

function formatPublishedDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Engineering Insights & Architecture Journal | Weblaud LLC" },
    {
      name: "description",
      content:
        "Deep dives into software architecture, AI pipeline engineering, operations platform migration, and enterprise system design by Weblaud LLC.",
    },
    {
      property: "og:title",
      content: "Engineering Insights & Architecture Journal | Weblaud LLC",
    },
    {
      property: "og:description",
      content:
        "Technical guides and architectural blueprints for scaling business applications and building AI platforms.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/insights" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Weblaud Engineering Insights & Architecture Journal",
    },
    {
      name: "twitter:description",
      content: "Technical blueprints for enterprise software and AI platforms.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/insights" },
  ];
}

export default function InsightsHub({ loaderData }: Route.ComponentProps) {
  const { insights } = loaderData;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [heroRef, isHeroVisible] = useBlurAnimation<HTMLDivElement>();
  const [filtersRef, isFiltersVisible] = useBlurAnimation<HTMLDivElement>();

  // Extract unique categories
  const categories = useMemo(() => {
    const raw = Array.from(new Set(insights.map((a) => a.category).filter(Boolean)));
    return ["All", ...raw];
  }, [insights]);

  // Filtered articles based on category and optional search
  const filteredArticles = useMemo(() => {
    return insights.filter((art) => {
      const matchCategory =
        selectedCategory === "All" || art.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [insights, selectedCategory, searchQuery]);

  const articleIds = useMemo(() => filteredArticles.map((a) => a._id), [filteredArticles]);
  const { itemRefs, isItemVisible } = useBlurAnimationList(articleIds, 0.06);

  // Separate featured article (first one) when viewing 'All' and no search
  const featuredArticle =
    selectedCategory === "All" && !searchQuery.trim() && filteredArticles.length > 0
      ? filteredArticles[0]
      : null;

  const gridArticles = featuredArticle
    ? filteredArticles.slice(1)
    : filteredArticles;

  return (
    <div className="bg-black text-white pt-28 sm:pt-32 md:pt-36 pb-4 min-h-screen relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-primary/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10 space-y-12 sm:space-y-16">
        {/* Banner Hero Header */}
        <div
          ref={heroRef}
          className={`text-center max-w-3xl mx-auto ${getBlurAnimationClasses(isHeroVisible)}`}
        >
          <SectionBadge
            icon={<BookOpen className="w-3.5 h-3.5" />}
            text="Architecture Journal"
            badgeLabel="Engineering Insights"
            color="#0a84ff"
            className="mb-4"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-barlow text-white tracking-tight mb-5 leading-[1.1]">
            Engineering Insights & Blueprints
          </h1>
          <p className="text-gray-400 font-barlow text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Architectural guides, technical teardowns, and actionable software engineering strategies for scaling production platforms.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div
          ref={filtersRef}
          className={`flex flex-col md:flex-row items-center justify-between gap-4 p-2 sm:p-2.5 rounded-2xl bg-[#0e0e0e] border border-[#1f1f1f] shadow-xl ${getBlurAnimationClasses(isFiltersVisible)}`}
        >
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count =
                cat === "All"
                  ? insights.length
                  : insights.filter((a) => a.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-barlow font-semibold transition-all duration-300 cursor-pointer outline-none ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-blue-500/25"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/[0.05] text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search blueprints & topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-primary/50 text-xs sm:text-sm font-barlow text-white placeholder-gray-500 pl-10 pr-4 py-2 rounded-xl outline-none transition-colors"
            />
          </div>
        </div>

        {/* Featured Spotlight Card */}
        {featuredArticle && (
          <div className="rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-br from-blue-500/10 via-[#0e0e0e] to-[#0e0e0e] border border-blue-500/20 shadow-2xl hover:border-primary/40 transition-all duration-500 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary font-bold text-[11px]">
                    Featured Blueprint
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-gray-300">
                    {featuredArticle.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredArticle.readTime}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-barlow text-white tracking-tight group-hover:text-primary transition-colors leading-[1.2]">
                  <Link to={`/insights/${featuredArticle.slug}`}>
                    {featuredArticle.title}
                  </Link>
                </h2>

                <p className="text-gray-300 font-barlow text-sm sm:text-base leading-relaxed max-w-3xl">
                  {featuredArticle.summary}
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-mono font-bold text-xs">
                      {featuredArticle.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="text-xs font-barlow">
                      <p className="font-semibold text-white">
                        {featuredArticle.author.name}
                      </p>
                      <p className="text-gray-500 font-mono text-[11px]">
                        {formatPublishedDate(featuredArticle.publishedAt)}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/insights/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white font-barlow font-semibold text-xs sm:text-sm hover:bg-blue-600 transition-all duration-300 shadow-md shadow-blue-500/20"
                  >
                    <span>Read Architecture Teardown</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Side Visual Highlight Pill */}
              <div className="hidden lg:flex lg:col-span-4 flex-col justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
                  Core Architectural Focus
                </span>
                <p className="text-xs text-gray-400 font-barlow leading-relaxed">
                  Engineered with production-tested paradigms, zero technical debt patterns, and reproducible infrastructure configs.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-gray-300">
                  <FiCheckCircle className="text-primary shrink-0 text-sm" />
                  <span>Production Ready Analysis</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {gridArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {gridArticles.map((article) => {
              const isVisible = isItemVisible(article._id);
              return (
                <article
                  key={article._id}
                  ref={(el) => {
                    if (el) itemRefs.current.set(article._id, el);
                  }}
                  className={`rounded-2xl p-6 sm:p-7 bg-[#0e0e0e] border border-[#1f1f1f] hover:border-primary/40 transition-all duration-700 hover:-translate-y-1 flex flex-col justify-between group shadow-xl ${getBlurAnimationClasses(
                    isVisible
                  )}`}
                >
                  <div>
                    {/* Card Top Metadata */}
                    <div className="flex items-center justify-between gap-2 text-xs font-barlow mb-4 pb-3 border-b border-white/[0.06]">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-[11px] font-medium">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400 font-mono text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-lg sm:text-xl font-bold font-barlow text-white group-hover:text-primary transition-colors leading-snug mb-3">
                      <Link to={`/insights/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {/* Article Summary */}
                    <p className="text-gray-400 text-xs sm:text-sm font-barlow leading-relaxed line-clamp-3 mb-6">
                      {article.summary}
                    </p>
                  </div>

                  {/* Card Bottom Author & Action */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-primary font-mono font-bold text-[10px] shrink-0">
                        {article.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="text-xs font-barlow min-w-0 truncate">
                        <p className="font-semibold text-white truncate text-[11px] sm:text-xs">
                          {article.author.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          {formatPublishedDate(article.publishedAt)}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/insights/${article.slug}`}
                      className="inline-flex items-center gap-1 text-primary text-xs font-semibold font-barlow group-hover:underline shrink-0"
                    >
                      <span>Read</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-[#0e0e0e] border border-[#1f1f1f] space-y-3">
            <BookOpen className="w-8 h-8 text-gray-500 mx-auto" />
            <h3 className="text-lg font-bold font-barlow text-white">
              No matching blueprints found
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-barlow max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-2 inline-flex items-center px-4 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <Discuss />
    </div>
  );
}
