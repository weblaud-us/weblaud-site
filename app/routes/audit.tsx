import type { Route } from "./+types/audit";
import { Gauge } from "lucide-react";
import SectionBadge from "~/components/ui/section-badge";
import Discuss from "~/components/aboutUs/discuss";
import { AuditTool } from "~/components/audit/auditTool";
import { apiFetch, ApiError, captchaHeader, withClientContext } from "~/lib/api.server";
import { readAttribution } from "~/lib/attribution";
import { parseHeardAbout } from "~/lib/leads";
import { COMPANY } from "~/lib/constants";

const PAGE_URL = `${COMPANY.url}/audit`;

const FAQS = [
  {
    q: "Is the website audit really free?",
    a: "Yes. The scores are shown instantly on the page with no sign-up. If you want the full list of issues and our fix plan, we email it to you — still free, with no obligation and no mailing list.",
  },
  {
    q: "What does the audit check?",
    a: "It runs Google Lighthouse (via PageSpeed Insights) against your page and scores four areas: performance, SEO, accessibility and best practices. It also measures lab Core Web Vitals — Largest Contentful Paint, Total Blocking Time, Cumulative Layout Shift and First Contentful Paint.",
  },
  {
    q: "What is a good score?",
    a: "Google treats 90–100 as good, 50–89 as needs improvement and below 50 as poor. Performance on mobile is the hardest to score well on and usually has the biggest impact on conversions and search rankings.",
  },
  {
    q: "Why do my scores change between runs?",
    a: "Lighthouse is a lab test from Google's servers, so network and server load cause some variation — a few points either way is normal. Real-visitor (field) data can also differ from lab results.",
  },
  {
    q: "Can you fix the issues for me?",
    a: "Yes — that's what we do. Book a call and we'll go through the report with you, tell you which fixes are worth it, and quote a fixed price if you want us to do the work.",
  },
];

// Honeypot hit or garbage — answer generically, spend nothing.
const GENERIC_ERROR = "Something went wrong. Please try again.";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const field = (key: string) => String(formData.get(key) ?? "").trim();

  if (field("website")) return { error: GENERIC_ERROR };

  try {
    if (intent === "run") {
      const { id } = await withClientContext(request, () =>
        apiFetch<{ id: string }>("/audits/run", {
          method: "POST",
          headers: captchaHeader(formData),
          body: {
            url: field("url"),
            strategy: field("strategy") === "desktop" ? "desktop" : "mobile",
          },
        }),
      );
      return { id };
    }

    if (intent === "claim") {
      const id = field("id");
      if (!/^[a-f\d]{24}$/i.test(id)) return { error: GENERIC_ERROR };
      await withClientContext(request, () =>
        apiFetch(`/audits/${id}/claim`, {
          method: "POST",
          headers: captchaHeader(formData),
          body: {
            name: field("name"),
            email: field("email"),
            company: field("company") || undefined,
            heardAbout: parseHeardAbout(formData.get("heardAbout")),
            attribution: readAttribution(request),
          },
        }),
      );
      return { ok: true };
    }
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "We couldn't reach the audit service. Please try again." };
  }

  return { error: GENERIC_ERROR };
}

export function headers() {
  return { "Cache-Control": "public, max-age=300, s-maxage=3600" };
}

export function meta(_: Route.MetaArgs) {
  const title = "Free Website Audit — Speed, SEO & Accessibility Check | Weblaud";
  const description =
    "Free instant website audit: test your site's speed, Core Web Vitals, SEO, accessibility and best practices with Google Lighthouse, and get a prioritized fix plan by email.";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: "Free Website Audit — How fast is your site?" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: PAGE_URL },
    { property: "og:image", content: COMPANY.ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Free Website Audit — How fast is your site?" },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: COMPANY.ogImage },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Weblaud Free Website Audit",
        url: PAGE_URL,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        provider: { "@type": "Organization", name: COMPANY.name, url: COMPANY.url },
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    },
    { tagName: "link", rel: "canonical", href: PAGE_URL },
  ];
}

export default function AuditRoute() {
  return (
    <div className="bg-black text-white pt-24 sm:pt-28 md:pt-36 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 flex flex-col items-center">
          <SectionBadge
            icon={<Gauge className="w-3.5 h-3.5" />}
            text="Free Tool"
            badgeLabel="Website Audit"
            color="#0a84ff"
            className="mb-4"
          />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-barlow tracking-tight leading-tight">
            How fast is your website?
          </h1>
          <p className="mt-4 text-gray-400 font-barlow text-sm sm:text-lg leading-relaxed">
            Get a free speed, SEO and accessibility audit in under a minute —
            powered by Google Lighthouse. Scores instantly, full fix plan by
            email.
          </p>
        </div>

        <AuditTool />

        <section className="max-w-3xl mx-auto mt-16 sm:mt-24" aria-labelledby="audit-faq">
          <h2 id="audit-faq" className="text-2xl sm:text-3xl font-bold font-barlow tracking-tight mb-5">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-white/10 bg-[#0c0c0c] px-5 py-4 open:border-primary/30"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-barlow font-semibold text-white">
                  {f.q}
                  <span className="text-primary text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-400 font-barlow leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
      <Discuss />
    </div>
  );
}
