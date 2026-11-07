import type { Route } from "./+types/home";
import BannerHome from "~/components/home/bannerHome";
import OurSpeciality from "~/components/home/ourSpeciality";
import WhyChooseUs from "~/components/home/whyChooseUs";
import TrustedPartnerships from "~/components/home/trustedPartnerships";
import OurSay from "~/components/home/ourSay";
import FAQ from "~/components/home/faq";
import LetsDiscuss from "~/components/home/letsDiscuss";
import FeaturedWork from "~/components/home/featuredWork";
import RoiCalculatorWidget from "~/components/home/RoiCalculatorWidget";
import BottleneckSelector from "~/components/home/bottleneckSelector";
import CoreCapabilities from "~/components/home/coreCapabilities";
import { HOME_FAQS } from "~/data/home-content";
import { TIMELINE, COMPANY } from "~/lib/constants";
import { fetchOptional, resolveMediaUrl } from "~/lib/api.server";
import { optimizeMediaUrl } from "~/lib/media";
import { toProject, type BackendProject } from "~/lib/adapters/project.server";
import type { Testimonial } from "~/lib/types";

/** How many case studies the home page features. */
const FEATURED_PROJECT_COUNT = 3;

export async function loader() {
  const [testimonials, backendProjects] = await Promise.all([
    fetchOptional<Testimonial[]>("/testimonials", []),
    fetchOptional<BackendProject[]>("/projects", []),
  ]);
  const featuredProjects = backendProjects
    .slice(0, FEATURED_PROJECT_COUNT)
    .map(toProject)
    // Same card as /projects, which renders ~400 px wide.
    .map((p) => ({ ...p, image: optimizeMediaUrl(resolveMediaUrl(p.image), 800) }));
  return { testimonials, featuredProjects };
}

// No hero preload: the hero art is drawn in code (heroCoreDiagram), so the
// h1 is the LCP element and there is no image to fetch early.

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600", // Cache in browser for 5 mins, CDN for 1 hour
  };
}

export function meta({ data }: Route.MetaArgs) {
  // Same array the FAQ section renders, so the schema matches the visible answers.
  const faqMainEntity = HOME_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  }));

  // Review JSON-LD from genuine, attributed client testimonials. Each maps to a
  // real named person who gave the quote — no AggregateRating / star score is
  // emitted, since that requires publicly verifiable ratings (see Clutch/Google),
  // and self-serving rating markup is discounted by search engines and AI crawlers.
  const testimonials = data?.testimonials ?? [];
  const reviewLd = testimonials
    .filter((t) => t.quote && t.authorName)
    .slice(0, 10)
    .map((t) => ({
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: {
          "@type": "Organization",
          name: COMPANY.name,
          url: COMPANY.url,
        },
        author: {
          "@type": "Person",
          name: t.authorName,
          ...(t.authorTitle ? { jobTitle: t.authorTitle } : {}),
        },
        reviewBody: t.quote,
        ...(t.createdAt ? { datePublished: t.createdAt.slice(0, 10) } : {}),
      },
    }));

  return [
    { title: "Weblaud LLC – Software Development Company" },
    {
      name: "description",
      content:
        `We build admin platforms, mobile apps, and AI tools for businesses that have outgrown manual processes. Most projects ship in ${TIMELINE.range}.`,
    },
    {
      property: "og:title",
      content: "Weblaud LLC – Software Development Company",
    },
    {
      property: "og:description",
      content:
        `We build admin platforms, mobile apps, and AI tools for businesses that have outgrown manual processes. Most projects ship in ${TIMELINE.range}.`,
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: "Weblaud LLC – Software Development Company",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Weblaud LLC – Software Development Company",
    },
    {
      name: "twitter:description",
      content:
        `We build admin platforms, mobile apps, and AI tools for businesses that have outgrown manual processes. Most projects ship in ${TIMELINE.range}.`,
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqMainEntity,
      },
    },
    ...reviewLd,
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/" },
  ];
}

/**
 * Order follows the buyer's questions: what you do and on what stack, which of
 * it fits my bottleneck, how you deliver, proof, why you over others, what
 * manual work is costing me, remaining objections, then the call.
 * FeaturedWork and OurSay render only when the CMS has published entries.
 */
export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <BannerHome />
      <TrustedPartnerships />
      <CoreCapabilities />
      <BottleneckSelector />
      <OurSpeciality />
      <FeaturedWork projects={loaderData.featuredProjects} />
      <WhyChooseUs />
      <OurSay testimonials={loaderData.testimonials} />
      <RoiCalculatorWidget />
      <FAQ faqs={HOME_FAQS} align="left" />
      <LetsDiscuss />
    </>
  );
}
