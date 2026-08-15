import type { Route } from "./+types/contactUs";
import BannerContactUs from "~/components/contact/bannerContactUs";
import ContactFormAndInfo from "~/components/contact/contactFormAndInfo";
import { apiFetch, ApiError } from "~/lib/api.server";

// Submissions faster than this are almost certainly bots, not humans.
const MIN_FILL_MS = 3000;

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  // Honeypot: a bot filled a field no human can see. Report success so it has
  // nothing to tune against, but store nothing.
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: true };
  }

  // Time-trap: reject submissions filled out impossibly fast. Only enforce when
  // we have a valid timestamp — a missing/garbled value isn't treated as spam.
  const renderedAt = Number(formData.get("renderedAt"));
  if (Number.isFinite(renderedAt) && Date.now() - renderedAt < MIN_FILL_MS) {
    return { ok: true };
  }

  try {
    await apiFetch("/contact/submit", {
      method: "POST",
      body: {
        firstName: String(formData.get("firstName") ?? "").trim(),
        lastName: String(formData.get("lastName") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim() || undefined,
        message: String(formData.get("message") ?? "").trim(),
      },
    });
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "We couldn't send your message. Please try again." };
  }

  return { ok: true };
}

export function headers() {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Ready to build your next big idea? Contact Weblaud LLC today. Reach out to our software agency for consultations, inquiries, or project discussions.",
    },
    { property: "og:title", content: "Contact Us - Get In Touch With Weblaud" },
    {
      property: "og:description",
      content:
        "Contact Weblaud for your next digital project. Our team is ready to help transform your ideas into reality.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/contact" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { property: "og:image:alt", content: "Contact Weblaud" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Contact Weblaud - Let's Work Together" },
    {
      name: "twitter:description",
      content:
        "Reach out to Weblaud to discuss your digital transformation needs and get expert solutions.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    { tagName: "link", rel: "canonical", href: "https://weblaud.com/contact" },
  ];
}

const ContactUs = () => {
  return (
    <div>
      <BannerContactUs />
      <ContactFormAndInfo />
    </div>
  );
};

export default ContactUs;
