import NavBar from "~/components/navBar";
import Footer from "~/components/footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
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
                  3. How We Use Your Information
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
                  4. Data Security
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
                  5. Contact Us
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
      <Footer />
    </div>
  );
}
