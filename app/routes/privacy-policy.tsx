import { motion } from "framer-motion";
import type { Route } from "./+types/privacy-policy";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Read the Privacy Policy of Weblaud LLC to understand how we collect, use, and protect your personal data.",
    },
    {
      property: "og:title",
      content: "Privacy Policy – Weblaud LLC",
    },
    {
      property: "og:description",
      content:
        "Read the Privacy Policy of Weblaud LLC to understand how we collect, use, and protect your personal data.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://weblaud.com/privacy-policy" },
    { property: "og:image", content: "https://weblaud.com/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Privacy Policy – Weblaud LLC" },
    {
      name: "twitter:description",
      content:
        "Read the Privacy Policy of Weblaud LLC to understand how we collect, use, and protect your personal data.",
    },
    { name: "twitter:image", content: "https://weblaud.com/og-image.jpg" },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://weblaud.com/privacy-policy",
    },
  ];
}

export default function PrivacyPolicy() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <main className="flex-grow pt-28 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card-bg border border-light-black rounded-2xl p-8 md:p-12 shadow-2xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold font-barlow text-white mb-8 border-b border-white/10 pb-4">
              Privacy Policy
            </h1>

            <div className="space-y-8 text-gray-300 font-barlow leading-relaxed">
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  1. Introduction
                </h2>
                <p>
                  Welcome to Weblaud ("we," "our," or "us"). We are committed to
                  protecting your privacy and ensuring your personal information
                  is handled in a safe and responsible manner. This Privacy
                  Policy outlines how we collect, use, and protect your data
                  when you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  2. Information We Collect
                </h2>
                <p className="mb-4">
                  We may collect the following types of information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-white">
                      Personal Information:
                    </strong>{" "}
                    Name, email address, phone number, and other contact details
                    you provide when you contact us or book a meeting.
                  </li>
                  <li>
                    <strong className="text-white">Usage Data:</strong>{" "}
                    Information about how you interact with our website,
                    including IP address, browser type, pages visited, and time
                    spent on the site.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  3. Third-Party Service Providers
                </h2>
                <p className="mb-4">
                  We share limited personal data with the following
                  third-party processors solely to operate the features below.
                  Each provider processes data under its own privacy policy:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-white">Web3Forms:</strong> When
                    you submit our contact form, your name, email, phone
                    number, and message are transmitted to Web3Forms
                    (web3forms.com) for email delivery to our team.
                  </li>
                  <li>
                    <strong className="text-white">Zcal:</strong> When you
                    book a call through our scheduling widget, Zcal (zcal.co)
                    processes the booking details you provide (name, email,
                    and selected time) to schedule the meeting.
                  </li>
                  <li>
                    <strong className="text-white">Google Fonts:</strong> Our
                    website loads typefaces from Google's font servers, which
                    may receive your IP address as part of that request.
                  </li>
                  <li>
                    <strong className="text-white">Google Analytics:</strong>{" "}
                    We use Google Analytics (GA4) to understand how visitors
                    use our website, including pages visited, referral
                    source, and approximate location. Google may process this
                    data on servers outside your country. You can opt out
                    using the{" "}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Analytics Opt-out Browser Add-on
                    </a>
                    .
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  4. How We Use Your Information
                </h2>
                <p className="mb-4">
                  We use the collected information for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain our services.</li>
                  <li>
                    To communicate with you regarding your inquiries or
                    bookings.
                  </li>
                  <li>To improve our website and user experience.</li>
                  <li>To comply with legal obligations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  5. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal data against unauthorized access,
                  alteration, disclosure, or destruction. However, please note
                  that no method of transmission over the internet is 100%
                  secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                  6. Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <p className="mt-2 text-blue-500">info@weblaud.com</p>
              </section>

              <div className="pt-8 border-t border-white/10 text-sm text-gray-500">
                Last updated: {new Date().getFullYear()}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
