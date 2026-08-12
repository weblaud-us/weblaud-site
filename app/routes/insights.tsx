import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/insights";
import Discuss from "~/components/aboutUs/discuss";
import { FiArrowRight, FiClock, FiTag } from "react-icons/fi";
import { fetchOptional } from "~/lib/api.server";
import type { Insight } from "~/lib/types";

export async function loader() {
  const insights = await fetchOptional<Insight[]>("/insights", []);
  return { insights };
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

  const categories = ["All", "Operations", "AI & ML", "Architecture"];

  const filteredArticles =
    selectedCategory === "All"
      ? insights
      : insights.filter((art) => art.category === selectedCategory);

  return (
    <div className="bg-black text-white pt-24 md:pt-32 pb-16 min-h-screen">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4 font-barlow">
            Weblaud Architecture Journal
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold font-barlow mb-4">
            Engineering Insights & Blueprints
          </h1>
          <p className="text-gray-400 font-barlow text-base sm:text-lg">
            Architectural guides, technical teardowns, and actionable software engineering strategies for scaling modern digital platforms.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-barlow font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredArticles.map((article) => (
            <article
              key={article._id}
              className="bg-card-bg/80 border border-light-black rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-primary/50 transition-all duration-300 group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-barlow text-gray-400 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary font-medium">
                    <FiTag className="mr-1.5" />
                    {article.category}
                  </span>
                  <span className="flex items-center">
                    <FiClock className="mr-1" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold font-barlow text-white group-hover:text-primary transition-colors leading-snug mb-3">
                  <Link to={`/insights/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>

                <p className="text-gray-400 text-sm font-barlow leading-relaxed mb-6">
                  {article.summary}
                </p>
              </div>

              <div>
                <div className="border-t border-white/10 pt-4 mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-400 font-barlow">
                    <p className="font-semibold text-white">{article.author.name}</p>
                    <p className="text-[11px] text-gray-500">
                      {formatPublishedDate(article.publishedAt)}
                    </p>
                  </div>

                  <Link
                    to={`/insights/${article.slug}`}
                    className="inline-flex items-center text-primary text-xs font-bold font-barlow group-hover:translate-x-1 transition-transform"
                  >
                    Read Article <FiArrowRight className="ml-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Discuss />
    </div>
  );
}
