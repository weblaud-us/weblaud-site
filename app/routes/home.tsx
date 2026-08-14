import type { Route } from "./+types/home";
import BannerHome from "~/components/home/bannerHome";
import OurSpeciality from "~/components/home/ourSpeciality";
import WhyChooseUs from "~/components/home/whyChooseUs";
import TrustedPartnerships from "~/components/home/trustedPartnerships";
import OurSay from "~/components/home/ourSay";
import FAQ from "~/components/home/faq";
import LetsDiscuss from "~/components/home/letsDiscuss";
import heroBanner from "~/assets/hero-icon.png";
import { TIMELINE, COMPANY } from "~/lib/constants";
import { fetchOptional } from "~/lib/api.server";
import type { Testimonial, Faq, AboutInfo } from "~/lib/types";

export async function loader() {
  const [testimonials, faqs, aboutInfo] = await Promise.all([
    fetchOptional<Testimonial[]>("/testimonials", []),
    fetchOptional<Faq[]>("/faqs", []),
    fetchOptional<AboutInfo | null>("/about", null),
  ]);
  return { testimonials, faqs, trackRecord: aboutInfo?.trackRecord ?? [] };
}

export const links: Route.LinksFunction = () => {
  return [
    {
      rel: "preload",
      as: "image",
      href: heroBanner,
      fetchPriority: "high",
    },
  ];
};

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600", // Cache in browser for 5 mins, CDN for 1 hour
  };
}

export function meta({ data }: Route.MetaArgs) {
  const faqs = data?.faqs ?? [];
  const faqMainEntity =
    faqs.length > 0
      ? faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        }))
      : [
          {
            "@type": "Question",
            name: "What services does Weblaud LLC offer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Weblaud LLC provides end-to-end software engineering including custom operations platforms, B2B SaaS web applications, cross-platform mobile apps (React Native & Flutter), production AI/LLM integrations, real-time WebSocket infrastructure, and cloud DevOps management.",
            },
          },
        ];

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

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <BannerHome />
      <TrustedPartnerships trackRecord={loaderData.trackRecord} />
      <OurSpeciality />
      <WhyChooseUs />
      <OurSay testimonials={loaderData.testimonials} />
      <FAQ faqs={loaderData.faqs} />
      <LetsDiscuss />
    </>
  );
}
