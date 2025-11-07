import type { Route } from "./+types/contactUs";
import BannerContactUs from "~/components/contact/bannerContactUs";
import ContactFormAndInfo from "~/components/contact/contactFormAndInfo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us - Get In Touch With Weblaud" },
    {
      name: "description",
      content:
        "Ready to start your digital transformation? Contact Weblaud today. Reach out to our team for inquiries, consultations, or project discussions.",
    },
    {
      name: "keywords",
      content:
        "contact us, get in touch, web development inquiry, digital services, consultation",
    },
    { name: "og:title", content: "Contact Us - Get In Touch With Weblaud" },
    {
      name: "og:description",
      content:
        "Contact Weblaud for your next digital project. Our team is ready to help transform your ideas into reality.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Contact Weblaud - Let's Work Together" },
    {
      name: "twitter:description",
      content:
        "Reach out to Weblaud to discuss your digital transformation needs and get expert solutions.",
    },
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
