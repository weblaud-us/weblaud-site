import type { Route } from "./+types/contactUs";
import BannerContactUs from "~/components/contact/bannerContactUs";
import ContactFormAndInfo from "~/components/contact/contactFormAndInfo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us – Weblaud LLC Software Development Company" },
    {
      name: "description",
      content:
        "Ready to build your next big idea? Contact Weblaud LLC today. Reach out to our software agency for consultations, inquiries, or project discussions.",
    },
    {
      name: "keywords",
      content:
        "contact Weblaud LLC, software agency contact, hire software engineers, project inquiry, consultation",
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
